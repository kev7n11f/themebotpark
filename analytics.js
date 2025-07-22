const express = require('express');
const router = express.Router();

// Analytics routes (PostHog event tracking)
router.post('/event', (req, res) => {
  // In production, this would send events to PostHog or similar
  console.log('Analytics event:', req.body);
  
  res.json({
    success: true,
    message: 'Event recorded'
  });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'Analytics API ready',
    provider: 'PostHog',
    configured: !!process.env.POSTHOG_KEY
  });
});

module.exports = router;