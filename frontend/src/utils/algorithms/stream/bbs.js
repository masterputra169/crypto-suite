// src/utils/algorithms/stream/bbs.js

import PropTypes from 'prop-types';

/**
 * Blum Blum Shub (BBS) Stream Cipher
 * Formula: X(n+1) = X(n)² mod M
 * where M = p × q (p and q are large primes ≡ 3 (mod 4))
 * 
 * Cryptographically Secure Pseudorandom Number Generator
 * More secure than LCG but slower
 */

// ==================== PROP TYPES DEFINITIONS ====================

export const BBSConfigPropTypes = PropTypes.shape({
  seed: PropTypes.number.isRequired,
  p: PropTypes.number.isRequired,
  q: PropTypes.number.isRequired,
  M: PropTypes.number.isRequired,
});

export const BBSKeystreamStepPropTypes = PropTypes.shape({
  step: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  keyBit: PropTypes.number.isRequired,
  keyByte: PropTypes.number,
});

// ==================== PRIME NUMBERS AND PRESETS ====================

/**
 * Blum primes: p ≡ 3 (mod 4)
 * These are pre-selected primes for different security levels
 */
export const BLUM_PRIMES = {
  SMALL: [11, 19, 23, 31, 43, 47, 59, 67, 71, 79, 83, 103, 107, 127, 131, 139, 151, 163, 167, 179],
  MEDIUM: [191, 199, 211, 223, 227, 239, 251, 263, 271, 283, 307, 311, 331, 347, 359, 367, 379, 383, 419, 431],
  LARGE: [443, 463, 467, 479, 487, 491, 499, 503, 523, 547, 563, 571, 587, 599, 607, 619, 631, 643, 647, 659],
};

/**
 * Preset BBS configurations
 */
