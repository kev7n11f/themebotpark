const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');
const { signUser } = require('../utils/jwt');
const router = express.Router();

// Demo user database (in production, use real database)
const demoUsers = [
  {
    id: 1,
    email: 'demo@themebotpark.com',
    password: 'demo123', // Will be hashed on startup
    name: 'Demo User',
    subscription: 'premium',
    createdAt: new Date('2025-01-01')
  },
  {
    id: 2,
    email: 'test@example.com',
    password: 'password', // Will be hashed on startup
    name: 'Test User',
    subscription: 'free',
    createdAt: new Date()
  }
];

// Hash existing demo user passwords on startup if not already hashed
async function hashDemoUserPasswords() {
  for (const user of demoUsers) {
    if (!user.password.startsWith('$2')) { // Not a bcrypt hash
      user.password = await bcrypt.hash(user.password, env.bcryptRounds);
    }
  }
}

// Initialize demo user passwords
hashDemoUserPasswords().catch(console.error);

router.use((req, res, next) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

router.get('/', (req, res) => {
  res.json({ 
    status: 'Auth API is working!',
    endpoints: ['/login', '/register', '/verify-token'],
    authMethods: ['email', 'google']
  });
});

// Configure rate limiter for POST / route
const postRateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMinutes * 60 * 1000,
  max: env.rateLimit.maxRequests,
  message: { error: 'Too many requests, please try again later.' }
});

router.post('/', postRateLimiter, async (req, res) => {
  const { action } = req.body;
  console.log('AUTH API: POST request received:', { action, hasBody: !!req.body });

  try {
    switch (action) {
      case 'login':
        return await handleLogin(req, res);
      case 'register':
        return await handleRegister(req, res);
      case 'verify-token':
        return await handleVerifyToken(req, res);
      case 'logout':
        return await handleLogout(req, res);
      default:
        console.log('AUTH API: Invalid action:', action);
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('AUTH API: Unhandled error:', error);
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

  // Find user (in production, query database)
  const user = demoUsers.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Compare password with hash
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
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
      subscription: user.subscription
    }
  });
}

// Register handler
async function handleRegister(req, res) {
  console.log('AUTH API: Registration request received:', {
    email: req.body.email,
    name: req.body.name,
    hasPassword: !!req.body.password
  });
  
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    console.log('AUTH API: Missing required fields');
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('AUTH API: Invalid email format');
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Password policy enforcement
  if (password.length < 8) {
    console.log('AUTH API: Password too short');
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  // Check if user exists
  const existingUser = demoUsers.find(u => u.email === email);
  if (existingUser) {
    console.log('AUTH API: User already exists');
    return res.status(409).json({ error: 'User already exists' });
  }

  try {
    // Hash password
    console.log('AUTH API: Hashing password...');
    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);

    // Create new user (in production, save to database)
    const newUser = {
      id: demoUsers.length + 1,
      email,
      password: hashedPassword,
      name,
      subscription: 'free',
      createdAt: new Date()
    };

    demoUsers.push(newUser);
    console.log('AUTH API: New user created:', { id: newUser.id, email: newUser.email });

    // Create JWT token
    console.log('AUTH API: Creating JWT token...');
    const token = signUser(newUser);

    console.log('AUTH API: Registration successful, sending response');
    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription
      }
    });
  } catch (hashError) {
    console.error('AUTH API: Error during registration:', hashError);
    return res.status(500).json({ error: 'Registration failed due to server error' });
  }
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
    const user = demoUsers.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
}

// Logout handler
async function handleLogout(req, res) {
  // In production, you might invalidate the token in a blacklist
  res.json({ success: true, message: 'Logged out successfully' });
}

module.exports = router;
