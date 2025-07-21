import React from 'react';

export default function BotSection({ title, description, image, botId, features = [], tier = 'free' }) {
  const handleTryChat = () => {
    localStorage.setItem('activeBot', botId);
    window.location.href = '/chat';
  };

  return (
    <div className={`bot-section ${tier === 'premium' ? 'premium-bot' : ''}`} id={botId}>
      {tier === 'premium' && (
        <div className="premium-badge">
          <span>⭐ Premium</span>
        </div>
      )}
      
      <img src={image} alt={title} className="bot-header-img" />
      
      <div className="bot-content">
        <h2 className="bot-title">{title}</h2>
        <p className="bot-description">{description}</p>
        
        {features.length > 0 && (
          <div className="bot-features">
            <h4>Specialties:</h4>
            <div className="features-tags">
              {features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="bot-actions">
          <button 
            className={`btn ${tier === 'premium' ? 'btn-premium' : 'btn-primary'}`}
            onClick={handleTryChat}
          >
            Try Chat {tier === 'premium' ? '⭐' : ''}
          </button>
          
          {tier === 'free' && (
            <span className="free-badge">Free to use</span>
          )}
        </div>
      </div>
    </div>
  );
}