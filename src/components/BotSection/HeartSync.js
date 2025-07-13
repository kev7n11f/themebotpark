import React from 'react';
import { chatMode } from '../../utils';

export default function HeartSync() {
  return (
    <section id="heartsync" className="bot-section">
      <h2>💓 HeartSync</h2>
      <p>Uncovers your deeper patterns in love, purpose, and personal growth.
      </p>
      <button onClick={() => chatMode('HeartSync')}>Try Chat</button>
    </section>
  );
}