import React from 'react';
import SEOHead from '../components/SEOHead';

export default function About() {
  return (
    <section className="static-page about-page">
      <SEOHead 
        title="About ThemeBotPark - AI Chatbot Platform"
        description="Learn about ThemeBotPark's mission to create AI chatbots with unique personalities. Discover our story, team, and vision for the future of AI conversation."
        keywords="about ThemeBotPark, AI chatbot platform, artificial intelligence, bot personalities, company story, AI innovation"
        url="https://themebotpark.vercel.app/about"
      />
      
      <div className="about-header">
        <h1>About ThemeBotPark</h1>
        <p className="lead">Where AI meets personality in meaningful conversations</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            At ThemeBotPark, we believe that AI should be more than just functional—it should be engaging, 
            relatable, and genuinely helpful. Our platform brings together AI chatbots with distinct 
            personalities, each designed to excel in specific areas of conversation and support.
          </p>
        </section>

        <section className="story-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2025 by Kevin Franklin, ThemeBotPark emerged from a simple observation: 
            while AI was becoming incredibly sophisticated, it often felt impersonal and generic. 
            We set out to change that by creating AI companions with unique voices, specialized 
            knowledge, and distinct approaches to problem-solving.
          </p>
        </section>

        <section className="bots-section">
          <h2>Meet Our Bot Family</h2>
          
          <div className="bot-profiles">
            <div className="bot-profile">
              <div className="bot-icon">🌧️</div>
              <h3>RainMaker</h3>
              <p>
                Your strategic business companion. RainMaker specializes in income generation, 
                marketing strategies, and entrepreneurial guidance. With a focus on practical, 
                actionable advice, RainMaker helps turn ideas into profitable ventures.
              </p>
            </div>

            <div className="bot-profile">
              <div className="bot-icon">💓</div>
              <h3>HeartSync</h3>
              <p>
                The empathetic relationship guide. HeartSync understands the complexities of 
                human emotions and relationships. Whether you're navigating love, friendship, 
                or personal growth, HeartSync offers compassionate insights and thoughtful advice.
              </p>
            </div>

            <div className="bot-profile">
              <div className="bot-icon">🛠️</div>
              <h3>FixItFrank</h3>
              <p>
                Your witty technical troubleshooter. FixItFrank combines deep technical knowledge 
                with a no-nonsense attitude and clever humor. From coding problems to system issues, 
                Frank gets to the root of the problem efficiently.
              </p>
            </div>

            <div className="bot-profile">
              <div className="bot-icon">🧨</div>
              <h3>TellItLikeItIs</h3>
              <p>
                The unfiltered truth-teller. When you need honest, direct feedback without 
                sugarcoating, TellItLikeItIs delivers reality checks with integrity. Perfect 
                for tough decisions and honest self-reflection.
              </p>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h4>🎯 Authenticity</h4>
              <p>Each bot has a genuine personality that shines through in every interaction.</p>
            </div>
            <div className="value-item">
              <h4>🔒 Privacy</h4>
              <p>Your conversations are private and secure. We respect your data and trust.</p>
            </div>
            <div className="value-item">
              <h4>🚀 Innovation</h4>
              <p>We continuously improve our AI to provide better, more helpful experiences.</p>
            </div>
            <div className="value-item">
              <h4>🤝 Accessibility</h4>
              <p>AI assistance should be available to everyone, which is why we offer free access.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-member">
            <h4>Kevin Franklin - Founder & AI Architect</h4>
            <p>
              With a passion for both technology and human connection, Kevin brings years of 
              experience in AI development and user experience design to create meaningful 
              digital relationships.
            </p>
          </div>
        </section>

        <section className="cta-section">
          <h2>Join Our Community</h2>
          <p>Ready to experience AI with personality? Start chatting with our bots today!</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => window.location.href = '/chat'}>Try Our Bots</button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/contact'}>Contact Us</button>
          </div>
        </section>
      </div>
    </section>
  );
}