export const BBS_PRESETS = {
  SMALL: {
    name: 'Small (Educational)',
    p: 499,
    q: 547,
    M: 499 * 547, // 272,953
    description: 'Fast but less secure - for learning',
    securityLevel: 'Low',
  },
  MEDIUM: {
    name: 'Medium',
    p: 1019,
    q: 1031,
    M: 1019 * 1031, // 1,050,589
    description: 'Balanced speed and security',
    securityLevel: 'Medium',
  },
  LARGE: {
    name: 'Large (Secure)',
    p: 2003,
    q: 2011,
    M: 2003 * 2011, // 4,028,033
    description: 'Slower but more secure',
    securityLevel: 'High',
  },
  DEMO: {
    name: 'Demo (Very Fast)',
    p: 11,
    q: 19,
    M: 11 * 19, // 209
    description: 'Tiny primes for demonstration',
    securityLevel: 'Very Low',
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if number is prime (simple trial division)
 */
const isPrime = (n) => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
};

/**
 * Check if prime is a Blum prime (p ≡ 3 mod 4)
 */
const isBlumPrime = (p) => {
  return isPrime(p) && p % 4 === 3;
};

/**
 * Calculate GCD using Euclidean algorithm
 */
const gcd = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Validate BBS parameters
 */
const validateBBSParams = (seed, p, q, M) => {
  const errors = [];
  
  if (typeof seed !== 'number' || !Number.isInteger(seed) || seed <= 0) {
    errors.push('Seed must be a positive integer');
  }
  if (typeof p !== 'number' || !Number.isInteger(p) || p <= 0) {
    errors.push('p must be a positive integer');
  }
  if (typeof q !== 'number' || !Number.isInteger(q) || q <= 0) {
    errors.push('q must be a positive integer');
  }
  if (typeof M !== 'number' || !Number.isInteger(M) || M <= 0) {
    errors.push('M must be a positive integer');
  }
  
  // Check if primes are Blum primes
  if (!isBlumPrime(p)) {
    errors.push('p must be a Blum prime (prime and ≡ 3 mod 4)');
  }
  if (!isBlumPrime(q)) {
    errors.push('q must be a Blum prime (prime and ≡ 3 mod 4)');
  }
  
  // Check if M = p × q
  if (p * q !== M) {
    errors.push('M must equal p × q');
  }
  
  // Check if seed is coprime with M
  if (seed >= M) {
    errors.push(`Seed must be less than M (${M})`);
  }
  if (gcd(seed, M) !== 1) {
    errors.push('Seed must be coprime with M (gcd(seed, M) = 1)');
  }
  
  return errors;
};

/**
 * Calculate next BBS value: X(n+1) = X(n)² mod M
 */
const nextBBS = (current, M) => {
  // Use BigInt for large numbers to prevent overflow
  const bigCurrent = BigInt(current);
  const bigM = BigInt(M);
  const result = (bigCurrent * bigCurrent) % bigM;
  return Number(result);
};

/**
 * Generate BBS keystream
 */
const generateBBSKeystream = (length, seed, M, outputBits = 1) => {
  const keystream = [];
  let current = seed;
  let bitBuffer = [];
  
  let step = 0;
  while (keystream.length < length) {
    current = nextBBS(current, M);
    step++;
    
    // Extract least significant bit(s)
    for (let i = 0; i < outputBits; i++) {
      const bit = (current >> i) & 1;
      bitBuffer.push(bit);
      
      // When we have 8 bits, form a byte
      if (bitBuffer.length === 8) {
        let keyByte = 0;
        for (let j = 0; j < 8; j++) {
          keyByte = (keyByte << 1) | bitBuffer[j];
        }
        
        keystream.push({
          step: keystream.length + 1,
          value: current,
          keyBit: bitBuffer[7], // Last bit
          keyByte,
          bitBuffer: [...bitBuffer],
        });
        
        bitBuffer = [];
        
        if (keystream.length >= length) break;
      }
    }
  }
  
  return keystream;
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using BBS stream cipher
 */
export const bbsEncrypt = (plaintext, seed, p, q, M) => {
  if (typeof plaintext !== 'string' || !plaintext) {
    throw new Error('bbsEncrypt: plaintext must be a non-empty string');
  }
  
  const errors = validateBBSParams(seed, p, q, M);
  if (errors.length > 0) {
    throw new Error('bbsEncrypt: ' + errors.join(', '));
  }
  
  try {
    const keystream = generateBBSKeystream(plaintext.length, seed, M);
    
    let result = '';
    
    for (let i = 0; i < plaintext.length; i++) {
      const plainByte = plaintext.charCodeAt(i);
      const keyByte = keystream[i].keyByte;
      const cipherByte = plainByte ^ keyByte; // XOR
      
      result += cipherByte.toString(16).padStart(2, '0');
    }
    
    return result.toUpperCase();
  } catch (error) {
    throw new Error(`BBS Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using BBS stream cipher
 */
export const bbsDecrypt = (ciphertext, seed, p, q, M) => {
  if (typeof ciphertext !== 'string' || !ciphertext) {
    throw new Error('bbsDecrypt: ciphertext must be a non-empty string');
  }
  
  if (!/^[0-9A-Fa-f]+$/.test(ciphertext)) {
    throw new Error('bbsDecrypt: ciphertext must be a valid hex string');
  }
  
  if (ciphertext.length % 2 !== 0) {
    throw new Error('bbsDecrypt: ciphertext hex string must have even length');
  }
  
  const errors = validateBBSParams(seed, p, q, M);
  if (errors.length > 0) {
    throw new Error('bbsDecrypt: ' + errors.join(', '));
  }
  
  try {
    // Convert hex to bytes
    const bytes = [];
    for (let i = 0; i < ciphertext.length; i += 2) {
      bytes.push(parseInt(ciphertext.substr(i, 2), 16));
    }
    
    const keystream = generateBBSKeystream(bytes.length, seed, M);
    
    let result = '';
    
    for (let i = 0; i < bytes.length; i++) {
      const cipherByte = bytes[i];
      const keyByte = keystream[i].keyByte;
      const plainByte = cipherByte ^ keyByte; // XOR
      
      result += String.fromCharCode(plainByte);
    }
    
    return result;
  } catch (error) {
    throw new Error(`BBS Decryption failed: ${error.message}`);
  }
};

/**
 * Get visualization data for BBS
 */
export const getBBSVisualization = (plaintext, seed, p, q, M) => {
  if (typeof plaintext !== 'string' || !plaintext) {
    throw new Error('getBBSVisualization: plaintext must be a non-empty string');
  }
  
  const errors = validateBBSParams(seed, p, q, M);
  if (errors.length > 0) {
    throw new Error('getBBSVisualization: ' + errors.join(', '));
  }
  
  try {
    const keystream = generateBBSKeystream(plaintext.length, seed, M);
    const ciphertext = bbsEncrypt(plaintext, seed, p, q, M);
    
    // Create mapping
    const mapping = [];
    const cipherBytes = [];
    
    for (let i = 0; i < ciphertext.length; i += 2) {
      cipherBytes.push(parseInt(ciphertext.substr(i, 2), 16));
    }
    
    for (let i = 0; i < plaintext.length; i++) {
      const plainChar = plaintext[i];
      const plainByte = plaintext.charCodeAt(i);
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
    
    // Calculate period
    const period = detectBBSPeriod(seed, M);
    
    // Quality analysis
    const quality = analyzeBBSQuality(seed, p, q, M, keystream);
    
    return {
      config: { seed, p, q, M },
      keystream: keystream.slice(0, Math.min(50, keystream.length)),
      plaintext,
      ciphertext,
      mapping,
      period,
      quality,
      textLength: plaintext.length,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Detect BBS period
 */
const detectBBSPeriod = (seed, M) => {
  const seen = new Set();
  let current = seed;
  let count = 0;
  const maxIterations = Math.min(10000, M);
  
  while (count < maxIterations) {
    current = nextBBS(current, M);
    count++;
    
    if (seen.has(current)) {
      return count;
    }
    seen.add(current);
  }
  
  return null; // Period too long or not detected
};

/**
 * Analyze BBS quality
 */
const analyzeBBSQuality = (seed, p, q, M, keystream) => {
  const scores = [];
  
  // 1. Prime Quality Test
  const primeScore = analyzePrimeQuality(p, q);
  scores.push({
    test: 'Prime Quality',
    passed: primeScore > 80,
    score: primeScore,
    description: primeScore > 80 ? 'Good Blum primes' : 'Weak Blum primes',
  });
  
  // 2. Randomness Test
  const randomnessScore = testRandomness(keystream.map(k => k.keyByte));
  scores.push({
    test: 'Randomness',
    passed: randomnessScore > 75,
    score: randomnessScore,
    description: randomnessScore > 75 ? 'High randomness' : 'Low randomness',
  });
  
  // 3. Chi-Square Test
  const chiSquare = calculateChiSquare(keystream.map(k => k.keyByte));
  scores.push({
    test: 'Chi-Square',
    passed: chiSquare.passed,
    score: chiSquare.score,
    description: chiSquare.description,
  });
  
  // 4. Bit Balance Test
  const bitBalance = testBitBalance(keystream);
  scores.push({
    test: 'Bit Balance',
    passed: bitBalance > 80,
    score: bitBalance,
    description: bitBalance > 80 ? 'Well-balanced bits' : 'Unbalanced bits',
  });
  
  const overallScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  
  return {
    scores,
    overallScore: Math.round(overallScore),
    grade: getQualityGrade(overallScore),
    securityLevel: getSecurityLevel(p, q, overallScore),
    recommendation: getRecommendation(overallScore, p, q),
  };
};

/**
 * Analyze prime quality
 */
const analyzePrimeQuality = (p, q) => {
  let score = 100;
  
  // Prefer larger primes
  if (p < 100 || q < 100) score -= 30;
  else if (p < 500 || q < 500) score -= 20;
  else if (p < 1000 || q < 1000) score -= 10;
  
  // Check if primes are close (not ideal)
  const ratio = Math.max(p, q) / Math.min(p, q);
  if (ratio < 1.1) score -= 20;
  
  return Math.max(0, score);
};

/**
 * Test randomness
 */
const testRandomness = (bytes) => {
  if (bytes.length < 10) return 50;
  
  const mean = bytes.reduce((sum, b) => sum + b, 0) / bytes.length;
  const variance = bytes.reduce((sum, b) => sum + Math.pow(b - mean, 2), 0) / bytes.length;
  
  const meanScore = Math.max(0, 100 - Math.abs(mean - 127.5) * 2);
  const varianceScore = Math.min(100, (variance / 1000) * 100);
  
  return (meanScore + varianceScore) / 2;
};

/**
 * Calculate chi-square
 */
const calculateChiSquare = (bytes) => {
  if (bytes.length < 50) {
    return { passed: false, score: 0, description: 'Insufficient data' };
  }
  
  const bins = 16;
  const binSize = 256 / bins;
  const frequency = new Array(bins).fill(0);
  
  for (const byte of bytes) {
    const bin = Math.floor(byte / binSize);
    frequency[bin]++;
  }
  
  const expected = bytes.length / bins;
  let chiSquare = 0;
  
  for (const observed of frequency) {
    chiSquare += Math.pow(observed - expected, 2) / expected;
  }
  
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
 * Test bit balance
 */
const testBitBalance = (keystream) => {
  const allBits = keystream.flatMap(k => k.bitBuffer || []);
  const ones = allBits.filter(b => b === 1).length;
  const zeros = allBits.length - ones;
  
  const ratio = Math.min(ones, zeros) / Math.max(ones, zeros);
  return ratio * 100;
};

/**
 * Get quality grade
 */
const getQualityGrade = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Very Poor';
};

/**
 * Get security level
 */
const getSecurityLevel = (p, q, score) => {
  const M = p * q;
  
  if (M > 1000000 && score > 85) return 'High';
  if (M > 100000 && score > 75) return 'Medium';
  if (M > 10000 && score > 60) return 'Low';
  return 'Very Low';
};

/**
 * Get recommendation
 */
const getRecommendation = (score, p, q) => {
  if (score >= 85) {
    return 'Excellent BBS configuration. Cryptographically secure for educational use.';
  } else if (score >= 70) {
    return 'Good configuration. Consider using larger primes for better security.';
  } else {
    return 'Weak configuration. Use preset "Large" or bigger primes for better security.';
  }
};

// ==================== ANALYSIS & UTILITY FUNCTIONS ====================

/**
 * Analyze BBS parameters
 */
export const analyzeBBSParameters = (seed, p, q, M) => {
  const errors = validateBBSParams(seed, p, q, M);
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  
  const sampleSize = Math.min(100, M);
  const keystream = generateBBSKeystream(sampleSize, seed, M);
  const quality = analyzeBBSQuality(seed, p, q, M, keystream);
  
  return {
    valid: true,
    errors: [],
    quality,
    parameters: { seed, p, q, M },
  };
};

/**
 * Generate random coprime seed
 */
export const generateRandomSeed = (M) => {
  let seed;
  do {
    seed = Math.floor(Math.random() * (M - 2)) + 2;
  } while (gcd(seed, M) !== 1);
  
  return seed;
};

/**
 * Get random Blum prime from list
 */
export const getRandomBlumPrime = (size = 'MEDIUM') => {
  const primes = BLUM_PRIMES[size] || BLUM_PRIMES.MEDIUM;
  return primes[Math.floor(Math.random() * primes.length)];
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
  bbsEncrypt,
  bbsDecrypt,
  getBBSVisualization,
  analyzeBBSParameters,
  generateRandomSeed,
  getRandomBlumPrime,
  textToHex,
  hexToText,
  BBS_PRESETS,
  BLUM_PRIMES,
  
  // PropTypes
  BBSConfigPropTypes,
  BBSKeystreamStepPropTypes,
};