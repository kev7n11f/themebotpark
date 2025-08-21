import React, { useState } from 'react';
import SEOHead from '../components/SEOHead';

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('auth');

  const endpoints = {
    auth: {
      title: 'Authentication',
      description: 'Endpoints for user authentication and account management',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth',
          description: 'User login and registration',
          parameters: [
            { name: 'action', type: 'string', required: true, description: 'Action type: "login", "register", or "forgot-password"' },
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'password', type: 'string', required: 'conditional', description: 'User password (required for login/register)' },
            { name: 'username', type: 'string', required: 'conditional', description: 'Username (required for register)' }
          ],
          response: {
            success: {
              token: 'JWT authentication token',
              user: 'User object with id, email, username'
            },
            error: {
              error: 'Error message',
              details: 'Additional error details'
            }
          }
        }
      ]
    },
    chat: {
      title: 'Chat',
      description: 'Endpoints for AI chat interactions',
      endpoints: [
        {
          method: 'POST',
          path: '/api/chat',
          description: 'Send a message to an AI bot',
          parameters: [
            { name: 'message', type: 'string', required: true, description: 'User message to send to the bot' },
            { name: 'botId', type: 'string', required: true, description: 'Bot personality identifier' },
            { name: 'conversationId', type: 'string', required: false, description: 'Conversation ID for context' }
          ],
          response: {
            success: {
              response: 'AI-generated response',
              conversationId: 'Conversation identifier',
              botId: 'Bot that generated the response'
            },
            error: {
              error: 'Error message',
              details: 'Additional error details'
            }
          }
        }
      ]
    },
    subscription: {
      title: 'Subscription',
      description: 'Endpoints for subscription and billing management',
      endpoints: [
        {
          method: 'POST',
          path: '/api/stripe',
          description: 'Create a Stripe checkout session',
          parameters: [
            { name: 'priceId', type: 'string', required: true, description: 'Stripe price ID for the subscription plan' },
            { name: 'userId', type: 'string', required: true, description: 'User ID for the subscription' }
          ],
          response: {
            success: {
              sessionId: 'Stripe checkout session ID',
              url: 'Checkout URL to redirect user'
            },
            error: {
              error: 'Error message',
              details: 'Additional error details'
            }
          }
        },
        {
          method: 'GET',
          path: '/api/subscription-status',
          description: 'Get user subscription status',
          parameters: [
            { name: 'userId', type: 'string', required: true, description: 'User ID to check subscription for' }
          ],
          response: {
            success: {
              status: 'Subscription status (active, canceled, etc.)',
              plan: 'Current subscription plan',
              expiresAt: 'Subscription expiration date'
            },
            error: {
              error: 'Error message',
              details: 'Additional error details'
            }
          }
        }
      ]
    },
    contact: {
      title: 'Contact',
      description: 'Endpoints for contact and support',
      endpoints: [
        {
          method: 'POST',
          path: '/api/contact',
          description: 'Submit a contact form message',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Contact person name' },
            { name: 'email', type: 'string', required: true, description: 'Contact email address' },
            { name: 'subject', type: 'string', required: true, description: 'Message subject' },
            { name: 'message', type: 'string', required: true, description: 'Message content' }
          ],
          response: {
            success: {
              message: 'Success confirmation message',
              id: 'Message ID for tracking'
            },
            error: {
              error: 'Error message',
              details: 'Additional error details'
            }
          }
        }
      ]
    }
  };

  return (
    <div className="static-page api-docs">
      <SEOHead 
        title="API Documentation - ThemeBotPark"
        description="Comprehensive API documentation for ThemeBotPark. Learn how to integrate with our AI chatbot platform."
      />
      
      <div className="container">
        <header className="page-header">
          <h1>🔧 API Documentation</h1>
          <p className="page-subtitle">
            Comprehensive guide to integrating with the ThemeBotPark API.
          </p>
          <div className="api-version">
            <span className="version-badge">Version 1.0</span>
            <span className="base-url">Base URL: <code>https://themebotpark.vercel.app</code></span>
          </div>
        </header>

        <div className="api-content">
          {/* Navigation */}
          <nav className="api-nav">
            <h3>Endpoints</h3>
            <ul>
              {Object.keys(endpoints).map(key => (
                <li key={key}>
                  <button
                    className={`nav-btn ${selectedEndpoint === key ? 'active' : ''}`}
                    onClick={() => setSelectedEndpoint(key)}
                  >
                    {endpoints[key].title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="api-main">
            {/* Getting Started */}
            <section className="api-section">
              <h2>Getting Started</h2>
              
              <h3>Authentication</h3>
              <p>Most API endpoints require authentication using JWT tokens. Include the token in the Authorization header:</p>
              <div className="code-block">
                <pre>
{`Authorization: Bearer your_jwt_token_here`}
                </pre>
              </div>

              <h3>Base URL</h3>
              <p>All API requests should be made to:</p>
              <div className="code-block">
                <pre>https://themebotpark.vercel.app</pre>
              </div>

              <h3>Response Format</h3>
              <p>All responses are in JSON format with the following structure:</p>
              <div className="code-block">
                <pre>
{`{
  "success": true,
  "data": { ... },
  "error": null
}

// Or for errors:
{
  "success": false,
  "data": null,
  "error": "Error message"
}`}
                </pre>
              </div>

              <h3>Rate Limiting</h3>
              <p>API requests are rate limited to prevent abuse:</p>
              <ul>
                <li><strong>General endpoints:</strong> 100 requests per 15 minutes</li>
                <li><strong>Chat endpoints:</strong> 50 requests per 15 minutes</li>
                <li><strong>Authentication:</strong> 10 requests per 15 minutes</li>
              </ul>
            </section>

            {/* Endpoint Details */}
            <section className="api-section">
              <h2>{endpoints[selectedEndpoint].title}</h2>
              <p>{endpoints[selectedEndpoint].description}</p>

              {endpoints[selectedEndpoint].endpoints.map((endpoint, index) => (
                <div key={index} className="endpoint-card">
                  <div className="endpoint-header">
                    <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                    <code className="endpoint-path">{endpoint.path}</code>
                  </div>

                  <p className="endpoint-description">{endpoint.description}</p>

                  <h4>Parameters</h4>
                  <div className="params-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Required</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, paramIndex) => (
                          <tr key={paramIndex}>
                            <td><code>{param.name}</code></td>
                            <td><span className="type-badge">{param.type}</span></td>
                            <td>
                              <span className={`required-badge ${param.required === true ? 'required' : param.required === false ? 'optional' : 'conditional'}`}>
                                {param.required === true ? 'Required' : param.required === false ? 'Optional' : 'Conditional'}
                              </span>
                            </td>
                            <td>{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h4>Response</h4>
                  <div className="response-examples">
                    <div className="response-example">
                      <h5>Success Response</h5>
                      <div className="code-block">
                        <pre>{JSON.stringify(endpoint.response.success, null, 2)}</pre>
                      </div>
                    </div>
                    <div className="response-example">
                      <h5>Error Response</h5>
                      <div className="code-block">
                        <pre>{JSON.stringify(endpoint.response.error, null, 2)}</pre>
                      </div>
                    </div>
                  </div>

                  <h4>Example Request</h4>
                  <div className="code-block">
                    <pre>
{`curl -X ${endpoint.method} \\
  https://themebotpark.vercel.app${endpoint.path} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_jwt_token" \\
  -d '{
    ${endpoint.parameters.slice(0, 2).map(p => `"${p.name}": "example_${p.name}"`).join(',\n    ')}
  }'`}
                    </pre>
                  </div>
                </div>
              ))}
            </section>

            {/* Error Codes */}
            <section className="api-section">
              <h2>HTTP Status Codes</h2>
              <div className="status-codes">
                <div className="status-category">
                  <h3>Success Codes</h3>
                  <ul>
                    <li><code>200 OK</code> - Request successful</li>
                    <li><code>201 Created</code> - Resource created successfully</li>
                  </ul>
                </div>
                <div className="status-category">
                  <h3>Client Error Codes</h3>
                  <ul>
                    <li><code>400 Bad Request</code> - Invalid request parameters</li>
                    <li><code>401 Unauthorized</code> - Authentication required or invalid</li>
                    <li><code>403 Forbidden</code> - Access denied</li>
                    <li><code>404 Not Found</code> - Resource not found</li>
                    <li><code>429 Too Many Requests</code> - Rate limit exceeded</li>
                  </ul>
                </div>
                <div className="status-category">
                  <h3>Server Error Codes</h3>
                  <ul>
                    <li><code>500 Internal Server Error</code> - Server error</li>
                    <li><code>502 Bad Gateway</code> - External service error</li>
                    <li><code>503 Service Unavailable</code> - Service temporarily unavailable</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* SDK and Libraries */}
            <section className="api-section">
              <h2>SDKs and Libraries</h2>
              <p>While we don't currently provide official SDKs, here are some community examples:</p>
              
              <h3>JavaScript/Node.js</h3>
              <div className="code-block">
                <pre>
{`const axios = require('axios');

class ThemeBotParkAPI {
  constructor(baseURL = 'https://themebotpark.vercel.app') {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async login(email, password) {
    const response = await axios.post(\`\${this.baseURL}/api/auth\`, {
      action: 'login',
      email,
      password
    });
    this.token = response.data.token;
    return response.data;
  }

  async sendMessage(message, botId, conversationId = null) {
    const response = await axios.post(\`\${this.baseURL}/api/chat\`, {
      message,
      botId,
      conversationId
    }, {
      headers: {
        'Authorization': \`Bearer \${this.token}\`
      }
    });
    return response.data;
  }
}

// Usage
const api = new ThemeBotParkAPI();
await api.login('user@example.com', 'password');
const response = await api.sendMessage('Hello!', 'rainmaker');`}
                </pre>
              </div>

              <h3>Python</h3>
              <div className="code-block">
                <pre>
{`import requests

class ThemeBotParkAPI:
    def __init__(self, base_url='https://themebotpark.vercel.app'):
        self.base_url = base_url
        self.token = None

    def login(self, email, password):
        response = requests.post(f'{self.base_url}/api/auth', json={
            'action': 'login',
            'email': email,
            'password': password
        })
        data = response.json()
        self.token = data.get('token')
        return data

    def send_message(self, message, bot_id, conversation_id=None):
        headers = {'Authorization': f'Bearer {self.token}'}
        response = requests.post(f'{self.base_url}/api/chat', 
            json={
                'message': message,
                'botId': bot_id,
                'conversationId': conversation_id
            },
            headers=headers
        )
        return response.json()

# Usage
api = ThemeBotParkAPI()
api.login('user@example.com', 'password')
response = api.send_message('Hello!', 'rainmaker')`}
                </pre>
              </div>
            </section>

            {/* Best Practices */}
            <section className="api-section">
              <h2>Best Practices</h2>
              
              <h3>Security</h3>
              <ul>
                <li>Always use HTTPS for API requests</li>
                <li>Store JWT tokens securely (never in localStorage for production)</li>
                <li>Implement proper token refresh logic</li>
                <li>Validate all input data before sending to the API</li>
              </ul>

              <h3>Error Handling</h3>
              <ul>
                <li>Always check the response status and handle errors gracefully</li>
                <li>Implement retry logic for temporary failures</li>
                <li>Log errors for debugging purposes</li>
                <li>Provide meaningful error messages to users</li>
              </ul>

              <h3>Performance</h3>
              <ul>
                <li>Cache responses when appropriate</li>
                <li>Use conversation IDs to maintain context</li>
                <li>Implement rate limiting on your client side</li>
                <li>Minimize the number of API calls by batching requests</li>
              </ul>
            </section>

            {/* Support */}
            <section className="api-section">
              <h2>Support</h2>
              <p>Need help with the API? Here are your options:</p>
              
              <div className="support-options">
                <div className="support-option">
                  <h3>📧 Email Support</h3>
                  <p>For technical questions and bug reports</p>
                  <a href="mailto:api@themebotpark.com">api@themebotpark.com</a>
                </div>
                <div className="support-option">
                  <h3>📖 Documentation</h3>
                  <p>Comprehensive guides and examples</p>
                  <a href="/help">Help Center</a>
                </div>
                <div className="support-option">
                  <h3>🐛 Bug Reports</h3>
                  <p>Report API bugs and issues</p>
                  <a href="https://github.com/kev7n11f/themebotpark/issues" target="_blank" rel="noopener noreferrer">GitHub Issues</a>
                </div>
                <div className="support-option">
                  <h3>💬 Community</h3>
                  <p>Connect with other developers</p>
                  <a href="#community">Developer Forum</a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}