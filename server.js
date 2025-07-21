const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use('/api/chat', require('./api/chat'));
app.use('/api/auth', require('./api/auth'));

// Serve React build in production
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3001, () => console.log('🟢 Server running on port 3001'));