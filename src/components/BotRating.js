import React, { useState } from 'react';
import './BotRating.css';

const BotRating = ({ 
  botId, 
  currentRating = 5.0, 
  userRating = null, 
  onRate = null,
  readonly = false,
  size = 'medium'
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(userRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = async (rating) => {
    if (readonly || submittedRating) return;
    
    setIsSubmitting(true);
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3010';
      const response = await fetch(`${apiBase}/api/creator/rate-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          botId,
          rating,
          userId: 'demo-user' // In production, use actual user ID
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmittedRating(rating);
        if (onRate) {
          onRate(rating, data.newRating);
        }
      } else {
        console.error('Rating submission failed:', data.error);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || submittedRating || 0;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= displayRating;
      const isCurrentRating = i <= currentRating;
      
      stars.push(
        <button
          key={i}
          type="button"
          className={`
            star-button 
            ${size} 
            ${isFilled ? 'filled' : ''} 
            ${isCurrentRating ? 'current' : ''}
            ${readonly || submittedRating ? 'readonly' : 'interactive'}
            ${isSubmitting ? 'submitting' : ''}
          `}
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => !readonly && !submittedRating && setHoverRating(i)}
          onMouseLeave={() => !readonly && !submittedRating && setHoverRating(0)}
          disabled={readonly || submittedRating || isSubmitting}
          aria-label={`Rate ${i} star${i !== 1 ? 's' : ''}`}
        >
          <span className="star-icon">⭐</span>
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className={`bot-rating ${size}`}>
      <div className="stars-container">
        {renderStars()}
      </div>
      
      <div className="rating-info">
        <span className="current-rating">
          {currentRating.toFixed(1)}
        </span>
        
        {submittedRating && (
          <span className="user-rating-indicator">
            You rated: {submittedRating} star{submittedRating !== 1 ? 's' : ''}
          </span>
        )}
        
        {isSubmitting && (
          <span className="submitting-indicator">
            Submitting...
          </span>
        )}
      </div>
    </div>
  );
};

export default BotRating;