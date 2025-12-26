// src/hooks/usePerformance.js

/**
 * usePerformance Hook
 * Custom hook untuk tracking performance dan statistics dengan PropTypes
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Import dari statistics module
import {
  startTracking,
  stopTracking,
  getMetrics,
  getSummary,
  clearMetrics
} from '../utils/statistics/performanceTracker.js';

import {
  calculateFrequency,
  getFrequencyReport,
  compareWithEnglish
} from '../utils/statistics/frequencyAnalysis.js';

import {
  calculateEntropy,
  getEntropyReport,
  compareEntropy
} from '../utils/statistics/entropyCalculator.js';

import {
  aggregateStats
} from '../utils/statistics/statsAggregator.js';

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes untuk Performance Metrics
 */
export const PerformanceMetricsPropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  timestamp: PropTypes.string.isRequired,
  startTime: PropTypes.number,
  endTime: PropTypes.number,
  memoryDelta: PropTypes.object
});

/**
 * PropTypes untuk Frequency Data
 */
export const FrequencyDataPropTypes = PropTypes.shape({
  frequency: PropTypes.arrayOf(PropTypes.shape({
    letter: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    frequency: PropTypes.number.isRequired
  })).isRequired,
  total: PropTypes.number.isRequired,
  uniqueChars: PropTypes.number.isRequired
});

/**
 * PropTypes untuk Entropy Data
 */
export const EntropyDataPropTypes = PropTypes.shape({
  shannon: PropTypes.number.isRequired,
  normalized: PropTypes.object.isRequired,
  interpretation: PropTypes.object.isRequired
});

/**
 * PropTypes untuk Aggregated Stats
 */
export const AggregatedStatsPropTypes = PropTypes.shape({
  timestamp: PropTypes.string.isRequired,
  operationName: PropTypes.string.isRequired,
  performance: PropTypes.object,
  frequency: PropTypes.object.isRequired,
  entropy: PropTypes.object.isRequired,
  textStats: PropTypes.object.isRequired,
  securityScore: PropTypes.object.isRequired
});

// ==================== MAIN HOOK ====================

/**
 * usePerformance - Custom hook untuk performance tracking
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoTrack - Automatically start tracking
 * @param {boolean} options.collectFrequency - Collect frequency analysis
 * @param {boolean} options.collectEntropy - Collect entropy analysis
 * @returns {Object} Performance tracking utilities
 */
