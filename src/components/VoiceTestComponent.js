import React, { useState } from 'react';
import voiceManager from '../utils/voiceManager';

const VoiceTestComponent = () => {
  const [testMessage, setTestMessage] = useState('Hello, this is a test of the OpenAI voice system.');
  const [selectedBot, setSelectedBot] = useState('SafeSpace');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState('');
  const [fallbackTest, setFallbackTest] = useState('');

  const bots = ['SafeSpace', 'RainMaker', 'HeartSync', 'FixItFrank', 'TellItLikeItIs', 'CreativeCanvas', 'WellnessWise'];

  const testVoice = async () => {
    setIsTesting(true);
    setTestResult('');
    setFallbackTest('');

    try {
      console.log('Testing voice with:', testMessage, 'Bot:', selectedBot);
      await voiceManager.speak(testMessage, selectedBot);
      setTestResult('✅ Voice test completed successfully!');
    } catch (error) {
      console.error('Voice test error:', error);
      setTestResult(`❌ Voice test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testFallback = async () => {
    setIsTesting(true);
    setFallbackTest('');

    try {
      // Force fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(testMessage);
      utterance.voice = speechSynthesis.getVoices()[0];
      utterance.onstart = () => setFallbackTest('🔊 Web Speech API started...');
      utterance.onend = () => setFallbackTest('✅ Web Speech API completed successfully!');
      utterance.onerror = (e) => setFallbackTest(`❌ Web Speech API failed: ${e.error}`);
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Fallback test error:', error);
      setFallbackTest(`❌ Fallback test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testOpenAIDirectly = async () => {
    setIsTesting(true);
    setTestResult('Testing OpenAI TTS API directly...');

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testMessage,
          botId: selectedBot,
          speed: 1.0
        })
      });

      if (response.ok) {
        setTestResult('✅ OpenAI TTS API responded successfully!');
        const audioBuffer = await response.arrayBuffer();
        
        // Try to play the audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(audioBuffer, (decodedBuffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = decodedBuffer;
          source.connect(audioContext.destination);
          source.onended = () => setTestResult('✅ OpenAI TTS played successfully!');
          source.start(0);
        }, (error) => {
          setTestResult(`❌ Audio decode error: ${error.message}`);
        });
      } else {
        const errorData = await response.json();
        setTestResult(`❌ OpenAI TTS API error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Direct API test error:', error);
      setTestResult(`❌ Direct API test failed: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      background: 'var(--glass-bg)',
      borderRadius: '12px',
      border: '1px solid var(--glass-border)'
    }}>
      <h2>🎙️ Voice Chat Debug Tool</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Test Message:</label>
        <textarea
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          style={{
            width: '100%',
            height: '60px',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bot Personality:</label>
        <select
          value={selectedBot}
          onChange={(e) => setSelectedBot(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            background: 'var(--input-bg)',
            color: 'var(--text-primary)',
            width: '100%'
          }}
        >
          {bots.map(bot => (
            <option key={bot} value={bot}>{bot}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={testVoice}
          disabled={isTesting}
          style={{
            padding: '0.75rem 1rem',
            background: isTesting ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          {isTesting ? '🔄 Testing...' : '🎙️ Test Full Voice System'}
        </button>

        <button
          onClick={testOpenAIDirectly}
          disabled={isTesting}
          style={{
            padding: '0.75rem 1rem',
            background: isTesting ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          🤖 Test OpenAI TTS Only
        </button>

        <button
          onClick={testFallback}
          disabled={isTesting}
          style={{
            padding: '0.75rem 1rem',
            background: isTesting ? '#6c757d' : '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: isTesting ? 'not-allowed' : 'pointer'
          }}
        >
          🔊 Test Web Speech Fallback
        </button>
      </div>

      {testResult && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: testResult.includes('❌') ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)',
          border: `1px solid ${testResult.includes('❌') ? 'rgba(220, 53, 69, 0.3)' : 'rgba(40, 167, 69, 0.3)'}`,
          borderRadius: '4px',
          color: testResult.includes('❌') ? 'var(--error-text)' : 'var(--success-text)'
        }}>
          <strong>Test Result:</strong> {testResult}
        </div>
      )}

      {fallbackTest && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          background: fallbackTest.includes('❌') ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)',
          border: `1px solid ${fallbackTest.includes('❌') ? 'rgba(220, 53, 69, 0.3)' : 'rgba(40, 167, 69, 0.3)'}`,
          borderRadius: '4px',
          color: fallbackTest.includes('❌') ? 'var(--error-text)' : 'var(--success-text)'
        }}>
          <strong>Fallback Test:</strong> {fallbackTest}
        </div>
      )}

      <div style={{
        padding: '1rem',
        background: 'rgba(13, 202, 240, 0.1)',
        border: '1px solid rgba(13, 202, 240, 0.3)',
        borderRadius: '4px',
        fontSize: '0.875rem'
      }}>
        <h4>Debug Information:</h4>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li><strong>Voice Manager Support:</strong> {voiceManager.isSupported ? '✅ Supported' : '❌ Not Supported'}</li>
          <li><strong>Web Speech API:</strong> {'speechSynthesis' in window ? '✅ Available' : '❌ Not Available'}</li>
          <li><strong>Current Speaking:</strong> {voiceManager.isSpeaking ? '🔊 Speaking' : '🔇 Silent'}</li>
          <li><strong>Available Voices:</strong> {speechSynthesis?.getVoices().length || 0} voices loaded</li>
        </ul>
        <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
          Check browser console for detailed logs during testing.
        </p>
      </div>
    </div>
  );
};

export default VoiceTestComponent;