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

    // Accept either a direct priceId or a logical plan name
    const { priceId: bodyPriceId, plan, successUrl, cancelUrl } = req.body;

    let priceId = bodyPriceId;

    // If plan provided, map from env-configured prices
    if (!priceId && plan) {
      priceId = env.stripe.prices[plan];
    }

    if (!priceId) {
      const availablePlans = Object.keys(env.stripe.prices).filter(Boolean).join(', ') || 'none';
      return res.status(400).json({
        success: false,
        error: 'Missing priceId or invalid plan',
        details: {
          receivedPlan: plan || null,
          availablePlans
        }
      });
    }

    if (env.logLevel === 'debug') {
      console.log(`[Stripe] Creating checkout for priceId: ${priceId}${plan ? ` (plan: ${plan})` : ''}`);
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