const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * Get all staff (admin only)
 * GET /api/staff
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource'
      });
    }

    const staff = await User.find({ role: 'staff' })
      .select('_id firstName lastName title email username class isActive createdAt')
      .sort('-createdAt');

    return res.status(200).json({
      success: true,
      staff: staff.map(s => ({
        id: s._id,
        firstName: s.firstName,
        lastName: s.lastName,
        title: s.title,
        email: s.email,
        username: s.username,
        classes: s.class,
        isActive: s.isActive,
        createdAt: s.createdAt
      })),
      count: staff.length
    });
  } catch (error) {
    console.error('Get all staff error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving staff'
    });
  }
});

/**
 * Get staff by ID (admin only)
 * GET /api/staff/:staffId
 */
router.get('/:staffId', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource'
      });
    }

    const staff = await User.findById(req.params.staffId).select('-password');

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    return res.status(200).json({
      success: true,
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        title: staff.title,
        email: staff.email,
        username: staff.username,
        classes: staff.class,
        isActive: staff.isActive,
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt
      }
    });
  } catch (error) {
    console.error('Get staff by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving staff'
    });
  }
});

/**
 * Activate or deactivate a staff member (admin only)
 * PATCH /api/staff/:staffId/approval
 */
router.patch('/:staffId/approval', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action'
      });
    }

    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isApproved must be a boolean value'
      });
    }

    const staff = await User.findByIdAndUpdate(
      req.params.staffId,
      { isActive: isApproved },
      { new: true }
    ).select('-password');

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Staff member ${isApproved ? 'activated' : 'deactivated'} successfully`,
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        isActive: staff.isActive
      }
    });
  } catch (error) {
    console.error('Activate/deactivate staff error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating staff status'
    });
  }
});

/**
 * Delete a staff member (admin only)
 * DELETE /api/staff/:staffId
 */
router.delete('/:staffId', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can perform this action'
      });
    }

    const staff = await User.findByIdAndDelete(req.params.staffId);

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Delete staff error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting staff'
    });
  }
});

module.exports = router;
