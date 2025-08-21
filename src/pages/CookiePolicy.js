import React from 'react';
import SEOHead from '../components/SEOHead';

export default function CookiePolicy() {
  return (
    <div className="static-page">
      <SEOHead 
        title="Cookie Policy - ThemeBotPark"
        description="Learn about how ThemeBotPark uses cookies and similar technologies to enhance your experience and protect your privacy."
      />
      
      <div className="container">
        <header className="page-header">
          <h1>🍪 Cookie Policy</h1>
          <p className="page-subtitle">
            This policy explains how ThemeBotPark uses cookies and similar technologies.
          </p>
          <p className="last-updated">Last updated: January 1, 2025</p>
        </header>

        <div className="content-sections">
          <section className="content-section">
            <h2>What Are Cookies?</h2>
            
            <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
            
            <p>Similar technologies include:</p>
            <ul>
              <li><strong>Local Storage:</strong> Data stored locally in your browser</li>
              <li><strong>Session Storage:</strong> Temporary data for your current session</li>
              <li><strong>Web Beacons:</strong> Small graphics that help us understand user behavior</li>
              <li><strong>Pixels:</strong> Tracking codes for analytics and advertising</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>How We Use Cookies</h2>
            
            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly:</p>
            <ul>
              <li><strong>Authentication:</strong> Keep you logged in securely</li>
              <li><strong>Security:</strong> Protect against malicious attacks</li>
              <li><strong>Session Management:</strong> Maintain your session state</li>
              <li><strong>CSRF Protection:</strong> Prevent cross-site request forgery</li>
            </ul>

            <h3>Functional Cookies</h3>
            <p>These cookies enhance your experience:</p>
            <ul>
              <li><strong>Preferences:</strong> Remember your settings and choices</li>
              <li><strong>Theme Selection:</strong> Save your light/dark mode preference</li>
              <li><strong>Language:</strong> Remember your language preference</li>
              <li><strong>Chat History:</strong> Maintain conversation continuity</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>These cookies help us understand how you use our platform:</p>
            <ul>
              <li><strong>Usage Statistics:</strong> Track page views and user interactions</li>
              <li><strong>Performance Monitoring:</strong> Identify slow-loading pages</li>
              <li><strong>Error Tracking:</strong> Monitor and fix technical issues</li>
              <li><strong>A/B Testing:</strong> Test different features and improvements</li>
            </ul>

            <h3>Third-Party Cookies</h3>
            <p>Some cookies are set by third-party services we use:</p>
            <ul>
              <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
              <li><strong>Vercel:</strong> Hosting and performance optimization</li>
              <li><strong>Analytics Services:</strong> Usage tracking and insights</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Cookie Categories</h2>
            
            <div className="cookie-table">
              <h3>Essential Cookies</h3>
              <table>
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>auth_token</td>
                    <td>User authentication</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td>csrf_token</td>
                    <td>Security protection</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td>session_id</td>
                    <td>Session management</td>
                    <td>Session</td>
                  </tr>
                </tbody>
              </table>

              <h3>Preference Cookies</h3>
              <table>
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>theme_preference</td>
                    <td>Light/dark mode setting</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td>user_preferences</td>
                    <td>General user settings</td>
                    <td>1 year</td>
                  </tr>
                </tbody>
              </table>

              <h3>Analytics Cookies</h3>
              <table>
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>_analytics_id</td>
                    <td>User identification for analytics</td>
                    <td>2 years</td>
                  </tr>
                  <tr>
                    <td>_session_analytics</td>
                    <td>Session tracking</td>
                    <td>30 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="content-section">
            <h2>Managing Your Cookie Preferences</h2>
            
            <h3>Browser Settings</h3>
            <p>You can control cookies through your browser settings:</p>
            
            <h4>Chrome</h4>
            <ol>
              <li>Click the three dots menu → Settings</li>
              <li>Go to Privacy and Security → Cookies and other site data</li>
              <li>Choose your preferred settings</li>
            </ol>

            <h4>Firefox</h4>
            <ol>
              <li>Click the menu button → Settings</li>
              <li>Go to Privacy & Security</li>
              <li>Under Cookies and Site Data, click Manage Data</li>
            </ol>

            <h4>Safari</h4>
            <ol>
              <li>Go to Safari → Preferences</li>
              <li>Click the Privacy tab</li>
              <li>Adjust your cookie settings</li>
            </ol>

            <h4>Edge</h4>
            <ol>
              <li>Click the three dots menu → Settings</li>
              <li>Go to Cookies and site permissions</li>
              <li>Click Cookies and site data</li>
            </ol>

            <h3>Platform Cookie Controls</h3>
            <p>Within ThemeBotPark, you can:</p>
            <ul>
              <li>Access cookie preferences in your account settings</li>
              <li>Opt out of non-essential cookies</li>
              <li>Clear stored data from your profile</li>
              <li>Request data deletion through our privacy tools</li>
            </ul>

            <h3>What Happens If You Disable Cookies?</h3>
            <p>If you disable cookies, some features may not work properly:</p>
            <ul>
              <li><strong>Essential Features:</strong> Login, security, and core functionality may be impacted</li>
              <li><strong>Personalization:</strong> Your preferences won't be saved</li>
              <li><strong>Analytics:</strong> We won't be able to improve the service based on usage data</li>
              <li><strong>Performance:</strong> Some features may load more slowly</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Third-Party Cookies</h2>
            
            <h3>Payment Processing (Stripe)</h3>
            <p>Stripe uses cookies for:</p>
            <ul>
              <li>Secure payment processing</li>
              <li>Fraud detection and prevention</li>
              <li>Compliance with payment regulations</li>
            </ul>
            <p>Learn more: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a></p>

            <h3>Hosting (Vercel)</h3>
            <p>Vercel may use cookies for:</p>
            <ul>
              <li>Performance optimization</li>
              <li>Load balancing</li>
              <li>Security protection</li>
            </ul>
            <p>Learn more: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a></p>

            <h3>AI Services (OpenAI)</h3>
            <p>OpenAI processes your messages but doesn't set cookies directly on our site. Their data handling is governed by their own privacy policy.</p>
            <p>Learn more: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer">OpenAI Privacy Policy</a></p>
          </section>

          <section className="content-section">
            <h2>Data Retention</h2>
            
            <p>We retain cookie data for different periods based on their purpose:</p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Preference Cookies:</strong> Stored for up to 1 year</li>
              <li><strong>Analytics Cookies:</strong> Stored for up to 2 years</li>
              <li><strong>Security Cookies:</strong> Stored for the duration of your session</li>
            </ul>

            <p>You can delete cookies at any time through your browser settings or by contacting us.</p>
          </section>

          <section className="content-section">
            <h2>Updates to This Policy</h2>
            
            <p>We may update this Cookie Policy from time to time to reflect changes in:</p>
            <ul>
              <li>Our cookie usage practices</li>
              <li>Legal requirements</li>
              <li>Technology changes</li>
              <li>Third-party service updates</li>
            </ul>

            <p>When we update this policy, we will:</p>
            <ul>
              <li>Update the "Last updated" date</li>
              <li>Notify you of significant changes</li>
              <li>Provide clear information about new cookie uses</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Contact Us</h2>
            
            <p>If you have questions about our use of cookies, please contact us:</p>
            
            <div className="contact-info">
              <ul>
                <li><strong>Email:</strong> privacy@themebotpark.com</li>
                <li><strong>Contact Form:</strong> <a href="/contact">Contact Us Page</a></li>
                <li><strong>Subject Line:</strong> "Cookie Policy Inquiry"</li>
              </ul>
            </div>

            <p>We will respond to cookie-related inquiries within 5 business days.</p>
          </section>
        </div>
      </div>
    </div>
  );
}