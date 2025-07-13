import React from 'react';
import { chatMode } from '../../utils';

export default function RainMaker() {
  return (
    <section id="rainmaker" className="bot-section">
      <h2>🌧️ RainMaker</h2>
      <p>Craft and launch income-generating ideas on autopilot.
      </p>
      <button onClick={() => chatMode('RainMaker')}>Try Chat</button>
    </section>
  );
}