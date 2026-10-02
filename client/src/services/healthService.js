import apiClient from './apiClient';

/**
 * Health check service to verify backend API connectivity.
 */
export const healthService = {
  /**
   * Fetches backend health check status.
   * @returns {Promise<{ success: boolean, data: object, message: string }>}
   */
  checkHealth: async () => {
    return apiClient.get('/health');
  },
};

export default healthService;
