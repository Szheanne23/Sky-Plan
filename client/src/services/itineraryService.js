import apiClient from './apiClient';

/**
 * Service for Itinerary planning, timeline activity management, and public sharing.
 */
const itineraryService = {
  async getItineraries() {
    const response = await apiClient.get('/itineraries');
    return response.data?.itineraries || [];
  },

  async getItinerary(id) {
    const response = await apiClient.get(`/itineraries/${id}`);
    return response.data || {};
  },

  async createItinerary(payload) {
    const response = await apiClient.post('/itineraries', payload);
    return response.data?.itinerary || response.data;
  },

  async updateItinerary(id, payload) {
    const response = await apiClient.put(`/itineraries/${id}`, payload);
    return response.data?.itinerary || response.data;
  },

  async deleteItinerary(id) {
    const response = await apiClient.delete(`/itineraries/${id}`);
    return response.data;
  },

  async addActivity(itineraryId, activityData) {
    const response = await apiClient.post(`/itineraries/${itineraryId}/activities`, activityData);
    return response.data?.activity || response.data;
  },

  async updateActivity(itineraryId, activityId, activityData) {
    const response = await apiClient.put(`/itineraries/${itineraryId}/activities/${activityId}`, activityData);
    return response.data?.activity || response.data;
  },

  async deleteActivity(itineraryId, activityId) {
    const response = await apiClient.delete(`/itineraries/${itineraryId}/activities/${activityId}`);
    return response.data;
  },

  async shareItinerary(itineraryId) {
    const response = await apiClient.post(`/itineraries/${itineraryId}/share`);
    return response.data;
  },

  async getSharedItinerary(shareCode) {
    const response = await apiClient.get(`/itineraries/shared/${shareCode}`);
    return response.data || {};
  },
};

export default itineraryService;
