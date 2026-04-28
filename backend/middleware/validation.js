const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Auth validation rules
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('role')
    .isIn(['student', 'staff', 'admin']).withMessage('Invalid role'),
  handleValidationErrors,
];

/**
 * Settings validation rules
 */
const validateSettings = [
  body('currentTerm')
    .trim()
    .notEmpty().withMessage('Current term is required')
    .isIn(['First Term', 'Second Term', 'Third Term']).withMessage('Invalid term'),
  body('currentSession')
    .trim()
    .notEmpty().withMessage('Current session is required')
    .matches(/^\d{4}\/\d{4}$/).withMessage('Session must be in format YYYY/YYYY'),
  handleValidationErrors,
];

/**
 * Classes validation rules
 */
const validateClassParams = [
  param('className')
    .trim()
    .notEmpty().withMessage('Class name is required'),
  param('department')
    .trim()
    .notEmpty().withMessage('Department is required'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateRegister,
  validateSettings,
  validateClassParams,
};
