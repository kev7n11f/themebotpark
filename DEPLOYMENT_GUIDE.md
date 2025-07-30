# 🚀 ThemeBotPark Deployment Guide

## Quick Start for Development

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd themebotpark
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys (optional for demo mode)
   ```

3. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This starts both the React frontend (port 3000) and Express backend (port 3001).

4. **Open Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Demo Account Access

- **Premium User**: demo@themebotpark.com / demo123
- **Free User**: test@example.com / password

## Production Deployment on Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Environment Variables (Optional)**
   Set these in Vercel dashboard for full functionality:
   - `OPENAI_API_KEY` - For AI responses
   - `STRIPE_SECRET_KEY` - For payments
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` - For frontend
   - `JWT_SECRET` - For authentication

## Features That Work Without API Keys

✅ **Full Demo Mode Available**:
- All 4 bot personalities with fallback responses
- Complete authentication system with demo users
- Premium subscription simulation (no real payments)
- Chat interface with memory persistence
- Responsive design and navigation

## API Endpoints Ready

- `/api/auth` - User authentication
- `/api/chat` - AI chat with 4 personalities
- `/api/stripe` - Payment processing (demo mode)
- `/api/contact` - Contact form handling
- `/api/user` - User management
- `/api/creator` - Bot creation (future feature)

## Testing Commands

```bash
# Test authentication
curl -X POST -H "Content-Type: application/json" \
  http://localhost:3001/api/auth \
  -d '{"action":"login","email":"demo@themebotpark.com","password":"demo123"}'

# Test chat
curl -X POST -H "Content-Type: application/json" \
  http://localhost:3001/api/chat \
  -d '{"mode":"RainMaker","message":"Help me with business ideas"}'
```

The application is production-ready and fully functional!
