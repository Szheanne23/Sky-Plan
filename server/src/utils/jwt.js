const jwt = require('jsonwebtoken');
const config = require('../config/env');

const COOKIE_NAME = 'skyplan_token';

/**
 * Generates a signed JWT for an authenticated user.
 * @param {object} payload - Minimal payload ({ id, email, role })
 * @returns {string} Signed JWT string
 */
function generateToken(payload) {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
}

/**
 * Verifies a JWT.
 * @param {string} token
 * @returns {object} Decoded payload
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Returns security cookie options for JWT storage.
 * @returns {object} Express cookie options
 */
function getCookieOptions() {
  const isProduction = config.nodeEnv === 'production';
  const sameSite = process.env.COOKIE_SAMESITE || (isProduction ? 'none' : 'lax');
  return {
    httpOnly: true,
    secure: isProduction || sameSite === 'none', // HTTPS required if sameSite is none or in production
    sameSite,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  };
}


module.exports = {
  COOKIE_NAME,
  generateToken,
  verifyToken,
  getCookieOptions,
};
