const OpenAI = require('openai');
const multer = require('multer');

// Create OpenAI client only if API key is available and valid
let openai = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error.message);
  }
}

// Configure multer for handling file uploads in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit (OpenAI's max)
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav',
      'audio/mp4', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/flac',
      'audio/webm', 'video/mp4', 'video/mpeg', 'video/quicktime'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported audio format'), false);
    }
  }
});

// Helper function to process the uploaded file
const processUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single('audio')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            reject({ status: 413, message: 'Audio file too large (max 25MB)' });
          } else {
            reject({ status: 400, message: 'File upload error: ' + err.message });
          }
        } else {
          reject({ status: 400, message: err.message });
        }
      } else {
        resolve();
      }
    });
  });
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
    // Handle file upload
    await processUpload(req, res);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Check if OpenAI client is available
    if (!openai) {
      return res.status(503).json({ 
        error: 'OpenAI service unavailable',
        fallback: true,
        message: 'STT service temporarily unavailable. Please try the web speech option.'
      });
    }

    const { language = 'en', temperature = 0 } = req.body;

    console.log(`Processing STT for ${req.file.originalname} (${req.file.size} bytes, ${req.file.mimetype})`);

    // Create a File object for OpenAI API
    const audioFile = new File([req.file.buffer], req.file.originalname || 'audio.wav', {
      type: req.file.mimetype
    });

    // Transcribe using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language, // Optional: specify language for better accuracy
      temperature: Math.max(0, Math.min(1, temperature)), // Clamp between 0 and 1
      response_format: 'verbose_json' // Get detailed response with confidence scores
    });

    // Extract the transcription text and metadata
    const result = {
      text: transcription.text,
      language: transcription.language,
      duration: transcription.duration,
      confidence: 1.0, // Whisper doesn't provide confidence scores in verbose_json yet
      success: true
    };

    console.log(`STT Result: "${result.text}" (${result.language}, ${result.duration}s)`);

    return res.json(result);

  } catch (error) {
    console.error('STT API Error:', error);
    
    // Handle specific error types
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.status === 400) {
      return res.status(400).json({ error: 'Invalid request to OpenAI STT API' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to transcribe audio',
      fallback: true,
      message: 'STT transcription failed. Please try the web speech option.',
      details: error.message
    });
  }
};