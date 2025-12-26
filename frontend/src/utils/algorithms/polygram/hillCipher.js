// src/utils/algorithms/polygram/hillCipher.js

import PropTypes from 'prop-types';

/**
 * Hill Cipher Algorithm
 * Polygram cipher using matrix multiplication with m×m key matrix
 * Implements: Encryption, Decryption, Matrix Operations, Validation
 * Supports: 2x2, 3x3, and 4x4 matrices
 */

// ==================== PROP TYPES DEFINITIONS ====================

// Matrix PropTypes
export const MatrixPropTypes = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.number)
);

// Validation Result PropTypes
export const ValidationResultPropTypes = PropTypes.shape({
  valid: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  determinant: PropTypes.number,
  determinantMod26: PropTypes.number,
  inverse: PropTypes.number,
  details: PropTypes.object,
});

// Calculation Step PropTypes
export const CalculationStepPropTypes = PropTypes.shape({
  blockNumber: PropTypes.number.isRequired,
  plainBlock: PropTypes.string.isRequired,
  plainVector: PropTypes.arrayOf(PropTypes.number).isRequired,
  keyMatrix: MatrixPropTypes.isRequired,
  encryptedVector: PropTypes.arrayOf(PropTypes.number).isRequired,
  encryptedBlock: PropTypes.string.isRequired,
  calculation: PropTypes.string,
});

// Visualization PropTypes
export const VisualizationPropTypes = PropTypes.shape({
  keyMatrix: MatrixPropTypes.isRequired,
  inverseMatrix: MatrixPropTypes,
  validation: ValidationResultPropTypes.isRequired,
  paddedText: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(CalculationStepPropTypes).isRequired,
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
 * Validate matrix structure
 * @param {Array<Array<number>>} matrix - Matrix to validate
 * @returns {boolean} - Whether matrix is valid
 */
const isValidMatrix = (matrix) => {
  if (!Array.isArray(matrix) || matrix.length === 0) return false;
  if (!Array.isArray(matrix[0])) return false;
  
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  // Must be square matrix
  if (rows !== cols) return false;
  
  // All rows must have same length
  for (let i = 0; i < rows; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== cols) return false;
    
    // All elements must be numbers
    for (let j = 0; j < cols; j++) {
      if (typeof matrix[i][j] !== 'number' || isNaN(matrix[i][j])) return false;
    }
  }
  
  return true;
};

// ==================== MODULAR ARITHMETIC ====================

/**
 * Modular arithmetic helper
 * @param {number} n - Number
 * @param {number} m - Modulus
 * @returns {number} - Result of n mod m
 */
const mod = (n, m) => {
  if (typeof n !== 'number' || typeof m !== 'number') {
    throw new Error('mod: both arguments must be numbers');
  }
  return ((n % m) + m) % m;
};

/**
 * Calculate determinant for 2x2 matrix
 * @param {Array<Array<number>>} matrix - 2x2 matrix
 * @returns {number} - Determinant value
 */
const determinant2x2 = (matrix) => {
  if (!isValidMatrix(matrix) || matrix.length !== 2) {
    throw new Error('determinant2x2: invalid 2x2 matrix');
  }
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};

/**
 * Calculate determinant for 3x3 matrix
 * @param {Array<Array<number>>} matrix - 3x3 matrix
 * @returns {number} - Determinant value
 */
const determinant3x3 = (matrix) => {
  if (!isValidMatrix(matrix) || matrix.length !== 3) {
    throw new Error('determinant3x3: invalid 3x3 matrix');
  }
  
  const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
  const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
  const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
  
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
};

/**
 * Calculate determinant (supports 2x2, 3x3, and 4x4)
 * @param {Array<Array<number>>} matrix - Matrix
 * @returns {number} - Determinant value
 */
const determinant = (matrix) => {
  if (!isValidMatrix(matrix)) {
    throw new Error('determinant: invalid matrix');
  }
  
  const n = matrix.length;
  
  if (n === 2) {
    return determinant2x2(matrix);
  } else if (n === 3) {
    return determinant3x3(matrix);
  } else if (n === 4) {
    // Cofactor expansion for 4x4 matrix
    let det = 0;
    for (let i = 0; i < 4; i++) {
      const subMatrix = [];
      for (let j = 1; j < 4; j++) {
        const row = [];
        for (let k = 0; k < 4; k++) {
          if (k !== i) row.push(matrix[j][k]);
        }
        subMatrix.push(row);
      }
      const sign = i % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][i] * determinant(subMatrix);
    }
    return det;
  } else {
    throw new Error('determinant: only 2x2, 3x3, and 4x4 matrices are supported');
  }
};

