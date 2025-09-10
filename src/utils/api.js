// Import enhanced API utilities
import { api as enhancedApi, API_BASE_URL, offlineHandler, requestQueue } from './apiUtils';

// Re-export enhanced API utilities
export { 
  API_BASE_URL, 
  offlineHandler, 
  requestQueue 
};

// Merge enhanced API with legacy convenience methods
export const api = {
  ...enhancedApi,

  async login(email, password) {
    return enhancedApi.post('/api/auth', {
      action: 'login',
      email,
      password
    });
  },

  async register(email, password, name) {
    console.log('api.js: Starting registration request for:', email);
    try {
      const result = await enhancedApi.post('/api/auth', {
        action: 'register',
        email,
        password,
        name
      });
      console.log('api.js: Registration response received:', {
        success: result.success,
        error: result.error,
        status: result.status,
        hasToken: !!result.token
      });
      return result;
    } catch (error) {
      console.error('api.js: Registration request failed:', error);
      return {
        success: false,
        error: error.message || 'Registration request failed'
      };
    }
  },

  async verifyToken(token) {
    return enhancedApi.post('/api/auth', {
      action: 'verify-token',
      token
    });
  },

  async sendChatMessage(mode, message, messages = [], userId = '') {
    try {
      return await enhancedApi.post('/api/chat', {
        mode,
        message,
        messages,
        userId
      });
    } catch (err) {
      // Local fallback if API is unavailable
      const fallback = getLocalChatFallback(mode, message);
      return { response: fallback, fallback: true, error: err?.message || 'offline' };
    }
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

// Lightweight local fallback generator mirroring server behavior
function getLocalChatFallback(botName, input) {
  const tips = {
    RainMaker: "Here's a quick business tip: Focus on solving real problems people will pay for. 🌧️💰",
    HeartSync: "Authenticity starts with understanding your own needs and patterns. 💓",
    FixItFrank: "Try the simplest path first, then narrow down variables one by one. 🛠️",
    TellItLikeItIs: "Face the issue head-on. Clarity beats comfort. 🧨"
  };
  const lead = tips[botName] || 'I\'m here to help. Ask me anything!';
  const echo = input ? `\n\nYou said: "${String(input).slice(0, 240)}"` : '';
  return `${lead}${echo}`;
}

// For backward compatibility, also export as default
export default api;
