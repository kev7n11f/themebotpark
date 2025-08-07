import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import polyfills for better browser compatibility
import './utils/polyfills';

// Enhanced error handling
if (process.env.NODE_ENV === 'production') {
  // Override console methods in production to capture errors
  const originalError = console.error;
  console.error = (...args) => {
    // Send errors to monitoring service if available
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('JavaScript Error', {
        error: args[0],
        timestamp: new Date().toISOString()
      });
    }
    originalError.apply(console, args);
  };

  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

// Check for required browser features
const criticalFeatures = {
  localStorage: typeof Storage !== 'undefined',
  fetch: typeof fetch !== 'undefined',
  json: typeof JSON !== 'undefined'
};

const missingFeatures = Object.keys(criticalFeatures).filter(
  feature => !criticalFeatures[feature]
);

if (missingFeatures.length > 0) {
  document.body.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      z-index: 9999;
    ">
      <div style="
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 500px;
        margin: 1rem;
      ">
        <h2 style="color: #dc3545; margin-bottom: 1rem;">Browser Not Supported</h2>
        <p style="color: #6c757d; margin-bottom: 1.5rem;">
          Your browser doesn't support some features required by ThemeBotPark.
          Please update to a modern browser like Chrome, Firefox, Safari, or Edge.
        </p>
        <p style="color: #6c757d; font-size: 0.9rem;">
          Missing features: ${missingFeatures.join(', ')}
        </p>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}