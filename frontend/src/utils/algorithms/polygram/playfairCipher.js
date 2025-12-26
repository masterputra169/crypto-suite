// src/utils/algorithms/polygram/playfairCipher.js

import PropTypes from 'prop-types';

/**
 * Playfair Cipher Algorithm
 * Mengenkripsi digraph (pasangan huruf) menggunakan matriks 5x5
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes untuk Playfair Grid (5x5 matrix)
 */
export const PlayfairGridPropTypes = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.string)
);

/**
 * PropTypes untuk Digraph (pasangan huruf)
 */
export const DigraphPropTypes = PropTypes.shape({
  pair: PropTypes.string.isRequired,        // Original digraph (e.g., "HE")
  encrypted: PropTypes.string.isRequired,   // Encrypted digraph (e.g., "BM")
  rule: PropTypes.oneOf(['same-row', 'same-column', 'rectangle']),
  positions: PropTypes.shape({
    first: PropTypes.shape({
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
    }),
    second: PropTypes.shape({
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
    }),
  }),
});

/**
 * PropTypes untuk Visualization Data
 */
export const PlayfairVisualizationPropTypes = PropTypes.shape({
  grid: PlayfairGridPropTypes.isRequired,
  keyword: PropTypes.string.isRequired,
  digraphs: PropTypes.arrayOf(DigraphPropTypes).isRequired,
  processedText: PropTypes.string.isRequired,
  plaintext: PropTypes.string.isRequired,
  ciphertext: PropTypes.string.isRequired,
});

/**
 * PropTypes untuk Position
 */
const PositionPropTypes = PropTypes.shape({
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
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
 * Prepare keyword - remove duplicates and non-alphabetic characters
 */
const prepareKeyword = (keyword) => {
  if (typeof keyword !== 'string') {
    throw new Error('prepareKeyword: keyword must be a string');
  }
  
  const cleaned = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Remove duplicate letters
  const unique = [];
  for (const char of cleaned) {
    if (!unique.includes(char) && char !== 'J') { // Combine I and J
      unique.push(char);
    }
  }
  
  return unique.join('');
};

/**
 * Generate 5x5 Playfair matrix from keyword
 */
export const generatePlayfairMatrix = (keyword) => {
  if (typeof keyword !== 'string') {
    throw new Error('generatePlayfairMatrix: keyword must be a string');
  }
  
  const processedKey = prepareKeyword(keyword);
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I and J combined
  
  let matrixString = processedKey;
  
  // Add remaining letters
  for (const char of alphabet) {
    if (!matrixString.includes(char)) {
      matrixString += char;
    }
  }
  
  // Create 5x5 matrix
  const matrix = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(matrixString.slice(i * 5, (i + 1) * 5).split(''));
  }
  
  return matrix;
};

/**
 * Find position of character in matrix
 */
const findPosition = (matrix, char) => {
  if (!Array.isArray(matrix) || matrix.length !== 5) {
    throw new Error('findPosition: invalid matrix');
  }
  if (typeof char !== 'string' || char.length !== 1) {
    throw new Error('findPosition: char must be a single character');
  }
  
  // Replace J with I
  const searchChar = char === 'J' ? 'I' : char;
  
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === searchChar) {
        return { row, col };
      }
    }
  }
  
  return null;
};

/**
 * Process text into digraphs (pairs)
 */
const createDigraphs = (text) => {
  if (typeof text !== 'string') {
    throw new Error('createDigraphs: text must be a string');
  }
  
  const processed = prepareText(text).replace(/J/g, 'I');
  const digraphs = [];
  
  let i = 0;
  while (i < processed.length) {
    let first = processed[i];
    let second = i + 1 < processed.length ? processed[i + 1] : 'X';
    
    // If both letters are the same, insert X
    if (first === second) {
      second = 'X';
      i++; // Only advance by 1
    } else {
      i += 2; // Advance by 2
    }
    
    digraphs.push(first + second);
  }
  
  return digraphs;
};

/**
 * Get encryption rule for a digraph
 */
const getRule = (pos1, pos2) => {
  if (!pos1 || !pos2) {
    throw new Error('getRule: positions cannot be null');
  }
  
  if (pos1.row === pos2.row) return 'same-row';
  if (pos1.col === pos2.col) return 'same-column';
  return 'rectangle';
};

/**
 * Encrypt a single digraph
 */