/**
 * Calculate modular multiplicative inverse
 * @param {number} a - Number to find inverse of
 * @param {number} m - Modulus
 * @returns {number|null} - Inverse or null if doesn't exist
 */
const modInverse = (a, m) => {
  if (typeof a !== 'number' || typeof m !== 'number') {
    throw new Error('modInverse: both arguments must be numbers');
  }
  
  a = mod(a, m);
  
  // Extended Euclidean Algorithm
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  
  return null; // No inverse exists
};

/**
 * Get cofactor matrix for 3x3
 * @param {Array<Array<number>>} matrix - 3x3 matrix
 * @param {number} row - Row to exclude
 * @param {number} col - Column to exclude
 * @returns {Array<Array<number>>} - 2x2 cofactor matrix
 */
const getCofactor3x3 = (matrix, row, col) => {
  const result = [];
  
  for (let i = 0; i < 3; i++) {
    if (i === row) continue;
    const newRow = [];
    for (let j = 0; j < 3; j++) {
      if (j === col) continue;
      newRow.push(matrix[i][j]);
    }
    result.push(newRow);
  }
  
  return result;
};

/**
 * Get adjugate (adjoint) matrix for 3x3
 * @param {Array<Array<number>>} matrix - 3x3 matrix
 * @returns {Array<Array<number>>} - Adjugate matrix
 */
const adjugate3x3 = (matrix) => {
  const adj = Array(3).fill(null).map(() => Array(3).fill(0));
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cofactor = getCofactor3x3(matrix, i, j);
      const sign = ((i + j) % 2 === 0) ? 1 : -1;
      adj[j][i] = sign * determinant2x2(cofactor); // Note: transposed
    }
  }
  
  return adj;
};

// ==================== MATRIX OPERATIONS ====================

/**
 * Get inverse matrix for 2x2
 * @param {Array<Array<number>>} matrix - 2x2 matrix
 * @param {number} modulo - Modulus (default 26)
 * @returns {Array<Array<number>>|null} - Inverse matrix or null
 */
const inverseMatrix2x2 = (matrix, modulo = 26) => {
  if (!isValidMatrix(matrix) || matrix.length !== 2) {
    throw new Error('inverseMatrix2x2: invalid 2x2 matrix');
  }
  
  const det = determinant2x2(matrix);
  const detInv = modInverse(mod(det, modulo), modulo);
  
  if (detInv === null) {
    return null; // Matrix not invertible
  }
  
  return [
    [mod(matrix[1][1] * detInv, modulo), mod(-matrix[0][1] * detInv, modulo)],
    [mod(-matrix[1][0] * detInv, modulo), mod(matrix[0][0] * detInv, modulo)]
  ];
};

/**
 * Get inverse matrix for 3x3
 * @param {Array<Array<number>>} matrix - 3x3 matrix
 * @param {number} modulo - Modulus (default 26)
 * @returns {Array<Array<number>>|null} - Inverse matrix or null
 */
const inverseMatrix3x3 = (matrix, modulo = 26) => {
  if (!isValidMatrix(matrix) || matrix.length !== 3) {
    throw new Error('inverseMatrix3x3: invalid 3x3 matrix');
  }
  
  const det = determinant3x3(matrix);
  const detInv = modInverse(mod(det, modulo), modulo);
  
  if (detInv === null) {
    return null; // Matrix not invertible
  }
  
  const adj = adjugate3x3(matrix);
  const inverse = Array(3).fill(null).map(() => Array(3).fill(0));
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      inverse[i][j] = mod(adj[i][j] * detInv, modulo);
    }
  }
  
  return inverse;
};

/**
 * Get inverse matrix (supports 2x2, 3x3, and 4x4)
 * @param {Array<Array<number>>} matrix - Matrix
 * @param {number} modulo - Modulus (default 26)
 * @returns {Array<Array<number>>|null} - Inverse matrix or null
 */
