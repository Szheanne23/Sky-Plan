import apiClient from './apiClient';

export const weatherService = {
  getCurrentWeather: async (city = 'Interlaken', date = 'Today') => {
    const params = new URLSearchParams({ city, date });
    const response = await apiClient.get(`/weather/current?${params.toString()}`);
    return response.data;
  },

  getForecast: async (city = 'Interlaken') => {
    const params = new URLSearchParams({ city });
    const response = await apiClient.get(`/weather/forecast?${params.toString()}`);
    return response.data;
  },
};

export default weatherService;
