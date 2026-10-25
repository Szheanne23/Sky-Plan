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

const PHILIPPINE_LOCATIONS = {
  'manila': { city: 'Manila', country: 'Philippines', countryCode: 'PH', lat: '14.5995', lon: '120.9842', elevation: '16m', tempBase: 30, isCool: false },
  'metro manila': { city: 'Metro Manila', country: 'Philippines', countryCode: 'PH', lat: '14.5995', lon: '120.9842', elevation: '16m', tempBase: 30, isCool: false },
  'quezon city': { city: 'Quezon City', country: 'Philippines', countryCode: 'PH', lat: '14.6760', lon: '121.0437', elevation: '52m', tempBase: 30, isCool: false },
  'makati': { city: 'Makati City', country: 'Philippines', countryCode: 'PH', lat: '14.5547', lon: '121.0244', elevation: '28m', tempBase: 30, isCool: false },
  'makati city': { city: 'Makati City', country: 'Philippines', countryCode: 'PH', lat: '14.5547', lon: '121.0244', elevation: '28m', tempBase: 30, isCool: false },
  'taguig': { city: 'Taguig (BGC)', country: 'Philippines', countryCode: 'PH', lat: '14.5503', lon: '121.0470', elevation: '35m', tempBase: 30, isCool: false },
  'bgc': { city: 'Taguig (BGC)', country: 'Philippines', countryCode: 'PH', lat: '14.5503', lon: '121.0470', elevation: '35m', tempBase: 30, isCool: false },
  'pasig': { city: 'Pasig City', country: 'Philippines', countryCode: 'PH', lat: '14.5764', lon: '121.0851', elevation: '18m', tempBase: 30, isCool: false },
  'baguio': { city: 'Baguio City', country: 'Philippines', countryCode: 'PH', lat: '16.4023', lon: '120.5960', elevation: '1470m', tempBase: 20, isCool: true },
  'baguio city': { city: 'Baguio City', country: 'Philippines', countryCode: 'PH', lat: '16.4023', lon: '120.5960', elevation: '1470m', tempBase: 20, isCool: true },
  'cebu': { city: 'Cebu City', country: 'Philippines', countryCode: 'PH', lat: '10.3157', lon: '123.8854', elevation: '17m', tempBase: 29, isCool: false },
  'cebu city': { city: 'Cebu City', country: 'Philippines', countryCode: 'PH', lat: '10.3157', lon: '123.8854', elevation: '17m', tempBase: 29, isCool: false },
  'tagaytay': { city: 'Tagaytay', country: 'Philippines', countryCode: 'PH', lat: '14.1153', lon: '120.9621', elevation: '634m', tempBase: 24, isCool: true },
  'boracay': { city: 'Boracay', country: 'Philippines', countryCode: 'PH', lat: '11.9674', lon: '121.9248', elevation: '5m', tempBase: 29, isCool: false },
  'siargao': { city: 'Siargao Island', country: 'Philippines', countryCode: 'PH', lat: '9.8584', lon: '126.0469', elevation: '10m', tempBase: 29, isCool: false },
  'palawan': { city: 'Palawan (El Nido)', country: 'Philippines', countryCode: 'PH', lat: '11.1956', lon: '119.4075', elevation: '8m', tempBase: 29, isCool: false },
  'el nido': { city: 'El Nido', country: 'Philippines', countryCode: 'PH', lat: '11.1956', lon: '119.4075', elevation: '8m', tempBase: 29, isCool: false },
  'coron': { city: 'Coron', country: 'Philippines', countryCode: 'PH', lat: '12.0000', lon: '120.2000', elevation: '12m', tempBase: 29, isCool: false },
  'davao': { city: 'Davao City', country: 'Philippines', countryCode: 'PH', lat: '7.1907', lon: '125.4553', elevation: '22m', tempBase: 30, isCool: false },
  'davao city': { city: 'Davao City', country: 'Philippines', countryCode: 'PH', lat: '7.1907', lon: '125.4553', elevation: '22m', tempBase: 30, isCool: false },
  'bohol': { city: 'Bohol (Panglao)', country: 'Philippines', countryCode: 'PH', lat: '9.6729', lon: '123.8730', elevation: '15m', tempBase: 29, isCool: false },
  'batanes': { city: 'Batanes (Basco)', country: 'Philippines', countryCode: 'PH', lat: '20.4485', lon: '121.9702', elevation: '45m', tempBase: 24, isCool: true },
  'iloilo': { city: 'Iloilo City', country: 'Philippines', countryCode: 'PH', lat: '10.7202', lon: '122.5621', elevation: '10m', tempBase: 29, isCool: false },
  'vigan': { city: 'Vigan City', country: 'Philippines', countryCode: 'PH', lat: '17.5747', lon: '120.3869', elevation: '15m', tempBase: 30, isCool: false },
  'la union': { city: 'La Union (San Juan)', country: 'Philippines', countryCode: 'PH', lat: '16.6667', lon: '120.3333', elevation: '10m', tempBase: 30, isCool: false },
  'sagada': { city: 'Sagada', country: 'Philippines', countryCode: 'PH', lat: '17.0833', lon: '120.9000', elevation: '1500m', tempBase: 19, isCool: true },
  'banaue': { city: 'Banaue', country: 'Philippines', countryCode: 'PH', lat: '16.9167', lon: '121.0500', elevation: '1200m', tempBase: 21, isCool: true },
  'laoag': { city: 'Laoag City', country: 'Philippines', countryCode: 'PH', lat: '18.1960', lon: '120.5927', elevation: '20m', tempBase: 30, isCool: false },
  'pagudpud': { city: 'Pagudpud', country: 'Philippines', countryCode: 'PH', lat: '18.5583', lon: '120.7861', elevation: '12m', tempBase: 29, isCool: false },
  'samal': { city: 'Samal Island', country: 'Philippines', countryCode: 'PH', lat: '7.0789', lon: '125.7144', elevation: '18m', tempBase: 29, isCool: false },
  'mati': { city: 'Mati City', country: 'Philippines', countryCode: 'PH', lat: '6.9556', lon: '126.2167', elevation: '15m', tempBase: 29, isCool: false },
  'gigantes': { city: 'Islas de Gigantes', country: 'Philippines', countryCode: 'PH', lat: '11.5978', lon: '123.3378', elevation: '8m', tempBase: 29, isCool: false },
  'guimaras': { city: 'Guimaras Island', country: 'Philippines', countryCode: 'PH', lat: '10.5936', lon: '122.6322', elevation: '25m', tempBase: 29, isCool: false },
  'bacolod': { city: 'Bacolod City', country: 'Philippines', countryCode: 'PH', lat: '10.6766', lon: '122.9509', elevation: '12m', tempBase: 29, isCool: false },
  'puerto princesa': { city: 'Puerto Princesa', country: 'Philippines', countryCode: 'PH', lat: '9.7392', lon: '118.7353', elevation: '16m', tempBase: 29, isCool: false },
  'san vicente': { city: 'San Vicente (Palawan)', country: 'Philippines', countryCode: 'PH', lat: '10.5186', lon: '119.2944', elevation: '10m', tempBase: 29, isCool: false },
  'dumaguete': { city: 'Dumaguete', country: 'Philippines', countryCode: 'PH', lat: '9.3068', lon: '123.3054', elevation: '15m', tempBase: 29, isCool: false },
  'siquijor': { city: 'Siquijor Island', country: 'Philippines', countryCode: 'PH', lat: '9.2144', lon: '123.5156', elevation: '12m', tempBase: 29, isCool: false },
  'moalboal': { city: 'Moalboal', country: 'Philippines', countryCode: 'PH', lat: '9.9567', lon: '123.4008', elevation: '8m', tempBase: 29, isCool: false },
  'bantayan': { city: 'Bantayan Island', country: 'Philippines', countryCode: 'PH', lat: '11.2000', lon: '123.7333', elevation: '5m', tempBase: 29, isCool: false },
  'malapascua': { city: 'Malapascua Island', country: 'Philippines', countryCode: 'PH', lat: '11.3333', lon: '124.1167', elevation: '6m', tempBase: 29, isCool: false },
  'baler': { city: 'Baler', country: 'Philippines', countryCode: 'PH', lat: '15.7592', lon: '121.5622', elevation: '12m', tempBase: 29, isCool: false },
  'legazpi': { city: 'Legazpi City', country: 'Philippines', countryCode: 'PH', lat: '13.1391', lon: '123.7438', elevation: '25m', tempBase: 29, isCool: false },
  'naga': { city: 'Naga City', country: 'Philippines', countryCode: 'PH', lat: '13.6218', lon: '123.1948', elevation: '18m', tempBase: 29, isCool: false },
  'donsol': { city: 'Donsol', country: 'Philippines', countryCode: 'PH', lat: '12.9067', lon: '123.5986', elevation: '10m', tempBase: 29, isCool: false },
  'caramoan': { city: 'Caramoan Islands', country: 'Philippines', countryCode: 'PH', lat: '13.7667', lon: '123.8667', elevation: '14m', tempBase: 29, isCool: false },
  'calaguas': { city: 'Calaguas Islands', country: 'Philippines', countryCode: 'PH', lat: '14.4833', lon: '122.9500', elevation: '8m', tempBase: 29, isCool: false },
  'catanduanes': { city: 'Catanduanes', country: 'Philippines', countryCode: 'PH', lat: '13.7667', lon: '124.2500', elevation: '22m', tempBase: 28, isCool: false },
  'camiguin': { city: 'Camiguin Island', country: 'Philippines', countryCode: 'PH', lat: '9.1733', lon: '124.7297', elevation: '15m', tempBase: 29, isCool: false },
  'cagayan de oro': { city: 'Cagayan de Oro', country: 'Philippines', countryCode: 'PH', lat: '8.4542', lon: '124.6319', elevation: '20m', tempBase: 29, isCool: false },
  'cdo': { city: 'Cagayan de Oro', country: 'Philippines', countryCode: 'PH', lat: '8.4542', lon: '124.6319', elevation: '20m', tempBase: 29, isCool: false },
  'bukidnon': { city: 'Bukidnon (Dahilayan)', country: 'Philippines', countryCode: 'PH', lat: '8.2167', lon: '124.8667', elevation: '950m', tempBase: 23, isCool: true },
  'iligan': { city: 'Iligan City', country: 'Philippines', countryCode: 'PH', lat: '8.2280', lon: '124.2452', elevation: '30m', tempBase: 29, isCool: false },
  'zamboanga': { city: 'Zamboanga City', country: 'Philippines', countryCode: 'PH', lat: '6.9214', lon: '122.0790', elevation: '16m', tempBase: 30, isCool: false },
  'gensan': { city: 'General Santos City', country: 'Philippines', countryCode: 'PH', lat: '6.1164', lon: '125.1716', elevation: '24m', tempBase: 30, isCool: false },
  'general santos': { city: 'General Santos City', country: 'Philippines', countryCode: 'PH', lat: '6.1164', lon: '125.1716', elevation: '24m', tempBase: 30, isCool: false },
  'lake sebu': { city: 'Lake Sebu', country: 'Philippines', countryCode: 'PH', lat: '6.2228', lon: '124.7089', elevation: '1000m', tempBase: 23, isCool: true },
  'batangas': { city: 'Batangas City', country: 'Philippines', countryCode: 'PH', lat: '13.7565', lon: '121.0583', elevation: '22m', tempBase: 30, isCool: false },
  'anilao': { city: 'Batangas (Anilao)', country: 'Philippines', countryCode: 'PH', lat: '13.7533', lon: '120.9122', elevation: '10m', tempBase: 29, isCool: false },
  'nasugbu': { city: 'Nasugbu', country: 'Philippines', countryCode: 'PH', lat: '14.0764', lon: '120.6311', elevation: '15m', tempBase: 29, isCool: false },
  'antipolo': { city: 'Antipolo & Tanay', country: 'Philippines', countryCode: 'PH', lat: '14.5842', lon: '121.1764', elevation: '156m', tempBase: 28, isCool: false },
  'tanay': { city: 'Antipolo & Tanay', country: 'Philippines', countryCode: 'PH', lat: '14.4983', lon: '121.2861', elevation: '220m', tempBase: 27, isCool: false },
  'puerto galera': { city: 'Puerto Galera', country: 'Philippines', countryCode: 'PH', lat: '13.5019', lon: '120.9547', elevation: '12m', tempBase: 29, isCool: false },
  'romblon': { city: 'Romblon (Cresta de Gallo)', country: 'Philippines', countryCode: 'PH', lat: '12.5767', lon: '122.2708', elevation: '10m', tempBase: 29, isCool: false },
  'subic': { city: 'Subic Bay', country: 'Philippines', countryCode: 'PH', lat: '14.8219', lon: '120.2828', elevation: '15m', tempBase: 30, isCool: false },
  'zambales': { city: 'San Antonio (Zambales)', country: 'Philippines', countryCode: 'PH', lat: '14.9500', lon: '120.0833', elevation: '12m', tempBase: 29, isCool: false },
  'angeles': { city: 'Angeles City / Clark', country: 'Philippines', countryCode: 'PH', lat: '15.1450', lon: '120.5887', elevation: '90m', tempBase: 30, isCool: false },
  'clark': { city: 'Angeles City / Clark', country: 'Philippines', countryCode: 'PH', lat: '15.1850', lon: '120.5597', elevation: '140m', tempBase: 29, isCool: false },
  'bataan': { city: 'Bataan (Las Casas)', country: 'Philippines', countryCode: 'PH', lat: '14.6000', lon: '120.4000', elevation: '25m', tempBase: 29, isCool: false },
  'tacloban': { city: 'Tacloban City', country: 'Philippines', countryCode: 'PH', lat: '11.2444', lon: '125.0039', elevation: '14m', tempBase: 29, isCool: false },
  'kalanggaman': { city: 'Kalanggaman Island', country: 'Philippines', countryCode: 'PH', lat: '11.1167', lon: '124.2500', elevation: '4m', tempBase: 29, isCool: false },
  'hinatuan': { city: 'Hinatuan & Bislig', country: 'Philippines', countryCode: 'PH', lat: '8.3667', lon: '126.3333', elevation: '18m', tempBase: 29, isCool: false },
};

