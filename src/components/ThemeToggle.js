import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Safety check for window and localStorage
    if (typeof window === 'undefined') return;
    
    try {
      // Check for saved theme preference or default to system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (systemPrefersDark) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (error) {
      console.warn('Theme initialization failed:', error);
      setTheme('light');
      if (document?.documentElement) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      
      if (document?.documentElement) {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      
      if (localStorage) {
        localStorage.setItem('theme', newTheme);
      }
    } catch (error) {
      console.warn('Theme toggle failed:', error);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Loading theme toggle">
        ⚡
      </button>
    );
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
