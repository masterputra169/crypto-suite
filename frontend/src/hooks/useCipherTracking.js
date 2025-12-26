// src/hooks/useCipherTracking.js
import { useState, useCallback } from 'react';
import cipherService from '../utils/api/cipherService';

/**
 * Custom hook for tracking cipher operations with FULL HISTORY
 * Tracks time in SECONDS + stores input/output/key for export
 */
export const useCipherTracking = () => {
  const [isTracking, setIsTracking] = useState(false);

  /**
   * Track cipher operation with complete data
   * @param {string} cipherType - Name of cipher (e.g., "Caesar Cipher")
   * @param {string} operation - 'encrypt' or 'decrypt'
   * @param {number} startTime - performance.now() timestamp
   * @param {string} inputText - Original text
   * @param {string} outputText - Result text
   * @param {object} keyData - Key/configuration object (e.g., {shift: 3})
   */
  const trackOperation = useCallback(async (
    cipherType, 
    operation, 
    startTime, 
    inputText, 
    outputText, 
    keyData
  ) => {
    setIsTracking(true);
    
    try {
      const endTime = performance.now();
      const timeInMs = Math.round(endTime - startTime);
      const timeInSeconds = Math.max(1, Math.round(timeInMs / 1000));

      console.log('⏱️ Tracking operation:', {
        cipher: cipherType,
        operation: operation,
        time: `${timeInSeconds}s`,
        inputLength: inputText?.length || 0,
        outputLength: outputText?.length || 0,
        keyData: keyData
      });

      await cipherService.recordOperation({
        cipher_type: cipherType,
        operation: operation,
        input_text: inputText,
        output_text: outputText,
        key_data: keyData,
        time_spent: timeInSeconds
      });

      console.log('✅ Operation tracked successfully');
      return { success: true, timeSpent: timeInSeconds };

    } catch (error) {
      console.error('❌ Failed to track cipher operation:', error);
      return { success: false, error };
    } finally {
      setIsTracking(false);
    }
  }, []);

  return { trackOperation, isTracking };
};