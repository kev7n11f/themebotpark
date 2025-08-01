# ThemeBotPark 🤖

## AI Chatbots with Unique Personalities

Experience conversations with AI bots that have distinct personalities. From business strategy to relationship advice, find the perfect AI companion for your needs.

## 🌟 Live Production Site

**<https://themebotpark.vercel.app>**

*Try it now with demo account: demo@themebotpark.com / demo123*

## 🤖 Meet Our Bots

### 🌧️ RainMaker

Your strategic business companion. Specializes in income generation, marketing strategies, and entrepreneurial guidance.

### 💓 HeartSync  

The empathetic relationship guide. Understands emotions and relationships, offering compassionate insights.

### 🛠️ FixItFrank

Your witty technical troubleshooter. Combines deep technical knowledge with humor and efficiency.

### 🧨 TellItLikeItIs

The unfiltered truth-teller. Provides honest, direct feedback without sugarcoating.

## ✨ Features

- **🔐 User Authentication** - Secure login/register system with JWT
- **💬 AI Chat System** - OpenAI integration with unique bot personalities  
- **💳 Stripe Payments** - Premium subscription with real payment processing
- **📧 Contact System** - Functional contact form with email integration
- **📱 Responsive Design** - Works perfectly on all devices
- **🎨 Modern UI** - Clean, professional interface
- **⚡ Performance Optimized** - Fast loading with PWA support
- **🔍 SEO Optimized** - Schema.org markup, meta tags, sitemap

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
cp .env.example .env
# Add your API keys (OpenAI, Stripe, etc.)

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
