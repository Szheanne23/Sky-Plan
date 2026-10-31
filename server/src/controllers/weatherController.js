const weatherService = require('../services/weatherService');
const { query } = require('../config/db');

/**
 * Helper to record search query into search_history table asynchronously.
 */
async function recordSearchEvent(req, cityName, weatherData) {
  try {
    const userId = req.user?.id || null;
    const isGuest = !userId;
    const requestedDate = req.query.date || 'Today';

    const summary = {
      temp: weatherData?.temperature?.current,
      condition: weatherData?.weather?.main,
      humidity: weatherData?.telemetry?.humidity,
      wind: weatherData?.telemetry?.windSpeed,
    };

    await query(
      `INSERT INTO search_history (user_id, city_name, requested_date, weather_summary_json, is_guest)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, cityName, requestedDate, JSON.stringify(summary), isGuest]
    );
  } catch (err) {
    console.warn('[WeatherController] Error logging search event:', err.message);
  }
}

/**
 * GET /api/weather/current
 * Retrieves current weather telemetry for a given city.
 */
async function getCurrentWeather(req, res, next) {
  try {
    const rawCity = req.query.city !== undefined ? req.query.city : (req.query.q !== undefined ? req.query.q : 'Manila');

    if (!rawCity || typeof rawCity !== 'string' || rawCity.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'City parameter is required and cannot be empty.',
        },
      });
    }

    const city = rawCity.trim();
    const date = req.query.date || 'Today';
    const options = {
      lat: req.query.lat,
      lon: req.query.lon,
      country: req.query.country,
    };
    const weatherData = await weatherService.getCurrentWeather(city, date, options);

    // Asynchronously log search event for analytics & history
    recordSearchEvent(req, city, weatherData);

    res.status(200).json({
      success: true,
      data: weatherData,
      message: `Current weather for ${weatherData.location.city} retrieved successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/weather/forecast
 * Retrieves multi-day forecast for a given city.
 */
async function getForecast(req, res, next) {
  try {
    const rawCity = req.query.city !== undefined ? req.query.city : (req.query.q !== undefined ? req.query.q : 'Manila');

    if (!rawCity || typeof rawCity !== 'string' || rawCity.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'City parameter is required and cannot be empty.',
        },
      });
    }

    const city = rawCity.trim();
    const options = {
      lat: req.query.lat,
      lon: req.query.lon,
      country: req.query.country,
    };
    const forecastData = await weatherService.getForecast(city, options);

    res.status(200).json({
      success: true,
      data: forecastData,
      message: `Forecast for ${forecastData.city} retrieved successfully.`,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/weather/locations
 * Searches worldwide locations across Open-Meteo, Photon, and Nominatim.
 */
async function searchLocations(req, res, next) {
  try {
    const rawQuery = req.query.q !== undefined ? req.query.q : (req.query.city || '');
    const limit = Math.min(40, Math.max(5, Number(req.query.limit) || 25));

    if (!rawQuery || typeof rawQuery !== 'string' || rawQuery.trim().length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Provide a search query to discover worldwide locations.',
      });
    }

    const locations = await weatherService.searchLocations(rawQuery.trim(), limit);
    res.status(200).json({
      success: true,
      data: locations,
      message: `Found ${locations.length} matching locations.`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
  searchLocations,
};
