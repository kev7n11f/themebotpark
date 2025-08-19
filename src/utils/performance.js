/**
 * Performance monitoring and optimization utilities
 */

// Performance metrics collector
export class PerformanceMonitor {
  constructor() {
    this.metrics = [];
    this.observers = [];
    this.thresholds = {
      fcp: 1800, // First Contentful Paint
      lcp: 2500, // Largest Contentful Paint
      fid: 100,  // First Input Delay
      cls: 0.1,  // Cumulative Layout Shift
      ttfb: 800  // Time to First Byte
    };
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || !window.performance) return;

    // Observe Core Web Vitals
    this.observeWebVitals();
    
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor long tasks
    this.observeLongTasks();
  }

  observeWebVitals() {
    try {
      // First Contentful Paint
      if ('PerformanceObserver' in window) {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const fcpEntry = entryList.getEntries().find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.recordMetric('FCP', fcpEntry.startTime, fcpEntry.startTime <= this.thresholds.fcp);
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.recordMetric('LCP', lastEntry.startTime, lastEntry.startTime <= this.thresholds.lcp);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);

        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const fidEntry = entryList.getEntries()[0];
          if (fidEntry) {
            const fid = fidEntry.processingStart - fidEntry.startTime;
            this.recordMetric('FID', fid, fid <= this.thresholds.fid);
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);

        // Cumulative Layout Shift
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          });
          this.recordMetric('CLS', clsScore, clsScore <= this.thresholds.cls);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      }
    } catch (error) {
      console.warn('Web Vitals observation not supported:', error);
    }
  }

  observeNavigationTiming() {
    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = window.performance.timing;
          const ttfb = timing.responseStart - timing.navigationStart;
          const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
          const loadComplete = timing.loadEventEnd - timing.navigationStart;

          this.recordMetric('TTFB', ttfb, ttfb <= this.thresholds.ttfb);
          this.recordMetric('DOM_CONTENT_LOADED', domContentLoaded);
          this.recordMetric('LOAD_COMPLETE', loadComplete);
        }, 0);
      });
    }
  }

  observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach(entry => {
            const duration = entry.responseEnd - entry.startTime;
            const type = this.getResourceType(entry.name);
            
            this.recordMetric(`RESOURCE_${type.toUpperCase()}`, duration, undefined, {
              name: entry.name,
              size: entry.transferSize || entry.decodedBodySize,
              cached: entry.transferSize === 0
            });
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing observation not supported:', error);
      }
    }
  }

  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach(entry => {
            this.recordMetric('LONG_TASK', entry.duration, entry.duration <= 50, {
              startTime: entry.startTime,
              attribution: entry.attribution
            });
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task observation not supported:', error);
      }
    }
  }

  getResourceType(url) {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.includes('.woff') || url.includes('.ttf')) return 'font';
    return 'other';
  }

  recordMetric(name, value, isGood = true, metadata = {}) {
    const metric = {
      name,
      value,
      isGood,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata
    };

    this.metrics.push(metric);

    // Send to analytics if available
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('Performance Metric', metric);
    }

    // Log poor performance
    if (!isGood && value !== undefined) {
      console.warn(`Poor ${name} performance: ${value}ms (threshold: ${this.thresholds[name.toLowerCase()]}ms)`);
    }
  }

  getMetrics() {
    return [...this.metrics];
  }

  getMetricsSummary() {
    const summary = {};
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          total: 0,
          min: Infinity,
          max: -Infinity,
          good: 0,
          poor: 0
        };
      }
      
      const s = summary[metric.name];
      s.count++;
      if (typeof metric.value === 'number') {
        s.total += metric.value;
        s.min = Math.min(s.min, metric.value);
        s.max = Math.max(s.max, metric.value);
      }
      
      if (metric.isGood) {
        s.good++;
      } else {
        s.poor++;
      }
    });

    // Calculate averages
    Object.values(summary).forEach(s => {
      s.average = s.count > 0 ? s.total / s.count : 0;
      s.successRate = s.count > 0 ? (s.good / s.count) * 100 : 0;
    });

    return summary;
  }

  sendReport() {
    const summary = this.getMetricsSummary();
    
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('Performance Report', {
        summary,
        timestamp: Date.now(),
        sessionDuration: Date.now() - this.sessionStart
      });
    }

    return summary;
  }

  cleanup() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Error disconnecting observer:', error);
      }
    });
    this.observers = [];
  }
}

