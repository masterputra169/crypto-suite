// src/utils/algorithms/modern/desCBC.js

import PropTypes from 'prop-types';

/**
 * DES CBC (Cipher Block Chaining) Mode
 * Block cipher mode where each plaintext block is XORed with previous ciphertext block
 * before encryption, with an Initialization Vector (IV) for the first block
 * 
 * Features:
 * - 64-bit block size
 * - 56-bit effective key (8 bytes with parity)
 * - Initialization Vector (IV) for randomization
 * - Chaining effect: error propagation
 * 
 * Security Note: DES is considered weak by modern standards.
 * Use AES for real-world applications.
 */

// ==================== PROP TYPES ====================

export const DESCBCConfigPropTypes = PropTypes.shape({
  key: PropTypes.string.isRequired,
  iv: PropTypes.string.isRequired,
  blockSize: PropTypes.number.isRequired,
});

export const BlockProcessPropTypes = PropTypes.shape({
  blockNumber: PropTypes.number.isRequired,
  plainBlock: PropTypes.string.isRequired,
  previousCipher: PropTypes.string.isRequired,
  xorResult: PropTypes.string.isRequired,
  cipherBlock: PropTypes.string.isRequired,
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

// Final Permutation (FP) - Inverse of IP
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

// Expansion (E) - Expands 32 bits to 48 bits
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

// S-Boxes (Substitution boxes)
const SBOX = [
  // S1
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  // S2
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  // S3
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  // S4
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  // S5
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  // S6
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  // S7
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  // S8
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

// Permuted Choice 1 (PC1) - Key permutation
const PC1 = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4
];

// Permuted Choice 2 (PC2) - Subkey permutation
const PC2 = [
  14, 17, 11, 24, 1, 5,
  3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8,
  16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32
];

// Left shift schedule
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert string to binary
 */
const stringToBinary = (str) => {
  let binary = '';
  for (let i = 0; i < str.length; i++) {
    binary += str.charCodeAt(i).toString(2).padStart(8, '0');
  }
  return binary;
};

/**
 * Convert binary to string
 */
const binaryToString = (binary) => {
  let str = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    str += String.fromCharCode(parseInt(byte, 2));
  }
  return str;
};

/**
 * Convert hex to binary
 */
const hexToBinary = (hex) => {
  let binary = '';
  for (let i = 0; i < hex.length; i++) {
    binary += parseInt(hex[i], 16).toString(2).padStart(4, '0');
  }
  return binary;
};

/**
 * Convert binary to hex
 */
const binaryToHex = (binary) => {
  let hex = '';
  for (let i = 0; i < binary.length; i += 4) {
    const nibble = binary.substr(i, 4);
    hex += parseInt(nibble, 2).toString(16).toUpperCase();
  }
  return hex;
};

/**
 * XOR two binary strings
 */
const xor = (a, b) => {
  let result = '';
  for (let i = 0; i < a.length; i++) {
    result += (a[i] === b[i]) ? '0' : '1';
  }
  return result;
};

/**
 * Permute bits according to table
 */
const permute = (input, table) => {
  let output = '';
  for (let i = 0; i < table.length; i++) {
    output += input[table[i] - 1];
  }
  return output;
};

/**
 * Left circular shift
 */
const leftShift = (input, shifts) => {
  return input.substr(shifts) + input.substr(0, shifts);
};

/**
 * Apply S-box substitution
 */
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

/**
 * Generate 16 subkeys from main key
 */
const generateSubkeys = (key) => {
  // Permute key with PC1
  let permutedKey = permute(key, PC1);
  
  // Split into left and right halves
  let left = permutedKey.substr(0, 28);
  let right = permutedKey.substr(28, 28);
  
  const subkeys = [];
  
  // Generate 16 subkeys
  for (let i = 0; i < 16; i++) {
    // Left shift
    left = leftShift(left, SHIFTS[i]);
    right = leftShift(right, SHIFTS[i]);
    
    // Combine and permute with PC2
    const combined = left + right;
    subkeys.push(permute(combined, PC2));
  }
  
  return subkeys;
};

/**
 * DES round function (Feistel function)
 */
const feistel = (right, subkey) => {
  // Expansion
  const expanded = permute(right, E);
  
  // XOR with subkey
  const xored = xor(expanded, subkey);
  
  // S-box substitution
  const substituted = sBoxSubstitution(xored);
  
  // Permutation
  return permute(substituted, P);
};

/**
 * DES block encryption
 */
const desEncryptBlock = (block, subkeys) => {
  // Initial permutation
  let permuted = permute(block, IP);
  
  // Split into left and right
  let left = permuted.substr(0, 32);
  let right = permuted.substr(32, 32);
  
  // 16 rounds
  for (let i = 0; i < 16; i++) {
    const temp = right;
    const fResult = feistel(right, subkeys[i]);
    right = xor(left, fResult);
    left = temp;
  }
  
  // Swap and combine
  const combined = right + left;
  
  // Final permutation
  return permute(combined, FP);
};

/**
 * DES block decryption
 */
const desDecryptBlock = (block, subkeys) => {
  // Use subkeys in reverse order
  const reversedSubkeys = [...subkeys].reverse();
  return desEncryptBlock(block, reversedSubkeys);
};

/**
 * PKCS7 Padding
 */
const addPadding = (text) => {
  const blockSize = 8; // 8 bytes = 64 bits
  const padding = blockSize - (text.length % blockSize);
  return text + String.fromCharCode(padding).repeat(padding);
};

/**
 * Remove PKCS7 Padding
 */
const removePadding = (text) => {
  const padding = text.charCodeAt(text.length - 1);
  return text.substr(0, text.length - padding);
};

// ==================== MAIN FUNCTIONS ====================

/**
 * DES CBC Encryption
 * @param {string} plaintext - Text to encrypt
 * @param {string} keyHex - 16-char hex key (64-bit)
 * @param {string} ivHex - 16-char hex IV (64-bit)
 * @returns {string} - Encrypted hex string
 */
export const desCBCEncrypt = (plaintext, keyHex, ivHex) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }
  if (!keyHex || keyHex.length !== 16 || !/^[0-9A-Fa-f]+$/.test(keyHex)) {
    throw new Error('Key must be 16 hex characters (64-bit)');
  }
  if (!ivHex || ivHex.length !== 16 || !/^[0-9A-Fa-f]+$/.test(ivHex)) {
    throw new Error('IV must be 16 hex characters (64-bit)');
  }
  
  try {
    // Add padding
    const paddedText = addPadding(plaintext);
    
    // Convert key and IV to binary
    const keyBinary = hexToBinary(keyHex);
    const ivBinary = hexToBinary(ivHex);
    
    // Generate subkeys
    const subkeys = generateSubkeys(keyBinary);
    
    // Process blocks
    let previousCipher = ivBinary;
    let ciphertext = '';
    
    for (let i = 0; i < paddedText.length; i += 8) {
      const block = paddedText.substr(i, 8);
      const blockBinary = stringToBinary(block);
      
      // XOR with previous ciphertext (CBC mode)
      const xored = xor(blockBinary, previousCipher);
      
      // Encrypt block
      const encrypted = desEncryptBlock(xored, subkeys);
      
      // Store for next iteration
      previousCipher = encrypted;
      
      // Convert to hex
      ciphertext += binaryToHex(encrypted);
    }
    
    return ciphertext;
  } catch (error) {
    throw new Error(`DES CBC Encryption failed: ${error.message}`);
  }
};

