// src/utils/statistics/statsAggregator.js

/**
 * Statistics Aggregator
 * Menggabungkan semua metrics dari berbagai sumber
 */

// Import named exports only (no default imports to avoid errors)
import { getFrequencyReport } from './frequencyAnalysis.js';
import { 
  calculateEntropy,
  calculateNormalizedEntropy,
  calculateConditionalEntropy,
  estimateKeyLength,
  compareEntropy as compareEntropyFunc
} from './entropyCalculator.js';

/**
 * Get complete entropy report (wrapper function)
 */
const getEntropyReport = (text) => {
  const basicEntropy = calculateEntropy(text);
  const normalized = calculateNormalizedEntropy(text);
  const conditional = calculateConditionalEntropy(text);
  const keyLength = estimateKeyLength(text);

  return {
    shannon: basicEntropy,
    normalized,
    conditional,
    keyLengthEstimate: keyLength,
    interpretation: interpretEntropy(normalized.normalized),
    summary: {
      entropy: basicEntropy.toFixed(4),
      normalizedPercentage: normalized.percentage.toFixed(2) + '%',
      randomness: interpretEntropy(normalized.normalized).level,
      estimatedKeyLength: keyLength?.mostLikely || 'Unknown'
    }
  };
};

/**
 * Interpret entropy value
 */
const interpretEntropy = (normalizedEntropy) => {
  if (normalizedEntropy >= 0.9) {
    return {
      level: 'Very High',
      quality: 'Excellent',
      description: 'Text appears highly random, likely well-encrypted or random data'
    };
  } else if (normalizedEntropy >= 0.7) {
    return {
      level: 'High',
      quality: 'Good',
      description: 'Text has good randomness, likely encrypted with strong cipher'
    };
  } else if (normalizedEntropy >= 0.5) {
    return {
      level: 'Medium',
      quality: 'Moderate',
      description: 'Text has moderate randomness, may be weakly encrypted'
    };
  } else if (normalizedEntropy >= 0.3) {
    return {
      level: 'Low',
      quality: 'Poor',
      description: 'Text has low randomness, likely plaintext or weak encryption'
    };
  } else {
    return {
      level: 'Very Low',
      quality: 'Very Poor',
      description: 'Text appears as plaintext or has very weak encryption'
    };
  }
};

/**
 * Aggregate all statistics untuk suatu operasi enkripsi/dekripsi
 */
export const aggregateStats = (operationName, plaintext, ciphertext, duration = null) => {
  const timestamp = new Date().toISOString();

  // Performance metrics
  const performanceMetrics = duration ? {
    duration,
    throughput: calculateThroughput(plaintext.length, duration),
    speed: calculateSpeed(plaintext.length, duration)
  } : null;

  // Frequency analysis
  const plaintextFreq = getFrequencyReport(plaintext);
  const ciphertextFreq = getFrequencyReport(ciphertext);

  // Entropy analysis
  const plaintextEntropy = getEntropyReport(plaintext);
  const ciphertextEntropy = getEntropyReport(ciphertext);
  const entropyComparison = compareEntropyFunc(plaintext, ciphertext);

  // Basic text statistics
  const textStats = {
    plaintext: getTextStats(plaintext),
    ciphertext: getTextStats(ciphertext)
  };

  return {
    timestamp,
    operationName,
    performance: performanceMetrics,
    frequency: {
      plaintext: plaintextFreq,
      ciphertext: ciphertextFreq
    },
    entropy: {
      plaintext: plaintextEntropy,
      ciphertext: ciphertextEntropy,
      comparison: entropyComparison
    },
    textStats,
    securityScore: calculateSecurityScore(entropyComparison, ciphertextFreq)
  };
};

/**
 * Calculate throughput (chars/second)
 */
const calculateThroughput = (length, duration) => {
  if (duration === 0) return 0;
  return (length / (duration / 1000)).toFixed(2);
};

/**
 * Calculate speed (operations/second)
 */
const calculateSpeed = (length, duration) => {
  if (duration === 0) return 0;
  return (1000 / duration).toFixed(2);
};

/**
 * Get basic text statistics
 */
const getTextStats = (text) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const originalLength = text.length;
  const cleanLength = cleanText.length;

  return {
    originalLength,
    cleanLength,
    removedChars: originalLength - cleanLength,
    averageWordLength: calculateAverageWordLength(text),
    uniqueChars: new Set(cleanText).size,
    isUpperCase: text === text.toUpperCase(),
    isLowerCase: text === text.toLowerCase()
  };
};

/**
 * Calculate average word length
 */
const calculateAverageWordLength = (text) => {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;
  
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return (totalLength / words.length).toFixed(2);
};

/**
 * Calculate security score (0-100)
 */
const calculateSecurityScore = (entropyComparison, ciphertextFreq) => {
  const scores = [];

  // 1. Entropy improvement (40%)
  const entropyScore = Math.min(100, (entropyComparison.ciphertext.normalized.normalized * 100));
  scores.push({ category: 'Entropy', score: entropyScore, weight: 0.4 });

  // 2. Frequency distribution (30%)
  const freqScore = calculateFrequencyScore(ciphertextFreq);
  scores.push({ category: 'Frequency Distribution', score: freqScore, weight: 0.3 });

  // 3. Index of Coincidence (30%)
  const icScore = calculateICScore(ciphertextFreq.indexOfCoincidence);
  scores.push({ category: 'Index of Coincidence', score: icScore, weight: 0.3 });

  // Weighted average
  const totalScore = scores.reduce((sum, s) => sum + (s.score * s.weight), 0);

  return {
    total: Math.round(totalScore),
    breakdown: scores,
    grade: getSecurityGrade(totalScore),
    recommendation: getSecurityRecommendation(totalScore)
  };
};

