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
import SubscriptionSuccess from './pages/SubscriptionSuccess';

// Components
// import AuthModal from './components/AuthModal'; // TODO: Implement auth modal
import ErrorBoundary from './components/ErrorBoundary';

// Styles
import './App.css';
import './styles/theme.css';

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router basename={process.env.PUBLIC_URL}>
          <div className="app">
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
    </ErrorBoundary>
  );
}

