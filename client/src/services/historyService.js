import apiClient from './apiClient';

export const historyService = {
  getSearchHistory: async (limit = 20) => {
    const response = await apiClient.get(`/history?limit=${limit}`);
    return response.data?.history || (Array.isArray(response.data) ? response.data : []);
  },

  clearSearchHistory: async () => {
    const response = await apiClient.delete('/history');
    return response.data;
  },
};

export default historyService;
