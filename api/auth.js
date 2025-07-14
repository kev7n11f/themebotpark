const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Auth API is working!');
});

module.exports = router;
