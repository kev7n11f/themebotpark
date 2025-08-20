import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontSize: '6rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        404
      </div>
      
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        color: 'var(--primary-text)'
      }}>
        Page Not Found
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        color: 'var(--secondary-text)',
        maxWidth: '500px'
      }}>
        Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/" 
          className="btn btn-primary"
          style={{
            textDecoration: 'none'
          }}
        >
          🏠 Go Home
        </Link>
        
        <Link 
          to="/chat" 
          className="btn btn-secondary"
          style={{
            textDecoration: 'none'
          }}
        >
          💬 Try Chat
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-text)' }}>
          🤖 Meet Our AI Bots
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'var(--surface-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-primary)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            🌧️ RainMaker
          </span>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'var(--surface-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-primary)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            💓 HeartSync
          </span>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'var(--surface-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-primary)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            🛠️ FixItFrank
          </span>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'var(--surface-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--accent-primary)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            🧨 TellItLikeItIs
          </span>
        </div>
      </div>
    </div>
  );
}
