// src/utils/statistics/performanceTracker.js

/**
 * Performance Tracker
 * Melacak waktu eksekusi, memory usage, dan metrics lainnya
 */

class PerformanceTracker {
  constructor() {
    this.metrics = [];
    this.currentOperation = null;
  }

  /**
   * Mulai tracking operation
   */
  start(operationName, metadata = {}) {
    this.currentOperation = {
      name: operationName,
      metadata,
      startTime: performance.now(),
      startMemory: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Stop tracking dan simpan metrics
   */
  stop(additionalData = {}) {
    if (!this.currentOperation) {
      console.warn('No operation currently being tracked');
      return null;
    }

    const endTime = performance.now();
    const endMemory = this.getMemoryUsage();

    const metric = {
      ...this.currentOperation,
      endTime,
      endMemory,
      duration: endTime - this.currentOperation.startTime,
      memoryDelta: endMemory - this.currentOperation.startMemory,
      ...additionalData
    };

    this.metrics.push(metric);
    this.currentOperation = null;

    return metric;
  }

  /**
   * Get memory usage (if available)
   */
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return [...this.metrics];
  }

  /**
   * Get metrics by operation name
   */
  getMetricsByName(operationName) {
    return this.metrics.filter(m => m.name === operationName);
  }

  /**
   * Get average duration for operation
   */
  getAverageDuration(operationName) {
    const operations = this.getMetricsByName(operationName);
    if (operations.length === 0) return 0;

    const totalDuration = operations.reduce((sum, op) => sum + op.duration, 0);
    return totalDuration / operations.length;
  }

  /**
   * Get statistics summary
   */
  getSummary(operationName = null) {
    const operations = operationName 
      ? this.getMetricsByName(operationName)
      : this.metrics;

    if (operations.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        totalDuration: 0
      };
    }

    const durations = operations.map(op => op.duration);
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);

    return {
      count: operations.length,
      avgDuration: totalDuration / operations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration,
      operations: operations.length
    };
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
    this.currentOperation = null;
  }

  /**
   * Export metrics as JSON
   */
  exportJSON() {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Export metrics as CSV
   */
  exportCSV() {
    if (this.metrics.length === 0) return '';

    const headers = ['timestamp', 'name', 'duration', 'startMemory', 'endMemory', 'memoryDelta'];
    const rows = this.metrics.map(m => [
      m.timestamp,
      m.name,
      m.duration.toFixed(2),
      m.startMemory ? m.startMemory.usedJSHeapSize : 'N/A',
      m.endMemory ? m.endMemory.usedJSHeapSize : 'N/A',
      m.memoryDelta ? m.memoryDelta.usedJSHeapSize : 'N/A'
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }

  /**
   * Get performance score (0-100)
   */
  getPerformanceScore(operationName) {
    const summary = this.getSummary(operationName);
    if (summary.count === 0) return 0;

    // Score based on average duration
    // < 10ms = 100, 10-50ms = 80, 50-100ms = 60, 100-500ms = 40, > 500ms = 20
    const avgDuration = summary.avgDuration;
    
    if (avgDuration < 10) return 100;
    if (avgDuration < 50) return 80;
    if (avgDuration < 100) return 60;
    if (avgDuration < 500) return 40;
    return 20;
  }
}

// Create singleton instance (but don't export as default)
const performanceTrackerInstance = new PerformanceTracker();

// Export only named functions (NO DEFAULT EXPORT)
export const startTracking = (name, metadata) => performanceTrackerInstance.start(name, metadata);
export const stopTracking = (data) => performanceTrackerInstance.stop(data);
export const getMetrics = () => performanceTrackerInstance.getMetrics();
export const getSummary = (name) => performanceTrackerInstance.getSummary(name);
export const clearMetrics = () => performanceTrackerInstance.clear();
export const exportMetricsJSON = () => performanceTrackerInstance.exportJSON();
export const exportMetricsCSV = () => performanceTrackerInstance.exportCSV();