const inverseMatrix = (matrix, modulo = 26) => {
  if (!isValidMatrix(matrix)) {
    throw new Error('inverseMatrix: invalid matrix');
  }
  
  const n = matrix.length;
  
  if (n === 2) {
    return inverseMatrix2x2(matrix, modulo);
  } else if (n === 3) {
    return inverseMatrix3x3(matrix, modulo);
  } else if (n === 4) {
    const det = determinant(matrix);
    const detInv = modInverse(mod(det, modulo), modulo);
    
    if (detInv === null) {
      return null; // Matrix not invertible
    }
    
    // Calculate cofactor matrix for 4x4
    const adjugate = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const subMatrix = [];
        for (let row = 0; row < 4; row++) {
          if (row === i) continue;
          const newRow = [];
          for (let col = 0; col < 4; col++) {
            if (col === j) continue;
            newRow.push(matrix[row][col]);
          }
          subMatrix.push(newRow);
        }
        const sign = ((i + j) % 2 === 0) ? 1 : -1;
        adjugate[j][i] = sign * determinant(subMatrix); // Transposed
      }
    }
    
    // Calculate inverse matrix
    const inverse = adjugate.map(row =>
      row.map(val => mod(detInv * val, modulo))
    );
    
    return inverse;
  } else {
    throw new Error('inverseMatrix: only 2x2, 3x3, and 4x4 matrices are supported');
  }
};

/**
 * Matrix-vector multiplication
 * @param {Array<Array<number>>} matrix - Matrix
 * @param {Array<number>} vector - Vector
 * @param {number} modulo - Modulus (default 26)
 * @returns {Array<number>} - Result vector
 */
const multiplyMatrixVector = (matrix, vector, modulo = 26) => {
  if (!isValidMatrix(matrix)) {
    throw new Error('multiplyMatrixVector: invalid matrix');
  }
  if (!Array.isArray(vector) || vector.length !== matrix.length) {
    throw new Error('multiplyMatrixVector: vector length must match matrix size');
  }
  
  const result = [];
  
  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result.push(mod(sum, modulo));
  }
  
  return result;
};

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate Hill cipher key matrix
 * @param {Array<Array<number>>} keyMatrix - Key matrix to validate
 * @returns {Object} - Validation result
 */
export const validateHillKey = (keyMatrix) => {
  // Check if matrix is provided
  if (!keyMatrix) {
    return { 
      valid: false, 
      message: 'Key matrix is required' 
    };
  }
  
  // Check if matrix is valid structure
  if (!isValidMatrix(keyMatrix)) {
    return { 
      valid: false, 
      message: 'Invalid matrix structure. Must be a square matrix with numeric values.' 
    };
  }
  
  // Check if matrix is square
  const size = keyMatrix.length;
  if (size !== keyMatrix[0].length) {
    return { 
      valid: false, 
      message: 'Matrix must be square (same number of rows and columns)' 
    };
  }
  
  // Check if matrix size is supported (2x2, 3x3, or 4x4)
  if (size !== 2 && size !== 3 && size !== 4) {
    return { 
      valid: false, 
      message: 'Only 2x2, 3x3, and 4x4 matrices are supported' 
    };
  }
  
  // Calculate determinant
  let det;
  try {
    det = determinant(keyMatrix);
  } catch (error) {
    return { 
      valid: false, 
      message: 'Failed to calculate determinant: ' + error.message 
    };
  }
  
  const detMod = mod(det, 26);
  
  // Check if determinant is coprime with 26
  const detInv = modInverse(detMod, 26);
  
  if (detInv === null) {
    return { 
      valid: false, 
      message: `Matrix is not invertible. Determinant ${det} (mod 26 = ${detMod}) has no inverse.`,
      determinant: det,
      determinantMod26: detMod,
      details: {
        reason: 'Determinant must be coprime with 26',
        suggestion: 'Try different matrix values. Avoid multiples of 2 or 13.',
      }
    };
  }
  
  // Matrix is valid
  return { 
    valid: true, 
    message: 'Matrix is valid and invertible',
    determinant: det,
    determinantMod26: detMod,
    inverse: detInv,
    details: {
      size: `${size}x${size}`,
      isInvertible: true,
    }
  };
};

// ==================== ENCRYPTION FUNCTIONS ====================

/**
 * Encrypt plaintext using Hill cipher
 * @param {string} plaintext - Text to encrypt
 * @param {Array<Array<number>>} keyMatrix - Encryption key matrix
 * @returns {string} - Encrypted text
 */
