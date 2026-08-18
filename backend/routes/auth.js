const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { authMiddleware, authorize } = require('../middleware/auth');
const emailService = require('../utils/email');
const { generateVerificationCode, getVerificationCodeExpiry, isVerificationCodeExpired } = require('../utils/verification');

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

    // Check if email is verified (for staff)
    if (user.role === 'staff' && !user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'email_not_verified',
        email: user.email,
        requiresVerification: true,
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
 * Register route - create new user and send verification email
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

    // For staff, email should not be verified initially
    const emailVerified = role !== 'staff';
    const isActive = role === 'admin' ? true : false;

    // Generate verification code for staff
    let verificationCode = null;
    let verificationCodeExpiry = null;
    
    if (role === 'staff') {
      verificationCode = generateVerificationCode();
      verificationCodeExpiry = getVerificationCodeExpiry();
    }

    // Create new user
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
      emailVerified,
      verificationCode,
      verificationCodeExpiry,
    });

    await user.save();

    // Send verification email for staff
    if (role === 'staff') {
      try {
        await emailService.sendVerificationEmail(email, verificationCode, firstName);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails, but notify client
        return res.status(201).json({
          success: true,
          message: 'Registration successful, but verification email could not be sent. Please try again later.',
          requiresVerification: true,
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
            emailVerified: user.emailVerified,
          },
          emailError: true,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: role === 'staff' 
        ? 'Registration successful. Please check your email for the verification code.'
        : 'Registration successful. Your account is pending admin approval.',
      requiresVerification: role === 'staff',
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
        emailVerified: user.emailVerified,
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

/**
 * Verify email with verification code
 * POST /api/auth/verify-email
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required',
      });
    }

    // Find user by email and include verification fields
    const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpiry');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Check if verification code has expired
    if (isVerificationCodeExpired(user.verificationCodeExpiry)) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
        codeExpired: true,
      });
    }

    // Check if verification code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      });
    }

    // Mark email as verified and clear verification code
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    // Send credentials email
    try {
      await emailService.sendCredentialsEmail(email, user.username, user.firstName);
    } catch (emailError) {
      console.error('Failed to send credentials email:', emailError);
      // Still mark as success since email is verified, but notify client
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. Your credentials have been sent to your email. Your account is now awaiting admin approval.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during email verification',
    });
  }
});

/**
 * Resend verification code
 * POST /api/auth/resend-verification
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Only staff members need verification
    if (user.role !== 'staff') {
      return res.status(400).json({
        success: false,
        message: 'Email verification is only required for staff members',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new verification code
    const newVerificationCode = generateVerificationCode();
    const newVerificationCodeExpiry = getVerificationCodeExpiry();

    user.verificationCode = newVerificationCode;
    user.verificationCodeExpiry = newVerificationCodeExpiry;
    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, newVerificationCode, user.firstName);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification code resent to your email',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error resending verification code',
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
