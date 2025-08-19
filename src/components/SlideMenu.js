
import React, { useEffect, useState } from 'react';

export default function SlideMenu() {
  const [active, setActive] = useState('');

  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    try {
      // Check if IntersectionObserver is available
      if (!window.IntersectionObserver) {
        console.warn('IntersectionObserver not available');
        return;
      }

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id) {
              setActive(entry.target.id);
            }
          });
        }, 
        { 
          threshold: 0.5,
          rootMargin: '0px'
        }
      );

      // Wait for DOM to be ready and elements to exist
      const observeElements = () => {
        const elements = document.querySelectorAll('.bot-section');
        if (elements && elements.length > 0) {
          elements.forEach(el => {
            if (el && typeof observer.observe === 'function') {
              observer.observe(el);
            }
          });
        }
      };

      // Observe elements after a short delay to ensure DOM is ready
      const timeoutId = setTimeout(observeElements, 100);

      return () => {
        clearTimeout(timeoutId);
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
        }
      };
    } catch (error) {
      console.warn('SlideMenu initialization failed:', error);
    }
  }, []);

  return (
    <nav className="slide-menu">
      <ul>
        <li><a href="#rainmaker" className={active === 'rainmaker' ? 'active' : ''}>🌧️</a></li>
        <li><a href="#heartsync" className={active === 'heartsync' ? 'active' : ''}>💓</a></li>
        <li><a href="#fixitfrank" className={active === 'fixitfrank' ? 'active' : ''}>🛠️</a></li>
        <li><a href="#tellitlikeitis" className={active === 'tellitlikeitis' ? 'active' : ''}>🧨</a></li>
      </ul>
    </nav>
  );
}
