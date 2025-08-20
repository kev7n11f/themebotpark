const crypto = require('crypto');

const isProd = process.env.NODE_ENV === 'production';

// Helper to split CSV-like env vars
function splitCSV(val) {
  return (val || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

// Auto-generate dev JWT secret if missing (never in production)
if (!process.env.JWT_SECRET && !isProd) {
  process.env.JWT_SECRET = crypto.randomBytes(24).toString('hex');
  console.warn('[ENV] Generated ephemeral JWT_SECRET for development only. DO NOT use in production.');
}

// Only strictly require truly server-critical vars in production
const requiredInProd = [
  'JWT_SECRET'
];

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || process.env.PORT || '3001', 10),
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  serverUrl: process.env.SERVER_URL || 'http://localhost:3001',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  corsOrigins: splitCSV(process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001'),
  openAiKey: process.env.OPENAI_API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  bcryptRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimit: {
    windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  contactRateLimit: {
    windowMinutes: parseInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MINUTES || '15', 10),
    maxRequests: parseInt(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    prices: {
      basic: process.env.STRIPE_PRICE_BASIC,
      pro: process.env.STRIPE_PRICE_PRO,
      premium: process.env.STRIPE_PRICE_PREMIUM,
      // Support logical monthly/yearly aliases used by the client
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_YEARLY,
    },
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
  },
  email: {
    sendgridKey: process.env.SENDGRID_API_KEY,
    sendgridFrom: process.env.SENDGRID_FROM_EMAIL,
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    admin: process.env.ADMIN_EMAIL || 'admin@themebotpark.com'
  },
  databaseUrl: process.env.DATABASE_URL,
  sentryDsn: process.env.SENTRY_DSN
};

function assertEnv() {
  if (isProd) {
    const missing = requiredInProd.filter(k => !process.env[k]);
    if (missing.length) {
      console.error('[ENV] Missing required environment variables in production:', missing.join(', '));
      throw new Error('Missing required environment variables');
    }

    // Warn (don’t crash) for optional-but-recommended vars when serving SSR/SPA
    const warnIfMissing = ['OPENAI_API_KEY', 'STRIPE_SECRET_KEY', 'REACT_APP_API_BASE_URL', 'PUBLIC_URL', 'CORS_ORIGINS'];
    const warnMissing = warnIfMissing.filter(k => !process.env[k]);
    if (warnMissing.length) {
      console.warn('[ENV] Optional variables not set:', warnMissing.join(', '));
    }
  }
}

module.exports = { env, assertEnv, isProd };