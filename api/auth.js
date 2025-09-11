const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { env } = require('../config/env');
const { signUser } = require('../utils/jwt');

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

// Export serverless function
module.exports = async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('AUTH API: Request received:', {
    method: req.method,
    url: req.url,
    body: req.body ? Object.keys(req.body) : 'no body',
    timestamp: new Date().toISOString()
  });

  // GET route to check if auth API is working
  if (req.method === 'GET') {
    return res.json({
      status: 'Auth API is working!',
      endpoints: ['/login', '/register', '/verify-token'],
      authMethods: ['email', 'google']
    });
  }

  // POST handler - authentication actions
  if (req.method === 'POST') {
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

// Login handler
async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  console.log('AUTH API: Login attempt for:', email);

  try {
    const user = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log('AUTH API: User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // For demo users, check if password is already hashed
    const isValidPassword = user.password.startsWith('$2') 
      ? await bcrypt.compare(password, user.password)
      : password === user.password;

    if (!isValidPassword) {
      console.log('AUTH API: Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = signUser(user);
    
    console.log('AUTH API: Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('AUTH API: Login error:', error);
    res.status(500).json({ error: 'Login failed due to server error' });
  }
}

// Register handler
async function handleRegister(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  console.log('AUTH API: Registration attempt for:', email);

  // Check if user already exists
  const existingUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    console.log('AUTH API: User already exists:', email);
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, env.bcryptRounds);
    
    // Create new user
    const newUser = {
      id: Math.max(...demoUsers.map(u => u.id)) + 1,
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      subscription: 'free',
      createdAt: new Date()
    };

    // Add to demo users array
    demoUsers.push(newUser);

    // Generate JWT token
    const token = signUser(newUser);
    
    console.log('AUTH API: Registration successful for:', email);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
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