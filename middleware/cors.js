const cors = require('cors');
const { env } = require('../config/env');

function createCorsMiddleware() {
  const allowedOrigins = env.corsOrigins;

  return cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
}

module.exports = { createCorsMiddleware };