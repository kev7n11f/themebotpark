import React, { useState } from 'react';

const OpenAIVoiceDemo = () => {
  const [selectedBot, setSelectedBot] = useState('SafeSpace');
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const demoMessages = {
    SafeSpace: "Welcome to your safe space. I'm here to help bridge understanding between people. Take a deep breath, and let's work through this together with natural OpenAI voice.",
    RainMaker: "Ready to brainstorm some income-generating ideas? Let's make it rain with strategic thinking and high-quality AI voice synthesis!",
    HeartSync: "I'm here to help you understand your deeper patterns. What's on your heart today? Experience premium voice quality with OpenAI.",
    FixItFrank: "Got a problem that needs fixing? Let's troubleshoot this thing with crystal-clear OpenAI voice technology!",
    TellItLikeItIs: "Ready for some unfiltered truth? OpenAI voice delivers honest insights with natural speech synthesis.",
    CreativeCanvas: "Ready to unleash your creativity? Let's paint outside the lines with inspiring OpenAI voice generation!",
    WellnessWise: "Take a deep breath and welcome to your wellness journey with soothing OpenAI voice technology."
  };

  const handleTestTTS = async (text) => {
    if (!text) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          botId: selectedBot,
          speed: 1.0
        })
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        audioContext.decodeAudioData(audioBuffer, (decodedBuffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedBuffer;
          source.connect(audioContext.destination);
          source.start(0);
        });
      } else {
        const error = await response.json();
        alert('TTS Error: ' + error.error);
      }
    } catch (error) {
      console.error('TTS test error:', error);
      alert('Failed to test TTS: ' + error.message);
    }
    setIsGenerating(false);
  };

  const handleTestSTT = async () => {
    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setTranscription('');
    
    try {
      // This is a simplified example - real implementation would use MediaRecorder
      alert('STT test: In the real implementation, this would record your voice and send it to OpenAI Whisper for transcription.');
      setIsRecording(false);
    } catch (error) {
      console.error('STT test error:', error);
      setIsRecording(false);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: 'var(--glass-bg)',
      borderRadius: '12px',
      border: '1px solid var(--glass-border)'
    }}>
      <h2>🎙️ OpenAI Voice Chat Demo - Premium Quality</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Select Bot Personality:
        </label>
        <select 
          value={selectedBot} 
          onChange={(e) => setSelectedBot(e.target.value)}
          style={{ 
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          {Object.keys(demoMessages).map(bot => (
            <option key={bot} value={bot}>{bot}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>🔊 Text-to-Speech Test (OpenAI TTS)</h3>
        <p style={{ 
          padding: '1rem', 
          background: 'var(--message-bg)',
          borderRadius: '8px',
          fontStyle: 'italic',
          border: '1px solid var(--border-color)'
        }}>
          "{demoMessages[selectedBot]}"
        </p>
        <button 
          onClick={() => handleTestTTS(demoMessages[selectedBot])}
          disabled={isGenerating}
          style={{
            padding: '0.75rem 1.5rem',
            background: isGenerating ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem'
          }}
        >
          {isGenerating ? '🔄 Generating...' : '🎙️ Play OpenAI Voice'}
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>✍️ Custom Text Test</h3>
        <textarea
          placeholder="Type custom text to test OpenAI voice generation..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          style={{
            width: '100%',
            height: '80px',
            padding: '0.75rem',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            resize: 'vertical'
          }}
        />
        <button 
          onClick={() => customText && handleTestTTS(customText)}
          disabled={!customText.trim() || isGenerating}
          style={{
            padding: '0.75rem 1.5rem',
            background: (!customText.trim() || isGenerating) ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: (!customText.trim() || isGenerating) ? 'not-allowed' : 'pointer'
          }}
        >
          {isGenerating ? '🔄 Generating...' : '🎙️ Generate Custom Voice'}
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>🎤 Speech-to-Text Test (OpenAI Whisper)</h3>
        <button 
          onClick={handleTestSTT}
          style={{
            padding: '0.75rem 1.5rem',
            background: isRecording ? '#dc3545' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '0.5rem'
          }}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎤 Test Voice Input'}
        </button>
        {transcription && (
          <div style={{
            padding: '1rem',
            background: 'var(--success-bg, rgba(40, 167, 69, 0.1))',
            border: '1px solid var(--success-border, rgba(40, 167, 69, 0.3))',
            borderRadius: '6px',
            marginTop: '0.5rem'
          }}>
            <strong>Transcription:</strong> {transcription}
          </div>
        )}
      </div>

      <div style={{ 
        padding: '1rem', 
        background: 'var(--info-bg, rgba(13, 202, 240, 0.1))',
        border: '1px solid var(--info-border, rgba(13, 202, 240, 0.3))',
        borderRadius: '8px',
        fontSize: '0.875rem'
      }}>
        <h4>🚀 OpenAI Voice Features:</h4>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><strong>Premium Quality:</strong> Natural, human-like voice synthesis</li>
          <li><strong>Bot Personalities:</strong> Each bot has unique voice characteristics</li>
          <li><strong>High Accuracy:</strong> OpenAI Whisper for superior speech recognition</li>
          <li><strong>Fallback Support:</strong> Graceful degradation to Web Speech API</li>
          <li><strong>Smart Cleanup:</strong> Automatic text preprocessing for better speech</li>
          <li><strong>Multi-language:</strong> Support for various languages and accents</li>
        </ul>
        <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
          <strong>Note:</strong> Requires OpenAI API key. Falls back to free Web Speech API if unavailable.
        </p>
      </div>
    </div>
  );
};

export default OpenAIVoiceDemo;