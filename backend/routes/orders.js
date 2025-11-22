// orders.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const { v4: uuidv4 } = require('uuid');

function authToken(req) {
  const a = req.headers.authorization;
  if (!a) return null;
  try { return jwt.verify(a.replace('Bearer ','').trim(), JWT_SECRET); }
  catch(e) { return null; }
}

// place order
router.post('/', (req,res) => {
  const p = authToken(req);
  if (!p) return res.status(401).json({ error: 'auth' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(p.userId);
  if (!user) return res.status(401).json({ error: 'no user' });
  const { product, details, quantity, unitPrice } = req.body;
  const total = Number(quantity) * Number(unitPrice);
  if (user.wallet < total) return res.status(400).json({ error: 'insufficient' });
  // deduct
  db.prepare('UPDATE users SET wallet = wallet - ? WHERE id = ?').run(total, user.id);
  const id = 'o_'+Date.now();
  db.prepare('INSERT INTO orders (id,userId,userEmail,product,details,quantity,unitPrice,total,status,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id, user.id, user.email, product, details, quantity, unitPrice, total, 'pending', new Date().toISOString());
  const o = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  return res.json({ order: o });
});

// list my orders
router.get('/my', (req,res) => {
  const p = authToken(req);
  if (!p) return res.status(401).json({ error: 'auth' });
  const rows = db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC').all(p.userId);
  res.json({ orders: rows });
});

module.exports = router;
