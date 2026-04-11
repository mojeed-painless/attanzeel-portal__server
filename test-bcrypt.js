const bcrypt = require('bcryptjs');

// Test bcrypt directly - this is what seed.js should have done
async function testBcrypt() {
  console.log('Testing bcryptjs hashing...\n');

  const testPassword = 'student123';

  // Hash with salt 10 (same as seed.js should do)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testPassword, salt);

  console.log('Original Password:', testPassword);
  console.log('Hashed Password:', hashedPassword);
  console.log('Hash Length:', hashedPassword.length);

  // Test comparison (this is what matchPassword does)
  const isMatch = await bcrypt.compare(testPassword, hashedPassword);
  console.log('\nComparison Test:');
  console.log('Does hashed password match original?', isMatch);

  // What if we try to compare with the same hash?
  const isMatch2 = await bcrypt.compare(testPassword, hashedPassword);
  console.log('Does it match again?', isMatch2);

  // Test wrong password
  const wrongPasswordMatch = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('Does wrong password match?', wrongPasswordMatch);
}

testBcrypt().catch(console.error);
