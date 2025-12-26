// src/utils/algorithms/transposition/columnarTransposition.js

import PropTypes from 'prop-types';

/**
 * Columnar Transposition Cipher Algorithm
 * Transposition cipher using column-based rearrangement with keyword ordering
 * Implements: Encryption, Decryption, Grid Generation, Visualization, Analysis
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for Columnar Grid
 */
export const ColumnarGridPropTypes = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.string)
);

/**
 * PropTypes for Column Information
 */
export const ColumnInfoPropTypes = PropTypes.shape({
  originalIndex: PropTypes.number.isRequired,
  character: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(PropTypes.string).isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const ColumnarVisualizationPropTypes = PropTypes.shape({
  keyword: PropTypes.string.isRequired,
  grid: ColumnarGridPropTypes.isRequired,
  columnOrder: PropTypes.arrayOf(PropTypes.number).isRequired,
  orderedColumns: PropTypes.arrayOf(ColumnInfoPropTypes).isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
  encrypted: PropTypes.string.isRequired,
});

/**
 * PropTypes for Analysis Result
 */
export const AnalysisResultPropTypes = PropTypes.shape({
  keywordLength: PropTypes.number.isRequired,
  estimatedRows: PropTypes.number.isRequired,
  textLength: PropTypes.number.isRequired,
  paddingAmount: PropTypes.number.isRequired,
  avgColumnLength: PropTypes.number.isRequired,
  possibleKeyLengths: PropTypes.arrayOf(PropTypes.number).isRequired,
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Prepare text - remove non-alphabetic characters and convert to uppercase
 * @param {string} text - Input text
 * @returns {string} - Cleaned text
 */
const prepareText = (text) => {
  if (typeof text !== 'string') {
    throw new Error('prepareText: text must be a string');
  }
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Prepare keyword - remove non-alphabetic characters and convert to uppercase
 * @param {string} key - Input keyword
 * @returns {string} - Cleaned keyword
 */
const prepareKey = (key) => {
  if (typeof key !== 'string') {
    throw new Error('prepareKey: key must be a string');
  }
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Get column order based on alphabetical sorting of keyword
 * @param {string} key - Keyword
 * @returns {Array<number>} - Array of column indices in reading order
 */
const getColumnOrder = (key) => {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('getColumnOrder: key must be a non-empty string');
  }

  const keyArray = key.split('').map((char, index) => ({ 
    char, 
    index,
    // Handle duplicate letters by maintaining stability
    originalPosition: index 
  }));
  
  // Sort alphabetically, maintaining original order for duplicates
  keyArray.sort((a, b) => {
    if (a.char === b.char) {
      return a.originalPosition - b.originalPosition;
    }
    return a.char.localeCompare(b.char);
  });
  
  return keyArray.map(item => item.index);
};

/**
 * Create grid from text and keyword
 * @param {string} text - Cleaned text
 * @param {number} numCols - Number of columns
 * @returns {Array<Array<string>>} - 2D grid
 */
const createGrid = (text, numCols) => {
  if (!text || numCols < 1) {
    throw new Error('createGrid: invalid parameters');
  }

  const numRows = Math.ceil(text.length / numCols);
  const grid = [];
  
  // Pad text with X if necessary
  let paddedText = text;
  while (paddedText.length < numRows * numCols) {
    paddedText += 'X';
  }
  
  // Fill grid row by row
  for (let r = 0; r < numRows; r++) {
    const row = paddedText.slice(r * numCols, (r + 1) * numCols).split('');
    grid.push(row);
  }
  
  return grid;
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using Columnar Transposition
 * @param {string} plaintext - Text to encrypt
 * @param {string} key - Encryption keyword
 * @returns {string} - Encrypted ciphertext
 */
export const columnarEncrypt = (plaintext, key) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('columnarEncrypt: plaintext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('columnarEncrypt: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const keyword = prepareKey(key);
    
    if (text.length === 0) {
      throw new Error('columnarEncrypt: plaintext contains no alphabetic characters');
    }
    if (keyword.length === 0) {
      throw new Error('columnarEncrypt: key contains no alphabetic characters');
    }
    
    const numCols = keyword.length;
    const grid = createGrid(text, numCols);
    const columnOrder = getColumnOrder(keyword);
    
    // Read columns in order
    let result = '';
    for (const colIndex of columnOrder) {
      for (let r = 0; r < grid.length; r++) {
        result += grid[r][colIndex];
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using Columnar Transposition
 * @param {string} ciphertext - Text to decrypt
 * @param {string} key - Decryption keyword
 * @returns {string} - Decrypted plaintext
 */
export const columnarDecrypt = (ciphertext, key) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('columnarDecrypt: ciphertext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('columnarDecrypt: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(ciphertext);
    const keyword = prepareKey(key);
    
    if (text.length === 0) {
      throw new Error('columnarDecrypt: ciphertext contains no alphabetic characters');
    }
    if (keyword.length === 0) {
      throw new Error('columnarDecrypt: key contains no alphabetic characters');
    }
    
    const numCols = keyword.length;
    const numRows = Math.ceil(text.length / numCols);
    
    // Create empty grid
    const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
    
    // Get column order
    const columnOrder = getColumnOrder(keyword);
    
    // Fill grid column by column in the order they were read during encryption
    let index = 0;
    for (const colIndex of columnOrder) {
      for (let r = 0; r < numRows; r++) {
        if (index < text.length) {
          grid[r][colIndex] = text[index];
          index++;
        }
      }
    }
    
    // Read grid row by row
    let result = '';
    for (let r = 0; r < numRows; r++) {
      result += grid[r].join('');
    }
    
    // Remove padding X's from the end
    return result.replace(/X+$/, '');
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

/**
 * Generate columnar grid for visualization
 * @param {string} text - Text to grid
 * @param {string} key - Keyword
 * @returns {Object} - Grid information
 */
export const generateColumnarGrid = (text, key) => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('generateColumnarGrid: text must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('generateColumnarGrid: key must be a non-empty string');
  }
  
  const cleanText = prepareText(text);
  const keyword = prepareKey(key);
  
  if (cleanText.length === 0 || keyword.length === 0) {
    return null;
  }
  
  const numCols = keyword.length;
  const grid = createGrid(cleanText, numCols);
  const columnOrder = getColumnOrder(keyword);
  
  return {
    grid,
    keyword,
    numCols,
    numRows: grid.length,
    columnOrder,
    paddedLength: grid.length * numCols,
    originalLength: cleanText.length,
  };
};

/**
 * Get visualization data for Columnar Transposition
 * @param {string} plaintext - Original text
 * @param {string} key - Encryption keyword
 * @returns {Object} - Visualization data
 */
export const getColumnarVisualization = (plaintext, key) => {
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('getColumnarVisualization: plaintext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('getColumnarVisualization: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const keyword = prepareKey(key);
    
    if (text.length === 0 || keyword.length === 0) {
      return null;
    }
    
    const numCols = keyword.length;
    const grid = createGrid(text, numCols);
    const numRows = grid.length;
    const columnOrder = getColumnOrder(keyword);
    
    // Create ordered columns with detailed information
    const orderedColumns = columnOrder.map((colIndex, order) => {
      const content = [];
      for (let r = 0; r < numRows; r++) {
        content.push(grid[r][colIndex]);
      }
      
      return {
        originalIndex: colIndex,
        character: keyword[colIndex],
        order: order + 1,
        content,
        contentString: content.join(''),
      };
    });
    
    // Generate encrypted text
    const encrypted = columnarEncrypt(plaintext, key);
    
    return {
      keyword,
      grid,
      columnOrder,
      orderedColumns,
      numRows,
      numCols,
      encrypted,
      paddedText: grid.map(row => row.join('')).join(''),
      originalText: text,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Analyze columnar transposition key
 * @param {string} ciphertext - Encrypted text
 * @returns {Object} - Analysis results
 */
export const analyzeColumnarKey = (ciphertext) => {
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('analyzeColumnarKey: ciphertext must be a non-empty string');
  }
  
  const text = prepareText(ciphertext);
  
  if (text.length < 10) {
    return {
      textLength: text.length,
      error: 'Text too short for meaningful analysis (minimum 10 characters)',
    };
  }
  
  const textLength = text.length;
  
  // Find possible key lengths (factors of text length)
  const possibleKeyLengths = [];
  for (let i = 2; i <= Math.min(20, Math.floor(textLength / 2)); i++) {
    if (textLength % i === 0) {
      possibleKeyLengths.push(i);
    }
  }
  
  // If no exact factors, suggest nearby values
  if (possibleKeyLengths.length === 0) {
    for (let i = 2; i <= Math.min(20, Math.floor(Math.sqrt(textLength)) + 5); i++) {
      const rows = Math.ceil(textLength / i);
      possibleKeyLengths.push(i);
    }
  }
  
  // Analyze for each possible key length
  const analyses = possibleKeyLengths.map(keyLen => {
    const numRows = Math.ceil(textLength / keyLen);
    const paddingAmount = (numRows * keyLen) - textLength;
    const avgColumnLength = textLength / keyLen;
    
    // Calculate variance of column lengths (lower is better for exact factor)
    const isExactFactor = textLength % keyLen === 0;
    
    return {
      keywordLength: keyLen,
      estimatedRows: numRows,
      paddingAmount,
      avgColumnLength,
      isExactFactor,
      confidence: isExactFactor ? 'High' : 'Medium',
    };
  });
  
  // Sort by confidence (exact factors first)
  analyses.sort((a, b) => {
    if (a.isExactFactor && !b.isExactFactor) return -1;
    if (!a.isExactFactor && b.isExactFactor) return 1;
    return a.paddingAmount - b.paddingAmount;
  });
  
  return {
    textLength,
    possibleKeyLengths: analyses.slice(0, 10),
    mostLikely: analyses[0],
    note: 'Exact factors of text length are most likely key lengths',
  };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate columnar transposition parameters
 * @param {string} text - Text to validate
 * @param {string} key - Key to validate
 * @returns {Object} - Validation result
 */
export const validateColumnarParams = (text, key) => {
  const errors = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (!key || typeof key !== 'string') {
    errors.push('Key must be a non-empty string');
  }
  
  if (key && key.length < 2) {
    errors.push('Key must be at least 2 characters long');
  }
  
  if (key && !/^[A-Za-z]+$/.test(key)) {
    errors.push('Key must contain only letters (A-Z)');
  }
  
  const cleanText = text ? prepareText(text) : '';
  if (cleanText.length === 0) {
    errors.push('Text must contain at least one alphabetic character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  };
};

/**
 * Calculate efficiency score for columnar transposition
 * @param {string} plaintext - Original text
 * @param {string} key - Encryption key
 * @returns {Object} - Efficiency metrics
 */
export const calculateEfficiency = (plaintext, key) => {
  const text = prepareText(plaintext);
  const keyword = prepareKey(key);
  
  const numCols = keyword.length;
  const numRows = Math.ceil(text.length / numCols);
  const totalCells = numRows * numCols;
  const paddingAmount = totalCells - text.length;
  const efficiency = (text.length / totalCells) * 100;
  
  return {
    originalLength: text.length,
    gridSize: totalCells,
    paddingAmount,
    paddingPercentage: (paddingAmount / totalCells) * 100,
    efficiency: efficiency.toFixed(2),
    grade: efficiency >= 95 ? 'Excellent' : efficiency >= 85 ? 'Good' : 'Fair',
  };
};

/**
 * Format grid for display
 * @param {Array<Array<string>>} grid - Grid to format
 * @returns {string} - Formatted string
 */
export const formatGrid = (grid) => {
  if (!Array.isArray(grid) || grid.length === 0) {
    return '';
  }
  
  return grid.map(row => row.join(' ')).join('\n');
};

/**
 * Get column contents
 * @param {Array<Array<string>>} grid - Grid
 * @param {number} colIndex - Column index
 * @returns {string} - Column content as string
 */
export const getColumnContent = (grid, colIndex) => {
  if (!Array.isArray(grid) || grid.length === 0) {
    return '';
  }
  
  return grid.map(row => row[colIndex] || '').join('');
};

/**
 * Compare two keys for columnar transposition
 * @param {string} key1 - First key
 * @param {string} key2 - Second key
 * @returns {Object} - Comparison result
 */
export const compareKeys = (key1, key2) => {
  const k1 = prepareKey(key1);
  const k2 = prepareKey(key2);
  
  const order1 = getColumnOrder(k1);
  const order2 = getColumnOrder(k2);
  
  return {
    key1: k1,
    key2: k2,
    length1: k1.length,
    length2: k2.length,
    order1,
    order2,
    sameLength: k1.length === k2.length,
    sameOrder: JSON.stringify(order1) === JSON.stringify(order2),
  };
};

// ==================== EXPORTS ====================

export default {
  columnarEncrypt,
  columnarDecrypt,
  getColumnarVisualization,
  generateColumnarGrid,
  analyzeColumnarKey,
  validateColumnarParams,
  calculateEfficiency,
  formatGrid,
  getColumnContent,
  compareKeys,
  
  // PropTypes exports
  ColumnarGridPropTypes,
  ColumnInfoPropTypes,
  ColumnarVisualizationPropTypes,
  AnalysisResultPropTypes,
};