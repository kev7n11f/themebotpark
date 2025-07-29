const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const catchAllLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// JSON parsing middleware
app.use(express.json());

// API routes - simplified for development
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ThemeBotPark API is running' });
});

// Creator endpoints
app.get('/api/creator/bots', (req, res) => {
  res.json({ 
    success: true, 
    bots: [
      {
        id: 'bot1',
        name: 'FitnessFriend',
        description: 'Your personal fitness coach',
        emoji: '💪',
        features: ['Workout Plans', 'Nutrition Advice'],
        isPublic: true,
        isPremium: true
      },
      {
        id: 'bot2',
        name: 'StudyBuddy',
        description: 'Study smarter, not harder',
        emoji: '📚',
        features: ['Subject Explanations', 'Practice Problems'],
        isPublic: true,
        isPremium: false
      }
    ]
  });
});

// Serve React build in production
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', catchAllLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🟢 ThemeBotPark Server running on port ${PORT}`));
