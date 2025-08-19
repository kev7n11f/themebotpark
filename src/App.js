import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';

// Error reporting
import { errorReporter } from './utils/errorReporting';

// Pages
import HomePage from './pages/HomePage';
import Chat from './pages/Chat';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CreatorDashboard from './pages/CreatorDashboard';
import Footer from './pages/Footer';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

// Components
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import SafeComponentWrapper from './components/SafeComponentWrapper';

// Styles
import './App.css';
import './styles/theme.css';

export default function App() {
  useEffect(() => {
    // Initialize error reporting
    console.log('ThemeBotPark App initialized');
    
    // Add debugging info in development
    if (process.env.NODE_ENV === 'development') {
      window.getErrors = () => errorReporter.getErrors();
      window.getErrorSummary = () => errorReporter.getErrorSummary();
    }
  }, []);

  return (
    <ErrorBoundary>
      <SafeComponentWrapper>
        <UserProvider>
          <Router basename={process.env.PUBLIC_URL}>
            <div className="app">
              <OfflineIndicator />
              <main className="main-content">
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
      </SafeComponentWrapper>
    </ErrorBoundary>
  );
}

