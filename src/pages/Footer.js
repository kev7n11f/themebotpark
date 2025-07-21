export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>ThemeBotPark</h4>
          <p>AI-powered conversations with unique bot personalities</p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="GitHub">💻</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/chat">Try Bots</a></li>
            <li><a href="/dashboard">Creator Dashboard</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#status">Status</a></li>
            <li><a href="#api">API Docs</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="#cookies">Cookie Policy</a></li>
            <li><a href="#security">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ThemeBotPark by Kevin Franklin. All rights reserved.</p>
        <div className="footer-badges">
          <span className="badge">⚡ Powered by OpenAI</span>
          <span className="badge">🔒 Secure with Stripe</span>
        </div>
      </div>
    </footer>
  );
}