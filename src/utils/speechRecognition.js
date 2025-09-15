/**
 * Speech Recognition utilities using Web Speech API
 * Allows users to speak to the bots
 */

class SpeechRecognitionManager {
  constructor() {
    // Check for speech recognition support
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!this.SpeechRecognition;
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;

    if (this.isSupported) {
      this.setupRecognition();
    }
  }

  setupRecognition() {
    this.recognition = new this.SpeechRecognition();
    
    // Configuration for better accuracy
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log('Speech recognition result:', { transcript, confidence });
      
      if (this.onResult) {
        this.onResult(transcript, confidence);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
      
      if (this.onEnd) {
        this.onEnd();
      }
    };
  }

  // Start listening for speech
  startListening(callbacks = {}) {
    if (!this.isSupported) {
      console.warn('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    // Set callbacks
    this.onResult = callbacks.onResult;
    this.onError = callbacks.onError;
    this.onEnd = callbacks.onEnd;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Check if currently listening
  getIsListening() {
    return this.isListening;
  }

  // Check if speech recognition is supported
  getIsSupported() {
    return this.isSupported;
  }

  // Get error messages for common errors
  getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'No speech was detected. Please try again.',
      'audio-capture': 'Audio capture failed. Please check your microphone.',
      'not-allowed': 'Microphone access denied. Please allow microphone access.',
      'network': 'Network error occurred. Please check your connection.',
      'aborted': 'Speech recognition was aborted.',
      'bad-grammar': 'Speech recognition error occurred.',
      'language-not-supported': 'Language not supported for speech recognition.'
    };

    return errorMessages[error] || 'Speech recognition error occurred.';
  }
}

// Create singleton instance
const speechRecognitionManager = new SpeechRecognitionManager();

export default speechRecognitionManager;

// Helper functions for React components
export const startListening = (callbacks) => speechRecognitionManager.startListening(callbacks);
export const stopListening = () => speechRecognitionManager.stopListening();
export const isListening = () => speechRecognitionManager.getIsListening();
export const isSpeechRecognitionSupported = () => speechRecognitionManager.getIsSupported();
export const getSpeechErrorMessage = (error) => speechRecognitionManager.getErrorMessage(error);