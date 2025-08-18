const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { env } = require('./config/env');

if (env.stripe.webhookSecret && env.stripe.secretKey) {
  const stripe = require('stripe')(env.stripe.secretKey);
  // Stripe requires raw body for webhook signature verification
  router.post('/webhook/stripe', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.stripe.webhookSecret);
    } catch (err) {
      console.error('[StripeWebhook] Signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    const { type } = event;
    switch (type) {
      case 'checkout.session.completed':
        console.log('[StripeWebhook] Checkout completed:', event.data.object.id);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        console.log(`[StripeWebhook] Subscription event: ${type}`);
        break;
      default:
        if (env.logLevel === 'debug') console.log('[StripeWebhook] Unhandled event:', type);
    }
    res.json({ received: true });
  });
} else {
  router.post('/webhook/stripe', (req, res) => {
    res.status(501).json({ error: 'Stripe webhook not configured' });
  });
}

module.exports = router;