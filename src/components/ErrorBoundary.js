import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Send error to analytics if available
    if (window.analytics && typeof window.analytics.track === 'function') {
      window.analytics.track('React Error Boundary', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    }

    // Try to recover from certain types of errors
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      console.log('Chunk load error detected, attempting to reload...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        retryCount: this.state.retryCount + 1 
      });
    } else {
      // After 3 retries, suggest page reload
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'var(--surface-bg, #f8f9fa)',
          color: 'var(--primary-text, #202124)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily: 'var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)'
        }}>
          <div style={{
            background: 'var(--card-bg, white)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg, 12px)',
            boxShadow: 'var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.16))',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '1rem',
            border: '1px solid var(--border-color, #dadce0)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
            <h2 style={{ 
              color: 'var(--accent-error, #ff4757)', 
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Something went wrong
            </h2>
            <p style={{ 
              color: 'var(--secondary-text, #5f6368)', 
              marginBottom: '1.5rem',
              lineHeight: 1.5
            }}>
              We're sorry, but there was an unexpected error. This might be a temporary issue.
            </p>
            
            {isDevelopment && this.state.error && (
              <details style={{
                marginBottom: '1.5rem',
                textAlign: 'left',
                background: 'var(--surface-bg, #f8f9fa)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm, 6px)',
                fontSize: '0.875rem',
                border: '1px solid var(--border-color, #dadce0)'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Error Details (Development)
                </summary>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.75rem',
                  color: 'var(--accent-error, #ff4757)'
                }}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {this.state.retryCount < 3 ? (
                <button 
                  onClick={this.handleRetry}
                  style={{
                    background: 'var(--accent-primary, #4a9eff)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 20px rgba(74, 158, 255, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Try Again ({this.state.retryCount}/3)
                </button>
              ) : (
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    background: 'var(--accent-secondary, #ff6b47)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  Reload Page
                </button>
              )}
              
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  background: 'transparent',
                  color: 'var(--primary-text, #202124)',
                  border: '1px solid var(--border-color, #dadce0)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md, 8px)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'var(--surface-bg, #f8f9fa)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                Go Home
              </button>
            </div>

            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--muted-text, #9aa0a6)', 
              marginTop: '1.5rem' 
            }}>
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
