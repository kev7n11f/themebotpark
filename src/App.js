import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { UserProvider } from './contexts/UserContext';
import { errorReporter } from './utils/errorReporting';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineIndicator from './components/OfflineIndicator';
import SafeComponentWrapper from './components/SafeComponentWrapper';
import Header from './components/Header';
import Footer from './pages/Footer';
import './App.css';
import './styles/theme.css';
import './styles/utilities.css';
import './styles/responsive.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const Chat = lazy(() => import('./pages/Chat'));
const About = lazy(() => import('./pages/About'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const SubscriptionSuccess = lazy(() => import('./pages/SubscriptionSuccess'));

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

  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner" aria-label="Loading"></div>
    </div>
  );

  return (
    <ErrorBoundary>
      <SafeComponentWrapper>
        <HelmetProvider>
          <UserProvider>
            <Router>
              <div className="App">
                <OfflineIndicator />
                <Header />
                <main className="main-content">
                  <Suspense fallback={<LoadingFallback />}>
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
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </UserProvider>
        </HelmetProvider>
      </SafeComponentWrapper>
      <Analytics />
      <SpeedInsights />
    </ErrorBoundary>
  );
}

