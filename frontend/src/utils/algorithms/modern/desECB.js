// src/utils/algorithms/modern/desECB.js

import PropTypes from 'prop-types';

/**
 * DES ECB (Electronic Codebook) Mode
 * Simplest block cipher mode where each block is encrypted independently
 * 
 * WARNING: ECB is NOT secure for most use cases!
 * - Identical plaintext blocks produce identical ciphertext blocks
 * - Reveals patterns in data (famous "ECB Penguin" problem)
 * - Use CBC, CTR, or GCM modes instead
 * 
 * Features:
 * - 64-bit block size
 * - 56-bit effective key (8 bytes with parity)
 * - No IV needed (simpler but LESS secure than CBC)
 * - Parallelizable (each block independent)
 * 
 * Educational purposes only - demonstrates why ECB is weak!
 */

// ==================== PROP TYPES ====================

export const DESECBConfigPropTypes = PropTypes.shape({
  key: PropTypes.string.isRequired,
  blockSize: PropTypes.number.isRequired,
  mode: PropTypes.string.isRequired,
});

export const ECBBlockPropTypes = PropTypes.shape({
  blockNumber: PropTypes.number.isRequired,
  plainBlock: PropTypes.string.isRequired,
  plainHex: PropTypes.string.isRequired,
  cipherBlock: PropTypes.string.isRequired,
  isDuplicate: PropTypes.bool,
  duplicateOf: PropTypes.number,
});

// ==================== DES CONSTANTS ====================

// Initial Permutation (IP)
const IP = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7
];

// Final Permutation (FP)
const FP = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25
];

// Expansion (E)
const E = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1
];

// Permutation (P)
const P = [
  16, 7, 20, 21, 29, 12, 28, 17,
  1, 15, 23, 26, 5, 18, 31, 10,
  2, 8, 24, 14, 32, 27, 3, 9,
  19, 13, 30, 6, 22, 11, 4, 25
];

