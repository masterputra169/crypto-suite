// src/utils/algorithms/index.js

/**
 * Central Export File untuk semua algoritma kriptografi
 * Organized by module (A, B, C, D, E)
 */

// ============= MODULE A: SUBSTITUTION CIPHERS =============

// Caesar Cipher
export {
  caesarEncrypt,
  caesarDecrypt,
  rot13,
  getCaesarVisualization
} from './substitution/caesarCipher.js';

// Vigenère Cipher
export {
  vigenereEncrypt,
  vigenereDecrypt,
  getVigenereVisualization,
  generateVigenereSquare,
  getVigenereSquareChar,
  analyzeVigenere,
  findKeywordLength as findVigenereKeywordLength
} from './substitution/vigenereCipher.js';

// Beaufort Cipher
export {
  beaufortEncrypt,
  beaufortDecrypt,
  getBeaufortVisualization,
  generateBeaufortSquare,
  getBeaufortSquareChar,
  analyzeBeaufort,
  findKeywordLength as findBeaufortKeywordLength
} from './substitution/beaufortCipher.js';

// Autokey Cipher
export {
  autokeyEncrypt,
  autokeyDecrypt,
  getAutokeyVisualization,
  generateAutokeySquare,
  analyzeAutokey,
  findAutokeyKeyLength
} from './substitution/autokeyCipher.js';

// ============= MODULE B: POLYGRAM CIPHERS =============

// Playfair Cipher
export {
  playfairEncrypt,
  playfairDecrypt,
  generatePlayfairMatrix,
  getPlayfairVisualization
} from './polygram/playfairCipher.js';

// Hill Cipher
export {
  hillEncrypt,
  hillDecrypt,
  validateHillKey,
  getHillVisualization
} from './polygram/hillCipher.js';

// ============= MODULE C: TRANSPOSITION CIPHERS =============

// Rail Fence Cipher
export {
  railFenceEncrypt,
  railFenceDecrypt,
  getRailFenceVisualization,
  generateRailPattern,
  analyzeRailFence
} from './transposition/railFenceCipher.js';

// Columnar Transposition
export {
  columnarEncrypt,
  columnarDecrypt,
  getColumnarVisualization,
  generateColumnarGrid,
  analyzeColumnarKey
} from './transposition/columnarTransposition.js';

// Myszkowski Transposition
export {
  myszkowskiEncrypt,
  myszkowskiDecrypt,
  getMyszkowskiVisualization,
  generateMyszkowskiGrid,
  analyzeMyszkowski,
  compareWithColumnar,
  validateMyszkowskiParams,
  getRepeatedLetterPositions,
  calculateEfficiency as calculateMyszkowskiEfficiency
} from './transposition/myszkowskiTransposition.js';

// Double Transposition
export {
  doubleTranspositionEncrypt,
  doubleTranspositionDecrypt,
  getDoubleTranspositionVisualization,
  generateDoubleGrid,
  analyzeDoubleTransposition
} from './transposition/doubleTransposition.js';

// ============= MODULE D: ADVANCED CIPHERS =============

// Super Encryption (Product Cipher)
export {
  superEncrypt,
  superDecrypt,
  getSuperEncryptionVisualization,
  analyzeSuperEncryption,
  validateSuperEncryptionParams,
  compareWithSingleCipher
} from './advanced/superEncryption.js';

// One-Time Pad (Perfect Secrecy)
export {
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
  textToBinary
} from './advanced/oneTimePad.js';

// ============= MODULE E: STREAM CIPHERS =============

// Linear Congruential Generator (LCG)
export {
  lcgEncrypt,
  lcgDecrypt,
  getLCGVisualization,
  analyzeLCGParameters,
  generateRandomSeed as generateLCGRandomSeed,
  textToHex as lcgTextToHex,
  hexToText as lcgHexToText,
  LCG_PRESETS
} from './stream/lcg.js';

// Blum Blum Shub (BBS)
export {
  bbsEncrypt,
  bbsDecrypt,
  getBBSVisualization,
  analyzeBBSParameters,
  generateRandomSeed as generateBBSRandomSeed,
  getRandomBlumPrime,
  textToHex as bbsTextToHex,
  hexToText as bbsHexToText,
  BBS_PRESETS,
  BLUM_PRIMES
} from './stream/bbs.js';


// ============= UTILITIES =============

/**
 * Helper function untuk text preparation
 */
export const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Helper function untuk key preparation
 */
