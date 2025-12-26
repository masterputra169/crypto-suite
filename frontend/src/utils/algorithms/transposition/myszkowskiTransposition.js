// src/utils/algorithms/transposition/myszkowskiTransposition.js

import PropTypes from 'prop-types';

/**
 * Myszkowski Transposition Cipher Algorithm
 * Variant of columnar transposition that handles repeated letters in keyword differently
 * Characters under repeated key letters are read together as a group
 * Implements: Encryption, Decryption, Grid Generation, Visualization, Analysis
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for Myszkowski Grid
 */
export const MyszkowskiGridPropTypes = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.string)
);

/**
 * PropTypes for Column Group Information
 */
export const ColumnGroupPropTypes = PropTypes.shape({
  character: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.number).isRequired,
  order: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const MyszkowskiVisualizationPropTypes = PropTypes.shape({
  keyword: PropTypes.string.isRequired,
  grid: MyszkowskiGridPropTypes.isRequired,
  columnGroups: PropTypes.arrayOf(ColumnGroupPropTypes).isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
  encrypted: PropTypes.string.isRequired,
  hasRepeatedLetters: PropTypes.bool.isRequired,
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
 * Prepare keyword - remove non-alphabetic characters and convert to uppercase
 */
const prepareKey = (key) => {
  if (typeof key !== 'string') {
    throw new Error('prepareKey: key must be a string');
  }
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Get column groups based on alphabetical sorting of keyword
 * Groups columns with same letter together
 */
const getColumnGroups = (key) => {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('getColumnGroups: key must be a non-empty string');
  }

  // Create array of {char, index}
  const keyArray = key.split('').map((char, index) => ({ char, index }));
  
  // Sort alphabetically
  keyArray.sort((a, b) => a.char.localeCompare(b.char));
  
  // Group columns with same character
  const groups = [];
  let currentGroup = null;
  
  for (const item of keyArray) {
    if (!currentGroup || currentGroup.character !== item.char) {
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = {
        character: item.char,
        columns: [item.index],
      };
    } else {
      currentGroup.columns.push(item.index);
    }
  }
  
  if (currentGroup) {
    groups.push(currentGroup);
  }
  
  return groups;
};

/**
 * Create grid from text and keyword
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
 * Encrypt plaintext using Myszkowski Transposition
 * @param {string} plaintext - Text to encrypt
 * @param {string} key - Encryption keyword
 * @returns {string} - Encrypted ciphertext
 */
export const myszkowskiEncrypt = (plaintext, key) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('myszkowskiEncrypt: plaintext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('myszkowskiEncrypt: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const keyword = prepareKey(key);
    
    if (text.length === 0) {
      throw new Error('myszkowskiEncrypt: plaintext contains no alphabetic characters');
    }
    if (keyword.length === 0) {
      throw new Error('myszkowskiEncrypt: key contains no alphabetic characters');
    }
    
    const numCols = keyword.length;
    const grid = createGrid(text, numCols);
    const columnGroups = getColumnGroups(keyword);
    
    // Read column groups in order
    let result = '';
    for (const group of columnGroups) {
      // Read all columns in this group together, row by row
      for (let r = 0; r < grid.length; r++) {
        for (const colIndex of group.columns) {
          result += grid[r][colIndex];
        }
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using Myszkowski Transposition
 * @param {string} ciphertext - Text to decrypt
 * @param {string} key - Decryption keyword
 * @returns {string} - Decrypted plaintext
 */
export const myszkowskiDecrypt = (ciphertext, key) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('myszkowskiDecrypt: ciphertext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('myszkowskiDecrypt: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(ciphertext);
    const keyword = prepareKey(key);
    
    if (text.length === 0) {
      throw new Error('myszkowskiDecrypt: ciphertext contains no alphabetic characters');
    }
    if (keyword.length === 0) {
      throw new Error('myszkowskiDecrypt: key contains no alphabetic characters');
    }
    
    const numCols = keyword.length;
    const numRows = Math.ceil(text.length / numCols);
    
    // Create empty grid
    const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
    
    // Get column groups
    const columnGroups = getColumnGroups(keyword);
    
    // Fill grid by column groups
    let index = 0;
    for (const group of columnGroups) {
      // Fill all columns in this group together, row by row
      for (let r = 0; r < numRows; r++) {
        for (const colIndex of group.columns) {
          if (index < text.length) {
            grid[r][colIndex] = text[index];
            index++;
          }
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
 * Generate Myszkowski grid for visualization
 * @param {string} text - Text to grid
 * @param {string} key - Keyword
 * @returns {Object} - Grid information
 */
export const generateMyszkowskiGrid = (text, key) => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('generateMyszkowskiGrid: text must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('generateMyszkowskiGrid: key must be a non-empty string');
  }
  
  const cleanText = prepareText(text);
  const keyword = prepareKey(key);
  
  if (cleanText.length === 0 || keyword.length === 0) {
    return null;
  }
  
  const numCols = keyword.length;
  const grid = createGrid(cleanText, numCols);
  const columnGroups = getColumnGroups(keyword);
  
  // Check if keyword has repeated letters
  const uniqueChars = new Set(keyword.split(''));
  const hasRepeatedLetters = uniqueChars.size < keyword.length;
  
  return {
    grid,
    keyword,
    numCols,
    numRows: grid.length,
    columnGroups,
    hasRepeatedLetters,
    paddedLength: grid.length * numCols,
    originalLength: cleanText.length,
  };
};

/**
 * Get visualization data for Myszkowski Transposition
 * @param {string} plaintext - Original text
 * @param {string} key - Encryption keyword
 * @returns {Object} - Visualization data
 */
export const getMyszkowskiVisualization = (plaintext, key) => {
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('getMyszkowskiVisualization: plaintext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('getMyszkowskiVisualization: key must be a non-empty string');
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
    const columnGroups = getColumnGroups(keyword);
    
    // Create detailed column groups with content
    const detailedGroups = columnGroups.map((group, order) => {
      let content = '';
      for (let r = 0; r < numRows; r++) {
        for (const colIndex of group.columns) {
          content += grid[r][colIndex];
        }
      }
      
      return {
        character: group.character,
        columns: group.columns,
        order: order + 1,
        content,
        columnCount: group.columns.length,
      };
    });
    
    // Check for repeated letters
    const uniqueChars = new Set(keyword.split(''));
    const hasRepeatedLetters = uniqueChars.size < keyword.length;
    
    // Generate encrypted text
    const encrypted = myszkowskiEncrypt(plaintext, key);
    
    return {
      keyword,
      grid,
      columnGroups: detailedGroups,
      numRows,
      numCols,
      encrypted,
      hasRepeatedLetters,
      paddedText: grid.map(row => row.join('')).join(''),
      originalText: text,
      repeatedLetters: keyword.split('').filter((char, idx, arr) => 
        arr.indexOf(char) !== idx
      ).filter((char, idx, arr) => arr.indexOf(char) === idx),
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Analyze Myszkowski transposition key
 * @param {string} ciphertext - Encrypted text
 * @returns {Object} - Analysis results
 */
export const analyzeMyszkowski = (ciphertext) => {
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('analyzeMyszkowski: ciphertext must be a non-empty string');
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
      possibleKeyLengths.push(i);
    }
  }
  
  // Analyze for each possible key length
  const analyses = possibleKeyLengths.map(keyLen => {
    const numRows = Math.ceil(textLength / keyLen);
    const paddingAmount = (numRows * keyLen) - textLength;
    const avgColumnLength = textLength / keyLen;
    const isExactFactor = textLength % keyLen === 0;
    
    return {
      keywordLength: keyLen,
      estimatedRows: numRows,
      paddingAmount,
      avgColumnLength: parseFloat(avgColumnLength.toFixed(2)),
      isExactFactor,
      confidence: isExactFactor ? 'High' : 'Medium',
      likelyRepeatedLetters: estimaterepeatedLetters(keyLen),
    };
  });
  
  // Sort by confidence
  analyses.sort((a, b) => {
    if (a.isExactFactor && !b.isExactFactor) return -1;
    if (!a.isExactFactor && b.isExactFactor) return 1;
    return a.paddingAmount - b.paddingAmount;
  });
  
  return {
    textLength,
    possibleKeyLengths: analyses.slice(0, 10),
    mostLikely: analyses[0],
    note: 'Myszkowski groups columns with repeated key letters. Look for patterns in grouped columns.',
    differenceFromColumnar: 'Unlike columnar transposition, repeated key letters are read together as groups.',
  };
};

/**
 * Estimate if keyword likely has repeated letters
 */
const estimaterepeatedLetters = (keyLength) => {
  // Statistically, longer keys are more likely to have repeated letters
  if (keyLength >= 8) return 'High';
  if (keyLength >= 5) return 'Medium';
  return 'Low';
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate Myszkowski transposition parameters
 */
export const validateMyszkowskiParams = (text, key) => {
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
  };
};

/**
 * Compare Myszkowski with standard columnar transposition
 */
export const compareWithColumnar = (text, key) => {
  const keyword = prepareKey(key);
  const columnGroups = getColumnGroups(keyword);
  
  const uniqueChars = new Set(keyword.split(''));
  const hasRepeats = uniqueChars.size < keyword.length;
  
  const repeatedChars = [];
  const charCounts = {};
  
  for (const char of keyword) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }
  
  for (const [char, count] of Object.entries(charCounts)) {
    if (count > 1) {
      repeatedChars.push({ char, count });
    }
  }
  
  return {
    keyword,
    keyLength: keyword.length,
    uniqueLetters: uniqueChars.size,
    hasRepeatedLetters: hasRepeats,
    repeatedLetters: repeatedChars,
    columnGroups: columnGroups.length,
    behavior: hasRepeats 
      ? 'Groups columns with same key letter together (Myszkowski behavior)'
      : 'Same as standard columnar transposition (no repeated letters)',
    securityNote: hasRepeats
      ? 'Myszkowski grouping makes pattern analysis slightly harder'
      : 'No security difference from columnar transposition',
  };
};

/**
 * Get repeated letter positions
 */
export const getRepeatedLetterPositions = (key) => {
  const keyword = prepareKey(key);
  const positions = {};
  
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword[i];
    if (!positions[char]) {
      positions[char] = [];
    }
    positions[char].push(i);
  }
  
  // Filter only repeated letters
  const repeated = {};
  for (const [char, pos] of Object.entries(positions)) {
    if (pos.length > 1) {
      repeated[char] = pos;
    }
  }
  
  return repeated;
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

/**
 * Calculate efficiency for Myszkowski transposition
 */
export const calculateEfficiency = (plaintext, key) => {
  const text = prepareText(plaintext);
  const keyword = prepareKey(key);
  
  const numCols = keyword.length;
  const numRows = Math.ceil(text.length / numCols);
  const totalCells = numRows * numCols;
  const paddingAmount = totalCells - text.length;
  const efficiency = (text.length / totalCells) * 100;
  
  const columnGroups = getColumnGroups(keyword);
  
  return {
    originalLength: text.length,
    gridSize: totalCells,
    paddingAmount,
    paddingPercentage: (paddingAmount / totalCells) * 100,
    efficiency: efficiency.toFixed(2),
    columnGroups: columnGroups.length,
    grade: efficiency >= 95 ? 'Excellent' : efficiency >= 85 ? 'Good' : 'Fair',
  };
};

// ==================== EXPORTS ====================

export default {
  myszkowskiEncrypt,
  myszkowskiDecrypt,
  getMyszkowskiVisualization,
  generateMyszkowskiGrid,
  analyzeMyszkowski,
  validateMyszkowskiParams,
  compareWithColumnar,
  getRepeatedLetterPositions,
  calculateEfficiency,
  formatGrid,
  
  // PropTypes exports
  MyszkowskiGridPropTypes,
  ColumnGroupPropTypes,
  MyszkowskiVisualizationPropTypes,
};