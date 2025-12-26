// src/context/CipherContext.jsx

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CipherContext - Global state management untuk cipher operations
 * Manages: input, output, keys, mode, history, configurations
 */

// ==================== PROP TYPES DEFINITIONS ====================

// Operation PropTypes
const OperationPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  timestamp: PropTypes.string.isRequired,
  algorithm: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['encrypt', 'decrypt']).isRequired,
  inputText: PropTypes.string.isRequired,
  outputText: PropTypes.string.isRequired,
  key: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  ]),
  secondKey: PropTypes.string,
  shift: PropTypes.number,
  rails: PropTypes.number,
});

// Configuration PropTypes
const ConfigurationPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  algorithm: PropTypes.string,
  key: PropTypes.string,
  keyMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  secondKey: PropTypes.string,
  shift: PropTypes.number,
  rails: PropTypes.number,
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
});

// Preferences PropTypes
const PreferencesPropTypes = PropTypes.shape({
  autoSave: PropTypes.bool.isRequired,
  showVisualizations: PropTypes.bool.isRequired,
  soundEffects: PropTypes.bool.isRequired,
  animationsEnabled: PropTypes.bool.isRequired,
  defaultMode: PropTypes.oneOf(['encrypt', 'decrypt']).isRequired,
  maxHistoryItems: PropTypes.number.isRequired,
});

// State PropTypes
const StatePropTypes = PropTypes.shape({
  inputText: PropTypes.string.isRequired,
  outputText: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  keyMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  secondKey: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['encrypt', 'decrypt']).isRequired,
  algorithm: PropTypes.string,
  shift: PropTypes.number.isRequired,
  rails: PropTypes.number.isRequired,
  error: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  visualization: PropTypes.object,
  lastOperation: OperationPropTypes,
});

// Context Value PropTypes
const CipherContextValuePropTypes = PropTypes.shape({
  // State
  inputText: PropTypes.string.isRequired,
  outputText: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  keyMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  secondKey: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['encrypt', 'decrypt']).isRequired,
  algorithm: PropTypes.string,
  shift: PropTypes.number.isRequired,
  rails: PropTypes.number.isRequired,
  error: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  visualization: PropTypes.object,
  lastOperation: OperationPropTypes,
  history: PropTypes.arrayOf(OperationPropTypes).isRequired,
  savedConfigs: PropTypes.arrayOf(ConfigurationPropTypes).isRequired,
  preferences: PreferencesPropTypes.isRequired,

  // Setters
  setInputText: PropTypes.func.isRequired,
  setOutputText: PropTypes.func.isRequired,
  setKey: PropTypes.func.isRequired,
  setKeyMatrix: PropTypes.func.isRequired,
  setSecondKey: PropTypes.func.isRequired,
  setMode: PropTypes.func.isRequired,
  setAlgorithm: PropTypes.func.isRequired,
  setShift: PropTypes.func.isRequired,
  setRails: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setIsProcessing: PropTypes.func.isRequired,
  setVisualization: PropTypes.func.isRequired,
  updateState: PropTypes.func.isRequired,

  // Operations
  processCipher: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  resetAll: PropTypes.func.isRequired,

  // History management
  addToHistory: PropTypes.func.isRequired,
  clearHistory: PropTypes.func.isRequired,
  removeHistoryItem: PropTypes.func.isRequired,
  loadFromHistory: PropTypes.func.isRequired,

  // Configuration management
  saveConfiguration: PropTypes.func.isRequired,
  loadConfiguration: PropTypes.func.isRequired,
  deleteConfiguration: PropTypes.func.isRequired,

  // Preferences
  updatePreferences: PropTypes.func.isRequired,

  // Import/Export
  exportHistory: PropTypes.func.isRequired,
  importHistory: PropTypes.func.isRequired,

  // Statistics
  getStatistics: PropTypes.func.isRequired,
});

// ==================== CONTEXT CREATION ====================

const CipherContext = createContext(null);

// Storage keys
const STORAGE_KEYS = {
  HISTORY: 'cipher_history',
  CONFIGS: 'cipher_configs',
  PREFERENCES: 'cipher_preferences',
};

