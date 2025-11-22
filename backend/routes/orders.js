// routes/orders.js
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

// place order
router.post('/create', async (req, res) => {
  try {
    const payload = getPayload(req);
    if (!payload) return res.status(401).json({ error: 'auth' });
    const user = await get("SELECT * FROM users WHERE id = ?", [payload.userId]);
    if (!user) return res.status(401).json({ error: 'no user' });

    const { product, details, quantity, unitPrice } = req.body;
    const total = Number(quantity) * Number(unitPrice);
    if (user.wallet < total) return res.status(400).json({ error: 'insufficient' });

    await run("UPDATE users SET wallet = wallet - ? WHERE id = ?", [total, user.id]);

    const id = 'o_' + Date.now();
    await run(`INSERT INTO orders (id,userId,userEmail,product,details,quantity,unitPrice,total,status,createdAt) 
      VALUES (?,?,?,?,?,?,?,?,?,?)`, [id, user.id, user.email, product, details, quantity, unitPrice, total, 'pending', new Date().toISOString()]);

    const order = await get("SELECT * FROM orders WHERE id = ?", [id]);
    res.json({ order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

// my orders
router.get('/my', async (req, res) => {
  try {
    const payload = getPayload(req);
    if (!payload) return res.status(401).json({ error: 'auth' });
    const rows = await all("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC", [payload.userId]);
    res.json({ orders: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server' });
  }
});

module.exports = router;
