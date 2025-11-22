// routes/admin.js
const express = require('express');
const router = express.Router();
const { run, get, all } = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function getPayload(req) {
  try {
    const h = req.headers.authorization;
    if (!h) return null;
    return jwt.verify(h.replace('Bearer ', '').trim(), JWT_SECRET);
  } catch (e) {
    return null;
  }
}

async function ensureAdmin(req) {
  const p = getPayload(req);
  if (!p) return null;
  const u = await get("SELECT isAdmin FROM users WHERE id = ?", [p.userId]);
  if (!u || u.isAdmin !== 1) return null;
  return p;
}

// list users
router.get('/users', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const rows = await all("SELECT id,name,email,wallet,isAdmin FROM users ORDER BY id DESC", []);
    res.json({ users: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// list all orders
router.get('/orders', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const rows = await all("SELECT * FROM orders ORDER BY createdAt DESC", []);
    res.json({ orders: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// update order status
router.post('/update', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const { id, status, note } = req.body;
    await run("UPDATE orders SET status = ?, note = ? WHERE id = ?", [status || 'pending', note || null, id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// add credit
router.post('/wallet', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const { userId, amount } = req.body;
    await run("UPDATE users SET wallet = wallet + ? WHERE id = ?", [Number(amount), userId]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// packages
router.get('/packages', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const rows = await all("SELECT * FROM packages ORDER BY price DESC", []);
    res.json({ packages: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const { id, label, quantity, price, currency } = req.body;
    await run("INSERT INTO packages (id,label,quantity,price,currency) VALUES (?,?,?,?,?)", [id, label, quantity, price, currency || 'USD']);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

router.post('/packages/delete', async (req, res) => {
  try {
    const ok = await ensureAdmin(req);
    if (!ok) return res.status(403).json({ error: 'forbidden' });
    const { id } = req.body;
    await run("DELETE FROM packages WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

module.exports = router;
