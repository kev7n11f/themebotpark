import React, { useEffect, useState, useRef } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import VoiceControls from '../components/VoiceControls';
import SpeechInput from '../components/SpeechInput';
import SEOHead from '../components/SEOHead';
import { getBotImage } from '../utils/botImages';
import { api } from '../utils/api';
import './Chat.css';

// Lightweight typing indicator
function TypingDots() {
  return (
    <span className="typing-dots" aria-live="polite" aria-label="Bot is typing">
      <span>.</span><span>.</span><span>.</span>
    </span>
  );
}

function Chat() {
  const [bot, setBot] = useState('');
  // const [prompt, setPrompt] = useState(''); // TODO: Implement prompt functionality
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState(null); // Error state for handling errors
  const [userId, setUserId] = useState('');
  const [booting, setBooting] = useState(true);
  
  // Ref for auto-scrolling to latest messages
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Premium bots that require subscription
  const premiumBots = ['HeartSync', 'TellItLikeItIs', 'CreativeCanvas', 'WellnessWise'];
  const freeMessageLimit = 10;

  const getWelcomeMessage = (botName) => {
    const welcomes = {
      RainMaker: "Ready to brainstorm some income-generating ideas? Let's make it rain! 🌧️💰",
      HeartSync: "I'm here to help you understand your deeper patterns. What's on your heart? 💓",
      FixItFrank: "Got a problem that needs fixing? Let's troubleshoot this thing! 🛠️",
      TellItLikeItIs: "Ready for some unfiltered truth? Ask me anything - no sugarcoating! 🧨",
      SafeSpace: "Welcome to your safe space. I'm here to help bridge understanding and mediate conversations. What situation would you like to talk through? 🕊️",
      CreativeCanvas: "Ready to unleash your creativity? Let's paint outside the lines and explore new possibilities! 🎨✨",
      WellnessWise: "Take a deep breath and welcome to your wellness journey. How can I support your well-being today? 🧘💚"
    };
    return welcomes[botName] || "How can I help you today?";
  };

  const checkSubscriptionStatus = () => {
    // Check subscription from localStorage
    const subscription = localStorage.getItem('hasSubscription');
    const hasValidSub = subscription === 'true';
    setHasSubscription(hasValidSub);
    
    const count = parseInt(localStorage.getItem('messageCount') || '0');
    setMessageCount(count);
    
    console.log('Subscription status:', {
      hasSubscription: hasValidSub,
      messageCount: count,
      subscription: subscription
    });
  };

  const checkPaywallRequired = () => {
    // Re-check subscription status first
    const currentSubscription = localStorage.getItem('hasSubscription') === 'true';
    const currentCount = parseInt(localStorage.getItem('messageCount') || '0');
    
    // Update state if changed
    if (currentSubscription !== hasSubscription) {
      setHasSubscription(currentSubscription);
    }
    if (currentCount !== messageCount) {
      setMessageCount(currentCount);
    }
    
    // Show paywall if:
    // 1. Bot is premium and user has no subscription
    // 2. User has exceeded free message limit on any bot
    if (premiumBots.includes(bot) && !currentSubscription) {
      return true;
    }
    
    if (!currentSubscription && currentCount >= freeMessageLimit) {
      return true;
    }
    
    return false;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check if paywall should be shown before sending
    if (checkPaywallRequired()) {
      setShowPaywall(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Update message count only if not subscribed
    if (!hasSubscription) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      localStorage.setItem('messageCount', newCount.toString());
    }

    try {
      const data = await api.sendChatMessage(bot, currentMessage, messages, userId);

      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: (data && typeof data.response === 'string') ? data.response : "I'm having trouble responding right now. Please try again!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      const errorResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Sorry, I'm experiencing technical difficulties. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageLimitText = () => {
    // Re-check current subscription status
    const currentSubscription = localStorage.getItem('hasSubscription') === 'true';
    const currentCount = parseInt(localStorage.getItem('messageCount') || '0');
    
    if (currentSubscription) return '';
    
    const remaining = freeMessageLimit - currentCount;
    if (remaining <= 0) return 'Free messages used up - subscribe for unlimited chat!';
    return `${remaining} free messages remaining`;
  };

  const shouldDisableInput = () => {
    // Only disable if paywall is required AND user doesn't have subscription
    const currentSubscription = localStorage.getItem('hasSubscription') === 'true';
    return checkPaywallRequired() && !currentSubscription;
  };

  // Generate or retrieve user ID on component mount
  useEffect(() => {
    let uid = localStorage.getItem('userId');
    if (!uid) {
      const array = new Uint8Array(12);
      window.crypto.getRandomValues(array);
      uid = 'user_' + Array.from(array, byte => byte.toString(36).padStart(2, '0')).join('').substring(0, 13);
      localStorage.setItem('userId', uid);
    }
    setUserId(uid);
  }, []);

  useEffect(() => {
    console.log('Initializing Chat component...');

    const activeBot = localStorage.getItem('activeBot') || 'RainMaker';
    console.log('Active bot:', activeBot);
    setBot(activeBot);

    // Check subscription status
    checkSubscriptionStatus();

    // Load bot personality
    api.call('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ mode: activeBot })
    })
      .then(data => {
        console.log('API response data:', data);
        // setPrompt(data.systemPrompt || ''); // TODO: Implement prompt functionality
        setMessages([{
          id: 1,
          sender: 'bot',
          text: `Hello! I'm ${activeBot}. ${getWelcomeMessage(activeBot)}`,
          timestamp: new Date()
        }]);
      })
      .catch(err => {
        console.error('Error loading bot:', err);
        // Graceful local fallback welcome
        setMessages([{
          id: 1,
          sender: 'bot',
          text: `Hello! I'm ${activeBot}. ${getWelcomeMessage(activeBot)}`,
          timestamp: new Date()
        }]);
        // keep a subtle error state for banner, but don’t block UX
        setError('Failed to load chat data. Using offline mode.');
      })
      .finally(() => setBooting(false));

  }, []);

  if (!bot || booting) {
    return (
      <section className="chat-page fade-in" aria-busy="true" aria-live="polite">
        <div className="chat-header">
          <div>
            <div className="skeleton-line w-60 skeleton" />
            <div className="skeleton-line w-40 skeleton" style={{ marginTop: '0.5rem' }} />
          </div>
          <div className="header-actions">
            <span className="skeleton-line w-20 skeleton" style={{ height: '28px', borderRadius: '8px' }} />
            <span className="skeleton-line w-20 skeleton" style={{ height: '28px', borderRadius: '8px' }} />
          </div>
        </div>
        <div className="chat-container">
          <div className="chat-messages">
            <div className="message bot">
              <div className="message-content">
                <div className="skeleton-line w-80 skeleton" />
                <div className="skeleton-line w-60 skeleton" style={{ marginTop: '0.5rem' }} />
              </div>
            </div>
            <div className="message user">
              <div className="message-content">
                <div className="skeleton-line w-70 skeleton" />
              </div>
            </div>
            <div className="message bot">
              <div className="message-content">
                <div className="skeleton-line w-50 skeleton" />
                <div className="skeleton-line w-30 skeleton" style={{ marginTop: '0.5rem' }} />
              </div>
            </div>
          </div>
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <div className="skeleton-line w-80 skeleton" style={{ height: '60px', borderRadius: '12px' }} />
              <div className="skeleton-line w-20 skeleton" style={{ height: '60px', borderRadius: '12px' }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (messages.length === 0) {
    return <div className="no-messages">No messages yet. Start the conversation!</div>;
  }

  return (
    <section className="chat-page fade-in" data-bot={bot}>
      <SEOHead 
        title={`Chat with ${bot} - AI Conversation`}
        description={`Have an intelligent conversation with ${bot}, an AI bot with a unique personality. ${getWelcomeMessage(bot)}`}
        keywords={`${bot}, AI chat, ${bot} bot, artificial intelligence conversation, AI assistant, chatbot`}
        url={`https://themebotpark.vercel.app/chat?bot=${bot}`}
        noindex={true}
      />
      {error && (
        <div className="error-banner" style={{
          background: '#fee',
          color: '#c33',
          padding: '1rem',
          margin: '1rem 0',
          border: '1px solid #fcc',
          borderRadius: '4px'
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: '1rem',
              background: 'transparent',
              border: 'none',
              color: '#c33',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
      <div className="chat-header">
        <div className="chat-header-content">
          <div className="bot-info">
            <img 
              src={getBotImage(bot, 'avatar')} 
              alt={`${bot} avatar`}
              className="bot-avatar"
              onError={(e) => {
                e.target.src = getBotImage(bot, 'fallback');
              }}
            />
            <div>
              <h1>Chat with {bot}</h1>
              <p className="bot-status">Online • Ready to help</p>
            </div>
          </div>
          <div className="header-actions">
            <VoiceControls 
              botId={bot} 
              lastMessage={messages.length > 0 ? messages[messages.length - 1]?.text : ''} 
              autoSpeak={messages.length > 0 && messages[messages.length - 1]?.sender === 'bot'}
            />
            <span className="message-limit">{getMessageLimitText()}</span>
            <button onClick={() => window.history.back()} className="back-button">← Back to Bots</button>
          </div>
        </div>
      </div>
      
      <div className="chat-container">
        {premiumBots.includes(bot) && !hasSubscription && (
          <div className="premium-banner">
            <span>🌟 This is a premium bot. Subscribe for unlimited access!</span>
            <button onClick={() => setShowPaywall(true)} className="upgrade-btn">Upgrade</button>
          </div>
        )}

        <div className="chat-messages">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              {message.sender === 'bot' && (
                <img 
                  src={getBotImage(bot, 'avatar')} 
                  alt={`${bot} avatar`}
                  className="message-avatar"
                  onError={(e) => {
                    e.target.src = getBotImage(bot, 'fallback');
                  }}
                />
              )}
              <div className="message-content">
                <strong>{message.sender === 'bot' ? bot : 'You'}:</strong>
                <p>{message.text}</p>
                <small>{message.timestamp.toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <strong>{bot}:</strong>
                <p className="typing"><TypingDots /></p>
              </div>
            </div>
          )}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input-container">
          {/* Speech Input */}
          <SpeechInput 
            onSpeechResult={(transcript) => {
              setInputMessage(transcript);
              // Auto-send the message after speech input
              if (transcript.trim() && !shouldDisableInput() && !booting) {
                setTimeout(() => {
                  if (!isLoading) {
                    sendMessage();
                  }
                }, 500); // Small delay to show the transcript
              }
            }}
            disabled={shouldDisableInput() || booting || isLoading}
            botId={bot}
          />
          
          <div className="chat-input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={shouldDisableInput() ? 'Subscribe to continue chatting...' : `Message ${bot}...`}
              className="chat-input"
              rows="3"
              disabled={shouldDisableInput() || booting}
            />
            <button 
              onClick={shouldDisableInput() ? () => setShowPaywall(true) : sendMessage} 
              disabled={((!inputMessage.trim() || isLoading) && !shouldDisableInput()) || booting}
              className="send-button"
              aria-busy={isLoading}
            >
              {shouldDisableInput() ? 'Subscribe' : isLoading ? 'Sending' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={showPaywall} 
        onClose={() => {
          setShowPaywall(false);
          // Re-check subscription status when modal closes
          checkSubscriptionStatus();
        }}
        botName={bot}
      />
    </section>
  );
}

export default Chat;
