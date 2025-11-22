// db.js - sqlite3 with Promise helpers
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

// Promisified helpers
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      wallet REAL DEFAULT 0,
      isAdmin INTEGER DEFAULT 0
    );
  `);
  db.run(`
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
      createdAt TEXT,
      note TEXT
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      label TEXT,
      quantity INTEGER,
      price REAL,
      currency TEXT
    );
  `);

  // ensure admin user exists
  db.get("SELECT id FROM users WHERE email = ?", ['admin@site.local'], (err, row) => {
    if (err) {
      console.error("Admin check error:", err);
      return;
    }
    if (!row) {
      const id = 'u_admin';
      const hashed = bcrypt.hashSync('admin123', 10);
      db.run(
        "INSERT INTO users (id,email,password,name,wallet,isAdmin) VALUES (?,?,?,?,?,?)",
        [id, 'admin@site.local', hashed, 'Administrator', 0, 1],
        (e) => {
          if (e) console.error("Failed to create admin:", e);
          else console.log("Default admin created: admin@site.local / admin123");
        }
      );
    }
  });
});

module.exports = { db, run, get, all };
