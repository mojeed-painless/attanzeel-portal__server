const express = require('express');
const Settings = require('../models/Settings');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * Middleware to verify JWT token and get user info
 */
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization',
    });
  }
};

/**
 * Get current term and session settings
 * GET /api/settings
 */
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = new Settings({
        currentTerm: 'First Term',
        currentSession: '2025/2026',
      });
      await settings.save();
    }

    const totalStudents = await User.countDocuments({ role: 'student' });
    
    return res.status(200).json({
      success: true,
      settings: {
        currentTerm: settings.currentTerm,
        currentSession: settings.currentSession,
        totalStudents,
      },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving settings',
    });
  }
});

/**
 * Update current term and session (admin only)
 * PUT /api/settings
 */
router.put('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { currentTerm, currentSession } = req.body;

    if (!currentTerm || !currentSession) {
      return res.status(400).json({
        success: false,
        message: 'Please provide currentTerm and currentSession',
      });
    }

    // Validate term
    const validTerms = ['First Term', 'Second Term', 'Third Term'];
    if (!validTerms.includes(currentTerm)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid term. Must be one of: First Term, Second Term, Third Term',
      });
    }

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({
        currentTerm,
        currentSession,
        updatedBy: req.user.id,
      });
    } else {
      settings.currentTerm = currentTerm;
      settings.currentSession = currentSession;
      settings.updatedBy = req.user.id;
    }

    await settings.save();

    const totalStudents = await User.countDocuments({ role: 'student' });

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        currentTerm: settings.currentTerm,
        currentSession: settings.currentSession,
        totalStudents,
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating settings',
    });
  }
});

module.exports = router;