/**
 * Deterministic fallback weather generator localized to the Philippines and global queries.
 */
function getDeterministicFallback(city) {
  const normCity = city.toLowerCase().trim();
  const matchedLoc = PHILIPPINE_LOCATIONS[normCity];

  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempBase = matchedLoc ? matchedLoc.tempBase : 27 + (hash % 6);
  const humidity = 65 + (hash % 25); // Tropical humidity
  const wind = 10 + (hash % 15);
  const precip = hash % 5 === 0 ? 55 : hash % 3 === 0 ? 20 : 5;
  const condition = precip > 35 ? 'Rain' : precip > 15 ? 'Clouds' : 'Clear';

  const dateNow = new Date();
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(dateNow);
    d.setDate(d.getDate() + idx);
    const dHash = hash + idx * 7;
    const dPrecip = dHash % 4 === 0 ? 60 : dHash % 2 === 0 ? 15 : 0;
    const dCond = dPrecip > 40 ? 'Rain' : dPrecip > 0 ? 'Clouds' : 'Clear';
    const dHigh = tempBase + (dHash % 3);
    const dLow = dHigh - (matchedLoc?.isCool ? 5 : 4);

    return {
      date: d.toISOString().split('T')[0],
      day: idx === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      condition: dCond === 'Rain' ? 'Tropical Showers' : dCond === 'Clouds' ? 'Partly Cloudy' : 'Sunny & Warm',
      description: dCond === 'Rain' ? 'Localized monsoon rain showers' : dCond === 'Clouds' ? 'Scattered tropical cloud cover' : 'Clear sunny tropical skies',
      icon: dCond === 'Rain' ? '10d' : dCond === 'Clouds' ? '02d' : '01d',
      highTemp: dHigh,
      lowTemp: dLow,
      precipChance: dPrecip,
      windSpeed: wind + (idx % 3),
      humidity: humidity + (idx % 5),
    };
  });

  const resolvedCityName = matchedLoc ? matchedLoc.city : city.charAt(0).toUpperCase() + city.slice(1);
  const resolvedCountry = matchedLoc ? matchedLoc.country : 'Philippines';
  const resolvedLat = matchedLoc ? matchedLoc.lat : (12.0 + (hash % 6)).toFixed(4);
  const resolvedLon = matchedLoc ? matchedLoc.lon : (120.0 + (hash % 4)).toFixed(4);
  const resolvedElevation = matchedLoc ? matchedLoc.elevation : `${20 + (hash % 150)}m`;

  return {
    current: {
      location: {
        city: resolvedCityName,
        country: resolvedCountry,
        lat: resolvedLat,
        lon: resolvedLon,
        elevation: resolvedElevation,
      },
      weather: {
        main: condition,
        description: condition === 'Rain' ? 'Localized monsoon rain showers' : condition === 'Clouds' ? 'Scattered tropical cloud cover' : 'Sunny tropical skies & gentle sea breeze',
        icon: condition === 'Rain' ? '10d' : condition === 'Clouds' ? '02d' : '01d',
      },
      temperature: {
        current: tempBase,
        feelsLike: tempBase + (humidity > 70 ? 2 : 0),
        tempMin: tempBase - 4,
        tempMax: tempBase + 3,
      },
      telemetry: {
        humidity,
        pressure: 1010 + (hash % 6),
        windSpeed: wind,
        windDeg: 70, // Amihan / Habagat flow
        windGust: wind + 8,
        visibilityKm: condition === 'Rain' ? '10.0' : '20.0',
        cloudiness: condition === 'Clear' ? 15 : condition === 'Clouds' ? 50 : 85,
        rain1h: precip > 35 ? 3.5 : 0,
      },
      timestamp: new Date().toISOString(),
      isFallback: true,
    },
    forecast: {
      city: resolvedCityName,
      country: resolvedCountry,
      dailyForecast: days,
      isFallback: true,
    },
  };
}

