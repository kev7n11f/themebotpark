import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

// Pages
import HomePage from './pages/HomePage';
import Chat from './pages/Chat';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CreatorDashboard from './pages/CreatorDashboard';
import Footer from './pages/Footer';

// Components
// import AuthModal from './components/AuthModal'; // TODO: Implement auth modal
import ErrorBoundary from './components/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle';
import ResponsiveTest from './components/ResponsiveTest';

// Styles
import './App.css';
import './styles/theme.css';

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router basename={process.env.PUBLIC_URL}>
          <div className="app">
            {/* Skip link for accessibility */}
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            
            <ThemeToggle />
            <ResponsiveTest />
            
            <main id="main-content" className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/dashboard" element={<CreatorDashboard />} />
                <Route path="/subscription-success" element={<SubscriptionSuccess />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}

// Success page component
function SubscriptionSuccess() {
  React.useEffect(() => {
    // Set subscription status
    localStorage.setItem('hasSubscription', 'true');
    localStorage.setItem('messageCount', '0');
    
    // Redirect to chat after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/chat';
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="subscription-success">
      <div className="success-content">
        <div className="success-icon">🎉</div>
        <h1>Welcome to Premium!</h1>
        <p>Your subscription is now active. Enjoy unlimited access to all bots!</p>
        <div className="success-features">
          <div className="feature">✅ Unlimited conversations</div>
          <div className="feature">✅ All premium bots unlocked</div>
          <div className="feature">✅ Priority response times</div>
          <div className="feature">✅ Chat history saved</div>
        </div>
        <p className="redirect-note">Redirecting to chat in 3 seconds...</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/chat'}
        >
          Start Chatting Now
        </button>
      </div>
    </section>
  );
}