// src/utils/statistics/index.js

/**
 * Central Export untuk Statistics Module
 * Menyediakan akses mudah ke semua fungsi statistics
 */

// ============= PERFORMANCE TRACKER =============
// Note: No default export, only named exports
export {
  startTracking,
  stopTracking,
  getMetrics,
  getSummary,
  clearMetrics,
  exportMetricsJSON,
  exportMetricsCSV
} from './performanceTracker.js';

// ============= FREQUENCY ANALYSIS =============
export {
  calculateFrequency,
  compareWithEnglish,
  calculateChiSquared,
  calculateIndexOfCoincidence,
  findNGrams,
  analyzeDigraphs,
  analyzeTrigraphs,
  getFrequencyReport,
  ENGLISH_FREQUENCY,
  getExpectedFrequency
} from './frequencyAnalysis.js';

// ============= ENTROPY CALCULATOR =============
export {
  calculateEntropy,
  calculateNormalizedEntropy,
  calculateConditionalEntropy,
  calculateEntropyRate,
  estimateKeyLength,
  calculatePositionalEntropy,
  getEntropyReport,
  compareEntropy
} from './entropyCalculator.js';

// ============= STATS AGGREGATOR =============
export {
  aggregateStats,
  aggregateMultipleOperations,
  exportAggregatedStats,
  generateSummaryReport
} from './statsAggregator.js';