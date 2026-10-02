import apiClient from './apiClient';

export const adminService = {
  getAnalytics: async () => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },

  getRules: async () => {
    const response = await apiClient.get('/admin/rules');
    return response.data;
  },

  updateRule: async (id, data) => {
    const response = await apiClient.put(`/admin/rules/${id}`, data);
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
};

export default adminService;
