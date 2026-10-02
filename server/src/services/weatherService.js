const config = require('../config/env');

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OWM_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Normalizes OpenWeatherMap current weather response.
 */
function normalizeCurrentWeather(data) {
  const weather = data.weather?.[0] || {};
  const main = data.main || {};
  const wind = data.wind || {};
  const sys = data.sys || {};

  return {
    location: {
      city: data.name,
      country: sys.country || '',
      lat: data.coord?.lat,
      lon: data.coord?.lon,
      elevation: data.main?.sea_level ? `${data.main.sea_level}m` : undefined,
    },
    weather: {
      main: weather.main || 'Clear',
      description: weather.description || 'Clear sky',
      icon: weather.icon || '01d',
    },
    temperature: {
      current: Math.round(main.temp),
      feelsLike: Math.round(main.feels_like),
      tempMin: Math.round(main.temp_min),
      tempMax: Math.round(main.temp_max),
    },
    telemetry: {
      humidity: main.humidity || 0,
      pressure: main.pressure || 1013,
      windSpeed: Math.round((wind.speed || 0) * 3.6), // convert m/s to km/h
      windDeg: wind.deg || 0,
      windGust: wind.gust ? Math.round(wind.gust * 3.6) : Math.round((wind.speed || 0) * 4.2),
      visibilityKm: data.visibility ? (data.visibility / 1000).toFixed(1) : '10.0',
      cloudiness: data.clouds?.all || 0,
      rain1h: data.rain?.['1h'] || 0,
    },
    timestamp: data.dt ? new Date(data.dt * 1000).toISOString() : new Date().toISOString(),
    isMock: false,
  };
}

/**
 * Normalizes OpenWeatherMap 5-day / 3-hour forecast response into 7-day daily summaries.
 */
function normalizeForecast(data) {
  const list = data.list || [];
  const city = data.city || {};

  // Group 3-hour slices by calendar day (YYYY-MM-DD)
  const dailyGroups = {};
  for (const item of list) {
    const dateKey = item.dt_txt ? item.dt_txt.split(' ')[0] : new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyGroups[dateKey]) {
      dailyGroups[dateKey] = [];
    }
    dailyGroups[dateKey].push(item);
  }

  const days = Object.keys(dailyGroups).map((dateKey) => {
    const items = dailyGroups[dateKey];
    const temps = items.map((i) => i.main.temp);
    const minTemp = Math.round(Math.min(...temps));
    const maxTemp = Math.round(Math.max(...temps));

    // Mid-day item (approx 12:00 or middle item)
    const midItem = items[Math.floor(items.length / 2)] || items[0];
    const weather = midItem.weather?.[0] || {};
    const pop = Math.round((Math.max(...items.map((i) => i.pop || 0))) * 100);

    const dateObj = new Date(dateKey);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      date: dateKey,
      day: dayName,
      formattedDate,
      condition: weather.main || 'Clear',
      description: weather.description || 'Clear',
      icon: weather.icon || '01d',
      highTemp: maxTemp,
      lowTemp: minTemp,
      precipChance: pop,
      windSpeed: Math.round((midItem.wind?.speed || 0) * 3.6),
      humidity: midItem.main?.humidity || 50,
    };
  });

  return {
    city: city.name,
    country: city.country,
    coordinates: city.coord,
    dailyForecast: days,
    isMock: false,
  };
}

/**
 * Deterministic fallback weather generator when API key is unconfigured or rate limited.
 * Computes realistic meteorological values based on geographical hash to provide predictable data.
 */
