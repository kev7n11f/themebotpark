# Contributing to ThemeBotPark 🤝

Thank you for your interest in contributing to ThemeBotPark! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, Node.js, and Express

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/themebotpark.git
   cd themebotpark
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.template .env
   # Edit .env with your API keys and configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   This runs both the React client (port 3000) and Express server (port 5000) concurrently.

## 📝 Development Guidelines

### Code Style

- Use ES6+ JavaScript features
- Follow existing code formatting and naming conventions
- Use functional React components with hooks
- Write clean, readable, and well-commented code
- Use semantic HTML and proper accessibility attributes

### File Organization

```
src/
├── components/     # Reusable React components
├── pages/         # Route-level page components
├── contexts/      # React Context providers
├── styles/        # CSS files
└── utils/         # Utility functions

api/               # Serverless API endpoints
docs/             # Documentation files
```

### Component Guidelines

- Keep components small and focused
- Use descriptive component and prop names
- Include PropTypes or TypeScript definitions
- Handle loading and error states
- Ensure mobile responsiveness

### CSS Guidelines

- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use the existing design system variables
- Ensure accessibility compliance (WCAG AA)

## 🔧 Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add new bot personality creation flow
fix: resolve mobile navigation overlap issue
docs: update API documentation
style: improve button hover animations
```

### Testing

Before submitting a pull request:

1. **Run Linting**
   ```bash
   npm run lint
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Test Functionality**
   - Test on multiple device sizes
   - Verify all links and buttons work
   - Check accessibility with screen readers
   - Test with different browsers

## 📋 Pull Request Process

### Before Submitting

1. Ensure your branch is up to date with main
2. Test your changes thoroughly
3. Update documentation if needed
4. Add/update tests for new functionality
5. Verify mobile responsiveness

### PR Template

Include in your pull request:

- **Description**: What changes were made and why
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes, include before/after screenshots
- **Breaking Changes**: List any breaking changes
- **Related Issues**: Reference any related GitHub issues

### Review Process

1. All PRs require at least one review
2. Automated tests must pass
3. Changes should maintain or improve accessibility
4. Performance impact should be considered
5. Documentation should be updated as needed

## 🐛 Bug Reports

When reporting bugs, please include:

- **Environment**: Browser, OS, device type
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Console Errors**: Any JavaScript errors

Use the bug report template:

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- Browser: [e.g., Chrome 91]
- OS: [e.g., Windows 10]
- Device: [e.g., iPhone 12]
```

## 💡 Feature Requests

For feature requests, please include:

- **Use Case**: Why this feature would be valuable
- **Proposed Solution**: Your idea for implementing it
- **Alternative Solutions**: Other approaches considered
- **Additional Context**: Any other relevant information

## 🏗️ Architecture Overview

### Frontend (React)

- **Routing**: React Router for client-side navigation
- **Styling**: CSS3 with custom properties for theming
- **State Management**: React Context and hooks
- **Build Tool**: Create React App with custom configuration

### Backend (Node.js/Express)

- **API**: RESTful endpoints in `/api` directory
- **Authentication**: JWT tokens with bcrypt password hashing
- **External APIs**: OpenAI for chat, Stripe for payments
- **Deployment**: Vercel serverless functions

### Key Components

- **Bot System**: Personality-based AI chat interfaces
- **Authentication**: Secure user registration and login
- **Subscription**: Stripe integration for premium features
- **Email**: Contact form with Nodemailer integration

## 🔒 Security Guidelines

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Sanitize user inputs
- Follow OWASP security practices
- Report security vulnerabilities privately

## 📞 Community

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code of Conduct**: Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)

## 🙏 Recognition

Contributors are recognized in our [README](README.md#contributors) and release notes. We appreciate every contribution, no matter how small!

---

Thank you for contributing to ThemeBotPark! 🚀✨