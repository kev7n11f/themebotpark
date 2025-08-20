import React, { useState, useEffect } from 'react';

/**
 * SafeComponentWrapper ensures all browser APIs and utilities are properly 
 * initialized before rendering child components
 */
const SafeComponentWrapper = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check required browser APIs
        const requiredAPIs = {
          localStorage: typeof Storage !== 'undefined',
          sessionStorage: typeof Storage !== 'undefined',
          fetch: typeof fetch !== 'undefined',
          JSON: typeof JSON !== 'undefined',
          document: typeof document !== 'undefined',
          window: typeof window !== 'undefined'
        };

        const missingAPIs = Object.keys(requiredAPIs).filter(
          api => !requiredAPIs[api]
        );

        if (missingAPIs.length > 0) {
          throw new Error(`Missing required browser APIs: ${missingAPIs.join(', ')}`);
        }

        // Initialize DOM-dependent utilities
        if (typeof document !== 'undefined') {
          // Ensure document is ready
          if (document.readyState === 'loading') {
            await new Promise(resolve => {
              document.addEventListener('DOMContentLoaded', resolve, { once: true });
            });
          }
        }

        // Small delay to ensure all initialization is complete
        await new Promise(resolve => setTimeout(resolve, 50));
        
        setIsReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitError(error);
      }
    };

    initializeApp();
  }, []);

  if (initError) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--primary-bg, #121316)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        zIndex: 9999
      }}>
        <div style={{
          background: 'var(--card-bg, #17181c)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '1rem',
          border: '1px solid var(--border-color, #262a33)'
        }}>
          <h2 style={{ color: 'var(--accent-error, #ff4757)', marginBottom: '1rem' }}>Initialization Error</h2>
          <p style={{ color: 'var(--secondary-text, #b3b7c2)', marginBottom: '1.5rem' }}>
            Unable to initialize the application. Please refresh the page or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--accent-primary, #4a9eff)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--primary-bg, #121316)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'var(--secondary-text, #b3b7c2)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--surface-bg, #1b1d22)',
            borderTop: '4px solid var(--accent-primary, #4a9eff)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Initializing ThemeBotPark...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  return children;
};

export default SafeComponentWrapper;
