const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String },
  class: { type: String },
  department: { type: String },
  admissionNumber: { type: String },
  password: { type: String, select: false }
});

const User = mongoose.model('User', userSchema);

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    const users = await User.find().select('-password');
    console.log(`Found ${users.length} users:\n`);
    
    users.forEach(user => {
      console.log(`Username: ${user.username}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Role: ${user.role}`);
      if (user.class) console.log(`Class: ${user.class}`);
      if (user.department) console.log(`Department: ${user.department}`);
      if (user.admissionNumber) console.log(`Admission #: ${user.admissionNumber}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
