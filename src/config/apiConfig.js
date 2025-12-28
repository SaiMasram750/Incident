/**
 * API Configuration
 * Stores the backend base URL for all API calls
 * 
 * Environment Variables:
 * - VITE_API_URL: Backend API URL (set in .env or deployment)
 * 
 * Usage:
 * import { API_URL } from '../config/apiConfig';
 * 
 * Examples:
 * - Local development: http://localhost:3000
 * - Deployed backend: https://your-backend.onrender.com
 */

// Get API URL from environment variable or use localhost as fallback
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Log current API URL (helpful for debugging)
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

/**
 * API Endpoints
 * Centralized endpoint definitions
 */
export const API_ENDPOINTS = {
  // Incidents
  INCIDENTS: '/incidents',
  INCIDENT: (id) => `/incident/${id}`,
  CREATE_INCIDENT: '/incident',
  UPDATE_INCIDENT: (id) => `/incident/${id}`,

  // Auth (if needed)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout'
};

/**
 * Build full API URL
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
export const buildApiUrl = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

/**
 * Default fetch options
 */
export const defaultFetchOptions = {
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Get full URL for an endpoint
 * @param {string} endpoint - Endpoint path
 * @returns {string} Full URL
 */
export const getApiUrl = (endpoint) => {
  return buildApiUrl(endpoint);
};
