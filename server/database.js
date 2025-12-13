const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialize database
const db = new Database(path.join(__dirname, 'pdfsaathi.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create default admin user if not exists
const checkAdmin = db.prepare('SELECT * FROM admin_users WHERE username = ?');
const adminExists = checkAdmin.get('admin');

if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  const insertAdmin = db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)');
  insertAdmin.run('admin', hashedPassword);
  console.log('Default admin user created: admin/admin123');
}

module.exports = db;
