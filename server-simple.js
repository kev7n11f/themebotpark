const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`🟢 ThemeBotPark Server running on port ${PORT}`));
