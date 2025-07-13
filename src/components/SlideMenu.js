
import React, { useEffect, useState } from 'react';

export default function SlideMenu() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { threshold: 0.5 }
    );
    document.querySelectorAll('.bot-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
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