function getDeterministicFallback(city) {
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempBase = 15 + (hash % 12);
  const humidity = 45 + (hash % 40);
  const wind = 8 + (hash % 16);
  const precip = hash % 5 === 0 ? 45 : hash % 3 === 0 ? 15 : 0;
  const condition = precip > 30 ? 'Rain' : precip > 10 ? 'Clouds' : 'Clear';

  const dateNow = new Date();
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(dateNow);
    d.setDate(d.getDate() + idx);
    const dHash = hash + idx * 7;
    const dPrecip = dHash % 4 === 0 ? 60 : dHash % 2 === 0 ? 10 : 0;
    const dCond = dPrecip > 40 ? 'Rain' : dPrecip > 0 ? 'Clouds' : 'Clear';
    const dHigh = tempBase + (dHash % 5) - 2;
    const dLow = dHigh - 7 - (dHash % 4);

    return {
      date: d.toISOString().split('T')[0],
      day: idx === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      condition: dCond === 'Rain' ? 'Passing Showers' : dCond === 'Clouds' ? 'Partly Sunny' : 'Clear & Crisp',
      description: dCond === 'Rain' ? 'Light rain showers' : dCond === 'Clouds' ? 'Scattered cloud cover' : 'Clear blue sky',
      icon: dCond === 'Rain' ? '10d' : dCond === 'Clouds' ? '02d' : '01d',
      highTemp: dHigh,
      lowTemp: dLow,
      precipChance: dPrecip,
      windSpeed: wind + (idx % 3),
      humidity: humidity + (idx % 5),
    };
  });

  return {
    current: {
      location: {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        country: 'Global Region',
        lat: (45.0 + (hash % 20)).toFixed(4),
        lon: (8.0 + (hash % 30)).toFixed(4),
        elevation: `${400 + (hash % 800)}m`,
      },
      weather: {
        main: condition,
        description: condition === 'Rain' ? 'Passing alpine rain' : condition === 'Clouds' ? 'Partly cloudy' : 'Clear skies & crisp air',
        icon: condition === 'Rain' ? '10d' : condition === 'Clouds' ? '02d' : '01d',
      },
      temperature: {
        current: tempBase,
        feelsLike: tempBase - 1,
        tempMin: tempBase - 6,
        tempMax: tempBase + 3,
      },
      telemetry: {
        humidity,
        pressure: 1014 + (hash % 10),
        windSpeed: wind,
        windDeg: 315,
        windGust: wind + 6,
        visibilityKm: condition === 'Rain' ? '12.0' : '25.0',
        cloudiness: condition === 'Clear' ? 10 : condition === 'Clouds' ? 45 : 85,
        rain1h: precip > 30 ? 2.4 : 0,
      },
      timestamp: new Date().toISOString(),
      isFallback: true,
    },
    forecast: {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      country: 'Global Region',
      dailyForecast: days,
      isFallback: true,
    },
  };
}

/**
 * Fetch Current Weather by City Name.
 */
async function getCurrentWeather(city) {
  const apiKey = config.openWeatherMap?.apiKey;

  if (!apiKey || apiKey.trim() === '') {
    // Deterministic fallback if API key is not supplied
    return getDeterministicFallback(city).current;
  }

  try {
    const url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        const notFoundErr = new Error(`City "${city}" not found.`);
        notFoundErr.statusCode = 404;
        throw notFoundErr;
      }
      throw new Error(`OpenWeatherMap API responded with status ${response.status}`);
    }

    const data = await response.json();
    return normalizeCurrentWeather(data);
  } catch (err) {
    if (err.statusCode === 404) throw err;
    console.warn(`[WeatherService] OWM call failed (${err.message}). Using deterministic fallback for "${city}".`);
    return getDeterministicFallback(city).current;
  }
}

/**
 * Fetch 5-Day / 7-Day Forecast by City Name.
 */
async function getForecast(city) {
  const apiKey = config.openWeatherMap?.apiKey;

  if (!apiKey || apiKey.trim() === '') {
    return getDeterministicFallback(city).forecast;
  }

  try {
    const url = `${OWM_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        const notFoundErr = new Error(`City "${city}" not found.`);
        notFoundErr.statusCode = 404;
        throw notFoundErr;
      }
      throw new Error(`OpenWeatherMap Forecast API responded with status ${response.status}`);
    }

    const data = await response.json();
    return normalizeForecast(data);
  } catch (err) {
    if (err.statusCode === 404) throw err;
    console.warn(`[WeatherService] OWM forecast call failed (${err.message}). Using deterministic fallback for "${city}".`);
    return getDeterministicFallback(city).forecast;
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
};
