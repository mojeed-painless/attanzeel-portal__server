const express = require('express');
const Class = require('../models/Class');

const router = express.Router();

/**
 * Get subjects for a specific class and department
 * GET /api/classes/subjects/:className/:department
 */
router.get('/subjects/:className/:department', async (req, res) => {
  try {
    const { className, department } = req.params;

    const classData = await Class.findOne({
      class: className,
      department: department,
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    return res.status(200).json({
      success: true,
      class: classData.class,
      department: classData.department,
      subjects: classData.subjects,
      subjectCount: classData.subjects.length,
    });
  } catch (error) {
    console.error('Get class subjects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving class subjects',
    });
  }
});

/**
 * Get all classes for a dropdown/list
 * GET /api/classes
 */
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find({}, { subjects: 0 });

    return res.status(200).json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error('Get classes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving classes',
    });
  }
});

module.exports = router;
