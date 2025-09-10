import React, { useState } from 'react';
import voiceManager from '../utils/voiceManager';

const VoiceDemo = () => {
  const [selectedBot, setSelectedBot] = useState('SafeSpace');
  const [customText, setCustomText] = useState('');

  const demoMessages = {
    SafeSpace: "Welcome to your safe space. I'm here to help bridge understanding between people. Take a deep breath, and let's work through this together.",
    RainMaker: "Ready to brainstorm some income-generating ideas? Let's make it rain with strategic thinking and smart business moves!",
    HeartSync: "I'm here to help you understand your deeper patterns. What's on your heart today? Let's explore those feelings together.",
    FixItFrank: "Got a problem that needs fixing? Let's troubleshoot this thing! I've got the tools and the attitude to get it sorted.",
    TellItLikeItIs: "Ready for some unfiltered truth? Ask me anything - no sugarcoating, just honest insights that cut through the noise.",
    CreativeCanvas: "Ready to unleash your creativity? Let's paint outside the lines and explore new possibilities! Art is calling.",
    WellnessWise: "Take a deep breath and welcome to your wellness journey. How can I support your well-being and inner peace today?"
  };

  const handleSpeak = (text) => {
    voiceManager.speak(text, selectedBot);
  };

  const handleStop = () => {
    voiceManager.stop();
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      background: 'var(--glass-bg)',
      borderRadius: '12px',
      border: '1px solid var(--glass-border)'
    }}>
      <h2>🎙️ Voice Demo - Test Bot Personalities</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Select Bot: </label>
        <select 
          value={selectedBot} 
          onChange={(e) => setSelectedBot(e.target.value)}
          style={{ 
            padding: '0.5rem', 
            marginLeft: '0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border-color)'
          }}
        >
          {Object.keys(demoMessages).map(bot => (
            <option key={bot} value={bot}>{bot}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => handleSpeak(demoMessages[selectedBot])}
          style={{
            padding: '0.75rem 1rem',
            marginRight: '0.5rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🎙️ Speak Demo Message
        </button>
        
        <button 
          onClick={handleStop}
          style={{
            padding: '0.75rem 1rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ⏹️ Stop
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ 
          padding: '1rem', 
          background: 'var(--message-bg)',
          borderRadius: '8px',
          fontStyle: 'italic'
        }}>
          "{demoMessages[selectedBot]}"
        </p>
      </div>

      <div>
        <textarea
          placeholder="Type custom text to test voice..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          style={{
            width: '100%',
            height: '80px',
            padding: '0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            marginBottom: '0.5rem'
          }}
        />
        <button 
          onClick={() => customText && handleSpeak(customText)}
          disabled={!customText.trim()}
          style={{
            padding: '0.5rem 1rem',
            background: customText.trim() ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: customText.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          🎙️ Speak Custom Text
        </button>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <p><strong>Voice Features:</strong></p>
        <ul>
          <li>Each bot has unique voice settings (pitch, rate, preferred voices)</li>
          <li>SafeSpace uses a calmer, slower voice for peaceful mediation</li>
          <li>Text is automatically cleaned (removes emojis, markdown)</li>
          <li>Free Web Speech API - no additional costs!</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceDemo;
