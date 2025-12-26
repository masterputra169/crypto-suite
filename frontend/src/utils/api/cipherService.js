// src/utils/api/cipherService.js
import api from './apiClient';

/**
 * Cipher Service - All cipher-related API calls
 */
const cipherService = {
  /**
   * Record cipher operation with full history
   * @param {Object} data - Operation data
   * @param {string} data.cipher_type - Name of cipher
   * @param {string} data.operation - 'encrypt' or 'decrypt'
   * @param {string} data.input_text - Original text
   * @param {string} data.output_text - Result text
   * @param {Object} data.key_data - Key/configuration object
   * @param {number} data.time_spent - Time in seconds
   */
  recordOperation: async (data) => {
    try {
      console.log('💾 Recording cipher operation:', data.cipher_type);
      const response = await api.post('/cipher/record', data);
      console.log('✅ Operation recorded successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to record operation:', error);
      throw error;
    }
  },

  /**
   * Get user statistics
   * @returns {Promise} Statistics data
   */
  getStatistics: async () => {
    try {
      console.log('📊 Fetching user statistics...');
      const response = await api.get('/cipher/statistics');
      console.log('✅ Statistics loaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error);
      throw error;
    }
  },

  /**
   * Get cipher history for export
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Maximum records to fetch
   * @param {string} params.cipher_type - Filter by cipher type
   * @param {string} params.operation - Filter by operation
   * @returns {Promise} History data
   */
  getHistory: async (params = {}) => {
    try {
      console.log('📜 Fetching cipher history...', params);
      const response = await api.get('/cipher/history', { params });
      console.log(`✅ History loaded: ${response.data.count} records`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch history:', error);
      throw error;
    }
  },

  /**
   * Delete history entry
   * @param {number} id - History entry ID
   */
  deleteHistory: async (id) => {
    try {
      console.log('🗑️ Deleting history entry:', id);
      const response = await api.delete(`/cipher/history/${id}`);
      console.log('✅ History entry deleted');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to delete history:', error);
      throw error;
    }
  },

  /**
   * Get global leaderboard
   * @returns {Promise} Leaderboard data
   */
  getLeaderboard: async () => {
    try {
      console.log('🏆 Fetching leaderboard...');
      const response = await api.get('/cipher/leaderboard');
      console.log(`✅ Leaderboard loaded: ${response.data.data?.length || 0} users`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch leaderboard:', error);
      throw error;
    }
  }
};

export default cipherService;