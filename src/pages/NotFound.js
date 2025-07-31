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
        background: 'linear-gradient(135deg, #4A9EFF 0%, #7B61FF 100%)',
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
        color: 'var(--text-primary)'
      }}>
        Page Not Found
      </h1>
      
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        color: 'var(--text-secondary)',
        maxWidth: '500px'
      }}>
        Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/" 
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, #4A9EFF 0%, #7B61FF 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          🏠 Go Home
        </Link>
        
        <Link 
          to="/chat" 
          className="btn btn-secondary"
          style={{
            background: 'transparent',
            color: 'var(--primary-color)',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            border: '2px solid var(--primary-color)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--primary-color)';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--primary-color)';
          }}
        >
          💬 Try Chat
        </Link>
      </div>
      
      <div style={{ 
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'var(--card-bg)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          🤖 Meet Our AI Bots
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #4A9EFF20 0%, #7B61FF20 100%)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            🌧️ RainMaker
          </span>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #4A9EFF20 0%, #7B61FF20 100%)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            💓 HeartSync
          </span>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #4A9EFF20 0%, #7B61FF20 100%)',
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            🛠️ FixItFrank
          </span>
          <span style={{ 
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #4A9EFF20 0%, #7B61FF20 100%)',
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
