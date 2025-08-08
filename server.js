const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();

// Load environment variables
require('dotenv').config();

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

// Enable CORS
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? (process.env.CORS_ORIGINS || 'https://themebotpark.vercel.app').split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Enable gzip compression
app.use(compression());

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoints
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: require('./package.json').version,
    checks: {
      server: 'ok',
      memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024 ? 'ok' : 'warning', // 500MB threshold
      openai: !!process.env.OPENAI_API_KEY ? 'configured' : 'missing'
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
    environment: process.env.NODE_ENV || 'development',
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
        status: !!process.env.OPENAI_API_KEY ? 'configured' : 'missing',
        configured: !!process.env.OPENAI_API_KEY
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

  if (!process.env.OPENAI_API_KEY) {
    detailed.status = 'degraded';
    detailed.issues = detailed.issues || [];
    detailed.issues.push('OpenAI API key not configured');
  }

  res.status(detailed.status === 'healthy' ? 200 : 503).json(detailed);
});

// Readiness check (for Kubernetes/Docker)
app.get('/ready', (req, res) => {
  // Check if the service is ready to accept requests
  const isReady = process.env.NODE_ENV === 'production' 
    ? !!process.env.OPENAI_API_KEY 
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

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
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
  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected error occurred'
    : err.message;
    
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message,
    errorId,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3001;

let server;

function startServer() {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ThemeBotPark server running on port ${PORT}`);
    console.log(`📊 Health check available at http://localhost:${PORT}/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📝 OpenAI configured: ${!!process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
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
if (process.env.NODE_ENV === 'production') {
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