const express = require('express');
const User = require('../models/User');

const router = express.Router();

/**
 * Get all students
 * GET /api/students
 */
router.get('/', async (req, res) => {
  try {
    const students = await User.find({
      role: 'student'
    }).select('_id firstName lastName username class department isActive createdAt').sort('firstName');

    return res.status(200).json({
      success: true,
      students: students.map(student => ({
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        class: student.class,
        department: student.department,
        isActive: student.isActive !== false,
        createdAt: student.createdAt
      })),
      count: students.length
    });
  } catch (error) {
    console.error('Get all students error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving students'
    });
  }
});

/**
 * Get students by class
 * GET /api/students/class/:className
 */
router.get('/class/:className', async (req, res) => {
  try {
    const { className } = req.params;

    const students = await User.find({
      role: 'student',
      class: className
    }).select('firstName lastName admissionNumber class department').sort('firstName');

    return res.status(200).json({
      success: true,
      students: students.map(student => ({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        class: student.class,
        department: student.department
      })),
      count: students.length
    });
  } catch (error) {
    console.error('Get students by class error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving students'
    });
  }
});

/**
 * Get students by class and department
 * GET /api/students/class/:className/department/:department
 */
router.get('/class/:className/department/:department', async (req, res) => {
  try {
    const { className, department } = req.params;

    const students = await User.find({
      role: 'student',
      class: className,
      department: department
    }).select('firstName lastName admissionNumber class department').sort('firstName');

    return res.status(200).json({
      success: true,
      students: students.map(student => ({
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNumber: student.admissionNumber,
        class: student.class,
        department: student.department
      })),
      count: students.length
    });
  } catch (error) {
    console.error('Get students by class and department error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving students'
    });
  }
});

/**
 * Get next available student username
 * GET /api/students/next-username
 */
router.get('/next-username', async (req, res) => {
  try {
    const highestStudent = await User.find({
      role: 'student',
      username: { $regex: /^asi\d{5}$/i }
    })
      .select('username')
      .sort({ username: -1 })
      .limit(1);

    let nextUsername = 'asi00001';

    if (highestStudent.length > 0) {
      const match = highestStudent[0].username.match(/^asi(\d{5})$/i);
      if (match) {
        const highestNumber = parseInt(match[1], 10);
        const nextNumber = highestNumber + 1;
        nextUsername = `asi${String(nextNumber).padStart(5, '0')}`.toLowerCase();
      }
    }

    return res.status(200).json({
      success: true,
      nextUsername,
    });
  } catch (error) {
    console.error('Get next student username error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving next username'
    });
  }
});

/**
 * Get student by ID
 * GET /api/students/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id).select('_id firstName lastName username email class department isActive createdAt');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        email: student.email,
        class: student.class,
        department: student.department,
        isActive: student.isActive !== false,
        createdAt: student.createdAt
      }
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving student'
    });
  }
});

/**
 * Update student approval status
 * PATCH /api/students/:id/approval
 */
router.patch('/:id/approval', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const student = await User.findByIdAndUpdate(
      id,
      { isActive: isApproved },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: isApproved ? 'Student activated' : 'Student deactivated',
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        isActive: student.isActive
      }
    });
  } catch (error) {
    console.error('Update student approval error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating student approval'
    });
  }
});

/**
 * Delete a student
 * DELETE /api/students/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting student'
    });
  }
});

module.exports = router;