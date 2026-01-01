const express = require('express');
const Contact = require('../models/Contact');

const router = express.Router();

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, topic, message } = req.body;

        if (!name || !email || !topic || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newContact = await Contact.create({
            name,
            email,
            topic,
            message
        });

        res.json({
            success: true,
            message: 'Contact form submitted successfully',
            id: newContact._id
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to submit contact form' });
    }
});

module.exports = router;
