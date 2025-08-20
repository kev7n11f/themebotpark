// Initialize Stripe only if API key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

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
      status: 'Stripe API ready',
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
        return res.status(500).json({
          success: false,
          error: 'Stripe secret key not configured'
        });
      }

      // Accept either direct priceId or a logical plan name (e.g., 'monthly' | 'yearly' | 'basic' | 'pro' | 'premium')
      const { priceId: bodyPriceId, plan, successUrl, cancelUrl } = req.body || {};

      // Build plan -> priceId mapping from env
      const priceMap = {
        // Logical aliases used by the client
        monthly: process.env.STRIPE_PRICE_MONTHLY,
        yearly: process.env.STRIPE_PRICE_YEARLY,
        // Backwards-compatible plan names
        basic: process.env.STRIPE_PRICE_BASIC,
        pro: process.env.STRIPE_PRICE_PRO,
        premium: process.env.STRIPE_PRICE_PREMIUM,
      };

      let priceId = bodyPriceId;
      if (!priceId && plan) {
        priceId = priceMap[plan];
      }

      if (!priceId) {
        const availablePlans = Object.keys(priceMap)
          .filter((k) => !!priceMap[k])
          .join(', ') || 'none';
        return res.status(400).json({
          success: false,
          error: 'Missing priceId or invalid plan',
          details: { receivedPlan: plan || null, availablePlans }
        });
      }

      // Determine URLs with sensible fallbacks
      const clientUrl = process.env.CLIENT_URL || process.env.PUBLIC_URL || '';
      const resolvedSuccess = (process.env.STRIPE_SUCCESS_URL || successUrl || (clientUrl ? clientUrl + '/subscription-success' : null));
      const resolvedCancel = (process.env.STRIPE_CANCEL_URL || cancelUrl || (clientUrl ? clientUrl + '/chat' : null));

      if (!resolvedSuccess || !resolvedCancel) {
        return res.status(400).json({
          success: false,
          error: 'Missing success or cancel URL and no defaults available. Provide successUrl and cancelUrl in the request or set CLIENT_URL/PUBLIC_URL.'
        });
      }

      if (!stripe) {
        return res.status(500).json({ success: false, error: 'Stripe SDK not initialized' });
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
        success_url: `${resolvedSuccess}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: resolvedCancel,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        customer_creation: 'always',
      });

      console.log('Stripe session created successfully:', {
        sessionId: session.id,
        url: session.url
      });

      return res.json({ 
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
      return res.status(500).json({ 
        error: error.message,
        type: error.type || 'unknown_error',
        success: false
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
