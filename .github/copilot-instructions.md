# GitHub Copilot Instructions for ThemeBotPark

## Project Overview

ThemeBotPark is a modern multi-personality AI chatbot platform built with React 18.3.1 and Node.js/Express. The application features secure authentication, premium subscriptions via Stripe, and 7 unique AI chatbot personalities powered by OpenAI's GPT models with intelligent fallback responses.

**Live Production URL:** https://themebotpark.vercel.app  
**Architecture:** Hybrid serverless (Vercel) + Express development server

## Technology Stack

### Frontend
- **React 18.3.1** with React Router DOM 6.28.0
- **Framer Motion 11.11.11** for animations 
- **Lucide React 0.453.0** for modern icons
- **Design System** with CSS custom properties and glassmorphism UI
- **Vercel Analytics & Speed Insights** for performance monitoring
- **React Helmet Async** for SEO optimization

### Backend
- **Node.js/Express 4.21.1** with security middleware (Helmet, CORS, rate limiting)
- **JWT Authentication** with bcrypt password hashing
- **OpenAI API 5.10.1** with smart fallback system
- **Stripe 18.3.0** for subscription management
- **Nodemailer 7.0.5** for email functionality

### Development & Infrastructure  
- **Windows PowerShell** development environment
- **Vercel** serverless deployment with `/api` functions
- **Concurrently** for running client + server in development
- **Cross-env** for Windows compatibility

## Build System & Development Workflow

### Development Commands (Windows PowerShell)
```powershell
# Install dependencies (~30s) - includes automatic postinstall build
npm install

# Development with hot reload (ports 3000 + 5000)
npm run dev          # Runs both client and server via concurrently
npm run client       # React dev server only
npm run server       # Express server with nodemon

# Production build (~8s) with legacy OpenSSL support
npm run build        # Uses cross-env NODE_OPTIONS=--openssl-legacy-provider

# Production server
npm start           # NODE_ENV=production node server.js

# Code quality & analysis
npm run lint        # ESLint (currently 17 issues - acceptable)
npm run lint:fix    # Auto-fix linting issues
npm run build:analyze  # Webpack bundle analyzer
npm run optimize    # lint:fix + build + test:coverage
```

### Critical Architecture Patterns

**Dual Server Pattern**: Development uses Express server (`server.js`) while production uses Vercel serverless functions (`/api/`). Both share identical endpoints.

**Smart API Fallbacks**: `api/chat.js` includes sophisticated fallback responses when OpenAI API is unavailable, using keyword matching for contextual replies.

**Bot Personality System**: Each bot has dedicated system prompts, welcome messages, and fallback responses. Personalities are defined in `/api/chat.js` with consistent emoji branding.

**Environment Validation**: `config/env.js` + `assertEnv()` validates required variables at startup, preventing runtime failures.

## Project Structure

```
themebotpark/
├── .github/
│   ├── workflows/deploy.yml    # GitHub Actions CI/CD
│   └── copilot-instructions.md # This file
├── public/
│   ├── index.html             # Main HTML template
│   ├── manifest.json          # PWA manifest
│   └── sw-enhanced.js         # Service worker
├── src/
│   ├── components/            # Reusable React components
│   │   ├── AuthModal.js       # Login/Register modal
│   │   ├── BotSection/        # Bot personality components
│   │   ├── ErrorBoundary.js   # Error handling
│   │   ├── SEOHead.js         # SEO meta tags
│   │   ├── SlideMenu.js       # Navigation menu
│   │   └── UserHeader.js      # User authentication UI
│   ├── pages/                 # Route components
│   │   ├── HomePage.js        # Landing page
│   │   ├── Chat.js           # Chat interface
│   │   ├── ContactUs.js      # Contact form
│   │   └── CreatorDashboard.js # Admin dashboard
│   ├── contexts/             # React Context providers
│   ├── styles/               # CSS modules
│   ├── App.js               # Main app component
│   └── index.js             # React entry point
├── api/                     # Vercel serverless functions
│   ├── auth.js             # Authentication endpoints
│   ├── chat.js             # OpenAI chat integration
│   ├── contact.js          # Contact form handler
│   ├── stripe.js           # Payment processing
│   └── subscription-status.js # Subscription management
├── server.js               # Express server (dev/production)
├── package.json           # Dependencies and scripts
└── vercel.json           # Vercel deployment config
```

## Key Bot Personalities & System Architecture

### 🌧️ RainMaker - Strategic Business AI
- **System Prompt**: Strategic AI focused on income generation, marketing strategies, and ROI optimization
- **Welcome**: "Ready to brainstorm some income-generating ideas? Let's make it rain! 🌧️💰"
- **Fallback Pattern**: Business tips with ROI focus, problem-solving emphasis

