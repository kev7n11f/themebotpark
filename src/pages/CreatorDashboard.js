import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [myBots, setMyBots] = useState([]);
  const [payouts, setPayouts] = useState(null);
  const [showNewBotModal, setShowNewBotModal] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    systemPrompt: '',
    welcomeMessage: '',
    emoji: '🤖',
    features: [''],
    isPublic: false,
    isPremium: false
  });
  
  const navigate = useNavigate();

  // Fetch creator data
  useEffect(() => {
    const fetchCreatorData = async () => {
      setIsLoading(true);
      try {
        // In production, these would be real API calls
        const analyticsRes = await fetch('/api/creator/analytics?creatorId=demo-creator');
        const myBotsRes = await fetch('/api/creator/my-bots?creatorId=demo-creator');
        const payoutsRes = await fetch('/api/creator/payouts?creatorId=demo-creator');
        
        if (analyticsRes.ok && myBotsRes.ok && payoutsRes.ok) {
          const analyticsData = await analyticsRes.json();
          const myBotsData = await myBotsRes.json();
          const payoutsData = await payoutsRes.json();
          
          setAnalytics(analyticsData.analytics || demoAnalytics);
          setMyBots(myBotsData.bots || demoBots);
          setPayouts(payoutsData || demoPayouts);
        } else {
          // If API fails, use demo data
          setAnalytics(demoAnalytics);
          setMyBots(demoBots);
          setPayouts(demoPayouts);
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
        // Use demo data as fallback
        setAnalytics(demoAnalytics);
        setMyBots(demoBots);
        setPayouts(demoPayouts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreatorData();
  }, []);

  const handleConnectStripe = async () => {
    try {
      const response = await fetch('/api/creator/connect-stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ creatorId: 'demo-creator' })
      });
      
      const data = await response.json();
      
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
      alert('Failed to connect Stripe. Please try again later.');
    }
  };
  
  const handleCreateBot = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/creator/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newBot,
          creatorId: 'demo-creator'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMyBots([...myBots, data.bot]);
        setShowNewBotModal(false);
        setNewBot({
          name: '',
          description: '',
          systemPrompt: '',
          welcomeMessage: '',
          emoji: '🤖',
          features: [''],
          isPublic: false,
          isPremium: false
        });
      } else {
        alert(data.error || 'Failed to create bot');
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      alert('Failed to create bot. Please try again later.');
    }
  };
  
  const handleDeleteBot = async (botId) => {
    if (!window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/creator/bot/${botId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMyBots(myBots.filter(bot => bot.id !== botId));
      } else {
        alert(data.error || 'Failed to delete bot');
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
      alert('Failed to delete bot. Please try again later.');
    }
  };
  
  const handleBotFeatureChange = (index, value) => {
    const updatedFeatures = [...newBot.features];
    updatedFeatures[index] = value;
    setNewBot({ ...newBot, features: updatedFeatures });
  };
  
  const handleAddFeature = () => {
    setNewBot({ ...newBot, features: [...newBot.features, ''] });
  };
  
  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...newBot.features];
    updatedFeatures.splice(index, 1);
    setNewBot({ ...newBot, features: updatedFeatures });
  };

  if (isLoading) {
    return (
      <section className="dashboard">
        <SEOHead 
          title="Creator Dashboard - ThemeBotPark"
          description="Manage your AI bots, track performance, and monitor revenue in the ThemeBotPark creator portal."
          noindex={true}
        />
        <div className="dashboard-loader">
          <div className="spinner"></div>
          <p>Loading your creator dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <SEOHead 
        title="Creator Dashboard - ThemeBotPark"
        description="Manage your AI bots, track performance, and monitor revenue in the ThemeBotPark creator portal."
        noindex={true}
      />
      
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>🎨 Creator Portal</h1>
          <p className="subtitle">Create, manage, and monetize your AI bots</p>
        </div>
        
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowNewBotModal(true)}
          >
            Create New Bot
          </button>
          
          {!payouts.payoutMethod.connected && (
            <button 
              className="btn btn-secondary"
              onClick={handleConnectStripe}
            >
              Connect Stripe
            </button>
          )}
        </div>
      </header>
      
      <nav className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'my-bots' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-bots')}
        >
          My Bots
        </button>
        <button 
          className={`tab ${activeTab === 'payouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('payouts')}
        >
          Payouts
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Bots</h3>
                <p className="stat-value">{analytics.totalBots}</p>
              </div>
              
              <div className="stat-card">
                <h3>Conversations</h3>
                <p className="stat-value">{analytics.totalConversations}</p>
              </div>
              
              <div className="stat-card">
                <h3>Messages</h3>
                <p className="stat-value">{analytics.totalMessages}</p>
              </div>
              
              <div className="stat-card">
                <h3>Subscribers</h3>
                <p className="stat-value">{analytics.totalSubscribers}</p>
              </div>
              
              <div className="stat-card highlight">
                <h3>Revenue</h3>
                <p className="stat-value">${analytics.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="popular-bots-section">
              <h3>Popular Bots</h3>
              <div className="popular-bots">
                {analytics.popularBots.map(bot => (
                  <div className="popular-bot-card" key={bot.id}>
                    <div className="bot-emoji">{bot.emoji}</div>
                    <h4>{bot.name}</h4>
                    <p>{bot.stats.conversations} conversations</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('my-bots')}
                >
                  Manage Bots
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('payouts')}
                >
                  View Payouts
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/')}
                >
                  Visit Homepage
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'my-bots' && (
          <div className="my-bots-tab">
            <div className="tab-header">
              <h2>My Bots</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowNewBotModal(true)}
              >
                Create New Bot
              </button>
            </div>
            
            <div className="bots-grid">
              {myBots.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't created any bots yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowNewBotModal(true)}
                  >
                    Create Your First Bot
                  </button>
                </div>
              ) : (
                myBots.map(bot => (
                  <div className="bot-card" key={bot.id}>
                    <div className="bot-card-header">
                      <div className="bot-emoji">{bot.emoji}</div>
                      <div className="bot-badges">
                        {bot.isPublic && <span className="badge public">Public</span>}
                        {bot.isPremium && <span className="badge premium">Premium</span>}
                      </div>
                    </div>
                    
                    <h3>{bot.name}</h3>
                    <p className="bot-description">{bot.description}</p>
                    
                    <div className="bot-stats">
                      <div className="bot-stat">
                        <span className="stat-label">Conversations</span>
                        <span className="stat-value">{bot.stats.conversations}</span>
                      </div>
                      <div className="bot-stat">
                        <span className="stat-label">Subscribers</span>
                        <span className="stat-value">{bot.stats.subscribers}</span>
                      </div>
                      <div className="bot-stat">
                        <span className="stat-label">Revenue</span>
                        <span className="stat-value">${bot.stats.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="bot-actions">
                      <button className="btn btn-secondary">Edit</button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteBot(bot.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'payouts' && (
          <div className="payouts-tab">
            <div className="tab-header">
              <h2>Payouts</h2>
              {!payouts.payoutMethod.connected && (
                <button 
                  className="btn btn-primary"
                  onClick={handleConnectStripe}
                >
                  Connect Stripe
                </button>
              )}
            </div>
            
            <div className="payout-method">
              <h3>Payout Method</h3>
              {payouts.payoutMethod.connected ? (
                <div className="connected-method">
                  <p>
                    <span className="method-type">Stripe</span> 
                    <span className="method-status">Connected</span>
                  </p>
                  <p className="method-detail">Account ending in {payouts.payoutMethod.lastFour}</p>
                </div>
              ) : (
                <div className="empty-method">
                  <p>No payout method connected.</p>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleConnectStripe}
                  >
                    Connect Stripe
                  </button>
                </div>
              )}
            </div>
            
            <div className="payout-history">
              <h3>Payout History</h3>
              {payouts.payouts.length === 0 ? (
                <div className="empty-state">
                  <p>No payouts yet. Start earning by creating and publishing bots!</p>
                </div>
              ) : (
                <table className="payouts-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.payouts.map(payout => (
                      <tr key={payout.id}>
                        <td>{new Date(payout.date).toLocaleDateString()}</td>
                        <td>${payout.amount.toFixed(2)}</td>
                        <td>
                          <span className={`status ${payout.status}`}>
                            {payout.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="payout-info">
              <h3>Payout Information</h3>
              <div className="info-card">
                <p>
                  <strong>Payout Schedule:</strong> Monthly, on the 15th
                </p>
                <p>
                  <strong>Revenue Share:</strong> You receive 70% of subscription revenue attributed to your bots
                </p>
                <p>
                  <strong>Minimum Payout:</strong> $20.00
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>Creator Settings</h2>
            
            <div className="settings-card">
              <h3>Creator Profile</h3>
              <form className="settings-form">
                <div className="form-group">
                  <label htmlFor="creatorName">Creator Name</label>
                  <input 
                    type="text" 
                    id="creatorName" 
                    defaultValue="Demo Creator" 
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="creatorBio">Bio</label>
                  <textarea 
                    id="creatorBio" 
                    defaultValue="AI enthusiast creating helpful bots." 
                    className="form-input"
                    rows="3"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
            
            <div className="settings-card">
              <h3>Notification Preferences</h3>
              <div className="notification-settings">
                <div className="notification-option">
                  <label>
                    <input type="checkbox" defaultChecked /> 
                    Email me when I receive a payout
                  </label>
                </div>
                <div className="notification-option">
                  <label>
                    <input type="checkbox" defaultChecked /> 
                    Email me when I get a new subscriber
                  </label>
                </div>
                <div className="notification-option">
                  <label>
                    <input type="checkbox" defaultChecked /> 
                    Email me monthly performance reports
                  </label>
                </div>
                <button className="btn btn-primary">Save Preferences</button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showNewBotModal && (
        <div className="modal-overlay">
          <div className="modal new-bot-modal">
            <div className="modal-header">
              <h2>Create New Bot</h2>
              <button 
                className="close-button"
                onClick={() => setShowNewBotModal(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateBot} className="new-bot-form">
              <div className="form-group">
                <label htmlFor="botName">Bot Name*</label>
                <input 
                  type="text" 
                  id="botName" 
                  value={newBot.name}
                  onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  placeholder="e.g. FitnessFriend"
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="botEmoji">Emoji</label>
                <input 
                  type="text" 
                  id="botEmoji" 
                  value={newBot.emoji}
                  onChange={(e) => setNewBot({ ...newBot, emoji: e.target.value })}
                  placeholder="🤖"
                  maxLength="2"
                  className="form-input emoji-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="botDescription">Description</label>
                <input 
                  type="text" 
                  id="botDescription" 
                  value={newBot.description}
                  onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                  placeholder="e.g. Your personal fitness coach"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="botSystemPrompt">System Prompt*</label>
                <textarea 
                  id="botSystemPrompt" 
                  value={newBot.systemPrompt}
                  onChange={(e) => setNewBot({ ...newBot, systemPrompt: e.target.value })}
                  placeholder="e.g. You are FitnessFriend, a supportive AI fitness coach. You provide workout advice, nutritional guidance, and motivational support..."
                  required
                  className="form-input"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="botWelcomeMessage">Welcome Message</label>
                <textarea 
                  id="botWelcomeMessage" 
                  value={newBot.welcomeMessage}
                  onChange={(e) => setNewBot({ ...newBot, welcomeMessage: e.target.value })}
                  placeholder="e.g. Hello! I'm your personal fitness coach. How can I help you with your fitness journey today?"
                  className="form-input"
                  rows="2"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Features / Specialties</label>
                {newBot.features.map((feature, index) => (
                  <div className="feature-input" key={index}>
                    <input 
                      type="text" 
                      value={feature}
                      onChange={(e) => handleBotFeatureChange(index, e.target.value)}
                      placeholder="e.g. Workout Plans"
                      className="form-input"
                    />
                    {newBot.features.length > 1 && (
                      <button 
                        type="button" 
                        className="remove-feature"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-small"
                  onClick={handleAddFeature}
                >
                  + Add Feature
                </button>
              </div>
              
              <div className="form-group options">
                <div className="option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={newBot.isPublic}
                      onChange={(e) => setNewBot({ ...newBot, isPublic: e.target.checked })}
                    /> 
                    Make this bot public
                  </label>
                  <p className="option-help">Public bots appear in the bot marketplace</p>
                </div>
                
                <div className="option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={newBot.isPremium}
                      onChange={(e) => setNewBot({ ...newBot, isPremium: e.target.checked })}
                    /> 
                    Premium bot
                  </label>
                  <p className="option-help">Premium bots require a subscription</p>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowNewBotModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Bot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// Demo data for initial state
const demoAnalytics = {
  totalBots: 3,
  totalConversations: 245,
  totalMessages: 1876,
  totalSubscribers: 18,
  totalRevenue: 342.75,
  popularBots: [
    {
      id: 'bot1',
      name: 'FitnessFriend',
      emoji: '💪',
      stats: {
        conversations: 120,
        messages: 876,
        subscribers: 10,
        revenue: 186.50
      }
    },
    {
      id: 'bot2',
      name: 'StudyBuddy',
      emoji: '📚',
      stats: {
        conversations: 85,
        messages: 614,
        subscribers: 6,
        revenue: 112.25
      }
    },
    {
      id: 'bot3',
      name: 'MindfulMate',
      emoji: '🧘',
      stats: {
        conversations: 40,
        messages: 386,
        subscribers: 2,
        revenue: 44.00
      }
    }
  ]
};

const demoBots = [
  {
    id: 'bot1',
    name: 'FitnessFriend',
    description: 'Your personal fitness coach',
    systemPrompt: 'You are FitnessFriend, a supportive AI fitness coach. You provide workout advice, nutritional guidance, and motivational support...',
    welcomeMessage: 'Hello! I\'m your personal fitness coach. How can I help you with your fitness journey today?',
    emoji: '💪',
    features: ['Workout Plans', 'Nutrition Advice', 'Progress Tracking', 'Motivation'],
    isPublic: true,
    isPremium: true,
    creatorId: 'demo-creator',
    createdAt: '2025-05-01T00:00:00Z',
    updatedAt: '2025-06-15T00:00:00Z',
    stats: {
      conversations: 120,
      messages: 876,
      subscribers: 10,
      revenue: 186.50
    }
  },
  {
    id: 'bot2',
    name: 'StudyBuddy',
    description: 'Study smarter, not harder',
    systemPrompt: 'You are StudyBuddy, an educational AI tutor. You help explain complex topics, provide practice problems, and guide effective study methods...',
    welcomeMessage: 'Hi there! Ready to study more effectively? Tell me what subject you\'re working on!',
    emoji: '📚',
    features: ['Subject Explanations', 'Practice Problems', 'Study Techniques', 'Exam Prep'],
    isPublic: true,
    isPremium: false,
    creatorId: 'demo-creator',
    createdAt: '2025-05-15T00:00:00Z',
    updatedAt: '2025-06-10T00:00:00Z',
    stats: {
      conversations: 85,
      messages: 614,
      subscribers: 6,
      revenue: 112.25
    }
  },
  {
    id: 'bot3',
    name: 'MindfulMate',
    description: 'Your companion for mindfulness and meditation',
    systemPrompt: 'You are MindfulMate, a calming presence focused on mindfulness, meditation, and mental wellness...',
    welcomeMessage: 'Welcome to a moment of calm. How are you feeling today?',
    emoji: '🧘',
    features: ['Guided Meditations', 'Breathing Exercises', 'Stress Management', 'Sleep Assistance'],
    isPublic: true,
    isPremium: true,
    creatorId: 'demo-creator',
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z',
    stats: {
      conversations: 40,
      messages: 386,
      subscribers: 2,
      revenue: 44.00
    }
  }
];

const demoPayouts = {
  payouts: [
    {
      id: 'payout_1',
      amount: 124.50,
      status: 'paid',
      date: '2025-06-15T00:00:00Z'
    },
    {
      id: 'payout_2',
      amount: 87.25,
      status: 'pending',
      date: '2025-07-15T00:00:00Z'
    }
  ],
  payoutMethod: {
    type: 'stripe',
    connected: true,
    lastFour: '4242'
  }
};