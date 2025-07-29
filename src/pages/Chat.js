import React, { useEffect, useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import SEOHead from '../components/SEOHead';

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

  // Premium bots that require subscription
  const premiumBots = ['HeartSync', 'TellItLikeItIs'];
  const freeMessageLimit = 3;

  const getWelcomeMessage = (botName) => {
    const welcomes = {
      RainMaker: "Ready to brainstorm some income-generating ideas? Let's make it rain! 🌧️💰",
      HeartSync: "I'm here to help you understand your deeper patterns. What's on your heart? 💓",
      FixItFrank: "Got a problem that needs fixing? Let's troubleshoot this thing! 🛠️",
      TellItLikeItIs: "Ready for some unfiltered truth? Ask me anything - no sugarcoating! 🧨"
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mode: bot,
          message: currentMessage,
          messages: messages,
          userId: userId
        })
      });

      const data = await response.json();
      
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.response || "I'm having trouble responding right now. Please try again!",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error sending message:', error);
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
      uid = 'user_' + Math.random().toString(36).substring(2, 15);
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
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: activeBot })
    })
      .then(res => {
        console.log('API response status:', res.status);
        if (!res.ok) {
          throw new Error('Failed to load bot data');
        }
        return res.json();
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
        setMessages([{
          id: 0,
          sender: 'system',
          text: 'An error occurred while loading the bot. Please try again later.',
          timestamp: new Date()
        }]);
      });

  }, []);

  if (!bot) {
    return <div className="loading">Loading bot...</div>;
  }

  if (messages.length === 0) {
    return <div className="no-messages">No messages yet. Start the conversation!</div>;
  }

  return (
    <section className="chat-page">
      <SEOHead 
        title={`Chat with ${bot} - AI Conversation`}
        description={`Have an intelligent conversation with ${bot}, an AI bot with a unique personality. ${getWelcomeMessage(bot)}`}
        keywords={`${bot}, AI chat, ${bot} bot, artificial intelligence conversation, AI assistant, chatbot`}
        url={`https://themebotpark.vercel.app/chat?bot=${bot}`}
        noindex={true}
      />
      <div className="chat-header">
        <h1>Chat with {bot}</h1>
        <div className="header-actions">
          <span className="message-limit">{getMessageLimitText()}</span>
          <button onClick={() => window.history.back()} className="back-button">← Back to Bots</button>
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
                <p className="typing">Thinking...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={shouldDisableInput() ? 'Subscribe to continue chatting...' : `Message ${bot}...`}
              className="chat-input"
              rows="3"
              disabled={shouldDisableInput()}
            />
            <button 
              onClick={shouldDisableInput() ? () => setShowPaywall(true) : sendMessage} 
              disabled={(!inputMessage.trim() || isLoading) && !shouldDisableInput()}
              className="send-button"
            >
              {shouldDisableInput() ? 'Subscribe' : isLoading ? 'Sending...' : 'Send'}
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
