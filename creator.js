// Simple creator module with sample bots
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory store for creator bots (would be database in production)
const creatorBots = [];

// Function to get all creator bots
const getCreatorBots = () => creatorBots;

// Bot validation middleware
const validateBot = (req, res, next) => {
  const { name, systemPrompt } = req.body;
  
  if (!name || !systemPrompt) {
    return res.status(400).json({ 
      success: false, 
      error: 'ValidationError',
      message: 'Name and system prompt are required'
    });
  }
  
  next();
};

// Add some sample bots
const sampleBots = [
  {
    id: 'bot1',
    name: 'FitnessFriend',
    description: 'Your personal fitness coach',
    systemPrompt: 'You are FitnessFriend, a supportive AI fitness coach. You provide workout advice, nutritional guidance, and motivational support...',
    welcomeMessage: 'Hello! I\'m your personal fitness coach. How can I help you with your fitness journey today?',
    emoji: '💪',
    features: ['Workout Plans', 'Nutrition Advice', 'Progress Tracking', 'Motivation'],
    isPublic: true,
    isPremium: true,
    creatorId: 'demo-creator',
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-06-15T00:00:00Z',
    stats: {
      conversations: 120,
      messages: 876,
      subscribers: 10,
      revenue: 186.50
    }
  },
  {
    id: 'bot2',
    name: 'StudyBuddy',
    description: 'Study smarter, not harder',
    systemPrompt: 'You are StudyBuddy, an educational AI tutor. You help explain complex topics, provide practice problems, and guide effective study methods...',
    welcomeMessage: 'Hi there! Ready to study more effectively? Tell me what subject you\'re working on!',
    emoji: '📚',
    features: ['Subject Explanations', 'Practice Problems', 'Study Techniques', 'Exam Prep'],
    isPublic: true,
    isPremium: false,
    creatorId: 'demo-creator',
    createdAt: '2025-05-15T00:00:00Z',
    updatedAt: '2025-06-10T00:00:00Z',
    stats: {
      conversations: 85,
      messages: 614,
      subscribers: 6,
      revenue: 112.25
    }
  }
];

// Add sample bots to our store
sampleBots.forEach(bot => {
  creatorBots.push(bot);
});

// Get all creator bots (public ones)
router.get('/bots', (req, res) => {
  // Filter to only show public bots
  const publicBots = creatorBots.filter(bot => bot.isPublic);
  res.json({ success: true, bots: publicBots });
});

// Get a creator's bots
router.get('/my-bots', (req, res) => {
  // In production, would verify user from auth token
  const creatorId = req.query.creatorId || 'demo-creator';
  const myBots = creatorBots.filter(bot => bot.creatorId === creatorId);
  
  res.json({ success: true, bots: myBots });
});

// Create a new bot
router.post('/bot', validateBot, (req, res) => {
  const { 
    name, 
    description, 
    systemPrompt, 
    welcomeMessage, 
    emoji, 
    features = [], 
    isPublic = false, 
    isPremium = false 
  } = req.body;
  
  // In production, would get creatorId from auth token
  const creatorId = req.body.creatorId || 'demo-creator';
  
  // Create new bot
  const newBot = {
    id: uuidv4(),
    name,
    description: description || `Chat with ${name}`,
    systemPrompt,
    welcomeMessage: welcomeMessage || `Hello! I'm ${name}. How can I help you today?`,
    emoji: emoji || '🤖',
    features,
    isPublic,
    isPremium,
    creatorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      conversations: 0,
      messages: 0,
      subscribers: 0,
      revenue: 0
    }
  };
  
  creatorBots.push(newBot);
  
  res.status(201).json({ success: true, bot: newBot });
});

// Update an existing bot
router.put('/bot/:id', (req, res) => {
  const botId = req.params.id;
  const botIndex = creatorBots.findIndex(bot => bot.id === botId);
  
  // In production, would verify creator owns this bot
  
  if (botIndex === -1) {
    return res.status(404).json({ success: false, error: 'Bot not found' });
  }
  
  const updatedBot = {
    ...creatorBots[botIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  creatorBots[botIndex] = updatedBot;
  
  res.json({ success: true, bot: updatedBot });
});

// Delete a bot
router.delete('/bot/:id', (req, res) => {
  const botId = req.params.id;
  const botIndex = creatorBots.findIndex(bot => bot.id === botId);
  
  // In production, would verify creator owns this bot
  
  if (botIndex === -1) {
    return res.status(404).json({ success: false, error: 'Bot not found' });
  }
  
  creatorBots.splice(botIndex, 1);
  
  res.json({ success: true, message: 'Bot deleted successfully' });
});

// Get creator analytics
router.get('/analytics', (req, res) => {
  // In production, would get creatorId from auth token
  const creatorId = req.query.creatorId || 'demo-creator';
  
  const myBots = creatorBots.filter(bot => bot.creatorId === creatorId);
  
  // Calculate aggregated stats
  const analytics = {
    totalBots: myBots.length,
    totalConversations: myBots.reduce((sum, bot) => sum + bot.stats.conversations, 0),
    totalMessages: myBots.reduce((sum, bot) => sum + bot.stats.messages, 0),
    totalSubscribers: myBots.reduce((sum, bot) => sum + bot.stats.subscribers, 0),
    totalRevenue: myBots.reduce((sum, bot) => sum + bot.stats.revenue, 0),
    popularBots: myBots.sort((a, b) => b.stats.conversations - a.stats.conversations).slice(0, 3)
  };
  
  res.json({ success: true, analytics });
});

// Get payout information
router.get('/payouts', (req, res) => {
  // In production, would get creatorId from auth token and fetch from database
  res.json({
    success: true,
    payouts: [
      {
        id: 'payout_1',
        amount: 124.50,
        status: 'paid',
        date: '2025-06-15T00:00:00Z'
      },
      {
        id: 'payout_2',
        amount: 87.25,
        status: 'pending',
        date: '2025-07-15T00:00:00Z'
      }
    ],
    payoutMethod: {
      type: 'stripe',
      connected: true,
      lastFour: '4242'
    }
  });
});

// Connect Stripe account
router.post('/connect-stripe', (req, res) => {
  // In production, would initiate Stripe Connect flow
  res.json({
    success: true,
    redirectUrl: 'https://connect.stripe.com/express/oauth/authorize?client_id=ca_example'
  });
});

// Error handling for creator routes
router.use((err, req, res, next) => {
  console.error('Creator API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An error occurred while processing your request'
      : err.message
  });
});

// Export both the router and getCreatorBots function
const creatorRouter = express.Router();
creatorRouter.use('/', router);

// Export as a single object with both router and getCreatorBots
module.exports = creatorRouter;
module.exports.getCreatorBots = getCreatorBots;