/**
 * Calculate frequency distribution score
 */
const calculateFrequencyScore = (freqReport) => {
  const chiSquared = freqReport.comparison.chiSquared;
  
  // Lower chi-squared (closer to uniform) = better score
  // Chi-squared > 100 = poor, < 20 = excellent
  if (chiSquared < 20) return 100;
  if (chiSquared < 40) return 80;
  if (chiSquared < 60) return 60;
  if (chiSquared < 80) return 40;
  if (chiSquared < 100) return 20;
  return 10;
};

/**
 * Calculate IC score
 */
const calculateICScore = (ic) => {
  const value = ic.value;
  
  // IC closer to random (0.038) = better
  // IC closer to English (0.067) = worse
  const randomIC = 0.038;
  const englishIC = 0.067;
  
  const distance = Math.abs(value - randomIC);
  const maxDistance = Math.abs(englishIC - randomIC);
  
  return Math.max(0, (1 - distance / maxDistance) * 100);
};

/**
 * Get security grade
 */
const getSecurityGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

/**
 * Get security recommendation
 */
const getSecurityRecommendation = (score) => {
  if (score >= 80) {
    return 'Excellent encryption quality. Strong resistance to frequency analysis.';
  } else if (score >= 60) {
    return 'Good encryption quality. Consider using longer keys for better security.';
  } else if (score >= 40) {
    return 'Moderate encryption quality. Vulnerable to statistical attacks.';
  } else {
    return 'Weak encryption quality. Consider using stronger cipher algorithms.';
  }
};

/**
 * Aggregate multiple operations untuk comparison
 */
export const aggregateMultipleOperations = (operations) => {
  if (operations.length === 0) return null;

  const durations = operations.map(op => op.performance?.duration || 0).filter(d => d > 0);
  const securityScores = operations.map(op => op.securityScore.total);

  return {
    totalOperations: operations.length,
    averagePerformance: {
      duration: durations.length > 0 ? average(durations) : 0,
      minDuration: durations.length > 0 ? Math.min(...durations) : 0,
      maxDuration: durations.length > 0 ? Math.max(...durations) : 0
    },
    averageSecurityScore: average(securityScores),
    bestSecurity: Math.max(...securityScores),
    worstSecurity: Math.min(...securityScores),
    operations: operations.map(op => ({
      name: op.operationName,
      timestamp: op.timestamp,
      duration: op.performance?.duration,
      securityScore: op.securityScore.total,
      grade: op.securityScore.grade
    }))
  };
};

/**
 * Calculate average
 */
const average = (arr) => {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

/**
 * Export aggregated stats
 */
export const exportAggregatedStats = (stats, format = 'json') => {
  if (format === 'json') {
    return JSON.stringify(stats, null, 2);
  }

  if (format === 'csv') {
    return convertToCSV(stats);
  }

  return null;
};

/**
 * Convert stats to CSV format
 */
const convertToCSV = (stats) => {
  const headers = [
    'Timestamp',
    'Operation',
    'Duration (ms)',
    'Plaintext Length',
    'Ciphertext Length',
    'Entropy (Plaintext)',
    'Entropy (Ciphertext)',
    'Security Score',
    'Grade'
  ];

  const row = [
    stats.timestamp,
    stats.operationName,
    stats.performance?.duration || 'N/A',
    stats.textStats.plaintext.cleanLength,
    stats.textStats.ciphertext.cleanLength,
    stats.entropy.plaintext.shannon.toFixed(4),
    stats.entropy.ciphertext.shannon.toFixed(4),
    stats.securityScore.total,
    stats.securityScore.grade
  ];

  return [headers.join(','), row.join(',')].join('\n');
};

/**
 * Generate summary report
 */
export const generateSummaryReport = (stats) => {
  return {
    operation: stats.operationName,
    timestamp: stats.timestamp,
    performance: {
      duration: stats.performance?.duration
        ? `${stats.performance.duration.toFixed(2)} ms`
        : 'N/A',
      throughput: stats.performance?.throughput
        ? `${stats.performance.throughput} chars/sec`
        : 'N/A'
    },
    textInfo: {
      input: `${stats.textStats.plaintext.cleanLength} characters`,
      output: `${stats.textStats.ciphertext.cleanLength} characters`,
      uniqueChars: `${stats.textStats.ciphertext.uniqueChars} unique characters`
    },
    security: {
      score: `${stats.securityScore.total}/100`,
      grade: stats.securityScore.grade,
      recommendation: stats.securityScore.recommendation
    },
    entropy: {
      before: stats.entropy.plaintext.summary.entropy,
      after: stats.entropy.ciphertext.summary.entropy,
      improvement: `${stats.entropy.comparison.improvement.toFixed(2)}%`
    }
  };
};