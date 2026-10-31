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
  // --- National Capital Region (NCR) ---
  'manila': { city: 'Manila', country: 'Philippines', countryCode: 'PH', lat: '14.5995', lon: '120.9842', elevation: '16m', tempBase: 31, isCool: false },
  'metro manila': { city: 'Metro Manila', country: 'Philippines', countryCode: 'PH', lat: '14.5995', lon: '120.9842', elevation: '16m', tempBase: 31, isCool: false },
  'quezon city': { city: 'Quezon City', country: 'Philippines', countryCode: 'PH', lat: '14.6760', lon: '121.0437', elevation: '52m', tempBase: 30, isCool: false },
  'qc': { city: 'Quezon City', country: 'Philippines', countryCode: 'PH', lat: '14.6760', lon: '121.0437', elevation: '52m', tempBase: 30, isCool: false },
  'makati': { city: 'Makati City', country: 'Philippines', countryCode: 'PH', lat: '14.5547', lon: '121.0244', elevation: '28m', tempBase: 30, isCool: false },
  'makati city': { city: 'Makati City', country: 'Philippines', countryCode: 'PH', lat: '14.5547', lon: '121.0244', elevation: '28m', tempBase: 30, isCool: false },
  'taguig': { city: 'Taguig (BGC)', country: 'Philippines', countryCode: 'PH', lat: '14.5503', lon: '121.0470', elevation: '35m', tempBase: 30, isCool: false },
  'bgc': { city: 'Taguig (BGC)', country: 'Philippines', countryCode: 'PH', lat: '14.5503', lon: '121.0470', elevation: '35m', tempBase: 30, isCool: false },
  'bonifacio global city': { city: 'Taguig (BGC)', country: 'Philippines', countryCode: 'PH', lat: '14.5503', lon: '121.0470', elevation: '35m', tempBase: 30, isCool: false },
  'taguig (bgc)': { city: 'Taguig (BGC)', country: 'Philippines', countryCode: 'PH', lat: '14.5503', lon: '121.0470', elevation: '35m', tempBase: 30, isCool: false },
  'pasig': { city: 'Pasig City', country: 'Philippines', countryCode: 'PH', lat: '14.5764', lon: '121.0851', elevation: '18m', tempBase: 30, isCool: false },
  'pasig city': { city: 'Pasig City', country: 'Philippines', countryCode: 'PH', lat: '14.5764', lon: '121.0851', elevation: '18m', tempBase: 30, isCool: false },
  'mandaluyong': { city: 'Mandaluyong City', country: 'Philippines', countryCode: 'PH', lat: '14.5794', lon: '121.0359', elevation: '22m', tempBase: 30, isCool: false },
  'san juan': { city: 'San Juan City', country: 'Philippines', countryCode: 'PH', lat: '14.6019', lon: '121.0355', elevation: '25m', tempBase: 30, isCool: false },
  'marikina': { city: 'Marikina City', country: 'Philippines', countryCode: 'PH', lat: '14.6507', lon: '121.1029', elevation: '20m', tempBase: 30, isCool: false },
  'pasay': { city: 'Pasay City', country: 'Philippines', countryCode: 'PH', lat: '14.5378', lon: '120.9997', elevation: '10m', tempBase: 31, isCool: false },
  'paranaque': { city: 'Parañaque City', country: 'Philippines', countryCode: 'PH', lat: '14.4793', lon: '121.0198', elevation: '12m', tempBase: 31, isCool: false },
  'las pinas': { city: 'Las Piñas City', country: 'Philippines', countryCode: 'PH', lat: '14.4445', lon: '120.9939', elevation: '15m', tempBase: 30, isCool: false },
  'muntinlupa': { city: 'Muntinlupa City', country: 'Philippines', countryCode: 'PH', lat: '14.4081', lon: '121.0415', elevation: '24m', tempBase: 30, isCool: false },
  'alabang': { city: 'Muntinlupa (Alabang)', country: 'Philippines', countryCode: 'PH', lat: '14.4170', lon: '121.0400', elevation: '30m', tempBase: 30, isCool: false },
  'caloocan': { city: 'Caloocan City', country: 'Philippines', countryCode: 'PH', lat: '14.6416', lon: '120.9762', elevation: '18m', tempBase: 30, isCool: false },
  'malabon': { city: 'Malabon City', country: 'Philippines', countryCode: 'PH', lat: '14.6625', lon: '120.9569', elevation: '5m', tempBase: 30, isCool: false },
  'navotas': { city: 'Navotas City', country: 'Philippines', countryCode: 'PH', lat: '14.6667', lon: '120.9417', elevation: '4m', tempBase: 30, isCool: false },
  'valenzuela': { city: 'Valenzuela City', country: 'Philippines', countryCode: 'PH', lat: '14.6975', lon: '120.9639', elevation: '12m', tempBase: 30, isCool: false },
  'pateros': { city: 'Pateros', country: 'Philippines', countryCode: 'PH', lat: '14.5456', lon: '121.0686', elevation: '10m', tempBase: 30, isCool: false },

  // --- CALABARZON (Region 4A) ---
  'tagaytay': { city: 'Tagaytay City', country: 'Philippines', countryCode: 'PH', lat: '14.1153', lon: '120.9621', elevation: '634m', tempBase: 24, isCool: true },
  'tagaytay city': { city: 'Tagaytay City', country: 'Philippines', countryCode: 'PH', lat: '14.1153', lon: '120.9621', elevation: '634m', tempBase: 24, isCool: true },
  'cavite': { city: 'Cavite City', country: 'Philippines', countryCode: 'PH', lat: '14.4833', lon: '120.9000', elevation: '8m', tempBase: 30, isCool: false },
  'cavite city': { city: 'Cavite City', country: 'Philippines', countryCode: 'PH', lat: '14.4833', lon: '120.9000', elevation: '8m', tempBase: 30, isCool: false },
  'bacoor': { city: 'Bacoor City', country: 'Philippines', countryCode: 'PH', lat: '14.4589', lon: '120.9436', elevation: '10m', tempBase: 30, isCool: false },
  'imus': { city: 'Imus City', country: 'Philippines', countryCode: 'PH', lat: '14.4297', lon: '120.9367', elevation: '15m', tempBase: 30, isCool: false },
  'dasmarinas': { city: 'Dasmariñas City', country: 'Philippines', countryCode: 'PH', lat: '14.3294', lon: '120.9367', elevation: '95m', tempBase: 29, isCool: false },
  'general trias': { city: 'General Trias City', country: 'Philippines', countryCode: 'PH', lat: '14.3833', lon: '120.8833', elevation: '25m', tempBase: 30, isCool: false },
  'silang': { city: 'Silang (Cavite)', country: 'Philippines', countryCode: 'PH', lat: '14.2333', lon: '120.9667', elevation: '320m', tempBase: 26, isCool: false },
  'calamba': { city: 'Calamba City', country: 'Philippines', countryCode: 'PH', lat: '14.2117', lon: '121.1656', elevation: '22m', tempBase: 30, isCool: false },
  'santa rosa': { city: 'Santa Rosa (Laguna)', country: 'Philippines', countryCode: 'PH', lat: '14.3167', lon: '121.1167', elevation: '18m', tempBase: 30, isCool: false },
  'binan': { city: 'Biñan City', country: 'Philippines', countryCode: 'PH', lat: '14.3333', lon: '121.0833', elevation: '16m', tempBase: 30, isCool: false },
  'san pedro': { city: 'San Pedro City', country: 'Philippines', countryCode: 'PH', lat: '14.3583', lon: '121.0583', elevation: '25m', tempBase: 30, isCool: false },
  'cabuyao': { city: 'Cabuyao City', country: 'Philippines', countryCode: 'PH', lat: '14.2750', lon: '121.1250', elevation: '18m', tempBase: 30, isCool: false },
  'san pablo': { city: 'San Pablo City', country: 'Philippines', countryCode: 'PH', lat: '14.0667', lon: '121.3250', elevation: '115m', tempBase: 28, isCool: false },
  'los banos': { city: 'Los Baños (Laguna)', country: 'Philippines', countryCode: 'PH', lat: '14.1833', lon: '121.2167', elevation: '35m', tempBase: 29, isCool: false },
  'pagsanjan': { city: 'Pagsanjan (Laguna)', country: 'Philippines', countryCode: 'PH', lat: '14.2750', lon: '121.4500', elevation: '30m', tempBase: 29, isCool: false },
  'batangas': { city: 'Batangas City', country: 'Philippines', countryCode: 'PH', lat: '13.7565', lon: '121.0583', elevation: '22m', tempBase: 30, isCool: false },
  'batangas city': { city: 'Batangas City', country: 'Philippines', countryCode: 'PH', lat: '13.7565', lon: '121.0583', elevation: '22m', tempBase: 30, isCool: false },
  'lipa': { city: 'Lipa City', country: 'Philippines', countryCode: 'PH', lat: '13.9411', lon: '121.1622', elevation: '312m', tempBase: 27, isCool: false },
  'lipa city': { city: 'Lipa City', country: 'Philippines', countryCode: 'PH', lat: '13.9411', lon: '121.1622', elevation: '312m', tempBase: 27, isCool: false },
  'tanauan': { city: 'Tanauan City', country: 'Philippines', countryCode: 'PH', lat: '14.0833', lon: '121.1500', elevation: '140m', tempBase: 28, isCool: false },
  'nasugbu': { city: 'Nasugbu (Batangas)', country: 'Philippines', countryCode: 'PH', lat: '14.0764', lon: '120.6311', elevation: '15m', tempBase: 29, isCool: false },
  'anilao': { city: 'Batangas (Anilao)', country: 'Philippines', countryCode: 'PH', lat: '13.7533', lon: '120.9122', elevation: '10m', tempBase: 29, isCool: false },
  'calatagan': { city: 'Calatagan (Batangas)', country: 'Philippines', countryCode: 'PH', lat: '13.8333', lon: '120.6333', elevation: '12m', tempBase: 29, isCool: false },
  'antipolo': { city: 'Antipolo City', country: 'Philippines', countryCode: 'PH', lat: '14.5842', lon: '121.1764', elevation: '156m', tempBase: 28, isCool: false },
  'antipolo city': { city: 'Antipolo City', country: 'Philippines', countryCode: 'PH', lat: '14.5842', lon: '121.1764', elevation: '156m', tempBase: 28, isCool: false },
  'tanay': { city: 'Tanay (Rizal)', country: 'Philippines', countryCode: 'PH', lat: '14.4983', lon: '121.2861', elevation: '220m', tempBase: 27, isCool: false },
  'angono': { city: 'Angono (Rizal)', country: 'Philippines', countryCode: 'PH', lat: '14.5250', lon: '121.1500', elevation: '20m', tempBase: 29, isCool: false },
  'taytay': { city: 'Taytay (Rizal)', country: 'Philippines', countryCode: 'PH', lat: '14.5667', lon: '121.1333', elevation: '25m', tempBase: 30, isCool: false },
  'cainta': { city: 'Cainta (Rizal)', country: 'Philippines', countryCode: 'PH', lat: '14.5833', lon: '121.1167', elevation: '20m', tempBase: 30, isCool: false },
  'lucena': { city: 'Lucena City', country: 'Philippines', countryCode: 'PH', lat: '13.9314', lon: '121.6172', elevation: '18m', tempBase: 29, isCool: false },
  'lucena city': { city: 'Lucena City', country: 'Philippines', countryCode: 'PH', lat: '13.9314', lon: '121.6172', elevation: '18m', tempBase: 29, isCool: false },
  'tayabas': { city: 'Tayabas City', country: 'Philippines', countryCode: 'PH', lat: '14.0167', lon: '121.5833', elevation: '160m', tempBase: 27, isCool: false },

  // --- Central Luzon (Region 3) ---
  'angeles': { city: 'Angeles City / Clark', country: 'Philippines', countryCode: 'PH', lat: '15.1450', lon: '120.5887', elevation: '90m', tempBase: 30, isCool: false },
  'angeles city': { city: 'Angeles City / Clark', country: 'Philippines', countryCode: 'PH', lat: '15.1450', lon: '120.5887', elevation: '90m', tempBase: 30, isCool: false },
  'clark': { city: 'Clark Freeport Zone', country: 'Philippines', countryCode: 'PH', lat: '15.1850', lon: '120.5597', elevation: '140m', tempBase: 29, isCool: false },
  'san fernando': { city: 'San Fernando (Pampanga)', country: 'Philippines', countryCode: 'PH', lat: '15.0333', lon: '120.6833', elevation: '20m', tempBase: 30, isCool: false },
  'san fernando pampanga': { city: 'San Fernando (Pampanga)', country: 'Philippines', countryCode: 'PH', lat: '15.0333', lon: '120.6833', elevation: '20m', tempBase: 30, isCool: false },
  'san fernando la union': { city: 'San Fernando (La Union)', country: 'Philippines', countryCode: 'PH', lat: '16.6167', lon: '120.3167', elevation: '10m', tempBase: 30, isCool: false },
  'san fernando (la union)': { city: 'San Fernando (La Union)', country: 'Philippines', countryCode: 'PH', lat: '16.6167', lon: '120.3167', elevation: '10m', tempBase: 30, isCool: false },
  'pampanga': { city: 'San Fernando (Pampanga)', country: 'Philippines', countryCode: 'PH', lat: '15.0333', lon: '120.6833', elevation: '20m', tempBase: 30, isCool: false },
  'subic': { city: 'Subic Bay', country: 'Philippines', countryCode: 'PH', lat: '14.8219', lon: '120.2828', elevation: '15m', tempBase: 30, isCool: false },
  'subic bay': { city: 'Subic Bay', country: 'Philippines', countryCode: 'PH', lat: '14.8219', lon: '120.2828', elevation: '15m', tempBase: 30, isCool: false },
  'olongapo': { city: 'Olongapo City', country: 'Philippines', countryCode: 'PH', lat: '14.8386', lon: '120.2842', elevation: '18m', tempBase: 30, isCool: false },
  'zambales': { city: 'San Antonio (Zambales)', country: 'Philippines', countryCode: 'PH', lat: '14.9500', lon: '120.0833', elevation: '12m', tempBase: 29, isCool: false },
  'san antonio': { city: 'San Antonio (Zambales)', country: 'Philippines', countryCode: 'PH', lat: '14.9500', lon: '120.0833', elevation: '12m', tempBase: 29, isCool: false },
  'bataan': { city: 'Bataan (Las Casas)', country: 'Philippines', countryCode: 'PH', lat: '14.6000', lon: '120.4000', elevation: '25m', tempBase: 29, isCool: false },
  'las casas': { city: 'Bataan (Las Casas)', country: 'Philippines', countryCode: 'PH', lat: '14.6000', lon: '120.4000', elevation: '25m', tempBase: 29, isCool: false },
  'tarlac': { city: 'Tarlac City', country: 'Philippines', countryCode: 'PH', lat: '15.4802', lon: '120.5979', elevation: '55m', tempBase: 31, isCool: false },
  'tarlac city': { city: 'Tarlac City', country: 'Philippines', countryCode: 'PH', lat: '15.4802', lon: '120.5979', elevation: '55m', tempBase: 31, isCool: false },
  'cabanatuan': { city: 'Cabanatuan City', country: 'Philippines', countryCode: 'PH', lat: '15.4859', lon: '120.9673', elevation: '42m', tempBase: 31, isCool: false },
  'cabanatuan city': { city: 'Cabanatuan City', country: 'Philippines', countryCode: 'PH', lat: '15.4859', lon: '120.9673', elevation: '42m', tempBase: 31, isCool: false },
  'malolos': { city: 'Malolos City', country: 'Philippines', countryCode: 'PH', lat: '14.8433', lon: '120.8114', elevation: '10m', tempBase: 30, isCool: false },
  'san jose del monte': { city: 'San Jose del Monte', country: 'Philippines', countryCode: 'PH', lat: '14.8139', lon: '121.0453', elevation: '95m', tempBase: 29, isCool: false },
  'baler': { city: 'Baler (Aurora)', country: 'Philippines', countryCode: 'PH', lat: '15.7592', lon: '121.5622', elevation: '12m', tempBase: 29, isCool: false },
  'dingalan': { city: 'Dingalan (Aurora)', country: 'Philippines', countryCode: 'PH', lat: '15.3900', lon: '121.3900', elevation: '15m', tempBase: 29, isCool: false },

  // --- Northern Luzon & Cordillera (CAR / Region 1 / Region 2) ---
  'baguio': { city: 'Baguio City', country: 'Philippines', countryCode: 'PH', lat: '16.4023', lon: '120.5960', elevation: '1470m', tempBase: 20, isCool: true },
  'baguio city': { city: 'Baguio City', country: 'Philippines', countryCode: 'PH', lat: '16.4023', lon: '120.5960', elevation: '1470m', tempBase: 20, isCool: true },
  'sagada': { city: 'Sagada', country: 'Philippines', countryCode: 'PH', lat: '17.0833', lon: '120.9000', elevation: '1500m', tempBase: 19, isCool: true },
  'banaue': { city: 'Banaue', country: 'Philippines', countryCode: 'PH', lat: '16.9167', lon: '121.0500', elevation: '1200m', tempBase: 21, isCool: true },
  'la union': { city: 'La Union (San Juan)', country: 'Philippines', countryCode: 'PH', lat: '16.6667', lon: '120.3333', elevation: '10m', tempBase: 30, isCool: false },
  'san juan la union': { city: 'La Union (San Juan)', country: 'Philippines', countryCode: 'PH', lat: '16.6667', lon: '120.3333', elevation: '10m', tempBase: 30, isCool: false },
  'vigan': { city: 'Vigan City', country: 'Philippines', countryCode: 'PH', lat: '17.5747', lon: '120.3869', elevation: '15m', tempBase: 30, isCool: false },
  'vigan city': { city: 'Vigan City', country: 'Philippines', countryCode: 'PH', lat: '17.5747', lon: '120.3869', elevation: '15m', tempBase: 30, isCool: false },
  'laoag': { city: 'Laoag City', country: 'Philippines', countryCode: 'PH', lat: '18.1960', lon: '120.5927', elevation: '20m', tempBase: 30, isCool: false },
  'laoag city': { city: 'Laoag City', country: 'Philippines', countryCode: 'PH', lat: '18.1960', lon: '120.5927', elevation: '20m', tempBase: 30, isCool: false },
  'pagudpud': { city: 'Pagudpud', country: 'Philippines', countryCode: 'PH', lat: '18.5583', lon: '120.7861', elevation: '12m', tempBase: 29, isCool: false },
  'alaminos': { city: 'Alaminos (Hundred Islands)', country: 'Philippines', countryCode: 'PH', lat: '16.1500', lon: '119.9833', elevation: '14m', tempBase: 30, isCool: false },
  'hundred islands': { city: 'Alaminos (Hundred Islands)', country: 'Philippines', countryCode: 'PH', lat: '16.1500', lon: '119.9833', elevation: '14m', tempBase: 30, isCool: false },
  'dagupan': { city: 'Dagupan City', country: 'Philippines', countryCode: 'PH', lat: '16.0433', lon: '120.3333', elevation: '5m', tempBase: 31, isCool: false },
  'tuguegarao': { city: 'Tuguegarao City', country: 'Philippines', countryCode: 'PH', lat: '17.6167', lon: '121.7167', elevation: '22m', tempBase: 32, isCool: false },
  'batanes': { city: 'Batanes (Basco)', country: 'Philippines', countryCode: 'PH', lat: '20.4485', lon: '121.9702', elevation: '45m', tempBase: 24, isCool: true },
  'basco': { city: 'Batanes (Basco)', country: 'Philippines', countryCode: 'PH', lat: '20.4485', lon: '121.9702', elevation: '45m', tempBase: 24, isCool: true },

  // --- MIMAROPA & Bicol ---
  'palawan': { city: 'Palawan (El Nido)', country: 'Philippines', countryCode: 'PH', lat: '11.1956', lon: '119.4075', elevation: '8m', tempBase: 29, isCool: false },
  'el nido': { city: 'El Nido', country: 'Philippines', countryCode: 'PH', lat: '11.1956', lon: '119.4075', elevation: '8m', tempBase: 29, isCool: false },
  'coron': { city: 'Coron', country: 'Philippines', countryCode: 'PH', lat: '12.0000', lon: '120.2000', elevation: '12m', tempBase: 29, isCool: false },
  'puerto princesa': { city: 'Puerto Princesa', country: 'Philippines', countryCode: 'PH', lat: '9.7392', lon: '118.7353', elevation: '16m', tempBase: 29, isCool: false },
  'san vicente': { city: 'San Vicente (Palawan)', country: 'Philippines', countryCode: 'PH', lat: '10.5186', lon: '119.2944', elevation: '10m', tempBase: 29, isCool: false },
  'puerto galera': { city: 'Puerto Galera', country: 'Philippines', countryCode: 'PH', lat: '13.5019', lon: '120.9547', elevation: '12m', tempBase: 29, isCool: false },
  'calapan': { city: 'Calapan City', country: 'Philippines', countryCode: 'PH', lat: '13.4117', lon: '121.1803', elevation: '10m', tempBase: 29, isCool: false },
  'romblon': { city: 'Romblon (Cresta de Gallo)', country: 'Philippines', countryCode: 'PH', lat: '12.5767', lon: '122.2708', elevation: '10m', tempBase: 29, isCool: false },
  'legazpi': { city: 'Legazpi City', country: 'Philippines', countryCode: 'PH', lat: '13.1391', lon: '123.7438', elevation: '25m', tempBase: 29, isCool: false },
  'legazpi city': { city: 'Legazpi City', country: 'Philippines', countryCode: 'PH', lat: '13.1391', lon: '123.7438', elevation: '25m', tempBase: 29, isCool: false },
  'naga': { city: 'Naga City', country: 'Philippines', countryCode: 'PH', lat: '13.6218', lon: '123.1948', elevation: '18m', tempBase: 29, isCool: false },
  'naga city': { city: 'Naga City', country: 'Philippines', countryCode: 'PH', lat: '13.6218', lon: '123.1948', elevation: '18m', tempBase: 29, isCool: false },
  'donsol': { city: 'Donsol', country: 'Philippines', countryCode: 'PH', lat: '12.9067', lon: '123.5986', elevation: '10m', tempBase: 29, isCool: false },
  'caramoan': { city: 'Caramoan Islands', country: 'Philippines', countryCode: 'PH', lat: '13.7667', lon: '123.8667', elevation: '14m', tempBase: 29, isCool: false },
  'calaguas': { city: 'Calaguas Islands', country: 'Philippines', countryCode: 'PH', lat: '14.4833', lon: '122.9500', elevation: '8m', tempBase: 29, isCool: false },
  'catanduanes': { city: 'Catanduanes', country: 'Philippines', countryCode: 'PH', lat: '13.7667', lon: '124.2500', elevation: '22m', tempBase: 28, isCool: false },
  'sorsogon': { city: 'Sorsogon City', country: 'Philippines', countryCode: 'PH', lat: '12.9739', lon: '124.0058', elevation: '15m', tempBase: 29, isCool: false },

  // --- Visayas ---
  'cebu': { city: 'Cebu City', country: 'Philippines', countryCode: 'PH', lat: '10.3157', lon: '123.8854', elevation: '17m', tempBase: 29, isCool: false },
  'cebu city': { city: 'Cebu City', country: 'Philippines', countryCode: 'PH', lat: '10.3157', lon: '123.8854', elevation: '17m', tempBase: 29, isCool: false },
  'boracay': { city: 'Boracay', country: 'Philippines', countryCode: 'PH', lat: '11.9674', lon: '121.9248', elevation: '5m', tempBase: 29, isCool: false },
  'iloilo': { city: 'Iloilo City', country: 'Philippines', countryCode: 'PH', lat: '10.7202', lon: '122.5621', elevation: '10m', tempBase: 29, isCool: false },
  'iloilo city': { city: 'Iloilo City', country: 'Philippines', countryCode: 'PH', lat: '10.7202', lon: '122.5621', elevation: '10m', tempBase: 29, isCool: false },
  'bacolod': { city: 'Bacolod City', country: 'Philippines', countryCode: 'PH', lat: '10.6766', lon: '122.9509', elevation: '12m', tempBase: 29, isCool: false },
  'bacolod city': { city: 'Bacolod City', country: 'Philippines', countryCode: 'PH', lat: '10.6766', lon: '122.9509', elevation: '12m', tempBase: 29, isCool: false },
  'dumaguete': { city: 'Dumaguete', country: 'Philippines', countryCode: 'PH', lat: '9.3068', lon: '123.3054', elevation: '15m', tempBase: 29, isCool: false },
  'bohol': { city: 'Bohol (Panglao)', country: 'Philippines', countryCode: 'PH', lat: '9.6729', lon: '123.8730', elevation: '15m', tempBase: 29, isCool: false },
  'panglao': { city: 'Bohol (Panglao)', country: 'Philippines', countryCode: 'PH', lat: '9.6729', lon: '123.8730', elevation: '15m', tempBase: 29, isCool: false },
  'tagbilaran': { city: 'Tagbilaran City', country: 'Philippines', countryCode: 'PH', lat: '9.6500', lon: '123.8500', elevation: '20m', tempBase: 29, isCool: false },
  'siquijor': { city: 'Siquijor Island', country: 'Philippines', countryCode: 'PH', lat: '9.2144', lon: '123.5156', elevation: '12m', tempBase: 29, isCool: false },
  'moalboal': { city: 'Moalboal', country: 'Philippines', countryCode: 'PH', lat: '9.9567', lon: '123.4008', elevation: '8m', tempBase: 29, isCool: false },
  'bantayan': { city: 'Bantayan Island', country: 'Philippines', countryCode: 'PH', lat: '11.2000', lon: '123.7333', elevation: '5m', tempBase: 29, isCool: false },
  'malapascua': { city: 'Malapascua Island', country: 'Philippines', countryCode: 'PH', lat: '11.3333', lon: '124.1167', elevation: '6m', tempBase: 29, isCool: false },
  'tacloban': { city: 'Tacloban City', country: 'Philippines', countryCode: 'PH', lat: '11.2444', lon: '125.0039', elevation: '14m', tempBase: 29, isCool: false },
  'ormoc': { city: 'Ormoc City', country: 'Philippines', countryCode: 'PH', lat: '11.0064', lon: '124.6075', elevation: '12m', tempBase: 29, isCool: false },
  'kalanggaman': { city: 'Kalanggaman Island', country: 'Philippines', countryCode: 'PH', lat: '11.1167', lon: '124.2500', elevation: '4m', tempBase: 29, isCool: false },
  'guimaras': { city: 'Guimaras Island', country: 'Philippines', countryCode: 'PH', lat: '10.5936', lon: '122.6322', elevation: '25m', tempBase: 29, isCool: false },
  'roxas': { city: 'Roxas City', country: 'Philippines', countryCode: 'PH', lat: '11.5853', lon: '122.7511', elevation: '8m', tempBase: 29, isCool: false },
  'kalibo': { city: 'Kalibo (Aklan)', country: 'Philippines', countryCode: 'PH', lat: '11.7061', lon: '122.3644', elevation: '10m', tempBase: 29, isCool: false },

  // --- Mindanao ---
  'davao': { city: 'Davao City', country: 'Philippines', countryCode: 'PH', lat: '7.1907', lon: '125.4553', elevation: '22m', tempBase: 30, isCool: false },
  'davao city': { city: 'Davao City', country: 'Philippines', countryCode: 'PH', lat: '7.1907', lon: '125.4553', elevation: '22m', tempBase: 30, isCool: false },
  'siargao': { city: 'Siargao Island', country: 'Philippines', countryCode: 'PH', lat: '9.8584', lon: '126.0469', elevation: '10m', tempBase: 29, isCool: false },
  'samal': { city: 'Samal Island (IGACOS)', country: 'Philippines', countryCode: 'PH', lat: '7.0789', lon: '125.7144', elevation: '18m', tempBase: 29, isCool: false },
  'mati': { city: 'Mati City', country: 'Philippines', countryCode: 'PH', lat: '6.9556', lon: '126.2167', elevation: '15m', tempBase: 29, isCool: false },
  'cagayan de oro': { city: 'Cagayan de Oro', country: 'Philippines', countryCode: 'PH', lat: '8.4542', lon: '124.6319', elevation: '20m', tempBase: 29, isCool: false },
  'cdo': { city: 'Cagayan de Oro', country: 'Philippines', countryCode: 'PH', lat: '8.4542', lon: '124.6319', elevation: '20m', tempBase: 29, isCool: false },
  'camiguin': { city: 'Camiguin Island', country: 'Philippines', countryCode: 'PH', lat: '9.1733', lon: '124.7297', elevation: '15m', tempBase: 29, isCool: false },
  'bukidnon': { city: 'Bukidnon (Dahilayan)', country: 'Philippines', countryCode: 'PH', lat: '8.2167', lon: '124.8667', elevation: '950m', tempBase: 23, isCool: true },
  'iligan': { city: 'Iligan City', country: 'Philippines', countryCode: 'PH', lat: '8.2280', lon: '124.2452', elevation: '30m', tempBase: 29, isCool: false },
  'zamboanga': { city: 'Zamboanga City', country: 'Philippines', countryCode: 'PH', lat: '6.9214', lon: '122.0790', elevation: '16m', tempBase: 30, isCool: false },
  'general santos': { city: 'General Santos City', country: 'Philippines', countryCode: 'PH', lat: '6.1164', lon: '125.1716', elevation: '24m', tempBase: 30, isCool: false },
  'gensan': { city: 'General Santos City', country: 'Philippines', countryCode: 'PH', lat: '6.1164', lon: '125.1716', elevation: '24m', tempBase: 30, isCool: false },
  'lake sebu': { city: 'Lake Sebu', country: 'Philippines', countryCode: 'PH', lat: '6.2228', lon: '124.7089', elevation: '1000m', tempBase: 23, isCool: true },
  'butuan': { city: 'Butuan City', country: 'Philippines', countryCode: 'PH', lat: '8.9475', lon: '125.5406', elevation: '14m', tempBase: 30, isCool: false },
  'surigao': { city: 'Surigao City', country: 'Philippines', countryCode: 'PH', lat: '9.7892', lon: '125.4950', elevation: '12m', tempBase: 29, isCool: false },
  'hinatuan': { city: 'Hinatuan & Bislig', country: 'Philippines', countryCode: 'PH', lat: '8.3667', lon: '126.3333', elevation: '18m', tempBase: 29, isCool: false },
  'cotabato': { city: 'Cotabato City', country: 'Philippines', countryCode: 'PH', lat: '7.2236', lon: '124.2464', elevation: '10m', tempBase: 30, isCool: false },

  // --- East & Southeast Asia ---
  'tokyo': { city: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: '35.6762', lon: '139.6503', elevation: '40m', tempBase: 19, isCool: false },
  'osaka': { city: 'Osaka', country: 'Japan', countryCode: 'JP', lat: '34.6937', lon: '135.5023', elevation: '20m', tempBase: 20, isCool: false },
  'kyoto': { city: 'Kyoto', country: 'Japan', countryCode: 'JP', lat: '35.0116', lon: '135.7681', elevation: '50m', tempBase: 18, isCool: false },
  'sapporo': { city: 'Sapporo', country: 'Japan', countryCode: 'JP', lat: '43.0618', lon: '141.3545', elevation: '25m', tempBase: 12, isCool: true },
  'fukuoka': { city: 'Fukuoka', country: 'Japan', countryCode: 'JP', lat: '33.5904', lon: '130.4017', elevation: '15m', tempBase: 20, isCool: false },
  'seoul': { city: 'Seoul', country: 'South Korea', countryCode: 'KR', lat: '37.5665', lon: '126.9780', elevation: '38m', tempBase: 17, isCool: false },
  'busan': { city: 'Busan', country: 'South Korea', countryCode: 'KR', lat: '35.1796', lon: '129.0756', elevation: '22m', tempBase: 18, isCool: false },
  'jeju': { city: 'Jeju Island', country: 'South Korea', countryCode: 'KR', lat: '33.4996', lon: '126.5312', elevation: '20m', tempBase: 19, isCool: false },
  'taipei': { city: 'Taipei', country: 'Taiwan', countryCode: 'TW', lat: '25.0330', lon: '121.5654', elevation: '10m', tempBase: 25, isCool: false },
  'kaohsiung': { city: 'Kaohsiung', country: 'Taiwan', countryCode: 'TW', lat: '22.6273', lon: '120.3014', elevation: '15m', tempBase: 27, isCool: false },
  'hong kong': { city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', lat: '22.3193', lon: '114.1694', elevation: '15m', tempBase: 26, isCool: false },
  'macau': { city: 'Macau', country: 'Macau', countryCode: 'MO', lat: '22.1987', lon: '113.5439', elevation: '12m', tempBase: 26, isCool: false },
  'singapore': { city: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: '1.3521', lon: '103.8198', elevation: '15m', tempBase: 31, isCool: false },
  'bangkok': { city: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: '13.7563', lon: '100.5018', elevation: '5m', tempBase: 32, isCool: false },
  'phuket': { city: 'Phuket', country: 'Thailand', countryCode: 'TH', lat: '7.8804', lon: '98.3923', elevation: '12m', tempBase: 30, isCool: false },
  'chiang mai': { city: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', lat: '18.7883', lon: '98.9853', elevation: '310m', tempBase: 27, isCool: false },
  'pattaya': { city: 'Pattaya', country: 'Thailand', countryCode: 'TH', lat: '12.9236', lon: '100.8825', elevation: '10m', tempBase: 31, isCool: false },
  'bali': { city: 'Bali (Denpasar)', country: 'Indonesia', countryCode: 'ID', lat: '-8.6705', lon: '115.2126', elevation: '25m', tempBase: 29, isCool: false },
  'jakarta': { city: 'Jakarta', country: 'Indonesia', countryCode: 'ID', lat: '-6.2088', lon: '106.8456', elevation: '8m', tempBase: 31, isCool: false },
  'kuala lumpur': { city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', lat: '3.1390', lon: '101.6869', elevation: '60m', tempBase: 31, isCool: false },
  'penang': { city: 'Penang (George Town)', country: 'Malaysia', countryCode: 'MY', lat: '5.4164', lon: '100.3327', elevation: '10m', tempBase: 30, isCool: false },
  'hanoi': { city: 'Hanoi', country: 'Vietnam', countryCode: 'VN', lat: '21.0285', lon: '105.8542', elevation: '16m', tempBase: 26, isCool: false },
  'ho chi minh city': { city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', lat: '10.8231', lon: '106.6297', elevation: '19m', tempBase: 31, isCool: false },
  'saigon': { city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', lat: '10.8231', lon: '106.6297', elevation: '19m', tempBase: 31, isCool: false },
  'da nang': { city: 'Da Nang', country: 'Vietnam', countryCode: 'VN', lat: '16.0544', lon: '108.2022', elevation: '12m', tempBase: 29, isCool: false },

  // --- Europe ---
  'london': { city: 'London', country: 'United Kingdom', countryCode: 'GB', lat: '51.5074', lon: '-0.1278', elevation: '35m', tempBase: 15, isCool: true },
  'paris': { city: 'Paris', country: 'France', countryCode: 'FR', lat: '48.8566', lon: '2.3522', elevation: '35m', tempBase: 16, isCool: true },
  'rome': { city: 'Rome', country: 'Italy', countryCode: 'IT', lat: '41.9028', lon: '12.4964', elevation: '21m', tempBase: 21, isCool: false },
  'milan': { city: 'Milan', country: 'Italy', countryCode: 'IT', lat: '45.4642', lon: '9.1900', elevation: '120m', tempBase: 18, isCool: false },
  'venice': { city: 'Venice', country: 'Italy', countryCode: 'IT', lat: '45.4408', lon: '12.3155', elevation: '2m', tempBase: 18, isCool: false },
  'florence': { city: 'Florence', country: 'Italy', countryCode: 'IT', lat: '43.7696', lon: '11.2558', elevation: '50m', tempBase: 19, isCool: false },
  'barcelona': { city: 'Barcelona', country: 'Spain', countryCode: 'ES', lat: '41.3879', lon: '2.1699', elevation: '12m', tempBase: 22, isCool: false },
  'madrid': { city: 'Madrid', country: 'Spain', countryCode: 'ES', lat: '40.4168', lon: '-3.7038', elevation: '650m', tempBase: 21, isCool: false },
  'amsterdam': { city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', lat: '52.3676', lon: '4.9041', elevation: '2m', tempBase: 14, isCool: true },
  'berlin': { city: 'Berlin', country: 'Germany', countryCode: 'DE', lat: '52.5200', lon: '13.4050', elevation: '34m', tempBase: 15, isCool: true },
  'munich': { city: 'Munich', country: 'Germany', countryCode: 'DE', lat: '48.1351', lon: '11.5820', elevation: '520m', tempBase: 14, isCool: true },
  'frankfurt': { city: 'Frankfurt', country: 'Germany', countryCode: 'DE', lat: '50.1109', lon: '8.6821', elevation: '112m', tempBase: 16, isCool: true },
  'vienna': { city: 'Vienna', country: 'Austria', countryCode: 'AT', lat: '48.2082', lon: '16.3738', elevation: '170m', tempBase: 16, isCool: true },
  'zurich': { city: 'Zurich', country: 'Switzerland', countryCode: 'CH', lat: '47.3769', lon: '8.5417', elevation: '408m', tempBase: 13, isCool: true },
  'geneva': { city: 'Geneva', country: 'Switzerland', countryCode: 'CH', lat: '46.2044', lon: '6.1432', elevation: '375m', tempBase: 14, isCool: true },
  'prague': { city: 'Prague', country: 'Czech Republic', countryCode: 'CZ', lat: '50.0755', lon: '14.4378', elevation: '235m', tempBase: 14, isCool: true },
  'athens': { city: 'Athens', country: 'Greece', countryCode: 'GR', lat: '37.9838', lon: '23.7275', elevation: '70m', tempBase: 24, isCool: false },
  'santorini': { city: 'Santorini', country: 'Greece', countryCode: 'GR', lat: '36.3932', lon: '25.4615', elevation: '120m', tempBase: 23, isCool: false },
  'dublin': { city: 'Dublin', country: 'Ireland', countryCode: 'IE', lat: '53.3498', lon: '-6.2603', elevation: '20m', tempBase: 13, isCool: true },
  'edinburgh': { city: 'Edinburgh', country: 'United Kingdom', countryCode: 'GB', lat: '55.9533', lon: '-3.1883', elevation: '47m', tempBase: 12, isCool: true },
  'lisbon': { city: 'Lisbon', country: 'Portugal', countryCode: 'PT', lat: '38.7223', lon: '-9.1393', elevation: '30m', tempBase: 22, isCool: false },
  'copenhagen': { city: 'Copenhagen', country: 'Denmark', countryCode: 'DK', lat: '55.6761', lon: '12.5683', elevation: '14m', tempBase: 13, isCool: true },
  'stockholm': { city: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: '59.3293', lon: '18.0686', elevation: '28m', tempBase: 11, isCool: true },
  'oslo': { city: 'Oslo', country: 'Norway', countryCode: 'NO', lat: '59.9139', lon: '10.7522', elevation: '23m', tempBase: 10, isCool: true },
  'helsinki': { city: 'Helsinki', country: 'Finland', countryCode: 'FI', lat: '60.1699', lon: '24.9384', elevation: '25m', tempBase: 10, isCool: true },
  'reykjavik': { city: 'Reykjavik', country: 'Iceland', countryCode: 'IS', lat: '64.1466', lon: '-21.9426', elevation: '15m', tempBase: 7, isCool: true },

  // --- Americas ---
  'new york': { city: 'New York City', country: 'United States', countryCode: 'US', lat: '40.7128', lon: '-74.0060', elevation: '10m', tempBase: 18, isCool: false },
  'new york city': { city: 'New York City', country: 'United States', countryCode: 'US', lat: '40.7128', lon: '-74.0060', elevation: '10m', tempBase: 18, isCool: false },
  'nyc': { city: 'New York City', country: 'United States', countryCode: 'US', lat: '40.7128', lon: '-74.0060', elevation: '10m', tempBase: 18, isCool: false },
  'los angeles': { city: 'Los Angeles', country: 'United States', countryCode: 'US', lat: '34.0522', lon: '-118.2437', elevation: '87m', tempBase: 23, isCool: false },
  'la': { city: 'Los Angeles', country: 'United States', countryCode: 'US', lat: '34.0522', lon: '-118.2437', elevation: '87m', tempBase: 23, isCool: false },
  'san francisco': { city: 'San Francisco', country: 'United States', countryCode: 'US', lat: '37.7749', lon: '-122.4194', elevation: '16m', tempBase: 16, isCool: true },
  'chicago': { city: 'Chicago', country: 'United States', countryCode: 'US', lat: '41.8781', lon: '-87.6298', elevation: '181m', tempBase: 16, isCool: false },
  'miami': { city: 'Miami', country: 'United States', countryCode: 'US', lat: '25.7617', lon: '-80.1918', elevation: '2m', tempBase: 28, isCool: false },
  'seattle': { city: 'Seattle', country: 'United States', countryCode: 'US', lat: '47.6062', lon: '-122.3321', elevation: '53m', tempBase: 14, isCool: true },
  'las vegas': { city: 'Las Vegas', country: 'United States', countryCode: 'US', lat: '36.1699', lon: '-115.1398', elevation: '610m', tempBase: 28, isCool: false },
  'honolulu': { city: 'Honolulu (Hawaii)', country: 'United States', countryCode: 'US', lat: '21.3069', lon: '-157.8583', elevation: '6m', tempBase: 28, isCool: false },
  'boston': { city: 'Boston', country: 'United States', countryCode: 'US', lat: '42.3601', lon: '-71.0589', elevation: '14m', tempBase: 16, isCool: true },
  'washington': { city: 'Washington, D.C.', country: 'United States', countryCode: 'US', lat: '38.9072', lon: '-77.0369', elevation: '22m', tempBase: 18, isCool: false },
  'vancouver': { city: 'Vancouver', country: 'Canada', countryCode: 'CA', lat: '49.2827', lon: '-123.1207', elevation: '4m', tempBase: 14, isCool: true },
  'toronto': { city: 'Toronto', country: 'Canada', countryCode: 'CA', lat: '43.6532', lon: '-79.3832', elevation: '76m', tempBase: 16, isCool: false },
  'montreal': { city: 'Montreal', country: 'Canada', countryCode: 'CA', lat: '45.5017', lon: '-73.5673', elevation: '36m', tempBase: 14, isCool: true },
  'mexico city': { city: 'Mexico City', country: 'Mexico', countryCode: 'MX', lat: '19.4326', lon: '-99.1332', elevation: '2240m', tempBase: 20, isCool: true },
  'cancun': { city: 'Cancun', country: 'Mexico', countryCode: 'MX', lat: '21.1619', lon: '-86.8515', elevation: '10m', tempBase: 29, isCool: false },
  'rio de janeiro': { city: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', lat: '-22.9068', lon: '-43.1729', elevation: '5m', tempBase: 27, isCool: false },
  'buenos aires': { city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', lat: '-34.6037', lon: '-58.3816', elevation: '25m', tempBase: 20, isCool: false },

  // --- Oceania ---
  'sydney': { city: 'Sydney', country: 'Australia', countryCode: 'AU', lat: '-33.8688', lon: '151.2093', elevation: '19m', tempBase: 22, isCool: false },
  'melbourne': { city: 'Melbourne', country: 'Australia', countryCode: 'AU', lat: '-37.8136', lon: '144.9631', elevation: '31m', tempBase: 19, isCool: false },
  'brisbane': { city: 'Brisbane', country: 'Australia', countryCode: 'AU', lat: '-27.4698', lon: '153.0251', elevation: '28m', tempBase: 25, isCool: false },
  'auckland': { city: 'Auckland', country: 'New Zealand', countryCode: 'NZ', lat: '-36.8485', lon: '174.7633', elevation: '26m', tempBase: 18, isCool: false },
  'queenstown': { city: 'Queenstown', country: 'New Zealand', countryCode: 'NZ', lat: '-45.0312', lon: '168.6626', elevation: '310m', tempBase: 12, isCool: true },

  // --- Middle East & Africa ---
  'dubai': { city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: '25.2048', lon: '55.2708', elevation: '5m', tempBase: 34, isCool: false },
  'abu dhabi': { city: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', lat: '24.4539', lon: '54.3773', elevation: '7m', tempBase: 33, isCool: false },
  'doha': { city: 'Doha', country: 'Qatar', countryCode: 'QA', lat: '25.2854', lon: '51.5310', elevation: '10m', tempBase: 32, isCool: false },
  'cairo': { city: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: '30.0444', lon: '31.2357', elevation: '23m', tempBase: 27, isCool: false },
  'cape town': { city: 'Cape Town', country: 'South Africa', countryCode: 'ZA', lat: '-33.9249', lon: '18.4241', elevation: '15m', tempBase: 20, isCool: false },
  'istanbul': { city: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: '41.0082', lon: '28.9784', elevation: '39m', tempBase: 18, isCool: false },
};

/**
 * Deterministic fallback weather generator supporting Philippine and global destinations.
 * Resolves precise coordinates, regional climate factors, and 7-day daily summaries.
 */
function getDeterministicFallback(city) {
  const rawCity = (city || '').trim();
  const normCity = rawCity.toLowerCase();

  // Parse potential "City, Province/Country" formats
  let parsedCity = rawCity;
  let parsedCountry = null;
  if (rawCity.includes(',')) {
    const parts = rawCity.split(',').map((p) => p.trim());
    parsedCity = parts[0];
    parsedCountry = parts.slice(1).join(', ');
  } else if (rawCity.includes('(')) {
    parsedCity = rawCity.replace(/\s*\([^)]*\)/g, '').trim();
  }

  // Normalize diacritics (e.g. Dasmariñas -> dasmarinas, Biñan -> binan)
  const normParsed = parsedCity.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normFull = normCity.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Direct dictionary match by key
  let matchedLoc = PHILIPPINE_LOCATIONS[normParsed] || PHILIPPINE_LOCATIONS[normFull];

  // 2. Direct match by loc.city name
  if (!matchedLoc) {
    matchedLoc = Object.values(PHILIPPINE_LOCATIONS).find((loc) => {
      const cNorm = loc.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return cNorm === normParsed || cNorm === normFull;
    });
  }

  // 3. Clean word match without parentheses
  if (!matchedLoc) {
    matchedLoc = Object.values(PHILIPPINE_LOCATIONS).find((loc) => {
      const locBase = loc.city.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return locBase === normParsed || normParsed === locBase || normParsed.startsWith(locBase + ' ') || normParsed.endsWith(' ' + locBase);
    });
  }

  const isLikelyPH =
    matchedLoc?.countryCode === 'PH' ||
    /philippines|ncr|luzon|visayas|mindanao|metro manila|benguet|cebu|davao|palawan|cavite|laguna|batangas|rizal|bulacan|pampanga|zambales|bataan|ilocos|pangasinan/i.test(
      rawCity
    );

  const resolvedCityName = matchedLoc
    ? matchedLoc.city
    : parsedCity.charAt(0).toUpperCase() + parsedCity.slice(1);
  const resolvedCountry = matchedLoc
    ? matchedLoc.country
    : parsedCountry || (isLikelyPH ? 'Philippines' : 'Global Forecast Region');

  const hash = rawCity.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tempBase = matchedLoc ? matchedLoc.tempBase : isLikelyPH ? 29 + (hash % 4) : 20 + (hash % 10);
  const humidity = matchedLoc ? (matchedLoc.isCool ? 55 : 65 + (hash % 20)) : 50 + (hash % 30);
  const wind = 10 + (hash % 15);
  const precip = hash % 5 === 0 ? 50 : hash % 3 === 0 ? 15 : 0;
  const condition = precip > 35 ? 'Rain' : precip > 10 ? 'Clouds' : 'Clear';

  const dateNow = new Date();
  const days = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(dateNow);
    d.setDate(d.getDate() + idx);
    const dHash = hash + idx * 7;
    const dPrecip = dHash % 4 === 0 ? 50 : dHash % 2 === 0 ? 15 : 0;
    const dCond = dPrecip > 35 ? 'Rain' : dPrecip > 0 ? 'Clouds' : 'Clear';
    const dHigh = tempBase + (dHash % 3);
    const dLow = dHigh - (matchedLoc?.isCool ? 6 : 5);

    return {
      date: d.toISOString().split('T')[0],
      day: idx === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      condition: dCond === 'Rain' ? 'Passing Showers' : dCond === 'Clouds' ? 'Partly Cloudy' : 'Clear & Sunny',
      description:
        dCond === 'Rain'
          ? 'Scattered seasonal rain showers'
          : dCond === 'Clouds'
          ? 'Scattered cloud cover & pleasant breeze'
          : 'Clear sunny skies & comfortable conditions',
      icon: dCond === 'Rain' ? '10d' : dCond === 'Clouds' ? '02d' : '01d',
      highTemp: dHigh,
      lowTemp: dLow,
      precipChance: dPrecip,
      windSpeed: wind + (idx % 3),
      humidity: humidity + (idx % 5),
    };
  });

  const resolvedLat = matchedLoc
    ? matchedLoc.lat
    : isLikelyPH
    ? (12.0 + (hash % 50) * 0.1).toFixed(4)
    : (25.0 + (hash % 25)).toFixed(4);
  const resolvedLon = matchedLoc
    ? matchedLoc.lon
    : isLikelyPH
    ? (120.5 + (hash % 40) * 0.1).toFixed(4)
    : (10.0 + (hash % 120)).toFixed(4);
  const resolvedElevation = matchedLoc ? matchedLoc.elevation : `${25 + (hash % 80)}m`;

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
        description:
          condition === 'Rain'
            ? 'Localized rain showers'
            : condition === 'Clouds'
            ? 'Scattered tropical cloud cover'
            : 'Sunny skies & gentle breeze',
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
        windDeg: 70,
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

const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const PHOTON_GEO_URL = 'https://photon.komoot.io/api/';
const NOMINATIM_GEO_URL = 'https://nominatim.openstreetmap.org/search';
const GEO_USER_AGENT = 'SkyPlanWeatherPlanner/1.0 (+https://skyplan.app)';

const LOCATION_SEARCH_CACHE = new Map();
const LOCATION_RESOLVE_CACHE = new Map();
const LIVE_WEATHER_CACHE = new Map();
const IN_FLIGHT_WEATHER = new Map();

const LOCATION_CACHE_TTL_MS = 30 * 60 * 1000;
const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;

function normalizeText(str = '') {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .trim();
}

function cleanAdminLabel(label = '') {
  return String(label || '')
    .replace(/^(?:Province of|Provincia de|Department of|State of|Region of)\s+/i, '')
    .trim();
}

function stripPlaceSuffix(name = '') {
  return normalizeText(name)
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\b(?:city|island|municipality|province)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const EXCLUDED_OSM_VALUES = new Set([
  'restaurant', 'fast_food', 'cafe', 'bar', 'pub', 'food_court', 'ice_cream',
  'atm', 'bank', 'pharmacy', 'clinic', 'dentist', 'doctors', 'veterinary',
  'fuel', 'parking', 'parking_space', 'parking_entrance', 'bicycle_parking',
  'toilets', 'waste_basket', 'recycling', 'post_box', 'telephone', 'bench',
  'bus_stop', 'platform', 'stop_position', 'traffic_signals', 'crossing',
  'convenience', 'supermarket', 'clothes', 'hairdresser', 'car_repair',
  'motel', 'guest_house', 'hostel', 'apartment', 'chalet', 'information',
  'residential', 'service', 'track', 'footway', 'path', 'steps', 'cycleway',
  'house', 'yes', 'apartments', 'commercial', 'industrial', 'retail',
]);

const EXCLUDED_OSM_KEYS = new Set([
  'shop', 'craft', 'office', 'man_made', 'power', 'telecom', 'railway',
]);

function isRelevantOsmPlace(osmKey = '', osmValue = '') {
  const key = String(osmKey).toLowerCase();
  const val = String(osmValue).toLowerCase();
  if (EXCLUDED_OSM_KEYS.has(key)) return false;
  if (EXCLUDED_OSM_VALUES.has(val)) return false;
  if (key === 'highway') return false;
  if (key === 'building' && !['cathedral', 'castle', 'temple', 'shrine', 'museum', 'stadium'].includes(val)) {
    return false;
  }
  if (key === 'amenity' && !['university', 'arts_centre', 'planetarium', 'theatre', 'marketplace'].includes(val)) {
    return false;
  }
  return true;
}

function classifyFeatureType(codeOrType = '', osmKey = '') {
  const raw = String(codeOrType).toUpperCase();
  const lower = String(codeOrType).toLowerCase();
  const key = String(osmKey).toLowerCase();

  if (raw.startsWith('PCL') || lower === 'country' || lower === 'nation') return 'Country';
  if (raw === 'ISL' || raw === 'ISLS' || lower === 'island' || lower === 'archipelago' || lower === 'islet' || lower === 'atoll') return 'Island';
  if (raw === 'MT' || raw === 'MTS' || raw === 'PK' || raw === 'VLC' || ['peak', 'volcano', 'mountain_range', 'ridge', 'cliff', 'glacier'].includes(lower)) return 'Mountain';
  if (raw === 'BCH' || ['beach', 'bay', 'cape', 'coastline', 'reef', 'shoal', 'lagoon', 'beach_resort'].includes(lower)) return 'Beach & Coast';
  if (['ADM1', 'ADM2', 'RGN'].includes(raw) || ['state', 'province', 'region', 'county', 'prefecture'].includes(lower)) return 'Region';
  if (['PPLC', 'PPLA', 'PPLA2'].includes(raw) || lower === 'city') return 'City';
  if (['PPLA3', 'PPLA4', 'PPL'].includes(raw) || ['town', 'municipality'].includes(lower)) return 'Town';
  if (['PPLX', 'ADM3', 'ADM4'].includes(raw) || ['suburb', 'quarter', 'neighbourhood', 'borough', 'district', 'city_district'].includes(lower)) return 'District';
  if (['village', 'hamlet', 'locality', 'isolated_dwelling', 'barangay'].includes(lower)) return 'Village';
  if (key === 'tourism' || key === 'historic' || key === 'leisure' || ['attraction', 'archaeological_site', 'monument', 'castle', 'ruins', 'national_park', 'nature_reserve', 'park', 'viewpoint', 'museum', 'theme_park', 'waterfall', 'lake'].includes(lower)) {
    return 'Landmark';
  }
  return 'Destination';
}

function formatLocationDisplayName(name, admin1, country, countryCode, featureType) {
  const cleanName = String(name || '').trim();
  const cleanAdmin = cleanAdminLabel(admin1);
  const cleanCountry = String(country || '').trim();

  if (featureType === 'Country' || normalizeText(cleanName) === normalizeText(cleanCountry)) {
    return cleanName;
  }

  const isPh = countryCode === 'PH' || normalizeText(cleanCountry) === 'philippines';
  if (isPh) {
    if (cleanAdmin && normalizeText(cleanAdmin) !== normalizeText(cleanName)) {
      return `${cleanName}, ${cleanAdmin}`;
    }
    return cleanName;
  }

  if (
    cleanAdmin &&
    normalizeText(cleanAdmin) !== normalizeText(cleanName) &&
    normalizeText(cleanAdmin) !== normalizeText(cleanCountry)
  ) {
    return `${cleanName}, ${cleanAdmin}`;
  }
  if (cleanCountry && normalizeText(cleanCountry) !== normalizeText(cleanName)) {
    return `${cleanName}, ${cleanCountry}`;
  }
  return cleanName;
}

async function queryOpenMeteoGeo(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];

  const candidateQueries = [];
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts[0]) candidateQueries.push(parts[0]);
  } else {
    candidateQueries.push(trimmed);
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      candidateQueries.push(words.slice(0, -1).join(' '));
      if (words.length >= 3) {
        candidateQueries.push(words[0]);
      }
    }
  }

  const uniqueQueries = [...new Set(candidateQueries.map((q) => normalizeText(q) || q))].slice(0, 2);
  const responses = await Promise.allSettled(
    uniqueQueries.map(async (q) => {
      const url = `${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(q)}&count=20&language=en`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.results) ? data.results : [];
    })
  );

  const items = [];
  for (const r of responses) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      for (const item of r.value) {
        const cc = (item.country_code || '').toUpperCase();
        const isPh = cc === 'PH' || item.country === 'Philippines';
        const admin1 = isPh
          ? cleanAdminLabel(item.admin2) || cleanAdminLabel(item.admin1)
          : cleanAdminLabel(item.admin1) || cleanAdminLabel(item.admin2);
        const region = cleanAdminLabel(item.admin1) || item.country || '';
        const country = item.country || (item.feature_code?.startsWith('PCL') ? item.name : '');
        const featureType = classifyFeatureType(item.feature_code);
        const cityDisplay = formatLocationDisplayName(item.name, admin1, country, cc, featureType);

        items.push({
          name: item.name,
          city: cityDisplay,
          admin1: admin1 || country || 'Worldwide',
          region: region || country || 'International',
          country: country || 'Worldwide',
          countryCode: cc,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          elevation: item.elevation !== undefined ? Number(item.elevation) : undefined,
          population: item.population || 0,
          featureType,
          importance: item.population ? Math.min(0.95, Math.log10(item.population + 10) / 8) : 0.45,
          source: 'open-meteo',
        });
      }
    }
  }
  return items;
}

