// src/hooks/useVisualization.js

import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * useVisualization Hook
 * Custom hook for managing cipher visualization data
 */

// PropTypes for hook options
const UseVisualizationOptionsPropTypes = PropTypes.shape({
  autoUpdate: PropTypes.bool,
  enableAnimations: PropTypes.bool,
  maxHistorySize: PropTypes.number,
});

// PropTypes for visualization data
const VisualizationDataPropTypes = PropTypes.shape({
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  timestamp: PropTypes.string.isRequired,
  algorithm: PropTypes.string,
});

/**
 * Main useVisualization hook
 */
const useVisualization = (options = {}) => {
  // Validate options
  if (options && typeof options !== 'object') {
    console.error('useVisualization: options must be an object');
  }

  // Default options
  const {
    autoUpdate = true,
    enableAnimations = true,
    maxHistorySize = 10,
  } = options;

  // ==================== STATE ====================

  const [currentVisualization, setCurrentVisualization] = useState(null);
  const [visualizationHistory, setVisualizationHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1); // 1x speed
  const [highlightedElements, setHighlightedElements] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  // ==================== VISUALIZATION MANAGEMENT ====================

  const setVisualization = useCallback((vizData) => {
    if (!vizData || typeof vizData !== 'object') {
      console.error('setVisualization: vizData must be an object');
      return;
    }

    const visualization = {
      ...vizData,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };

    setCurrentVisualization(visualization);

    if (autoUpdate) {
      setVisualizationHistory(prev => {
        const newHistory = [visualization, ...prev].slice(0, maxHistorySize);
        return newHistory;
      });
    }

    // Reset animation state
    setActiveStep(0);
    setHighlightedElements([]);
  }, [autoUpdate, maxHistorySize]);

  const updateVisualization = useCallback((updates) => {
    if (!updates || typeof updates !== 'object') {
      console.error('updateVisualization: updates must be an object');
      return;
    }

    setCurrentVisualization(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        timestamp: new Date().toISOString(),
      };
    });
  }, []);

  const clearVisualization = useCallback(() => {
    setCurrentVisualization(null);
    setActiveStep(0);
    setHighlightedElements([]);
    setIsAnimating(false);
  }, []);

  const clearHistory = useCallback(() => {
    setVisualizationHistory([]);
  }, []);

  // ==================== ANIMATION CONTROL ====================

  const startAnimation = useCallback(() => {
    if (!currentVisualization) {
      console.warn('No visualization data available for animation');
      return;
    }

    setIsAnimating(true);
    setActiveStep(0);
  }, [currentVisualization]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const pauseAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  const resetAnimation = useCallback(() => {
    setIsAnimating(false);
    setActiveStep(0);
    setHighlightedElements([]);
  }, []);

  const nextStep = useCallback(() => {
    if (!currentVisualization) return;

    const maxSteps = getMaxSteps(currentVisualization);
    setActiveStep(prev => Math.min(prev + 1, maxSteps - 1));
  }, [currentVisualization]);

  const previousStep = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    if (typeof step !== 'number' || step < 0) {
      console.error('goToStep: step must be a non-negative number');
      return;
    }

    const maxSteps = getMaxSteps(currentVisualization);
    setActiveStep(Math.min(step, maxSteps - 1));
  }, [currentVisualization]);

  const setSpeed = useCallback((speed) => {
    if (typeof speed !== 'number' || speed <= 0) {
      console.error('setSpeed: speed must be a positive number');
      return;
    }

    setAnimationSpeed(speed);
  }, []);

  // ==================== HIGHLIGHTING ====================

  const highlightElement = useCallback((elementId) => {
    if (typeof elementId !== 'string' && typeof elementId !== 'number') {
      console.error('highlightElement: elementId must be a string or number');
      return;
    }

    setHighlightedElements(prev => {
      if (!prev.includes(elementId)) {
        return [...prev, elementId];
      }
      return prev;
    });
  }, []);

  const unhighlightElement = useCallback((elementId) => {
    if (typeof elementId !== 'string' && typeof elementId !== 'number') {
      console.error('unhighlightElement: elementId must be a string or number');
      return;
    }

    setHighlightedElements(prev => prev.filter(id => id !== elementId));
  }, []);

  const clearHighlights = useCallback(() => {
    setHighlightedElements([]);
  }, []);

  const highlightMultiple = useCallback((elementIds) => {
    if (!Array.isArray(elementIds)) {
      console.error('highlightMultiple: elementIds must be an array');
      return;
    }

    setHighlightedElements(elementIds);
  }, []);

  const isHighlighted = useCallback((elementId) => {
    return highlightedElements.includes(elementId);
  }, [highlightedElements]);

  // ==================== UTILITIES ====================

  const getMaxSteps = useCallback((vizData) => {
    if (!vizData || !vizData.data) return 0;

    // Different visualization types have different step counts
    switch (vizData.type) {
      case 'caesar':
        return vizData.data.mapping?.length || 0;
      case 'vigenere':
        return vizData.data.mapping?.length || 0;
      case 'playfair':
        return vizData.data.digraphs?.length || 0;
      case 'hill':
        return vizData.data.steps?.length || 0;
      case 'railfence':
        return vizData.data.pattern?.length || 0;
      case 'columnar':
        return vizData.data.columns?.length || 0;
      default:
        return 0;
    }
  }, []);

  const hasVisualization = useMemo(() => {
    return currentVisualization !== null;
  }, [currentVisualization]);

  const canAnimate = useMemo(() => {
    return hasVisualization && enableAnimations && getMaxSteps(currentVisualization) > 0;
  }, [hasVisualization, enableAnimations, currentVisualization]);

  const progress = useMemo(() => {
    if (!currentVisualization) return 0;
    const maxSteps = getMaxSteps(currentVisualization);
    if (maxSteps === 0) return 0;
    return ((activeStep + 1) / maxSteps) * 100;
  }, [activeStep, currentVisualization]);

  const getCurrentStepData = useCallback(() => {
    if (!currentVisualization || !currentVisualization.data) return null;

    const { type, data } = currentVisualization;

    switch (type) {
      case 'caesar':
      case 'vigenere':
        return data.mapping?.[activeStep] || null;
      case 'playfair':
        return data.digraphs?.[activeStep] || null;
      case 'hill':
        return data.steps?.[activeStep] || null;
      case 'railfence':
        return data.pattern?.[activeStep] || null;
      case 'columnar':
        return data.columns?.[activeStep] || null;
      default:
        return null;
    }
  }, [currentVisualization, activeStep]);

  const loadFromHistory = useCallback((index) => {
    if (typeof index !== 'number' || index < 0 || index >= visualizationHistory.length) {
      console.error('loadFromHistory: invalid index');
      return;
    }

    setCurrentVisualization(visualizationHistory[index]);
    resetAnimation();
  }, [visualizationHistory, resetAnimation]);

  const exportVisualization = useCallback((format = 'json') => {
    if (!currentVisualization) {
      console.warn('No visualization to export');
      return null;
    }

    if (format === 'json') {
      return JSON.stringify(currentVisualization, null, 2);
    } else if (format === 'csv') {
      // Convert visualization data to CSV format
      const data = getCurrentStepData();
      if (!data) return null;

      const headers = Object.keys(data);
      const values = Object.values(data);
      return `${headers.join(',')}\n${values.join(',')}`;
    }

    return null;
  }, [currentVisualization, getCurrentStepData]);

  const getAnimationFrames = useCallback(() => {
    if (!currentVisualization) return [];

    const maxSteps = getMaxSteps(currentVisualization);
    const frames = [];

    for (let i = 0; i < maxSteps; i++) {
      frames.push({
        step: i,
        duration: 1000 / animationSpeed,
        data: getCurrentStepData(),
      });
    }

    return frames;
  }, [currentVisualization, animationSpeed, getMaxSteps, getCurrentStepData]);

  // ==================== PLAYBACK CONTROLS ====================

  const playbackControls = useMemo(() => ({
    play: startAnimation,
    pause: pauseAnimation,
    stop: stopAnimation,
    resume: resumeAnimation,
    reset: resetAnimation,
    next: nextStep,
    previous: previousStep,
    goTo: goToStep,
    speed: animationSpeed,
    setSpeed,
    isPlaying: isAnimating,
  }), [
    startAnimation,
    pauseAnimation,
    stopAnimation,
    resumeAnimation,
    resetAnimation,
    nextStep,
    previousStep,
    goToStep,
    animationSpeed,
    setSpeed,
    isAnimating,
  ]);

  // ==================== VISUALIZATION TYPES ====================

  const getVisualizationComponent = useCallback((type) => {
    const componentMap = {
      caesar: 'CaesarViz',
      vigenere: 'VigenereViz',
      beaufort: 'BeaufortViz',
      autokey: 'AutokeyViz',
      playfair: 'PlayfairGrid',
      hill: 'HillMatrixViz',
      railfence: 'RailFenceViz',
      columnar: 'ColumnarViz',
      myszkowski: 'MyszkowskiViz',
      double: 'DoubleTranspositionViz',
    };

    return componentMap[type] || null;
  }, []);

  // ==================== RETURN ====================

  return {
    // State
    currentVisualization,
    visualizationHistory,
    isAnimating,
    animationSpeed,
    highlightedElements,
    activeStep,
    progress,
    hasVisualization,
    canAnimate,

    // Visualization management
    setVisualization,
    updateVisualization,
    clearVisualization,
    clearHistory,
    loadFromHistory,

    // Animation control
    playbackControls,
    startAnimation,
    stopAnimation,
    pauseAnimation,
    resumeAnimation,
    resetAnimation,
    nextStep,
    previousStep,
    goToStep,
    setSpeed,

    // Highlighting
    highlightElement,
    unhighlightElement,
    clearHighlights,
    highlightMultiple,
    isHighlighted,

    // Utilities
    getMaxSteps,
    getCurrentStepData,
    exportVisualization,
    getAnimationFrames,
    getVisualizationComponent,
  };
};

// Export PropTypes
export { 
  UseVisualizationOptionsPropTypes, 
  VisualizationDataPropTypes 
};

export default useVisualization;