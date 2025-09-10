# ThemeBotPark - AI Chatbot Platform 🤖

A modern, multi-personality AI chatbot platform built with React 18.3.1 and Node.js/Express.

## 🚀 Live Demo
**Production URL:** [Coming Soon - Deploying...]

## ✨ Features

### 🤖 Unique AI Personalities
- **RainMaker 🌧️** - Strategic business and income generation
- **HeartSync 💓** - Relationship advice and emotional support  
- **FixItFrank 🛠️** - Technical troubleshooting and solutions
- **TellItLikeItIs 🧨** - Honest feedback and direct communication
- **SafeSpace 🕊️** - Conflict mediation and understanding bridge
- **CreativeCanvas 🎨** - Artistic inspiration and creative guidance
- **WellnessWise 🧘** - Mental health and wellness coaching

### 💎 Modern Tech Stack
- **React 18.3.1** with latest concurrent features
- **Node.js/Express 4.18.2** RESTful API
- **OpenAI GPT** integration for AI chat
- **Stripe** payment processing
- **JWT Authentication** with secure sessions
- **Modern CSS** design system with glassmorphism

### 🎨 Design System
- Unique personality-based themes
- Responsive glassmorphism UI
- Dark mode support
- Professional yet playful aesthetic

## 📈 Recent Updates (v2.0)
- ✅ Updated all dependencies to latest versions
- ✅ Comprehensive design system implementation  
- ✅ Fixed authentication and registration issues
- ✅ Enhanced API error handling
- ✅ Modern UI/UX with glassmorphism effects
- ✅ Performance optimizations

## 🤖 Meet Our Bots

### 🌧️ RainMaker

Your strategic business companion. Specializes in income generation, marketing strategies, and entrepreneurial guidance.

### 💓 HeartSync  

The empathetic relationship guide. Understands emotions and relationships, offering compassionate insights.

### 🛠️ FixItFrank

Your witty technical troubleshooter. Combines deep technical knowledge with humor and efficiency.

### 🧨 TellItLikeItIs

The unfiltered truth-teller. Provides honest, direct feedback without sugarcoating.

### 🕊️ SafeSpace

Your compassionate mediator who creates safe spaces for difficult conversations. Specializes in helping people understand different perspectives and find common ground in conflicts.

### 🎨 CreativeCanvas

Your artistic muse that sparks creativity and provides inspiration. From brainstorming sessions to artistic guidance and design thinking.

### 🧘 WellnessWise

Your gentle wellness coach focused on mental health, mindfulness, and self-care. Supports your journey to inner peace and emotional balance.

## ✨ Features

- **🔐 User Authentication** - Secure login/register system with JWT
- **💬 AI Chat System** - OpenAI integration with unique bot personalities  
- **💳 Stripe Payments** - Premium subscription with real payment processing
- **📧 Contact System** - Functional contact form with email integration
- **📱 Responsive Design** - Works perfectly on all devices
- **🎨 Modern UI** - Clean, professional interface
- **⚡ Performance Optimized** - Fast loading with PWA support
- **🔍 SEO Optimized** - Schema.org markup, meta tags, sitemap
- **📊 Analytics** - Vercel Analytics for comprehensive website analytics and performance monitoring

## 🚀 Tech Stack

### Frontend

- **React 19** - Latest React with modern features
- **React Router** - Client-side routing
- **CSS3** - Custom styling with variables and gradients

### Backend  

- **Node.js/Express** - REST API server
- **OpenAI API** - GPT-powered chat functionality
- **Stripe** - Payment processing
- **JWT** - Authentication tokens

### Deployment

- **Vercel** - Serverless deployment platform
- **Git** - Version control

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/themebotpark.git
cd themebotpark

# Install dependencies
npm install

# Set up environment variables
cp .env.template .env
# Edit .env file with your API keys (OpenAI, Stripe, etc.)

# Run development server
npm run dev

# Build for production
npm run build
```plaintext

## 📊 Project Structure

```plaintext