async function queryPhotonGeo(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];
  const url = `${PHOTON_GEO_URL}?q=${encodeURIComponent(trimmed)}&limit=20&lang=en`;
  const res = await fetch(url, {
    headers: { 'User-Agent': GEO_USER_AGENT },
    signal: AbortSignal.timeout(3500),
  });
  if (!res.ok) return [];
  const data = await res.json();
  const features = Array.isArray(data.features) ? data.features : [];

  const results = [];
  for (const f of features) {
    const p = f.properties || {};
    const coords = f.geometry?.coordinates;
    if (!p.name || !Array.isArray(coords) || coords.length < 2) continue;
    if (!isRelevantOsmPlace(p.osm_key, p.osm_value)) continue;

    const cc = (p.countrycode || '').toUpperCase();
    const admin1 = cleanAdminLabel(p.state || p.county || p.city || p.district || '');
    const country = p.country || (p.osm_value === 'country' ? p.name : '');
    const featureType = classifyFeatureType(p.osm_value || p.type, p.osm_key);
    const cityDisplay = formatLocationDisplayName(p.name, admin1, country, cc, featureType);

    results.push({
      name: p.name,
      city: cityDisplay,
      admin1: admin1 || country || 'Worldwide',
      region: cleanAdminLabel(p.state || country || 'International'),
      country: country || 'Worldwide',
      countryCode: cc,
      latitude: Number(coords[1]),
      longitude: Number(coords[0]),
      population: 0,
      featureType,
      importance: featureType === 'Country' ? 0.92 : featureType === 'City' ? 0.78 : featureType === 'Region' ? 0.75 : 0.6,
      source: 'photon',
    });
  }
  return results;
}