// Memory monitoring
export class MemoryMonitor {
  constructor() {
    this.measurements = [];
    this.interval = null;
  }

  start(intervalMs = 30000) {
    this.interval = setInterval(() => {
      this.measure();
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  measure() {
    if (!window.performance || !window.performance.memory) {
      return null;
    }

    const memory = window.performance.memory;
    const measurement = {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };

    this.measurements.push(measurement);

    // Keep only last 100 measurements
    if (this.measurements.length > 100) {
      this.measurements = this.measurements.slice(-100);
    }

    // Warn about high memory usage
    if (measurement.usagePercent > 80) {
      console.warn(`High memory usage detected: ${measurement.usagePercent.toFixed(1)}%`);
      
      if (window.analytics && typeof window.analytics.track === 'function') {
        window.analytics.track('High Memory Usage', measurement);
      }
    }

    return measurement;
  }

  getLatest() {
    return this.measurements[this.measurements.length - 1];
  }

  getHistory() {
    return [...this.measurements];
  }
}

// Bundle analyzer for production
export function analyzeBundlePerformance() {
  if (process.env.NODE_ENV !== 'production') return;

  const scripts = document.querySelectorAll('script[src]');
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  
  const bundleInfo = {
    scripts: Array.from(scripts).map(script => ({
      src: script.src,
      async: script.async,
      defer: script.defer
    })),
    stylesheets: Array.from(stylesheets).map(link => ({
      href: link.href,
      media: link.media
    })),
    totalScripts: scripts.length,
    totalStylesheets: stylesheets.length
  };

  if (window.analytics && typeof window.analytics.track === 'function') {
    window.analytics.track('Bundle Analysis', bundleInfo);
  }

  return bundleInfo;
}

// Intersection Observer for lazy loading optimization
export function createLazyLoadObserver(callback, options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0
  };

  if (!window.IntersectionObserver) {
    // Fallback for older browsers - load everything immediately
    return {
      observe: (element) => callback([{ target: element, isIntersecting: true }]),
      unobserve: () => {},
      disconnect: () => {}
    };
  }

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// Page visibility API for performance optimization
export class VisibilityManager {
  constructor() {
    this.callbacks = {
      visible: new Set(),
      hidden: new Set()
    };
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      const callbacks = this.callbacks[isVisible ? 'visible' : 'hidden'];
      
      callbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Error in visibility callback:', error);
        }
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  onVisible(callback) {
    if (!this.callbacks || !this.callbacks.visible) {
      this.callbacks = {
        visible: new Set(),
        hidden: new Set()
      };
    }
    this.callbacks.visible.add(callback);
    return () => this.callbacks.visible.delete(callback);
  }

  onHidden(callback) {
    if (!this.callbacks || !this.callbacks.hidden) {
      this.callbacks = {
        visible: new Set(),
        hidden: new Set()
      };
    }
    this.callbacks.hidden.add(callback);
    return () => this.callbacks.hidden.delete(callback);
  }

  isVisible() {
    return typeof document !== 'undefined' ? !document.hidden : true;
  }
}

// Initialize performance monitoring
let performanceMonitor = null;
let memoryMonitor = null;
let visibilityManager = null;

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  try {
    performanceMonitor = new PerformanceMonitor();
    memoryMonitor = new MemoryMonitor();
    visibilityManager = new VisibilityManager();

    // Start memory monitoring in production
    if (process.env.NODE_ENV === 'production') {
      memoryMonitor.start();
    }

    // Send performance report before page unload
    window.addEventListener('beforeunload', () => {
      if (performanceMonitor) {
        performanceMonitor.sendReport();
        performanceMonitor.cleanup();
      }
      if (memoryMonitor) {
        memoryMonitor.stop();
      }
    });

    // Analyze bundle on load
    window.addEventListener('load', () => {
      setTimeout(analyzeBundlePerformance, 2000);
    });
  } catch (error) {
    console.warn('Failed to initialize performance monitoring:', error);
  }
}

export {
  performanceMonitor,
  memoryMonitor,
  visibilityManager
};