// S-Boxes
const SBOX = [
  [[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
   [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
   [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
   [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]],
  [[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
   [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
   [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
   [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]],
  [[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
   [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
   [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
   [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]],
  [[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
   [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
   [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
   [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]],
  [[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
   [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
   [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
   [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]],
  [[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
   [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
   [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
   [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]],
  [[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
   [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
   [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
   [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]],
  [[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
   [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
   [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
   [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]]
];

// PC1 - Key permutation
const PC1 = [
  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4
];

// PC2 - Subkey permutation
const PC2 = [
  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32
];

// Shift schedule
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// ==================== UTILITY FUNCTIONS ====================

const stringToBinary = (str) => {
  let binary = '';
  for (let i = 0; i < str.length; i++) {
    binary += str.charCodeAt(i).toString(2).padStart(8, '0');
  }
  return binary;
};

const binaryToString = (binary) => {
  let str = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    str += String.fromCharCode(parseInt(byte, 2));
  }
  return str;
};

const hexToBinary = (hex) => {
  let binary = '';
  for (let i = 0; i < hex.length; i++) {
    binary += parseInt(hex[i], 16).toString(2).padStart(4, '0');
  }
  return binary;
};

const binaryToHex = (binary) => {
  let hex = '';
  for (let i = 0; i < binary.length; i += 4) {
    const nibble = binary.substr(i, 4);
    hex += parseInt(nibble, 2).toString(16).toUpperCase();
  }
  return hex;
};

const xor = (a, b) => {
  let result = '';
  for (let i = 0; i < a.length; i++) {
    result += (a[i] === b[i]) ? '0' : '1';
  }
  return result;
};

const permute = (input, table) => {
  let output = '';
  for (let i = 0; i < table.length; i++) {
    output += input[table[i] - 1];
  }
  return output;
};

const leftShift = (input, shifts) => {
  return input.substr(shifts) + input.substr(0, shifts);
};

const sBoxSubstitution = (input) => {
  let output = '';
  for (let i = 0; i < 8; i++) {
    const block = input.substr(i * 6, 6);
    const row = parseInt(block[0] + block[5], 2);
    const col = parseInt(block.substr(1, 4), 2);
    const value = SBOX[i][row][col];
    output += value.toString(2).padStart(4, '0');
  }
  return output;
};

const generateSubkeys = (key) => {
  let permutedKey = permute(key, PC1);
  let left = permutedKey.substr(0, 28);
  let right = permutedKey.substr(28, 28);
  const subkeys = [];
  
  for (let i = 0; i < 16; i++) {
    left = leftShift(left, SHIFTS[i]);
    right = leftShift(right, SHIFTS[i]);
    const combined = left + right;
    subkeys.push(permute(combined, PC2));
  }
  
  return subkeys;
};

const feistel = (right, subkey) => {
  const expanded = permute(right, E);
  const xored = xor(expanded, subkey);
  const substituted = sBoxSubstitution(xored);
  return permute(substituted, P);
};

const desEncryptBlock = (block, subkeys) => {
  let permuted = permute(block, IP);
  let left = permuted.substr(0, 32);
  let right = permuted.substr(32, 32);
  
  for (let i = 0; i < 16; i++) {
    const temp = right;
    const fResult = feistel(right, subkeys[i]);
    right = xor(left, fResult);
    left = temp;
  }
  
  const combined = right + left;
  return permute(combined, FP);
};

const desDecryptBlock = (block, subkeys) => {
  const reversedSubkeys = [...subkeys].reverse();
  return desEncryptBlock(block, reversedSubkeys);
};

const addPadding = (text) => {
  const blockSize = 8;
  const padding = blockSize - (text.length % blockSize);
  return text + String.fromCharCode(padding).repeat(padding);
};

const removePadding = (text) => {
  const padding = text.charCodeAt(text.length - 1);
  return text.substr(0, text.length - padding);
};

// ==================== MAIN FUNCTIONS ====================

/**
 * DES ECB Encryption
 * @param {string} plaintext - Text to encrypt
 * @param {string} keyHex - 16-char hex key (64-bit)
 * @returns {string} - Encrypted hex string
 */
export const desECBEncrypt = (plaintext, keyHex) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }
  if (!keyHex || keyHex.length !== 16 || !/^[0-9A-Fa-f]+$/.test(keyHex)) {
    throw new Error('Key must be 16 hex characters (64-bit)');
  }
  
  try {
    const paddedText = addPadding(plaintext);
    const keyBinary = hexToBinary(keyHex);
    const subkeys = generateSubkeys(keyBinary);
    
    let ciphertext = '';
    
    // ECB: Each block encrypted independently (NO CHAINING!)
    for (let i = 0; i < paddedText.length; i += 8) {
      const block = paddedText.substr(i, 8);
      const blockBinary = stringToBinary(block);
      const encrypted = desEncryptBlock(blockBinary, subkeys);
      ciphertext += binaryToHex(encrypted);
    }
    
    return ciphertext;
  } catch (error) {
    throw new Error(`DES ECB Encryption failed: ${error.message}`);
  }
};

/**
 * DES ECB Decryption
 * @param {string} ciphertextHex - Hex string to decrypt
 * @param {string} keyHex - 16-char hex key (64-bit)
 * @returns {string} - Decrypted plaintext
 */
export const desECBDecrypt = (ciphertextHex, keyHex) => {
  if (!ciphertextHex || typeof ciphertextHex !== 'string') {
    throw new Error('Ciphertext must be a non-empty string');
  }
  if (!/^[0-9A-Fa-f]+$/.test(ciphertextHex)) {
    throw new Error('Ciphertext must be a valid hex string');
  }
  if (!keyHex || keyHex.length !== 16 || !/^[0-9A-Fa-f]+$/.test(keyHex)) {
    throw new Error('Key must be 16 hex characters (64-bit)');
  }
  
  try {
    const keyBinary = hexToBinary(keyHex);
    const subkeys = generateSubkeys(keyBinary);
    
    let plaintext = '';
    
    // ECB: Each block decrypted independently
    for (let i = 0; i < ciphertextHex.length; i += 16) {
      const blockHex = ciphertextHex.substr(i, 16);
      const blockBinary = hexToBinary(blockHex);
      const decrypted = desDecryptBlock(blockBinary, subkeys);
      plaintext += binaryToString(decrypted);
    }
    
    return removePadding(plaintext);
  } catch (error) {
    throw new Error(`DES ECB Decryption failed: ${error.message}`);
  }
};

/**
 * Get visualization data for DES ECB
 * Shows pattern leakage - duplicate plaintext blocks = duplicate ciphertext!
 */
export const getDESECBVisualization = (plaintext, keyHex) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }
  if (!keyHex || keyHex.length !== 16) {
    throw new Error('Key must be 16 hex characters');
  }
  
  try {
    const paddedText = addPadding(plaintext);
    const keyBinary = hexToBinary(keyHex);
    const subkeys = generateSubkeys(keyBinary);
    
    const blocks = [];
    const seenPlainBlocks = new Map(); // Track duplicate plaintext blocks
    
    for (let i = 0; i < paddedText.length; i += 8) {
      const block = paddedText.substr(i, 8);
      const blockBinary = stringToBinary(block);
      const encrypted = desEncryptBlock(blockBinary, subkeys);
      const cipherHex = binaryToHex(encrypted);
      const plainHex = binaryToHex(blockBinary);
      
      // Check if this plaintext block appeared before
      let isDuplicate = false;
      let duplicateOf = null;
      
      if (seenPlainBlocks.has(plainHex)) {
        isDuplicate = true;
        duplicateOf = seenPlainBlocks.get(plainHex);
      } else {
        seenPlainBlocks.set(plainHex, Math.floor(i / 8) + 1);
      }
      
      blocks.push({
        blockNumber: Math.floor(i / 8) + 1,
        plainBlock: block,
        plainHex,
        plainBinary: blockBinary,
        cipherBlock: cipherHex,
        cipherBinary: encrypted,
        isDuplicate,
        duplicateOf,
      });
    }
    
    const ciphertext = desECBEncrypt(plaintext, keyHex);
    
    // Calculate pattern statistics
    const uniquePlainBlocks = new Set(blocks.map(b => b.plainHex)).size;
    const uniqueCipherBlocks = new Set(blocks.map(b => b.cipherBlock)).size;
    const patternLeakage = blocks.filter(b => b.isDuplicate).length;
    
    return {
      config: {
        key: keyHex,
        blockSize: 64,
        mode: 'ECB',
      },
      plaintext,
      paddedText,
      ciphertext,
      blocks: blocks.slice(0, 20), // Limit display
      totalBlocks: blocks.length,
      statistics: {
        uniquePlainBlocks,
        uniqueCipherBlocks,
        patternLeakage,
        leakagePercentage: ((patternLeakage / blocks.length) * 100).toFixed(2),
      },
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Generate random hex key
 */
export const generateRandomKey = () => {
  let key = '';
  for (let i = 0; i < 16; i++) {
    key += Math.floor(Math.random() * 16).toString(16).toUpperCase();
  }
  return key;
};

/**
 * Validate DES ECB parameters
 */
export const validateDESECBParams = (text, key) => {
  const errors = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (!key || typeof key !== 'string') {
    errors.push('Key must be a non-empty string');
  } else if (key.length !== 16) {
    errors.push('Key must be exactly 16 hex characters (64-bit)');
  } else if (!/^[0-9A-Fa-f]+$/.test(key)) {
    errors.push('Key must contain only hex characters (0-9, A-F)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Compare ECB vs CBC (for educational purposes)
 */
export const compareECBvsCBC = (plaintext) => {
  const paddedText = addPadding(plaintext);
  const blocks = [];
  
  for (let i = 0; i < paddedText.length; i += 8) {
    blocks.push(paddedText.substr(i, 8));
  }
  
  // Count duplicate blocks
  const blockCounts = {};
  blocks.forEach(block => {
    blockCounts[block] = (blockCounts[block] || 0) + 1;
  });
  
  const duplicates = Object.values(blockCounts).filter(count => count > 1).length;
  
  return {
    totalBlocks: blocks.length,
    uniqueBlocks: Object.keys(blockCounts).length,
    duplicateBlocks: duplicates,
    ecbWeakness: duplicates > 0 ? 'Pattern leakage detected! Same plaintext = same ciphertext' : 'No duplicates (but still use CBC!)',
    recommendation: 'Use CBC, CTR, or GCM mode instead of ECB for better security',
  };
};

// ==================== EXPORTS ====================

export default {
  desECBEncrypt,
  desECBDecrypt,
  getDESECBVisualization,
  generateRandomKey,
  validateDESECBParams,
  compareECBvsCBC,
  
  // PropTypes
  DESECBConfigPropTypes,
  ECBBlockPropTypes,
};