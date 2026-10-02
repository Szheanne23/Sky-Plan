const { query } = require('../config/db');

/**
 * GET /api/profile
 * Retrieves the current user's full profile and selected interest tags.
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Fetch user & profile info
    const userResult = await query(
      `SELECT u.id, u.email, u.role, u.created_at, p.display_name, p.updated_at as profile_updated_at
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found.',
        },
      });
    }

    const user = userResult.rows[0];

    // 2. Fetch user's selected interests
    const interestsResult = await query(
      `SELECT it.id, it.name, it.description, it.category
       FROM user_interests ui
       JOIN interest_tags it ON it.id = ui.interest_tag_id
       WHERE ui.user_id = $1 AND it.is_active = true
       ORDER BY it.name ASC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: user.id,
          email: user.email,
          role: user.role,
          displayName: user.display_name || user.email.split('@')[0],
          createdAt: user.created_at,
          updatedAt: user.profile_updated_at,
          interests: interestsResult.rows,
        },
      },
      message: 'Profile retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile
 * Updates the current user's display name.
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { displayName } = req.body;

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'A valid display name is required.',
        },
      });
    }

    const trimmedDisplayName = displayName.trim();

    // Update profile record (ensuring user only edits their own profile)
    const updateResult = await query(
      `UPDATE profiles
       SET display_name = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING id, display_name, updated_at`,
      [trimmedDisplayName, userId]
    );

    if (updateResult.rows.length === 0) {
      // If profile record was missing, insert it
      const insertResult = await query(
        `INSERT INTO profiles (user_id, display_name)
         VALUES ($1, $2)
         RETURNING id, display_name, updated_at`,
        [userId, trimmedDisplayName]
      );
      return res.status(200).json({
        success: true,
        data: {
          profile: insertResult.rows[0],
        },
        message: 'Profile updated successfully.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: updateResult.rows[0],
      },
      message: 'Profile updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
