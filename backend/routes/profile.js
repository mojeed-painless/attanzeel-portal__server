const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * Get user profile
 * GET /api/profile
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
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
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        homeAddress: user.homeAddress,
        guardianName: user.guardianName,
        contactNumber: user.contactNumber,
        whatsappNumber: user.whatsappNumber,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
});

/**
 * Update user profile
 * PUT /api/profile
 */
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, homeAddress, guardianName, contactNumber, whatsappNumber, profilePicture } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update only provided fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (homeAddress !== undefined) user.homeAddress = homeAddress;
    if (guardianName !== undefined) user.guardianName = guardianName;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (whatsappNumber !== undefined) user.whatsappNumber = whatsappNumber;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        homeAddress: user.homeAddress,
        guardianName: user.guardianName,
        contactNumber: user.contactNumber,
        whatsappNumber: user.whatsappNumber,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
});

module.exports = router;
