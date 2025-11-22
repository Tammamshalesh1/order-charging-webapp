// db.js - simple SQLite using better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'data.db'));

// Initialize tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  name TEXT,
  wallet REAL DEFAULT 0,
  isAdmin INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  userId TEXT,
  userEmail TEXT,
  product TEXT,
  details TEXT,
  quantity INTEGER,
  unitPrice REAL,
  total REAL,
  status TEXT,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  label TEXT,
  quantity INTEGER,
  price REAL,
  currency TEXT
);
`);

// create default admin if missing
const row = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@site.local');
if (!row) {
  const bcrypt = require('bcrypt');
  const id = 'u_admin';
  const pass = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (id, email, password, name, wallet, isAdmin) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, 'admin@site.local', pass, 'Administrator', 0, 1);
}

module.exports = db;