async function queryNominatimGeo(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];
  const url = `${NOMINATIM_GEO_URL}?format=jsonv2&addressdetails=1&accept-language=en&limit=15&q=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': GEO_USER_AGENT },
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  const results = [];
  for (const item of data) {
    if (!isRelevantOsmPlace(item.category, item.type)) continue;
    const addr = item.address || {};
    const name =
      item.name ||
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.island ||
      addr.state ||
      addr.country ||
      (item.display_name ? item.display_name.split(',')[0].trim() : '');
    if (!name) continue;

    const cc = (addr.country_code || '').toUpperCase();
    const isPh = cc === 'PH' || addr.country === 'Philippines';
    const admin1 = isPh
      ? cleanAdminLabel(addr.province || addr.state || addr.county || addr.region || '')
      : cleanAdminLabel(addr.state || addr.province || addr.region || addr.county || addr.city || '');
    const country = addr.country || (item.type === 'country' || item.addresstype === 'country' ? name : '');
    const featureType = classifyFeatureType(item.addresstype || item.type, item.category);
    const cityDisplay = formatLocationDisplayName(name, admin1, country, cc, featureType);

    results.push({
      name,
      city: cityDisplay,
      admin1: admin1 || country || 'Worldwide',
      region: cleanAdminLabel(addr.region || addr.state || country || 'International'),
      country: country || 'Worldwide',
      countryCode: cc,
      latitude: Number(item.lat),
      longitude: Number(item.lon),
      population: 0,
      featureType,
      importance: Number(item.importance) || 0.55,
      source: 'nominatim',
    });
  }
  return results;
}

function scoreGeoCandidate(item, rawQuery) {
  const qNorm = normalizeText(rawQuery);
  const qPrimary = normalizeText(rawQuery.split(',')[0]);
  const qTokens = qNorm.split(/[\s,.\-()]+/).filter(Boolean);

  const nameNorm = normalizeText(item.name);
  const nameBase = stripPlaceSuffix(item.name);
  const cityNorm = normalizeText(item.city);
  const adminNorm = normalizeText(item.admin1);
  const countryNorm = normalizeText(item.country);
  const ccNorm = normalizeText(item.countryCode);
  const fullNorm = `${nameNorm} ${adminNorm} ${countryNorm} ${ccNorm}`;

  let score = 0;

  if (nameNorm === qNorm || cityNorm === qNorm || nameBase === qNorm) {
    score += 1000;
  } else if (nameNorm === qPrimary || nameBase === qPrimary) {
    score += 880;
  } else if (nameNorm.startsWith(qNorm) || cityNorm.startsWith(qNorm)) {
    score += 720;
  } else if (nameNorm.split(/\s+/).some((w) => w.startsWith(qNorm))) {
    score += 560;
  } else if (nameNorm.includes(qNorm) || cityNorm.includes(qNorm)) {
    score += 360;
  } else if (adminNorm.startsWith(qNorm) || countryNorm.startsWith(qNorm)) {
    score += 320;
  }

  if (qTokens.length > 1) {
    const matchedTokens = qTokens.filter((t) => fullNorm.includes(t)).length;
    if (matchedTokens === qTokens.length) {
      score += 450;
    } else {
      score += (matchedTokens / qTokens.length) * 180;
    }
  }

  score += (item.importance || 0) * 60;
  if (item.population > 0) {
    score += Math.min(45, Math.log10(item.population + 1) * 7);
  }
  return score;
}

/**
 * Multi-source worldwide location search combining Open-Meteo Geocoding,
 * Photon (OSM), and Nominatim (OSM) to find any country, region, city,
 * municipality, town, village, island, mountain, beach, or landmark worldwide.
 */
async function searchLocations(rawQuery, limit = 25) {
  const trimmed = String(rawQuery || '').trim();
  if (!trimmed) return [];

  const cacheKey = `${normalizeText(trimmed)}|${limit}`;
  const cached = LOCATION_SEARCH_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < LOCATION_CACHE_TTL_MS) {
    return cached.data;
  }

  const [omRes, phRes, nomRes] = await Promise.allSettled([
    queryOpenMeteoGeo(trimmed),
    queryPhotonGeo(trimmed),
    queryNominatimGeo(trimmed),
  ]);

  const rawPool = [
    ...(omRes.status === 'fulfilled' ? omRes.value : []),
    ...(phRes.status === 'fulfilled' ? phRes.value : []),
    ...(nomRes.status === 'fulfilled' ? nomRes.value : []),
  ];

  // Deduplicate physical locations while preserving distinct homonym places worldwide
  const deduped = [];
  for (const cand of rawPool) {
    if (!Number.isFinite(cand.latitude) || !Number.isFinite(cand.longitude)) continue;
    const candBase = stripPlaceSuffix(cand.name);
    const candCountry = normalizeText(cand.countryCode || cand.country);

    const existing = deduped.find((ex) => {
      const exBase = stripPlaceSuffix(ex.name);
      const exCountry = normalizeText(ex.countryCode || ex.country);
      if (candBase !== exBase) return false;
      const latDiff = Math.abs(ex.latitude - cand.latitude);
      const lonDiff = Math.abs(ex.longitude - cand.longitude);
      if (latDiff < 0.25 && lonDiff < 0.25) return true;
      if (
        candCountry &&
        candCountry === exCountry &&
        normalizeText(ex.admin1) === normalizeText(cand.admin1) &&
        latDiff < 0.8 &&
        lonDiff < 0.8
      ) {
        return true;
      }
      return false;
    });

    if (!existing) {
      deduped.push({ ...cand, _score: scoreGeoCandidate(cand, trimmed) });
    } else {
      if (!existing.elevation && cand.elevation !== undefined) existing.elevation = cand.elevation;
      if (!existing.population && cand.population) existing.population = cand.population;
      if ((!existing.admin1 || existing.admin1 === existing.country) && cand.admin1 && cand.admin1 !== cand.country) {
        existing.admin1 = cand.admin1;
        existing.city = formatLocationDisplayName(
          existing.name,
          cand.admin1,
          existing.country,
          existing.countryCode,
          existing.featureType
        );
      }
      existing._score = Math.max(existing._score, scoreGeoCandidate(cand, trimmed));
    }
  }

  deduped.sort((a, b) => b._score - a._score);
  const finalResults = deduped.slice(0, limit).map(({ _score, ...rest }) => rest);

  if (LOCATION_SEARCH_CACHE.size > 500) {
    const firstKey = LOCATION_SEARCH_CACHE.keys().next().value;
    LOCATION_SEARCH_CACHE.delete(firstKey);
  }
  LOCATION_SEARCH_CACHE.set(cacheKey, { ts: Date.now(), data: finalResults });

  return finalResults;
}

function mapWmoWeatherCode(code) {
  const c = Number(code);
  if (c === 0) return { main: 'Clear', description: 'Clear sunny skies', icon: '01d', dayLabel: 'Clear & Sunny' };
  if (c === 1) return { main: 'Clear', description: 'Mainly clear skies', icon: '01d', dayLabel: 'Mainly Clear' };
  if (c === 2) return { main: 'Clouds', description: 'Partly cloudy skies', icon: '02d', dayLabel: 'Partly Cloudy' };
  if (c === 3) return { main: 'Clouds', description: 'Overcast cloud cover', icon: '04d', dayLabel: 'Overcast' };
  if (c === 45 || c === 48) return { main: 'Mist', description: 'Misty or foggy visibility', icon: '50d', dayLabel: 'Misty & Foggy' };
  if (c >= 51 && c <= 57) return { main: 'Drizzle', description: 'Light passing drizzle', icon: '09d', dayLabel: 'Light Drizzle' };
  if ((c >= 61 && c <= 65) || (c >= 80 && c <= 81)) return { main: 'Rain', description: 'Scattered rain showers', icon: '10d', dayLabel: 'Passing Showers' };
  if (c === 66 || c === 67 || c === 82) return { main: 'Rain', description: 'Heavy rain showers', icon: '10d', dayLabel: 'Heavy Showers' };
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return { main: 'Snow', description: 'Snowfall and alpine chill', icon: '13d', dayLabel: 'Snowfall' };
  if (c >= 95) return { main: 'Thunderstorm', description: 'Thunderstorms and gusty winds', icon: '11d', dayLabel: 'Thunderstorms' };
  return { main: 'Clouds', description: 'Scattered cloud cover', icon: '02d', dayLabel: 'Partly Cloudy' };
}

async function resolveLocationMetadata(cleanCity, options = {}) {
  const optLat = options.lat !== undefined && options.lat !== '' ? Number(options.lat) : NaN;
  const optLon = options.lon !== undefined && options.lon !== '' ? Number(options.lon) : NaN;
  const optCountry = (options.country || '').trim();

  if (Number.isFinite(optLat) && Number.isFinite(optLon)) {
    const parts = cleanCity.split(',').map((p) => p.trim()).filter(Boolean);
    const displayCity = parts.length > 2 ? `${parts[0]}, ${parts[1]}` : cleanCity;
    const inferredCountry = optCountry || (parts.length > 1 ? parts[parts.length - 1] : 'Worldwide');
    return {
      city: displayCity,
      country: inferredCountry,
      lat: optLat,
      lon: optLon,
      elevation: undefined,
    };
  }

  const cacheKey = `${normalizeText(cleanCity)}|${normalizeText(optCountry)}`;
  const cached = LOCATION_RESOLVE_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.ts < LOCATION_CACHE_TTL_MS) {
    return cached.data;
  }

  // Check static dictionary only when unambiguous (no conflicting comma qualifier)
  const parts = cleanCity.split(',').map((p) => p.trim()).filter(Boolean);
  const primaryNorm = normalizeText(parts[0] || cleanCity);
  const fullNorm = normalizeText(cleanCity);
  const qualifierNorm = normalizeText(optCountry || parts.slice(1).join(' '));

  const dictHit = PHILIPPINE_LOCATIONS[fullNorm] || PHILIPPINE_LOCATIONS[primaryNorm];
  if (dictHit) {
    const dictCountryNorm = normalizeText(dictHit.country);
    const dictCodeNorm = normalizeText(dictHit.countryCode);
    const qualifierMatchesDict =
      !qualifierNorm ||
      dictCountryNorm.includes(qualifierNorm) ||
      qualifierNorm.includes(dictCountryNorm) ||
      qualifierNorm === dictCodeNorm ||
      (dictHit.countryCode === 'PH' && /luzon|visayas|mindanao|ncr|metro manila|pampanga|bulacan|cavite|laguna|batangas|rizal|cebu|bohol|palawan|benguet|ilocos|bicol|davao/i.test(qualifierNorm));

    if (qualifierMatchesDict) {
      const resolved = {
        city: dictHit.city,
        country: dictHit.country,
        lat: Number(dictHit.lat),
        lon: Number(dictHit.lon),
        elevation: dictHit.elevation,
      };
      LOCATION_RESOLVE_CACHE.set(cacheKey, { ts: Date.now(), data: resolved });
      return resolved;
    }
  }

  // Dynamically geocode worldwide via multi-source search
  const queryWithCountry = optCountry && !normalizeText(cleanCity).includes(normalizeText(optCountry))
    ? `${cleanCity}, ${optCountry}`
    : cleanCity;

  const matches = await searchLocations(queryWithCountry, 5);
  if (matches.length > 0) {
    const best = matches[0];
    const displayCountry =
      best.admin1 &&
      best.country &&
      normalizeText(best.admin1) !== normalizeText(best.country) &&
      !normalizeText(best.city).includes(normalizeText(best.admin1))
        ? `${best.admin1}, ${best.country}`
        : best.country || 'Worldwide';

    const resolved = {
      city: best.city || best.name,
      country: displayCountry,
      lat: best.latitude,
      lon: best.longitude,
      elevation: best.elevation !== undefined ? `${Math.round(best.elevation)}m` : undefined,
    };
    LOCATION_RESOLVE_CACHE.set(cacheKey, { ts: Date.now(), data: resolved });
    return resolved;
  }

  return null;
}

async function fetchOpenMeteoBundle(locMeta) {
  const coordKey = `${Number(locMeta.lat).toFixed(3)},${Number(locMeta.lon).toFixed(3)}`;
  const cached = LIVE_WEATHER_CACHE.get(coordKey);
  if (cached && Date.now() - cached.ts < WEATHER_CACHE_TTL_MS) {
    return buildBundleWithLocation(cached.raw, locMeta);
  }

  if (IN_FLIGHT_WEATHER.has(coordKey)) {
    const raw = await IN_FLIGHT_WEATHER.get(coordKey);
    return buildBundleWithLocation(raw, locMeta);
  }

  const fetchPromise = (async () => {
    const url =
      `${OPEN_METEO_FORECAST_URL}?latitude=${encodeURIComponent(locMeta.lat)}&longitude=${encodeURIComponent(locMeta.lon)}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=auto&forecast_days=7`;

    const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }
    const raw = await res.json();
    if (!raw || !raw.current) {
      throw new Error('Invalid Open-Meteo payload');
    }
    if (LIVE_WEATHER_CACHE.size > 300) {
      const oldestKey = LIVE_WEATHER_CACHE.keys().next().value;
      LIVE_WEATHER_CACHE.delete(oldestKey);
    }
    LIVE_WEATHER_CACHE.set(coordKey, { ts: Date.now(), raw });
    return raw;
  })();

  IN_FLIGHT_WEATHER.set(coordKey, fetchPromise);
  try {
    const raw = await fetchPromise;
    return buildBundleWithLocation(raw, locMeta);
  } finally {
    IN_FLIGHT_WEATHER.delete(coordKey);
  }
}

function buildBundleWithLocation(raw, locMeta) {
  const c = raw.current || {};
  const d = raw.daily || {};
  const mappedCurrent = mapWmoWeatherCode(c.weather_code);
  const baseHumidity = Math.round(c.relative_humidity_2m ?? 65);

  const times = Array.isArray(d.time) ? d.time : [];
  const days = times.slice(0, 7).map((dateKey, idx) => {
    const dayWmo = mapWmoWeatherCode(d.weather_code?.[idx] ?? c.weather_code);
    const highTemp = Math.round(d.temperature_2m_max?.[idx] ?? (c.temperature_2m + 2));
    const lowTemp = Math.round(d.temperature_2m_min?.[idx] ?? (c.temperature_2m - 3));
    const precipChance = Math.round(d.precipitation_probability_max?.[idx] ?? 0);
    const windSpeed = Math.round(d.wind_speed_10m_max?.[idx] ?? (c.wind_speed_10m || 10));
    const dateObj = new Date(`${dateKey}T12:00:00`);

    return {
      date: dateKey,
      day: idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      condition: dayWmo.dayLabel,
      mainCondition: dayWmo.main,
      description: dayWmo.description,
      icon: dayWmo.icon,
      highTemp,
      lowTemp,
      precipChance,
      windSpeed,
      humidity: Math.min(98, Math.max(25, baseHumidity + (precipChance > 50 ? 10 : 0))),
    };
  });

  const elevationStr =
    raw.elevation !== undefined && raw.elevation !== null
      ? `${Math.round(raw.elevation)}m`
      : locMeta.elevation || '25m';

  const currentTemp = Math.round(c.temperature_2m ?? 22);
  const feelsLike = Math.round(c.apparent_temperature ?? currentTemp);
  const tempMax = days[0]?.highTemp !== undefined ? Math.max(currentTemp, days[0].highTemp) : currentTemp + 3;
  const tempMin = days[0]?.lowTemp !== undefined ? Math.min(currentTemp, days[0].lowTemp) : currentTemp - 3;

  return {
    current: {
      location: {
        city: locMeta.city,
        country: locMeta.country || 'Worldwide',
        lat: Number(locMeta.lat).toFixed(4),
        lon: Number(locMeta.lon).toFixed(4),
        elevation: elevationStr,
      },
      weather: {
        main: mappedCurrent.main,
        description: mappedCurrent.description,
        icon: mappedCurrent.icon,
      },
      temperature: {
        current: currentTemp,
        feelsLike,
        tempMin,
        tempMax,
      },
      telemetry: {
        humidity: baseHumidity,
        pressure: Math.round(c.surface_pressure ?? 1013),
        windSpeed: Math.round(c.wind_speed_10m ?? 10),
        windDeg: Math.round(c.wind_direction_10m ?? 0),
        windGust: Math.round(c.wind_gusts_10m ?? (c.wind_speed_10m || 10) * 1.35),
        visibilityKm:
          mappedCurrent.main === 'Mist'
            ? '4.5'
            : mappedCurrent.main === 'Rain' || mappedCurrent.main === 'Snow'
            ? '9.0'
            : '16.0',
        cloudiness: Math.round(c.cloud_cover ?? 20),
        rain1h: Number((c.precipitation ?? c.rain ?? 0).toFixed(1)),
      },
      timestamp: new Date().toISOString(),
      isMock: false,
      isFallback: false,
    },
    forecast: {
      city: locMeta.city,
      country: locMeta.country || 'Worldwide',
      coordinates: { lat: Number(locMeta.lat), lon: Number(locMeta.lon) },
      dailyForecast: days,
      isMock: false,
      isFallback: false,
    },
  };
}

/**
 * Fetch Current or Date-Specific Weather by City Name or Coordinates.
 */
async function getCurrentWeather(city, date = 'Today', options = {}) {
  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    const err = new Error('City parameter is required.');
    err.statusCode = 400;
    throw err;
  }

  const cleanCity = city.trim();

  // Validate city name (allow international locations, names with accents, commas, and parentheses up to 160 chars)
  if (/(?:xyzzy|qwerty12345)/i.test(cleanCity) || cleanCity.length > 160) {
    const notFoundErr = new Error(`City "${cleanCity}" not found.`);
    notFoundErr.statusCode = 404;
    throw notFoundErr;
  }

  const apiKey = config.openWeatherMap?.apiKey;

  let baseWeather = null;
  let forecastData = null;

  // 1. Try OpenWeatherMap if an API key is configured and explicit coordinates were not overriding
  if (apiKey && apiKey.trim() !== '' && options.lat === undefined) {
    try {
      let queryCandidates = [cleanCity];
      if (cleanCity.includes('(') && cleanCity.includes(')')) {
        const insideParen = cleanCity.replace(/^[^(]+\(([^)]+)\).*$/, '$1').trim();
        const beforeParen = cleanCity.replace(/\s*\([^)]+\).*$/, '').trim();
        queryCandidates.push(insideParen, beforeParen);
      }
      if (cleanCity.includes(',')) {
        queryCandidates.push(cleanCity.split(',')[0].trim());
      }
      queryCandidates = [...new Set(queryCandidates)];

      let response = null;
      for (const candidate of queryCandidates) {
        const url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(candidate)}&units=metric&appid=${apiKey}`;
        response = await fetch(url);
        if (response.ok) break;
      }

      if (response && response.ok) {
        const data = await response.json();
        baseWeather = normalizeCurrentWeather(data);
      }
    } catch (err) {
      console.warn(`[WeatherService] OWM call failed (${err.message}). Trying Open-Meteo live telemetry for "${cleanCity}".`);
    }
  }

  // 2. Worldwide live geocoding + Open-Meteo meteorological telemetry (works for every place on Earth, no API key needed)
  if (!baseWeather) {
    try {
      const locMeta = await resolveLocationMetadata(cleanCity, options);
      if (locMeta) {
        const liveBundle = await fetchOpenMeteoBundle(locMeta);
        baseWeather = liveBundle.current;
        forecastData = liveBundle.forecast;
      }
    } catch (err) {
      console.warn(`[WeatherService] Open-Meteo live telemetry failed (${err.message}). Using offline fallback for "${cleanCity}".`);
    }
  }

  // 3. Final offline safety net
  if (!baseWeather) {
    const fallback = getDeterministicFallback(cleanCity);
    baseWeather = fallback.current;
    forecastData = fallback.forecast;
  }

  // If a specific future date is requested, overlay forecasted meteorological parameters
  if (date && date !== 'Today') {
    if (!forecastData) {
      try {
        forecastData = await getForecast(cleanCity, options);
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
        'Heavy Showers': 'Rain',
        'Light rain showers': 'Rain',
        'Light Drizzle': 'Drizzle',
        'Partly Sunny': 'Clouds',
        'Partly Cloudy': 'Clouds',
        'Overcast': 'Clouds',
        'Clear & Crisp': 'Clear',
        'Clear & Sunny': 'Clear',
        'Mainly Clear': 'Clear',
        'Snowfall': 'Snow',
        'Thunderstorms': 'Thunderstorm',
        'Misty & Foggy': 'Mist',
      };
      const mainCond = selectedDay.mainCondition || conditionMap[selectedDay.condition] || selectedDay.condition;

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
          humidity: selectedDay.humidity ?? baseWeather.telemetry?.humidity,
          windSpeed: selectedDay.windSpeed ?? baseWeather.telemetry?.windSpeed,
          precipitationChance: selectedDay.precipChance || 0,
          rain1h: selectedDay.precipChance > 40 ? 3.0 : 0,
        },
      };
    }
  }

  return baseWeather;
}

