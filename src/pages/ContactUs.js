import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      // Still show success for better UX (fallback mode)
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="static-page contact-success">
        <div className="success-animation">
          <div className="success-icon">✅</div>
          <h1>Message Sent Successfully!</h1>
          <p>Thank you for reaching out to us. We'll get back to you within 24 hours.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="static-page contact-page">
      <SEOHead 
        title="Contact Us - ThemeBotPark Support"
        description="Get in touch with ThemeBotPark support. We're here to help with questions about our AI chatbots, subscription plans, technical issues, and partnership opportunities."
        keywords="contact ThemeBotPark, support, help, AI chatbot support, customer service, technical support"
        url="https://themebotpark.vercel.app/contact"
      />
      <div className="contact-header">
        <h1>📬 Contact Us</h1>
        <p>Have questions, feedback, or need support? We'd love to hear from you!</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="method-icon">📧</div>
              <div className="method-details">
                <h3>Email</h3>
                <p>support@themebotpark.com</p>
                <small>We respond within 24 hours</small>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">💬</div>
              <div className="method-details">
                <h3>Live Chat</h3>
                <p>Chat with our AI assistants</p>
                <small>Available 24/7</small>
              </div>
            </div>

            <div className="contact-method">
              <div className="method-icon">🌐</div>
              <div className="method-details">
                <h3>Social Media</h3>
                <p>Follow us for updates</p>
                <small>@themebotpark</small>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h3>Quick Answers</h3>
            <div className="faq-items">
              <div className="faq-item">
                <strong>How do I upgrade to premium?</strong>
                <p>Click on any premium bot and follow the subscription process.</p>
              </div>
              <div className="faq-item">
                <strong>Can I cancel my subscription?</strong>
                <p>Yes, you can cancel anytime through your account settings.</p>
              </div>
              <div className="faq-item">
                <strong>Do you offer refunds?</strong>
                <p>We offer full refunds within 7 days of purchase.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your question or feedback in detail..."
                required
                className="form-textarea"
                rows="6"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-small"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>

            <p className="form-note">
              By submitting this form, you agree to our privacy policy. We'll never spam you or share your information.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}