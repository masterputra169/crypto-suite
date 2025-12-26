// src/context/StatisticsContext.jsx

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getPerformanceTracker } from '../utils/statistics/performanceTracker';
import { analyzeFrequency, compareFrequency } from '../utils/statistics/frequencyAnalysis';
import { calculateEntropy, compareEntropy, getEntropyScore } from '../utils/statistics/entropyCalculator';

/**
 * StatisticsContext - Global state management untuk performance & analytics
 * Manages: metrics, frequency analysis, entropy calculations, comparisons
 */

// ==================== PROP TYPES DEFINITIONS ====================

// Metric PropTypes
const MetricPropTypes = PropTypes.shape({
  algorithm: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  executionTime: PropTypes.string.isRequired,
  inputSize: PropTypes.number.isRequired,
  outputSize: PropTypes.number.isRequired,
  throughput: PropTypes.string.isRequired,
  memoryUsed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  efficiency: PropTypes.string.isRequired,
});

// Frequency Data PropTypes
const FrequencyItemPropTypes = PropTypes.shape({
  char: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
});

const FrequencyDataPropTypes = PropTypes.shape({
  data: PropTypes.arrayOf(FrequencyItemPropTypes).isRequired,
  total: PropTypes.number.isRequired,
  uniqueChars: PropTypes.number.isRequired,
  mostCommon: FrequencyItemPropTypes,
  leastCommon: FrequencyItemPropTypes,
});

const FrequencyComparisonPropTypes = PropTypes.shape({
  plaintext: FrequencyDataPropTypes.isRequired,
  ciphertext: FrequencyDataPropTypes.isRequired,
  analysis: PropTypes.string.isRequired,
});

// Entropy PropTypes
const EntropyRatingPropTypes = PropTypes.shape({
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
});

const EntropyScorePropTypes = PropTypes.shape({
  entropy: PropTypes.string.isRequired,
  maxEntropy: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
  rating: EntropyRatingPropTypes.isRequired,
});

const EntropyComparisonPropTypes = PropTypes.shape({
  plaintext: EntropyScorePropTypes.isRequired,
  ciphertext: EntropyScorePropTypes.isRequired,
  improvement: PropTypes.string.isRequired,
  improvementPercent: PropTypes.string.isRequired,
  analysis: PropTypes.string.isRequired,
});

// Algorithm Stats PropTypes
const AlgorithmStatsPropTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  totalTime: PropTypes.string.isRequired,
  avgTime: PropTypes.string.isRequired,
  totalChars: PropTypes.number.isRequired,
  avgThroughput: PropTypes.string,
});

const ComparisonDataPropTypes = PropTypes.objectOf(AlgorithmStatsPropTypes);

// Statistics Summary PropTypes
const StatisticsSummaryPropTypes = PropTypes.shape({
  totalOperations: PropTypes.number.isRequired,
  avgExecutionTime: PropTypes.string.isRequired,
  totalTime: PropTypes.string.isRequired,
  fastestOperation: PropTypes.string.isRequired,
  slowestOperation: PropTypes.string.isRequired,
  recentMetrics: PropTypes.arrayOf(MetricPropTypes).isRequired,
});

// Settings PropTypes
const SettingsPropTypes = PropTypes.shape({
  enableTracking: PropTypes.bool.isRequired,
  maxHistorySize: PropTypes.number.isRequired,
  autoExport: PropTypes.bool.isRequired,
  exportFormat: PropTypes.oneOf(['json', 'csv']).isRequired,
  showNotifications: PropTypes.bool.isRequired,
});

// Algorithm Stats Response PropTypes
const AlgorithmStatsResponsePropTypes = PropTypes.shape({
  algorithm: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  totalTime: PropTypes.string.isRequired,
  avgTime: PropTypes.string.isRequired,
  minTime: PropTypes.string.isRequired,
  maxTime: PropTypes.string.isRequired,
  recentMetrics: PropTypes.arrayOf(MetricPropTypes).isRequired,
});