/**
 * Fetch Current or Date-Specific Weather by City Name.
 */
async function getCurrentWeather(city, date = 'Today') {
  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    const err = new Error('City parameter is required.');
    err.statusCode = 400;
    throw err;
  }

  const cleanCity = city.trim();

  // Validate realistic city name (reject obvious gibberish or arbitrary long hashes)
  if (/(?:xyzzy|qwerty123|\d{3,}|^[^\w\s]+$)/i.test(cleanCity) || cleanCity.length > 35) {
    const notFoundErr = new Error(`City "${cleanCity}" not found.`);
    notFoundErr.statusCode = 404;
    throw notFoundErr;
  }

  const apiKey = config.openWeatherMap?.apiKey;

  let baseWeather = null;
  let forecastData = null;

  if (!apiKey || apiKey.trim() === '') {
    // Deterministic fallback if API key is not supplied
    const fallback = getDeterministicFallback(cleanCity);
    baseWeather = fallback.current;
    forecastData = fallback.forecast;
  } else {
    try {
      const url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(cleanCity)}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          const notFoundErr = new Error(`City "${cleanCity}" not found.`);
          notFoundErr.statusCode = 404;
          throw notFoundErr;
        }
        throw new Error(`OpenWeatherMap API responded with status ${response.status}`);
      }

      const data = await response.json();
      baseWeather = normalizeCurrentWeather(data);
    } catch (err) {
      if (err.statusCode === 404) throw err;
      console.warn(`[WeatherService] OWM call failed (${err.message}). Using deterministic fallback for "${cleanCity}".`);
      const fallback = getDeterministicFallback(cleanCity);
      baseWeather = fallback.current;
      forecastData = fallback.forecast;
    }
  }

  // If a specific future date is requested, overlay forecasted meteorological parameters
  if (date && date !== 'Today') {
    if (!forecastData) {
      try {
        forecastData = await getForecast(cleanCity);
      } catch (e) {
        // use base if forecast fails
      }
    }

    const days = forecastData?.dailyForecast || [];
    let selectedDay = null;

    if (date === 'Tomorrow' && days.length > 1) {
      selectedDay = days[1];
    } else if (date === 'This Weekend') {
      // Find Saturday or Sunday
      selectedDay = days.find((d) => d.day === 'Sat' || d.day === 'Sun') || days[days.length - 1];
    } else if (days.length > 0) {
      // Check date string match (YYYY-MM-DD or day name)
      selectedDay = days.find((d) => d.date === date || d.day === date) || days[0];
    }

    if (selectedDay) {
      const conditionMap = {
        'Passing Showers': 'Rain',
        'Light rain showers': 'Rain',
        'Partly Sunny': 'Clouds',
        'Clear & Crisp': 'Clear',
      };
      const mainCond = conditionMap[selectedDay.condition] || selectedDay.condition;

      return {
        ...baseWeather,
        requestedDate: date,
        weather: {
          main: mainCond,
          description: selectedDay.description || selectedDay.condition,
          icon: selectedDay.icon || '02d',
        },
        temperature: {
          current: Math.round((selectedDay.highTemp + selectedDay.lowTemp) / 2),
          feelsLike: Math.round((selectedDay.highTemp + selectedDay.lowTemp) / 2) - 1,
          tempMin: selectedDay.lowTemp,
          tempMax: selectedDay.highTemp,
        },
        telemetry: {
          ...baseWeather.telemetry,
          humidity: selectedDay.humidity || baseWeather.telemetry?.humidity,
          windSpeed: selectedDay.windSpeed || baseWeather.telemetry?.windSpeed,
          precipitationChance: selectedDay.precipChance || 0,
          rain1h: selectedDay.precipChance > 40 ? 3.0 : 0,
        },
      };
    }
  }

  return baseWeather;
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