/**
 * DES CBC Decryption
 * @param {string} ciphertextHex - Hex string to decrypt
 * @param {string} keyHex - 16-char hex key (64-bit)
 * @param {string} ivHex - 16-char hex IV (64-bit)
 * @returns {string} - Decrypted plaintext
 */
export const desCBCDecrypt = (ciphertextHex, keyHex, ivHex) => {
  if (!ciphertextHex || typeof ciphertextHex !== 'string') {
    throw new Error('Ciphertext must be a non-empty string');
  }
  if (!/^[0-9A-Fa-f]+$/.test(ciphertextHex)) {
    throw new Error('Ciphertext must be a valid hex string');
  }
  if (!keyHex || keyHex.length !== 16 || !/^[0-9A-Fa-f]+$/.test(keyHex)) {
    throw new Error('Key must be 16 hex characters (64-bit)');
  }
  if (!ivHex || ivHex.length !== 16 || !/^[0-9A-Fa-f]+$/.test(ivHex)) {
    throw new Error('IV must be 16 hex characters (64-bit)');
  }
  
  try {
    // Convert key and IV to binary
    const keyBinary = hexToBinary(keyHex);
    const ivBinary = hexToBinary(ivHex);
    
    // Generate subkeys
    const subkeys = generateSubkeys(keyBinary);
    
    // Process blocks
    let previousCipher = ivBinary;
    let plaintext = '';
    
    for (let i = 0; i < ciphertextHex.length; i += 16) {
      const blockHex = ciphertextHex.substr(i, 16);
      const blockBinary = hexToBinary(blockHex);
      
      // Decrypt block
      const decrypted = desDecryptBlock(blockBinary, subkeys);
      
      // XOR with previous ciphertext (CBC mode)
      const xored = xor(decrypted, previousCipher);
      
      // Store for next iteration
      previousCipher = blockBinary;
      
      // Convert to string
      plaintext += binaryToString(xored);
    }
    
    // Remove padding
    return removePadding(plaintext);
  } catch (error) {
    throw new Error(`DES CBC Decryption failed: ${error.message}`);
  }
};

