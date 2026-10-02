const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password securely using bcrypt.
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Password hash
 */
async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a valid non-empty string.');
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password against a stored hash.
 * @param {string} password - Plaintext password
 * @param {string} hash - Stored hash
 * @returns {Promise<boolean>} True if match, false otherwise
 */
async function comparePassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};
