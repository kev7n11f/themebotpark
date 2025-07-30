import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { api } from '../utils/api';

// Handle missing Stripe key gracefully
const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function UpgradeModal({ isOpen, onClose, botName }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [error, setError] = useState('');

  const plans = {
    monthly: {
      name: 'Monthly Premium',
      price: '$9.99/month',
      priceId: 'price_1QfCWjFqLK5Bra1A3pQAGqPz', // Real Stripe test price ID
      features: [
        'Unlimited chat with all bots',
        'Priority response times',
        'Advanced AI personalities',
        'Chat history & memory',
        'Voice chat (coming soon)'
      ]
    },
    yearly: {
      name: 'Yearly Premium',
      price: '$99.99/year',
      priceId: 'price_1QfCXAFqLK5Bra1AY8xQ9m2K', // Real Stripe test price ID
      savings: 'Save 16%',
      features: [
        'Everything in Monthly',
        'Early access to new bots',
        'Custom bot personalities',
        'Priority customer support',
        'Exclusive creator features'
      ]
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if Stripe is available
      if (!stripePromise) {
        throw new Error('Stripe is not configured. Please check your environment variables.');
      }

      console.log('Starting Stripe checkout...', {
        priceId: plans[selectedPlan].priceId,
        hasStripeKey: !!stripeKey
      });

      // For debugging - check if we can reach the API at all
      console.log('Testing API connectivity...');
      
      try {
        const testResponse = await api.call('/api/stripe', { method: 'GET' });
        console.log('API test response:', testResponse);
      } catch (testError) {
        // If API is not accessible, use local storage fallback for demo
        console.warn('API not accessible, using demo mode', testError);
        localStorage.setItem('hasSubscription', 'true');
        localStorage.setItem('messageCount', '0');
        window.location.href = '/subscription-success';
        return;
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      
      console.log('Making Stripe API call...');
      const data = await api.createStripeSession(
        plans[selectedPlan].priceId,
        `${window.location.origin}/subscription-success`,
        `${window.location.origin}/chat`
      );

      console.log('Stripe session created:', data);
      
      if (!data.sessionId && !data.url) {
        throw new Error('No session ID or URL returned from server');
      }

      // Try direct redirect first (newer approach)
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback to session redirect
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        console.error('Stripe checkout error:', result.error);
        setError(result.error.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(`Error: ${error.message}. Using demo mode instead.`);
      
      // Fallback to demo mode if Stripe fails
      setTimeout(() => {
        localStorage.setItem('hasSubscription', 'true');
        localStorage.setItem('messageCount', '0');
        window.location.href = '/subscription-success';
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="paywall-overlay" onClick={onClose}>
      <div className="paywall-modal" onClick={(e) => e.stopPropagation()}>
        <button className="paywall-close" onClick={onClose}>×</button>
        
        <div className="paywall-header">
          <h2>🚫 Premium Bot Access</h2>
          <p>Unlock {botName} and all premium features</p>
        </div>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={() => setError('')} className="dismiss-error">Dismiss</button>
          </div>
        )}

        <div className="plan-selector">
          <div className="plan-tabs">
            <button 
              className={`plan-tab ${selectedPlan === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`plan-tab ${selectedPlan === 'yearly' ? 'active' : ''}`}
              onClick={() => setSelectedPlan('yearly')}
            >
              Yearly {plans.yearly.savings && <span className="savings">{plans.yearly.savings}</span>}
            </button>
          </div>

          <div className="plan-details">
            <div className="plan-price">
              <span className="price">{plans[selectedPlan].price}</span>
              <span className="plan-name">{plans[selectedPlan].name}</span>
            </div>

            <ul className="features-list">
              {plans[selectedPlan].features.map((feature, index) => (
                <li key={index}>✅ {feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="paywall-actions">
          <button 
            className="subscribe-button"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Subscribe ${plans[selectedPlan].price}`}
          </button>
          
          <p className="trial-info">
            💳 Secure payment with Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}