### 💓 HeartSync - Emotional Intelligence AI  
- **System Prompt**: Empathetic AI for relationships, emotional patterns, and personal growth
- **Welcome**: "I'm here to help you understand your deeper patterns. What's on your heart? 💓"
- **Fallback Pattern**: Relationship insights, emotional awareness, pattern recognition

### 🛠️ FixItFrank - Technical Troubleshooting AI
- **System Prompt**: Witty, efficient technical troubleshooter with no-nonsense attitude  
- **Welcome**: "Got a problem that needs fixing? Let's troubleshoot this thing! 🛠️"
- **Fallback Pattern**: Debug methodologies, systematic problem-solving

### 🧨 TellItLikeItIs - Direct Feedback AI
- **System Prompt**: Unfiltered truth-teller delivering honest insights without sugarcoating
- **Welcome**: "Ready for some unfiltered truth? Ask me anything - no sugarcoating! 🧨"  
- **Fallback Pattern**: Reality checks, direct action steps, comfort zone challenges

### 🕊️ SafeSpace - Conflict Mediation AI
- **System Prompt**: Compassionate mediator creating safe spaces for difficult conversations
- **Welcome**: "Welcome to your safe space. I'm here to help bridge understanding..."
- **Fallback Pattern**: Perspective-taking, peaceful communication, empathy building

### 🎨 CreativeCanvas - Artistic Inspiration AI
- **System Prompt**: Artistic muse for creativity, brainstorming, and design thinking
- **Welcome**: "Ready to unleash your creativity? Let's paint outside the lines..."
- **Fallback Pattern**: Creative prompts, innovation techniques, artistic encouragement

### 🧘 WellnessWise - Mental Health & Wellness AI
- **System Prompt**: Gentle wellness coach for mental health, mindfulness, and self-care
- **Welcome**: "Take a deep breath and welcome to your wellness journey..."
- **Fallback Pattern**: Self-care guidance, mindfulness techniques, gentle progress

## API Architecture & Smart Fallbacks

### Core API Pattern (`/api/chat.js`)
```javascript
// Dual-mode serverless function with intelligent fallbacks
module.exports = async (req, res) => {
  const { mode, message, messages } = req.body;
  
  // OpenAI integration with contextual fallbacks
  if (!openai) {
    return res.json({
      response: getFallbackResponse(mode, message),
      fallback: true
    });
  }
  
  // Conversation history preservation
  const conversationHistory = [
    { role: 'system', content: botPrompts[mode] },
    ...messages.map(msg => ({ 
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text 
    })),
    { role: 'user', content: message }
  ];
}
```

### Authentication Flow (`src/contexts/UserContext.js`)
- **JWT Storage**: localStorage with automatic verification
- **Error Handling**: Silent failures on initial load, explicit errors on user actions  
- **State Management**: React Context with loading states and subscription tracking
- **API Integration**: Unified auth actions (login/register/verify) via `src/utils/api.js`

### Design System Architecture (`src/styles/design-system.css`)
- **Bot-Specific Variables**: Each personality has dedicated CSS custom properties
- **Color Gradients**: `--{botname}-gradient` for personality-based theming
- **Glassmorphism**: Modern UI patterns with backdrop-blur and transparency
- **Responsive Foundation**: Mobile-first design with semantic breakpoints

## API Endpoints

### Authentication (`/api/auth.js`)
- `POST /api/auth` - Login/Register/Password Reset
- JWT token generation and validation
- User session management

### Chat System (`/api/chat.js`)
- `POST /api/chat` - Send message to AI bot
- OpenAI GPT integration with personality prompts
- Conversation history and context management

### Payments (`/api/stripe.js`)
- `POST /api/stripe` - Create payment sessions
- Subscription management
- Webhook handling for payment events

### Contact (`/api/contact.js`)
- `POST /api/contact` - Submit contact form
- Email notification system
- Form validation and sanitization

## Development Workflow

### Local Development Setup (Windows PowerShell)
```powershell
# 1. Clone and install
git clone <repository>
cd themebotpark
npm install

# 2. Environment setup
cp .env.template .env
# Configure: OPENAI_API_KEY, STRIPE_SECRET_KEY, JWT_SECRET, etc.

# 3. Start development (dual-server mode)
npm run dev  # Starts both client (3000) and server (5000)
```

### Critical Development Patterns

**Environment Validation**: `config/env.js` exports validated environment configuration and `assertEnv()` function. Always use `env.variableName` instead of `process.env.VARIABLE`.

**Error Boundaries**: All components wrapped in `ErrorBoundary` and `SafeComponentWrapper` for graceful degradation.

**Offline Resilience**: Enhanced API utilities in `src/utils/apiUtils.js` with request queuing and retry logic.

**Bot Navigation**: `localStorage.setItem('activeBot', botId)` followed by navigation to `/chat` preserves bot selection across routes.