// Time Range Stats PropTypes
const TimeRangeStatsPropTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  metrics: PropTypes.arrayOf(MetricPropTypes).isRequired,
  algorithms: PropTypes.arrayOf(PropTypes.string).isRequired,
});

// Insights PropTypes
const InsightsPropTypes = PropTypes.shape({
  message: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
});

// Analysis Result PropTypes
const AnalysisResultPropTypes = PropTypes.shape({
  performance: MetricPropTypes.isRequired,
  frequency: FrequencyComparisonPropTypes.isRequired,
  entropy: EntropyComparisonPropTypes.isRequired,
});

// Context Value PropTypes
const StatisticsContextValuePropTypes = PropTypes.shape({
  // State
  currentMetric: MetricPropTypes,
  frequencyData: FrequencyComparisonPropTypes,
  entropyData: EntropyComparisonPropTypes,
  metricsHistory: PropTypes.arrayOf(MetricPropTypes).isRequired,
  comparisonData: ComparisonDataPropTypes,
  statisticsSummary: StatisticsSummaryPropTypes,
  isTracking: PropTypes.bool.isRequired,
  trackingStartTime: PropTypes.number,
  settings: SettingsPropTypes.isRequired,

  // Tracking
  startTracking: PropTypes.func.isRequired,
  stopTracking: PropTypes.func.isRequired,
  resetCurrentSession: PropTypes.func.isRequired,

  // Analysis
  analyzeTextFrequency: PropTypes.func.isRequired,
  calculateTextEntropy: PropTypes.func.isRequired,
  compareTexts: PropTypes.func.isRequired,

  // Statistics
  getAlgorithmStats: PropTypes.func.isRequired,
  getTimeRangeStats: PropTypes.func.isRequired,
  getTopAlgorithms: PropTypes.func.isRequired,
  getMostUsedAlgorithms: PropTypes.func.isRequired,
  getInsights: PropTypes.func.isRequired,

  // Management
  clearStatistics: PropTypes.func.isRequired,
  clearAlgorithmData: PropTypes.func.isRequired,
  exportStatistics: PropTypes.func.isRequired,
  importStatistics: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired,
  updateStatisticsSummary: PropTypes.func.isRequired,

  // Refresh
  loadStatistics: PropTypes.func.isRequired,
  saveStatistics: PropTypes.func.isRequired,
});

// ==================== CONTEXT CREATION ====================

const StatisticsContext = createContext(null);

// Storage key
const STORAGE_KEY = 'crypto_statistics';

// Default settings
const DEFAULT_SETTINGS = {
  enableTracking: true,
  maxHistorySize: 100,
  autoExport: false,
  exportFormat: 'json',
  showNotifications: true,
};

// ==================== PROVIDER COMPONENT ====================

