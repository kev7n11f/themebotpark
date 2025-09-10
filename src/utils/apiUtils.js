/**
 * Enhanced API utilities with retry logic, circuit breakers, and fallbacks
 */

// Circuit breaker implementation
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, monitor = 2000) {
    this.threshold = threshold; // failure threshold
    this.timeout = timeout; // timeout period
    this.monitor = monitor; // health check interval
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
    this.healthCheckInterval = null;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        this.state = 'HALF_OPEN';
        this.failures = 0;
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
    this.stopHealthCheck();
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      this.startHealthCheck();
    }
  }

  startHealthCheck() {
    if (this.healthCheckInterval) return;
    
    this.healthCheckInterval = setInterval(() => {
      if (Date.now() >= this.nextAttempt && this.state === 'OPEN') {
        this.state = 'HALF_OPEN';
      }
    }, this.monitor);
  }

  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      threshold: this.threshold,
      nextAttempt: this.nextAttempt
    };
  }
}

// Enhanced fetch with retry logic and exponential backoff
async function fetchWithRetry(url, options = {}, retries = 3) {
  const {
    timeout = url.includes('/auth') ? 30000 : 10000, // 30s for auth, 10s for others
    retryDelay = 1000,
    retryMultiplier = 2,
    maxRetryDelay = 30000,
    ...fetchOptions
  } = options;

  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      // Add timeout to the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`Request timeout after ${timeout}ms for ${url}`);
        controller.abort();
      }, timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // For auth endpoints, always return the response (don't throw) so we can get the error message
        if (url.includes('/auth')) {
          return response; // Return the response so we can get the error message from JSON
        }
        
        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          return response; // Return response to handle error properly
        }
        
        // Retry on 5xx errors (server errors) and network errors
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Provide better error messages for timeout/abort
      if (error.name === 'AbortError') {
        lastError = new Error(`Request timeout after ${timeout}ms. Please try again.`);
      }
      
      // Don't retry on abort (timeout) or 4xx errors
      if (error.name === 'AbortError' || 
          (error.message.includes('HTTP 4') && !error.message.includes('408'))) {
        throw lastError;
      }
      
      if (i < retries) {
        const delay = Math.min(
          retryDelay * Math.pow(retryMultiplier, i),
          maxRetryDelay
        );
        
        console.warn(`Request failed, retrying in ${delay}ms (attempt ${i + 1}/${retries}):`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// API configuration
// Use same-origin when not explicitly configured. In development, default to the local API server.
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? (process.env.REACT_APP_API_BASE_URL || '')
  : (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_LOCAL_API_BASE_URL || 'http://localhost:3016');

// Circuit breakers for different API endpoints
const circuitBreakers = {
  chat: new CircuitBreaker(3, 30000, 5000),
  auth: new CircuitBreaker(5, 60000, 10000),
  general: new CircuitBreaker(5, 60000, 10000)
};

// Enhanced API utilities
export const api = {
  // Helper function to make API calls with comprehensive error handling
  async call(endpoint, options = {}) {
    const base = API_BASE_URL || '';
    const url = `${base}${endpoint}`;
    const circuitBreaker = this.getCircuitBreaker(endpoint);
    
    try {
      const response = await circuitBreaker.call(() => 
        fetchWithRetry(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
          ...options
        })
      );

      // Handle different content types
      const contentType = response.headers.get('content-type');
      
      // Handle HTTP error responses (4xx, 5xx) that contain JSON error messages
      if (!response.ok) {
        let errorData;
        try {
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            const errorText = await response.text();
            errorData = { error: errorText };
          }
        } catch (parseError) {
          // If we can't parse the error response, create a generic error
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        return {
          success: false,
          error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          ...errorData
        };
      }
      
      // Handle successful responses
      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        // Ensure we always have a success flag for successful responses
        if (jsonData && typeof jsonData === 'object' && !Object.prototype.hasOwnProperty.call(jsonData, 'success')) {
          jsonData.success = true;
        }
        return jsonData;
      } else {
        return await response.text();
      }
    } catch (error) {
      // Enhanced error handling with fallbacks
      return this.handleError(error, endpoint, options);
    }
  },

  // Get appropriate circuit breaker for endpoint
  getCircuitBreaker(endpoint) {
    if (endpoint.includes('/chat') || endpoint.includes('/api/chat')) {
      return circuitBreakers.chat;
    } else if (endpoint.includes('/auth') || endpoint.includes('/api/auth')) {
      return circuitBreakers.auth;
    } else {
      return circuitBreakers.general;
    }
  },

  // Enhanced error handling with fallbacks
  async handleError(originalError, endpoint, options) {
    console.error(`API call failed for ${endpoint}:`, originalError);
    
    // Track errors for analytics
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('API Error', {
        endpoint,
        error: originalError.message,
        timestamp: new Date().toISOString()
      });
    }

    // Handle timeout errors specifically
    if (originalError.message.includes('timeout') || originalError.name === 'AbortError') {
      if (endpoint.includes('/auth')) {
        return {
          success: false,
          error: 'Registration is taking longer than expected. Please check your internet connection and try again.',
          status: 408,
          endpoint: endpoint,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Provide fallback responses for critical endpoints
    if (endpoint.includes('/chat') && originalError.message.includes('Circuit breaker')) {
      return {
        error: 'Service temporarily unavailable. Please try again in a few minutes.',
        fallback: true,
        response: "I'm currently experiencing some technical difficulties. Please try refreshing the page or check back in a few minutes."
      };
    }

    if (endpoint.includes('/auth') && originalError.message.includes('Circuit breaker')) {
      return {
        error: 'Authentication service temporarily unavailable.',
        fallback: true
      };
    }

    // Default error response - return error object instead of throwing
    return {
      success: false,
      error: originalError.message || 'Network error occurred',
      status: originalError.status || 500,
      endpoint: endpoint,
      timestamp: new Date().toISOString()
    };
  },

  // Specific methods for common operations
  async get(endpoint, options = {}) {
    return this.call(endpoint, { method: 'GET', ...options });
  },

  async post(endpoint, data, options = {}) {
    const result = await this.call(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
    return result;
  },

  async put(endpoint, data, options = {}) {
    return this.call(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  },

  async delete(endpoint, options = {}) {
    return this.call(endpoint, { method: 'DELETE', ...options });
  },

  // Health check utility
  async healthCheck() {
    try {
      const response = await this.get('/health', { timeout: 5000 });
      return { status: 'healthy', ...response };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  // Get circuit breaker states for monitoring
  getCircuitBreakerStates() {
    return Object.keys(circuitBreakers).reduce((acc, key) => {
      acc[key] = circuitBreakers[key].getState();
      return acc;
    }, {});
  }
};

// Offline detection and handling
export const offlineHandler = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  callbacks: new Set(),

  init() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyCallbacks('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyCallbacks('offline');
    });

    // Periodic connectivity check
    setInterval(async () => {
      if (this.isOnline) {
        try {
          await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache', timeout: 5000 });
        } catch (error) {
          this.isOnline = false;
          this.notifyCallbacks('offline');
        }
      }
    }, 30000); // Check every 30 seconds
  },

  onStatusChange(callback) {
    if (!this.callbacks) {
      this.callbacks = new Set();
    }
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  },

  notifyCallbacks(status) {
    this.callbacks.forEach(callback => {
      try {
        callback(status, this.isOnline);
      } catch (error) {
        console.error('Error in offline handler callback:', error);
      }
    });
  }
};

// Request queue for offline scenarios
export const requestQueue = {
  queue: [],
  
  add(request) {
    this.queue.push({
      ...request,
      timestamp: Date.now()
    });
    
    // Store in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('api-queue', JSON.stringify(this.queue));
      } catch (error) {
        console.warn('Could not persist request queue:', error);
      }
    }
  },

  process() {
    if (!offlineHandler.isOnline || this.queue.length === 0) {
      return;
    }

    const requests = [...this.queue];
    this.queue = [];
    
    requests.forEach(async (request) => {
      try {
        await api.call(request.endpoint, request.options);
      } catch (error) {
        console.error('Failed to process queued request:', error);
        // Re-queue if it's a temporary error
        if (error.status >= 500 || error.message.includes('timeout')) {
          this.add(request);
        }
      }
    });

    // Update localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('api-queue', JSON.stringify(this.queue));
      } catch (error) {
        console.warn('Could not update request queue:', error);
      }
    }
  },

  init() {
    // Load persisted queue
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('api-queue');
        if (stored) {
          this.queue = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Could not load persisted request queue:', error);
      }
    }

    // Process queue when coming online
    offlineHandler.onStatusChange((status) => {
      if (status === 'online') {
        setTimeout(() => this.process(), 1000);
      }
    });
  }
};

// Initialize offline handling and request queue
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  try {
    offlineHandler.init();
    requestQueue.init();
  } catch (error) {
    console.warn('Failed to initialize offline handlers:', error);
  }
}

export default api;