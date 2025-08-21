import React from 'react';
import SEOHead from '../components/SEOHead';

export default function Privacy() {
  return (
    <div className="static-page">
      <SEOHead 
        title="Privacy Policy - ThemeBotPark"
        description="Learn how ThemeBotPark protects your privacy and handles your personal data. Our comprehensive privacy policy explains data collection, usage, and your rights."
      />
      
      <div className="container">
        <header className="page-header">
          <h1>🔐 Privacy Policy</h1>
          <p className="page-subtitle">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="last-updated">Last updated: January 1, 2025</p>
        </header>

        <div className="content-sections">
          <section className="content-section">
            <h2>Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>When you create an account or use our services, we collect:</p>
            <ul>
              <li><strong>Account Information:</strong> Email address, username, and password (encrypted)</li>
              <li><strong>Profile Information:</strong> Any optional profile details you provide</li>
              <li><strong>Communication Data:</strong> Messages you send through our contact forms</li>
              <li><strong>Subscription Data:</strong> Billing information processed through Stripe (we don't store payment details)</li>
            </ul>

            <h3>Usage Information</h3>
            <p>We automatically collect information about how you use our platform:</p>
            <ul>
              <li><strong>Conversation Data:</strong> Your chats with AI bots to provide continuity and improve responses</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system</li>
              <li><strong>Analytics Data:</strong> Page views, session duration, and feature usage (anonymized)</li>
              <li><strong>Cookies:</strong> Small files stored on your device for authentication and preferences</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>How We Use Your Information</h2>
            
            <p>We use your information to:</p>
            <ul>
              <li><strong>Provide Services:</strong> Deliver AI conversations and platform functionality</li>
              <li><strong>Account Management:</strong> Create and maintain your account</li>
              <li><strong>Improve Experience:</strong> Personalize and enhance our services</li>
              <li><strong>Customer Support:</strong> Respond to your questions and provide assistance</li>
              <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security threats</li>
              <li><strong>Legal Compliance:</strong> Meet legal obligations and enforce our terms</li>
              <li><strong>Analytics:</strong> Understand usage patterns to improve our platform</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Information Sharing</h2>
            
            <p>We do not sell your personal information. We may share information in these limited circumstances:</p>
            
            <h3>Service Providers</h3>
            <ul>
              <li><strong>OpenAI:</strong> Your messages are sent to OpenAI to generate AI responses</li>
              <li><strong>Stripe:</strong> Payment processing for subscriptions (they have their own privacy policy)</li>
              <li><strong>Email Service:</strong> To send transactional emails and notifications</li>
              <li><strong>Analytics:</strong> Anonymized usage data for service improvement</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose information when required by law, legal process, or to:</p>
            <ul>
              <li>Comply with court orders or government requests</li>
              <li>Protect the rights, property, or safety of ThemeBotPark, users, or others</li>
              <li>Investigate potential violations of our Terms of Service</li>
              <li>Prevent fraud or security threats</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Data Security</h2>
            
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit using TLS/SSL</li>
              <li><strong>Authentication:</strong> Secure password hashing with bcrypt</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Regular Audits:</strong> Ongoing security assessments and updates</li>
              <li><strong>Third-party Security:</strong> Our service providers maintain their own security standards</li>
            </ul>
            
            <p>However, no internet transmission is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </section>

          <section className="content-section">
            <h2>Your Privacy Rights</h2>
            
            <p>You have the following rights regarding your personal information:</p>
            
            <h3>Access and Control</h3>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
            </ul>

            <h3>Communication Preferences</h3>
            <ul>
              <li>Opt out of marketing communications</li>
              <li>Control notification settings</li>
              <li>Manage cookie preferences</li>
            </ul>

            <p>To exercise these rights, contact us at privacy@themebotpark.com or through your account settings.</p>
          </section>

          <section className="content-section">
            <h2>Cookies and Tracking</h2>
            
            <p>We use cookies and similar technologies for:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic site functionality and security</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytics Cookies:</strong> Understand how you use our platform (anonymized)</li>
              <li><strong>Security Cookies:</strong> Detect suspicious activity and protect against attacks</li>
            </ul>
            
            <p>You can control cookies through your browser settings, but some features may not work properly if you disable essential cookies.</p>
          </section>

          <section className="content-section">
            <h2>Children's Privacy</h2>
            
            <p>ThemeBotPark is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will delete it immediately. If you believe a child has provided us with personal information, please contact us at privacy@themebotpark.com.</p>
          </section>

          <section className="content-section">
            <h2>International Transfers</h2>
            
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during international transfers, including:</p>
            <ul>
              <li>Standard contractual clauses approved by regulatory authorities</li>
              <li>Service providers with adequate privacy protections</li>
              <li>Compliance with applicable data protection laws</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Changes to This Policy</h2>
            
            <p>We may update this Privacy Policy from time to time. When we make changes, we will:</p>
            <ul>
              <li>Update the "Last updated" date at the top of this policy</li>
              <li>Notify you via email for significant changes</li>
              <li>Post announcements on our platform</li>
              <li>Provide notice through the service itself</li>
            </ul>
            
            <p>Your continued use of ThemeBotPark after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section className="content-section">
            <h2>Contact Us</h2>
            
            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
            
            <div className="contact-info">
              <ul>
                <li><strong>Email:</strong> privacy@themebotpark.com</li>
                <li><strong>Contact Form:</strong> <a href="/contact">Contact Us Page</a></li>
                <li><strong>Mail:</strong> ThemeBotPark Privacy Team, [Address on file]</li>
              </ul>
            </div>
            
            <p>We will respond to your privacy-related inquiries within 30 days.</p>
          </section>
        </div>
      </div>
    </div>
  );
}