### Environment Variables Required
```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...

# Authentication
JWT_SECRET=your-secret-key

# Email (Nodemailer)
EMAIL_USER=your-email
EMAIL_PASS=your-app-password

# Database (if applicable)
```

### Testing Scenarios

#### Manual Testing Checklist
1. **User Registration**
   - Valid email format validation
   - Password strength requirements
   - Duplicate email prevention
   - Success confirmation

2. **User Login**
   - Correct credential acceptance
   - Invalid credential rejection
   - JWT token generation
   - Session persistence

3. **Chat Functionality**
   - Bot personality responses
   - Message history preservation
   - Real-time message display
   - Error handling for API failures

4. **Payment Integration**
   - Stripe checkout flow
   - Subscription activation
   - Payment confirmation
   - Subscription status updates

5. **Contact Form**
   - Form validation
   - Email delivery
   - Success/error messaging
   - Spam prevention

## Deployment & CI/CD

### Vercel Deployment
- Automatic deployment on push to `main`
- Environment variables configured in Vercel dashboard
- Serverless functions in `/api` directory
- Build command: `npm run build`
- Start command: `npm start`

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
# Builds and deploys to Vercel on every push to main
# Requires: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID secrets
```

## Code Style & Patterns

### React Patterns
- Functional components with hooks
- Context API for global state
- Custom hooks for reusable logic
- Error boundaries for error handling
- React Router for navigation

### CSS Organization
- Component-scoped CSS files
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Flexbox and Grid for layouts

### Error Handling
- Try-catch blocks in async functions
- User-friendly error messages
- Error boundary components
- Graceful degradation for API failures

## Performance Optimization

### Build Optimization
- Code splitting with React.lazy
- Bundle size monitoring
- Service worker for caching
- Image optimization

### Runtime Performance
- Memoization with React.memo
- useCallback for function optimization
- Debounced user inputs
- Lazy loading for components

## SEO & Accessibility

### SEO Implementation
- React Helmet Async for meta tags
- Schema.org structured data
- Sitemap generation
- Open Graph tags

### Accessibility Features
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## Common Issues & Solutions

### Common Issues & Solutions

### Windows Development Issues
- **OpenSSL Legacy Provider**: Always use `cross-env NODE_OPTIONS=--openssl-legacy-provider` for React scripts
- **PowerShell Execution**: Commands optimized for Windows PowerShell v5.1
- **Port Conflicts**: Ensure ports 3000 and 5000 are available

### Build Issues
- **Memory Limits**: Increase Node.js heap size if needed with `--max-old-space-size=4096`
- **Dependency Conflicts**: Check package-lock.json for version mismatches
- **ESLint Acceptance**: 17 issues (13 errors, 4 warnings) is acceptable baseline

### Development Issues
- **Environment Variables**: Verify all required variables are set in `.env` (not `.env.example`)
- **CORS Errors**: Check `middleware/cors.js` configuration and `CORS_ORIGINS` env var
- **Dual Server Architecture**: Development uses Express (`server.js`), production uses Vercel (`/api/`)

### Deployment Issues
- **Vercel Functions**: Ensure API routes export serverless handlers: `module.exports = async (req, res) => {}`
- **Environment Variables**: Configure in Vercel dashboard, not just local `.env`
- **Static Routes**: Vercel.json routing handles SPA fallback to `/build/index.html`

## Security Considerations

### Best Practices
- Input validation and sanitization
- SQL injection prevention
- XSS protection with React's built-in escaping
- HTTPS enforcement in production
- Rate limiting on API endpoints
- Secure JWT token handling

### Environment Security
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Rotate secrets regularly
- Monitor for security vulnerabilities

## Testing Strategy

### Unit Testing
- Jest for JavaScript testing
- React Testing Library for component testing
- Mock API responses for integration tests

### Manual Testing Scenarios
1. Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
2. Mobile responsiveness (iOS, Android)
3. Network failure handling
4. Payment flow testing (use Stripe test cards)
5. Email delivery verification

## Maintenance & Updates

### Regular Tasks
- Monitor ESLint issues (currently 17 issues)
- Update dependencies monthly
- Review security vulnerabilities
- Performance monitoring
- User feedback integration

### Monitoring
- Error tracking and reporting
- Performance metrics
- User analytics
- Server health monitoring

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start development environment
npm run client           # React dev server only
npm run server           # Express server only

# Production
npm run build            # Build for production (~8s)
npm start               # Start production server

# Quality
npm run lint            # ESLint (17 issues expected)
npm test                # Run tests
npm audit               # Security audit

# Deployment
git push origin main    # Triggers automatic Vercel deployment
```

This file serves as a comprehensive guide for GitHub Copilot to understand the project structure, development workflow, and best practices for contributing to ThemeBotPark.