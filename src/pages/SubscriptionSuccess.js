import React, { useEffect, useState } from 'react';

export default function SubscriptionSuccess() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mark user as subscribed (in production, verify with Stripe webhook)
    localStorage.setItem('hasSubscription', 'true');
    localStorage.setItem('messageCount', '0'); // Reset message count
    
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleContinue = () => {
    window.location.href = '/chat';
  };

  return (
    <section className="subscription-success">
      <div className="success-container">
        {loading ? (
          <div className="loading-animation">
            <div className="spinner"></div>
            <h2>Processing your subscription...</h2>
            <p>Please wait while we activate your premium access.</p>
          </div>
        ) : (
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h1>Welcome to Premium!</h1>
            <p>Your subscription has been activated successfully.</p>
            
            <div className="premium-features">
              <h3>You now have access to:</h3>
              <ul>
                <li>✅ Unlimited chat with all bots</li>
                <li>✅ Priority response times</li>
                <li>✅ Advanced AI personalities</li>
                <li>✅ Chat history & memory</li>
                <li>✅ Premium support</li>
              </ul>
            </div>

            <button onClick={handleContinue} className="continue-button">
              Start Chatting with Premium Bots
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
