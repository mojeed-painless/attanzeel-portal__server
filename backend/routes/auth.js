const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * Login route - authenticate user and return JWT token
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find user by username and include password field
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact administration.',
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from user object
    user.password = undefined;

    return res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        admissionNumber: user.admissionNumber,
        class: user.class,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

/**
 * Register route - create new user (admin only in production)
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, role, admissionNumber, class: userClass, department } = req.body;

    // Validation
    if (!username || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, password, firstName, lastName, and role',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
      email,
      firstName,
      lastName,
      role,
      admissionNumber,
      class: userClass,
      department,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
});

module.exports = router;
