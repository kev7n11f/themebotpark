import React, { useState, useEffect } from 'react';

const ResponsiveTest = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Safety check for window object
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    try {
      // Initialize screen size
      setScreenSize({
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      });

      const handleResize = () => {
        if (window.innerWidth && window.innerHeight) {
          setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight
          });
        }
      };

      const checkTouchDevice = () => {
        const hasTouch = (
          ('ontouchstart' in window) ||
          (navigator?.maxTouchPoints > 0) ||
          (navigator?.msMaxTouchPoints > 0)
        );
        setIsTouchDevice(hasTouch);
      };

      window.addEventListener('resize', handleResize);
      checkTouchDevice();

      return () => {
        if (window.removeEventListener) {
          window.removeEventListener('resize', handleResize);
        }
      };
    } catch (error) {
      console.warn('ResponsiveTest initialization failed:', error);
    }
  }, []);

  const getDeviceType = () => {
    if (!screenSize.width) return 'Unknown';
    if (screenSize.width <= 480) return 'Mobile (Small)';
    if (screenSize.width <= 768) return 'Mobile (Large)';
    if (screenSize.width <= 1024) return 'Tablet';
    if (screenSize.width <= 1440) return 'Desktop';
    return 'Large Desktop';
  };

  const getBreakpoint = () => {
    if (!screenSize.width) return 'Loading...';
    if (screenSize.width <= 480) return '≤480px';
    if (screenSize.width <= 768) return '481-768px';
    if (screenSize.width <= 1024) return '769-1024px';
    if (screenSize.width <= 1440) return '1025-1440px';
    return '>1440px';
  };

  // Only show in development mode and when mounted
  if (process.env.NODE_ENV !== 'development' || !mounted || !screenSize.width) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: 'var(--card-bg)',
      border: '2px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-sm)',
      fontSize: '0.75rem',
      zIndex: 9999,
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'monospace',
      minWidth: '200px'
    }}>
      <div><strong>Device:</strong> {getDeviceType()}</div>
      <div><strong>Size:</strong> {screenSize.width} × {screenSize.height}px</div>
      <div><strong>Breakpoint:</strong> {getBreakpoint()}</div>
      <div><strong>Touch:</strong> {isTouchDevice ? 'Yes' : 'No'}</div>
      <div><strong>Orientation:</strong> {screenSize.width > screenSize.height ? 'Landscape' : 'Portrait'}</div>
    </div>
  );
};

export default ResponsiveTest;
