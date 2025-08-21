import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';

export default function Status() {
  const [currentStatus] = useState('operational');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate status checks (in a real app, these would be actual API calls)
  const services = [
    {
      name: 'Chat Service',
      description: 'AI chatbot conversations',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '150ms'
    },
    {
      name: 'Authentication',
      description: 'User login and registration',
      status: 'operational',
      uptime: '99.8%',
      responseTime: '80ms'
    },
    {
      name: 'Payment Processing',
      description: 'Stripe payment integration',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '200ms'
    },
    {
      name: 'API Services',
      description: 'REST API endpoints',
      status: 'operational',
      uptime: '99.7%',
      responseTime: '120ms'
    },
    {
      name: 'Web Interface',
      description: 'Main website and dashboard',
      status: 'operational',
      uptime: '99.9%',
      responseTime: '90ms'
    },
    {
      name: 'Email Service',
      description: 'Contact forms and notifications',
      status: 'operational',
      uptime: '99.5%',
      responseTime: '300ms'
    }
  ];

  const incidents = [
    {
      date: '2025-01-15',
      title: 'Planned Maintenance - Security Updates',
      description: 'Scheduled maintenance window for security patches and system updates.',
      status: 'resolved',
      duration: '30 minutes',
      impact: 'low'
    },
    {
      date: '2025-01-10',
      title: 'Temporary Chat Delays',
      description: 'Some users experienced slower response times from AI bots due to high traffic.',
      status: 'resolved',
      duration: '2 hours',
      impact: 'medium'
    },
    {
      date: '2025-01-05',
      title: 'Payment Processing Interruption',
      description: 'Brief interruption in payment processing due to Stripe API maintenance.',
      status: 'resolved',
      duration: '15 minutes',
      impact: 'low'
    }
  ];

  const upcomingMaintenance = [
    {
      date: '2025-01-25',
      time: '02:00 - 04:00 UTC',
      title: 'Database Optimization',
      description: 'Performance improvements and database optimization. Minimal service interruption expected.',
      impact: 'low'
    }
  ];

  useEffect(() => {
    // Update timestamp every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return '#00d26a';
      case 'degraded': return '#f0ad4e';
      case 'outage': return '#d9534f';
      case 'maintenance': return '#5bc0de';
      default: return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return '✅';
      case 'degraded': return '⚠️';
      case 'outage': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const getIncidentIcon = (impact) => {
    switch (impact) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      case 'critical': return '🚨';
      default: return '🔵';
    }
  };

  return (
    <div className="static-page status-page">
      <SEOHead 
        title="Status - ThemeBotPark"
        description="Check the current status of ThemeBotPark services and view any ongoing incidents or maintenance windows."
      />
      
      <div className="container">
        <header className="page-header">
          <h1>⚡ System Status</h1>
          <p className="page-subtitle">
            Current status of all ThemeBotPark services and systems.
          </p>
          <div className="status-summary">
            <div className={`overall-status status-${currentStatus}`}>
              <span className="status-icon">{getStatusIcon(currentStatus)}</span>
              <span className="status-text">All Systems Operational</span>
            </div>
            <div className="last-updated">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          </div>
        </header>

        {/* Current Status */}
        <section className="status-section">
          <h2>Service Status</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-status">
                    <span 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(service.status) }}
                    ></span>
                    <span className="status-label">
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="service-metrics">
                  <div className="metric">
                    <span className="metric-label">Uptime (30 days)</span>
                    <span className="metric-value">{service.uptime}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Response Time</span>
                    <span className="metric-value">{service.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="status-section">
          <h2>Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Average Response Time</h3>
              <div className="metric-value-large">142ms</div>
              <div className="metric-change positive">-5ms from yesterday</div>
            </div>
            <div className="metric-card">
              <h3>Overall Uptime</h3>
              <div className="metric-value-large">99.8%</div>
              <div className="metric-change positive">+0.1% from last month</div>
            </div>
            <div className="metric-card">
              <h3>Active Users</h3>
              <div className="metric-value-large">1,247</div>
              <div className="metric-change positive">+12% from yesterday</div>
            </div>
            <div className="metric-card">
              <h3>API Requests/min</h3>
              <div className="metric-value-large">4,583</div>
              <div className="metric-change neutral">Steady traffic</div>
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="status-section">
          <h2>Recent Incidents</h2>
          {incidents.length > 0 ? (
            <div className="incidents-list">
              {incidents.map((incident, index) => (
                <div key={index} className="incident-card">
                  <div className="incident-header">
                    <div className="incident-info">
                      <span className="incident-icon">{getIncidentIcon(incident.impact)}</span>
                      <div>
                        <h3>{incident.title}</h3>
                        <div className="incident-meta">
                          <span className="incident-date">{incident.date}</span>
                          <span className="incident-duration">Duration: {incident.duration}</span>
                          <span className={`incident-impact impact-${incident.impact}`}>
                            {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)} Impact
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`incident-status status-${incident.status}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </div>
                  </div>
                  <p className="incident-description">{incident.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-incidents">
              <span className="no-incidents-icon">🎉</span>
              <h3>No Recent Incidents</h3>
              <p>All systems have been running smoothly!</p>
            </div>
          )}
        </section>

        {/* Upcoming Maintenance */}
        <section className="status-section">
          <h2>Scheduled Maintenance</h2>
          {upcomingMaintenance.length > 0 ? (
            <div className="maintenance-list">
              {upcomingMaintenance.map((maintenance, index) => (
                <div key={index} className="maintenance-card">
                  <div className="maintenance-header">
                    <span className="maintenance-icon">🔧</span>
                    <div className="maintenance-info">
                      <h3>{maintenance.title}</h3>
                      <div className="maintenance-meta">
                        <span className="maintenance-date">{maintenance.date}</span>
                        <span className="maintenance-time">{maintenance.time}</span>
                        <span className={`maintenance-impact impact-${maintenance.impact}`}>
                          {maintenance.impact.charAt(0).toUpperCase() + maintenance.impact.slice(1)} Impact
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="maintenance-description">{maintenance.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-maintenance">
              <span className="no-maintenance-icon">📅</span>
              <h3>No Scheduled Maintenance</h3>
              <p>No planned maintenance windows at this time.</p>
            </div>
          )}
        </section>

        {/* Subscribe to Updates */}
        <section className="status-section">
          <h2>Stay Updated</h2>
          <div className="updates-section">
            <div className="updates-grid">
              <div className="update-method">
                <span className="update-icon">📧</span>
                <h3>Email Notifications</h3>
                <p>Get notified about incidents and maintenance</p>
                <button className="subscribe-btn">Subscribe to Updates</button>
              </div>
              <div className="update-method">
                <span className="update-icon">🔔</span>
                <h3>Push Notifications</h3>
                <p>Real-time notifications in your browser</p>
                <button className="subscribe-btn">Enable Notifications</button>
              </div>
              <div className="update-method">
                <span className="update-icon">📱</span>
                <h3>SMS Alerts</h3>
                <p>Critical incident alerts via SMS</p>
                <button className="subscribe-btn">Setup SMS</button>
              </div>
              <div className="update-method">
                <span className="update-icon">📊</span>
                <h3>Status API</h3>
                <p>Programmatic access to status data</p>
                <a href="/api-docs#status" className="subscribe-btn">View API Docs</a>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Data */}
        <section className="status-section">
          <h2>Historical Performance</h2>
          <div className="historical-stats">
            <div className="time-period-tabs">
              <button className="time-tab active">Last 30 Days</button>
              <button className="time-tab">Last 90 Days</button>
              <button className="time-tab">Last Year</button>
            </div>
            <div className="historical-metrics">
              <div className="historical-metric">
                <h4>Average Uptime</h4>
                <div className="uptime-bar">
                  <div className="uptime-fill" style={{ width: '99.8%' }}></div>
                </div>
                <span className="uptime-percentage">99.8%</span>
              </div>
              <div className="historical-metric">
                <h4>Incident Count</h4>
                <span className="incident-count">3 minor incidents</span>
              </div>
              <div className="historical-metric">
                <h4>Average Response Time</h4>
                <span className="avg-response">145ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="status-section">
          <h2>Need Help?</h2>
          <div className="support-grid">
            <div className="support-card">
              <span className="support-icon">📧</span>
              <h3>Contact Support</h3>
              <p>Get help with any issues you're experiencing</p>
              <a href="/contact" className="support-btn">Contact Us</a>
            </div>
            <div className="support-card">
              <span className="support-icon">📖</span>
              <h3>Help Center</h3>
              <p>Browse our comprehensive help articles</p>
              <a href="/help" className="support-btn">Visit Help Center</a>
            </div>
            <div className="support-card">
              <span className="support-icon">💬</span>
              <h3>Community Forum</h3>
              <p>Connect with other users and get community support</p>
              <a href="#community" className="support-btn">Join Community</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}