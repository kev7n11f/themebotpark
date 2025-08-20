// Import enhanced API utilities
import { api as enhancedApi, API_BASE_URL, offlineHandler, requestQueue } from './apiUtils';

// Re-export enhanced API utilities
export { 
  API_BASE_URL, 
  offlineHandler, 
  requestQueue 
};

// Main enhanced API
export const api = enhancedApi;

// Keep backward compatibility with existing specific methods
export const apiLegacy = {
  async login(email, password) {
    return enhancedApi.post('/api/auth', {
      action: 'login',
      email,
      password
    });
  },

  async register(email, password, name) {
    return enhancedApi.post('/api/auth', {
      action: 'register',
      email,
      password,
      name
    });
  },

  async verifyToken(token) {
    return enhancedApi.post('/api/auth', {
      action: 'verify-token',
      token
    });
  },

  async sendChatMessage(mode, message, messages = [], userId = '') {
    return enhancedApi.post('/api/chat', {
      mode,
      message,
      messages,
      userId
    });
  },

  async createStripeSession(priceId, successUrl, cancelUrl, plan = undefined) {
    // Prefer explicit priceId; if not provided, allow plan mapping on server
    const payload = { successUrl, cancelUrl };
    if (priceId) payload.priceId = priceId;
    if (!priceId && plan) payload.plan = plan;
    return enhancedApi.post('/api/stripe', payload);
  },

  async sendContactMessage(name, email, subject, message) {
    return enhancedApi.post('/api/contact', {
      name,
      email,
      subject,
      message
    });
  }
};

// For backward compatibility, also export as default
export default api;
