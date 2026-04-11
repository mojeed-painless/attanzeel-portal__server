const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');

dotenv.config();

/**
 * Utility to map class names to departments
 */
function getDepartmentForClass(className) {
  if (['Play Group', 'Kindergarten 1', 'Kindergarten 2', 'Nursery 1', 'Nursery 2'].includes(className)) {
    return 'Pre-basic';
  } else if (className.startsWith('Primary')) {
    return 'Basic';
  } else if (['JSS 1', 'JSS 2', 'JSS 3'].includes(className)) {
    return 'Secondary';
  }
  // For SS classes, we need to extract department from class or use a default
  return 'Secondary';
}

async function updateStudentDepartments() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Get all student users
    const students = await User.find({ role: 'student' });
    console.log(`Found ${students.length} students`);

    let updated = 0;
    for (const student of students) {
      const department = getDepartmentForClass(student.class);
      if (student.department !== department) {
        await User.findByIdAndUpdate(
          student._id,
          { department },
          { new: true }
        );
        updated++;
      }
    }

    console.log(`✓ Updated ${updated} students with correct departments`);
    
    // Verify the updates
    const sample = await User.findOne({ role: 'student' });
    console.log('Sample updated student:', {
      username: sample.username,
      class: sample.class,
      department: sample.department,
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating student departments:', error.message);
    process.exit(1);
  }
}

updateStudentDepartments();
