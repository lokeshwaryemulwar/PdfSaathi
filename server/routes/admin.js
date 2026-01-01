const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const Contact = require('../models/Contact');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = await AdminUser.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
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
router.get('/contacts', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ created_at: -1 });
        // Map _id to id for frontend compatibility if needed
        const formattedContacts = contacts.map(c => ({
            id: c._id,
            name: c.name,
            email: c.email,
            topic: c.topic,
            message: c.message,
            created_at: c.created_at
        }));
        res.json(formattedContacts);
    } catch (error) {
        console.error('Fetch contacts error:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// Delete contact (protected)
router.delete('/contacts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Contact.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

// Get all users (protected)
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('id email name created_at').sort({ created_at: -1 });
        const formattedUsers = users.map(u => ({
            id: u._id,
            email: u.email,
            name: u.name,
            created_at: u.created_at
        }));
        res.json(formattedUsers);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete user (protected)
router.delete('/users/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
