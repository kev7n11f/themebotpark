const express = require('express');
const router = express.Router();

// Contact form routes
router.post('/', (req, res) => {
  // In production, this would send an actual email
  console.log('Contact form submission:', req.body);
  
  res.json({
    success: true,
    message: 'Your message has been received. We will get back to you soon!'
  });
});

router.get('/status', (req, res) => {
  res.json({ status: 'Contact API ready' });
});

module.exports = router;