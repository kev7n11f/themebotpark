const express = require('express');
const router = express.Router();
const { env } = require('./config/env');

// Initialize Stripe only if API key is available
const stripe = env.stripe.secretKey 
  ? require('stripe')(env.stripe.secretKey)
  : null;

// Stripe payment routes
router.get('/', (req, res) => {
  res.json({ 
    status: 'Stripe API ready',
    hasStripeKey: !!env.stripe.secretKey,
    environment: env.nodeEnv
  });
});

router.post('/', async (req, res) => {
  try {
    if (!env.stripe.secretKey) {
      return res.status(500).json({
        success: false,
        error: 'Stripe secret key not configured'
      });
    }

    const { plan, successUrl, cancelUrl } = req.body;

    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plan is required (basic, pro, or premium)'
      });
    }

    // Validate plan and get price ID
    const priceId = env.stripe.prices[plan];
    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: `Invalid plan: ${plan}. Available plans: ${Object.keys(env.stripe.prices).join(', ')}`
      });
    }

    if (env.logLevel === 'debug') {
      console.log(`[Stripe] Creating checkout for plan: ${plan}, priceId: ${priceId}`);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: (env.stripe.successUrl || successUrl || env.clientUrl + '/subscription-success') + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: env.stripe.cancelUrl || cancelUrl || env.clientUrl + '/subscription-cancelled',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
});

module.exports = router;