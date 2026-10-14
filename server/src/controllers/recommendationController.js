const weatherService = require('../services/weatherService');
const recommendationService = require('../services/recommendationService');
const { query } = require('../config/db');

/**
 * GET /api/recommendations
 * Generates rule-based activity recommendations for a given city and user profile.
 */
async function getRecommendations(req, res, next) {
  try {
    const city = req.query.city || req.query.q || 'Manila';
    const date = req.query.date || 'Today';
    const userId = req.user?.id;

    // 1. Fetch real weather data
    const weatherData = await weatherService.getCurrentWeather(city.trim(), date);

    // 2. Fetch authenticated user's selected interest tag IDs (if logged in)
    let userInterestTagIds = [];
    if (userId) {
      const interestsResult = await query(
        `SELECT interest_tag_id FROM user_interests WHERE user_id = $1`,
        [userId]
      );
      userInterestTagIds = interestsResult.rows.map((r) => r.interest_tag_id);
    }

    // 3. Evaluate rules
    const result = await recommendationService.generateRecommendations({
      weatherData,
      userInterestTagIds,
      destinationCity: weatherData.location?.city || city,
    });

    res.status(200).json({
      success: true,
      data: {
        city: weatherData.location.city,
        weatherCondition: weatherData.weather.main,
        temperature: weatherData.temperature.current,
        totalEvaluated: result.evaluatedCount,
        userInterestsApplied: userInterestTagIds.length,
        recommendations: result.recommendations,
      },
      message: 'Activity recommendations generated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecommendations,
};
