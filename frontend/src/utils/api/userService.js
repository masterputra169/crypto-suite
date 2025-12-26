// src/utils/api/userService.js

import apiClient from './apiClient';

/**
 * User Service
 * Contains all user-related API calls
 */
const userService = {
  /**
   * Get user profile by username
   */
  async getUserProfile(username) {
    return await apiClient.get(`/users/${username}`);
  },

  /**
   * Get user statistics
   */
  async getUserStatistics(username) {
    return await apiClient.get(`/users/${username}/statistics`);
  },

  /**
   * Get current user's progress
   */
  async getMyProgress() {
    return await apiClient.get('/users/me/progress');
  },

  /**
   * Add progress entry
   */
  async addProgress(progressData) {
    return await apiClient.post('/users/me/progress', progressData);
  },

  /**
   * Update user statistics
   */
  async updateStatistics(statsData) {
    return await apiClient.put('/users/me/statistics', statsData);
  },

  /**
   * Get leaderboard
   */
  async getLeaderboard(params = {}) {
    const { limit = 10, orderBy = 'total_encryptions' } = params;
    return await apiClient.get(`/users/leaderboard?limit=${limit}&orderBy=${orderBy}`);
  },

  /**
   * Search users
   */
  async searchUsers(query, limit = 10) {
    return await apiClient.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }
};

export default userService;