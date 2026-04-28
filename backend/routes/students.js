const express = require('express');
const User = require('../models/User');

const router = express.Router();

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

module.exports = router;