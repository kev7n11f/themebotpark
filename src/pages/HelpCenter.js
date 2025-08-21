import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpArticles = [
    {
      id: 1,
      title: "Getting Started with ThemeBotPark",
      category: "getting-started",
      content: "Learn how to create your account and start chatting with AI bots.",
      tags: ["account", "signup", "basics"]
    },
    {
      id: 2,
      title: "How to Choose the Right Bot",
      category: "bots",
      content: "Understanding different bot personalities and their specializations.",
      tags: ["bots", "personalities", "selection"]
    },
    {
      id: 3,
      title: "Managing Your Subscription",
      category: "billing",
      content: "How to upgrade, downgrade, or cancel your subscription.",
      tags: ["subscription", "billing", "payment"]
    },
    {
      id: 4,
      title: "Troubleshooting Chat Issues",
      category: "technical",
      content: "Common solutions for chat problems and connectivity issues.",
      tags: ["chat", "troubleshooting", "bugs"]
    },
    {
      id: 5,
      title: "Creating Your First Bot",
      category: "creators",
      content: "Step-by-step guide to creating and publishing your own bot.",
      tags: ["creator", "bot-creation", "publishing"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'bots', name: 'Bot Usage', icon: '🤖' },
    { id: 'billing', name: 'Billing & Subscription', icon: '💳' },
    { id: 'technical', name: 'Technical Support', icon: '🛠️' },
    { id: 'creators', name: 'Creator Program', icon: '🎨' }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="static-page help-center">
      <SEOHead 
        title="Help Center - ThemeBotPark"
        description="Find answers to common questions and get help with ThemeBotPark. Browse our comprehensive help articles and support resources."
      />
      
      <div className="container">
        <header className="page-header">
          <h1>🆘 Help Center</h1>
          <p className="page-subtitle">
            Find answers to common questions and get help with ThemeBotPark.
          </p>
        </header>

        {/* Search and Filter */}
        <div className="help-search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <a href="/contact" className="action-card">
              <span className="action-icon">📧</span>
              <h3>Contact Support</h3>
              <p>Get personalized help from our support team</p>
            </a>
            <a href="#chat-status" className="action-card">
              <span className="action-icon">⚡</span>
              <h3>Service Status</h3>
              <p>Check if all systems are running normally</p>
            </a>
            <a href="/dashboard" className="action-card">
              <span className="action-icon">👤</span>
              <h3>Account Settings</h3>
              <p>Manage your profile and preferences</p>
            </a>
            <a href="#community" className="action-card">
              <span className="action-icon">💬</span>
              <h3>Community Forum</h3>
              <p>Connect with other users and creators</p>
            </a>
          </div>
        </div>

        {/* Help Articles */}
        <div className="help-articles">
          <h2>Help Articles</h2>
          {filteredArticles.length > 0 ? (
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <div key={article.id} className="article-card">
                  <h3>{article.title}</h3>
                  <p>{article.content}</p>
                  <div className="article-tags">
                    {article.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <button className="read-more-btn">Read More →</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No articles found</h3>
              <p>Try adjusting your search terms or browse different categories.</p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I start using ThemeBotPark?</h3>
              <p>Simply create a free account and choose from our available bot personalities. You can start chatting immediately!</p>
            </div>
            <div className="faq-item">
              <h3>What's the difference between free and premium?</h3>
              <p>Free users get limited access to basic bots. Premium subscribers enjoy unlimited conversations with all bot personalities.</p>
            </div>
            <div className="faq-item">
              <h3>Can I create my own bot?</h3>
              <p>Yes! Join our Creator Program to design, test, and monetize your own unique bot personalities.</p>
            </div>
            <div className="faq-item">
              <h3>Is my conversation data private?</h3>
              <p>Absolutely. Your conversations are private and encrypted. We never share your personal conversations with other users.</p>
            </div>
            <div className="faq-item">
              <h3>How do I cancel my subscription?</h3>
              <p>You can cancel anytime in your account settings. Your access continues until the end of your billing period.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer refunds?</h3>
              <p>Yes, we offer refunds within 30 days of purchase for unused portions of your subscription.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="support-section">
          <h2>Still Need Help?</h2>
          <div className="support-options">
            <div className="support-card">
              <span className="support-icon">📧</span>
              <h3>Email Support</h3>
              <p>Get detailed help via email</p>
              <p className="support-time">Response within 24-48 hours</p>
              <a href="/contact" className="support-btn">Contact Us</a>
            </div>
            <div className="support-card">
              <span className="support-icon">🎫</span>
              <h3>Submit a Ticket</h3>
              <p>Create a support ticket for complex issues</p>
              <p className="support-time">Response within 12-24 hours</p>
              <a href="/contact" className="support-btn">Create Ticket</a>
            </div>
            <div className="support-card">
              <span className="support-icon">💬</span>
              <h3>Community Help</h3>
              <p>Get help from other users</p>
              <p className="support-time">Community-driven support</p>
              <a href="#community" className="support-btn">Join Community</a>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="status-section">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-indicator status-ok"></span>
              <span className="status-label">Chat Service</span>
              <span className="status-value">Operational</span>
            </div>
            <div className="status-item">
              <span className="status-indicator status-ok"></span>
              <span className="status-label">User Authentication</span>
              <span className="status-value">Operational</span>
            </div>
            <div className="status-item">
              <span className="status-indicator status-ok"></span>
              <span className="status-label">Payment Processing</span>
              <span className="status-value">Operational</span>
            </div>
            <div className="status-item">
              <span className="status-indicator status-ok"></span>
              <span className="status-label">API Services</span>
              <span className="status-value">Operational</span>
            </div>
          </div>
        </div>

        {/* Helpful Resources */}
        <div className="resources-section">
          <h2>Helpful Resources</h2>
          <div className="resources-grid">
            <a href="/about" className="resource-card">
              <span className="resource-icon">ℹ️</span>
              <h3>About ThemeBotPark</h3>
              <p>Learn about our mission and features</p>
            </a>
            <a href="/privacy" className="resource-card">
              <span className="resource-icon">🔐</span>
              <h3>Privacy Policy</h3>
              <p>How we protect your data and privacy</p>
            </a>
            <a href="/terms" className="resource-card">
              <span className="resource-icon">📜</span>
              <h3>Terms of Service</h3>
              <p>Our terms and conditions</p>
            </a>
            <a href="#api-docs" className="resource-card">
              <span className="resource-icon">🔧</span>
              <h3>API Documentation</h3>
              <p>Technical documentation for developers</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}