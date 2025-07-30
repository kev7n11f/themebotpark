// API configuration and utilities
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (Vercel serverless functions)
  : 'http://localhost:3001'; // Local development server

export const api = {
  // Helper function to make API calls with consistent error handling
  async call(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed to ${endpoint}:`, error);
      throw error;
    }
  },

  // Specific API methods
  async login(email, password) {
    return this.call('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        email,
        password
      })
    });
  },

  async register(email, password, name) {
    return this.call('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'register',
        email,
        password,
        name
      })
    });
  },

  async verifyToken(token) {
    return this.call('/api/auth', {
      method: 'POST',
      body: JSON.stringify({
        action: 'verify-token',
        token
      })
    });
  },

  async sendChatMessage(mode, message, messages = [], userId = '') {
    return this.call('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        mode,
        message,
        messages,
        userId
      })
    });
  },

  async createStripeSession(priceId, successUrl, cancelUrl) {
    return this.call('/api/stripe', {
      method: 'POST',
      body: JSON.stringify({
        priceId,
        successUrl,
        cancelUrl
      })
    });
  },

  async sendContactMessage(name, email, subject, message) {
    return this.call('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        subject,
        message
      })
    });
  }
};

export default api;
