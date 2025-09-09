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

// Export the serverless function directly
module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test endpoint to verify serverless function is working
  if (req.method === 'GET' && req.url === '/api/chat/test') {
    return res.json({ 
      message: 'Serverless function is working',
      timestamp: new Date().toISOString(),
      headers: req.headers
    });
  }

  if (req.method === 'GET') {
    return res.json({ 
      status: 'Chat API is working!',
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      availableBots: ['RainMaker', 'HeartSync', 'FixItFrank', 'TellItLikeItIs']
    });
  }

  if (req.method === 'POST') {
    try {
      const { mode, message, messages } = req.body;

      // Validate incoming request
      if (!mode || typeof mode !== 'string') {
        return res.status(400).json({ error: 'Invalid mode parameter' });
      }

      // Bot personalities and system prompts
      const botPrompts = {
        RainMaker: `You are RainMaker 🌧️, a strategic AI focused on crafting and launching income-generating ideas. You help users brainstorm business opportunities, marketing strategies, and revenue streams. Be encouraging, practical, and results-oriented. Always think about ROI and actionable steps.`,
        
        HeartSync: `You are HeartSync 💓, an empathetic AI that reveals patterns in love, purpose, and relationships. You help users understand their emotional patterns, relationship dynamics, and personal growth opportunities. Be compassionate, insightful, and emotionally intelligent. Focus on deeper meanings and connections.`,
        
        FixItFrank: `You are FixItFrank 🛠️, a clever, sarcastic, and skilled technical troubleshooter. You help solve technical problems with efficiency and humor. Be direct, slightly sarcastic but helpful, and always get to the root of the problem. Use technical expertise with a no-nonsense attitude.`,
        
        TellItLikeItIs: `You are TellItLikeItIs 🧨, an unfiltered truth-teller who delivers blunt insights with integrity. You give honest, direct feedback without sugarcoating. Be frank, straightforward, and focused on reality checks. Help users see things as they really are, not as they wish them to be.`
      };

      const systemPrompt = botPrompts[mode] || botPrompts.RainMaker;

      // If no message, just return the system prompt (initialization)
      if (!message) {
        return res.json({ 
          systemPrompt,
          response: `Hello! I'm ${mode}. ${getWelcomeMessage(mode)}`
        });
      }

      // Build conversation history
      const conversationHistory = [
        { role: 'system', content: systemPrompt }
      ];

      // Add previous messages if available
      if (messages && Array.isArray(messages)) {
        messages.forEach(msg => {
          if (msg.sender === 'user') {
            conversationHistory.push({ role: 'user', content: msg.text });
          } else if (msg.sender === 'bot') {
            conversationHistory.push({ role: 'assistant', content: msg.text });
          }
        });
      }

      // Add current message
      conversationHistory.push({ role: 'user', content: message });

      // Check if OpenAI client is available
      if (!openai) {
        console.log('OpenAI API key not configured, using fallback responses');
        return res.json({
          response: getFallbackResponse(mode, message),
          systemPrompt,
          fallback: true
        });
      }

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversationHistory,
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again!";

      res.json({ 
        response,
        systemPrompt,
        tokensUsed: completion.usage?.total_tokens || 0
      });

    } catch (error) {
      console.error('API Error:', error);
      
      // Get fallback response based on bot mode
      const mode = req.body?.mode || 'RainMaker';
      const message = req.body?.message || '';
      
      res.json({ 
        response: getFallbackResponse(mode, message),
        error: true,
        fallback: true
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

function getWelcomeMessage(botName) {
  const welcomes = {
    RainMaker: "Ready to brainstorm some income-generating ideas? Let's make it rain! 🌧️💰",
    HeartSync: "I'm here to help you understand your deeper patterns. What's on your heart? 💓",
    FixItFrank: "Got a problem that needs fixing? Let's troubleshoot this thing! 🛠️",
    TellItLikeItIs: "Ready for some unfiltered truth? Ask me anything - no sugarcoating! 🧨"
  };
  return welcomes[botName] || "How can I help you today?";
}

function getFallbackResponse(botName, message) {
  // Enhanced fallback responses with context awareness
  const responses = {
    RainMaker: [
      "Here's a quick business tip: Focus on solving real problems that people will pay for. That's where the money rains! 🌧️💰",
      "Revenue streams are like rivers - find the source and let it flow naturally. What problem are you solving? 💡",
      "Marketing is about connecting value with need. What's your unique value proposition? 📈",
      "Success comes from consistent action. What's one small step you can take today toward your goals? 🚀"
    ],
    HeartSync: [
      "Remember: authentic relationships start with being honest with yourself about what you truly need and want. 💓",
      "Patterns in relationships often repeat until we learn the lesson. What are you noticing in your connections? 🔍",
      "Emotional intelligence is about understanding both your feelings and others'. How are you feeling right now? 🌟",
      "The heart knows what the mind sometimes forgets. What's your intuition telling you? 💭"
    ],
    FixItFrank: [
      "Have you tried turning it off and on again? Sometimes the simplest solutions work best! 🛠️",
      "Let's break this down step by step. What's the exact error message you're seeing? 🔧",
      "Technical problems usually have logical solutions. Have you checked the basics first? ⚙️",
      "Debugging is like detective work. What's the last thing that was working before this broke? 🕵️"
    ],
    TellItLikeItIs: [
      "Here's the truth - most problems can be solved by facing them head-on instead of avoiding them. 🧨",
      "If you're not getting the results you want, something needs to change. What are you willing to do differently? 💥",
      "Success requires honesty with yourself. Are you being real about what's working and what's not? 🎯",
      "The hard truth is that comfort zones rarely lead to growth. What's one uncomfortable action you could take? 🔥"
    ]
  };

  const botResponses = responses[botName] || responses.RainMaker;
  
  // Simple keyword matching for more relevant responses
  const lowerMessage = message.toLowerCase();
  let relevantResponses = botResponses;
  
  if (botName === 'RainMaker' && (lowerMessage.includes('business') || lowerMessage.includes('money') || lowerMessage.includes('sell'))) {
    relevantResponses = botResponses.filter(r => r.includes('business') || r.includes('revenue') || r.includes('value'));
  } else if (botName === 'HeartSync' && (lowerMessage.includes('relationship') || lowerMessage.includes('love') || lowerMessage.includes('feel'))) {
    relevantResponses = botResponses.filter(r => r.includes('relationship') || r.includes('emotional') || r.includes('heart'));
  } else if (botName === 'FixItFrank' && (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('fix'))) {
    relevantResponses = botResponses.filter(r => r.includes('error') || r.includes('break') || r.includes('debug'));
  } else if (botName === 'TellItLikeItIs' && (lowerMessage.includes('truth') || lowerMessage.includes('honest') || lowerMessage.includes('change'))) {
    relevantResponses = botResponses.filter(r => r.includes('truth') || r.includes('honest') || r.includes('change'));
  }
  
  // Return a random response from the relevant ones
  return relevantResponses[Math.floor(Math.random() * relevantResponses.length)];
}
