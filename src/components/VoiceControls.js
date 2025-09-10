import React, { useState, useEffect, useCallback } from 'react';
import voiceManager, { isSpeechSupported, isSpeaking } from '../utils/voiceManager';
import './VoiceControls.css';

const VoiceControls = ({ botId = 'SafeSpace', lastMessage = '', autoSpeak = false }) => {
  const [isSupported] = useState(isSpeechSupported());
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem(`voice-enabled-${botId}`) === 'true';
  });

  // Update speaking status
  useEffect(() => {
    const checkSpeaking = () => setSpeaking(isSpeaking());
    const interval = setInterval(checkSpeaking, 100);
    return () => clearInterval(interval);
  }, []);

  // Define handleSpeak before the auto-speak useEffect to satisfy ESLint no-use-before-define
  const handleSpeak = useCallback(async (text = lastMessage) => {
    if (!text || speaking) return;
    
    try {
      await voiceManager.speak(text, botId);
    } catch (error) {
      console.error('Speech error:', error);
    }
  }, [lastMessage, speaking, botId]);

  // Auto-speak new bot messages if enabled
  useEffect(() => {
    if (voiceEnabled && autoSpeak && lastMessage && !speaking) {
      handleSpeak(lastMessage);
    }
  }, [lastMessage, voiceEnabled, autoSpeak, speaking, handleSpeak]);

  // Save voice preference
  useEffect(() => {
    localStorage.setItem(`voice-enabled-${botId}`, voiceEnabled.toString());
  }, [voiceEnabled, botId]);

  const handleStop = () => {
    voiceManager.stop();
  };

  const toggleVoice = () => {
    if (speaking) {
      handleStop();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  if (!isSupported) {
    return (
      <div className="voice-controls voice-controls--unsupported">
        <span className="voice-status">Voice not supported in this browser</span>
      </div>
    );
  }

  return (
    <div className="voice-controls">
      <button
        className={`voice-toggle ${voiceEnabled ? 'voice-toggle--enabled' : ''}`}
        onClick={toggleVoice}
        title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
        aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
      >
        {voiceEnabled ? '🔊' : '🔇'}
      </button>

      {voiceEnabled && (
        <>
          <button
            className={`voice-speak ${speaking ? 'voice-speak--active' : ''}`}
            onClick={() => speaking ? handleStop() : handleSpeak()}
            disabled={!lastMessage}
            title={speaking ? 'Stop speaking' : 'Speak last message'}
            aria-label={speaking ? 'Stop speaking' : 'Speak last message'}
          >
            {speaking ? '⏹️' : '🎙️'}
          </button>

          <span className="voice-status">
            {speaking ? 'Speaking...' : voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
          </span>
        </>
      )}
    </div>
  );
};

export default VoiceControls;
