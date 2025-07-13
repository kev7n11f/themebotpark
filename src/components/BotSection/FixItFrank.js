import React from 'react';
import { chatMode } from '../../utils';

export default function FixItFrank() {
  return (
    <section id="fixitfrank" className="bot-section">
      <h2>🛠️ FixItFrank</h2>
      <p>Troubleshoots technical problems with sass and skill.
      </p>
      <button onClick={() => chatMode('FixItFrank')}>Try Chat</button>
    </section>
  );
}