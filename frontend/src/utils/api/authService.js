// src/utils/api/authService.js

import apiClient from './apiClient';

/**
 * Authentication Service
 * Contains all auth-related API calls
 */
const authService = {
  /**
   * Register new user
   */
  async register(userData) {
    return await apiClient.post('/auth/register', userData);
  },

  /**
   * Login user
   */
  async login(credentials) {
    return await apiClient.post('/auth/login', credentials);
  },

  /**
   * Logout user
   */
  async logout() {
    return await apiClient.post('/auth/logout');
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return await apiClient.get('/auth/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    return await apiClient.put('/auth/profile', profileData);
  },

  /**
   * Change password
   */
  async changePassword(passwordData) {
    return await apiClient.put('/auth/password', passwordData);
  }
};

export default authService;