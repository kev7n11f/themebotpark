import React, { useState, useEffect } from 'react';
import { offlineHandler } from '../utils/apiUtils';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleStatusChange = (status, online) => {
      setIsOnline(online);
      
      if (!online) {
        setShowNotification(true);
      } else if (showNotification) {
        // Show "back online" notification briefly
        setTimeout(() => setShowNotification(false), 3000);
      }
    };

    // Add safety check for offlineHandler
    if (offlineHandler && typeof offlineHandler.onStatusChange === 'function') {
      const unsubscribe = offlineHandler.onStatusChange(handleStatusChange);
      return unsubscribe;
    }
  }, [showNotification]);

  if (!showNotification && isOnline) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: isOnline 
          ? 'var(--accent-success, #00d084)' 
          : 'var(--accent-warning, #ffb347)',
        color: 'white',
        padding: 'var(--space-md, 1rem) var(--space-lg, 1.5rem)',
        borderRadius: 'var(--radius-lg, 16px)',
        boxShadow: 'var(--shadow-lg, 0 8px 40px rgba(0,0,0,0.16))',
        zIndex: 1000,
        fontSize: '0.9rem',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm, 0.5rem)',
        maxWidth: '90vw',
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>
        {isOnline ? '✅' : '⚠️'}
      </span>
      
      <span>
        {isOnline 
          ? 'You\'re back online!' 
          : 'You\'re offline. Some features may not work properly.'
        }
      </span>
      
      {!isOnline && (
        <button
          onClick={() => setShowNotification(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            borderRadius: 'var(--radius-sm, 6px)',
            padding: 'var(--space-xs, 0.25rem) var(--space-sm, 0.5rem)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            marginLeft: 'var(--space-sm, 0.5rem)'
          }}
        >
          ✕
        </button>
      )}
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OfflineIndicator;