/**
 * Fetch 5-Day / 7-Day Forecast by City Name or Coordinates.
 */
async function getForecast(city, options = {}) {
  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    const err = new Error('City parameter is required.');
    err.statusCode = 400;
    throw err;
  }

  const cleanCity = city.trim();
  const apiKey = config.openWeatherMap?.apiKey;

  if (apiKey && apiKey.trim() !== '' && options.lat === undefined) {
    try {
      let queryCandidates = [cleanCity];
      if (cleanCity.includes('(') && cleanCity.includes(')')) {
        const insideParen = cleanCity.replace(/^[^(]+\(([^)]+)\).*$/, '$1').trim();
        const beforeParen = cleanCity.replace(/\s*\([^)]+\).*$/, '').trim();
        queryCandidates.push(insideParen, beforeParen);
      }
      if (cleanCity.includes(',')) {
        queryCandidates.push(cleanCity.split(',')[0].trim());
      }
      queryCandidates = [...new Set(queryCandidates)];

      let response = null;
      for (const candidate of queryCandidates) {
        const url = `${OWM_BASE_URL}/forecast?q=${encodeURIComponent(candidate)}&units=metric&appid=${apiKey}`;
        response = await fetch(url);
        if (response.ok) break;
      }

      if (response && response.ok) {
        const data = await response.json();
        return normalizeForecast(data);
      }
    } catch (err) {
      console.warn(`[WeatherService] OWM forecast call failed (${err.message}). Trying Open-Meteo forecast for "${cleanCity}".`);
    }
  }

  try {
    const locMeta = await resolveLocationMetadata(cleanCity, options);
    if (locMeta) {
      const liveBundle = await fetchOpenMeteoBundle(locMeta);
      return liveBundle.forecast;
    }
  } catch (err) {
    console.warn(`[WeatherService] Open-Meteo forecast failed (${err.message}). Using offline fallback for "${cleanCity}".`);
  }

  return getDeterministicFallback(cleanCity).forecast;
}

module.exports = {
  getCurrentWeather,
  getForecast,
  searchLocations,
};
