import apiClient from './apiClient';

export const recommendationService = {
  getRecommendations: async (city = 'Manila', date = 'Today') => {
    const params = new URLSearchParams({ city, date });
    const response = await apiClient.get(`/recommendations?${params.toString()}`);
    return response.data;
  },
};

export default recommendationService;
