const OpenAI = require('openai');

// Create OpenAI client only if API key is available and valid
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error.message);
  }
}

// Voice mapping for different bot personalities
const getBotVoice = (botId) => {
  const voiceMap = {
    SafeSpace: 'nova',      // Calm, gentle feminine voice
    RainMaker: 'onyx',      // Strong, confident masculine voice
    HeartSync: 'shimmer',   // Warm, empathetic feminine voice
    FixItFrank: 'echo',     // Direct, technical masculine voice
    TellItLikeItIs: 'fable', // Assertive, clear masculine voice
    CreativeCanvas: 'alloy', // Creative, inspiring gender-neutral voice
    WellnessWise: 'nova'    // Soothing, mindful feminine voice
  };
  
  return voiceMap[botId] || 'alloy'; // Default to alloy
};

// Clean text for better speech synthesis
const cleanTextForSpeech = (text) => {
  return text
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    // Replace common emojis with words
    .replace(/🌧️/g, 'rain')
    .replace(/💓/g, 'heart')
    .replace(/🛠️/g, 'tools')
    .replace(/🧨/g, 'explosive')
    .replace(/🕊️/g, 'peace')
    .replace(/🎨/g, 'art')
    .replace(/🧘/g, 'meditation')
    // Remove other emojis
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    // Clean up extra spaces and line breaks
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '. ')
    .trim();
};

// Export the serverless function
module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, botId = 'SafeSpace', speed = 1.0 } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 4096) {
      return res.status(400).json({ error: 'Text too long (max 4096 characters)' });
    }

    // Check if OpenAI client is available
    if (!openai) {
      return res.status(503).json({ 
        error: 'OpenAI service unavailable',
        fallback: true,
        message: 'TTS service temporarily unavailable. Please try the web speech option.'
      });
    }

    // Clean the text for better speech synthesis
    const cleanedText = cleanTextForSpeech(text);
    
    if (!cleanedText || cleanedText.length < 2) {
      return res.status(400).json({ error: 'Text too short after cleaning' });
    }

    // Get the appropriate voice for this bot
    const voice = getBotVoice(botId);

    console.log(`Generating TTS for ${botId} with voice ${voice}: "${cleanedText.substring(0, 50)}..."`);

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // Use tts-1 for faster, real-time generation (tts-1-hd for higher quality)
      voice: voice,
      input: cleanedText,
      speed: Math.max(0.25, Math.min(4.0, speed)) // Clamp speed between 0.25 and 4.0
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set appropriate headers for audio response
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    // Send the audio buffer
    res.send(buffer);

  } catch (error) {
    console.error('TTS API Error:', error);
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.status === 400) {
      return res.status(400).json({ error: 'Invalid request to OpenAI TTS API' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate speech',
      fallback: true,
      message: 'TTS generation failed. Please try the web speech option.'
    });
  }
};