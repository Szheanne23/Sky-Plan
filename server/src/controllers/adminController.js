const { query } = require('../config/db');

/**
 * GET /api/admin/analytics
 * Retrieves aggregated search volume, popular destinations, and user metrics.
 */
async function getAdminAnalytics(req, res, next) {
  try {
    // 1. Total search volume and guest vs user breakdown
    const searchStats = await query(`
      SELECT 
        COUNT(*) AS total_searches,
        COUNT(*) FILTER (WHERE is_guest = true) AS guest_searches,
        COUNT(*) FILTER (WHERE is_guest = false) AS registered_searches
      FROM search_history;
    `);

    // 2. Top 5 popular searched cities
    const topCities = await query(`
      SELECT city_name, COUNT(*) AS search_count
      FROM search_history
      GROUP BY city_name
      ORDER BY search_count DESC
      LIMIT 5;
    `);

    // 3. User & Profile metrics
    const userStats = await query(`
      SELECT 
        COUNT(*) AS total_users,
        COUNT(*) FILTER (WHERE role = 'ADMIN') AS admin_count,
        COUNT(*) FILTER (WHERE role = 'USER') AS user_count
      FROM users;
    `);

    // 4. Recommendation rules status
    const ruleStats = await query(`
      SELECT 
        COUNT(*) AS total_rules,
        COUNT(*) FILTER (WHERE is_active = true) AS active_rules
      FROM recommendation_rules;
    `);

    res.status(200).json({
      success: true,
      data: {
        searches: {
          total: parseInt(searchStats.rows[0].total_searches, 10),
          guest: parseInt(searchStats.rows[0].guest_searches, 10),
          registered: parseInt(searchStats.rows[0].registered_searches, 10),
        },
        topDestinations: topCities.rows,
        users: {
          total: parseInt(userStats.rows[0].total_users, 10),
          admins: parseInt(userStats.rows[0].admin_count, 10),
          standard: parseInt(userStats.rows[0].user_count, 10),
        },
        rules: {
          total: parseInt(ruleStats.rows[0].total_rules, 10),
          active: parseInt(ruleStats.rows[0].active_rules, 10),
        },
      },
      message: 'Admin analytics telemetry retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/rules
 * Retrieves all recommendation rules and associated activity details.
 */
async function getAdminRules(req, res, next) {
  try {
    const result = await query(`
      SELECT 
        r.id,
        r.name,
        r.min_temp,
        r.max_temp,
        r.max_precip_chance,
        r.max_wind_speed,
        r.allowed_weather_conditions,
        r.priority,
        r.is_active,
        r.created_at,
        r.updated_at,
        a.id AS activity_id,
        a.name AS activity_name,
        a.category AS activity_category
      FROM recommendation_rules r
      JOIN activities a ON a.id = r.activity_id
      ORDER BY r.priority DESC, r.created_at DESC;
    `);

    res.status(200).json({
      success: true,
      data: {
        rules: result.rows,
        total: result.rows.length,
      },
      message: 'Recommendation rules retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/rules/:id
 * Toggles or updates a recommendation rule.
 */
async function updateAdminRule(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive, minTemp, maxTemp, maxWindSpeed, maxPrecipChance, priority } = req.body;

    const existing = await query(`SELECT id FROM recommendation_rules WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Recommendation rule not found.' },
      });
    }

    const updateResult = await query(
      `UPDATE recommendation_rules
       SET 
         is_active = COALESCE($1, is_active),
         min_temp = COALESCE($2, min_temp),
         max_temp = COALESCE($3, max_temp),
         max_wind_speed = COALESCE($4, max_wind_speed),
         max_precip_chance = COALESCE($5, max_precip_chance),
         priority = COALESCE($6, priority),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [isActive, minTemp, maxTemp, maxWindSpeed, maxPrecipChance, priority, id]
    );

    res.status(200).json({
      success: true,
      data: {
        rule: updateResult.rows[0],
      },
      message: 'Recommendation rule updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/users
 * Retrieves users list for administrative overview.
 */
async function getAdminUsers(req, res, next) {
  try {
    const result = await query(`
      SELECT 
        u.id,
        u.email,
        u.role,
        u.created_at,
        p.display_name,
        COUNT(fc.id) AS saved_cities_count
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN favorite_cities fc ON fc.user_id = u.id
      GROUP BY u.id, p.display_name
      ORDER BY u.created_at DESC;
    `);

    res.status(200).json({
      success: true,
      data: {
        users: result.rows,
        total: result.rows.length,
      },
      message: 'User directory retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAdminAnalytics,
  getAdminRules,
  updateAdminRule,
  getAdminUsers,
};