themebotpark/
├── public/           # Static files, favicon, manifest
├── src/
│   ├── components/   # Reusable React components
│   ├── pages/        # Page components
│   ├── contexts/     # React context providers
│   └── styles/       # CSS files
├── api/              # Serverless API endpoints
├── logs/             # Application logs
└── package.json      # Dependencies and scripts

```

## 👨‍💻 Created By

**Kevin Franklin** - Full-stack developer passionate about AI and user experience.

---

**Ready to chat with personality?** [Visit ThemeBotPark →](https://themebotpark-b35brpylq-kevins-projects-5e23f80d.vercel.app)

## Original Project Notes

🚀 ThemeBotPark is a multi-mode AI chatbot playground powered by autodevelop.ai, featuring scroll-based navigation, creative bot personalities, voice chat, subscriptions, and long-term memory.

## 🔄 CI/CD with GitHub Actions

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys the site to Vercel on every push to `main`. To enable deployment:

1. In your GitHub repository settings, under **Secrets and variables → Actions**, add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel personal access token.
   - `VERCEL_ORG_ID`: Your Vercel organization ID.
   - `VERCEL_PROJECT_ID`: Your Vercel project ID.

2. Push changes to `main`, and the workflow will automatically build and deploy to production.

3. Monitor build status in the **Actions** tab.

Now every commit to `main` triggers an automatic deployment on Vercel! 🎉

## 📊 Analytics & Performance Monitoring

ThemeBotPark includes comprehensive analytics and performance monitoring through Vercel Analytics:

### Features
- **📈 Page Views & User Sessions** - Automatic tracking of all website interactions
- **⚡ Core Web Vitals** - Real-time performance metrics and user experience scores
- **🚀 Speed Insights** - Page load times and performance optimization recommendations
- **🔒 Privacy-First** - GDPR compliant with no cookies or personal data collection

### Setup
Analytics is automatically enabled when deployed to Vercel. No additional configuration required!

### Viewing Data
1. Visit your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the ThemeBotPark project
3. Navigate to the "Analytics" tab
4. View real-time metrics and historical data

For detailed information, see [`ANALYTICS.md`](./ANALYTICS.md).

## Environment & Security Configuration

### Environment Setup

1. **Copy Environment Template**
   ```bash
   cp .env.template .env
   ```

2. **Configure Required Variables**

   For **development**:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `JWT_SECRET` - Will be auto-generated if not provided (dev only)
   - Other variables have sensible defaults

   For **production**:
   - `OPENAI_API_KEY` - **Required** - Your OpenAI API key
   - `JWT_SECRET` - **Required** - Strong random string (32+ characters)
   - `STRIPE_SECRET_KEY` - **Required** - Your Stripe secret key
   - `REACT_APP_API_BASE_URL` - **Required** - Your API base URL
   - `PUBLIC_URL` - **Required** - Your frontend public URL
   - `CORS_ORIGINS` - **Required** - Comma-separated allowed origins

3. **Configure Optional Variables**

   **Stripe Plans (recommended)**:
   ```
   STRIPE_PRICE_BASIC=price_xxxxx_basic
   STRIPE_PRICE_PRO=price_xxxxx_pro  
   STRIPE_PRICE_PREMIUM=price_xxxxx_premium
   STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXX
   ```

   **Email Configuration (choose one)**:
   ```
   # SendGrid
   SENDGRID_API_KEY=SG.your_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   
   # OR SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

### Security Features

- **Password Hashing**: Bcrypt with configurable salt rounds
- **JWT Authentication**: Strong secret required in production
- **Rate Limiting**: Global and per-endpoint limits (configurable)
- **CORS Protection**: Restricted to configured origins
- **HTTP Security**: Helmet middleware for security headers
- **Plan-based Stripe**: No arbitrary price IDs accepted from clients
- **Environment Validation**: Required variables checked at startup

### Documentation

- See `docs/SECURITY.md` for detailed security overview
- All environment variables documented in `.env.template`
