const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use('/api/chat', require('./chat'));
app.use('/api/auth', require('./auth'));
app.listen(3001, () => console.log('🟢 Server running on port 3001'));