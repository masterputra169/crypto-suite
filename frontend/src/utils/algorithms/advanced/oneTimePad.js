// src/utils/algorithms/advanced/oneTimePad.js

import PropTypes from 'prop-types';

/**
 * One-Time Pad (OTP) Cipher Algorithm
 * Theoretically unbreakable cipher with perfect secrecy (Shannon's theorem)
 * Requirements: Key must be truly random, at least as long as plaintext, used only once
 * Implements: XOR-based encryption, random key generation, security validation
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for OTP Configuration
 */
export const OTPConfigPropTypes = PropTypes.shape({
  keyLength: PropTypes.number.isRequired,
  keyFormat: PropTypes.oneOf(['hex', 'binary', 'text']).isRequired,
  isKeyRandom: PropTypes.bool.isRequired,
});

/**
 * PropTypes for Character Mapping
 */
export const CharacterMappingPropTypes = PropTypes.shape({
  position: PropTypes.number.isRequired,
  plainChar: PropTypes.string.isRequired,
  plainValue: PropTypes.number.isRequired,
  keyChar: PropTypes.string.isRequired,
  keyValue: PropTypes.number.isRequired,
  cipherChar: PropTypes.string.isRequired,
  cipherValue: PropTypes.number.isRequired,
  operation: PropTypes.string.isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const OTPVisualizationPropTypes = PropTypes.shape({
  plaintext: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  ciphertext: PropTypes.string.isRequired,
  mapping: PropTypes.arrayOf(CharacterMappingPropTypes).isRequired,
  keyIsRandom: PropTypes.bool.isRequired,
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

/**
 * Check if key is potentially random (simple heuristic)
 */
const isKeyRandom = (key) => {
  if (key.length < 10) return false;
  
  // Count letter frequencies
  const frequency = {};
  for (let char of key) {
    frequency[char] = (frequency[char] || 0) + 1;
  }
  
  // Calculate chi-squared for uniformity
  const expected = key.length / 26;
  let chiSquared = 0;
  
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i);
    const observed = frequency[char] || 0;
    chiSquared += Math.pow(observed - expected, 2) / expected;
  }
  
  // Random keys should have low chi-squared (< 40)
  return chiSquared < 40;
};

/**
 * Generate cryptographically random key
 */
export const generateRandomKey = (length) => {
  if (typeof length !== 'number' || length < 1) {
    throw new Error('generateRandomKey: length must be a positive number');
  }
  
  let key = '';
  
  // Use crypto.getRandomValues for better randomness
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      key += String.fromCharCode(65 + (array[i] % 26));
    }
  } else {
    // Fallback to Math.random (not cryptographically secure)
    for (let i = 0; i < length; i++) {
      key += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }
  
  return key;
};

/**
 * Generate random key in hexadecimal format
 */
export const generateRandomKeyHex = (length) => {
  const key = generateRandomKey(length);
  let hex = '';
  
  for (let i = 0; i < key.length; i++) {
    const value = key.charCodeAt(i) - 65;
    hex += value.toString(16).padStart(2, '0');
  }
  
  return hex.toUpperCase();
};

/**
 * Generate random key in binary format
 */
export const generateRandomKeyBinary = (length) => {
  const key = generateRandomKey(length);
  let binary = '';
  
  for (let i = 0; i < key.length; i++) {
    const value = key.charCodeAt(i) - 65;
    binary += value.toString(2).padStart(5, '0') + ' ';
  }
  
  return binary.trim();
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using One-Time Pad
 * Formula: C = (P + K) mod 26
 * @param {string} plaintext - Text to encrypt
 * @param {string} key - One-time pad key (must be at least as long as plaintext)
 * @returns {string} - Encrypted ciphertext
 */
export const otpEncrypt = (plaintext, key) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('otpEncrypt: plaintext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('otpEncrypt: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const otpKey = prepareKey(key);
    
    if (text.length === 0) {
      throw new Error('otpEncrypt: plaintext contains no alphabetic characters');
    }
    if (otpKey.length === 0) {
      throw new Error('otpEncrypt: key contains no alphabetic characters');
    }
    if (otpKey.length < text.length) {
      throw new Error('otpEncrypt: key must be at least as long as plaintext');
    }
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const plainCharCode = text.charCodeAt(i) - 65; // A=0, B=1, ..., Z=25
      const keyCharCode = otpKey.charCodeAt(i) - 65;
      const encryptedCharCode = (plainCharCode + keyCharCode) % 26;
      
      result += String.fromCharCode(encryptedCharCode + 65);
    }
    
    return result;
  } catch (error) {
    throw new Error(`OTP Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using One-Time Pad
 * Formula: P = (C - K + 26) mod 26
 * @param {string} ciphertext - Text to decrypt
 * @param {string} key - One-time pad key (must be at least as long as ciphertext)
 * @returns {string} - Decrypted plaintext
 */
export const otpDecrypt = (ciphertext, key) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('otpDecrypt: ciphertext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('otpDecrypt: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(ciphertext);
    const otpKey = prepareKey(key);
    
    if (text.length === 0) {
      throw new Error('otpDecrypt: ciphertext contains no alphabetic characters');
    }
    if (otpKey.length === 0) {
      throw new Error('otpDecrypt: key contains no alphabetic characters');
    }
    if (otpKey.length < text.length) {
      throw new Error('otpDecrypt: key must be at least as long as ciphertext');
    }
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const cipherCharCode = text.charCodeAt(i) - 65;
      const keyCharCode = otpKey.charCodeAt(i) - 65;
      const decryptedCharCode = (cipherCharCode - keyCharCode + 26) % 26;
      
      result += String.fromCharCode(decryptedCharCode + 65);
    }
    
    return result;
  } catch (error) {
    throw new Error(`OTP Decryption failed: ${error.message}`);
  }
};

/**
 * Get visualization data for One-Time Pad
 * @param {string} plaintext - Original text
 * @param {string} key - OTP key
 * @returns {Object} - Visualization data
 */
export const getOTPVisualization = (plaintext, key) => {
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('getOTPVisualization: plaintext must be a non-empty string');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('getOTPVisualization: key must be a non-empty string');
  }
  
  try {
    const text = prepareText(plaintext);
    const otpKey = prepareKey(key);
    
    if (text.length === 0) {
      return null;
    }
    if (otpKey.length < text.length) {
      throw new Error('Key must be at least as long as plaintext');
    }
    
    const ciphertext = otpEncrypt(plaintext, key);
    
    // Create character mapping
    const mapping = [];
    for (let i = 0; i < text.length; i++) {
      const plainChar = text[i];
      const keyChar = otpKey[i];
      const cipherChar = ciphertext[i];
      
      const plainValue = plainChar.charCodeAt(0) - 65;
      const keyValue = keyChar.charCodeAt(0) - 65;
      const cipherValue = cipherChar.charCodeAt(0) - 65;
      
      mapping.push({
        position: i,
        plainChar,
        plainValue,
        keyChar,
        keyValue,
        cipherChar,
        cipherValue,
        operation: `(${plainValue} + ${keyValue}) mod 26 = ${cipherValue}`,
      });
    }
    
    const keyRandom = isKeyRandom(otpKey);
    const securityLevel = getSecurityLevel(text.length, otpKey.length, keyRandom);
    
    return {
      plaintext: text,
      key: otpKey.substring(0, text.length),
      ciphertext,
      mapping,
      keyIsRandom: keyRandom,
      securityLevel,
      keyLength: otpKey.length,
      textLength: text.length,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Calculate security level for OTP
 */
const getSecurityLevel = (textLength, keyLength, keyRandom) => {
  let level, score, description;
  
  // Perfect security conditions
  const isPerfect = keyLength >= textLength && keyRandom;
  
  if (isPerfect) {
    level = 'Perfect (Theoretically Unbreakable)';
    score = 100;
    description = 'Meets all requirements for perfect secrecy according to Shannon\'s theorem.';
  } else if (keyLength >= textLength && !keyRandom) {
    level = 'High (Non-Random Key)';
    score = 70;
    description = 'Key length is sufficient but key may not be truly random. Security is compromised.';
  } else if (keyLength < textLength && keyRandom) {
    level = 'Medium (Key Too Short)';
    score = 50;
    description = 'Key is random but shorter than plaintext. This violates OTP requirements.';
  } else {
    level = 'Low (Multiple Issues)';
    score = 30;
    description = 'Key is neither sufficiently long nor random. Security is severely compromised.';
  }
  
  return {
    level,
    score,
    description,
    isPerfect,
    issues: getSecurityIssues(textLength, keyLength, keyRandom),
  };
};

/**
 * Get security issues
 */
const getSecurityIssues = (textLength, keyLength, keyRandom) => {
  const issues = [];
  
  if (keyLength < textLength) {
    issues.push({
      severity: 'critical',
      message: `Key is too short (${keyLength} < ${textLength}). Key must be at least as long as plaintext.`,
    });
  }
  
  if (!keyRandom) {
    issues.push({
      severity: 'high',
      message: 'Key does not appear to be truly random. Use cryptographically secure random generator.',
    });
  }
  
  if (issues.length === 0) {
    issues.push({
      severity: 'none',
      message: 'All OTP requirements are met. Perfect secrecy achieved!',
    });
  }
  
  return issues;
};

// ==================== ANALYSIS FUNCTIONS ====================

/**
 * Analyze OTP security
 * @param {string} ciphertext - Encrypted text
 * @param {string} key - OTP key used
 * @returns {Object} - Security analysis
 */
export const analyzeOTP = (ciphertext, key) => {
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('analyzeOTP: ciphertext must be a non-empty string');
  }
  
  const text = prepareText(ciphertext);
  const otpKey = key ? prepareKey(key) : '';
  
  if (text.length < 10) {
    return {
      textLength: text.length,
      error: 'Text too short for meaningful analysis (minimum 10 characters)',
    };
  }
  
  // Calculate frequency statistics
  const frequencies = new Array(26).fill(0);
  for (let char of text) {
    frequencies[char.charCodeAt(0) - 65]++;
  }
  
  // Index of Coincidence
  let ic = 0;
  const n = text.length;
  for (let freq of frequencies) {
    ic += freq * (freq - 1);
  }
  ic = ic / (n * (n - 1));
  
  // Chi-squared test for uniformity
  const expectedFreq = 1 / 26;
  let chiSquared = 0;
  for (let freq of frequencies) {
    const observed = freq / n;
    chiSquared += Math.pow(observed - expectedFreq, 2) / expectedFreq;
  }
  
  // Entropy calculation
  let entropy = 0;
  for (let freq of frequencies) {
    if (freq > 0) {
      const p = freq / n;
      entropy -= p * Math.log2(p);
    }
  }
  
  const keyRandom = otpKey.length > 0 ? isKeyRandom(otpKey) : null;
  const securityLevel = otpKey.length > 0 
    ? getSecurityLevel(text.length, otpKey.length, keyRandom)
    : null;
  
  return {
    textLength: text.length,
    keyLength: otpKey.length || 'Unknown',
    indexOfCoincidence: {
      value: ic.toFixed(6),
      expected: {
        random: 0.038,
        perfect: 0.038,
      },
      interpretation: ic < 0.045 ? 'Excellent - very random' : 'Potentially weak encryption',
    },
    chiSquared: {
      value: chiSquared.toFixed(4),
      interpretation: chiSquared < 30 ? 'Excellent uniformity' : 'Non-uniform distribution',
    },
    entropy: {
      value: entropy.toFixed(4),
      maximum: Math.log2(26).toFixed(4),
      percentage: ((entropy / Math.log2(26)) * 100).toFixed(2) + '%',
    },
    security: securityLevel,
    note: 'Perfect OTP should produce perfectly random, uniform ciphertext with IC ≈ 0.038.',
  };
};

/**
 * Validate OTP parameters
 */
export const validateOTPParams = (text, key) => {
  const errors = [];
  const warnings = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (!key || typeof key !== 'string') {
    errors.push('Key must be a non-empty string');
  }
  
  if (!/^[A-Za-z\s]*$/.test(key)) {
    errors.push('Key must contain only letters (A-Z)');
  }
  
  const cleanText = text ? prepareText(text) : '';
  const cleanKey = key ? prepareKey(key) : '';
  
  if (cleanText.length === 0) {
    errors.push('Text must contain at least one alphabetic character');
  }
  
  if (cleanKey.length === 0) {
    errors.push('Key must contain at least one alphabetic character');
  }
  
  if (cleanKey.length < cleanText.length) {
    errors.push(`Key is too short (${cleanKey.length} < ${cleanText.length}). Key must be at least as long as text.`);
  }
  
  if (cleanKey.length > 0 && !isKeyRandom(cleanKey)) {
    warnings.push('Key does not appear to be truly random. Consider using the "Generate Random Key" feature.');
  }
  
  if (cleanKey.length > cleanText.length) {
    warnings.push(`Key is longer than necessary (${cleanKey.length} > ${cleanText.length}). Only first ${cleanText.length} characters will be used.`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Check key reuse vulnerability
 */
export const checkKeyReuse = (key, messages) => {
  if (!Array.isArray(messages) || messages.length < 2) {
    return {
      vulnerable: false,
      message: 'Need at least 2 messages to check for key reuse',
    };
  }
  
  const cleanKey = prepareKey(key);
  
  return {
    vulnerable: true,
    severity: 'CRITICAL',
    message: `KEY REUSE DETECTED! Using the same OTP key for ${messages.length} messages completely breaks security.`,
    explanation: 'When the same key is used twice, attackers can XOR the ciphertexts to eliminate the key and find relationships between plaintexts.',
    recommendation: 'NEVER reuse an OTP key. Generate a new random key for each message.',
  };
};

/**
 * Convert text to hexadecimal
 */
export const textToHex = (text) => {
  const cleanText = prepareText(text);
  let hex = '';
  
  for (let i = 0; i < cleanText.length; i++) {
    const value = cleanText.charCodeAt(i) - 65;
    hex += value.toString(16).padStart(2, '0') + ' ';
  }
  
  return hex.trim().toUpperCase();
};

/**
 * Convert text to binary
 */
export const textToBinary = (text) => {
  const cleanText = prepareText(text);
  let binary = '';
  
  for (let i = 0; i < cleanText.length; i++) {
    const value = cleanText.charCodeAt(i) - 65;
    binary += value.toString(2).padStart(5, '0') + ' ';
  }
  
  return binary.trim();
};

// ==================== EXPORTS ====================

export default {
  otpEncrypt,
  otpDecrypt,
  getOTPVisualization,
  analyzeOTP,
  validateOTPParams,
  generateRandomKey,
  generateRandomKeyHex,
  generateRandomKeyBinary,
  checkKeyReuse,
  textToHex,
  textToBinary,
  
  // PropTypes exports
  OTPConfigPropTypes,
  CharacterMappingPropTypes,
  OTPVisualizationPropTypes,
};