// Default state
const DEFAULT_STATE = {
  inputText: '',
  outputText: '',
  key: '',
  keyMatrix: [[0, 0], [0, 0]],
  secondKey: '',
  mode: 'encrypt',
  algorithm: null,
  shift: 3,
  rails: 3,
  error: null,
  isProcessing: false,
  visualization: null,
  lastOperation: null,
};

// Default preferences
const DEFAULT_PREFERENCES = {
  autoSave: false,
  showVisualizations: true,
  soundEffects: false,
  animationsEnabled: true,
  defaultMode: 'encrypt',
  maxHistoryItems: 50,
};

// ==================== PROVIDER COMPONENT ====================

export const CipherProvider = ({ children }) => {
  // Main state
  const [state, setState] = useState(DEFAULT_STATE);
  
  // History state
  const [history, setHistory] = useState([]);
  
  // Saved configurations
  const [savedConfigs, setSavedConfigs] = useState([]);
  
  // User preferences
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Load data from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Save to localStorage when history or configs change
  useEffect(() => {
    saveToStorage();
  }, [history, savedConfigs, preferences]);

  // ==================== STORAGE FUNCTIONS ====================

  const loadFromStorage = useCallback(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      const storedConfigs = localStorage.getItem(STORAGE_KEYS.CONFIGS);
      const storedPreferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);

      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      if (storedConfigs) {
        setSavedConfigs(JSON.parse(storedConfigs));
      }
      if (storedPreferences) {
        setPreferences(prev => ({ ...prev, ...JSON.parse(storedPreferences) }));
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }, []);

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(savedConfigs));
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }, [history, savedConfigs, preferences]);

  // ==================== STATE UPDATERS ====================

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setInputText = useCallback((text) => {
    if (typeof text !== 'string') {
      console.error('setInputText: text must be a string');
      return;
    }
    updateState({ inputText: text, error: null });
  }, [updateState]);

  const setOutputText = useCallback((text) => {
    if (typeof text !== 'string') {
      console.error('setOutputText: text must be a string');
      return;
    }
    updateState({ outputText: text });
  }, [updateState]);

  const setKey = useCallback((key) => {
    if (typeof key !== 'string') {
      console.error('setKey: key must be a string');
      return;
    }
    updateState({ key, error: null });
  }, [updateState]);

  const setKeyMatrix = useCallback((matrix) => {
    if (!Array.isArray(matrix) || !Array.isArray(matrix[0])) {
      console.error('setKeyMatrix: matrix must be a 2D array');
      return;
    }
    updateState({ keyMatrix: matrix, error: null });
  }, [updateState]);

  const setSecondKey = useCallback((key) => {
    if (typeof key !== 'string') {
      console.error('setSecondKey: key must be a string');
      return;
    }
    updateState({ secondKey: key, error: null });
  }, [updateState]);

  const setMode = useCallback((mode) => {
    if (mode !== 'encrypt' && mode !== 'decrypt') {
      console.error('setMode: mode must be "encrypt" or "decrypt"');
      return;
    }
    updateState({ mode, error: null });
  }, [updateState]);

  const setAlgorithm = useCallback((algorithm) => {
    if (algorithm !== null && typeof algorithm !== 'string') {
      console.error('setAlgorithm: algorithm must be a string or null');
      return;
    }
    updateState({ algorithm, error: null });
  }, [updateState]);

  const setShift = useCallback((shift) => {
    const shiftNum = Number(shift);
    if (isNaN(shiftNum)) {
      console.error('setShift: shift must be a number');
      return;
    }
    updateState({ shift: shiftNum, error: null });
  }, [updateState]);

  const setRails = useCallback((rails) => {
    const railsNum = Number(rails);
    if (isNaN(railsNum)) {
      console.error('setRails: rails must be a number');
      return;
    }
    updateState({ rails: railsNum, error: null });
  }, [updateState]);

  const setError = useCallback((error) => {
    if (error !== null && typeof error !== 'string') {
      console.error('setError: error must be a string or null');
      return;
    }
    updateState({ error });
  }, [updateState]);

  const setIsProcessing = useCallback((isProcessing) => {
    if (typeof isProcessing !== 'boolean') {
      console.error('setIsProcessing: isProcessing must be a boolean');
      return;
    }
    updateState({ isProcessing });
  }, [updateState]);

  const setVisualization = useCallback((visualization) => {
    updateState({ visualization });
  }, [updateState]);

  // ==================== CIPHER OPERATIONS ====================

  const getAlgorithmParams = useCallback((algorithm, params) => {
    switch (algorithm) {
      case 'caesar':
        return [params.shift];
      case 'vigenere':
      case 'beaufort':
      case 'autokey':
      case 'playfair':
        return [params.key];
      case 'hill':
        return [params.keyMatrix];
      case 'railfence':
        return [params.rails];
      case 'columnar':
      case 'myszkowski':
        return [params.key];
      case 'double':
        return [params.key, params.secondKey || params.key];
      default:
        return [];
    }
  }, []);

  const processCipher = useCallback(async (algorithm, encryptFn, decryptFn) => {
    if (typeof algorithm !== 'string') {
      throw new Error('Algorithm must be a string');
    }
    if (typeof encryptFn !== 'function' || typeof decryptFn !== 'function') {
      throw new Error('Encrypt and decrypt functions must be provided');
    }

    try {
      setIsProcessing(true);
      setError(null);

      const { inputText, key, keyMatrix, secondKey, mode, shift, rails } = state;

      // Validate input
      if (!inputText.trim()) {
        throw new Error('Please enter text to process');
      }

      // Execute cipher operation
      let result;
      const params = getAlgorithmParams(algorithm, { key, keyMatrix, secondKey, shift, rails });
      
      if (mode === 'encrypt') {
        result = await encryptFn(inputText, ...params);
      } else {
        result = await decryptFn(inputText, ...params);
      }

      // Update output
      setOutputText(result);

      // Create operation record
      const operation = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        algorithm,
        mode,
        inputText,
        outputText: result,
        key: algorithm === 'hill' ? keyMatrix : key,
        secondKey,
        shift,
        rails,
      };

      // Add to history
      addToHistory(operation);

      // Save last operation
      updateState({ lastOperation: operation });

      // Auto-save if enabled
      if (preferences.autoSave) {
        saveConfiguration(`Auto-save ${new Date().toLocaleString()}`);
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [state, preferences, updateState, getAlgorithmParams]);

  // ==================== HISTORY MANAGEMENT ====================

  const addToHistory = useCallback((operation) => {
    if (!operation || typeof operation !== 'object') {
      console.error('addToHistory: operation must be an object');
      return;
    }

    setHistory(prev => {
      const newHistory = [operation, ...prev];
      return newHistory.slice(0, preferences.maxHistoryItems);
    });
  }, [preferences.maxHistoryItems]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeHistoryItem = useCallback((id) => {
    if (typeof id !== 'number') {
      console.error('removeHistoryItem: id must be a number');
      return;
    }
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const loadFromHistory = useCallback((operation) => {
    if (!operation || typeof operation !== 'object') {
      console.error('loadFromHistory: operation must be an object');
      return;
    }

    updateState({
      inputText: operation.inputText,
      outputText: operation.outputText,
      key: operation.key,
      keyMatrix: operation.keyMatrix || state.keyMatrix,
      secondKey: operation.secondKey || '',
      shift: operation.shift || 3,
      rails: operation.rails || 3,
      mode: operation.mode,
      algorithm: operation.algorithm,
    });
  }, [state.keyMatrix, updateState]);

  // ==================== CONFIGURATION MANAGEMENT ====================

  const saveConfiguration = useCallback((name) => {
    if (typeof name !== 'string') {
      console.error('saveConfiguration: name must be a string');
      return null;
    }

    const config = {
      id: Date.now(),
      name: name || `Config ${savedConfigs.length + 1}`,
      timestamp: new Date().toISOString(),
      algorithm: state.algorithm,
      key: state.key,
      keyMatrix: state.keyMatrix,
      secondKey: state.secondKey,
      shift: state.shift,
      rails: state.rails,
      mode: state.mode,
    };

    setSavedConfigs(prev => [config, ...prev].slice(0, 20));
    return config;
  }, [state, savedConfigs.length]);

  const loadConfiguration = useCallback((config) => {
    if (!config || typeof config !== 'object') {
      console.error('loadConfiguration: config must be an object');
      return;
    }

    updateState({
      algorithm: config.algorithm,
      key: config.key || '',
      keyMatrix: config.keyMatrix || state.keyMatrix,
      secondKey: config.secondKey || '',
      shift: config.shift || 3,
      rails: config.rails || 3,
      mode: config.mode,
    });
  }, [state.keyMatrix, updateState]);

  const deleteConfiguration = useCallback((id) => {
    if (typeof id !== 'number') {
      console.error('deleteConfiguration: id must be a number');
      return;
    }
    setSavedConfigs(prev => prev.filter(config => config.id !== id));
  }, []);

  // ==================== PREFERENCES ====================

  const updatePreferences = useCallback((updates) => {
    if (!updates || typeof updates !== 'object') {
      console.error('updatePreferences: updates must be an object');
      return;
    }
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  // ==================== RESET FUNCTIONS ====================

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
    setHistory([]);
    setSavedConfigs([]);
    localStorage.clear();
  }, []);

  // ==================== IMPORT/EXPORT ====================

  const exportHistory = useCallback(() => {
    const data = {
      history,
      savedConfigs,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  }, [history, savedConfigs]);

  const importHistory = useCallback((jsonString) => {
    if (typeof jsonString !== 'string') {
      console.error('importHistory: jsonString must be a string');
      return false;
    }

    try {
      const data = JSON.parse(jsonString);
      if (data.history) setHistory(data.history);
      if (data.savedConfigs) setSavedConfigs(data.savedConfigs);
      return true;
    } catch (error) {
      console.error('Failed to import history:', error);
      return false;
    }
  }, []);

  // ==================== STATISTICS ====================

  const getStatistics = useCallback(() => {
    const algorithmCounts = {};
    const modeCounts = { encrypt: 0, decrypt: 0 };
    
    history.forEach(operation => {
      algorithmCounts[operation.algorithm] = (algorithmCounts[operation.algorithm] || 0) + 1;
      modeCounts[operation.mode]++;
    });

    return {
      totalOperations: history.length,
      algorithmCounts,
      modeCounts,
      recentOperations: history.slice(0, 10),
      savedConfigsCount: savedConfigs.length,
    };
  }, [history, savedConfigs.length]);

  // ==================== CONTEXT VALUE ====================

  const value = {
    // State
    ...state,
    history,
    savedConfigs,
    preferences,

    // Setters
    setInputText,
    setOutputText,
    setKey,
    setKeyMatrix,
    setSecondKey,
    setMode,
    setAlgorithm,
    setShift,
    setRails,
    setError,
    setIsProcessing,
    setVisualization,
    updateState,

    // Operations
    processCipher,
    reset,
    resetAll,

    // History management
    addToHistory,
    clearHistory,
    removeHistoryItem,
    loadFromHistory,

    // Configuration management
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,

    // Preferences
    updatePreferences,

    // Import/Export
    exportHistory,
    importHistory,

    // Statistics
    getStatistics,
  };

  return (
    <CipherContext.Provider value={value}>
      {children}
    </CipherContext.Provider>
  );
};

// PropTypes for Provider
CipherProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ==================== CUSTOM HOOK ====================

export const useCipher = () => {
  const context = useContext(CipherContext);
  
  if (!context) {
    throw new Error('useCipher must be used within a CipherProvider');
  }
  
  return context;
};

// ==================== EXPORTS ====================

export { CipherContext };

// Export PropTypes for external use
export {
  OperationPropTypes,
  ConfigurationPropTypes,
  PreferencesPropTypes,
  StatePropTypes,
  CipherContextValuePropTypes,
};

export default CipherContext;