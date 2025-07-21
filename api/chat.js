const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export the serverless function directly
module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
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
      console.error('OpenAI API Error:', error);
      
      // Fallback responses for when API fails
      const fallbackResponses = {
        RainMaker: "I'm experiencing some technical difficulties, but here's a quick business tip: Focus on solving real problems that people will pay for. That's where the money rains! 🌧️💰",
        HeartSync: "My connection is a bit fuzzy right now, but remember: authentic relationships start with being honest with yourself about what you truly need and want. 💓",
        FixItFrank: "Well, looks like I'm the one with technical issues now! Ironic, right? Try refreshing and let's get back to fixing your problems! 🛠️",
        TellItLikeItIs: "Straight talk: My systems are down right now. But here's the truth - most problems can be solved by facing them head-on instead of avoiding them. 🧨"
      };

      res.json({ 
        response: fallbackResponses[mode] || "I'm experiencing technical difficulties. Please try again in a moment!",
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
