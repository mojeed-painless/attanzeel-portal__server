const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a last name'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      default: 'student',
      required: [true, 'Please specify a role'],
    },
    admissionNumber: {
      type: String,
      sparse: true, // Only required for students
    },
    class: {
      type: String,
      sparse: true, // Only required for students
    },
    department: {
      type: String,
      sparse: true, // For staff members and secondary students
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if provided password matches hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