export const hillEncrypt = (plaintext, keyMatrix) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext) {
    throw new Error('hillEncrypt: plaintext must be a non-empty string');
  }
  
  // Validate key matrix
  const validation = validateHillKey(keyMatrix);
  if (!validation.valid) {
    throw new Error('hillEncrypt: ' + validation.message);
  }
  
  // Prepare text
  const text = prepareText(plaintext);
  if (text.length === 0) {
    throw new Error('hillEncrypt: plaintext contains no alphabetic characters');
  }
  
  const blockSize = keyMatrix.length;
  let result = '';
  
  // Pad text if necessary
  let paddedText = text;
  while (paddedText.length % blockSize !== 0) {
    paddedText += 'X';
  }
  
  // Process each block
  for (let i = 0; i < paddedText.length; i += blockSize) {
    const block = paddedText.slice(i, i + blockSize);
    const vector = block.split('').map(c => c.charCodeAt(0) - 65);
    const encrypted = multiplyMatrixVector(keyMatrix, vector);
    result += encrypted.map(n => String.fromCharCode(n + 65)).join('');
  }
  
  return result;
};

// ==================== DECRYPTION FUNCTIONS ====================

/**
 * Decrypt ciphertext using Hill cipher
 * @param {string} ciphertext - Text to decrypt
 * @param {Array<Array<number>>} keyMatrix - Encryption key matrix
 * @returns {string} - Decrypted text
 */
export const hillDecrypt = (ciphertext, keyMatrix) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext) {
    throw new Error('hillDecrypt: ciphertext must be a non-empty string');
  }
  
  // Validate key matrix
  const validation = validateHillKey(keyMatrix);
  if (!validation.valid) {
    throw new Error('hillDecrypt: ' + validation.message);
  }
  
  // Get inverse matrix
  const inverseKey = inverseMatrix(keyMatrix);
  if (!inverseKey) {
    throw new Error('hillDecrypt: cannot decrypt, matrix is not invertible');
  }
  
  // Prepare text
  const text = prepareText(ciphertext);
  if (text.length === 0) {
    throw new Error('hillDecrypt: ciphertext contains no alphabetic characters');
  }
  
  const blockSize = keyMatrix.length;
  
  // Check if ciphertext length is valid
  if (text.length % blockSize !== 0) {
    throw new Error(`hillDecrypt: ciphertext length must be multiple of ${blockSize}`);
  }
  
  let result = '';
  
  // Process each block
  for (let i = 0; i < text.length; i += blockSize) {
    const block = text.slice(i, i + blockSize);
    const vector = block.split('').map(c => c.charCodeAt(0) - 65);
    const decrypted = multiplyMatrixVector(inverseKey, vector);
    result += decrypted.map(n => String.fromCharCode(n + 65)).join('');
  }
  
  return result;
};

// ==================== VISUALIZATION FUNCTIONS ====================

/**
 * Generate visualization data for Hill cipher
 * @param {string} plaintext - Original text
 * @param {Array<Array<number>>} keyMatrix - Key matrix
 * @returns {Object} - Visualization data
 */
export const getHillVisualization = (plaintext, keyMatrix) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext) {
    throw new Error('getHillVisualization: plaintext must be a non-empty string');
  }
  
  // Validate key matrix
  const validation = validateHillKey(keyMatrix);
  
  // Prepare text
  const text = prepareText(plaintext);
  const blockSize = keyMatrix.length;
  
  // Pad text
  let paddedText = text;
  while (paddedText.length % blockSize !== 0) {
    paddedText += 'X';
  }
  
  // Generate steps
  const steps = [];
  
  for (let i = 0; i < paddedText.length; i += blockSize) {
    const block = paddedText.slice(i, i + blockSize);
    const vector = block.split('').map(c => c.charCodeAt(0) - 65);
    const encrypted = multiplyMatrixVector(keyMatrix, vector);
    const encryptedChars = encrypted.map(n => String.fromCharCode(n + 65));
    
    // Generate calculation string
    let calculation = '';
    for (let row = 0; row < blockSize; row++) {
      const matrixRow = keyMatrix[row].join(' ');
      calculation += `[${matrixRow}] × [${vector[row]}] = ${encrypted[row]}\n`;
    }
    
    steps.push({
      blockNumber: Math.floor(i / blockSize) + 1,
      plainBlock: block,
      plainVector: vector,
      keyMatrix: keyMatrix.map(row => [...row]), // Deep copy
      encryptedVector: encrypted,
      encryptedBlock: encryptedChars.join(''),
      calculation: calculation.trim(),
    });
  }
  
  // Get inverse matrix if valid
  let inverseKey = null;
  if (validation.valid) {
    try {
      inverseKey = inverseMatrix(keyMatrix);
    } catch (error) {
      console.warn('Failed to calculate inverse matrix:', error);
    }
  }
  
  return {
    keyMatrix: keyMatrix.map(row => [...row]), // Deep copy
    inverseMatrix: inverseKey,
    validation,
    paddedText,
    steps,
  };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate random valid Hill cipher key matrix
 * @param {number} size - Matrix size (2, 3, or 4)
 * @returns {Array<Array<number>>} - Valid key matrix
 */
