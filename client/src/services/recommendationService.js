import apiClient from './apiClient';

export const recommendationService = {
  getRecommendations: async (city = 'Manila', date = 'Today', options = {}) => {
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
    const response = await apiClient.get(`/recommendations?${params.toString()}`);
    return response.data;
  },
};

export default recommendationService;