export const StatisticsProvider = ({ children }) => {
  // Performance tracker instance
  const tracker = useMemo(() => getPerformanceTracker(), []);

  // Current session metrics
  const [currentMetric, setCurrentMetric] = useState(null);
  
  // Frequency analysis data
  const [frequencyData, setFrequencyData] = useState(null);
  
  // Entropy analysis data
  const [entropyData, setEntropyData] = useState(null);
  
  // Historical metrics
  const [metricsHistory, setMetricsHistory] = useState([]);
  
  // Algorithm comparison data
  const [comparisonData, setComparisonData] = useState(null);
  
  // Statistics summary
  const [statisticsSummary, setStatisticsSummary] = useState(null);
  
  // Tracking state
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState(null);

  // Settings
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Load data on mount
  useEffect(() => {
    loadStatistics();
  }, []);

  // Update statistics summary when metrics change
  useEffect(() => {
    updateStatisticsSummary();
  }, [metricsHistory]);

  // ==================== STORAGE FUNCTIONS ====================

  const loadStatistics = useCallback(() => {
    try {
      // Load from localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...data.settings }));
      }

      // Load metrics from tracker
      const history = tracker.constructor.loadFromStorage();
      setMetricsHistory(history);

      // Load comparison data
      const comparison = tracker.getAlgorithmComparison();
      setComparisonData(comparison);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, [tracker]);

  const saveStatistics = useCallback(() => {
    try {
      const data = {
        settings,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  }, [settings]);

  const updateStatisticsSummary = useCallback(() => {
    const summary = tracker.getStatistics();
    setStatisticsSummary(summary);
  }, [tracker]);

  // ==================== TRACKING FUNCTIONS ====================

  const startTracking = useCallback(() => {
    if (!settings.enableTracking) {
      console.warn('Tracking is disabled in settings');
      return;
    }

    tracker.start();
    setIsTracking(true);
    setTrackingStartTime(Date.now());
  }, [settings.enableTracking, tracker]);

  const stopTracking = useCallback((algorithmName, inputText, outputText) => {
    // Validate parameters
    if (typeof algorithmName !== 'string') {
      console.error('stopTracking: algorithmName must be a string');
      return null;
    }
    if (typeof inputText !== 'string' || typeof outputText !== 'string') {
      console.error('stopTracking: inputText and outputText must be strings');
      return null;
    }

    if (!isTracking) {
      console.warn('Tracking was not started');
      return null;
    }

    try {
      // Stop performance tracking
      const metric = tracker.stop(algorithmName, inputText.length, outputText.length);
      setCurrentMetric(metric);
      setIsTracking(false);

      // Analyze frequency
      const frequency = compareFrequency(inputText, outputText);
      setFrequencyData(frequency);

      // Analyze entropy
      const entropy = compareEntropy(inputText, outputText);
      setEntropyData(entropy);

      // Update history
      const history = tracker.constructor.loadFromStorage();
      setMetricsHistory(history);

      // Update comparison
      const comparison = tracker.getAlgorithmComparison();
      setComparisonData(comparison);

      // Update summary
      updateStatisticsSummary();

      return {
        performance: metric,
        frequency,
        entropy,
      };
    } catch (error) {
      console.error('Failed to stop tracking:', error);
      setIsTracking(false);
      return null;
    }
  }, [isTracking, tracker, updateStatisticsSummary]);

  const resetCurrentSession = useCallback(() => {
    setCurrentMetric(null);
    setFrequencyData(null);
    setEntropyData(null);
    setIsTracking(false);
    setTrackingStartTime(null);
  }, []);

  // ==================== ANALYSIS FUNCTIONS ====================

  const analyzeTextFrequency = useCallback((text) => {
    if (typeof text !== 'string') {
      console.error('analyzeTextFrequency: text must be a string');
      return null;
    }

    try {
      const analysis = analyzeFrequency(text);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze frequency:', error);
      return null;
    }
  }, []);

  const calculateTextEntropy = useCallback((text) => {
    if (typeof text !== 'string') {
      console.error('calculateTextEntropy: text must be a string');
      return null;
    }

    try {
      const score = getEntropyScore(text);
      return score;
    } catch (error) {
      console.error('Failed to calculate entropy:', error);
      return null;
    }
  }, []);

  const compareTexts = useCallback((text1, text2) => {
    if (typeof text1 !== 'string' || typeof text2 !== 'string') {
      console.error('compareTexts: both texts must be strings');
      return null;
    }

    try {
      const frequency = compareFrequency(text1, text2);
      const entropy = compareEntropy(text1, text2);

      return {
        frequency,
        entropy,
      };
    } catch (error) {
      console.error('Failed to compare texts:', error);
      return null;
    }
  }, []);

  // ==================== STATISTICS QUERIES ====================

  const getAlgorithmStats = useCallback((algorithmName) => {
    if (typeof algorithmName !== 'string') {
      console.error('getAlgorithmStats: algorithmName must be a string');
      return null;
    }

    const algorithmMetrics = metricsHistory.filter(
      m => m.algorithm === algorithmName
    );

    if (algorithmMetrics.length === 0) return null;

    const totalTime = algorithmMetrics.reduce(
      (sum, m) => sum + parseFloat(m.executionTime),
      0
    );
    const avgTime = totalTime / algorithmMetrics.length;
    const minTime = Math.min(...algorithmMetrics.map(m => parseFloat(m.executionTime)));
    const maxTime = Math.max(...algorithmMetrics.map(m => parseFloat(m.executionTime)));

    return {
      algorithm: algorithmName,
      count: algorithmMetrics.length,
      totalTime: totalTime.toFixed(2),
      avgTime: avgTime.toFixed(2),
      minTime: minTime.toFixed(2),
      maxTime: maxTime.toFixed(2),
      recentMetrics: algorithmMetrics.slice(0, 5),
    };
  }, [metricsHistory]);

  const getTimeRangeStats = useCallback((startDate, endDate) => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      console.error('getTimeRangeStats: startDate and endDate must be Date objects');
      return null;
    }

    const start = startDate.getTime();
    const end = endDate.getTime();

    const rangeMetrics = metricsHistory.filter(m => {
      const timestamp = new Date(m.timestamp).getTime();
      return timestamp >= start && timestamp <= end;
    });

    return {
      count: rangeMetrics.length,
      metrics: rangeMetrics,
      algorithms: [...new Set(rangeMetrics.map(m => m.algorithm))],
    };
  }, [metricsHistory]);

  const getTopAlgorithms = useCallback((limit = 5) => {
    if (typeof limit !== 'number' || limit < 1) {
      console.error('getTopAlgorithms: limit must be a positive number');
      return [];
    }

    if (!comparisonData) return [];

    return Object.entries(comparisonData)
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => parseFloat(a.avgTime) - parseFloat(b.avgTime))
      .slice(0, limit);
  }, [comparisonData]);

  const getMostUsedAlgorithms = useCallback((limit = 5) => {
    if (typeof limit !== 'number' || limit < 1) {
      console.error('getMostUsedAlgorithms: limit must be a positive number');
      return [];
    }

    if (!comparisonData) return [];

    return Object.entries(comparisonData)
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [comparisonData]);

  const getInsights = useCallback(() => {
    if (!statisticsSummary || statisticsSummary.totalOperations === 0) {
      return {
        message: 'No data available yet',
        suggestions: ['Start using cipher algorithms to see insights'],
        highlights: [],
      };
    }

    const insights = {
      message: '',
      suggestions: [],
      highlights: [],
    };

    // Performance insights
    const avgTime = parseFloat(statisticsSummary.avgExecutionTime);
    if (avgTime < 10) {
      insights.highlights.push('⚡ Excellent average performance!');
    } else if (avgTime < 50) {
      insights.highlights.push('✓ Good average performance');
    } else {
      insights.suggestions.push('Consider optimizing input text length for better performance');
    }

    // Usage insights
    if (statisticsSummary.totalOperations < 10) {
      insights.message = 'You\'re just getting started!';
      insights.suggestions.push('Try different cipher algorithms to explore');
    } else if (statisticsSummary.totalOperations < 50) {
      insights.message = 'You\'re actively exploring ciphers!';
      insights.highlights.push(`📊 ${statisticsSummary.totalOperations} operations completed`);
    } else {
      insights.message = 'You\'re a cipher master!';
      insights.highlights.push(`🏆 ${statisticsSummary.totalOperations}+ operations completed`);
    }

    // Algorithm diversity
    if (comparisonData) {
      const algorithmCount = Object.keys(comparisonData).length;
      if (algorithmCount === 1) {
        insights.suggestions.push('Try exploring other cipher algorithms');
      } else if (algorithmCount < 5) {
        insights.highlights.push(`📚 ${algorithmCount} algorithms explored`);
      } else {
        insights.highlights.push(`🌟 All ${algorithmCount} algorithms explored!`);
      }
    }

    return insights;
  }, [statisticsSummary, comparisonData]);

  // ==================== DATA MANAGEMENT ====================

  const clearStatistics = useCallback(() => {
    tracker.clear();
    setCurrentMetric(null);
    setFrequencyData(null);
    setEntropyData(null);
    setMetricsHistory([]);
    setComparisonData(null);
    setStatisticsSummary(null);
    updateStatisticsSummary();
  }, [tracker, updateStatisticsSummary]);

  const clearAlgorithmData = useCallback((algorithmName) => {
    if (typeof algorithmName !== 'string') {
      console.error('clearAlgorithmData: algorithmName must be a string');
      return;
    }

    const newHistory = metricsHistory.filter(m => m.algorithm !== algorithmName);
    setMetricsHistory(newHistory);
    
    try {
      localStorage.setItem('cryptoMetrics', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to clear algorithm data:', error);
    }

    updateStatisticsSummary();
  }, [metricsHistory, updateStatisticsSummary]);

  const exportStatistics = useCallback((format = 'json') => {
    if (format !== 'json' && format !== 'csv') {
      console.error('exportStatistics: format must be "json" or "csv"');
      return null;
    }

    try {
      if (format === 'json') {
        return tracker.exportJSON();
      } else if (format === 'csv') {
        return tracker.exportCSV();
      }
      return null;
    } catch (error) {
      console.error('Failed to export statistics:', error);
      return null;
    }
  }, [tracker]);

  const importStatistics = useCallback((data, format = 'json') => {
    if (typeof data !== 'string') {
      console.error('importStatistics: data must be a string');
      return false;
    }
    if (format !== 'json' && format !== 'csv') {
      console.error('importStatistics: format must be "json" or "csv"');
      return false;
    }

    try {
      if (format === 'json') {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setMetricsHistory(parsed);
          localStorage.setItem('cryptoMetrics', JSON.stringify(parsed));
          updateStatisticsSummary();
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to import statistics:', error);
      return false;
    }
  }, [updateStatisticsSummary]);

  const updateSettings = useCallback((updates) => {
    if (!updates || typeof updates !== 'object') {
      console.error('updateSettings: updates must be an object');
      return;
    }

    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      
      try {
        const data = {
          settings: newSettings,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      
      return newSettings;
    });
  }, []);

  // ==================== CONTEXT VALUE ====================

  const value = {
    // State
    currentMetric,
    frequencyData,
    entropyData,
    metricsHistory,
    comparisonData,
    statisticsSummary,
    isTracking,
    trackingStartTime,
    settings,

    // Tracking
    startTracking,
    stopTracking,
    resetCurrentSession,

    // Analysis
    analyzeTextFrequency,
    calculateTextEntropy,
    compareTexts,

    // Statistics
    getAlgorithmStats,
    getTimeRangeStats,
    getTopAlgorithms,
    getMostUsedAlgorithms,
    getInsights,

    // Management
    clearStatistics,
    clearAlgorithmData,
    exportStatistics,
    importStatistics,
    updateSettings,
    updateStatisticsSummary,

    // Refresh
    loadStatistics,
    saveStatistics,
  };

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};

// PropTypes for Provider
StatisticsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ==================== CUSTOM HOOK ====================

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  
  if (!context) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  
  return context;
};

// ==================== EXPORTS ====================

export { StatisticsContext };

// Export PropTypes for external use
export {
  MetricPropTypes,
  FrequencyItemPropTypes,
  FrequencyDataPropTypes,
  FrequencyComparisonPropTypes,
  EntropyRatingPropTypes,
  EntropyScorePropTypes,
  EntropyComparisonPropTypes,
  AlgorithmStatsPropTypes,
  ComparisonDataPropTypes,
  StatisticsSummaryPropTypes,
  SettingsPropTypes,
  AlgorithmStatsResponsePropTypes,
  TimeRangeStatsPropTypes,
  InsightsPropTypes,
  AnalysisResultPropTypes,
  StatisticsContextValuePropTypes,
};

export default StatisticsContext;