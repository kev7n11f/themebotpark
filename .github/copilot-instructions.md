# GitHub Copilot Instructions for ThemeBotPark

## Project Overview

ThemeBotPark is a multi-personality AI chatbot platform built with React 18.3.1 and Node.js/Express. The application features secure authentication, premium subscriptions via Stripe, and unique AI chatbot personalities powered by OpenAI's GPT models.

**Live Production URL:** https://themebotpark.vercel.app
**Demo Account:** [demo credentials available in secure documentation]

## Technology Stack

### Frontend
- **React 18.3.1** with React Router DOM 6.8.1
- **Modern JavaScript (ES6+)** with JSX
- **CSS3** with custom properties and responsive design
- **PWA** support with service workers
- **React Helmet Async** for SEO optimization

### Backend
- **Node.js/Express 4.18.2** RESTful API
- **JWT Authentication** with bcrypt password hashing
- **OpenAI API 5.10.1** for AI chat functionality
- **Stripe 18.3.0** for payment processing
- **Nodemailer 7.0.5** for email functionality

### Deployment & Infrastructure
- **Vercel** serverless deployment (primary)
- **GitHub Actions** CI/CD pipeline
- **Environment-based configuration** (.env files)

## Build System & Timing

### Development Commands
```bash
# Install dependencies (~30s)
npm install

# Development with hot reload
npm run dev          # Runs both client and server concurrently
npm run client       # React dev server (port 3000)
npm run server       # Express server with nodemon (port 5000)

# Production build (~8s)
npm run build        # Creates optimized production build

# Production server
npm start            # Runs production server

# Code quality
npm run lint         # ESLint (currently shows 17 issues - 13 errors, 4 warnings)
npm test             # Jest test runner
```

### Build Performance Expectations
- **npm install**: ~30 seconds (includes automatic build via postinstall)
- **npm run build**: ~8 seconds (standalone build)
- **ESLint**: Shows 17 issues (acceptable, mostly service worker globals)

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

## Key Bot Personalities

### 🌧️ RainMaker
- **Focus**: Business strategy, income generation, marketing
- **Personality**: Strategic, results-oriented, entrepreneurial
- **Use Cases**: Business planning, revenue optimization, growth strategies

### 💓 HeartSync
- **Focus**: Relationships, emotional intelligence, empathy
- **Personality**: Compassionate, understanding, supportive
- **Use Cases**: Relationship advice, emotional support, interpersonal guidance

### 🛠️ FixItFrank
- **Focus**: Technical troubleshooting, problem-solving
- **Personality**: Witty, efficient, technically knowledgeable
- **Use Cases**: Technical support, debugging, system optimization

### 🧨 TellItLikeItIs
- **Focus**: Honest feedback, direct communication
- **Personality**: Unfiltered, straightforward, no-nonsense
- **Use Cases**: Honest opinions, direct feedback, reality checks

## Authentication & Security

### JWT Implementation
- Tokens stored in localStorage
- Server-side verification for protected routes
- Bcrypt password hashing (rounds: 10)
- Rate limiting on API endpoints

### User Validation Scenarios
1. **Registration Flow**: Email validation, password strength, duplicate checking
2. **Login Flow**: Credential verification, JWT generation, user session
3. **Protected Routes**: Token validation, expiration handling
4. **Password Reset**: Email verification, secure token generation

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

### Local Development Setup
```bash
# 1. Clone and install
git clone <repository>
cd themebotpark
npm install

# 2. Environment setup
cp .env.example .env
# Configure: OPENAI_API_KEY, STRIPE_SECRET_KEY, JWT_SECRET, etc.

# 3. Start development
npm run dev  # Starts both client (3000) and server (5000)
```

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

### Build Issues
- **OpenSSL Legacy Provider**: Use `NODE_OPTIONS=--openssl-legacy-provider`
- **Memory Limits**: Increase Node.js heap size if needed
- **Dependency Conflicts**: Check package-lock.json for version mismatches

### Development Issues
- **Port Conflicts**: Ensure ports 3000 and 5000 are available
- **Environment Variables**: Verify all required variables are set
- **CORS Errors**: Check server.js CORS configuration

### Deployment Issues
- **Vercel Functions**: Ensure API routes follow Vercel serverless format
- **Environment Variables**: Configure in Vercel dashboard
- **Build Failures**: Check build logs for missing dependencies

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