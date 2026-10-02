import apiClient from './apiClient';

export const authService = {
  /**
   * Registers a new account.
   * @param {{ email: string, password: string, displayName?: string }} data
   * @returns {Promise<{ success: boolean, data: { user: object, token: string }, message: string }>}
   */
  register: async (data) => {
    return apiClient.post('/auth/register', data);
  },

  /**
   * Authenticates user credentials.
   * @param {{ email: string, password: string }} data
   * @returns {Promise<{ success: boolean, data: { user: object, token: string }, message: string }>}
   */
  login: async (data) => {
    return apiClient.post('/auth/login', data);
  },

  /**
   * Clears the authenticated session.
   * @returns {Promise<{ success: boolean, data: null, message: string }>}
   */
  logout: async () => {
    return apiClient.post('/auth/logout', {});
  },

  /**
   * Retrieves the current authenticated user identity.
   * @returns {Promise<{ success: boolean, data: { user: object }, message: string }>}
   */
  getMe: async () => {
    return apiClient.get('/auth/me');
  },
};

export default authService;
