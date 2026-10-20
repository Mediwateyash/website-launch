import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const getJwtSecret = () => {
  const secret = (process.env.JWT_SECRET || '').trim();
  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }
  return secret;
};

// Verify JWT token from Authorization header
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = getJwtSecret();
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User belonging to this token no longer exists' });
      }

      if (!req.user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated. Contact an administrator.' });
      }

      return next();
    } catch (error) {
      if (error.message === 'JWT_SECRET is missing') {
        console.error('Authentication configuration error: JWT_SECRET environment variable is missing.');
        return res.status(500).json({ message: 'Server configuration error' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Role-based authorization guard
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User role '${req.user?.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
