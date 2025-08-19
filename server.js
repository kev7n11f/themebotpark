const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const app = express();

// Load environment variables and validate
require('dotenv').config();
const { env, assertEnv } = require('./config/env');
const { createCorsMiddleware } = require('./middleware/cors');

// Validate environment variables at startup
assertEnv();

// Basic security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://js.stripe.com"]
    }
  }
}));

// Request logging (conditional)
if (env.logLevel !== 'silent') {
  app.use(morgan('combined'));
}

// Enable CORS with centralized configuration
app.use(createCorsMiddleware());

// Enable gzip compression
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Rate limiting with configurable settings
const limiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.maxRequests
});
app.use('/api/', limiter);

// Health check endpoints
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: env.nodeEnv,
    version: require('./package.json').version,
    checks: {
      server: 'ok',
      memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024 ? 'ok' : 'warning', // 500MB threshold
      openai: env.openAiKey ? 'configured' : 'missing',
      stripe: env.stripe.secretKey ? 'configured' : 'missing',
      email: (env.email.sendgridKey || env.email.smtp.host) 
        ? 'configured' 
        : env.email.sendgridKey || env.email.smtp.host 
          ? 'partial' 
          : 'missing'
    }
  };

  // Overall health status
  const hasWarnings = Object.values(healthCheck.checks).some(status => status === 'warning' || status === 'error');
  if (hasWarnings) {
    healthCheck.status = 'degraded';
  }

  res.status(healthCheck.status === 'healthy' ? 200 : 503).json(healthCheck);
});

// Detailed health check for monitoring systems
app.get('/health/detailed', (req, res) => {
  const detailed = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'themebotpark-api',
    version: require('./package.json').version,
    environment: env.nodeEnv,
    uptime: {
      seconds: process.uptime(),
      human: Math.floor(process.uptime() / 3600) + 'h ' + Math.floor((process.uptime() % 3600) / 60) + 'm'
    },
    system: {
      memory: {
        ...process.memoryUsage(),
        usage_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        limit_mb: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      cpu: process.cpuUsage(),
      platform: process.platform,
      node_version: process.version
    },
    dependencies: {
      openai_api: {
        status: env.openAiKey ? 'configured' : 'missing',
        configured: Boolean(env.openAiKey)
      },
      stripe: {
        status: env.stripe.secretKey ? 'configured' : 'missing',
        configured: Boolean(env.stripe.secretKey),
        webhook_configured: Boolean(env.stripe.webhookSecret)
      },
      email: {
        status: (env.email.sendgridKey || env.email.smtp.host) ? 'configured' : 'missing',
        sendgrid: Boolean(env.email.sendgridKey),
        smtp: Boolean(env.email.smtp.host)
      },
      database: {
        status: 'not_applicable', // Add real DB check if needed
        type: 'none'
      }
    },
    endpoints: {
      chat: { status: 'available', path: '/api/chat' },
      auth: { status: 'available', path: '/api/auth' },
      stripe: { status: 'available', path: '/api/stripe' },
      contact: { status: 'available', path: '/api/contact' }
    }
  };

  // Check for issues
  const memoryUsageMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  if (memoryUsageMB > 500) {
    detailed.status = 'degraded';
    detailed.issues = detailed.issues || [];
    detailed.issues.push('High memory usage: ' + memoryUsageMB + 'MB');
  }

  if (!env.openAiKey) {
    detailed.status = 'degraded';
    detailed.issues = detailed.issues || [];
    detailed.issues.push('OpenAI API key not configured');
  }

  res.status(detailed.status === 'healthy' ? 200 : 503).json(detailed);
});

// Readiness check (for Kubernetes/Docker)
app.get('/ready', (req, res) => {
  // Check if the service is ready to accept requests
  const isReady = env.nodeEnv === 'production'
    ? Boolean(env.openAiKey)
    : true;

  if (isReady) {
    res.status(200).json({ 
      status: 'ready', 
      timestamp: new Date().toISOString(),
      message: 'Service is ready to accept requests' 
    });
  } else {
    res.status(503).json({ 
      status: 'not_ready', 
      timestamp: new Date().toISOString(),
      message: 'Service is not ready - missing required configuration' 
    });
  }
});

// Liveness check (for Kubernetes/Docker)
app.get('/alive', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    timestamp: new Date().toISOString(),
    pid: process.pid 
  });
});

// Metrics endpoint (basic implementation)
app.get('/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    memory_usage_bytes: process.memoryUsage().heapUsed,
    memory_total_bytes: process.memoryUsage().heapTotal,
    cpu_usage: process.cpuUsage(),
    active_handles: process._getActiveHandles().length,
    active_requests: process._getActiveRequests().length,
    platform: process.platform,
    node_version: process.version,
    pid: process.pid
  };

  res.status(200).json(metrics);
});

// API routes
app.use('/api/chat', require('./chat'));
app.use('/api/auth', require('./auth'));

// Add other API routes
app.use('/api/stripe', require('./stripe'));
app.use('/api/user', require('./user'));
app.use('/api/contact', require('./contact'));
app.use('/api/analytics', require('./analytics'));
app.use('/api/creator', require('./creator'));

// Stripe webhook (must be before JSON parsing middleware for raw body)
app.use('/', require('./stripe-webhook'));

// Serve React build in production
if (env.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', limiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

app.use((err, req, res, next) => {
  const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  console.error(`[${errorId}] Server Error:`, {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Don't leak error details in production
  const message = env.nodeEnv === 'production'
    ? 'An unexpected error occurred'
    : err.message;
    
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message,
    errorId,
    timestamp: new Date().toISOString(),
    ...(env.nodeEnv !== 'production' && { stack: err.stack })
  });
});

// Start server
const PORT = env.port;

let server;

function startServer() {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ThemeBotPark server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    console.log(`🔧 Environment: ${env.nodeEnv}`);
    console.log(`📝 OpenAI configured: ${env.openAiKey ? 'Yes' : 'No'}`);
    console.log(`💳 Stripe configured: ${env.stripe.secretKey ? 'Yes' : 'No'}`);
    console.log(`📧 Email configured: ${(env.email.sendgridKey || env.email.smtp.host) ? 'Yes' : 'No'}`);
  });

  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  return server;
}

// Graceful shutdown handling
function gracefulShutdown(signal) {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  if (server) {
    server.close((err) => {
      if (err) {
        console.error('❌ Error during server close:', err);
        process.exit(1);
      }
      
      console.log('✅ Server closed successfully');
      
      // Give some time for cleanup
      setTimeout(() => {
        console.log('👋 Shutdown complete');
        process.exit(0);
      }, 1000);
    });

    // Force close after 30 seconds
    setTimeout(() => {
      console.error('⚠️  Forcing shutdown after 30s timeout');
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
}

// Handle various shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  
  // Try to gracefully shutdown
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Don't exit immediately - log and continue
  // But in production, you might want to restart the process
  if (process.env.NODE_ENV === 'production') {
    gracefulShutdown('unhandledRejection');
  }
});

// Memory monitoring
if (env.nodeEnv === 'production') {
  setInterval(() => {
    const usage = process.memoryUsage();
    const usageMB = Math.round(usage.heapUsed / 1024 / 1024);
    
    if (usageMB > 750) { // 750MB threshold
      console.warn(`⚠️  High memory usage: ${usageMB}MB`);
    }
    
    if (usageMB > 1000) { // 1GB threshold - critical
      console.error(`🚨 Critical memory usage: ${usageMB}MB - consider restarting`);
    }
  }, 60000); // Check every minute
}

// Start the server
startServer();