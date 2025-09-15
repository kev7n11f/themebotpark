/**
 * Speech Recognition utilities using OpenAI Whisper API (PREMIUM ACCURACY)
 * Provides high-accuracy speech-to-text transcription with fallback to Web Speech API
 */

class SpeechRecognitionManager {
  constructor() {
    // Check for Web Speech API support (fallback)
    this.WebSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.webSpeechSupported = !!this.WebSpeechRecognition;
    this.isSupported = true; // OpenAI Whisper is always supported if API key is available
    
    this.recognition = null;
    this.isListening = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    
    // Callbacks
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;
    
    // Initialize Web Speech API for fallback
    if (this.webSpeechSupported) {
      this.setupWebSpeechRecognition();
    }
  }

  // Setup Web Speech API for fallback
  setupWebSpeechRecognition() {
    this.recognition = new this.WebSpeechRecognition();
    
    // Configuration for better accuracy
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Event handlers
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Web Speech recognition started');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      console.log('Web Speech recognition result:', { transcript, confidence });
      
      if (this.onResult) {
        this.onResult(transcript, confidence);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Web Speech recognition error:', event.error);
      this.isListening = false;
      
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Web Speech recognition ended');
      
      if (this.onEnd) {
        this.onEnd();
      }
    };
  }

  // Start listening for speech using OpenAI Whisper
  async startListening(callbacks = {}) {
    if (this.isListening || this.isRecording) {
      console.warn('Already listening/recording');
      return false;
    }

    // Set callbacks
    this.onResult = callbacks.onResult;
    this.onError = callbacks.onError;
    this.onEnd = callbacks.onEnd;

    try {
      // Try OpenAI Whisper approach first
      const whisperSuccess = await this.startWhisperRecording();
      
      if (whisperSuccess) {
        return true;
      } else {
        // Fallback to Web Speech API
        console.log('Falling back to Web Speech API');
        return this.startWebSpeechRecognition();
      }
      
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      
      // Try Web Speech API fallback
      if (this.webSpeechSupported) {
        console.log('Falling back to Web Speech API due to error');
        return this.startWebSpeechRecognition();
      }
      
      return false;
    }
  }

  // Start recording for OpenAI Whisper
  async startWhisperRecording() {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      // Setup MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });

      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        try {
          await this.processWhisperAudio();
        } catch (error) {
          console.error('Error processing Whisper audio:', error);
          if (this.onError) {
            this.onError('processing_error');
          }
        }
        this.cleanup();
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        if (this.onError) {
          this.onError('recording_error');
        }
        this.cleanup();
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
      this.isListening = true;
      
      console.log('OpenAI Whisper recording started');
      return true;

    } catch (error) {
      console.error('Failed to start Whisper recording:', error);
      return false;
    }
  }

  // Process recorded audio with OpenAI Whisper
  async processWhisperAudio() {
    if (this.audioChunks.length === 0) {
      console.warn('No audio data recorded');
      return;
    }

    try {
      // Create audio blob
      const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
      
      // Check minimum size (avoid very short recordings)
      if (audioBlob.size < 1000) {
        console.warn('Audio recording too short');
        if (this.onError) {
          this.onError('audio_too_short');
        }
        return;
      }

      // Send to OpenAI Whisper API
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Whisper transcription result:', result);
        
        if (this.onResult && result.text) {
          this.onResult(result.text, result.confidence || 1.0);
        }
      } else {
        const errorData = await response.json();
        console.warn('Whisper API error:', errorData.error);
        
        // Fallback to Web Speech API if Whisper fails
        if (this.webSpeechSupported) {
          console.log('Whisper failed, would need to re-record with Web Speech API');
          if (this.onError) {
            this.onError('whisper_failed');
          }
        }
      }

    } catch (error) {
      console.error('Error processing audio with Whisper:', error);
      if (this.onError) {
        this.onError('processing_error');
      }
    }
  }

  // Fallback to Web Speech API
  startWebSpeechRecognition() {
    if (!this.webSpeechSupported) {
      console.warn('Web Speech API not supported');
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start Web Speech recognition:', error);
      return false;
    }
  }

  // Stop listening
  stopListening() {
    if (this.isRecording && this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
    
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    
    this.cleanup();
  }

  // Cleanup resources
  cleanup() {
    this.isListening = false;
    this.isRecording = false;
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.mediaRecorder) {
      this.mediaRecorder = null;
    }
    
    this.audioChunks = [];
    
    if (this.onEnd) {
      this.onEnd();
    }
  }

  // Check if currently listening
  getIsListening() {
    return this.isListening || this.isRecording;
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