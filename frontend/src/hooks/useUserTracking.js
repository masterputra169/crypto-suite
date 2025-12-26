// src/hooks/useUserTracking.js

import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../utils/api/userService';

/**
 * Custom hook for tracking user activity and progress
 */
const useUserTracking = () => {
  const { isAuthenticated } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);

  /**
   * Start tracking time for an activity
   */
  const startTracking = useCallback((cipherType) => {
    if (!isAuthenticated()) return;
    
    setIsTracking(true);
    setStartTime(Date.now());
  }, [isAuthenticated]);

  /**
   * Stop tracking and save progress
   */
  const stopTracking = useCallback(async (cipherType, successRate = 0) => {
    if (!isAuthenticated() || !isTracking || !startTime) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds

    try {
      // Save progress
      await userService.addProgress({
        cipher_type: cipherType,
        time_spent: timeSpent,
        success_rate: successRate
      });

      setIsTracking(false);
      setStartTime(null);

      return { timeSpent, success: true };
    } catch (error) {
      console.error('Failed to save progress:', error);
      return { timeSpent, success: false };
    }
  }, [isAuthenticated, isTracking, startTime]);

  /**
   * Track a single operation without time tracking
   */
  const trackOperation = useCallback(async (cipherType, operation = 'encryption') => {
    if (!isAuthenticated()) return;

    try {
      const updateData = {};
      
      if (operation === 'encryption') {
        updateData.total_encryptions = 1;
      } else if (operation === 'decryption') {
        updateData.total_decryptions = 1;
      }

      updateData.favorite_cipher = cipherType;

      await userService.updateStatistics(updateData);
      return { success: true };
    } catch (error) {
      console.error('Failed to track operation:', error);
      return { success: false };
    }
  }, [isAuthenticated]);

  /**
   * Get elapsed time in seconds
   */
  const getElapsedTime = useCallback(() => {
    if (!isTracking || !startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  }, [isTracking, startTime]);

  return {
    isTracking,
    startTracking,
    stopTracking,
    trackOperation,
    getElapsedTime
  };
};

export default useUserTracking;