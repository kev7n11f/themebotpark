const { env } = require('../config/env');

const stripe = require('stripe')(env.stripe.secretKey);

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { customerId } = req.body;

    try {
      // Get customer's active subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 10,
      });

      const hasActiveSubscription = subscriptions.data.length > 0;

      res.json({ 
        hasActiveSubscription,
        subscriptions: subscriptions.data 
      });
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