const usePerformance = (options = {}) => {
  const {
    autoTrack = true,
    collectFrequency = true,
    collectEntropy = true
  } = options;

  // ==================== STATE ====================
  const [metrics, setMetrics] = useState(null);
  const [frequencyData, setFrequencyData] = useState(null);
  const [entropyData, setEntropyData] = useState(null);
  const [aggregatedData, setAggregatedData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);

  const operationStartTime = useRef(null);
  const currentOperation = useRef(null);

  // ==================== TRACKING METHODS ====================

  /**
   * Start tracking an operation
   */
  const startOperation = useCallback((operationName, metadata = {}) => {
    try {
      setError(null);
      setIsTracking(true);
      
      currentOperation.current = operationName;
      operationStartTime.current = performance.now();
      
      if (autoTrack) {
        startTracking(operationName, metadata);
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error starting operation:', err);
      return false;
    }
  }, [autoTrack]);

  /**
   * Stop tracking and collect all statistics
   */
  const stopOperation = useCallback((plaintext = '', ciphertext = '') => {
    try {
      if (!isTracking) {
        console.warn('No operation is currently being tracked');
        return null;
      }

      const duration = operationStartTime.current 
        ? performance.now() - operationStartTime.current
        : null;

      // Stop performance tracking
      const metric = stopTracking({
        plaintext: plaintext.substring(0, 100), // Store preview only
        ciphertext: ciphertext.substring(0, 100),
        duration
      });

      setMetrics(metric);

      // Collect frequency analysis
      if (collectFrequency && plaintext && ciphertext) {
        const plaintextFreq = getFrequencyReport(plaintext);
        const ciphertextFreq = getFrequencyReport(ciphertext);
        
        setFrequencyData({
          plaintext: plaintextFreq,
          ciphertext: ciphertextFreq,
          comparison: compareWithEnglish(ciphertext)
        });
      }

      // Collect entropy analysis
      if (collectEntropy && plaintext && ciphertext) {
        const plaintextEntropy = getEntropyReport(plaintext);
        const ciphertextEntropy = getEntropyReport(ciphertext);
        const entropyComparison = compareEntropy(plaintext, ciphertext);
        
        setEntropyData({
          plaintext: plaintextEntropy,
          ciphertext: ciphertextEntropy,
          comparison: entropyComparison
        });
      }

      // Aggregate all statistics
      if (currentOperation.current && plaintext && ciphertext) {
        const aggregated = aggregateStats(
          currentOperation.current,
          plaintext,
          ciphertext,
          duration
        );
        setAggregatedData(aggregated);
      }

      setIsTracking(false);
      currentOperation.current = null;
      operationStartTime.current = null;

      return {
        metrics: metric,
        frequency: frequencyData,
        entropy: entropyData,
        aggregated: aggregatedData
      };
    } catch (err) {
      setError(err.message);
      console.error('Error stopping operation:', err);
      setIsTracking(false);
      return null;
    }
  }, [isTracking, collectFrequency, collectEntropy, frequencyData, entropyData, aggregatedData]);

  /**
   * Analyze text without tracking
   */
  const analyzeText = useCallback((text, type = 'plaintext') => {
    try {
      const frequency = collectFrequency ? getFrequencyReport(text) : null;
      const entropy = collectEntropy ? getEntropyReport(text) : null;

      return {
        type,
        text: text.substring(0, 100), // Preview only
        length: text.length,
        frequency,
        entropy,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing text:', err);
      return null;
    }
  }, [collectFrequency, collectEntropy]);

  /**
   * Get all performance metrics
   */
  const getAllMetrics = useCallback(() => {
    try {
      return getMetrics();
    } catch (err) {
      setError(err.message);
      console.error('Error getting metrics:', err);
      return [];
    }
  }, []);

  /**
   * Get summary for specific operation
   */
  const getOperationSummary = useCallback((operationName = null) => {
    try {
      return getSummary(operationName);
    } catch (err) {
      setError(err.message);
      console.error('Error getting summary:', err);
      return null;
    }
  }, []);

  /**
   * Clear all metrics
   */
  const clearAllMetrics = useCallback(() => {
    try {
      clearMetrics();
      setMetrics(null);
      setFrequencyData(null);
      setEntropyData(null);
      setAggregatedData(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error clearing metrics:', err);
    }
  }, []);

  /**
   * Export data in various formats
   */
  const exportData = useCallback((format = 'json') => {
    try {
      if (!aggregatedData) {
        console.warn('No data to export');
        return null;
      }

      if (format === 'json') {
        return JSON.stringify(aggregatedData, null, 2);
      }

      if (format === 'csv') {
        const headers = [
          'Operation',
          'Duration (ms)',
          'Security Score',
          'Grade',
          'Entropy Before',
          'Entropy After'
        ];

        const row = [
          aggregatedData.operationName,
          aggregatedData.performance?.duration || 'N/A',
          aggregatedData.securityScore.total,
          aggregatedData.securityScore.grade,
          aggregatedData.entropy.plaintext.shannon.toFixed(4),
          aggregatedData.entropy.ciphertext.shannon.toFixed(4)
        ];

        return headers.join(',') + '\n' + row.join(',');
      }

      return null;
    } catch (err) {
      setError(err.message);
      console.error('Error exporting data:', err);
      return null;
    }
  }, [aggregatedData]);

  /**
   * Get chart-ready data
   */
  const getChartData = useCallback(() => {
    if (!aggregatedData) return null;

    try {
      return {
        frequency: {
          plaintext: aggregatedData.frequency.plaintext.basic.frequency
            .filter(f => f.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
          ciphertext: aggregatedData.frequency.ciphertext.basic.frequency
            .filter(f => f.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        },
        entropy: {
          labels: ['Plaintext', 'Ciphertext'],
          values: [
            aggregatedData.entropy.plaintext.shannon,
            aggregatedData.entropy.ciphertext.shannon
          ]
        },
        security: {
          breakdown: aggregatedData.securityScore.breakdown
        }
      };
    } catch (err) {
      setError(err.message);
      console.error('Error getting chart data:', err);
      return null;
    }
  }, [aggregatedData]);

  // ==================== CLEANUP ====================
  useEffect(() => {
    return () => {
      if (isTracking) {
        stopOperation();
      }
    };
  }, [isTracking, stopOperation]);

  // ==================== RETURN ====================
  return {
    // State
    metrics,
    frequencyData,
    entropyData,
    aggregatedData,
    isTracking,
    error,

    // Methods
    startOperation,
    stopOperation,
    analyzeText,
    getAllMetrics,
    getOperationSummary,
    clearAllMetrics,
    exportData,
    getChartData,

    // Status
    hasData: !!aggregatedData,
    currentOperation: currentOperation.current
  };
};

// ==================== PROP TYPES FOR HOOK PARAMS ====================

usePerformance.propTypes = {
  options: PropTypes.shape({
    autoTrack: PropTypes.bool,
    collectFrequency: PropTypes.bool,
    collectEntropy: PropTypes.bool
  })
};

export default usePerformance;