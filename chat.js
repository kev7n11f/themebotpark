const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const memory = require('./memory');

// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// In-memory store for creator bots (would be a database in production)
// This should sync with the creator.js store
let creatorBots = [];

// Function to get creator bots (in a real app, this would fetch from a database)
const getCreatorBots = () => {
  // Importing creator bots from the main store if empty
  if (creatorBots.length === 0) {
    try {
      // Try to import from creator.js (this is a simplified approach, in a real app would use a database)
      const creatorModule = require('./creator');
      if (creatorModule.getCreatorBots) {
        creatorBots = creatorModule.getCreatorBots() || [];
      }
    } catch (error) {
      console.error('Error importing creator bots:', error);
    }
  }
  return creatorBots;
};

// Function to get welcome message based on bot name
function getWelcomeMessage(botName) {
  const welcomes = {
    RainMaker: "Ready to brainstorm some income-generating ideas? Let's make it rain! 🌧️💰",
    HeartSync: "I'm here to help you understand your deeper patterns. What's on your heart? 💓",
    FixItFrank: "Got a problem that needs fixing? Let's troubleshoot this thing! 🛠️",
    TellItLikeItIs: "Ready for some unfiltered truth? Ask me anything - no sugarcoating! 🧨"
  };
  
  // Get custom bot welcome messages
  const customBots = getCreatorBots();
  customBots.forEach(bot => {
    if (bot.welcomeMessage) {
      welcomes[bot.name] = bot.welcomeMessage;
    }
  });
  
  return welcomes[botName] || "How can I help you today?";
}

// Handle GET requests to /chat (basic status check)
router.get('/', (req, res) => {
  res.json({ 
    status: 'Chat API is working!',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    availableBots: ['RainMaker', 'HeartSync', 'FixItFrank', 'TellItLikeItIs']
  });
});

