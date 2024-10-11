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
    

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

      // Find user by decoded token ID
      req.user = await User.findById(decoded.id).select('-password');
    

      // If user is not found
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Continue to the next middleware
      next();
    } catch (error) {
    
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
