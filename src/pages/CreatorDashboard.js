import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import SEOHead from '../components/SEOHead';
import '../styles/theme.css';

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
  const { user, isAuthenticated, isLoading: authLoading } = useUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch creator data
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchCreatorData = async () => {
      setIsLoading(true);
      try {
        // Use the authenticated user's ID instead of demo-creator
        const userId = user.id;
        console.log('Fetching creator data for user ID:', userId);
        
        const apiBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
        
        // Try to fetch real creator data
        const [analyticsRes, myBotsRes, payoutsRes] = await Promise.allSettled([
          fetch(`${apiBase}/api/creator/analytics?creatorId=${userId}`),
          fetch(`${apiBase}/api/creator/my-bots?creatorId=${userId}`),
          fetch(`${apiBase}/api/creator/payouts?creatorId=${userId}`)
        ]);
        
        // Handle analytics
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
          const analyticsData = await analyticsRes.value.json();
          setAnalytics(analyticsData.analytics || getDefaultAnalytics());
        } else {
          console.log('Using default analytics data');
          setAnalytics(getDefaultAnalytics());
        }
        
        // Handle bots
        if (myBotsRes.status === 'fulfilled' && myBotsRes.value.ok) {
          const myBotsData = await myBotsRes.value.json();
          setMyBots(myBotsData.bots || []);
        } else {
          console.log('No existing bots found, starting with empty list');
          setMyBots([]);
        }
        
        // Handle payouts
        if (payoutsRes.status === 'fulfilled' && payoutsRes.value.ok) {
          const payoutsData = await payoutsRes.value.json();
          setPayouts(payoutsData || getDefaultPayouts());
        } else {
          console.log('Using default payouts data');
          setPayouts(getDefaultPayouts());
        }
        
      } catch (error) {
        console.error('Error fetching creator data:', error);
        // Use default data as fallback
        setAnalytics(getDefaultAnalytics());
        setMyBots([]);
        setPayouts(getDefaultPayouts());
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreatorData();
  }, [user?.id]);

  const handleConnectStripe = async () => {
    if (!user?.id) return;
    
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/creator/connect-stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ creatorId: user.id })
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
    
    if (!user?.id) return;
    
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/creator/bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...newBot,
          creatorId: user.id
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
      const apiBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/creator/bot/${botId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
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

  if (authLoading || isLoading) {
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

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="dashboard">
        <SEOHead 
          title="Creator Dashboard - ThemeBotPark"
          description="Manage your AI bots, track performance, and monitor revenue in the ThemeBotPark creator portal."
          noindex={true}
        />
        <div className="dashboard-auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access your creator dashboard.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Go to Login
          </button>
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
                <p className="stat-value">${typeof analytics.totalRevenue === 'number' ? analytics.totalRevenue.toFixed(2) : '0.00'}</p>
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
                        <span className="stat-value">${typeof bot.stats.revenue === 'number' ? bot.stats.revenue.toFixed(2) : '0.00'}</span>
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
                        <td>${typeof payout.amount === 'number' ? payout.amount.toFixed(2) : '0.00'}</td>
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

// Helper functions for default data
const getDefaultAnalytics = () => ({
  totalBots: 0,
  totalConversations: 0,
  totalMessages: 0,
  totalSubscribers: 0,
  totalRevenue: 0,
  popularBots: []
});

const getDefaultPayouts = () => ({
  payouts: [],
  payoutMethod: {
    type: 'stripe',
    connected: false,
    lastFour: null
  }
});