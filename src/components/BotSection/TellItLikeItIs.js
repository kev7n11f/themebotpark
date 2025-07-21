import React from 'react';
import { chatMode } from '../../utils';

export default function TellItLikeItIs() {
  return (
    <section id="tellitlikeitis" className="bot-section">
      <img src="/images/tellitlikeitis.png" alt="TellItLikeItIs" className="bot-header-img" />
      <h2>🧨 TellItLikeItIs</h2>
      <p>Serves the unfiltered truth — no sugarcoating allowed.
      </p>
      <button onClick={() => chatMode('TellItLikeItIs')}>Try Chat</button>
    </section>
  );
}