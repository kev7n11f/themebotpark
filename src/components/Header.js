import React from 'react';
import UserHeader from './UserHeader';

export default function Header() {
  return (
    <nav className="main-nav" role="navigation" aria-label="Main Navigation">
      <div className="nav-brand" onClick={() => (window.location.href = '/') } style={{ cursor: 'pointer' }}>
        <h1>🤖 ThemeBotPark</h1>
      </div>
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <UserHeader />
      </div>
    </nav>
  );
}
