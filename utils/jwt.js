const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function signUser(user) {
  return jwt.sign({ id: user.id, email: user.email, subscription: user.subscription }, env.jwtSecret, { expiresIn: '7d' });
}

module.exports = { signUser };