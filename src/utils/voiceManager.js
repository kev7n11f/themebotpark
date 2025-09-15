/**
 * Voice utilities using Web Speech API (FREE)
 * Works with existing setup, no additional API keys needed
 */

class VoiceManager {
  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.isSpeaking = false;
    this.voices = [];
    this.currentUtterance = null;
    
    if (this.isSupported) {
      this.loadVoices();
      // Voices might load asynchronously
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

  // Speak text with bot's voice
  speak(text, botId = 'SafeSpace') {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported');
      return Promise.resolve();
    }

    // Stop any current speech to prevent repetition
    this.stop();

    // Prevent empty or very short texts
    if (!text || text.trim().length < 3) {
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
        console.log('Speech started');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        console.error('Speech synthesis error:', event.error);
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
    if (this.isSupported && this.isSpeaking) {
      speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
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
