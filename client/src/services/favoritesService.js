import apiClient from './apiClient';

export const favoritesService = {
  getFavorites: async () => {
    const response = await apiClient.get('/favorites');
    return response.data?.favorites || (Array.isArray(response.data) ? response.data : []);
  },

  addFavorite: async (cityName, country = 'Global Region') => {
    const response = await apiClient.post('/favorites', { cityName, country, countryCode: country });
    return response.data?.favorite || response.data;
  },

  removeFavorite: async (id) => {
    const response = await apiClient.delete(`/favorites/${id}`);
    return response.data?.removedId || response.data;
  },
};

export default favoritesService;
