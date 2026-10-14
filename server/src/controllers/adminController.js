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

    const totalSearches = parseInt(searchStats.rows[0].total_searches, 10);
    const guestSearches = parseInt(searchStats.rows[0].guest_searches, 10);
    const regSearches = parseInt(searchStats.rows[0].registered_searches, 10);
    const totalUsers = parseInt(userStats.rows[0].total_users, 10);
    const adminCount = parseInt(userStats.rows[0].admin_count, 10);
    const userCount = parseInt(userStats.rows[0].user_count, 10);
    const totalRules = parseInt(ruleStats.rows[0].total_rules, 10);
    const activeRules = parseInt(ruleStats.rows[0].active_rules, 10);

    const popularDestinations = topCities.rows.map((row) => ({
      city_name: row.city_name,
      search_count: parseInt(row.search_count, 10),
      last_searched: new Date().toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: {
        searches: {
          total: totalSearches,
          guest: guestSearches,
          registered: regSearches,
        },
        overview: {
          totalUsers,
          activeUsers: totalUsers,
          totalSearches,
          searchesToday: totalSearches,
          guestSearches,
          registeredSearches: regSearches,
          totalFavorites: 0,
        },
        topDestinations: topCities.rows,
        popularSearches: popularDestinations,
        users: {
          total: totalUsers,
          admins: adminCount,
          standard: userCount,
        },
        rules: {
          total: totalRules,
          active: activeRules,
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
    const resolvedIsActive = req.body.isActive !== undefined ? req.body.isActive : req.body.is_active;
    const { minTemp, maxTemp, maxWindSpeed, maxPrecipChance, priority } = req.body;

    // Validate numeric values if provided
    const numericFields = { minTemp, maxTemp, maxWindSpeed, maxPrecipChance, priority };
    for (const [key, val] of Object.entries(numericFields)) {
      if (val !== undefined && val !== null && isNaN(Number(val))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Field "${key}" must be a valid numeric value.`,
          },
        });
      }
    }

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
      [
        resolvedIsActive !== undefined ? resolvedIsActive : null,
        minTemp !== undefined ? Number(minTemp) : null,
        maxTemp !== undefined ? Number(maxTemp) : null,
        maxWindSpeed !== undefined ? Number(maxWindSpeed) : null,
        maxPrecipChance !== undefined ? Number(maxPrecipChance) : null,
        priority !== undefined ? Number(priority) : null,
        id,
      ]
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
