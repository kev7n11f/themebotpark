import React, { useState, useEffect } from 'react';
import { 
  startListening, 
  stopListening, 
  isListening, 
  isSpeechRecognitionSupported,
  getSpeechErrorMessage 
} from '../utils/speechRecognition';
import './SpeechInput.css';

const SpeechInput = ({ onSpeechResult, disabled = false, botId = 'SafeSpace' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported] = useState(isSpeechRecognitionSupported());
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');

  // Update recording state
  useEffect(() => {
    const checkRecording = () => setIsRecording(isListening());
    const interval = setInterval(checkRecording, 100);
    return () => clearInterval(interval);
  }, []);

  const handleStartListening = () => {
    if (disabled || isRecording) return;

    setError(null);
    setTranscript('');

    const success = startListening({
      onResult: (text, confidence) => {
        console.log('Speech input received:', text, 'Confidence:', confidence);
        setTranscript(text);
        
        // Only process if confidence is reasonable
        if (confidence > 0.5) {
          if (onSpeechResult) {
            onSpeechResult(text);
          }
        } else {
          setError('Speech not clear enough. Please try again.');
        }
      },
      
      onError: (errorCode) => {
        const errorMessage = getSpeechErrorMessage(errorCode);
        setError(errorMessage);
        setIsRecording(false);
      },
      
      onEnd: () => {
        setIsRecording(false);
      }
    });

    if (!success) {
      setError('Failed to start speech recognition');
    }
  };

  const handleStopListening = () => {
    stopListening();
    setIsRecording(false);
  };

  const toggleListening = () => {
    if (isRecording) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="speech-input speech-input--unsupported">
        <span className="speech-status">🎤 Speech input not supported</span>
      </div>
    );
  }

  return (
    <div className="speech-input">
      <button
        className={`speech-button ${isRecording ? 'speech-button--recording' : ''}`}
        onClick={toggleListening}
        disabled={disabled}
        title={isRecording ? 'Stop recording' : 'Start recording'}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? '🔴' : '🎤'}
      </button>

      <div className="speech-status">
        {isRecording && (
          <span className="recording-indicator">
            🎙️ Listening... (speak now)
          </span>
        )}
        
        {transcript && !isRecording && (
          <span className="transcript-preview">
            "{transcript}"
          </span>
        )}
        
        {error && (
          <span className="speech-error">
            ⚠️ {error}
          </span>
        )}
        
        {!isRecording && !transcript && !error && (
          <span className="speech-hint">
            Click microphone to speak
          </span>
        )}
      </div>
    </div>
  );
};

export default SpeechInput;