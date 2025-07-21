import React, { useEffect, useState } from 'react';
import ScrollWrapper from '../components/ScrollWrapper';
import SlideMenu from '../components/SlideMenu';
import RainMaker from '../components/BotSection/RainMaker';
import HeartSync from '../components/BotSection/HeartSync';
import FixItFrank from '../components/BotSection/FixItFrank';
import TellItLikeItIs from '../components/BotSection/TellItLikeItIs';
import BotSection from '../components/BotSection/BotSection';
import UserHeader from '../components/UserHeader';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <ScrollWrapper>
      <div className={`homepage ${isVisible ? 'fade-in' : ''}`}>
        {/* Navigation */}
        <nav className="main-nav">
          <div className="nav-brand">
            <h1>🤖 ThemeBotPark</h1>
          </div>
          <UserHeader />
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">🚀 Powered by AI</span>
            </div>
            <h1 className="hero-title">
              Welcome to <span className="text-gradient">ThemeBotPark</span>
            </h1>
            <p className="hero-subtitle">
              Your AI-powered playground featuring unique bot personalities designed to help you
              solve problems, generate ideas, and get honest insights.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">4</span>
                <span className="stat-label">AI Personalities</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Conversations</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Available</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="floating-card card-1">💡 Ideas</div>
              <div className="floating-card card-2">🛠️ Solutions</div>
              <div className="floating-card card-3">💓 Insights</div>
              <div className="floating-card card-4">🌧️ Strategy</div>
            </div>
          </div>
        </section>

        {/* Bot Sections */}
        <section className="bots-section">
          <div className="section-header">
            <h2>Meet Your AI Companions</h2>
            <p>Each bot has a unique personality designed for different needs</p>
          </div>

          <BotSection
            title="RainMaker 🌧️"
            description="Strategic AI focused on crafting and launching income-generating ideas. Get clarity, focus, and business insight."
            image="https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/rainmaker-header_sqm8lk.jpg"
            botId="RainMaker"
            features={["Business Strategy", "Revenue Ideas", "Market Analysis", "Growth Tactics"]}
            tier="free"
          />

          <BotSection
            title="HeartSync 💓"
            description="Empathetic AI that reveals patterns in love, purpose, and relationships. Experience emotional intelligence and reflection."
            image="https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/heartsync-header_h8m8lz.jpg"
            botId="HeartSync"
            features={["Relationship Guidance", "Emotional Intelligence", "Life Purpose", "Personal Growth"]}
            tier="premium"
          />

          <BotSection
            title="FixItFrank 🛠️"
            description="Clever, sarcastic, and skilled technical troubleshooter. Get to the root of problems efficiently with humor."
            image="https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/fixitfrank-header_awutmy.jpg"
            botId="FixItFrank"
            features={["Technical Support", "Problem Solving", "Debugging", "System Optimization"]}
            tier="free"
          />

          <BotSection
            title="TellItLikeItIs 🧨"
            description="Unfiltered truth-teller delivering blunt insights with integrity. No sugarcoating—just clarity."
            image="https://res.cloudinary.com/dphrjjzl7/image/upload/v1737447306/tellitlikeitis-header_pbgdpf.jpg"
            botId="TellItLikeItIs"
            features={["Honest Feedback", "Reality Check", "Direct Advice", "Truth Telling"]}
            tier="premium"
          />
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Why Choose ThemeBotPark?</h2>
            <p>Experience the future of AI-powered conversations</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Advanced AI</h3>
              <p>Powered by GPT-3.5 Turbo for intelligent, context-aware conversations</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Unique Personalities</h3>
              <p>Each bot has distinct traits, expertise, and communication styles</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Memory & Context</h3>
              <p>Bots remember your conversations and provide personalized responses</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Responses</h3>
              <p>Get real-time answers and insights without delay</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your conversations are encrypted and never shared</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Chat anywhere, anytime on any device</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Chatting?</h2>
            <p>Join thousands of users already getting insights from our AI companions</p>
            <div className="cta-buttons">
              <button
                className="btn btn-primary glow"
                onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              >
                Try Free Bots
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </ScrollWrapper>
  );
}
