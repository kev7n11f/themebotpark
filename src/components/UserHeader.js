import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import AuthModal from './AuthModal';

export default function UserHeader() {
  const { user, isAuthenticated, logout } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="user-header">
          <div className="auth-buttons">
            <button 
              className="btn btn-outline"
              onClick={() => handleAuthClick('login')}
            >
              Sign In
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => handleAuthClick('register')}
            >
              Sign Up
            </button>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="user-header">
        <div className="user-info">
          <div className="user-avatar">
            {user.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <span className={`user-subscription ${user.subscription}`}>
              {user.subscription === 'premium' ? '⭐ Premium' : '🆓 Free'}
            </span>
          </div>
          <button 
            className="user-menu-toggle"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            ⋮
          </button>
        </div>

        {showUserMenu && (
          <div className="user-menu">
            <div className="user-menu-item">
              <strong>{user.email}</strong>
            </div>
            <div className="user-menu-divider"></div>
            <button 
              className="user-menu-item button"
              onClick={() => window.location.href = '/dashboard'}
            >
              📊 My Dashboard
            </button>
            <button 
              className="user-menu-item button"
              onClick={() => window.location.href = '/dashboard'}
            >
              🎨 Creator Portal
            </button>
            {user.subscription === 'free' && (
              <button 
                className="user-menu-item button premium"
                onClick={() => setShowAuthModal(true)}
              >
                ⭐ Upgrade to Premium
              </button>
            )}
            <button 
              className="user-menu-item button"
              onClick={() => window.location.href = '/contact'}
            >
              💬 Contact Support
            </button>
            <div className="user-menu-divider"></div>
            <button 
              className="user-menu-item button logout"
              onClick={handleLogout}
            >
              🚪 Sign Out
            </button>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
}
