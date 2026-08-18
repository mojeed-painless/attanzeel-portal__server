/**
 * Verification code utility
 * Generates and validates 6-digit verification codes
 */

/**
 * Generate a random 6-digit verification code
 * @returns {string} 6-digit verification code
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get expiration time for verification code (1 hour from now)
 * @returns {Date} Expiration date/time
 */
function getVerificationCodeExpiry() {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);
  return expiry;
}

/**
 * Check if a verification code has expired
 * @param {Date} expiryTime - The expiration time
 * @returns {boolean} True if expired, false otherwise
 */
function isVerificationCodeExpired(expiryTime) {
  return new Date() > expiryTime;
}

module.exports = {
  generateVerificationCode,
  getVerificationCodeExpiry,
  isVerificationCodeExpired,
};
