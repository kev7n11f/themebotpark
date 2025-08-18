/**
 * Error Reporting and Console Monitoring Utility
 */

// Store original console methods
const originalConsole = {
  error: console.error,
  warn: console.warn,
  log: console.log
};

// Enhanced error reporting
export class ErrorReporter {
  constructor() {
    this.errors = [];
    this.setupGlobalErrorHandlers();
    this.interceptConsole();
  }

  setupGlobalErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack || event.error
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  interceptConsole() {
    console.error = (...args) => {
      this.logError('Console Error', args);
      originalConsole.error.apply(console, args);
    };

    console.warn = (...args) => {
      this.logWarning('Console Warning', args);
      originalConsole.warn.apply(console, args);
    };
  }

  logError(type, details) {
    const errorEntry = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(errorEntry);

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.analytics) {
      try {
        window.analytics.track('Error Occurred', errorEntry);
      } catch (e) {
        originalConsole.error('Failed to send error to analytics:', e);
      }
    }
  }

  logWarning(type, details) {
    const warningEntry = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Only track significant warnings in production
    if (process.env.NODE_ENV === 'production') {
      const warningString = String(details[0] || '');
      const significantWarnings = [
        'React',
        'Failed to fetch',
        'Network',
        'API',
        'Auth'
      ];

      if (significantWarnings.some(keyword => warningString.includes(keyword))) {
        try {
          window.analytics?.track('Warning Occurred', warningEntry);
        } catch (e) {
          // Fail silently
        }
      }
    }
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorSummary() {
    const summary = {
      total: this.errors.length,
      byType: {},
      recent: this.errors.slice(-5)
    };

    this.errors.forEach(error => {
      summary.byType[error.type] = (summary.byType[error.type] || 0) + 1;
    });

    return summary;
  }
}

// Global instance
export const errorReporter = new ErrorReporter();

// Browser feature detection (this might be what you're seeing)
export const browserFeatures = {
  fetch: !!window.fetch,
  intersectionObserver: !!window.IntersectionObserver,
  localStorage: (() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  })(),
  promise: !!window.Promise,
  resizeObserver: !!window.ResizeObserver,
  serviceWorker: 'serviceWorker' in navigator,
  webGL: (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  })()
};

// Only log browser features in development
if (process.env.NODE_ENV === 'development') {
  console.log('Browser Features:', browserFeatures);
}

export default errorReporter;