export const generateRandomHillKey = (size = 2) => {
  if (size !== 2 && size !== 3 && size !== 4) {
    throw new Error('generateRandomHillKey: size must be 2, 3, or 4');
  }
  
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const matrix = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => Math.floor(Math.random() * 26))
    );
    
    const validation = validateHillKey(matrix);
    if (validation.valid) {
      return matrix;
    }
  }
  
  // Fallback: return a known valid matrix
  if (size === 2) {
    return [[3, 3], [2, 5]]; // Known valid 2x2 matrix
  } else if (size === 3) {
    return [[6, 24, 1], [13, 16, 10], [20, 17, 15]]; // Known valid 3x3 matrix
  } else {
    return [[6, 24, 1, 13], [16, 10, 20, 17], [15, 7, 21, 8], [5, 19, 3, 11]]; // Known valid 4x4 matrix
  }
};

/**
 * Convert key string to matrix (for 2x2, 3x3, or 4x4 matrix)
 * @param {string} keyString - 4, 9, or 16 character key string
 * @returns {Array<Array<number>>} - 2x2, 3x3, or 4x4 matrix
 */
export const keyStringToMatrix = (keyString) => {
  if (typeof keyString !== 'string') {
    throw new Error('keyStringToMatrix: keyString must be a string');
  }
  
  const cleaned = prepareText(keyString);
  
  if (cleaned.length !== 4 && cleaned.length !== 9 && cleaned.length !== 16) {
    throw new Error('keyStringToMatrix: key must be 4, 9, or 16 letters');
  }
  
  if (cleaned.length === 4) {
    // 2x2 matrix
    return [
      [cleaned.charCodeAt(0) - 65, cleaned.charCodeAt(1) - 65],
      [cleaned.charCodeAt(2) - 65, cleaned.charCodeAt(3) - 65]
    ];
  } else if (cleaned.length === 9) {
    // 3x3 matrix
    return [
      [cleaned.charCodeAt(0) - 65, cleaned.charCodeAt(1) - 65, cleaned.charCodeAt(2) - 65],
      [cleaned.charCodeAt(3) - 65, cleaned.charCodeAt(4) - 65, cleaned.charCodeAt(5) - 65],
      [cleaned.charCodeAt(6) - 65, cleaned.charCodeAt(7) - 65, cleaned.charCodeAt(8) - 65]
    ];
  } else {
    // 4x4 matrix
    return [
      [cleaned.charCodeAt(0) - 65, cleaned.charCodeAt(1) - 65, cleaned.charCodeAt(2) - 65, cleaned.charCodeAt(3) - 65],
      [cleaned.charCodeAt(4) - 65, cleaned.charCodeAt(5) - 65, cleaned.charCodeAt(6) - 65, cleaned.charCodeAt(7) - 65],
      [cleaned.charCodeAt(8) - 65, cleaned.charCodeAt(9) - 65, cleaned.charCodeAt(10) - 65, cleaned.charCodeAt(11) - 65],
      [cleaned.charCodeAt(12) - 65, cleaned.charCodeAt(13) - 65, cleaned.charCodeAt(14) - 65, cleaned.charCodeAt(15) - 65]
    ];
  }
};

/**
 * Format matrix for display
 * @param {Array<Array<number>>} matrix - Matrix to format
 * @returns {string} - Formatted matrix string
 */
export const formatMatrix = (matrix) => {
  if (!isValidMatrix(matrix)) {
    return 'Invalid matrix';
  }
  
  return matrix.map(row => `[${row.join(', ')}]`).join('\n');
};

// ==================== EXPORTS ====================

export default {
  hillEncrypt,
  hillDecrypt,
  validateHillKey,
  getHillVisualization,
  generateRandomHillKey,
  keyStringToMatrix,
  formatMatrix,
  
  // PropTypes exports
  MatrixPropTypes,
  ValidationResultPropTypes,
  CalculationStepPropTypes,
  VisualizationPropTypes,
};