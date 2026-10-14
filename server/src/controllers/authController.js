const { query, pool } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken, getCookieOptions, COOKIE_NAME } = require('../utils/jwt');

/**
 * POST /api/auth/register
 * Creates a new user account and associated profile.
 */
async function register(req, res, next) {
  try {
    const { email, password, displayName } = req.body;

    // Validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'A valid email address is required.',
        },
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 6 characters long.',
        },
      });
    }

    const trimmedDisplayName = displayName && typeof displayName === 'string' ? displayName.trim() : email.split('@')[0];

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: 'An account with this email address already exists.',
        },
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user and profile in a transaction
    const client = await pool.connect();
    let newUser, newProfile;

    try {
      await client.query('BEGIN');

      const userInsertResult = await client.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, 'USER')
         RETURNING id, email, role, created_at`,
        [normalizedEmail, passwordHash]
      );
      newUser = userInsertResult.rows[0];

      const profileInsertResult = await client.query(
        `INSERT INTO profiles (user_id, display_name)
         VALUES ($1, $2)
         RETURNING id, display_name`,
        [newUser.id, trimmedDisplayName]
      );
      newProfile = profileInsertResult.rows[0];

      // Insert interest tags if supplied
      const rawInterestIds = req.body.interestTagIds || req.body.interestIds;
      if (Array.isArray(rawInterestIds) && rawInterestIds.length > 0) {
        const uniqueIds = [...new Set(rawInterestIds.filter((id) => typeof id === 'string'))];
        for (const tagId of uniqueIds) {
          await client.query(
            `INSERT INTO user_interests (user_id, interest_tag_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, interest_tag_id) DO NOTHING`,
            [newUser.id, tagId]
          );
        }
      }

      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }

    // Generate JWT token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Set HTTP-only cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          displayName: newProfile.display_name,
          createdAt: newUser.created_at,
        },
        token,
      },
      message: 'Account registered successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Authenticates user credentials and issues session token.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Valid email and password are required.',
        },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Query user and profile
    const userResult = await query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.created_at, p.display_name, p.avatar_url, p.bio, p.home_city
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.email = $1`,
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      });
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set HTTP-only cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          displayName: user.display_name || user.email.split('@')[0],
          avatarUrl: user.avatar_url || null,
          bio: user.bio || '',
          homeCity: user.home_city || '',
          createdAt: user.created_at,
        },
        token,
      },
      message: 'Logged in successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Clears authenticated session cookie.
 */
function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    path: '/',
  });

  res.status(200).json({
    success: true,
    data: null,
    message: 'Logged out successfully.',
  });
}

/**
 * GET /api/auth/me
 * Returns authenticated user details and profile.
 */
async function getMe(req, res, next) {
  try {
    const profileResult = await query(
      `SELECT u.id, u.email, u.role, u.created_at, p.display_name, p.avatar_url, p.bio, p.home_city
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found.',
        },
      });
    }

    const user = profileResult.rows[0];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          displayName: user.display_name || user.email.split('@')[0],
          avatarUrl: user.avatar_url || null,
          bio: user.bio || '',
          homeCity: user.home_city || '',
          createdAt: user.created_at,
        },
      },
      message: 'Authenticated user profile retrieved.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
