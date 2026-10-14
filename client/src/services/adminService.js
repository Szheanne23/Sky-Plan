import apiClient from './apiClient';

export const adminService = {
  getAnalytics: async () => {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },

  getRules: async () => {
    const response = await apiClient.get('/admin/rules');
    return response.data?.rules || (Array.isArray(response.data) ? response.data : []);
  },

  updateRule: async (id, data) => {
    const payload = {
      isActive: data.is_active !== undefined ? data.is_active : data.isActive,
      ...data,
    };
    const response = await apiClient.put(`/admin/rules/${id}`, payload);
    return response.data?.rule || response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data?.users || (Array.isArray(response.data) ? response.data : []);
  },
};

export default adminService;
