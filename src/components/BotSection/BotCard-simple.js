import React from 'react';
import './BotCard.css';

const BotCard = ({ 
  title, 
  description, 
  image, 
  botId, 
  features = [], 
  tier = 'free',
  personality = {},
  stats = {},
  className = ''
}) => {
  const handleTryChat = () => {
    localStorage.setItem('activeBot', botId);
    window.location.href = '/chat';
  };

  const getBotTheme = (botId) => {
    const themes = {
      'RainMaker': 'rainmaker',
      'HeartSync': 'heartsync', 
      'FixItFrank': 'fixitfrank',
      'TellItLikeItIs': 'tellitlikeitis',
      'SafeSpace': 'safespace',
      'CreativeCanvas': 'creativecanvas',
      'WellnessWise': 'wellnesswise'
    };
    return themes[botId] || 'default';
  };

  const theme = getBotTheme(botId);
  const isPremium = tier === 'premium';

  return (
    <div 
      className={`bot-card bot-card--${theme} ${isPremium ? 'bot-card--premium' : ''} ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTryChat();
        }
      }}
      aria-label={`${title} chatbot - ${description}`}
    >
      {/* Premium Badge */}
      {isPremium && (
        <div className="bot-card__premium-badge">
          <span className="premium-icon">★</span>
          Premium
        </div>
      )}

      {/* Bot Image */}
      <div className="bot-card__image-container">
        <div className="bot-card__image-frame">
          <img 
            src={image} 
            alt={title}
            className="bot-card__image"
            loading="lazy"
          />
          <div className="bot-card__image-overlay">
            <div className="chat-icon">💬</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bot-card__content">
        <div className="bot-card__header">
          <h3 className="bot-card__title">{title}</h3>
          {stats.rating && (
            <div className="bot-card__rating">
              <span className="rating-star">⭐</span>
              <span className="rating-value">{stats.rating}</span>
            </div>
          )}
        </div>

        <p className="bot-card__description">{description}</p>

        {/* Personality Traits */}
        {personality.traits && (
          <div className="bot-card__traits">
            {personality.traits.slice(0, 3).map((trait, index) => (
              <span key={index} className="trait-tag">
                {trait}
              </span>
            ))}
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="bot-card__features">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-check">✓</span>
                <span className="feature-text">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {stats.conversations && (
          <div className="bot-card__stats">
            <div className="stat-item">
              <span className="stat-label">Conversations</span>
              <span className="stat-value">{stats.conversations.toLocaleString()}</span>
            </div>
            {stats.satisfaction && (
              <div className="stat-item">
                <span className="stat-label">Satisfaction</span>
                <span className="stat-value">{stats.satisfaction}%</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button 
          className="bot-card__action"
          onClick={handleTryChat}
          aria-label={`Start chatting with ${title}`}
        >
          <span>Try {title}</span>
          <span className="action-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default BotCard;
