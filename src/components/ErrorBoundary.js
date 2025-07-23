import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--surface-bg, #f8f9fa)',
          color: 'var(--primary-text, #202124)',
          borderRadius: 'var(--radius-md, 12px)',
          margin: '2rem',
        }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error loading this component.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--accent-primary, #4a9eff)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm, 6px)',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
