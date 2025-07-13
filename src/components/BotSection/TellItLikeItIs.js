import React from 'react';
import { chatMode } from '../../utils';

export default function TellItLikeItIs() {
  return (
    <section id="tellitlikeitis" className="bot-section">
      <h2>🧨 TellItLikeItIs</h2>
      <p>Serves the unfiltered truth — no sugarcoating allowed.
      </p>
      <button onClick={() => chatMode('TellItLikeItIs')}>Try Chat</button>
    </section>
  );
}