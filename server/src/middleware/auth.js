const { verifyToken, COOKIE_NAME } = require('../utils/jwt');
const { query } = require('../config/db');

/**
 * Middleware to authenticate requests using JWT from cookie or Authorization header.
 */
async function authenticateToken(req, res, next) {
  let token = null;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  // 2. Fallback to Authorization: Bearer header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please log in to access this resource.',
      },
    });
  }

  try {
    const decoded = verifyToken(token);

    // Verify user still exists in database
    const userResult = await query(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_NOT_FOUND',
          message: 'The account associated with this session no longer exists.',
        },
      });
    }

    req.user = userResult.rows[0];
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: {
        code: isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
        message: isExpired
          ? 'Your session has expired. Please log in again.'
          : 'Invalid authentication token.',
      },
    });
  }
}

/**
 * Middleware to restrict endpoints by role.
 * @param {string|string[]} roles - Allowed role or array of roles (e.g. 'ADMIN')
 */
function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action.',
        },
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
};
