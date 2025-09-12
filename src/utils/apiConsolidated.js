/**
 * Consolidated API utilities - Single source of truth for all API calls
 * Combines features from api.js and apiUtils.js with optimizations
 */

// Circuit breaker for resilient API calls
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failures = 0;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }

  async call(fn) {
    if (this.state === 'OPEN' && Date.now() < this.nextAttempt) {
      throw new Error('Circuit breaker is OPEN');
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
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Enhanced fetch with exponential backoff
async function fetchWithRetry(url, options = {}, retries = 2) {
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined
      });
      return response;
    } catch (error) {
      lastError = error;
      
      if (i < retries && !error.name === 'AbortError') {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '' 
  : 'http://localhost:5000';

// Circuit breakers for different endpoints
const circuitBreakers = {
  chat: new CircuitBreaker(3, 30000),
  auth: new CircuitBreaker(5, 60000),
  general: new CircuitBreaker(5, 60000)
};

// Consolidated API client
export const api = {
  // Core request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const breaker = this.getCircuitBreaker(endpoint);
    
    try {
      const response = await breaker.call(() => 
        fetchWithRetry(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          credentials: 'include',
          timeout: 15000,
          ...options
        })
      );

      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = contentType?.includes('application/json') 
            ? await response.json()
            : { error: await response.text() };
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        return {
          success: false,
          error: errorData.error || errorData.message || response.statusText,
          status: response.status,
          ...errorData
        };
      }
      
      const data = contentType?.includes('application/json') 
        ? await response.json() 
        : await response.text();
        
      return typeof data === 'object' && data !== null 
        ? { success: true, ...data }
        : { success: true, data };
        
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  },

  // HTTP method shortcuts
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  },

  // Authentication methods
  async login(email, password) {
    return this.post('/api/auth', { action: 'login', email, password });
  },

  async register(email, password, name) {
    return this.post('/api/auth', { action: 'register', email, password, name });
  },

  async verifyToken(token) {
    return this.post('/api/auth', { action: 'verify-token', token });
  },

  // Chat methods
  async sendChatMessage(mode, message, messages = [], userId = '') {
    const result = await this.post('/api/chat', { mode, message, messages, userId });
    
    // Fallback for chat failures
    if (!result.success && result.error?.includes('Circuit breaker')) {
      return {
        success: true,
        response: this.getChatFallback(mode, message),
        fallback: true
      };
    }
    
    return result;
  },

  // Stripe methods
  async createStripeSession(priceId, successUrl, cancelUrl, plan) {
    return this.post('/api/stripe', { priceId, successUrl, cancelUrl, plan });
  },

  // Contact methods
  async sendContactMessage(name, email, subject, message) {
    return this.post('/api/contact', { name, email, subject, message });
  },

  // Utility methods
  getCircuitBreaker(endpoint) {
    if (endpoint.includes('/chat')) return circuitBreakers.chat;
    if (endpoint.includes('/auth')) return circuitBreakers.auth;
    return circuitBreakers.general;
  },

  handleError(error, endpoint) {
    console.error(`API call failed for ${endpoint}:`, error);
    
    // Specific error handling
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timed out. Please check your connection and try again.',
        status: 408
      };
    }

    if (endpoint.includes('/chat') && error.message.includes('Circuit breaker')) {
      return {
        success: true,
        response: this.getChatFallback('', ''),
        fallback: true
      };
    }

    return {
      success: false,
      error: error.message || 'Network error occurred',
      status: error.status || 500
    };
  },

  getChatFallback(mode, input) {
    const tips = {
      RainMaker: "Focus on solving real problems people will pay for. 🌧️💰",
      HeartSync: "Authenticity starts with understanding your own patterns. 💓",
      FixItFrank: "Try the simplest solution first. 🛠️",
      TellItLikeItIs: "Face the issue head-on. 🧨",
      SafeSpace: "Every perspective has value. 🕊️",
      CreativeCanvas: "Innovation comes from curiosity. 🎨",
      WellnessWise: "Small steps lead to big changes. 🧘"
    };
    
    return tips[mode] || "I'm here to help when our connection improves!";
  },

  // Health check
  async healthCheck() {
    try {
      const response = await this.get('/health', { timeout: 5000 });
      return { status: 'healthy', ...response };
    } catch {
      return { status: 'unhealthy' };
    }
  }
};

export default api;