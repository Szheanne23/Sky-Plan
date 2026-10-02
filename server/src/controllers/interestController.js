const { query, pool } = require('../config/db');

/**
 * GET /api/interests
 * Retrieves all active system interest tags.
 */
async function getAllInterests(req, res, next) {
  try {
    const result = await query(
      `SELECT id, name, description, category, is_active
       FROM interest_tags
       WHERE is_active = true
       ORDER BY category ASC, name ASC`
    );

    res.status(200).json({
      success: true,
      data: {
        interests: result.rows,
      },
      message: 'Active interest tags retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/profile/interests
 * Retrieves the current user's selected interest tags.
 */
async function getUserInterests(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
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
        interests: result.rows,
        selectedIds: result.rows.map((r) => r.id),
      },
      message: 'User interests retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/profile/interests
 * Replaces the current user's interest selections.
 */
async function updateUserInterests(req, res, next) {
  try {
    const userId = req.user.id;
    const { interestIds } = req.body;

    if (!Array.isArray(interestIds)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'interestIds must be an array of tag IDs.',
        },
      });
    }

    // Filter out duplicates and invalid items
    const uniqueInterestIds = [...new Set(interestIds.filter((id) => typeof id === 'string'))];

    // If there are IDs to validate, verify they exist in interest_tags
    if (uniqueInterestIds.length > 0) {
      const validTagsResult = await query(
        `SELECT id FROM interest_tags WHERE id = ANY($1::uuid[]) AND is_active = true`,
        [uniqueInterestIds]
      );
      const validTagIds = new Set(validTagsResult.rows.map((r) => r.id));

      const invalid = uniqueInterestIds.filter((id) => !validTagIds.has(id));
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_TAG_ID',
            message: `One or more selected interest tag IDs are invalid or inactive: ${invalid.join(', ')}`,
          },
        });
      }
    }

    // Sync user interests in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Delete existing interests for user
      await client.query('DELETE FROM user_interests WHERE user_id = $1', [userId]);

      // 2. Insert new interests
      for (const tagId of uniqueInterestIds) {
        await client.query(
          'INSERT INTO user_interests (user_id, interest_tag_id) VALUES ($1, $2)',
          [userId, tagId]
        );
      }

      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }

    // Fetch updated list
    const updatedResult = await query(
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
        interests: updatedResult.rows,
        selectedIds: updatedResult.rows.map((r) => r.id),
      },
      message: 'User interests updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllInterests,
  getUserInterests,
  updateUserInterests,
};
