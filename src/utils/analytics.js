// Performance monitoring and analytics utilities for ThemeBotPark

// Web Vitals monitoring
export const measureWebVitals = () => {
  if ('performance' in window && 'PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'LCP',
            value: Math.round(lastEntry.startTime),
            custom_map: { 'metric_value': lastEntry.startTime }
          });
        }
        
        console.log('ThemeBotPark LCP:', Math.round(lastEntry.startTime));
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fid = entry.processingStart - entry.startTime;
          
          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round(fid),
              custom_map: { 'metric_value': fid }
            });
          }
          
          console.log('ThemeBotPark FID:', Math.round(fid));
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'CLS',
            value: Math.round(clsValue * 1000),
            custom_map: { 'metric_value': clsValue }
          });
        }
        
        console.log('ThemeBotPark CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('ThemeBotPark: Web Vitals monitoring not supported:', error);
    }
  }
};

// Track user interactions
export const trackInteraction = (action, category = 'User Interaction', label = '') => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: 1
    });
  }
  
  // Also send to custom analytics if available
  if (window.customAnalytics) {
    window.customAnalytics.track(action, {
      category,
      label,
      timestamp: Date.now()
    });
  }
  
  console.log(`ThemeBotPark Analytics: ${category} - ${action}`, label);
};

// Track page views
export const trackPageView = (page, title = '') => {
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: page
    });
  }
  
  console.log(`ThemeBotPark Analytics: Page view - ${page}`);
};

// Track errors
export const trackError = (error, context = '') => {
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message || error,
      fatal: false,
      custom_map: { 'error_context': context }
    });
  }
  
  console.error(`ThemeBotPark Error [${context}]:`, error);
};

// Track theme changes
export const trackThemeChange = (theme) => {
  trackInteraction('theme_change', 'Theme', theme);
};

// Track bot interactions
export const trackBotInteraction = (botName, action) => {
  trackInteraction(action, 'Bot Interaction', botName);
};

// Performance budget monitoring
export const monitorPerformanceBudget = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      
      // Set performance budgets (in milliseconds)
      const budgets = {
        loadTime: 3000, // 3 seconds
        domContentLoaded: 1500, // 1.5 seconds
        firstPaint: 1000 // 1 second
      };
      
      // Check budgets
      if (loadTime > budgets.loadTime) {
        trackError(`Load time exceeded budget: ${loadTime}ms > ${budgets.loadTime}ms`, 'Performance Budget');
      }
      
      if (domContentLoaded > budgets.domContentLoaded) {
        trackError(`DOM load time exceeded budget: ${domContentLoaded}ms > ${budgets.domContentLoaded}ms`, 'Performance Budget');
      }
      
      console.log('ThemeBotPark Performance:', {
        loadTime: Math.round(loadTime),
        domContentLoaded: Math.round(domContentLoaded),
        budgetStatus: {
          loadTime: loadTime <= budgets.loadTime ? '✅' : '❌',
          domContentLoaded: domContentLoaded <= budgets.domContentLoaded ? '✅' : '❌'
        }
      });
    }
  }
};

// Initialize analytics
export const initializeAnalytics = () => {
  // Start monitoring
  measureWebVitals();
  monitorPerformanceBudget();
  
  // Track initial page load
  trackPageView(window.location.pathname);
  
  console.log('ThemeBotPark Analytics: Initialized successfully');
};
