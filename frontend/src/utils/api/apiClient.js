// src/utils/api/apiClient.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://api.cryptosuite.online/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Add token to headers if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (only in development)
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response (only in development)
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      console.error(`❌ API Error [${status}]:`, data);

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - Token expired or invalid
          console.error('🔒 Unauthorized - Please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to login (optional)
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden
          console.error('🚫 Forbidden - Access denied');
          break;

        case 404:
          // Not Found
          console.error('🔍 Not Found - Resource does not exist');
          break;

        case 500:
          // Server Error
          console.error('💥 Server Error - Please try again later');
          break;

        default:
          console.error('⚠️ Unexpected Error:', data.message || 'Unknown error');
      }

      // Return error data
      return Promise.reject(data);

    } else if (error.request) {
      // Request made but no response received
      console.error('🌐 Network Error - No response from server');
      console.error('Check if backend is running on http://api.cryptosuite.online');
      
      return Promise.reject({
        success: false,
        message: 'Network error - Cannot connect to server. Please check if backend is running.'
      });

    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
      
      return Promise.reject({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
);

export default api;