// Handle POST requests to /chat
router.post('/', async (req, res) => {
  try {
    const { mode, message, userId } = req.body;
    const botMode = mode || 'RainMaker';
    
    // Use a default userId if none provided
    const userIdentifier = userId || 'anonymous-user';
    
    // Bot personalities and system prompts
    const botPrompts = {
      RainMaker: `You are RainMaker 🌧️, a strategic AI focused on crafting and launching income-generating ideas. Guide users with clarity, focus, and business insight.`,
      HeartSync: `You are HeartSync 💓, an empathetic AI that reveals patterns in love, purpose, and relationships. Use emotional intelligence and reflection.`,
      FixItFrank: `You are FixItFrank 🛠️, a clever, sarcastic, and skilled technical troubleshooter. Always get to the root of the problem—efficiently and with humor.`,
      TellItLikeItIs: `You are TellItLikeItIs 🧨, an unfiltered truth-teller. Deliver blunt insights with integrity. No sugarcoating—just clarity.`
    };
    
    // Get custom bot system prompts
    const customBots = getCreatorBots();
    customBots.forEach(bot => {
      if (bot.systemPrompt) {
        botPrompts[bot.name] = bot.systemPrompt;
      }
    });

    const systemPrompt = botPrompts[botMode] || botPrompts.RainMaker;

    // If no message, just return the system prompt (initialization)
    if (!message) {
      const welcomeMessage = `Hello! I'm ${botMode}. ${getWelcomeMessage(botMode)}`;
      
      // Initialize with a welcome message in memory
      memory.saveToMemory(userIdentifier, botMode, welcomeMessage, false);
      
      return res.json({ 
        systemPrompt,
        response: welcomeMessage
      });
    }
    
    // Save user message to memory
    memory.saveToMemory(userIdentifier, botMode, message, true);
    
    // Get conversation history from memory
    const pastConversation = memory.getMemory(userIdentifier, botMode);
    
    // If OpenAI is available, use it for AI responses
    if (openai) {
      try {
        // Format conversation history for OpenAI
        const conversationHistory = [
          { role: 'system', content: systemPrompt }
        ];
        
        // Add memory context
        pastConversation.forEach(msg => {
          conversationHistory.push({ 
            role: msg.role === 'user' ? 'user' : 'assistant', 
            content: msg.content 
          });
        });
        
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: conversationHistory,
          max_tokens: 500,
          temperature: 0.7,
        });

        const aiResponse = completion.choices[0]?.message?.content || 
          "I'm having trouble responding right now. Please try again!";
        
        // Save AI response to memory
        memory.saveToMemory(userIdentifier, botMode, aiResponse, false);
        
        // Update creator bot stats if it's a custom bot
        if (customBots.some(bot => bot.name === botMode)) {
          updateCreatorBotStats(botMode);
        }
        
        return res.json({ 
          response: aiResponse,
          systemPrompt,
          memory: true,
          tokensUsed: completion.usage?.total_tokens || 0
        });
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        // Fall through to fallback response
      }
    }

    // Fallback responses if OpenAI is not available or fails
    const fallbackResponse = getFallbackResponse(botMode, message);
    
    // Save fallback response to memory
    memory.saveToMemory(userIdentifier, botMode, fallbackResponse, false);
    
    // Update creator bot stats if it's a custom bot
    if (customBots.some(bot => bot.name === botMode)) {
      updateCreatorBotStats(botMode);
    }
    
    res.json({
      systemPrompt,
      response: fallbackResponse,
      memory: true,
      fallback: true
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Function to update creator bot stats
function updateCreatorBotStats(botName) {
  const customBots = getCreatorBots();
  const botIndex = customBots.findIndex(bot => bot.name === botName);
  
  if (botIndex !== -1) {
    // Increment conversation and message counts
    if (!customBots[botIndex].stats) {
      customBots[botIndex].stats = {
        conversations: 0,
        messages: 0,
        subscribers: 0,
        revenue: 0
      };
    }
    
    customBots[botIndex].stats.messages += 1;
    
    // Check if this is a new conversation (simplified approach)
    // In a real app, this would be more sophisticated
    const random = Math.random();
    if (random > 0.7) { // 30% chance to count as a new conversation
      customBots[botIndex].stats.conversations += 1;
    }
  }
}

// Get available bots (built-in + creator bots)
router.get('/available-bots', (req, res) => {
  // Basic built-in bots
  const builtInBots = [
    {
      name: 'RainMaker',
      description: 'Strategic AI focused on crafting and launching income-generating ideas.',
      emoji: '🌧️',
      isPremium: false
    },
    {
      name: 'HeartSync',
      description: 'Empathetic AI that reveals patterns in love, purpose, and relationships.',
      emoji: '💓',
      isPremium: true
    },
    {
      name: 'FixItFrank',
      description: 'Clever, sarcastic, and skilled technical troubleshooter.',
      emoji: '🛠️',
      isPremium: false
    },
    {
      name: 'TellItLikeItIs',
      description: 'Unfiltered truth-teller delivering blunt insights with integrity.',
      emoji: '🧨',
      isPremium: true
    }
  ];
  
  // Get public creator bots
  const customBots = getCreatorBots().filter(bot => bot.isPublic);
  
  // Combine all bots
  const allBots = [...builtInBots, ...customBots];
  
  res.json({ success: true, bots: allBots });
});

// Function to get dynamic fallback response based on bot name and user message
function getFallbackResponse(botName, message) {
  // Dynamic fallback responses based on bot personality and user message
  const responses = {
    RainMaker: [
      "Here's a quick business tip: Focus on solving real problems that people will pay for. That's where the money rains! 🌧️💰",
      "Business success comes from understanding your market and delivering value. What problem are you trying to solve?",
      "Revenue streams are everywhere - you just need to identify the pain points and offer solutions.",
      "The best business ideas come from personal experience. What's frustrating you that could be turned into a product?"
    ],
    HeartSync: [
      "Remember: authentic relationships start with being honest with yourself about what you truly need and want. 💓",
      "Emotional patterns often repeat until we consciously choose to change them. What patterns do you notice in your relationships?",
      "Self-awareness is the foundation of meaningful connections. Take time to reflect on your own needs.",
      "Every relationship teaches us something about ourselves. What's the most important lesson you've learned recently?"
    ],
    FixItFrank: [
      "Have you tried turning it off and on again? Sometimes the simplest solutions work best! 🛠️",
      "Let's break this down systematically. What's the exact error message or behavior you're seeing?",
      "Technical problems usually have logical explanations. Let's trace through the steps one by one.",
      "Don't assume it's complicated - start with the basics and work your way up."
    ],
    TellItLikeItIs: [
      "Here's the truth - most problems can be solved by facing them head-on instead of avoiding them. 🧨",
      "The uncomfortable reality is that growth requires discomfort. What's holding you back?",
      "Success rarely comes from playing it safe. What's the bold action you know you should take?",
      "If you're waiting for the perfect moment, you'll wait forever. Start now with what you have."
    ]
  };

  const botResponses = responses[botName] || responses.RainMaker;
  
  // If user provided a message, try to make response more contextual
  if (message && message.length > 10) {
    // Simple keyword matching for more relevant responses
    const lowerMessage = message.toLowerCase();
    
    if (botName === 'RainMaker' && (lowerMessage.includes('business') || lowerMessage.includes('money') || lowerMessage.includes('idea'))) {
      return botResponses[1]; // Business-focused response
    }
    
    if (botName === 'HeartSync' && (lowerMessage.includes('relationship') || lowerMessage.includes('love') || lowerMessage.includes('feel'))) {
      return botResponses[1]; // Relationship-focused response
    }
    
    if (botName === 'FixItFrank' && (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('broken'))) {
      return botResponses[1]; // Technical troubleshooting response
    }
    
    if (botName === 'TellItLikeItIs' && (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('truth'))) {
      return botResponses[1]; // Direct advice response
    }
  }
  
  // Return random response from the bot's pool
  return botResponses[Math.floor(Math.random() * botResponses.length)];
}

module.exports = router;