const express = require('express');
const db = require('../database');

const router = express.Router();

// Submit contact form
router.post('/', (req, res) => {
    try {
        const { name, email, topic, message } = req.body;

        if (!name || !email || !topic || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const stmt = db.prepare(
            'INSERT INTO contacts (name, email, topic, message) VALUES (?, ?, ?, ?)'
        );

        const result = stmt.run(name, email, topic, message);

        res.json({
            success: true,
            message: 'Contact form submitted successfully',
            id: result.lastInsertRowid
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

module.exports = router;
