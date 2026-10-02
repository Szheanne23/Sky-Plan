import apiClient from './apiClient';

export const profileService = {
  /**
   * Retrieves the current user's profile and selected interest tags.
   */
  getProfile: async () => {
    return apiClient.get('/profile');
  },

  /**
   * Updates the current user's display name.
   * @param {{ displayName: string }} data
   */
  updateProfile: async (data) => {
    return apiClient.put('/profile', data);
  },

  /**
   * Retrieves all active system interest tags (public / authenticated).
   */
  getAllInterests: async () => {
    return apiClient.get('/interests');
  },

  /**
   * Retrieves the current user's selected interest tags.
   */
  getUserInterests: async () => {
    return apiClient.get('/profile/interests');
  },

  /**
   * Replaces/updates the current user's selected interest tag IDs.
   * @param {string[]} interestIds
   */
  updateUserInterests: async (interestIds) => {
    return apiClient.put('/profile/interests', { interestIds });
  },
};

export default profileService;
