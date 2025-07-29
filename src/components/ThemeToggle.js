import React, { useState, useEffect } from 'react';
import { trackThemeChange } from '../utils/analytics';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // Only run theme logic on client side to avoid SSR issues
    if (typeof window !== 'undefined') {
      try {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme = 'light';
        
        if (savedTheme) {
          initialTheme = savedTheme;
        } else if (systemPrefersDark) {
          initialTheme = 'dark';
        }
        
        setTheme(initialTheme);
        
        // Safely set the theme attribute
        if (document && document.documentElement) {
          document.documentElement.setAttribute('data-theme', initialTheme);
        }
      } catch (error) {
        console.warn('Theme toggle initialization error:', error);
        // Fallback to light theme if there are any issues
        setTheme('light');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      
      // Safely update DOM and localStorage
      if (document && document.documentElement) {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      
      if (localStorage) {
        localStorage.setItem('theme', newTheme);
      }

      // Track the theme change event
      trackThemeChange(newTheme);
    } catch (error) {
      console.warn('Theme toggle error:', error);
    }
  };

  // Don't render on server side to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
