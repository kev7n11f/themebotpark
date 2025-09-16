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
      console.log('=== STRIPE API DEBUG START ===');
      console.log('Request headers:', JSON.stringify(req.headers, null, 2));
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('Environment check:', {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...',
        nodeEnv: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
        vercelEnv: process.env.VERCEL_ENV
      });

      if (!process.env.STRIPE_SECRET_KEY) {
        console.error('❌ Missing STRIPE_SECRET_KEY environment variable');
        return res.status(500).json({
          success: false,
          error: 'Stripe secret key not configured'
        });
      }

      if (!stripe) {
        console.error('❌ Stripe SDK not initialized despite having key');
        return res.status(500).json({
          success: false,
          error: 'Stripe SDK initialization failed'
        });
      }

      // Accept either direct priceId or a logical plan name (e.g., 'monthly' | 'yearly' | 'basic' | 'pro' | 'premium')
      const { priceId: bodyPriceId, plan, successUrl, cancelUrl } = req.body || {};

      console.log('Request payload:', { 
        bodyPriceId, 
        plan, 
        successUrl, 
        cancelUrl 
      });

      // Build plan -> priceId mapping from env
      const priceMap = {
        // Logical aliases used by the client
        monthly: process.env.STRIPE_PRICE_MONTHLY || process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID,
        yearly: process.env.STRIPE_PRICE_YEARLY || process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID,
        // Backwards-compatible plan names
        basic: process.env.STRIPE_PRICE_BASIC,
        pro: process.env.STRIPE_PRICE_PRO,
        premium: process.env.STRIPE_PRICE_PREMIUM,
      };

      console.log('Price mapping:', JSON.stringify(priceMap, null, 2));

      let priceId = bodyPriceId;
      if (!priceId && plan) {
        priceId = priceMap[plan];
        console.log(`✅ Mapped plan '${plan}' to priceId: ${priceId}`);
      }

      if (!priceId) {
        const availablePlans = Object.keys(priceMap)
          .filter((k) => !!priceMap[k])
          .join(', ') || 'none';
        console.error('❌ No valid priceId found:', { 
          receivedPlan: plan, 
          bodyPriceId, 
          availablePlans 
        });
        return res.status(400).json({
          success: false,
          error: 'Missing priceId or invalid plan',
          details: { receivedPlan: plan || null, availablePlans }
        });
      }

      // Determine URLs with sensible fallbacks
      const clientUrl = process.env.CLIENT_URL || process.env.PUBLIC_URL || 'https://themebotpark.vercel.app';
      const resolvedSuccess = (process.env.STRIPE_SUCCESS_URL || successUrl || (clientUrl + '/subscription-success'));
      const resolvedCancel = (process.env.STRIPE_CANCEL_URL || cancelUrl || (clientUrl + '/chat'));

      console.log('Resolved URLs:', {
        resolvedSuccess,
        resolvedCancel,
        clientUrl
      });

      if (!resolvedSuccess || !resolvedCancel) {
        console.error('❌ Missing success or cancel URLs');
        return res.status(400).json({
          success: false,
          error: 'Missing success or cancel URL and no defaults available. Provide successUrl and cancelUrl in the request or set CLIENT_URL/PUBLIC_URL.'
        });
      }

      console.log('✅ Creating Stripe checkout session with:', {
        priceId,
        successUrl: resolvedSuccess,
        cancelUrl: resolvedCancel,
        mode: 'subscription'
      });

      // Create Stripe checkout session
      console.log('🔄 Attempting to create Stripe checkout session...');
      const sessionParams = {
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
        // customer_creation is not needed for subscription mode - Stripe handles it automatically
      };
      
      console.log('Session parameters:', JSON.stringify(sessionParams, null, 2));
      
      const session = await stripe.checkout.sessions.create(sessionParams);

      console.log('✅ Stripe session created successfully:', {
        sessionId: session.id,
        url: session.url,
        status: session.status,
        mode: session.mode
      });
      console.log('=== STRIPE API DEBUG END ===');

      return res.json({ 
        sessionId: session.id, 
        url: session.url,
        success: true
      });
    } catch (error) {
      console.log('=== STRIPE ERROR DEBUG START ===');
      console.error('❌ Stripe error details:', {
        message: error.message,
        type: error.type,
        code: error.code,
        param: error.param,
        decline_code: error.decline_code,
        charge: error.charge,
        payment_method: error.payment_method,
        request_log_url: error.request_log_url,
        stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack
      });
      console.log('=== STRIPE ERROR DEBUG END ===');
      
      return res.status(500).json({ 
        error: error.message,
        type: error.type || 'unknown_error',
        code: error.code || null,
        success: false,
        debug: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          type: error.type,
          code: error.code,
          param: error.param
        } : null
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