export const prepareKey = (key) => {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Helper function untuk repeat key
 */
export const repeatKey = (key, length) => {
  if (!key || length === 0) return '';
  let repeated = '';
  for (let i = 0; i < length; i++) {
    repeated += key[i % key.length];
  }
  return repeated;
};

/**
 * Calculate frequency of characters
 */
export const calculateFrequency = (text) => {
  const cleanText = prepareText(text);
  const frequency = {};
  
  for (let char of cleanText) {
    frequency[char] = (frequency[char] || 0) + 1;
  }
  
  return frequency;
};

/**
 * Calculate Index of Coincidence
 */
export const calculateIC = (text) => {
  const cleanText = prepareText(text);
  const frequencies = new Array(26).fill(0);
  
  for (let char of cleanText) {
    frequencies[char.charCodeAt(0) - 65]++;
  }
  
  let ic = 0;
  const n = cleanText.length;
  
  if (n <= 1) return 0;
  
  for (let freq of frequencies) {
    ic += freq * (freq - 1);
  }
  
  ic = ic / (n * (n - 1));
  return ic;
};

/**
 * Get English letter frequency for comparison
 */
export const getEnglishFrequency = () => {
  return {
    'A': 8.2, 'B': 1.5, 'C': 2.8, 'D': 4.3, 'E': 12.7,
    'F': 2.2, 'G': 2.0, 'H': 6.1, 'I': 7.0, 'J': 0.15,
    'K': 0.77, 'L': 4.0, 'M': 2.4, 'N': 6.7, 'O': 7.5,
    'P': 1.9, 'Q': 0.095, 'R': 6.0, 'S': 6.3, 'T': 9.1,
    'U': 2.8, 'V': 0.98, 'W': 2.4, 'X': 0.15, 'Y': 2.0,
    'Z': 0.074
  };
};

/**
 * Chi-squared test for frequency analysis
 */
export const chiSquaredTest = (observedFreq, expectedFreq, textLength) => {
  let chiSquared = 0;
  
  for (let letter in expectedFreq) {
    const observed = observedFreq[letter] || 0;
    const expected = (expectedFreq[letter] / 100) * textLength;
    
    if (expected > 0) {
      chiSquared += Math.pow(observed - expected, 2) / expected;
    }
  }
  
  return chiSquared;
};

/**
 * Modular arithmetic helper
 */
export const mod = (n, m) => {
  return ((n % m) + m) % m;
};

/**
 * GCD (Greatest Common Divisor)
 */
export const gcd = (a, b) => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

/**
 * Modular multiplicative inverse
 */
export const modInverse = (a, m) => {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  return null;
};

/**
 * Check if two numbers are coprime
 */
export const areCoprime = (a, b) => {
  return gcd(a, b) === 1;
};

// ============= EXPORT SUMMARY =============

/**
 * Export Summary:
 * 
 * SUBSTITUTION CIPHERS (Module A):
 * - Caesar: 4 functions (encrypt, decrypt, rot13, visualization)
 * - Vigenère: 7 functions (encrypt, decrypt, visualization, square, squareChar, analyze, findKeyLength)
 * - Beaufort: 7 functions (encrypt, decrypt, visualization, square, squareChar, analyze, findKeyLength)
 * - Autokey: 6 functions (encrypt, decrypt, visualization, square, analyze, findKeyLength)
 * 
 * POLYGRAM CIPHERS (Module B):
 * - Playfair: 4 functions (encrypt, decrypt, generateMatrix, visualization)
 * - Hill: 4 functions (encrypt, decrypt, validateKey, visualization)
 * 
 * TRANSPOSITION CIPHERS (Module C):
 * - Rail Fence: 5 functions (encrypt, decrypt, visualization, pattern, analyze)
 * - Columnar: 5 functions (encrypt, decrypt, visualization, grid, analyzeKey)
 * - Myszkowski: 9 functions (encrypt, decrypt, visualization, grid, analyze, compare, validate, positions, efficiency)
 * - Double Transposition: 5 functions (encrypt, decrypt, visualization, grid, analyze)
 * 
 * ADVANCED CIPHERS (Module D):
 * - Super Encryption: 5 functions (encrypt, decrypt, visualization, analyze, validate, compare)
 * - One-Time Pad: 9 functions (encrypt, decrypt, visualization, analyze, validate, generateKey×3, checkReuse, toHex, toBinary)
 * 
 * STREAM CIPHERS (Module E):
 * - LCG: 6 functions + 1 preset (encrypt, decrypt, visualization, analyze, generateSeed, toHex, toText, LCG_PRESETS)
 * - BBS: 8 functions + 2 presets (encrypt, decrypt, visualization, analyze, generateSeed, getBlumPrime, toHex, toText, BBS_PRESETS, BLUM_PRIMES)
 * 
 * UTILITIES: 11 functions
 * - prepareText, prepareKey, repeatKey
 * - calculateFrequency, calculateIC, getEnglishFrequency, chiSquaredTest
 * - mod, gcd, modInverse, areCoprime
 * 
 * TOTAL: 90+ exported functions across 14 cipher implementations
 */