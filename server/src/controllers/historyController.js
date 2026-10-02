const { query } = require('../config/db');

/**
 * GET /api/history
 * Retrieves the authenticated user's search history.
 */
async function getSearchHistory(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await query(
      `SELECT id, city_name, requested_date, weather_summary_json, searched_at
       FROM search_history
       WHERE user_id = $1
       ORDER BY searched_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.status(200).json({
      success: true,
      data: {
        history: result.rows,
        count: result.rows.length,
      },
      message: 'Search history retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/history
 * Clears search history for the authenticated user.
 */
async function clearSearchHistory(req, res, next) {
  try {
    const userId = req.user.id;

    await query(`DELETE FROM search_history WHERE user_id = $1`, [userId]);

    res.status(200).json({
      success: true,
      message: 'Search history cleared successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSearchHistory,
  clearSearchHistory,
};
