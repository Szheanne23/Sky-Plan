const { query } = require('../config/db');

/**
 * Deterministic Rule-Based Activity Recommendation Engine.
 * Evaluates active database recommendation rules against weather telemetry and user interest tags.
 */
async function generateRecommendations({ weatherData, userInterestTagIds = [] }) {
  const currentTemp = weatherData?.temperature?.current || 20;
  const precip1h = weatherData?.telemetry?.rain1h || 0;
  const windSpeed = weatherData?.telemetry?.windSpeed || 10;
  const weatherCondition = weatherData?.weather?.main || 'Clear';

  // 1. Fetch active recommendation rules joined with activity details & associated interest tags
  const rulesResult = await query(`
    SELECT 
      r.id AS rule_id,
      r.name AS rule_name,
      r.min_temp,
      r.max_temp,
      r.max_precip_chance,
      r.max_wind_speed,
      r.allowed_weather_conditions,
      r.priority,
      a.id AS activity_id,
      a.name AS activity_name,
      a.description AS activity_description,
      a.category AS activity_category,
      a.default_time_slot,
      a.icon_name,
      COALESCE(
        ARRAY_AGG(ait.interest_tag_id) FILTER (WHERE ait.interest_tag_id IS NOT NULL),
        '{}'
      ) AS matching_interest_tag_ids
    FROM recommendation_rules r
    JOIN activities a ON a.id = r.activity_id
    LEFT JOIN activity_interest_tags ait ON ait.activity_id = a.id
    WHERE r.is_active = true AND a.is_active = true
    GROUP BY r.id, a.id
    ORDER BY r.priority DESC, a.name ASC;
  `);

  const evaluatedActivities = [];

  for (const row of rulesResult.rows) {
    const isOutdoor = row.activity_category === 'OUTDOOR';
    const minTemp = parseFloat(row.min_temp);
    const maxTemp = parseFloat(row.max_temp);
    const maxWind = parseFloat(row.max_wind_speed);
    const allowedConditions = row.allowed_weather_conditions || [];

    // Condition checks
    const isConditionAllowed = allowedConditions.some(
      (c) => c.toLowerCase() === weatherCondition.toLowerCase() || weatherCondition.toLowerCase().includes(c.toLowerCase())
    );
    const isTempInRange = currentTemp >= minTemp && currentTemp <= maxTemp;
    const isWindSafe = windSpeed <= maxWind;
    const isPrecipSafe = isOutdoor ? precip1h <= 0.5 : true;

    // Check user interest affinity
    const hasUserInterestAffinity = row.matching_interest_tag_ids.some((tagId) =>
      userInterestTagIds.includes(tagId)
    );

    let suitability = 'SUITABLE';
    let suitabilityScore = 80;
    const rationaleParts = [];
    const conditionTags = [];

    // Calculate score & status
    if (isOutdoor) {
      if (isTempInRange && isWindSafe && isPrecipSafe && isConditionAllowed) {
        suitability = 'OPTIMAL';
        suitabilityScore = 90 + (hasUserInterestAffinity ? 8 : 0);
        rationaleParts.push(`Crisp ${currentTemp}°C temperature, gentle ${windSpeed} km/h wind, and favorable ${weatherCondition} conditions offer ideal outdoor parameters.`);
      } else if (!isPrecipSafe || !isConditionAllowed) {
        suitability = 'CAUTION';
        suitabilityScore = 60 + (hasUserInterestAffinity ? 5 : 0);
        rationaleParts.push(`Weather condition (${weatherCondition}) or precipitation risk (${precip1h} mm/h) suggests keeping outdoor sessions brief.`);
      } else if (!isTempInRange || !isWindSafe) {
        suitability = 'CAUTION';
        suitabilityScore = 65;
        rationaleParts.push(`Current temperature (${currentTemp}°C) or wind velocity (${windSpeed} km/h) deviates from standard optimal trail comfort.`);
      }

      conditionTags.push(`Temp: ${currentTemp}°C`);
      conditionTags.push(`Wind: ${windSpeed} km/h`);
      if (precip1h > 0) conditionTags.push(`Precip: ${precip1h} mm/h`);
    } else {
      // Indoor activities
      if (!isPrecipSafe || !isConditionAllowed || currentTemp < 10 || currentTemp > 30) {
        suitability = 'INDOOR_ALT';
        suitabilityScore = 95 + (hasUserInterestAffinity ? 4 : 0);
        rationaleParts.push(`Ideal climate-controlled indoor alternative providing comfortable ambiance regardless of outdoor ${weatherCondition.toLowerCase()} conditions.`);
      } else {
        suitability = 'SUITABLE';
        suitabilityScore = 82 + (hasUserInterestAffinity ? 6 : 0);
        rationaleParts.push(`Comfortable leisure pursuit suitable for all daytime hours.`);
      }
      conditionTags.push('Climate Controlled');
      conditionTags.push('All-Weather Protected');
    }

    if (hasUserInterestAffinity) {
      conditionTags.push('Matches Your Profile');
    }

    evaluatedActivities.push({
      id: row.activity_id,
      title: row.activity_name,
      description: row.activity_description,
      category: row.activity_category,
      suitability,
      suitabilityScore: Math.min(100, suitabilityScore),
      rationale: rationaleParts.join(' '),
      timeSlot: row.default_time_slot,
      conditions: conditionTags,
      iconName: row.icon_name,
      userInterestMatched: hasUserInterestAffinity,
    });
  }

  // Sort: highest suitabilityScore first, user interest affinity boosted
  evaluatedActivities.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    evaluatedCount: evaluatedActivities.length,
    city: weatherData?.location?.city,
    recommendations: evaluatedActivities,
  };
}

module.exports = {
  generateRecommendations,
};
