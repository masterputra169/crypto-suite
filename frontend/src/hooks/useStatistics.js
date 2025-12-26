// src/hooks/useStatistics.js

import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * useStatistics Hook
 * Custom hook for advanced statistical analysis and insights
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
  efficiency: PropTypes.string.isRequired,
});

// Aggregated Stats PropTypes
const AggregatedStatsPropTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  totalTime: PropTypes.number.isRequired,
  avgTime: PropTypes.number.isRequired,
  minTime: PropTypes.number.isRequired,
  maxTime: PropTypes.number.isRequired,
  stdDev: PropTypes.number.isRequired,
  median: PropTypes.number.isRequired,
});

// Trend Data PropTypes
const TrendDataPropTypes = PropTypes.shape({
  period: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    algorithm: PropTypes.string,
  })).isRequired,
  trend: PropTypes.oneOf(['increasing', 'decreasing', 'stable']),
  change: PropTypes.number,
});

// Insight PropTypes
const InsightPropTypes = PropTypes.shape({
  type: PropTypes.oneOf(['success', 'warning', 'info', 'danger']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  data: PropTypes.object,
});

// Comparison Result PropTypes
const ComparisonResultPropTypes = PropTypes.shape({
  algorithm1: PropTypes.string.isRequired,
  algorithm2: PropTypes.string.isRequired,
  metrics: PropTypes.object.isRequired,
  winner: PropTypes.string,
  analysis: PropTypes.string.isRequired,
});

// Options PropTypes
const UseStatisticsOptionsPropTypes = PropTypes.shape({
  autoRefresh: PropTypes.bool,
  refreshInterval: PropTypes.number,
  enableTrends: PropTypes.bool,
  enableInsights: PropTypes.bool,
  enablePredictions: PropTypes.bool,
  minDataPoints: PropTypes.number,
  onInsight: PropTypes.func,
  onError: PropTypes.func,
});

// Report PropTypes
const ReportPropTypes = PropTypes.shape({
  generatedAt: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  summary: PropTypes.object.isRequired,
  algorithms: PropTypes.object.isRequired,
  trends: PropTypes.array,
  insights: PropTypes.arrayOf(InsightPropTypes),
  recommendations: PropTypes.arrayOf(PropTypes.string),
});

/**
 * Main useStatistics hook
 */
const useStatistics = (metrics = [], options = {}) => {
  // Validate parameters
  if (!Array.isArray(metrics)) {
    console.error('useStatistics: metrics must be an array');
  }

  if (options && typeof options !== 'object') {
    console.error('useStatistics: options must be an object');
  }

  // Default options
  const {
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute
    enableTrends = true,
    enableInsights = true,
    enablePredictions = false,
    minDataPoints = 5,
    onInsight = null,
    onError = console.error,
  } = options;

  // ==================== STATE ====================

  const [aggregatedStats, setAggregatedStats] = useState({});
  const [trends, setTrends] = useState([]);
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [report, setReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ==================== STATISTICAL CALCULATIONS ====================

  const calculateMean = useCallback((values) => {
    if (!Array.isArray(values) || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }, []);

  const calculateMedian = useCallback((values) => {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }, []);

  const calculateStdDev = useCallback((values, mean) => {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }, []);

  const calculatePercentile = useCallback((values, percentile) => {
    if (!Array.isArray(values) || values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }, []);

  // ==================== AGGREGATION FUNCTIONS ====================

  const aggregateByAlgorithm = useCallback(() => {
    try {
      const stats = {};

      metrics.forEach(metric => {
        if (!stats[metric.algorithm]) {
          stats[metric.algorithm] = {
            metrics: [],
            count: 0,
            totalTime: 0,
          };
        }

        const time = parseFloat(metric.executionTime);
        stats[metric.algorithm].metrics.push(time);
        stats[metric.algorithm].count++;
        stats[metric.algorithm].totalTime += time;
      });

      // Calculate statistics for each algorithm
      Object.keys(stats).forEach(algo => {
        const times = stats[algo].metrics;
        const mean = calculateMean(times);

        stats[algo] = {
          count: stats[algo].count,
          totalTime: stats[algo].totalTime,
          avgTime: mean,
          minTime: Math.min(...times),
          maxTime: Math.max(...times),
          stdDev: calculateStdDev(times, mean),
          median: calculateMedian(times),
          p25: calculatePercentile(times, 25),
          p75: calculatePercentile(times, 75),
          p95: calculatePercentile(times, 95),
        };
      });

      setAggregatedStats(stats);
      return stats;
    } catch (err) {
      setError(err);
      onError('Failed to aggregate by algorithm:', err);
      return {};
    }
  }, [metrics, calculateMean, calculateMedian, calculateStdDev, calculatePercentile, onError]);

  const aggregateByTimePeriod = useCallback((period = 'day') => {
    try {
      const grouped = {};

      metrics.forEach(metric => {
        const date = new Date(metric.timestamp);
        let key;

        switch (period) {
          case 'hour':
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
            break;
          case 'day':
            key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            break;
          case 'week':
            const week = Math.floor(date.getDate() / 7);
            key = `${date.getFullYear()}-${date.getMonth()}-W${week}`;
            break;
          case 'month':
            key = `${date.getFullYear()}-${date.getMonth()}`;
            break;
          default:
            key = date.toISOString().split('T')[0];
        }

        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push(parseFloat(metric.executionTime));
      });

      return Object.entries(grouped).map(([date, times]) => ({
        date,
        count: times.length,
        avgTime: calculateMean(times),
        totalTime: times.reduce((sum, t) => sum + t, 0),
      }));
    } catch (err) {
      setError(err);
      onError('Failed to aggregate by time period:', err);
      return [];
    }
  }, [metrics, calculateMean, onError]);

  // ==================== TREND ANALYSIS ====================

  const analyzeTrends = useCallback(() => {
    if (!enableTrends || metrics.length < minDataPoints) return;

    try {
      const periods = ['day', 'week', 'month'];
      const trendData = [];

      periods.forEach(period => {
        const data = aggregateByTimePeriod(period);
        if (data.length < 2) return;

        // Simple linear regression for trend
        const times = data.map((d, i) => ({ x: i, y: d.avgTime }));
        const n = times.length;
        const sumX = times.reduce((sum, p) => sum + p.x, 0);
        const sumY = times.reduce((sum, p) => sum + p.y, 0);
        const sumXY = times.reduce((sum, p) => sum + p.x * p.y, 0);
        const sumX2 = times.reduce((sum, p) => sum + p.x * p.x, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const change = ((slope * (n - 1)) / (sumY / n)) * 100;

        let trend = 'stable';
        if (change > 5) trend = 'increasing';
        else if (change < -5) trend = 'decreasing';

        trendData.push({
          period,
          data,
          trend,
          change: parseFloat(change.toFixed(2)),
          slope: parseFloat(slope.toFixed(4)),
        });
      });

      setTrends(trendData);
      return trendData;
    } catch (err) {
      setError(err);
      onError('Failed to analyze trends:', err);
      return [];
    }
  }, [enableTrends, metrics, minDataPoints, aggregateByTimePeriod, onError]);

  // ==================== INSIGHTS GENERATION ====================

  const generateInsights = useCallback(() => {
    if (!enableInsights || metrics.length < minDataPoints) return;

    try {
      const newInsights = [];
      const stats = aggregatedStats;

      // Insight 1: Best performing algorithm
      if (Object.keys(stats).length > 0) {
        const fastest = Object.entries(stats).reduce((best, [algo, data]) =>
          !best || data.avgTime < best.avgTime ? { algo, ...data } : best
        , null);

        if (fastest) {
          newInsights.push({
            type: 'success',
            title: 'Best Performance',
            message: `${fastest.algo} has the best average performance at ${fastest.avgTime.toFixed(2)}ms`,
            data: fastest,
          });
        }
      }

      // Insight 2: Performance consistency
      Object.entries(stats).forEach(([algo, data]) => {
        const cv = (data.stdDev / data.avgTime) * 100; // Coefficient of variation
        if (cv > 50) {
          newInsights.push({
            type: 'warning',
            title: 'High Variability',
            message: `${algo} shows high performance variability (CV: ${cv.toFixed(1)}%)`,
            data: { algorithm: algo, cv },
          });
        }
      });

      // Insight 3: Usage patterns
      const totalOps = metrics.length;
      Object.entries(stats).forEach(([algo, data]) => {
        const usage = (data.count / totalOps) * 100;
        if (usage < 5 && data.count > 2) {
          newInsights.push({
            type: 'info',
            title: 'Low Usage',
            message: `${algo} is rarely used (${usage.toFixed(1)}% of operations)`,
            data: { algorithm: algo, usage },
          });
        }
      });

      // Insight 4: Performance degradation
      if (trends.length > 0) {
        trends.forEach(trend => {
          if (trend.trend === 'increasing' && trend.change > 10) {
            newInsights.push({
              type: 'warning',
              title: 'Performance Degradation',
              message: `Performance is degrading over ${trend.period} (${trend.change.toFixed(1)}% increase)`,
              data: trend,
            });
          }
        });
      }

      // Insight 5: Efficiency opportunities
      const avgTimes = Object.values(stats).map(s => s.avgTime);
      const overallAvg = calculateMean(avgTimes);
      Object.entries(stats).forEach(([algo, data]) => {
        if (data.avgTime > overallAvg * 1.5 && data.count > minDataPoints) {
          newInsights.push({
            type: 'info',
            title: 'Optimization Opportunity',
            message: `${algo} is ${((data.avgTime / overallAvg - 1) * 100).toFixed(0)}% slower than average`,
            data: { algorithm: algo, avgTime: data.avgTime, overallAvg },
          });
        }
      });

      setInsights(newInsights);

      // Call callback if provided
      if (onInsight && typeof onInsight === 'function') {
        newInsights.forEach(insight => onInsight(insight));
      }

      return newInsights;
    } catch (err) {
      setError(err);
      onError('Failed to generate insights:', err);
      return [];
    }
  }, [
    enableInsights,
    metrics,
    minDataPoints,
    aggregatedStats,
    trends,
    calculateMean,
    onInsight,
    onError,
  ]);

  // ==================== PREDICTIONS ====================

  const generatePredictions = useCallback(() => {
    if (!enablePredictions || metrics.length < minDataPoints * 2) return;

    try {
      const predictions = {};

      Object.entries(aggregatedStats).forEach(([algo, stats]) => {
        // Simple moving average for next execution time prediction
        const recentMetrics = metrics
          .filter(m => m.algorithm === algo)
          .slice(0, minDataPoints)
          .map(m => parseFloat(m.executionTime));

        if (recentMetrics.length < minDataPoints) return;

        const prediction = calculateMean(recentMetrics);
        const confidence = Math.max(0, 100 - (stats.stdDev / stats.avgTime) * 100);

        predictions[algo] = {
          nextExecutionTime: prediction,
          confidence: confidence.toFixed(1),
          basedOn: recentMetrics.length,
        };
      });

      setPredictions(predictions);
      return predictions;
    } catch (err) {
      setError(err);
      onError('Failed to generate predictions:', err);
      return {};
    }
  }, [enablePredictions, metrics, minDataPoints, aggregatedStats, calculateMean, onError]);

  // ==================== COMPARISON ====================

  const compareAlgorithms = useCallback((algo1, algo2) => {
    if (typeof algo1 !== 'string' || typeof algo2 !== 'string') {
      const err = new Error('compareAlgorithms: algorithm names must be strings');
      setError(err);
      onError(err);
      return null;
    }

    try {
      const stats1 = aggregatedStats[algo1];
      const stats2 = aggregatedStats[algo2];

      if (!stats1 || !stats2) {
        throw new Error('One or both algorithms not found in statistics');
      }

      const metrics = {
        avgTime: {
          [algo1]: stats1.avgTime,
          [algo2]: stats2.avgTime,
          winner: stats1.avgTime < stats2.avgTime ? algo1 : algo2,
          difference: Math.abs(stats1.avgTime - stats2.avgTime).toFixed(2),
        },
        consistency: {
          [algo1]: stats1.stdDev,
          [algo2]: stats2.stdDev,
          winner: stats1.stdDev < stats2.stdDev ? algo1 : algo2,
          difference: Math.abs(stats1.stdDev - stats2.stdDev).toFixed(2),
        },
        usage: {
          [algo1]: stats1.count,
          [algo2]: stats2.count,
          winner: stats1.count > stats2.count ? algo1 : algo2,
        },
      };

      const winner = metrics.avgTime.winner;
      const improvement = ((Math.max(stats1.avgTime, stats2.avgTime) - Math.min(stats1.avgTime, stats2.avgTime)) / Math.max(stats1.avgTime, stats2.avgTime) * 100).toFixed(1);

      const analysis = `${winner} performs ${improvement}% better on average than ${winner === algo1 ? algo2 : algo1}`;

      return {
        algorithm1: algo1,
        algorithm2: algo2,
        metrics,
        winner,
        analysis,
      };
    } catch (err) {
      setError(err);
      onError('Failed to compare algorithms:', err);
      return null;
    }
  }, [aggregatedStats, onError]);

  // ==================== REPORT GENERATION ====================

  const generateReport = useCallback((period = 'all') => {
    try {
      setIsAnalyzing(true);

      const summary = {
        totalOperations: metrics.length,
        algorithms: Object.keys(aggregatedStats).length,
        period,
        dateRange: metrics.length > 0 ? {
          start: metrics[metrics.length - 1].timestamp,
          end: metrics[0].timestamp,
        } : null,
      };

      const recommendations = [];

      // Generate recommendations
      if (insights.length > 0) {
        const warningInsights = insights.filter(i => i.type === 'warning');
        if (warningInsights.length > 0) {
          recommendations.push('Address performance warnings to improve efficiency');
        }

        const infoInsights = insights.filter(i => i.type === 'info');
        if (infoInsights.length > 0) {
          recommendations.push('Consider optimizing algorithms with low usage or high execution times');
        }
      }

      if (Object.keys(aggregatedStats).length > 1) {
        const fastest = Object.entries(aggregatedStats).reduce((best, [algo, data]) =>
          !best || data.avgTime < best.avgTime ? algo : best
        , null);
        recommendations.push(`Consider using ${fastest} for better performance`);
      }

      const reportData = {
        generatedAt: new Date().toISOString(),
        period,
        summary,
        algorithms: aggregatedStats,
        trends,
        insights,
        predictions: enablePredictions ? predictions : null,
        recommendations,
      };

      setReport(reportData);
      setIsAnalyzing(false);
      return reportData;
    } catch (err) {
      setError(err);
      onError('Failed to generate report:', err);
      setIsAnalyzing(false);
      return null;
    }
  }, [metrics, aggregatedStats, trends, insights, predictions, enablePredictions, onError]);

  // ==================== AUTO REFRESH ====================

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // ==================== REFRESH ====================

  const refresh = useCallback(() => {
    try {
      aggregateByAlgorithm();
      analyzeTrends();
      generateInsights();
      generatePredictions();
      setLastUpdate(new Date().toISOString());
    } catch (err) {
      setError(err);
      onError('Failed to refresh statistics:', err);
    }
  }, [aggregateByAlgorithm, analyzeTrends, generateInsights, generatePredictions, onError]);

  // Initial analysis
  useEffect(() => {
    if (metrics.length >= minDataPoints) {
      refresh();
    }
  }, [metrics.length, minDataPoints]);

  // ==================== COMPUTED VALUES ====================

  const hasEnoughData = useMemo(() => {
    return metrics.length >= minDataPoints;
  }, [metrics.length, minDataPoints]);

  const topPerformers = useMemo(() => {
    return Object.entries(aggregatedStats)
      .map(([algo, stats]) => ({ algorithm: algo, ...stats }))
      .sort((a, b) => a.avgTime - b.avgTime)
      .slice(0, 3);
  }, [aggregatedStats]);

  const worstPerformers = useMemo(() => {
    return Object.entries(aggregatedStats)
      .map(([algo, stats]) => ({ algorithm: algo, ...stats }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 3);
  }, [aggregatedStats]);

  // ==================== RETURN ====================

  return {
    // State
    aggregatedStats,
    trends,
    insights,
    predictions,
    report,
    isAnalyzing,
    error,
    lastUpdate,

    // Analysis functions
    aggregateByAlgorithm,
    aggregateByTimePeriod,
    analyzeTrends,
    generateInsights,
    generatePredictions,
    compareAlgorithms,
    generateReport,
    refresh,

    // Computed values
    hasEnoughData,
    topPerformers,
    worstPerformers,
  };
};

// Export PropTypes
export {
  UseStatisticsOptionsPropTypes,
  MetricPropTypes,
  AggregatedStatsPropTypes,
  TrendDataPropTypes,
  InsightPropTypes,
  ComparisonResultPropTypes,
  ReportPropTypes,
};

export default useStatistics;