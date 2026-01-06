const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiter for signup
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 5, // start blocking after 5 requests
    message: { error: "Too many accounts created from this IP, please try again after an hour" }
});

// Signup
router.post('/signup', signupLimiter, async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert user
        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            name: name || null
        });

        // Create token
        const token = jwt.sign(
            { id: newUser._id, email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: newUser._id,
                email,
                name: newUser.name
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = bcrypt.compareSync(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user (protected)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('id email name created_at');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

module.exports = router;
