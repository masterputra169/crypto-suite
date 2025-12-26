// src/utils/algorithms/stream/lcg.js

import PropTypes from 'prop-types';

/**
 * Linear Congruential Generator (LCG) Stream Cipher
 * Formula: X(n+1) = (a * X(n) + c) mod m
 * Generates pseudorandom keystream for encryption
 * 
 * Standard LCG Parameters (similar to common implementations):
 * - Numerical Recipes: a=1664525, c=1013904223, m=2^32
 * - MINSTD: a=48271, c=0, m=2^31-1
 * - Custom: User-defined parameters
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for LCG Configuration
 */
export const LCGConfigPropTypes = PropTypes.shape({
  seed: PropTypes.number.isRequired,
  multiplier: PropTypes.number.isRequired,
  increment: PropTypes.number.isRequired,
  modulus: PropTypes.number.isRequired,
});

/**
 * PropTypes for Keystream Step
 */
export const KeystreamStepPropTypes = PropTypes.shape({
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  keyByte: PropTypes.number.isRequired,
  calculation: PropTypes.string.isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const LCGVisualizationPropTypes = PropTypes.shape({
  config: LCGConfigPropTypes.isRequired,
  keystream: PropTypes.arrayOf(KeystreamStepPropTypes).isRequired,
  plaintext: PropTypes.string.isRequired,
  ciphertext: PropTypes.string.isRequired,
  mapping: PropTypes.arrayOf(PropTypes.object).isRequired,
  period: PropTypes.number,
  quality: PropTypes.object,
});

// ==================== PREDEFINED LCG PARAMETERS ====================

/**
 * Preset LCG parameters for common implementations
 */
export const LCG_PRESETS = {
  NUMERICAL_RECIPES: {
    name: 'Numerical Recipes',
    multiplier: 1664525,
    increment: 1013904223,
    modulus: 4294967296, // 2^32
    description: 'Common in Numerical Recipes books',
  },
  MINSTD: {
    name: 'MINSTD',
    multiplier: 48271,
    increment: 0,
    modulus: 2147483647, // 2^31 - 1
    description: 'Minimal Standard by Park & Miller',
  },
  GLIBC: {
    name: 'GLIBC',
    multiplier: 1103515245,
    increment: 12345,
    modulus: 2147483648, // 2^31
    description: 'Used in glibc rand()',
  },
  BORLAND: {
    name: 'Borland C',
    multiplier: 22695477,
    increment: 1,
    modulus: 4294967296, // 2^32
    description: 'Borland C/C++ rand()',
  },
  SIMPLE: {
    name: 'Simple',
    multiplier: 1103515245,
    increment: 12345,
    modulus: 256,
    description: 'Simple 8-bit LCG for demonstration',
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Prepare text - convert to bytes
 */
const prepareText = (text) => {
  if (typeof text !== 'string') {
    throw new Error('prepareText: text must be a string');
  }
  return text;
};

/**
 * Validate LCG parameters
 */
const validateLCGParams = (seed, multiplier, increment, modulus) => {
  const errors = [];
  
  if (typeof seed !== 'number' || !Number.isInteger(seed)) {
    errors.push('Seed must be an integer');
  }
  if (typeof multiplier !== 'number' || !Number.isInteger(multiplier)) {
    errors.push('Multiplier must be an integer');
  }
  if (typeof increment !== 'number' || !Number.isInteger(increment)) {
    errors.push('Increment must be an integer');
  }
  if (typeof modulus !== 'number' || !Number.isInteger(modulus) || modulus <= 0) {
    errors.push('Modulus must be a positive integer');
  }
  
  if (seed < 0 || seed >= modulus) {
    errors.push(`Seed must be between 0 and ${modulus - 1}`);
  }
  if (multiplier < 0 || multiplier >= modulus) {
    errors.push(`Multiplier must be between 0 and ${modulus - 1}`);
  }
  if (increment < 0 || increment >= modulus) {
    errors.push(`Increment must be between 0 and ${modulus - 1}`);
  }
  
  return errors;
};

/**
 * Calculate next LCG value
 */
const nextLCG = (current, multiplier, increment, modulus) => {
  return (multiplier * current + increment) % modulus;
};

/**
 * Generate keystream using LCG
 */
const generateKeystream = (length, seed, multiplier, increment, modulus) => {
  const keystream = [];
  let current = seed;
  
  for (let i = 0; i < length; i++) {
    current = nextLCG(current, multiplier, increment, modulus);
    
    // Convert to byte (0-255)
    const keyByte = current % 256;
    
    keystream.push({
      step: i + 1,
      value: current,
      keyByte,
      calculation: `(${multiplier} × ${i === 0 ? seed : keystream[i-1]?.value || seed} + ${increment}) mod ${modulus} = ${current}`,
    });
  }
  
  return keystream;
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using LCG stream cipher
 * @param {string} plaintext - Text to encrypt
 * @param {number} seed - Initial seed (X0)
 * @param {number} multiplier - Multiplier (a)
 * @param {number} increment - Increment (c)
 * @param {number} modulus - Modulus (m)
 * @returns {string} - Encrypted ciphertext (hex)
 */
export const lcgEncrypt = (plaintext, seed, multiplier, increment, modulus) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext) {
    throw new Error('lcgEncrypt: plaintext must be a non-empty string');
  }
  
  const errors = validateLCGParams(seed, multiplier, increment, modulus);
  if (errors.length > 0) {
    throw new Error('lcgEncrypt: ' + errors.join(', '));
  }
  
  try {
    const text = prepareText(plaintext);
    const keystream = generateKeystream(text.length, seed, multiplier, increment, modulus);
    
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
      const plainByte = text.charCodeAt(i);
      const keyByte = keystream[i].keyByte;
      const cipherByte = plainByte ^ keyByte; // XOR operation
      
      // Convert to hex (2 digits)
      result += cipherByte.toString(16).padStart(2, '0');
    }
    
    return result.toUpperCase();
  } catch (error) {
    throw new Error(`LCG Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using LCG stream cipher
 * @param {string} ciphertext - Hex string to decrypt
 * @param {number} seed - Initial seed (X0)
 * @param {number} multiplier - Multiplier (a)
 * @param {number} increment - Increment (c)
 * @param {number} modulus - Modulus (m)
 * @returns {string} - Decrypted plaintext
 */
export const lcgDecrypt = (ciphertext, seed, multiplier, increment, modulus) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext) {
    throw new Error('lcgDecrypt: ciphertext must be a non-empty string');
  }
  
  // Validate hex string
  if (!/^[0-9A-Fa-f]+$/.test(ciphertext)) {
    throw new Error('lcgDecrypt: ciphertext must be a valid hex string');
  }
  
  if (ciphertext.length % 2 !== 0) {
    throw new Error('lcgDecrypt: ciphertext hex string must have even length');
  }
  
  const errors = validateLCGParams(seed, multiplier, increment, modulus);
  if (errors.length > 0) {
    throw new Error('lcgDecrypt: ' + errors.join(', '));
  }
  
  try {
    // Convert hex to bytes
    const bytes = [];
    for (let i = 0; i < ciphertext.length; i += 2) {
      bytes.push(parseInt(ciphertext.substr(i, 2), 16));
    }
    
    const keystream = generateKeystream(bytes.length, seed, multiplier, increment, modulus);
    
    let result = '';
    
    for (let i = 0; i < bytes.length; i++) {
      const cipherByte = bytes[i];
      const keyByte = keystream[i].keyByte;
      const plainByte = cipherByte ^ keyByte; // XOR operation
      
      result += String.fromCharCode(plainByte);
    }
    
    return result;
  } catch (error) {
    throw new Error(`LCG Decryption failed: ${error.message}`);
  }
};

/**
 * Get visualization data for LCG stream cipher
 * @param {string} plaintext - Original text
 * @param {number} seed - Initial seed
 * @param {number} multiplier - Multiplier
 * @param {number} increment - Increment
 * @param {number} modulus - Modulus
 * @returns {Object} - Visualization data
 */
export const getLCGVisualization = (plaintext, seed, multiplier, increment, modulus) => {
  if (typeof plaintext !== 'string' || !plaintext) {
    throw new Error('getLCGVisualization: plaintext must be a non-empty string');
  }
  
  const errors = validateLCGParams(seed, multiplier, increment, modulus);
  if (errors.length > 0) {
    throw new Error('getLCGVisualization: ' + errors.join(', '));
  }
  
  try {
    const text = prepareText(plaintext);
    const keystream = generateKeystream(text.length, seed, multiplier, increment, modulus);
    const ciphertext = lcgEncrypt(plaintext, seed, multiplier, increment, modulus);
    
    // Create character-by-character mapping
    const mapping = [];
    const cipherBytes = [];
    
    for (let i = 0; i < ciphertext.length; i += 2) {
      cipherBytes.push(parseInt(ciphertext.substr(i, 2), 16));
    }
    
    for (let i = 0; i < text.length; i++) {
      const plainChar = text[i];
      const plainByte = text.charCodeAt(i);
      const keyByte = keystream[i].keyByte;
      const cipherByte = cipherBytes[i];
      
      mapping.push({
        position: i,
        plainChar,
        plainByte,
        plainHex: plainByte.toString(16).padStart(2, '0').toUpperCase(),
        plainBinary: plainByte.toString(2).padStart(8, '0'),
        keyValue: keystream[i].value,
        keyByte,
        keyHex: keyByte.toString(16).padStart(2, '0').toUpperCase(),
        keyBinary: keyByte.toString(2).padStart(8, '0'),
        cipherByte,
        cipherHex: cipherByte.toString(16).padStart(2, '0').toUpperCase(),
        cipherBinary: cipherByte.toString(2).padStart(8, '0'),
        operation: `${plainByte} ⊕ ${keyByte} = ${cipherByte}`,
      });
    }
    
    // Calculate period and quality
    const period = detectPeriod(keystream.map(k => k.value));
    const quality = analyzeLCGQuality(seed, multiplier, increment, modulus, keystream);
    
    return {
      config: {
        seed,
        multiplier,
        increment,
        modulus,
      },
      keystream: keystream.slice(0, Math.min(50, keystream.length)), // Limit for display
      plaintext: text,
      ciphertext,
      mapping,
      period,
      quality,
      textLength: text.length,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Detect period in keystream
 */
const detectPeriod = (sequence) => {
  if (sequence.length < 2) return null;
  
  const maxPeriod = Math.min(1000, Math.floor(sequence.length / 2));
  
  for (let period = 1; period <= maxPeriod; period++) {
    let isValid = true;
    
    for (let i = 0; i < sequence.length - period; i++) {
      if (sequence[i] !== sequence[i + period]) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      return period;
    }
  }
  
  return null; // No period detected within limit
};

/**
 * Analyze LCG quality
 */
const analyzeLCGQuality = (seed, multiplier, increment, modulus, keystream) => {
  const scores = [];
  
  // 1. Full Period Test
  const hasFullPeriod = modulus <= 1000 ? checkFullPeriod(seed, multiplier, increment, modulus) : null;
  if (hasFullPeriod !== null) {
    scores.push({
      test: 'Full Period',
      passed: hasFullPeriod,
      score: hasFullPeriod ? 100 : 50,
      description: hasFullPeriod ? 'Generator has full period' : 'Generator does not have full period',
    });
  }
  
  // 2. Spectral Test (simplified)
  const spectralScore = calculateSpectralScore(keystream);
  scores.push({
    test: 'Spectral Test',
    passed: spectralScore > 70,
    score: spectralScore,
    description: spectralScore > 70 ? 'Good distribution' : 'Poor distribution',
  });
  
  // 3. Chi-Square Test
  const chiSquare = calculateChiSquare(keystream.map(k => k.keyByte));
  scores.push({
    test: 'Chi-Square',
    passed: chiSquare.passed,
    score: chiSquare.score,
    description: chiSquare.description,
  });
  
  // Overall score
  const overallScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  
  return {
    scores,
    overallScore: Math.round(overallScore),
    grade: getQualityGrade(overallScore),
    recommendation: getRecommendation(overallScore, multiplier, increment, modulus),
  };
};

/**
 * Check if LCG has full period
 */
const checkFullPeriod = (seed, multiplier, increment, modulus) => {
  const seen = new Set();
  let current = seed;
  let count = 0;
  const maxIterations = modulus + 1;
  
  while (count < maxIterations) {
    if (seen.has(current)) {
      return seen.size === modulus;
    }
    seen.add(current);
    current = nextLCG(current, multiplier, increment, modulus);
    count++;
  }
  
  return seen.size === modulus;
};

/**
 * Calculate spectral score (simplified)
 */
const calculateSpectralScore = (keystream) => {
  if (keystream.length < 10) return 50;
  
  const bytes = keystream.slice(0, 100).map(k => k.keyByte);
  const mean = bytes.reduce((sum, b) => sum + b, 0) / bytes.length;
  const variance = bytes.reduce((sum, b) => sum + Math.pow(b - mean, 2), 0) / bytes.length;
  
  // Ideal: mean around 127.5, good variance
  const meanScore = Math.max(0, 100 - Math.abs(mean - 127.5) * 2);
  const varianceScore = Math.min(100, (variance / 1000) * 100);
  
  return (meanScore + varianceScore) / 2;
};

/**
 * Calculate chi-square test
 */
const calculateChiSquare = (bytes) => {
  if (bytes.length < 50) {
    return { passed: false, score: 0, description: 'Insufficient data for chi-square test' };
  }
  
  // Count frequencies in 16 bins
  const bins = 16;
  const binSize = 256 / bins;
  const frequency = new Array(bins).fill(0);
  
  for (const byte of bytes) {
    const bin = Math.floor(byte / binSize);
    frequency[bin]++;
  }
  
  // Expected frequency
  const expected = bytes.length / bins;
  
  // Calculate chi-square
  let chiSquare = 0;
  for (const observed of frequency) {
    chiSquare += Math.pow(observed - expected, 2) / expected;
  }
  
  // Critical value for 15 degrees of freedom at 0.05 significance: 24.996
  const passed = chiSquare < 25;
  const score = Math.max(0, 100 - chiSquare * 2);
  
  return {
    passed,
    score: Math.round(score),
    chiSquare: chiSquare.toFixed(2),
    description: passed ? 'Uniform distribution' : 'Non-uniform distribution',
  };
};

/**
 * Get quality grade
 */
const getQualityGrade = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Very Poor';
};

/**
 * Get recommendation
 */
const getRecommendation = (score, multiplier, increment, modulus) => {
  if (score >= 80) {
    return 'LCG parameters are well-chosen. Suitable for educational purposes.';
  } else if (score >= 60) {
    return 'LCG parameters are acceptable but could be improved. Consider using a preset.';
  } else {
    return 'LCG parameters are poor. Use a well-tested preset like NUMERICAL_RECIPES or MINSTD.';
  }
};

// ==================== ANALYSIS FUNCTIONS ====================

/**
 * Analyze LCG parameters
 */
export const analyzeLCGParameters = (seed, multiplier, increment, modulus) => {
  const errors = validateLCGParams(seed, multiplier, increment, modulus);
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  // Generate sample keystream
  const sampleSize = Math.min(1000, modulus);
  const keystream = generateKeystream(sampleSize, seed, multiplier, increment, modulus);
  const quality = analyzeLCGQuality(seed, multiplier, increment, modulus, keystream);
  
  return {
    valid: true,
    errors: [],
    quality,
    parameters: {
      seed,
      multiplier,
      increment,
      modulus,
    },
  };
};

/**
 * Generate random seed
 */
export const generateRandomSeed = (modulus) => {
  return Math.floor(Math.random() * modulus);
};

/**
 * Convert text to hex
 */
export const textToHex = (text) => {
  let hex = '';
  for (let i = 0; i < text.length; i++) {
    hex += text.charCodeAt(i).toString(16).padStart(2, '0');
  }
  return hex.toUpperCase();
};

/**
 * Convert hex to text
 */
export const hexToText = (hex) => {
  let text = '';
  for (let i = 0; i < hex.length; i += 2) {
    text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return text;
};

// ==================== EXPORTS ====================

export default {
  lcgEncrypt,
  lcgDecrypt,
  getLCGVisualization,
  analyzeLCGParameters,
  generateRandomSeed,
  textToHex,
  hexToText,
  LCG_PRESETS,
  
  // PropTypes exports
  LCGConfigPropTypes,
  KeystreamStepPropTypes,
  LCGVisualizationPropTypes,
};