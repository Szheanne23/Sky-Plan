/**
 * SkyPlan Centralized API Client Layer
 * Handles base URL configuration, headers, JSON encoding/decoding, and centralized error normalization.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');


class ApiError extends Error {
  constructor(message, code = 'API_ERROR', status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Attach Bearer token from localStorage as fallback for cross-domain deployments
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('skyplan_token');
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config = {
    credentials: 'include',
    ...options,
    headers,
  };



  try {
    const response = await fetch(url, config);
    let payload = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      payload = await response.json();
    } else {
      payload = { message: await response.text() };
    }

    if (!response.ok) {
      const errorCode = payload?.error?.code || `HTTP_${response.status}`;
      const errorMessage = payload?.error?.message || payload?.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, errorCode, response.status, payload);
    }

    return payload;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or client-side fetch error
    throw new ApiError(
      err.message || 'Unable to communicate with the SkyPlan backend service.',
      'NETWORK_ERROR',
      0,
      err
    );
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  getBaseUrl: () => API_BASE_URL,
};

export default apiClient;
