import apiClient from './apiClient';

export const weatherService = {
  getCurrentWeather: async (city = 'Manila', date = 'Today', options = {}) => {
    const params = new URLSearchParams({ city, date });
    if (options.lat !== undefined && options.lat !== null && options.lat !== '') {
      params.set('lat', String(options.lat));
    }
    if (options.lon !== undefined && options.lon !== null && options.lon !== '') {
      params.set('lon', String(options.lon));
    }
    if (options.country) {
      params.set('country', options.country);
    }
    const response = await apiClient.get(`/weather/current?${params.toString()}`);
    return response.data;
  },

  getForecast: async (city = 'Manila', options = {}) => {
    const params = new URLSearchParams({ city });
    if (options.lat !== undefined && options.lat !== null && options.lat !== '') {
      params.set('lat', String(options.lat));
    }
    if (options.lon !== undefined && options.lon !== null && options.lon !== '') {
      params.set('lon', String(options.lon));
    }
    if (options.country) {
      params.set('country', options.country);
    }
    const response = await apiClient.get(`/weather/forecast?${params.toString()}`);
    return response.data;
  },

  searchLocations: async (query, limit = 25, signal) => {
    if (!query || !query.trim()) return [];
    const params = new URLSearchParams({ q: query.trim(), limit: String(limit) });
    const response = await apiClient.get(`/weather/locations?${params.toString()}`, { signal });
    return Array.isArray(response?.data) ? response.data : [];
  },
};

export default weatherService;
