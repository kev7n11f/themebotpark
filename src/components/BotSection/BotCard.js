import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Star, 
  Zap, 
  Crown, 
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleTryChat = () => {
    localStorage.setItem('activeBot', botId);
    window.location.href = '/chat';
  };

  const getBotTheme = (botId) => {
    const themes = {
      'RainMaker': 'rainmaker',
      'HeartSync': 'heartsync', 
      'FixItFrank': 'fixitfrank',
      'TellItLikeItIs': 'tellitlikeitis'
    };
    return themes[botId] || 'default';
  };

  const theme = getBotTheme(botId);
  const isPremium = tier === 'premium';

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <motion.div
      className={`bot-card ${theme} ${isPremium ? 'premium' : 'free'} ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-100px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Premium Badge */}
      {isPremium && (
        <motion.div 
          className="premium-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
        >
          <Crown size={16} />
          <span>Premium</span>
        </motion.div>
      )}

      {/* Card Header with Image */}
      <div className="bot-card-header">
        <div className="bot-image-container">
          <motion.img
            src={image}
            alt={title}
            className={`bot-image ${imageLoaded ? 'loaded' : ''}`}
            variants={imageVariants}
            initial="hidden"
            animate={imageLoaded ? "visible" : "hidden"}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="image-overlay">
            <div className="overlay-content">
              <Sparkles className="sparkle-icon" />
            </div>
          </div>
        </div>
        
        {/* Stats */}
        {stats && Object.keys(stats).length > 0 && (
          <div className="bot-stats">
            {stats.conversations && (
              <div className="stat">
                <span className="stat-value">{stats.conversations}</span>
                <span className="stat-label">Chats</span>
              </div>
            )}
            {stats.rating && (
              <div className="stat">
                <Star size={14} fill="currentColor" />
                <span className="stat-value">{stats.rating}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="bot-card-content">
        <div className="bot-header-text">
          <h3 className="bot-title">{title}</h3>
          <p className="bot-description">{description}</p>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className="bot-features">
            <h4 className="features-title">
              <Zap size={16} />
              Specialties
            </h4>
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-item"
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Check size={14} />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Personality Traits */}
        {personality && Object.keys(personality).length > 0 && (
          <div className="bot-personality">
            <h4 className="personality-title">Personality</h4>
            <div className="personality-traits">
              {personality.traits?.map((trait, index) => (
                <span key={index} className="trait-tag">{trait}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="bot-card-footer">
        {!isPremium && (
          <div className="free-badge">
            <Sparkles size={14} />
            <span>Free to use</span>
          </div>
        )}
        
        <motion.button
          className={`chat-button ${isPremium ? 'premium' : 'free'}`}
          onClick={handleTryChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle size={18} />
          <span>Start Chat</span>
          <motion.div
            className="button-arrow"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* Animated Background Elements */}
      <div className="card-bg-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>
    </motion.div>
  );
};

export default BotCard;
