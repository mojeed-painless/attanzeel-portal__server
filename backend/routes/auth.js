const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * Login route - authenticate user and return JWT token
 * POST /api/auth/login
 */
router.post('/login', validateLogin, async (req, res) => {
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
        message: 'Your account is pending approval. Please wait for admin approval.',
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
        title: user.title,
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
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, password, email, firstName, lastName, title, role, admissionNumber, class: userClass, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username ? 'Username already exists' : 'Email already exists',
      });
    }

    const isActive = role === 'admin' ? true : false;

    // Create new user with pending approval
    const user = new User({
      username,
      password,
      email,
      firstName,
      lastName,
      title,
      role,
      admissionNumber,
      class: userClass,
      department,
      isActive,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        role: user.role,
        isActive: user.isActive,
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

// Admin route to list pending approvals
router.get('/pending', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const pendingUsers = await User.find({ isActive: false }).select('-password');
    return res.status(200).json({
      success: true,
      users: pendingUsers,
    });
  } catch (error) {
    console.error('Pending users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching pending registrations',
    });
  }
});

// Admin route to approve a pending registration
router.put('/approve/:userId', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User approved successfully',
    });
  } catch (error) {
    console.error('Approve user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during approval',
    });
  }
});

module.exports = router;
