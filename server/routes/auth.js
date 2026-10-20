import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter for authentication attempts (15 attempts per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Too many login attempts from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const getJwtSecret = () => {
  const secret = (process.env.JWT_SECRET || '').trim();
  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }
  return secret;
};

const generateToken = (id) => {
  const secret = getJwtSecret();
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

// GET /api/auth/setup-status - Check if system has been initialized with an admin
router.get('/setup-status', async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    res.json({ initialized: adminCount > 0, totalUsers: adminCount });
  } catch (error) {
    console.error('[Auth Setup Status Error]:', error.message);
    res.status(500).json({ message: 'Unable to verify setup status' });
  }
});

// POST /api/auth/setup - Initialize primary administrator (only allowed once)
router.post('/setup', authLimiter, async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({
        message: 'System has already been initialized. Please log in with existing credentials.',
      });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'admin',
      isActive: true,
      lastLogin: new Date(),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'Primary administrator created successfully',
    });
  } catch (error) {
    if (error.message === 'JWT_SECRET is missing') {
      console.error('Authentication configuration error: JWT_SECRET environment variable is missing.');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email address is already in use' });
    }
    console.error('[Auth Setup Error]:', error.message);
    return res.status(500).json({ message: 'An unexpected error occurred during setup. Please try again.' });
  }
});

// POST /api/auth/login - User authentication with rate limiting
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact an administrator.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.message === 'JWT_SECRET is missing') {
      console.error('Authentication configuration error: JWT_SECRET environment variable is missing.');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    console.error('[Auth Login Error]:', error.message);
    return res.status(500).json({ message: 'An unexpected error occurred during login. Please try again.' });
  }
});

// GET /api/auth/me - Get current user profile (protected)
router.get('/me', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin,
  });
});

// PUT /api/auth/update-password - Secure password change (protected)
router.put('/update-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('[Auth Password Update Error]:', error.message);
    res.status(500).json({ message: 'An unexpected error occurred while updating password' });
  }
});

export default router;
