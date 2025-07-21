import React from 'react';
import { chatMode } from '../../utils';

export default function FixItFrank() {
  return (
    <section id="fixitfrank" className="bot-section">
      <img src="/images/fixitfrank.png" alt="FixItFrank" className="bot-header-img" />
      <h2>🛠️ FixItFrank</h2>
      <p>Troubleshoots technical problems with sass and skill.
      </p>
      <button onClick={() => chatMode('FixItFrank')}>Try Chat</button>
    </section>
  );
}