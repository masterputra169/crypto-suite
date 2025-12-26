// src/hooks/useCipher.js

import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * useCipher Hook
 * Custom hook untuk cipher operations dengan state management
 * Dapat digunakan standalone atau dengan CipherContext
 */

// PropTypes for hook options
const UseCipherOptionsPropTypes = PropTypes.shape({
  initialMode: PropTypes.oneOf(['encrypt', 'decrypt']),
  initialKey: PropTypes.string,
  initialShift: PropTypes.number,
  initialRails: PropTypes.number,
  autoSave: PropTypes.bool,
  maxHistorySize: PropTypes.number,
});

// PropTypes for cipher operation
const CipherOperationPropTypes = PropTypes.shape({
  algorithm: PropTypes.string.isRequired,
  encryptFn: PropTypes.func.isRequired,
  decryptFn: PropTypes.func.isRequired,
  getVisualizationFn: PropTypes.func,
});

/**
 * Main useCipher hook
 */
const useCipher = (options = {}) => {
  // Validate options
  if (options && typeof options !== 'object') {
    console.error('useCipher: options must be an object');
  }

  // Default options
  const {
    initialMode = 'encrypt',
    initialKey = '',
    initialShift = 3,
    initialRails = 3,
    autoSave = false,
    maxHistorySize = 50,
  } = options;

  // ==================== STATE ====================

  const [state, setState] = useState({
    inputText: '',
    outputText: '',
    key: initialKey,
    secondKey: '',
    shift: initialShift,
    rails: initialRails,
    mode: initialMode,
    algorithm: null,
    keyMatrix: [[0, 0], [0, 0]],
    error: null,
    isProcessing: false,
    visualization: null,
  });

  const [history, setHistory] = useState([]);
  const [lastOperation, setLastOperation] = useState(null);

  // ==================== LOAD/SAVE ====================

  useEffect(() => {
    if (autoSave) {
      loadFromStorage();
    }
  }, [autoSave]);

  useEffect(() => {
    if (autoSave && history.length > 0) {
      saveToStorage();
    }
  }, [autoSave, history]);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('cipher_hook_state');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.history) {
          setHistory(data.history.slice(0, maxHistorySize));
        }
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }, [maxHistorySize]);

  const saveToStorage = useCallback(() => {
    try {
      const data = {
        history: history.slice(0, maxHistorySize),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('cipher_hook_state', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }, [history, maxHistorySize]);

  // ==================== SETTERS ====================

  const setInputText = useCallback((text) => {
    if (typeof text !== 'string') {
      console.error('setInputText: text must be a string');
      return;
    }
    setState(prev => ({ ...prev, inputText: text, error: null }));
  }, []);

  const setOutputText = useCallback((text) => {
    if (typeof text !== 'string') {
      console.error('setOutputText: text must be a string');
      return;
    }
    setState(prev => ({ ...prev, outputText: text }));
  }, []);

  const setKey = useCallback((key) => {
    if (typeof key !== 'string' && typeof key !== 'number') {
      console.error('setKey: key must be a string or number');
      return;
    }
    setState(prev => ({ ...prev, key: String(key), error: null }));
  }, []);

  const setSecondKey = useCallback((key) => {
    if (typeof key !== 'string') {
      console.error('setSecondKey: key must be a string');
      return;
    }
    setState(prev => ({ ...prev, secondKey: key, error: null }));
  }, []);

  const setShift = useCallback((shift) => {
    const num = Number(shift);
    if (isNaN(num)) {
      console.error('setShift: shift must be a number');
      return;
    }
    setState(prev => ({ ...prev, shift: num, error: null }));
  }, []);

  const setRails = useCallback((rails) => {
    const num = Number(rails);
    if (isNaN(num) || num < 2) {
      console.error('setRails: rails must be a number >= 2');
      return;
    }
    setState(prev => ({ ...prev, rails: num, error: null }));
  }, []);

  const setMode = useCallback((mode) => {
    if (mode !== 'encrypt' && mode !== 'decrypt') {
      console.error('setMode: mode must be "encrypt" or "decrypt"');
      return;
    }
    setState(prev => ({ ...prev, mode, error: null }));
  }, []);

  const setAlgorithm = useCallback((algorithm) => {
    if (algorithm !== null && typeof algorithm !== 'string') {
      console.error('setAlgorithm: algorithm must be a string or null');
      return;
    }
    setState(prev => ({ ...prev, algorithm, error: null }));
  }, []);

  const setKeyMatrix = useCallback((matrix) => {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
      console.error('setKeyMatrix: matrix must be a 2D array');
      return;
    }
    setState(prev => ({ ...prev, keyMatrix: matrix, error: null }));
  }, []);

  const setError = useCallback((error) => {
    if (error !== null && typeof error !== 'string') {
      console.error('setError: error must be a string or null');
      return;
    }
    setState(prev => ({ ...prev, error }));
  }, []);

  const setVisualization = useCallback((visualization) => {
    setState(prev => ({ ...prev, visualization }));
  }, []);

  // ==================== CIPHER OPERATIONS ====================

  const getAlgorithmParams = useCallback((algorithm, currentState) => {
    switch (algorithm) {
      case 'caesar':
        return [currentState.shift];
      case 'vigenere':
      case 'beaufort':
      case 'autokey':
      case 'playfair':
        return [currentState.key];
      case 'hill':
        return [currentState.keyMatrix];
      case 'railfence':
        return [currentState.rails];
      case 'columnar':
      case 'myszkowski':
        return [currentState.key];
      case 'double':
        return [currentState.key, currentState.secondKey || currentState.key];
      default:
        return [];
    }
  }, []);

  const process = useCallback(async (operation) => {
    // Validate operation
    if (!operation || typeof operation !== 'object') {
      throw new Error('Operation must be an object');
    }
    if (typeof operation.algorithm !== 'string') {
      throw new Error('Algorithm must be a string');
    }
    if (typeof operation.encryptFn !== 'function' || typeof operation.decryptFn !== 'function') {
      throw new Error('Encrypt and decrypt functions must be provided');
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));

      const { algorithm, encryptFn, decryptFn, getVisualizationFn } = operation;

      // Validate input
      if (!state.inputText.trim()) {
        throw new Error('Please enter text to process');
      }

      // Get parameters for algorithm
      const params = getAlgorithmParams(algorithm, state);

      // Execute cipher operation
      let result;
      if (state.mode === 'encrypt') {
        result = await encryptFn(state.inputText, ...params);
      } else {
        result = await decryptFn(state.inputText, ...params);
      }

      // Get visualization if function provided
      let viz = null;
      if (getVisualizationFn && typeof getVisualizationFn === 'function') {
        viz = getVisualizationFn(state.inputText, ...params);
      }

      // Create operation record
      const operationRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        algorithm,
        mode: state.mode,
        inputText: state.inputText,
        outputText: result,
        key: algorithm === 'hill' ? state.keyMatrix : state.key,
        secondKey: state.secondKey,
        shift: state.shift,
        rails: state.rails,
      };

      // Update state
      setState(prev => ({
        ...prev,
        outputText: result,
        visualization: viz,
        isProcessing: false,
      }));

      // Add to history
      setHistory(prev => [operationRecord, ...prev].slice(0, maxHistorySize));
      setLastOperation(operationRecord);

      return {
        result,
        visualization: viz,
        operation: operationRecord,
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isProcessing: false,
      }));
      throw error;
    }
  }, [state, maxHistorySize, getAlgorithmParams]);

  // ==================== HISTORY MANAGEMENT ====================

  const clearHistory = useCallback(() => {
    setHistory([]);
    setLastOperation(null);
  }, []);

  const removeFromHistory = useCallback((id) => {
    if (typeof id !== 'number') {
      console.error('removeFromHistory: id must be a number');
      return;
    }
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const loadFromHistory = useCallback((operation) => {
    if (!operation || typeof operation !== 'object') {
      console.error('loadFromHistory: operation must be an object');
      return;
    }

    setState(prev => ({
      ...prev,
      inputText: operation.inputText || '',
      outputText: operation.outputText || '',
      key: operation.key || '',
      secondKey: operation.secondKey || '',
      shift: operation.shift || initialShift,
      rails: operation.rails || initialRails,
      mode: operation.mode || 'encrypt',
      algorithm: operation.algorithm || null,
      keyMatrix: operation.keyMatrix || [[0, 0], [0, 0]],
    }));
  }, [initialShift, initialRails]);

  // ==================== RESET ====================

  const reset = useCallback(() => {
    setState({
      inputText: '',
      outputText: '',
      key: initialKey,
      secondKey: '',
      shift: initialShift,
      rails: initialRails,
      mode: initialMode,
      algorithm: null,
      keyMatrix: [[0, 0], [0, 0]],
      error: null,
      isProcessing: false,
      visualization: null,
    });
  }, [initialKey, initialShift, initialRails, initialMode]);

  const resetAll = useCallback(() => {
    reset();
    setHistory([]);
    setLastOperation(null);
    if (autoSave) {
      localStorage.removeItem('cipher_hook_state');
    }
  }, [reset, autoSave]);

  // ==================== UTILITIES ====================

  const canProcess = useCallback(() => {
    return state.inputText.trim().length > 0 && !state.isProcessing;
  }, [state.inputText, state.isProcessing]);

  const getStatistics = useCallback(() => {
    const algorithmCounts = {};
    const modeCounts = { encrypt: 0, decrypt: 0 };

    history.forEach(op => {
      algorithmCounts[op.algorithm] = (algorithmCounts[op.algorithm] || 0) + 1;
      modeCounts[op.mode]++;
    });

    return {
      totalOperations: history.length,
      algorithmCounts,
      modeCounts,
      recentOperations: history.slice(0, 5),
    };
  }, [history]);

  const exportHistory = useCallback(() => {
    return JSON.stringify({
      history,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    }, null, 2);
  }, [history]);

  const importHistory = useCallback((jsonString) => {
    if (typeof jsonString !== 'string') {
      console.error('importHistory: jsonString must be a string');
      return false;
    }

    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.history)) {
        setHistory(data.history.slice(0, maxHistorySize));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }, [maxHistorySize]);

  // ==================== RETURN ====================

  return {
    // State
    ...state,
    history,
    lastOperation,

    // Setters
    setInputText,
    setOutputText,
    setKey,
    setSecondKey,
    setShift,
    setRails,
    setMode,
    setAlgorithm,
    setKeyMatrix,
    setError,
    setVisualization,

    // Operations
    process,
    reset,
    resetAll,

    // History
    clearHistory,
    removeFromHistory,
    loadFromHistory,

    // Utilities
    canProcess,
    getStatistics,
    exportHistory,
    importHistory,
  };
};

// Export PropTypes
export { UseCipherOptionsPropTypes, CipherOperationPropTypes };

export default useCipher;