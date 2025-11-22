// routes/auth.js
const express = require('express');
const router = express.Router();
const { run, get } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (exists) return res.status(400).json({ error: 'User exists' });
    const hashed = await bcrypt.hash(password, 10);
    const id = 'u_' + Date.now();
    await run("INSERT INTO users (id,email,password,name,wallet,isAdmin) VALUES (?,?,?,?,?,?)", [
      id, email, hashed, name || email.split('@')[0], 0, 0
    ]);
    const token = jwt.sign({ userId: id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id, email, name: name || email.split('@')[0], wallet: 0, isAdmin: 0 }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!u) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: u.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: u.id, email: u.email, name: u.name, wallet: u.wallet, isAdmin: u.isAdmin }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No auth' });
    const payload = jwt.verify(auth.replace('Bearer ', '').trim(), JWT_SECRET);
    const u = await get("SELECT id,email,name,wallet,isAdmin FROM users WHERE id = ?", [payload.userId]);
    res.json({ user: u });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
