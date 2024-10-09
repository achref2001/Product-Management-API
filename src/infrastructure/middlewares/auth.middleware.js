// src/infrastructure/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../../domain/models/user.model');
const dotenv = require('dotenv');

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];
    //   console.log('Token:', token);  // Debugging

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log('Decoded Token:', decoded);  // Debugging

      // Find user by decoded token ID
      req.user = await User.findById(decoded.id).select('-password');
    //   console.log('User:', req.user);  // Debugging

      // If user is not found
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Continue to the next middleware
      next();
    } catch (error) {
    //   console.error('Token error:', error);  // Debugging
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
