// src/utils/algorithms/transposition/doubleTransposition.js

import PropTypes from 'prop-types';

/**
 * Double Transposition Cipher Algorithm
 * Applies columnar transposition twice with two different keys for enhanced security
 * Implements: Encryption, Decryption, Dual Grid Generation, Visualization, Analysis
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for Grid
 */
export const GridPropTypes = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.string)
);

/**
 * PropTypes for Pass Information
 */
export const PassInfoPropTypes = PropTypes.shape({
  key: PropTypes.string.isRequired,
  grid: GridPropTypes.isRequired,
  columnOrder: PropTypes.arrayOf(PropTypes.number).isRequired,
  result: PropTypes.string.isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const DoubleTranspositionVisualizationPropTypes = PropTypes.shape({
  originalText: PropTypes.string.isRequired,
  firstPass: PassInfoPropTypes.isRequired,
  secondPass: PassInfoPropTypes.isRequired,
  finalEncrypted: PropTypes.string.isRequired,
  usingDifferentKeys: PropTypes.bool.isRequired,
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Prepare text - remove non-alphabetic characters and convert to uppercase
 */
const prepareText = (text) => {
  if (typeof text !== 'string') {
    throw new Error('prepareText: text must be a string');
  }
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Prepare key - remove non-alphabetic characters and convert to uppercase
 */
const prepareKey = (key) => {
  if (typeof key !== 'string') {
    throw new Error('prepareKey: key must be a string');
  }
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Get column order based on alphabetical sorting of keyword
 */
const getColumnOrder = (key) => {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('getColumnOrder: key must be a non-empty string');
  }

  const keyArray = key.split('').map((char, index) => ({ 
    char, 
    index,
    originalPosition: index 
  }));
  
  keyArray.sort((a, b) => {
    if (a.char === b.char) {
      return a.originalPosition - b.originalPosition;
    }
    return a.char.localeCompare(b.char);
  });
  
  return keyArray.map(item => item.index);
};

/**
 * Create grid from text
 */
const createGrid = (text, numCols) => {
  if (!text || numCols < 1) {
    throw new Error('createGrid: invalid parameters');
  }

  const numRows = Math.ceil(text.length / numCols);
  const grid = [];
  
  let paddedText = text;
  while (paddedText.length < numRows * numCols) {
    paddedText += 'X';
  }
  
  for (let r = 0; r < numRows; r++) {
    const row = paddedText.slice(r * numCols, (r + 1) * numCols).split('');
    grid.push(row);
  }
  
  return grid;
};

/**
 * Single columnar transposition encryption
 */
const singleColumnarEncrypt = (text, key) => {
  const cleanText = prepareText(text);
  const keyword = prepareKey(key);
  
  if (!cleanText || !keyword) {
    throw new Error('Invalid text or key');
  }
  
  const numCols = keyword.length;
  const grid = createGrid(cleanText, numCols);
  const columnOrder = getColumnOrder(keyword);
  
  let result = '';
  for (const colIndex of columnOrder) {
    for (let r = 0; r < grid.length; r++) {
      result += grid[r][colIndex];
    }
  }
  
  return { result, grid, columnOrder };
};

/**
 * Single columnar transposition decryption
 */
const singleColumnarDecrypt = (text, key) => {
  const cleanText = prepareText(text);
  const keyword = prepareKey(key);
  
  if (!cleanText || !keyword) {
    throw new Error('Invalid text or key');
  }
  
  const numCols = keyword.length;
  const numRows = Math.ceil(cleanText.length / numCols);
  
  const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
  const columnOrder = getColumnOrder(keyword);
  
  let index = 0;
  for (const colIndex of columnOrder) {
    for (let r = 0; r < numRows; r++) {
      if (index < cleanText.length) {
        grid[r][colIndex] = cleanText[index];
        index++;
      }
    }
  }
  
  let result = '';
  for (let r = 0; r < numRows; r++) {
    result += grid[r].join('');
  }
  
  return { result, grid, columnOrder };
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using Double Transposition
 * @param {string} plaintext - Text to encrypt
 * @param {string} key1 - First encryption key
 * @param {string} key2 - Second encryption key (optional, defaults to key1)
 * @returns {string} - Encrypted ciphertext
 */
export const doubleTranspositionEncrypt = (plaintext, key1, key2 = null) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('doubleTranspositionEncrypt: plaintext must be a non-empty string');
  }
  if (typeof key1 !== 'string' || !key1.trim()) {
    throw new Error('doubleTranspositionEncrypt: key1 must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const keyword1 = prepareKey(key1);
    const keyword2 = key2 ? prepareKey(key2) : keyword1;
    
    if (text.length === 0) {
      throw new Error('doubleTranspositionEncrypt: plaintext contains no alphabetic characters');
    }
    if (keyword1.length === 0) {
      throw new Error('doubleTranspositionEncrypt: key1 contains no alphabetic characters');
    }
    if (keyword2.length === 0) {
      throw new Error('doubleTranspositionEncrypt: key2 contains no alphabetic characters');
    }
    
    // First transposition
    const firstPass = singleColumnarEncrypt(text, keyword1);
    
    // Second transposition
    const secondPass = singleColumnarEncrypt(firstPass.result, keyword2);
    
    return secondPass.result;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using Double Transposition
 * @param {string} ciphertext - Text to decrypt
 * @param {string} key1 - First decryption key
 * @param {string} key2 - Second decryption key (optional, defaults to key1)
 * @returns {string} - Decrypted plaintext
 */
export const doubleTranspositionDecrypt = (ciphertext, key1, key2 = null) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('doubleTranspositionDecrypt: ciphertext must be a non-empty string');
  }
  if (typeof key1 !== 'string' || !key1.trim()) {
    throw new Error('doubleTranspositionDecrypt: key1 must be a non-empty string');
  }
  
  try {
    const text = prepareText(ciphertext);
    const keyword1 = prepareKey(key1);
    const keyword2 = key2 ? prepareKey(key2) : keyword1;
    
    if (text.length === 0) {
      throw new Error('doubleTranspositionDecrypt: ciphertext contains no alphabetic characters');
    }
    if (keyword1.length === 0) {
      throw new Error('doubleTranspositionDecrypt: key1 contains no alphabetic characters');
    }
    if (keyword2.length === 0) {
      throw new Error('doubleTranspositionDecrypt: key2 contains no alphabetic characters');
    }
    
    // Decrypt in reverse order
    // First: decrypt with second key
    const firstPass = singleColumnarDecrypt(text, keyword2);
    
    // Second: decrypt with first key
    const secondPass = singleColumnarDecrypt(firstPass.result, keyword1);
    
    // Remove padding X's from the end
    return secondPass.result.replace(/X+$/, '');
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

/**
 * Generate double grid for visualization
 * @param {string} text - Text to process
 * @param {string} key1 - First key
 * @param {string} key2 - Second key (optional)
 * @returns {Object} - Grid information for both passes
 */
export const generateDoubleGrid = (text, key1, key2 = null) => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('generateDoubleGrid: text must be a non-empty string');
  }
  if (typeof key1 !== 'string' || !key1.trim()) {
    throw new Error('generateDoubleGrid: key1 must be a non-empty string');
  }
  
  const cleanText = prepareText(text);
  const keyword1 = prepareKey(key1);
  const keyword2 = key2 ? prepareKey(key2) : keyword1;
  
  if (cleanText.length === 0 || keyword1.length === 0 || keyword2.length === 0) {
    return null;
  }
  
  // First pass
  const firstPass = singleColumnarEncrypt(cleanText, keyword1);
  
  // Second pass
  const secondPass = singleColumnarEncrypt(firstPass.result, keyword2);
  
  return {
    firstPass: {
      key: keyword1,
      grid: firstPass.grid,
      columnOrder: firstPass.columnOrder,
      result: firstPass.result,
      numRows: firstPass.grid.length,
      numCols: keyword1.length,
    },
    secondPass: {
      key: keyword2,
      grid: secondPass.grid,
      columnOrder: secondPass.columnOrder,
      result: secondPass.result,
      numRows: secondPass.grid.length,
      numCols: keyword2.length,
    },
    originalText: cleanText,
    finalResult: secondPass.result,
  };
};

/**
 * Get visualization data for Double Transposition
 * @param {string} plaintext - Original text
 * @param {string} key1 - First encryption key
 * @param {string} key2 - Second encryption key (optional)
 * @returns {Object} - Visualization data
 */
export const getDoubleTranspositionVisualization = (plaintext, key1, key2 = null) => {
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('getDoubleTranspositionVisualization: plaintext must be a non-empty string');
  }
  if (typeof key1 !== 'string' || !key1.trim()) {
    throw new Error('getDoubleTranspositionVisualization: key1 must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const keyword1 = prepareKey(key1);
    const keyword2 = key2 ? prepareKey(key2) : keyword1;
    
    if (text.length === 0 || keyword1.length === 0 || keyword2.length === 0) {
      return null;
    }
    
    const gridData = generateDoubleGrid(text, keyword1, keyword2);
    
    return {
      originalText: text,
      firstPass: gridData.firstPass,
      secondPass: gridData.secondPass,
      finalEncrypted: gridData.finalResult,
      usingDifferentKeys: key2 !== null && keyword1 !== keyword2,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Analyze double transposition security
 * @param {string} ciphertext - Encrypted text
 * @returns {Object} - Security analysis
 */
export const analyzeDoubleTransposition = (ciphertext) => {
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('analyzeDoubleTransposition: ciphertext must be a non-empty string');
  }
  
  const text = prepareText(ciphertext);
  
  if (text.length < 20) {
    return {
      textLength: text.length,
      error: 'Text too short for meaningful analysis (minimum 20 characters)',
    };
  }
  
  const textLength = text.length;
  
  // Calculate possible key combinations
  const possibleKey1Lengths = [];
  const possibleKey2Lengths = [];
  
  // Key1 factors
  for (let i = 2; i <= Math.min(15, Math.floor(Math.sqrt(textLength))); i++) {
    possibleKey1Lengths.push(i);
  }
  
  // For each possible key1, calculate possible key2
  const combinations = [];
  for (const key1Len of possibleKey1Lengths) {
    const firstPassLength = Math.ceil(textLength / key1Len) * key1Len;
    
    for (let key2Len = 2; key2Len <= Math.min(15, Math.floor(Math.sqrt(firstPassLength))); key2Len++) {
      combinations.push({
        key1Length: key1Len,
        key2Length: key2Len,
        totalComplexity: key1Len * key2Len,
        estimatedFirstPassRows: Math.ceil(textLength / key1Len),
        estimatedSecondPassRows: Math.ceil(firstPassLength / key2Len),
      });
    }
  }
  
  // Sort by complexity
  combinations.sort((a, b) => b.totalComplexity - a.totalComplexity);
  
  return {
    textLength,
    possibleCombinations: combinations.slice(0, 20),
    securityLevel: calculateSecurityLevel(textLength, combinations),
    note: 'Double transposition significantly increases complexity. Key space = key1_length × key2_length',
  };
};

/**
 * Calculate security level
 */
const calculateSecurityLevel = (textLength, combinations) => {
  const avgComplexity = combinations.length > 0 
    ? combinations.reduce((sum, c) => sum + c.totalComplexity, 0) / combinations.length 
    : 0;
  
  if (avgComplexity > 100) {
    return { level: 'Very High', score: 95, description: 'Extremely difficult to break without key knowledge' };
  } else if (avgComplexity > 50) {
    return { level: 'High', score: 80, description: 'Strong encryption, resistant to simple attacks' };
  } else if (avgComplexity > 25) {
    return { level: 'Medium', score: 60, description: 'Moderate security, vulnerable to advanced cryptanalysis' };
  } else {
    return { level: 'Low', score: 40, description: 'Weak encryption for short texts' };
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate double transposition parameters
 */
export const validateDoubleParams = (text, key1, key2) => {
  const errors = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (!key1 || typeof key1 !== 'string') {
    errors.push('Key1 must be a non-empty string');
  }
  
  if (key1 && key1.length < 2) {
    errors.push('Key1 must be at least 2 characters long');
  }
  
  if (key1 && !/^[A-Za-z]+$/.test(key1)) {
    errors.push('Key1 must contain only letters (A-Z)');
  }
  
  if (key2 && typeof key2 === 'string') {
    if (key2.length < 2) {
      errors.push('Key2 must be at least 2 characters long');
    }
    if (!/^[A-Za-z]+$/.test(key2)) {
      errors.push('Key2 must contain only letters (A-Z)');
    }
  }
  
  const cleanText = text ? prepareText(text) : '';
  if (cleanText.length === 0) {
    errors.push('Text must contain at least one alphabetic character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Compare security: single vs double transposition
 */
export const compareWithSingle = (text, key) => {
  const singleComplexity = key.length;
  const doubleComplexity = key.length * key.length;
  
  return {
    singleKeyLength: key.length,
    doubleKeyLength: `${key.length} × ${key.length}`,
    singleComplexity,
    doubleComplexity,
    securityImprovement: ((doubleComplexity - singleComplexity) / singleComplexity * 100).toFixed(2) + '%',
    recommendation: doubleComplexity > 50 
      ? 'Double transposition provides significantly better security'
      : 'Consider using longer keys for better security',
  };
};

/**
 * Format grid for display
 */
export const formatGrid = (grid) => {
  if (!Array.isArray(grid) || grid.length === 0) {
    return '';
  }
  
  return grid.map(row => row.join(' ')).join('\n');
};

// ==================== EXPORTS ====================

export default {
  doubleTranspositionEncrypt,
  doubleTranspositionDecrypt,
  getDoubleTranspositionVisualization,
  generateDoubleGrid,
  analyzeDoubleTransposition,
  validateDoubleParams,
  compareWithSingle,
  formatGrid,
  
  // PropTypes exports
  GridPropTypes,
  PassInfoPropTypes,
  DoubleTranspositionVisualizationPropTypes,
};