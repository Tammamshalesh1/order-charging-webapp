// auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing' });
  const exists = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (exists) return res.status(400).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const id = 'u_' + Date.now();
  db.prepare('INSERT INTO users (id,email,password,name,wallet,isAdmin) VALUES (?,?,?,?,?,?)')
    .run(id, email, hash, name || email.split('@')[0], 0, 0);
  const token = jwt.sign({ userId: id }, JWT_SECRET);
  return res.json({ token });
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!u) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ error: 'Invalid' });
  const token = jwt.sign({ userId: u.id }, JWT_SECRET);
  res.json({ token, user: { id: u.id, email: u.email, name: u.name, wallet: u.wallet, isAdmin: !!u.isAdmin } });
});

// me
router.get('/me', (req,res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No auth' });
  try {
    const payload = jwt.verify(auth.replace('Bearer ','').trim(), JWT_SECRET);
    const u = db.prepare('SELECT id,email,name,wallet,isAdmin FROM users WHERE id = ?').get(payload.userId);
    return res.json({ user: u });
  } catch(e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