/**
 * Generate visualization data for DES CBC
 */
export const getDESCBCVisualization = (plaintext, keyHex, ivHex) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }
  if (!keyHex || keyHex.length !== 16) {
    throw new Error('Key must be 16 hex characters');
  }
  if (!ivHex || ivHex.length !== 16) {
    throw new Error('IV must be 16 hex characters');
  }
  
  try {
    const paddedText = addPadding(plaintext);
    const keyBinary = hexToBinary(keyHex);
    const ivBinary = hexToBinary(ivHex);
    const subkeys = generateSubkeys(keyBinary);
    
    const blocks = [];
    let previousCipher = ivBinary;
    
    for (let i = 0; i < paddedText.length; i += 8) {
      const block = paddedText.substr(i, 8);
      const blockBinary = stringToBinary(block);
      
      // XOR with previous ciphertext
      const xored = xor(blockBinary, previousCipher);
      
      // Encrypt
      const encrypted = desEncryptBlock(xored, subkeys);
      
      blocks.push({
        blockNumber: Math.floor(i / 8) + 1,
        plainBlock: block,
        plainHex: binaryToHex(blockBinary),
        plainBinary: blockBinary,
        previousCipher: binaryToHex(previousCipher),
        xorResult: binaryToHex(xored),
        cipherBlock: binaryToHex(encrypted),
        cipherBinary: encrypted,
      });
      
      previousCipher = encrypted;
    }
    
    const ciphertext = desCBCEncrypt(plaintext, keyHex, ivHex);
    
    return {
      config: {
        key: keyHex,
        iv: ivHex,
        blockSize: 64,
        mode: 'CBC',
      },
      plaintext,
      paddedText,
      ciphertext,
      blocks: blocks.slice(0, 10), // Limit display
      totalBlocks: blocks.length,
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
 * Generate random IV
 */
export const generateRandomIV = () => {
  let iv = '';
  for (let i = 0; i < 16; i++) {
    iv += Math.floor(Math.random() * 16).toString(16).toUpperCase();
  }
  return iv;
};

/**
 * Validate DES CBC parameters
 */
export const validateDESCBCParams = (text, key, iv) => {
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
  
  if (!iv || typeof iv !== 'string') {
    errors.push('IV must be a non-empty string');
  } else if (iv.length !== 16) {
    errors.push('IV must be exactly 16 hex characters (64-bit)');
  } else if (!/^[0-9A-Fa-f]+$/.test(iv)) {
    errors.push('IV must contain only hex characters (0-9, A-F)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// ==================== EXPORTS ====================

export default {
  desCBCEncrypt,
  desCBCDecrypt,
  getDESCBCVisualization,
  generateRandomKey,
  generateRandomIV,
  validateDESCBCParams,
  
  // PropTypes
  DESCBCConfigPropTypes,
  BlockProcessPropTypes,
};