const encryptDigraph = (matrix, digraph) => {
  if (!Array.isArray(matrix) || matrix.length !== 5) {
    throw new Error('encryptDigraph: invalid matrix');
  }
  if (typeof digraph !== 'string' || digraph.length !== 2) {
    throw new Error('encryptDigraph: digraph must be 2 characters');
  }
  
  const pos1 = findPosition(matrix, digraph[0]);
  const pos2 = findPosition(matrix, digraph[1]);
  
  if (!pos1 || !pos2) {
    throw new Error('encryptDigraph: characters not found in matrix');
  }
  
  const rule = getRule(pos1, pos2);
  let encrypted;
  
  if (rule === 'same-row') {
    // Move right, wrap around
    encrypted = 
      matrix[pos1.row][(pos1.col + 1) % 5] +
      matrix[pos2.row][(pos2.col + 1) % 5];
  } else if (rule === 'same-column') {
    // Move down, wrap around
    encrypted = 
      matrix[(pos1.row + 1) % 5][pos1.col] +
      matrix[(pos2.row + 1) % 5][pos2.col];
  } else {
    // Rectangle - swap columns
    encrypted = 
      matrix[pos1.row][pos2.col] +
      matrix[pos2.row][pos1.col];
  }
  
  return {
    pair: digraph,
    encrypted,
    rule,
    positions: {
      first: pos1,
      second: pos2,
    },
  };
};

/**
 * Decrypt a single digraph
 */
const decryptDigraph = (matrix, digraph) => {
  if (!Array.isArray(matrix) || matrix.length !== 5) {
    throw new Error('decryptDigraph: invalid matrix');
  }
  if (typeof digraph !== 'string' || digraph.length !== 2) {
    throw new Error('decryptDigraph: digraph must be 2 characters');
  }
  
  const pos1 = findPosition(matrix, digraph[0]);
  const pos2 = findPosition(matrix, digraph[1]);
  
  if (!pos1 || !pos2) {
    throw new Error('decryptDigraph: characters not found in matrix');
  }
  
  const rule = getRule(pos1, pos2);
  let decrypted;
  
  if (rule === 'same-row') {
    // Move left, wrap around
    decrypted = 
      matrix[pos1.row][(pos1.col + 4) % 5] +
      matrix[pos2.row][(pos2.col + 4) % 5];
  } else if (rule === 'same-column') {
    // Move up, wrap around
    decrypted = 
      matrix[(pos1.row + 4) % 5][pos1.col] +
      matrix[(pos2.row + 4) % 5][pos2.col];
  } else {
    // Rectangle - swap columns (same as encryption)
    decrypted = 
      matrix[pos1.row][pos2.col] +
      matrix[pos2.row][pos1.col];
  }
  
  return {
    pair: digraph,
    encrypted: decrypted,
    rule,
    positions: {
      first: pos1,
      second: pos2,
    },
  };
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using Playfair cipher
 * @param {string} plaintext - Text to encrypt
 * @param {string} keyword - Encryption key
 * @returns {string} - Encrypted ciphertext
 */
export const playfairEncrypt = (plaintext, keyword) => {
  // Validate parameters
  if (typeof plaintext !== 'string') {
    throw new Error('playfairEncrypt: plaintext must be a string');
  }
  if (typeof keyword !== 'string' || !keyword.trim()) {
    throw new Error('playfairEncrypt: keyword must be a non-empty string');
  }
  
  try {
    const matrix = generatePlayfairMatrix(keyword);
    const digraphs = createDigraphs(plaintext);
    
    let result = '';
    for (const digraph of digraphs) {
      const encrypted = encryptDigraph(matrix, digraph);
      result += encrypted.encrypted;
    }
    
    return result;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using Playfair cipher
 * @param {string} ciphertext - Text to decrypt
 * @param {string} keyword - Decryption key
 * @returns {string} - Decrypted plaintext
 */
export const playfairDecrypt = (ciphertext, keyword) => {
  // Validate parameters
  if (typeof ciphertext !== 'string') {
    throw new Error('playfairDecrypt: ciphertext must be a string');
  }
  if (typeof keyword !== 'string' || !keyword.trim()) {
    throw new Error('playfairDecrypt: keyword must be a non-empty string');
  }
  
  try {
    const matrix = generatePlayfairMatrix(keyword);
    const text = prepareText(ciphertext).replace(/J/g, 'I');
    
    // Ensure even length
    const digraphs = [];
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length) {
        digraphs.push(text[i] + text[i + 1]);
      }
    }
    
    let result = '';
    for (const digraph of digraphs) {
      const decrypted = decryptDigraph(matrix, digraph);
      result += decrypted.encrypted;
    }
    
    return result;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

/**
 * Get visualization data for Playfair cipher
 * @param {string} plaintext - Original text
 * @param {string} keyword - Encryption key
 * @returns {Object} - Visualization data
 */
export const getPlayfairVisualization = (plaintext, keyword) => {
  // Validate parameters
  if (typeof plaintext !== 'string') {
    throw new Error('getPlayfairVisualization: plaintext must be a string');
  }
  if (typeof keyword !== 'string' || !keyword.trim()) {
    throw new Error('getPlayfairVisualization: keyword must be a non-empty string');
  }
  
  try {
    const matrix = generatePlayfairMatrix(keyword);
    const processedText = prepareText(plaintext).replace(/J/g, 'I');
    const digraphPairs = createDigraphs(plaintext);
    
    const digraphs = [];
    for (const pair of digraphPairs) {
      const encrypted = encryptDigraph(matrix, pair);
      digraphs.push(encrypted);
    }
    
    const ciphertext = digraphs.map(d => d.encrypted).join('');
    
    return {
      grid: matrix,
      keyword: prepareKeyword(keyword),
      digraphs,
      processedText,
      plaintext: processedText,
      ciphertext,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate Playfair matrix
 * @param {Array<Array<string>>} matrix - 5x5 matrix to validate
 * @returns {Object} - Validation result
 */
export const validatePlayfairMatrix = (matrix) => {
  if (!Array.isArray(matrix)) {
    return {
      valid: false,
      message: 'Matrix must be an array',
    };
  }
  
  if (matrix.length !== 5) {
    return {
      valid: false,
      message: 'Matrix must have exactly 5 rows',
    };
  }
  
  for (let i = 0; i < 5; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== 5) {
      return {
        valid: false,
        message: `Row ${i} must have exactly 5 columns`,
      };
    }
  }
  
  // Check for unique characters
  const chars = new Set();
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const char = matrix[i][j];
      if (typeof char !== 'string' || char.length !== 1) {
        return {
          valid: false,
          message: `Invalid character at position [${i}][${j}]`,
        };
      }
      if (chars.has(char)) {
        return {
          valid: false,
          message: `Duplicate character '${char}' found`,
        };
      }
      chars.add(char);
    }
  }
  
  return {
    valid: true,
    message: 'Matrix is valid',
    uniqueChars: chars.size,
  };
};

/**
 * Get character frequency in matrix
 * @param {Array<Array<string>>} matrix - 5x5 Playfair matrix
 * @returns {Object} - Character frequency map
 */
export const getMatrixFrequency = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length !== 5) {
    throw new Error('getMatrixFrequency: invalid matrix');
  }
  
  const frequency = {};
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const char = matrix[i][j];
      frequency[char] = { row: i, col: j };
    }
  }
  
  return frequency;
};

