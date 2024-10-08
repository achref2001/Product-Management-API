
const User = require('../../../domain/models/user.model');
const { generateToken, generateRefreshToken }  = require('../../../infrastructure/authentication/jwt.utils');
const jwt = require('jsonwebtoken');

// User Registration
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        name,
        email,
        password,
        role,
      });
  
      if (user) {
        // Generate tokens
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);
  
        // Store the refresh token in the user's document
        user.refreshToken = refreshToken;
        await user.save();
  
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken, 
        });
      }
    } catch (error) {
      console.error('Registration error:', error); 
      res.status(500).json({ message: 'Server error' });
    }
  };

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await user.matchPassword(password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate tokens
      const accessToken = generateToken(user);
      const refreshToken = generateRefreshToken(user);
  
      // Store the refresh token in the user's document
      user.refreshToken = refreshToken;
      await user.save();
  
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken, // Return refresh token
      });
    } catch (error) {
      console.error('Login error:', error); // Log error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
  
    try {
      
      const user = await User.findOne({ refreshToken });
  
      if (!user) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
  
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  
      if (decoded.id !== user._id.toString()) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
  
      // Generate new access token
      const newAccessToken = generateToken(user);
  
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};
  
 
  
module.exports = {
  register,
  login,
  refreshAccessToken
};
