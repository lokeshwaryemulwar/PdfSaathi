const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
        const user = stmt.get(username);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get all contacts (protected)
router.get('/contacts', authMiddleware, (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC');
        const contacts = stmt.all();
        res.json(contacts);
    } catch (error) {
        console.error('Fetch contacts error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Delete contact (protected)
router.delete('/contacts/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Get all users (protected)
router.get('/users', authMiddleware, (req, res) => {
    try {
        const stmt = db.prepare('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC');
        const users = stmt.all();
        res.json(users);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete user (protected)
router.delete('/users/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
