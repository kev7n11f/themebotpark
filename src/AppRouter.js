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
import SubscriptionSuccess from './pages/SubscriptionSuccess';
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
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
      </Routes>
      <Footer />
    </Router>
  );
}
