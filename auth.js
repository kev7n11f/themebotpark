const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Demo user database (in production, use real database)
const demoUsers = [
  {
    id: 1,
    email: 'demo@themebotpark.com',
    password: 'demo123', // In production, hash passwords!
    name: 'Demo User',
    subscription: 'premium',
    createdAt: new Date('2025-01-01')
  },
  {
    id: 2,
    email: 'test@example.com',
    password: 'password',
    name: 'Test User',
    subscription: 'free',
    createdAt: new Date()
  }
];

router.get('/', (req, res) => {
  res.json({ 
    status: 'Auth API is working!',
    endpoints: ['/login', '/register', '/verify-token'],
    authMethods: ['email', 'google']
  });
});

// Configure rate limiter for POST routes
const postRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
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

  // Find user (in production, query database)
  const user = demoUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      subscription: user.subscription 
    },
    process.env.JWT_SECRET || 'demo-secret-key',
    { expiresIn: '7d' }
  );

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
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name required' });
  }

  // Check if user exists
  const existingUser = demoUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Create new user (in production, hash password and save to database)
  const newUser = {
    id: demoUsers.length + 1,
    email,
    password, // Hash in production!
    name,
    subscription: 'free',
    createdAt: new Date()
  };

  demoUsers.push(newUser);

  // Create JWT token
  const token = jwt.sign(
    { 
      id: newUser.id, 
      email: newUser.email,
      subscription: newUser.subscription 
    },
    process.env.JWT_SECRET || 'demo-secret-key',
    { expiresIn: '7d' }
  );

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
}

// Token verification handler
async function handleVerifyToken(req, res) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
    
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

// Legacy routes for backward compatibility
router.post('/login', (req, res) => {
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET || 'demo-secret-key');
  res.json({ token });
});

router.post('/google-login', (req, res) => {
  // Placeholder for OAuth with Firebase or Passport.js
  res.json({ message: 'Google login received' });
});

module.exports = router;