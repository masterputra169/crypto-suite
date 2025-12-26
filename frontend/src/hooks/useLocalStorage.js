// src/hooks/useLocalStorage.js

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * useLocalStorage Hook
 * Custom hook for persisting state in localStorage with type safety
 */

// PropTypes for hook options
const UseLocalStorageOptionsPropTypes = PropTypes.shape({
  serialize: PropTypes.func,
  deserialize: PropTypes.func,
  syncAcrossTabs: PropTypes.bool,
  onError: PropTypes.func,
});

/**
 * Main useLocalStorage hook
 */
const useLocalStorage = (key, initialValue, options = {}) => {
  // Validate parameters
  if (typeof key !== 'string' || !key) {
    throw new Error('useLocalStorage: key must be a non-empty string');
  }

  if (options && typeof options !== 'object') {
    console.error('useLocalStorage: options must be an object');
  }

  // Default options
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true,
    onError = console.error,
  } = options;

  // ==================== STATE ====================

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      onError(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const [error, setError] = useState(null);

  // ==================== STORAGE OPERATIONS ====================

  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function for lazy initialization
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
      
      setError(null);

      // Dispatch custom event for cross-tab synchronization
      if (syncAcrossTabs) {
        window.dispatchEvent(new CustomEvent('local-storage-change', {
          detail: { key, value: valueToStore }
        }));
      }
    } catch (error) {
      setError(error);
      onError(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue, serialize, syncAcrossTabs, onError]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
      setError(null);

      if (syncAcrossTabs) {
        window.dispatchEvent(new CustomEvent('local-storage-change', {
          detail: { key, value: undefined }
        }));
      }
    } catch (error) {
      setError(error);
      onError(`Error removing ${key} from localStorage:`, error);
    }
  }, [key, syncAcrossTabs, onError]);

  const clearAll = useCallback(() => {
    try {
      window.localStorage.clear();
      setStoredValue(initialValue);
      setError(null);
    } catch (error) {
      setError(error);
      onError('Error clearing localStorage:', error);
    }
  }, [initialValue, onError]);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue, setValue]);

  // ==================== CROSS-TAB SYNC ====================

  useEffect(() => {
    if (!syncAcrossTabs) return;

    // Handle storage events from other tabs
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== serialize(storedValue)) {
        try {
          setStoredValue(e.newValue ? deserialize(e.newValue) : undefined);
        } catch (error) {
          onError(`Error syncing ${key} from other tab:`, error);
        }
      }
    };

    // Handle custom events from same tab
    const handleCustomEvent = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleCustomEvent);
    };
  }, [key, storedValue, serialize, deserialize, syncAcrossTabs, onError]);

  // ==================== UTILITIES ====================

  const getSize = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return 0;
      return new Blob([item]).size;
    } catch (error) {
      onError(`Error getting size of ${key}:`, error);
      return 0;
    }
  }, [key, onError]);

  const exists = useCallback(() => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      onError(`Error checking existence of ${key}:`, error);
      return false;
    }
  }, [key, onError]);

  const isAvailable = useCallback(() => {
    try {
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, []);

  const getAllKeys = useCallback(() => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      onError('Error getting all keys:', error);
      return [];
    }
  }, [onError]);

  const getUsedSpace = useCallback(() => {
    try {
      let total = 0;
      for (let key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          total += window.localStorage.getItem(key).length + key.length;
        }
      }
      return total;
    } catch (error) {
      onError('Error calculating used space:', error);
      return 0;
    }
  }, [onError]);

  const getRemainingSpace = useCallback(() => {
    const maxSize = 5 * 1024 * 1024; // 5MB typical limit
    const used = getUsedSpace();
    return maxSize - used;
  }, [getUsedSpace]);

  // ==================== BATCH OPERATIONS ====================

  const setMultiple = useCallback((items) => {
    if (!items || typeof items !== 'object') {
      console.error('setMultiple: items must be an object');
      return;
    }

    try {
      Object.entries(items).forEach(([itemKey, value]) => {
        window.localStorage.setItem(itemKey, serialize(value));
      });
      setError(null);
    } catch (error) {
      setError(error);
      onError('Error saving multiple items:', error);
    }
  }, [serialize, onError]);

  const getMultiple = useCallback((keys) => {
    if (!Array.isArray(keys)) {
      console.error('getMultiple: keys must be an array');
      return {};
    }

    try {
      const result = {};
      keys.forEach(itemKey => {
        const item = window.localStorage.getItem(itemKey);
        if (item) {
          result[itemKey] = deserialize(item);
        }
      });
      return result;
    } catch (error) {
      onError('Error loading multiple items:', error);
      return {};
    }
  }, [deserialize, onError]);

  const removeMultiple = useCallback((keys) => {
    if (!Array.isArray(keys)) {
      console.error('removeMultiple: keys must be an array');
      return;
    }

    try {
      keys.forEach(itemKey => {
        window.localStorage.removeItem(itemKey);
      });
      setError(null);
    } catch (error) {
      setError(error);
      onError('Error removing multiple items:', error);
    }
  }, [onError]);

  // ==================== EXPIRY SUPPORT ====================

  const setWithExpiry = useCallback((value, ttl) => {
    if (typeof ttl !== 'number' || ttl <= 0) {
      console.error('setWithExpiry: ttl must be a positive number (milliseconds)');
      return;
    }

    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    setValue(item);
  }, [setValue]);

  const getWithExpiry = useCallback(() => {
    if (!storedValue || typeof storedValue !== 'object' || !storedValue.expiry) {
      return storedValue;
    }

    const now = new Date();
    if (now.getTime() > storedValue.expiry) {
      removeValue();
      return null;
    }

    return storedValue.value;
  }, [storedValue, removeValue]);

  // ==================== VERSIONING ====================

  const setVersioned = useCallback((value, version = 1) => {
    const versionedData = {
      version,
      data: value,
      timestamp: new Date().toISOString(),
    };
    setValue(versionedData);
  }, [setValue]);

  const getVersioned = useCallback((expectedVersion) => {
    if (!storedValue || typeof storedValue !== 'object' || !storedValue.version) {
      return { valid: false, data: null, version: null };
    }

    const isValid = expectedVersion === undefined || storedValue.version === expectedVersion;

    return {
      valid: isValid,
      data: storedValue.data,
      version: storedValue.version,
      timestamp: storedValue.timestamp,
    };
  }, [storedValue]);

  // ==================== RETURN ====================

  return {
    // Core state
    value: storedValue,
    setValue,
    error,

    // Operations
    remove: removeValue,
    reset,
    clearAll,

    // Utilities
    getSize,
    exists,
    isAvailable,
    getAllKeys,
    getUsedSpace,
    getRemainingSpace,

    // Batch operations
    setMultiple,
    getMultiple,
    removeMultiple,

    // Expiry support
    setWithExpiry,
    getWithExpiry,

    // Versioning
    setVersioned,
    getVersioned,
  };
};

// Export PropTypes
export { UseLocalStorageOptionsPropTypes };

export default useLocalStorage;