const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { env } = require('./config/env');
const { signUser } = require('./utils/jwt');
const router = express.Router();

// In production, replace this with a real database connection
// For now, using in-memory storage with better structure
const users = new Map();

// Initialize with some test users (remove in production)
const initializeUsers = async () => {
  const hashedPassword1 = await bcrypt.hash('demo123', env.bcryptRounds);
  const hashedPassword2 = await bcrypt.hash('password', env.bcryptRounds);
  
  users.set('demo@themebotpark.com', {
    id: 1,
    email: 'demo@themebotpark.com',
    password: hashedPassword1,
    name: 'Demo User',
    subscription: 'premium',
    createdAt: new Date('2025-01-01'),
    emailVerified: true
  });
  
  users.set('test@example.com', {
    id: 2,
    email: 'test@example.com',
    password: hashedPassword2,
    name: 'Test User',
    subscription: 'free',
    createdAt: new Date(),
    emailVerified: true
  });
};

initializeUsers();

router.get('/', (req, res) => {
  res.json({ 
    status: 'Auth API is working!',
    endpoints: ['/login', '/register', '/verify-token', '/forgot-password'],
    authMethods: ['email', 'google'],
    environment: env.nodeEnv
  });
});

// Configure rate limiter for POST routes
const postRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.maxRequests,
  message: { error: 'Too many requests, please try again later.' }
});

router.post('/', postRateLimiter, async (req, res) => {
  const { action } = req.body;

  try {
    switch (action) {
      case 'login':
        return await handleLogin(req, res);
      case 'register':
        return await handleRegister(req, res);
      case 'verify-token':
        return await handleVerifyToken(req, res);
      case 'forgot-password':
        return await handleForgotPassword(req, res);
      case 'logout':
        return await handleLogout(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

// Login handler
async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Find user
  const user = users.get(email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create JWT token
  const token = signUser(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription: user.subscription,
      emailVerified: user.emailVerified
    }
  });
}

// Register handler
async function handleRegister(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Check if user exists
  if (users.has(email.toLowerCase())) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);

  // Create new user
  const newUser = {
    id: users.size + 1,
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    subscription: 'free',
    createdAt: new Date(),
    emailVerified: false
  };

  users.set(email.toLowerCase(), newUser);

  // Create JWT token
  const token = signUser(newUser);

  res.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      subscription: newUser.subscription,
      emailVerified: newUser.emailVerified
    }
  });
}

// Token verification handler
async function handleVerifyToken(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    
    // Find user to get latest info
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
}

// Forgot password handler (would integrate with email service in production)
async function handleForgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const user = users.get(email.toLowerCase());
  
  if (!user) {
    // Don't reveal if user exists for security
    return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  }

  // In production, you would:
  // 1. Generate a secure reset token
  // 2. Save it to the database with expiration
  // 3. Send email with reset link
  
  console.log(`Password reset requested for: ${email}`);
  
  res.json({ 
    success: true, 
    message: 'If the email exists, a reset link has been sent'
  });
}

// Logout handler
async function handleLogout(req, res) {
  // In production, you might invalidate the token in a blacklist
  res.json({ success: true, message: 'Logged out successfully' });
}

// Legacy routes for backward compatibility
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.get(email?.toLowerCase());
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email: user.email }, 
    env.jwtSecret
  );
  res.json({ token });
});

router.post('/google-login', (req, res) => {
  // Placeholder for OAuth with Google
  res.json({ message: 'Google OAuth integration needed' });
});

module.exports = router;