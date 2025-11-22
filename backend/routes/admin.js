// admin.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function isAdmin(req) {
  const a = req.headers.authorization;
  if (!a) return false;
  try {
    const p = jwt.verify(a.replace('Bearer ','').trim(), JWT_SECRET);
    const u = db.prepare('SELECT isAdmin FROM users WHERE id = ?').get(p.userId);
    return u && u.isAdmin === 1;
  } catch (e) { return false; }
}

// get all orders
router.get('/orders', (req,res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'forbidden' });
  const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
  res.json({ orders: rows });
});

// update order status
router.post('/orders/:id/status', (req,res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'forbidden' });
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

// add credit to user
router.post('/users/:id/credit', (req,res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'forbidden' });
  const amount = Number(req.body.amount);
  db.prepare('UPDATE users SET wallet = wallet + ? WHERE id = ?').run(amount, req.params.id);
  res.json({ ok: true });
});

// packages (get / add / delete)
router.get('/packages', (req,res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'forbidden' });
  const rows = db.prepare('SELECT * FROM packages').all();
  res.json({ packages: rows });
});

router.post('/packages', (req,res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: 'forbidden' });
  const { id, label, quantity, price, currency } = req.body;
  db.prepare('INSERT INTO packages (id,label,quantity,price,currency) VALUES (?,?,?,?,?)').run(id, label, quantity, price, currency);
  res.json({ ok: true });
});

module.exports = router;
