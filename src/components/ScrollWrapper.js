import React from 'react';
export default function ScrollWrapper({ children }) {
  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      {children}
    </div>
  );
}