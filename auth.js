const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/google-login', (req, res) => {
  // Placeholder for OAuth with Firebase or Passport.js
  res.json({ message: 'Google login received' });
});

module.exports = router;