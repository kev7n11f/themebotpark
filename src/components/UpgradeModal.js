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
      priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID || 'price_1QfCWjFqLK5Bra1A3pQAGqPz', // Replace with your Stripe price ID
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
      priceId: process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID || 'price_1QfCXAFqLK5Bra1AY8xQ9m2K', // Replace with your Stripe price ID
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
        throw new Error('Stripe is not configured. Please add your Stripe publishable key to environment variables.');
      }

      console.log('Starting Stripe checkout...', {
        priceId: plans[selectedPlan].priceId,
        hasStripeKey: !!stripeKey
      });

      if (!stripeKey) {
        throw new Error('Stripe publishable key is missing. Please configure REACT_APP_STRIPE_PUBLISHABLE_KEY in your environment variables.');
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      
      console.log('Making Stripe API call...');
      const data = await api.createStripeSession(
        plans[selectedPlan].priceId,
        `${window.location.origin}/subscription-success`,
        `${window.location.origin}/chat`,
        selectedPlan // Pass the plan name as a fallback
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
      
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message?.includes('publishable key')) {
        errorMessage = 'Payment system configuration error. Please contact support.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message?.includes('session')) {
        errorMessage = 'Unable to create payment session. Please try again or contact support.';
      } else if (!errorMessage || errorMessage === 'Failed to fetch') {
        errorMessage = 'Unable to connect to payment system. Please try again in a moment.';
      }
      
      setError(errorMessage);
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