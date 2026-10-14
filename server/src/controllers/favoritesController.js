const { query } = require('../config/db');

/**
 * GET /api/favorites
 * Lists saved favorite locations for the authenticated user.
 */
async function getFavorites(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT id, city_name, country_code, lat, lon, created_at
       FROM favorite_cities
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: {
        favorites: result.rows,
        total: result.rows.length,
      },
      message: 'Favorite cities retrieved successfully.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/favorites
 * Adds a new city to the authenticated user's favorites list.
 */
async function addFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { cityName, countryCode, country, lat, lon } = req.body;

    if (!cityName || typeof cityName !== 'string' || cityName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'City name is required.',
        },
      });
    }

    const trimmedCity = cityName.trim();
    const resolvedCountry = countryCode || country || null;

    // Check duplicate
    const existing = await query(
      `SELECT id FROM favorite_cities WHERE user_id = $1 AND LOWER(city_name) = LOWER($2)`,
      [userId, trimmedCity]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_FAVORITE',
          message: `"${trimmedCity}" is already in your saved locations.`,
        },
      });
    }

    const insertResult = await query(
      `INSERT INTO favorite_cities (user_id, city_name, country_code, lat, lon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, city_name, country_code, lat, lon, created_at`,
      [userId, trimmedCity, resolvedCountry, lat || null, lon || null]
    );

    res.status(201).json({
      success: true,
      data: {
        favorite: insertResult.rows[0],
      },
      message: `"${trimmedCity}" saved to favorites successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/favorites/:id
 * Removes a city from the user's favorites list.
 */
async function removeFavorite(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !UUID_REGEX.test(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'A valid favorite location ID is required.',
        },
      });
    }

    const deleteResult = await query(
      `DELETE FROM favorite_cities
       WHERE id = $1 AND user_id = $2
       RETURNING id, city_name`,
      [id, userId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Favorite location not found or already removed.',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        removedId: id,
        cityName: deleteResult.rows[0].city_name,
      },
      message: `"${deleteResult.rows[0].city_name}" removed from favorites.`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
