const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { getEmailTemplate } = require('../utils/emailTemplates');

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

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Insert user
        const newUser = await User.create({
            email,
            password_hash: hashedPassword,
            name: name || null,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isVerified: false
        });

        // Send verification email
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const verifyUrl = `${clientUrl}/verify-email?token=${verificationToken}`;

        try {
            await sendEmail({
                email: newUser.email,
                subject: 'Verify your email - PDF Saathi',
                message: `Please verify your email by clicking on the following link: ${verifyUrl}`,
                html: getEmailTemplate(
                    'Verify Your Email',
                    'Welcome to PDF Saathi! Please verify your email address to get started.',
                    'Verify Email',
                    verifyUrl
                )
            });
        } catch (err) {
            console.error('Error sending verification email:', err);
            // Consider handling this better in prod (clean up user?)
        }

        res.json({
            success: true,
            message: 'Account created. Please check your email to verify your account.',
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed: ' + error.message });
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

        if (!user.isVerified) {
            return res.status(401).json({ error: 'Please verify your email before logging in.' });
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

// Verify Email
router.post('/verify-email', async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ error: 'Email verification failed' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        await user.save();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset your password - PDF Saathi',
                message: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`,
                html: getEmailTemplate(
                    'Reset Your Password',
                    'We received a request to reset your password. Click the button below to choose a new one.',
                    'Reset Password',
                    resetUrl
                )
            });
        } catch (err) {
            console.error('Error sending reset email:', err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return res.status(500).json({ error: 'Email could not be sent' });
        }

        res.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired password reset token' });
        }

        user.password_hash = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successfully. You can now login.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Password reset failed' });
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
