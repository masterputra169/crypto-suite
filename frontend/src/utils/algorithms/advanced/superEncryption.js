// src/utils/algorithms/advanced/superEncryption.js

import PropTypes from 'prop-types';

/**
 * Super Encryption (Product Cipher) Algorithm
 * Combines substitution and transposition ciphers for enhanced security
 * Typically: Substitution → Transposition (or vice versa)
 * Implements: Vigenère + Columnar Transposition
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for Super Encryption Configuration
 */
export const SuperEncryptionConfigPropTypes = PropTypes.shape({
  substitutionKey: PropTypes.string.isRequired,
  transpositionKey: PropTypes.string.isRequired,
  order: PropTypes.oneOf(['sub-trans', 'trans-sub']).isRequired,
});

/**
 * PropTypes for Pass Information
 */
export const PassInfoPropTypes = PropTypes.shape({
  passNumber: PropTypes.number.isRequired,
  method: PropTypes.oneOf(['substitution', 'transposition']).isRequired,
  input: PropTypes.string.isRequired,
  output: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const SuperEncryptionVisualizationPropTypes = PropTypes.shape({
  originalText: PropTypes.string.isRequired,
  firstPass: PassInfoPropTypes.isRequired,
  secondPass: PassInfoPropTypes.isRequired,
  finalResult: PropTypes.string.isRequired,
  config: SuperEncryptionConfigPropTypes.isRequired,
  securityLevel: PropTypes.string.isRequired,
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

// ==================== VIGENÈRE CIPHER (SUBSTITUTION) ====================

/**
 * Repeat key to match text length
 */
const repeatKey = (key, length) => {
  if (!key || length === 0) return '';
  let repeated = '';
  for (let i = 0; i < length; i++) {
    repeated += key[i % key.length];
  }
  return repeated;
};

/**
 * Vigenère encryption
 */
const vigenereEncrypt = (text, key) => {
  const cleanText = prepareText(text);
  const cleanKey = prepareKey(key);
  
  if (!cleanKey) {
    throw new Error('Substitution key is required');
  }
  
  const repeatedKey = repeatKey(cleanKey, cleanText.length);
  let result = '';
  
  for (let i = 0; i < cleanText.length; i++) {
    const plainCharCode = cleanText.charCodeAt(i) - 65;
    const keyCharCode = repeatedKey.charCodeAt(i) - 65;
    const encryptedCharCode = (plainCharCode + keyCharCode) % 26;
    result += String.fromCharCode(encryptedCharCode + 65);
  }
  
  return result;
};

/**
 * Vigenère decryption
 */
const vigenereDecrypt = (text, key) => {
  const cleanText = prepareText(text);
  const cleanKey = prepareKey(key);
  
  if (!cleanKey) {
    throw new Error('Substitution key is required');
  }
  
  const repeatedKey = repeatKey(cleanKey, cleanText.length);
  let result = '';
  
  for (let i = 0; i < cleanText.length; i++) {
    const cipherCharCode = cleanText.charCodeAt(i) - 65;
    const keyCharCode = repeatedKey.charCodeAt(i) - 65;
    const decryptedCharCode = (cipherCharCode - keyCharCode + 26) % 26;
    result += String.fromCharCode(decryptedCharCode + 65);
  }
  
  return result;
};

// ==================== COLUMNAR TRANSPOSITION ====================

/**
 * Get column order based on alphabetical sorting
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
 * Columnar transposition encryption
 */
const columnarEncrypt = (text, key) => {
  const cleanText = prepareText(text);
  const cleanKey = prepareKey(key);
  
  if (!cleanKey) {
    throw new Error('Transposition key is required');
  }
  
  const numCols = cleanKey.length;
  const grid = createGrid(cleanText, numCols);
  const columnOrder = getColumnOrder(cleanKey);
  
  let result = '';
  for (const colIndex of columnOrder) {
    for (let r = 0; r < grid.length; r++) {
      result += grid[r][colIndex];
    }
  }
  
  return result;
};

/**
 * Columnar transposition decryption
 */
const columnarDecrypt = (text, key) => {
  const cleanText = prepareText(text);
  const cleanKey = prepareKey(key);
  
  if (!cleanKey) {
    throw new Error('Transposition key is required');
  }
  
  const numCols = cleanKey.length;
  const numRows = Math.ceil(cleanText.length / numCols);
  
  const grid = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
  const columnOrder = getColumnOrder(cleanKey);
  
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
  
  return result.replace(/X+$/, '');
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using Super Encryption
 * @param {string} plaintext - Text to encrypt
 * @param {string} substitutionKey - Key for Vigenère cipher
 * @param {string} transpositionKey - Key for Columnar transposition
 * @param {string} order - Order of operations: 'sub-trans' or 'trans-sub'
 * @returns {string} - Encrypted ciphertext
 */
export const superEncrypt = (plaintext, substitutionKey, transpositionKey, order = 'sub-trans') => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('superEncrypt: plaintext must be a non-empty string');
  }
  if (typeof substitutionKey !== 'string' || !substitutionKey.trim()) {
    throw new Error('superEncrypt: substitutionKey must be a non-empty string');
  }
  if (typeof transpositionKey !== 'string' || !transpositionKey.trim()) {
    throw new Error('superEncrypt: transpositionKey must be a non-empty string');
  }
  if (order !== 'sub-trans' && order !== 'trans-sub') {
    throw new Error('superEncrypt: order must be "sub-trans" or "trans-sub"');
  }
  
  try {
    const text = prepareText(plaintext);
    
    if (text.length === 0) {
      throw new Error('superEncrypt: plaintext contains no alphabetic characters');
    }
    
    let result;
    
    if (order === 'sub-trans') {
      // First: Substitution (Vigenère)
      const afterSub = vigenereEncrypt(text, substitutionKey);
      // Second: Transposition (Columnar)
      result = columnarEncrypt(afterSub, transpositionKey);
    } else {
      // First: Transposition (Columnar)
      const afterTrans = columnarEncrypt(text, transpositionKey);
      // Second: Substitution (Vigenère)
      result = vigenereEncrypt(afterTrans, substitutionKey);
    }
    
    return result;
  } catch (error) {
    throw new Error(`Super Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using Super Encryption
 * @param {string} ciphertext - Text to decrypt
 * @param {string} substitutionKey - Key for Vigenère cipher
 * @param {string} transpositionKey - Key for Columnar transposition
 * @param {string} order - Order of operations used in encryption
 * @returns {string} - Decrypted plaintext
 */
export const superDecrypt = (ciphertext, substitutionKey, transpositionKey, order = 'sub-trans') => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('superDecrypt: ciphertext must be a non-empty string');
  }
  if (typeof substitutionKey !== 'string' || !substitutionKey.trim()) {
    throw new Error('superDecrypt: substitutionKey must be a non-empty string');
  }
  if (typeof transpositionKey !== 'string' || !transpositionKey.trim()) {
    throw new Error('superDecrypt: transpositionKey must be a non-empty string');
  }
  if (order !== 'sub-trans' && order !== 'trans-sub') {
    throw new Error('superDecrypt: order must be "sub-trans" or "trans-sub"');
  }
  
  try {
    const text = prepareText(ciphertext);
    
    if (text.length === 0) {
      throw new Error('superDecrypt: ciphertext contains no alphabetic characters');
    }
    
    let result;
    
    if (order === 'sub-trans') {
      // Reverse order: First decrypt transposition, then substitution
      const afterTrans = columnarDecrypt(text, transpositionKey);
      result = vigenereDecrypt(afterTrans, substitutionKey);
    } else {
      // Reverse order: First decrypt substitution, then transposition
      const afterSub = vigenereDecrypt(text, substitutionKey);
      result = columnarDecrypt(afterSub, transpositionKey);
    }
    
    return result;
  } catch (error) {
    throw new Error(`Super Decryption failed: ${error.message}`);
  }
};

/**
 * Get visualization data for Super Encryption
 * @param {string} plaintext - Original text
 * @param {string} substitutionKey - Substitution key
 * @param {string} transpositionKey - Transposition key
 * @param {string} order - Order of operations
 * @returns {Object} - Visualization data
 */
export const getSuperEncryptionVisualization = (plaintext, substitutionKey, transpositionKey, order = 'sub-trans') => {
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('getSuperEncryptionVisualization: plaintext must be a non-empty string');
  }
  if (typeof substitutionKey !== 'string' || !substitutionKey.trim()) {
    throw new Error('getSuperEncryptionVisualization: substitutionKey must be a non-empty string');
  }
  if (typeof transpositionKey !== 'string' || !transpositionKey.trim()) {
    throw new Error('getSuperEncryptionVisualization: transpositionKey must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const subKey = prepareKey(substitutionKey);
    const transKey = prepareKey(transpositionKey);
    
    if (text.length === 0) {
      return null;
    }
    
    let firstPass, secondPass;
    
    if (order === 'sub-trans') {
      // First Pass: Substitution
      const afterSub = vigenereEncrypt(text, subKey);
      firstPass = {
        passNumber: 1,
        method: 'substitution',
        methodName: 'Vigenère Cipher',
        input: text,
        output: afterSub,
        key: subKey,
      };
      
      // Second Pass: Transposition
      const afterTrans = columnarEncrypt(afterSub, transKey);
      secondPass = {
        passNumber: 2,
        method: 'transposition',
        methodName: 'Columnar Transposition',
        input: afterSub,
        output: afterTrans,
        key: transKey,
      };
    } else {
      // First Pass: Transposition
      const afterTrans = columnarEncrypt(text, transKey);
      firstPass = {
        passNumber: 1,
        method: 'transposition',
        methodName: 'Columnar Transposition',
        input: text,
        output: afterTrans,
        key: transKey,
      };
      
      // Second Pass: Substitution
      const afterSub = vigenereEncrypt(afterTrans, subKey);
      secondPass = {
        passNumber: 2,
        method: 'substitution',
        methodName: 'Vigenère Cipher',
        input: afterTrans,
        output: afterSub,
        key: subKey,
      };
    }
    
    const finalResult = superEncrypt(plaintext, subKey, transKey, order);
    const securityLevel = calculateSecurityLevel(subKey.length, transKey.length, text.length);
    
    return {
      originalText: text,
      firstPass,
      secondPass,
      finalResult,
      config: {
        substitutionKey: subKey,
        transpositionKey: transKey,
        order,
      },
      securityLevel,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Calculate security level
 */
const calculateSecurityLevel = (subKeyLen, transKeyLen, textLen) => {
  const keyStrength = (subKeyLen + transKeyLen) / 2;
  const complexity = subKeyLen * transKeyLen;
  
  let level, score, description;
  
  if (complexity >= 100 && keyStrength >= 8) {
    level = 'Very High';
    score = 95;
    description = 'Excellent security. Combination of substitution and transposition provides strong protection.';
  } else if (complexity >= 50 && keyStrength >= 6) {
    level = 'High';
    score = 80;
    description = 'Strong security. Good resistance to both frequency and pattern analysis.';
  } else if (complexity >= 25 && keyStrength >= 4) {
    level = 'Medium';
    score = 60;
    description = 'Moderate security. Provides basic protection against simple attacks.';
  } else {
    level = 'Low';
    score = 40;
    description = 'Weak security. Consider using longer keys for better protection.';
  }
  
  return {
    level,
    score,
    description,
    keyStrength: keyStrength.toFixed(1),
    complexity,
    recommendation: getRecommendation(subKeyLen, transKeyLen),
  };
};

/**
 * Get security recommendation
 */
const getRecommendation = (subKeyLen, transKeyLen) => {
  const recommendations = [];
  
  if (subKeyLen < 8) {
    recommendations.push('Use a longer substitution key (minimum 8 characters recommended)');
  }
  if (transKeyLen < 6) {
    recommendations.push('Use a longer transposition key (minimum 6 characters recommended)');
  }
  if (subKeyLen === transKeyLen) {
    recommendations.push('Consider using different key lengths for added complexity');
  }
  
  if (recommendations.length === 0) {
    return 'Key configuration is optimal for maximum security.';
  }
  
  return recommendations.join('. ');
};

// ==================== ANALYSIS FUNCTIONS ====================

/**
 * Analyze super encryption configuration
 */
export const analyzeSuperEncryption = (ciphertext, config) => {
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('analyzeSuperEncryption: ciphertext must be a non-empty string');
  }
  
  const text = prepareText(ciphertext);
  
  if (text.length < 20) {
    return {
      textLength: text.length,
      error: 'Text too short for meaningful analysis (minimum 20 characters)',
    };
  }
  
  const textLength = text.length;
  
  // Calculate frequency statistics
  const frequencies = new Array(26).fill(0);
  for (let char of text) {
    frequencies[char.charCodeAt(0) - 65]++;
  }
  
  // Index of Coincidence
  let ic = 0;
  const n = textLength;
  for (let freq of frequencies) {
    ic += freq * (freq - 1);
  }
  ic = ic / (n * (n - 1));
  
  // Chi-squared test
  const expectedFreq = 1 / 26;
  let chiSquared = 0;
  for (let freq of frequencies) {
    const observed = freq / n;
    chiSquared += Math.pow(observed - expectedFreq, 2) / expectedFreq;
  }
  
  return {
    textLength,
    indexOfCoincidence: {
      value: ic.toFixed(6),
      expected: {
        random: 0.038,
        english: 0.067,
      },
      interpretation: getICInterpretation(ic),
    },
    chiSquared: {
      value: chiSquared.toFixed(4),
      interpretation: getChiSquaredInterpretation(chiSquared),
    },
    security: calculateSecurityLevel(
      config?.substitutionKey?.length || 5,
      config?.transpositionKey?.length || 5,
      textLength
    ),
    note: 'Super encryption combines two cipher types, making cryptanalysis significantly more difficult.',
  };
};

/**
 * Interpret Index of Coincidence
 */
const getICInterpretation = (ic) => {
  if (ic < 0.045) {
    return 'Very random - consistent with strong encryption';
  } else if (ic < 0.055) {
    return 'Random - good encryption';
  } else if (ic < 0.065) {
    return 'Moderate randomness';
  } else {
    return 'Low randomness - may be vulnerable';
  }
};

/**
 * Interpret Chi-squared
 */
const getChiSquaredInterpretation = (chi) => {
  if (chi < 15) {
    return 'Excellent - very uniform distribution';
  } else if (chi < 25) {
    return 'Good - uniform distribution';
  } else if (chi < 35) {
    return 'Fair - somewhat uniform';
  } else {
    return 'Poor - non-uniform distribution';
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate super encryption parameters
 */
export const validateSuperEncryptionParams = (text, subKey, transKey) => {
  const errors = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (!subKey || typeof subKey !== 'string') {
    errors.push('Substitution key must be a non-empty string');
  }
  
  if (!transKey || typeof transKey !== 'string') {
    errors.push('Transposition key must be a non-empty string');
  }
  
  if (subKey && subKey.length < 3) {
    errors.push('Substitution key must be at least 3 characters long');
  }
  
  if (transKey && transKey.length < 2) {
    errors.push('Transposition key must be at least 2 characters long');
  }
  
  if (subKey && !/^[A-Za-z]+$/.test(subKey)) {
    errors.push('Substitution key must contain only letters (A-Z)');
  }
  
  if (transKey && !/^[A-Za-z]+$/.test(transKey)) {
    errors.push('Transposition key must contain only letters (A-Z)');
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
 * Compare with single cipher
 */
export const compareWithSingleCipher = (text, subKey, transKey) => {
  const superSecurity = calculateSecurityLevel(subKey.length, transKey.length, text.length);
  const singleSecurity = calculateSecurityLevel(subKey.length, 1, text.length);
  
  return {
    superEncryption: {
      score: superSecurity.score,
      level: superSecurity.level,
    },
    singleCipher: {
      score: singleSecurity.score,
      level: singleSecurity.level,
    },
    improvement: superSecurity.score - singleSecurity.score,
    improvementPercentage: ((superSecurity.score - singleSecurity.score) / singleSecurity.score * 100).toFixed(2) + '%',
    recommendation: 'Super encryption provides significantly better security than single ciphers.',
  };
};

// ==================== EXPORTS ====================

export default {
  superEncrypt,
  superDecrypt,
  getSuperEncryptionVisualization,
  analyzeSuperEncryption,
  validateSuperEncryptionParams,
  compareWithSingleCipher,
  
  // PropTypes exports
  SuperEncryptionConfigPropTypes,
  PassInfoPropTypes,
  SuperEncryptionVisualizationPropTypes,
};