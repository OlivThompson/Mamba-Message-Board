const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const secret = process.env.JWT_SECRET;
require('dotenv').config();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./db.sqlite');
const upload = multer({ dest: 'uploads/' });

// Create tables if not exist
db.run(`CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT,
  pin TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pin TEXT, author TEXT, text TEXT,
  emojis TEXT, reactions TEXT, mediaPath TEXT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Create admin user & PIN
app.post('/api/create-admin', async (req, res) => {
  const { username, password } = req.body;
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO admins (username, password, pin) VALUES (?, ?, ?)`,
      [username, hash, pin],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ adminId: this.lastID, pin });
      }
    );
  } catch (e) {
    res.status(500).json({ error: 'Failed to hash password' });
  }
});
//Login-admin
app.post('/api/login-admin', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM admins WHERE username = ?`, [username], async (err, admin) => {
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    res.json({ adminId: admin.id, pin: admin.pin });
  });
});
// PIN login
app.post('/api/pin-login', (req, res) => {
  const { pin } = req.body;
  db.get(`SELECT * FROM admins WHERE pin = ?`, [pin], (err, admin) => {
    if (!admin) return res.status(404).json({ error: 'Invalid PIN' });
    res.json({ board: admin });
  });
});

// Add message with media
app.post('/api/message', upload.single('media'), (req, res) => {
  const { pin, author, text, emojis, reactions } = req.body;
  db.run(
    `INSERT INTO messages (pin, author, text, emojis, reactions, mediaPath) VALUES (?, ?, ?, ?, ?, ?)`,
    [pin, author, text, emojis || '', reactions || '', req.file ? req.file.path : ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ messageId: this.lastID });
    }
  );
});

// Get messages for a pin
app.get('/api/messages/:pin', (req, res) => {
  db.all(
    `SELECT * FROM messages WHERE pin = ? ORDER BY created DESC`,
    [req.params.pin],
    (err, rows) => {
      res.json(rows);
    }
  );
});

// Serve media files from /uploads
// eslint-disable-next-line no-undef
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(8081, () => console.log('Server on http://localhost:8081'));

