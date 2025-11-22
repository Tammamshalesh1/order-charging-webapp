// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// routes will require db through ./db.js
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use(cors());
app.use(express.json());

// static files if any (optional)
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// health
app.get('/api/health', (req,res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));