/**
 * Format digraphs for display
 * @param {Array<string>} digraphs - Array of digraph pairs
 * @returns {string} - Formatted string
 */
export const formatDigraphs = (digraphs) => {
  if (!Array.isArray(digraphs)) {
    throw new Error('formatDigraphs: digraphs must be an array');
  }
  
  return digraphs.map(d => `[${d}]`).join(' ');
};

/**
 * Clean decrypted text (remove padding X's)
 * @param {string} text - Decrypted text
 * @returns {string} - Cleaned text
 */
export const cleanDecryptedText = (text) => {
  if (typeof text !== 'string') {
    throw new Error('cleanDecryptedText: text must be a string');
  }
  
  // Remove trailing X's that were added as padding
  let cleaned = text;
  while (cleaned.endsWith('X') && cleaned.length > 1) {
    cleaned = cleaned.slice(0, -1);
  }
  
  // Replace double X's that were inserted between double letters
  cleaned = cleaned.replace(/X(?=[A-Z])/g, '');
  
  return cleaned;
};

// ==================== EXPORTS ====================

export default {
  playfairEncrypt,
  playfairDecrypt,
  generatePlayfairMatrix,
  getPlayfairVisualization,
  validatePlayfairMatrix,
  getMatrixFrequency,
  formatDigraphs,
  cleanDecryptedText,
  
  // PropTypes exports
  PlayfairGridPropTypes,
  DigraphPropTypes,
  PlayfairVisualizationPropTypes,
  PositionPropTypes,
};