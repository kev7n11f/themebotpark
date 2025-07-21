const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ 
      status: 'Stripe API is working!',
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      environment: process.env.NODE_ENV || 'development'
    });
  }

  if (req.method === 'POST') {
    try {
      console.log('Stripe API called with:', {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        body: req.body
      });

      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Stripe secret key not configured');
      }

      const { priceId, successUrl, cancelUrl } = req.body;

      if (!priceId) {
        throw new Error('Price ID is required');
      }

      console.log('Creating Stripe checkout session...');

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
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        customer_creation: 'always',
      });

      console.log('Stripe session created successfully:', {
        sessionId: session.id,
        url: session.url
      });

      res.json({ 
        sessionId: session.id, 
        url: session.url,
        success: true
      });
    } catch (error) {
      console.error('Stripe error details:', {
        message: error.message,
        type: error.type,
        code: error.code,
        stack: error.stack
      });
      
      res.status(500).json({ 
        error: error.message,
        type: error.type || 'unknown_error',
        success: false
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
