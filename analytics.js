const express = require('express');
const { PostHog } = require('posthog-node');
const router = express.Router();

// Initialize PostHog client if API key is available
const posthog = process.env.POSTHOG_API_KEY 
  ? new PostHog(process.env.POSTHOG_API_KEY, { 
      host: process.env.POSTHOG_HOST || 'https://app.posthog.com' 
    })
  : null;

// Analytics event tracking
router.post('/event', (req, res) => {
  try {
    const { event, properties, userId, sessionId } = req.body;

    if (!event) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    // Log locally for debugging
    console.log('📊 Analytics event:', {
      event,
      properties,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString()
    });

    // Send to PostHog if configured
    if (posthog) {
      try {
        posthog.capture({
          distinctId: userId || sessionId || 'anonymous-' + Date.now(),
          event: event,
          properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            source: 'themebotpark-api'
          }
        });
      } catch (posthogError) {
        console.error('PostHog error:', posthogError);
      }
    }

    res.json({
      success: true,
      message: 'Event recorded successfully'
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to record event',
      message: error.message
    });
  }
});

// Batch event tracking
router.post('/events', (req, res) => {
  try {
    const { events, userId, sessionId } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Events array is required' });
    }

    console.log(`📊 Analytics batch: ${events.length} events`);

    // Send batch to PostHog if configured
    if (posthog) {
      try {
        const distinctId = userId || sessionId || 'anonymous-' + Date.now();
        
        events.forEach(({ event, properties }) => {
          posthog.capture({
            distinctId,
            event,
            properties: {
              ...properties,
              timestamp: new Date().toISOString(),
              source: 'themebotpark-api'
            }
          });
        });
      } catch (posthogError) {
        console.error('PostHog batch error:', posthogError);
      }
    }

    res.json({
      success: true,
      message: `${events.length} events recorded successfully`
    });
  } catch (error) {
    console.error('Analytics batch error:', error);
    res.status(500).json({
      error: 'Failed to record events',
      message: error.message
    });
  }
});

// User identification
router.post('/identify', (req, res) => {
  try {
    const { userId, properties } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log('👤 User identified:', { userId, properties });

    // Send to PostHog if configured
    if (posthog) {
      try {
        posthog.identify({
          distinctId: userId,
          properties: {
            ...properties,
            identifiedAt: new Date().toISOString()
          }
        });
      } catch (posthogError) {
        console.error('PostHog identify error:', posthogError);
      }
    }

    res.json({
      success: true,
      message: 'User identified successfully'
    });
  } catch (error) {
    console.error('Analytics identify error:', error);
    res.status(500).json({
      error: 'Failed to identify user',
      message: error.message
    });
  }
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'Analytics API ready',
    providers: {
      posthog: {
        configured: !!process.env.POSTHOG_API_KEY,
        host: process.env.POSTHOG_HOST || 'https://app.posthog.com'
      },
      googleAnalytics: {
        configured: !!process.env.GA_MEASUREMENT_ID
      }
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Graceful shutdown for PostHog
process.on('SIGTERM', () => {
  if (posthog) {
    posthog.shutdown();
  }
});

module.exports = router;