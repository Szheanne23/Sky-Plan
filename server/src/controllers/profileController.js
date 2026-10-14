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
      `SELECT u.id, u.email, u.role, u.created_at, p.display_name, p.avatar_url, p.bio, p.home_city, p.updated_at as profile_updated_at
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
          avatarUrl: user.avatar_url || null,
          bio: user.bio || '',
          homeCity: user.home_city || '',
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
 * Updates the current user's display name, avatar, bio, and home city.
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { displayName, avatarUrl, bio, homeCity } = req.body;

    if (displayName !== undefined && (typeof displayName !== 'string' || displayName.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'A valid display name is required.',
        },
      });
    }

    // Fetch existing profile
    const existing = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);

    const resolvedDisplayName = displayName !== undefined
      ? displayName.trim()
      : (existing.rows[0]?.display_name || req.user.email.split('@')[0]);

    const resolvedAvatarUrl = avatarUrl !== undefined
      ? (avatarUrl ? avatarUrl.trim() : null)
      : (existing.rows[0]?.avatar_url || null);

    const resolvedBio = bio !== undefined
      ? bio.trim()
      : (existing.rows[0]?.bio || '');

    const resolvedHomeCity = homeCity !== undefined
      ? homeCity.trim()
      : (existing.rows[0]?.home_city || '');

    let profileRow;
    if (existing.rows.length === 0) {
      const insertResult = await query(
        `INSERT INTO profiles (user_id, display_name, avatar_url, bio, home_city)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, display_name, avatar_url, bio, home_city, updated_at`,
        [userId, resolvedDisplayName, resolvedAvatarUrl, resolvedBio, resolvedHomeCity]
      );
      profileRow = insertResult.rows[0];
    } else {
      const updateResult = await query(
        `UPDATE profiles
         SET display_name = $1, avatar_url = $2, bio = $3, home_city = $4, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $5
         RETURNING id, display_name, avatar_url, bio, home_city, updated_at`,
        [resolvedDisplayName, resolvedAvatarUrl, resolvedBio, resolvedHomeCity, userId]
      );
      profileRow = updateResult.rows[0];
    }

    res.status(200).json({
      success: true,
      data: {
        profile: {
          id: profileRow.id,
          displayName: profileRow.display_name,
          avatarUrl: profileRow.avatar_url,
          bio: profileRow.bio,
          homeCity: profileRow.home_city,
          updatedAt: profileRow.updated_at,
        },
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
