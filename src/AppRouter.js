import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Chat from './pages/Chat';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import CreatorDashboard from './pages/CreatorDashboard';
import Footer from './pages/Footer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
import Security from './pages/Security';
import HelpCenter from './pages/HelpCenter';
import ApiDocs from './pages/ApiDocs';
import Status from './pages/Status';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import NotFound from './pages/NotFound';
import './styles/theme.css';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<CreatorDashboard />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/security" element={<Security />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/status" element={<Status />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}
