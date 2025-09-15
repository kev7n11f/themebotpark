/**
 * Voice utilities using OpenAI TTS API (PREMIUM QUALITY)
 * Provides natural, high-quality voice synthesis for bot personalities
 */

class VoiceManager {
  constructor() {
    this.isSupported = true; // OpenAI TTS is always supported if API key is available
    this.isSpeaking = false;
    this.currentAudio = null;
    this.isOpenAIMode = true; // Flag to indicate we're using OpenAI TTS
    
    // Fallback to Web Speech API if needed
    this.webSpeechSupported = 'speechSynthesis' in window;
    this.voices = [];
    
    if (this.webSpeechSupported) {
      this.loadVoices();
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = speechSynthesis.getVoices();
  }

  // Get the best voice for each bot personality
  getBotVoice(botId) {
    const voicePreferences = {
      SafeSpace: {
        preferredNames: ['Karen', 'Samantha', 'Victoria', 'Fiona', 'Susan'],
        lang: 'en-US',
        pitch: 1.0,
        rate: 0.95
      },
      RainMaker: {
        preferredNames: ['Alex', 'Daniel', 'Thomas'],
        lang: 'en-US', 
        pitch: 1.0,
        rate: 1.0
      },
      HeartSync: {
        preferredNames: ['Karen', 'Samantha', 'Victoria'],
        lang: 'en-US',
        pitch: 0.9,
        rate: 0.9
      },
      FixItFrank: {
        preferredNames: ['Alex', 'Fred', 'Ralph'],
        lang: 'en-US',
        pitch: 1.1,
        rate: 1.1
      },
      TellItLikeItIs: {
        preferredNames: ['Alex', 'Daniel', 'Fred'],
        lang: 'en-US',
        pitch: 1.0,
        rate: 1.0
      },
      CreativeCanvas: {
        preferredNames: ['Karen', 'Samantha', 'Zoe'],
        lang: 'en-US',
        pitch: 1.1,
        rate: 1.0
      },
      WellnessWise: {
        preferredNames: ['Karen', 'Samantha', 'Victoria'],
        lang: 'en-US',
        pitch: 0.85,
        rate: 0.8
      }
    };

    return voicePreferences[botId] || voicePreferences.SafeSpace;
  }

  // Find the best available voice for a bot
  findBestVoice(botId) {
    const preferences = this.getBotVoice(botId);
    
    // Try to find preferred voice by name
    for (const preferredName of preferences.preferredNames) {
      const voice = this.voices.find(v => 
        v.name.includes(preferredName) && v.lang.startsWith('en')
      );
      if (voice) return voice;
    }
    
    // Fallback to default English voice
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
  }

  // Speak text with bot's voice using OpenAI TTS
  async speak(text, botId = 'SafeSpace') {
    if (!text || text.trim().length < 3) {
      return Promise.resolve();
    }

    // Stop any current speech
    this.stop();

    try {
      this.isSpeaking = true;
      
      // Try OpenAI TTS first
      const audioBuffer = await this.generateOpenAITTS(text, botId);
      
      if (audioBuffer) {
        return this.playAudioBuffer(audioBuffer);
      } else {
        // Fallback to Web Speech API
        console.log('Falling back to Web Speech API');
        return this.speakWithWebAPI(text, botId);
      }
      
    } catch (error) {
      console.error('TTS Error:', error);
      this.isSpeaking = false;
      
      // Fallback to Web Speech API on error
      if (this.webSpeechSupported) {
        console.log('Falling back to Web Speech API due to error');
        return this.speakWithWebAPI(text, botId);
      }
      
      throw error;
    }
  }

  // Generate speech using OpenAI TTS API
  async generateOpenAITTS(text, botId) {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: this.cleanTextForSpeech(text),
          botId: botId,
          speed: this.getBotSpeed(botId)
        })
      });

      if (response.ok) {
        return await response.arrayBuffer();
      } else {
        const errorData = await response.json();
        console.warn('OpenAI TTS API error:', errorData.error);
        return null; // Will trigger fallback
      }
    } catch (error) {
      console.warn('OpenAI TTS fetch error:', error);
      return null; // Will trigger fallback
    }
  }

  // Play audio buffer from OpenAI TTS
  playAudioBuffer(audioBuffer) {
    return new Promise((resolve, reject) => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        audioContext.decodeAudioData(audioBuffer.slice(0), (audioBuffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          
          this.currentAudio = { source, context: audioContext };
          
          source.onended = () => {
            this.isSpeaking = false;
            this.currentAudio = null;
            resolve();
          };
          
          source.start(0);
        }, (error) => {
          console.error('Audio decode error:', error);
          this.isSpeaking = false;
          reject(error);
        });
        
      } catch (error) {
        console.error('Audio playback error:', error);
        this.isSpeaking = false;
        reject(error);
      }
    });
  }

  // Fallback to Web Speech API
  speakWithWebAPI(text, botId) {
    if (!this.webSpeechSupported) {
      console.warn('Web Speech API not supported');
      return Promise.resolve();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const preferences = this.getBotVoice(botId);
    const voice = this.findBestVoice(botId);

    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = preferences.lang;
    utterance.pitch = preferences.pitch;
    utterance.rate = preferences.rate;
    utterance.volume = 0.9;

    // Clean up text for better speech
    const cleanText = this.cleanTextForSpeech(text);
    utterance.text = cleanText;

    this.currentUtterance = utterance;
    this.isSpeaking = true;

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        console.log('Web Speech started');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        console.error('Web Speech synthesis error:', event.error);
        reject(event);
      };

      // Double-check speechSynthesis is available
      if (window.speechSynthesis) {
        speechSynthesis.speak(utterance);
      } else {
        reject(new Error('Speech synthesis not available'));
      }
    });
  }

  // Get speed setting for each bot
  getBotSpeed(botId) {
    const speedMap = {
      SafeSpace: 0.95,
      RainMaker: 1.0,
      HeartSync: 0.9,
      FixItFrank: 1.1,
      TellItLikeItIs: 1.0,
      CreativeCanvas: 1.05,
      WellnessWise: 0.85
    };
    
    return speedMap[botId] || 1.0;
  }

  // Clean text for better speech synthesis
  cleanTextForSpeech(text) {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      // Replace emojis with words
      .replace(/🌧️/g, 'rain')
      .replace(/💓/g, 'heart')
      .replace(/🛠️/g, 'tools')
      .replace(/🧨/g, 'explosive')
      .replace(/🕊️/g, 'peace')
      .replace(/🎨/g, 'art')
      .replace(/🧘/g, 'meditation')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Stop current speech
  stop() {
    if (this.isSpeaking) {
      // Stop OpenAI audio if playing
      if (this.currentAudio) {
        try {
          this.currentAudio.source.stop();
          this.currentAudio.context.close();
        } catch (error) {
          console.warn('Error stopping OpenAI audio:', error);
        }
        this.currentAudio = null;
      }
      
      // Stop Web Speech API if playing
      if (this.webSpeechSupported && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        this.currentUtterance = null;
      }
      
      this.isSpeaking = false;
    }
  }

  // Toggle speech on/off
  toggle() {
    if (this.isSpeaking) {
      this.stop();
    }
  }

  // Get available voices for debugging
  getAvailableVoices() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      isDefault: voice.default
    }));
  }
}

// Create singleton instance
const voiceManager = new VoiceManager();

export default voiceManager;

// Helper functions for React components
export const speakBotMessage = (text, botId) => voiceManager.speak(text, botId);
export const stopSpeaking = () => voiceManager.stop();
export const isSpeechSupported = () => voiceManager.isSupported;
export const isSpeaking = () => voiceManager.isSpeaking;
