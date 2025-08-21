import React from 'react';
import SEOHead from '../components/SEOHead';

export default function Security() {
  return (
    <div className="static-page">
      <SEOHead 
        title="Security - ThemeBotPark"
        description="Learn about ThemeBotPark's security measures, data protection, and how we keep your information safe."
      />
      
      <div className="container">
        <header className="page-header">
          <h1>🔒 Security</h1>
          <p className="page-subtitle">
            Your security is our top priority. Learn about our comprehensive security measures.
          </p>
          <p className="last-updated">Last updated: January 1, 2025</p>
        </header>

        <div className="content-sections">
          <section className="content-section">
            <h2>Our Security Commitment</h2>
            
            <p>At ThemeBotPark, we implement industry-leading security practices to protect your data, privacy, and user experience. Our multi-layered security approach covers:</p>
            
            <ul>
              <li><strong>Data Encryption:</strong> All data encrypted in transit and at rest</li>
              <li><strong>Access Controls:</strong> Strict authentication and authorization</li>
              <li><strong>Infrastructure Security:</strong> Secure hosting and network protection</li>
              <li><strong>Application Security:</strong> Secure coding practices and regular audits</li>
              <li><strong>Privacy Protection:</strong> Comprehensive data protection measures</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Data Protection</h2>
            
            <h3>Encryption</h3>
            <ul>
              <li><strong>In Transit:</strong> TLS 1.3 encryption for all data transmission</li>
              <li><strong>At Rest:</strong> AES-256 encryption for stored data</li>
              <li><strong>API Communications:</strong> Encrypted connections to all external services</li>
              <li><strong>Database Security:</strong> Encrypted database connections and storage</li>
            </ul>

            <h3>Authentication Security</h3>
            <ul>
              <li><strong>Password Protection:</strong> Bcrypt hashing with salt rounds</li>
              <li><strong>JWT Tokens:</strong> Secure token-based authentication</li>
              <li><strong>Session Management:</strong> Secure session handling and timeout</li>
              <li><strong>Account Lockouts:</strong> Protection against brute force attacks</li>
            </ul>

            <h3>Data Minimization</h3>
            <ul>
              <li>We collect only necessary data for service operation</li>
              <li>Regular data purging of unnecessary information</li>
              <li>Anonymization of analytics data</li>
              <li>Secure deletion of cancelled accounts</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Infrastructure Security</h2>
            
            <h3>Hosting & Cloud Security</h3>
            <p>Our platform is hosted on Vercel, which provides:</p>
            <ul>
              <li><strong>Global CDN:</strong> Fast, secure content delivery</li>
              <li><strong>DDoS Protection:</strong> Automatic protection against attacks</li>
              <li><strong>SSL/TLS:</strong> Automatic SSL certificate management</li>
              <li><strong>Edge Security:</strong> Request filtering at the edge</li>
              <li><strong>Compliance:</strong> SOC 2 Type II certified infrastructure</li>
            </ul>

            <h3>Network Security</h3>
            <ul>
              <li><strong>Firewall Protection:</strong> Advanced firewall rules and monitoring</li>
              <li><strong>Intrusion Detection:</strong> Real-time threat monitoring</li>
              <li><strong>Rate Limiting:</strong> Protection against abuse and DoS attacks</li>
              <li><strong>IP Filtering:</strong> Geographic and threat-based IP blocking</li>
            </ul>

            <h3>Serverless Architecture Benefits</h3>
            <ul>
              <li>Isolated function execution environments</li>
              <li>Automatic scaling and resource management</li>
              <li>Reduced attack surface compared to traditional servers</li>
              <li>Built-in redundancy and fault tolerance</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Application Security</h2>
            
            <h3>Secure Development Practices</h3>
            <ul>
              <li><strong>Code Reviews:</strong> All code changes reviewed before deployment</li>
              <li><strong>Dependency Scanning:</strong> Regular security audits of third-party packages</li>
              <li><strong>Static Analysis:</strong> Automated code security scanning</li>
              <li><strong>Input Validation:</strong> Comprehensive validation of all user inputs</li>
              <li><strong>Output Encoding:</strong> Prevention of XSS and injection attacks</li>
            </ul>

            <h3>OWASP Compliance</h3>
            <p>We follow OWASP Top 10 security guidelines:</p>
            <ul>
              <li><strong>Injection Prevention:</strong> Parameterized queries and input sanitization</li>
              <li><strong>Authentication:</strong> Multi-factor authentication support</li>
              <li><strong>Data Exposure:</strong> Minimal data exposure and encryption</li>
              <li><strong>XML/XXE:</strong> Secure XML processing</li>
              <li><strong>Access Control:</strong> Proper authorization checks</li>
              <li><strong>Security Misconfiguration:</strong> Secure default configurations</li>
              <li><strong>XSS Prevention:</strong> Content Security Policy and output encoding</li>
              <li><strong>Deserialization:</strong> Safe data deserialization practices</li>
              <li><strong>Component Security:</strong> Regular updates and vulnerability monitoring</li>
              <li><strong>Logging:</strong> Comprehensive security logging and monitoring</li>
            </ul>

            <h3>API Security</h3>
            <ul>
              <li><strong>Authentication:</strong> JWT-based API authentication</li>
              <li><strong>Rate Limiting:</strong> Per-user and per-endpoint limits</li>
              <li><strong>Input Validation:</strong> Strict validation of all API inputs</li>
              <li><strong>CORS Policy:</strong> Restrictive cross-origin resource sharing</li>
              <li><strong>HTTPS Only:</strong> All API endpoints require HTTPS</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Third-Party Security</h2>
            
            <h3>Trusted Partners</h3>
            <p>We work only with security-conscious partners:</p>
            
            <h4>OpenAI</h4>
            <ul>
              <li>Enterprise-grade AI platform with robust security</li>
              <li>Data processing agreements and privacy controls</li>
              <li>Regular security audits and compliance certifications</li>
            </ul>

            <h4>Stripe</h4>
            <ul>
              <li>PCI DSS Level 1 certified payment processor</li>
              <li>Industry-leading fraud prevention</li>
              <li>Secure vault for payment information storage</li>
            </ul>

            <h4>Vercel</h4>
            <ul>
              <li>SOC 2 Type II certified hosting platform</li>
              <li>Automatic security updates and monitoring</li>
              <li>Global edge network with DDoS protection</li>
            </ul>

            <h3>Vendor Security Assessment</h3>
            <p>All third-party services undergo security evaluation:</p>
            <ul>
              <li>Security certification review</li>
              <li>Data processing agreement requirements</li>
              <li>Regular security posture assessments</li>
              <li>Incident response coordination</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Privacy & Compliance</h2>
            
            <h3>Privacy by Design</h3>
            <ul>
              <li><strong>Data Minimization:</strong> Collect only what's necessary</li>
              <li><strong>Purpose Limitation:</strong> Use data only for stated purposes</li>
              <li><strong>Storage Limitation:</strong> Retain data only as long as needed</li>
              <li><strong>Transparency:</strong> Clear privacy policies and practices</li>
              <li><strong>User Control:</strong> Easy access, correction, and deletion</li>
            </ul>

            <h3>Regulatory Compliance</h3>
            <ul>
              <li><strong>GDPR:</strong> European data protection regulation compliance</li>
              <li><strong>CCPA:</strong> California consumer privacy act compliance</li>
              <li><strong>PIPEDA:</strong> Canadian privacy law compliance</li>
              <li><strong>SOC 2:</strong> Service organization control standards</li>
            </ul>

            <h3>Data Subject Rights</h3>
            <p>We support all privacy rights including:</p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to delete your data</li>
              <li>Right to data portability</li>
              <li>Right to restrict processing</li>
              <li>Right to object to processing</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Incident Response</h2>
            
            <h3>Security Monitoring</h3>
            <ul>
              <li><strong>24/7 Monitoring:</strong> Continuous security monitoring and alerting</li>
              <li><strong>Threat Detection:</strong> Advanced threat detection systems</li>
              <li><strong>Log Analysis:</strong> Comprehensive logging and analysis</li>
              <li><strong>Performance Monitoring:</strong> Real-time performance and availability tracking</li>
            </ul>

            <h3>Incident Response Plan</h3>
            <p>In case of a security incident, we follow a structured response:</p>
            <ol>
              <li><strong>Detection:</strong> Automated and manual threat detection</li>
              <li><strong>Containment:</strong> Immediate containment of threats</li>
              <li><strong>Assessment:</strong> Impact assessment and risk evaluation</li>
              <li><strong>Notification:</strong> User and regulatory notification as required</li>
              <li><strong>Recovery:</strong> System recovery and restoration</li>
              <li><strong>Review:</strong> Post-incident review and improvement</li>
            </ol>

            <h3>Breach Notification</h3>
            <p>If a data breach occurs, we will:</p>
            <ul>
              <li>Notify affected users within 72 hours</li>
              <li>Provide clear information about the incident</li>
              <li>Explain steps taken to address the breach</li>
              <li>Offer guidance on protective measures</li>
              <li>Cooperate with relevant authorities</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>User Security Best Practices</h2>
            
            <h3>Account Security</h3>
            <p>Help us keep your account secure:</p>
            <ul>
              <li><strong>Strong Passwords:</strong> Use unique, complex passwords</li>
              <li><strong>Password Manager:</strong> Consider using a password manager</li>
              <li><strong>Regular Updates:</strong> Keep your password updated</li>
              <li><strong>Account Monitoring:</strong> Review account activity regularly</li>
              <li><strong>Logout:</strong> Always log out from shared devices</li>
            </ul>

            <h3>Safe Browsing</h3>
            <ul>
              <li>Always access ThemeBotPark through official URLs</li>
              <li>Look for the lock icon and HTTPS in your browser</li>
              <li>Be cautious of phishing emails claiming to be from us</li>
              <li>Keep your browser and devices updated</li>
              <li>Use reputable antivirus software</li>
            </ul>

            <h3>Suspicious Activity</h3>
            <p>Report any suspicious activity immediately:</p>
            <ul>
              <li>Unexpected login notifications</li>
              <li>Unusual account activity</li>
              <li>Suspicious emails claiming to be from ThemeBotPark</li>
              <li>Potential phishing attempts</li>
              <li>Technical security concerns</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Security Updates & Maintenance</h2>
            
            <h3>Regular Updates</h3>
            <ul>
              <li><strong>Security Patches:</strong> Prompt application of security updates</li>
              <li><strong>Dependency Updates:</strong> Regular updates of all dependencies</li>
              <li><strong>Infrastructure Updates:</strong> Keeping all systems current</li>
              <li><strong>SSL Certificates:</strong> Automatic renewal and management</li>
            </ul>

            <h3>Security Audits</h3>
            <ul>
              <li><strong>Internal Audits:</strong> Regular internal security reviews</li>
              <li><strong>Penetration Testing:</strong> Professional security testing</li>
              <li><strong>Code Audits:</strong> Third-party code security reviews</li>
              <li><strong>Vulnerability Assessments:</strong> Regular vulnerability scanning</li>
            </ul>

            <h3>Maintenance Windows</h3>
            <p>We perform security maintenance during low-traffic periods:</p>
            <ul>
              <li>Critical security updates applied immediately</li>
              <li>Routine maintenance scheduled during off-peak hours</li>
              <li>Users notified of planned maintenance when possible</li>
              <li>Emergency maintenance performed as needed</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Contact Our Security Team</h2>
            
            <h3>Security Concerns</h3>
            <p>For security-related issues, contact us immediately:</p>
            
            <div className="contact-info">
              <ul>
                <li><strong>Security Email:</strong> security@themebotpark.com</li>
                <li><strong>Urgent Issues:</strong> Use "URGENT SECURITY" in subject line</li>
                <li><strong>PGP Key:</strong> Available upon request for sensitive communications</li>
              </ul>
            </div>

            <h3>Vulnerability Disclosure</h3>
            <p>We welcome responsible disclosure of security vulnerabilities:</p>
            <ul>
              <li>Report vulnerabilities to security@themebotpark.com</li>
              <li>Provide detailed information about the vulnerability</li>
              <li>Allow us reasonable time to investigate and respond</li>
              <li>Do not publicly disclose until we've addressed the issue</li>
            </ul>

            <h3>Bug Bounty Program</h3>
            <p>We're considering a formal bug bounty program. In the meantime:</p>
            <ul>
              <li>We appreciate responsible disclosure of security issues</li>
              <li>Researchers will be credited for verified vulnerabilities</li>
              <li>Serious vulnerabilities may be eligible for rewards</li>
              <li>Follow responsible disclosure guidelines</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Security Certifications & Standards</h2>
            
            <h3>Current Certifications</h3>
            <ul>
              <li><strong>Infrastructure:</strong> SOC 2 Type II (through Vercel)</li>
              <li><strong>Payment Processing:</strong> PCI DSS Level 1 (through Stripe)</li>
              <li><strong>AI Services:</strong> Enterprise security standards (through OpenAI)</li>
            </ul>

            <h3>Standards Compliance</h3>
            <ul>
              <li><strong>ISO 27001:</strong> Information security management</li>
              <li><strong>NIST Framework:</strong> Cybersecurity framework compliance</li>
              <li><strong>OWASP:</strong> Application security best practices</li>
              <li><strong>CIS Controls:</strong> Critical security controls</li>
            </ul>

            <h3>Future Certifications</h3>
            <p>We're working toward additional certifications:</p>
            <ul>
              <li>Direct SOC 2 Type II certification</li>
              <li>ISO 27001 certification</li>
              <li>Industry-specific compliance as needed</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}