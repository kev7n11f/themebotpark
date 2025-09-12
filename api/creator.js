// Creator API endpoints for bot creation, analytics, and payouts
const express = require('express');

// This is a Vercel serverless function that also works as Express middleware
const createCreatorHandler = () => {
  const router = express.Router();

  // In-memory storage for demo (replace with real database in production)
  let creatorBots = [
    {
      id: 'demo-bot-1',
      name: 'MoodMaster',
      emoji: '😊',
      description: 'A mood-lifting companion that specializes in brightening your day with humor and positivity.',
      creatorId: 'demo-creator',
      systemPrompt: 'You are MoodMaster, a cheerful and uplifting AI companion. Your goal is to brighten people\'s days with humor, positivity, and emotional support. Always respond with warmth and try to find the silver lining in any situation.',
      welcomeMessage: 'Hey there! I\'m MoodMaster, your personal mood-lifting companion! Ready to turn that frown upside down? 😊',
      features: ['Mood Enhancement', 'Humor Therapy', 'Positive Psychology', 'Emotional Support'],
      isPublic: true,
      isPremium: false,
      rating: 4.7,
      conversationCount: 2540,
      createdAt: new Date('2025-08-15'),
      lastUpdated: new Date('2025-09-01')
    },
    {
      id: 'demo-bot-2', 
      name: 'StudyBuddy',
      emoji: '📚',
      description: 'Your academic companion for study strategies, note-taking tips, and motivation for learning.',
      creatorId: 'demo-creator',
      systemPrompt: 'You are StudyBuddy, an academic support AI focused on helping students learn effectively. Provide study strategies, explain concepts clearly, and keep users motivated in their educational journey.',
      welcomeMessage: 'Hello, fellow learner! I\'m StudyBuddy, here to help you ace your studies! What subject shall we tackle today? 📚',
      features: ['Study Strategies', 'Concept Explanation', 'Learning Motivation', 'Note-Taking Tips'],
      isPublic: true,
      isPremium: true,
      rating: 4.9,
      conversationCount: 1873,
      createdAt: new Date('2025-07-22'),
      lastUpdated: new Date('2025-08-28')
    }
  ];

  let creatorAnalytics = {
    totalConversations: 4413,
    totalRevenue: 287.50,
    monthlyActiveUsers: 856,
    averageRating: 4.8,
    totalBots: 2,
    monthlyStats: {
      conversations: 1205,
      revenue: 89.25,
      newUsers: 234,
      growth: '+12%'
    }
  };

  let creatorPayouts = {
    currentBalance: 287.50,
    lastPayout: {
      amount: 156.75,
      date: new Date('2025-08-31'),
      status: 'completed'
    },
    nextPayout: {
      estimatedAmount: 287.50,
      date: new Date('2025-09-30'),
      status: 'pending'
    },
    stripeConnected: false
  };

  // GET /api/creator/analytics
  router.get('/analytics', (req, res) => {
    const { creatorId } = req.query;
    
    if (!creatorId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Creator ID is required' 
      });
    }

    // In production, fetch real analytics from database
    res.json({
      success: true,
      analytics: creatorAnalytics
    });
  });

  // GET /api/creator/my-bots
  router.get('/my-bots', (req, res) => {
    const { creatorId } = req.query;
    
    if (!creatorId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Creator ID is required' 
      });
    }

    // In production, filter bots by actual creator ID
    const bots = creatorBots.filter(bot => bot.creatorId === creatorId);
    
    res.json({
      success: true,
      bots: bots
    });
  });

  // GET /api/creator/payouts
  router.get('/payouts', (req, res) => {
    const { creatorId } = req.query;
    
    if (!creatorId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Creator ID is required' 
      });
    }

    res.json({
      success: true,
      ...creatorPayouts
    });
  });

  // POST /api/creator/bot - Create new bot
  router.post('/bot', (req, res) => {
    const { name, description, systemPrompt, welcomeMessage, emoji, features, isPublic, isPremium, creatorId } = req.body;
    
    if (!name || !description || !systemPrompt || !creatorId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, systemPrompt, creatorId'
      });
    }

    const newBot = {
      id: `bot-${Date.now()}`,
      name: name.trim(),
      emoji: emoji || '🤖',
      description: description.trim(),
      creatorId,
      systemPrompt: systemPrompt.trim(),
      welcomeMessage: welcomeMessage || `Hello! I'm ${name}, how can I help you today?`,
      features: Array.isArray(features) ? features.filter(f => f.trim()) : [],
      isPublic: Boolean(isPublic),
      isPremium: Boolean(isPremium),
      rating: 5.0,
      conversationCount: 0,
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    creatorBots.push(newBot);
    
    res.json({
      success: true,
      bot: newBot,
      message: 'Bot created successfully!'
    });
  });

  // PUT /api/creator/bot/:botId - Update existing bot
  router.put('/bot/:botId', (req, res) => {
    const { botId } = req.params;
    const { name, description, systemPrompt, welcomeMessage, emoji, features, isPublic, isPremium, creatorId } = req.body;
    
    const botIndex = creatorBots.findIndex(bot => bot.id === botId && bot.creatorId === creatorId);
    
    if (botIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found or you do not have permission to edit it'
      });
    }

    // Update bot with new data
    const updatedBot = {
      ...creatorBots[botIndex],
      name: name?.trim() || creatorBots[botIndex].name,
      description: description?.trim() || creatorBots[botIndex].description,
      systemPrompt: systemPrompt?.trim() || creatorBots[botIndex].systemPrompt,
      welcomeMessage: welcomeMessage?.trim() || creatorBots[botIndex].welcomeMessage,
      emoji: emoji || creatorBots[botIndex].emoji,
      features: Array.isArray(features) ? features.filter(f => f.trim()) : creatorBots[botIndex].features,
      isPublic: isPublic !== undefined ? Boolean(isPublic) : creatorBots[botIndex].isPublic,
      isPremium: isPremium !== undefined ? Boolean(isPremium) : creatorBots[botIndex].isPremium,
      lastUpdated: new Date()
    };

    creatorBots[botIndex] = updatedBot;
    
    res.json({
      success: true,
      bot: updatedBot,
      message: 'Bot updated successfully!'
    });
  });

  // DELETE /api/creator/bot/:botId - Delete bot
  router.delete('/bot/:botId', (req, res) => {
    const { botId } = req.params;
    const { creatorId } = req.body;
    
    const botIndex = creatorBots.findIndex(bot => bot.id === botId && bot.creatorId === creatorId);
    
    if (botIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found or you do not have permission to delete it'
      });
    }

    const deletedBot = creatorBots.splice(botIndex, 1)[0];
    
    res.json({
      success: true,
      message: `Bot "${deletedBot.name}" deleted successfully!`
    });
  });

  // POST /api/creator/connect-stripe
  router.post('/connect-stripe', (req, res) => {
    const { creatorId } = req.body;
    
    if (!creatorId) {
      return res.status(400).json({
        success: false,
        error: 'Creator ID is required'
      });
    }

    // In production, create actual Stripe Connect account
    // For demo, just simulate the connection
    const redirectUrl = `https://connect.stripe.com/express/onboarding/demo-account`;
    
    res.json({
      success: true,
      redirectUrl,
      message: 'Stripe Connect account setup initiated'
    });
  });

  // GET /api/creator/public-bots - Get all public bots for homepage
  router.get('/public-bots', (req, res) => {
    const publicBots = creatorBots.filter(bot => bot.isPublic);
    
    res.json({
      success: true,
      bots: publicBots
    });
  });

  // POST /api/creator/rate-bot - Rate a bot
  router.post('/rate-bot', (req, res) => {
    const { botId, rating, userId } = req.body;
    
    if (!botId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Bot ID and valid rating (1-5) are required'
      });
    }

    const bot = creatorBots.find(b => b.id === botId);
    if (!bot) {
      return res.status(404).json({
        success: false,
        error: 'Bot not found'
      });
    }

    // In production, store individual ratings and calculate average
    // For demo, just simulate updating the rating
    const currentRating = bot.rating || 5.0;
    const totalRatings = Math.floor(bot.conversationCount / 10) || 1;
    const newRating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
    
    bot.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal place
    
    res.json({
      success: true,
      message: 'Rating submitted successfully!',
      newRating: bot.rating
    });
  });

  return router;
};

// Export for Vercel serverless function
module.exports = async (req, res) => {
  const router = createCreatorHandler();
  return new Promise((resolve, reject) => {
    router(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};

// Export for Express server
module.exports.router = createCreatorHandler();