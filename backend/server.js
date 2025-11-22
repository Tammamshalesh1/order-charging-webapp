// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db');

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// health
app.get('/api/health', (req,res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));
