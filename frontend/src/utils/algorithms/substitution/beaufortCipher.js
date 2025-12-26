// src/utils/algorithms/substitution/beaufortCipher.js

/**
 * Beaufort Cipher Algorithm
 * Reciprocal polyalphabetic substitution cipher using reverse subtraction
 */

const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

const prepareKey = (key) => {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Repeat keyword to match text length
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
 * Encrypt plaintext using Beaufort cipher
 * Formula: Ci = (Ki - Pi) mod 26
 */
export const beaufortEncrypt = (plaintext, key) => {
  const text = prepareText(plaintext);
  const keyword = prepareKey(key);
  
  if (!keyword) {
    throw new Error('Keyword is required');
  }
  
  if (!text) {
    return '';
  }
  
  const repeatedKey = repeatKey(keyword, text.length);
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const plainCharCode = text.charCodeAt(i) - 65; // A=0, B=1, ..., Z=25
    const keyCharCode = repeatedKey.charCodeAt(i) - 65;
    const encryptedCharCode = (keyCharCode - plainCharCode + 26) % 26;
    
    result += String.fromCharCode(encryptedCharCode + 65);
  }
  
  return result;
};

/**
 * Decrypt ciphertext using Beaufort cipher
 * Formula: Pi = (Ki - Ci) mod 26
 * Note: Beaufort is reciprocal, so same operation as encryption
 */
export const beaufortDecrypt = (ciphertext, key) => {
  const text = prepareText(ciphertext);
  const keyword = prepareKey(key);
  
  if (!keyword) {
    throw new Error('Keyword is required');
  }
  
  if (!text) {
    return '';
  }
  
  const repeatedKey = repeatKey(keyword, text.length);
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const cipherCharCode = text.charCodeAt(i) - 65;
    const keyCharCode = repeatedKey.charCodeAt(i) - 65;
    const decryptedCharCode = (keyCharCode - cipherCharCode + 26) % 26;
    
    result += String.fromCharCode(decryptedCharCode + 65);
  }
  
  return result;
};

/**
 * Get visualization data for Beaufort cipher
 */
export const getBeaufortVisualization = (plaintext, key) => {
  const text = prepareText(plaintext);
  const keyword = prepareKey(key);
  
  if (!keyword || !text) {
    return null;
  }
  
  const repeatedKey = repeatKey(keyword, text.length);
  const ciphertext = beaufortEncrypt(plaintext, key);
  
  // Create character mapping
  const mapping = [];
  for (let i = 0; i < text.length; i++) {
    const plainChar = text[i];
    const keyChar = repeatedKey[i];
    const cipherChar = ciphertext[i];
    
    const plainValue = plainChar.charCodeAt(0) - 65;
    const keyValue = keyChar.charCodeAt(0) - 65;
    const cipherValue = cipherChar.charCodeAt(0) - 65;
    
    mapping.push({
      position: i,
      plainChar,
      keyChar,
      cipherChar,
      plainValue,
      keyValue,
      cipherValue,
      calculation: `(${keyValue} - ${plainValue}) mod 26 = ${cipherValue}`
    });
  }
  
  return {
    plaintext: text,
    ciphertext,
    keyword,
    repeatedKey,
    keyLength: keyword.length,
    textLength: text.length,
    mapping,
    note: 'Reciprocal cipher: same operation for encrypt and decrypt'
  };
};

/**
 * Generate Beaufort Square (similar to Vigenère Square but reversed)
 * 26x26 grid where each row uses reverse subtraction
 */
export const generateBeaufortSquare = () => {
  const square = [];
  
  for (let row = 0; row < 26; row++) {
    const rowArray = [];
    for (let col = 0; col < 26; col++) {
      const charCode = ((row - col + 26) % 26) + 65;
      rowArray.push(String.fromCharCode(charCode));
    }
    square.push(rowArray);
  }
  
  return square;
};

/**
 * Get character from Beaufort Square
 * @param {string} plainChar - Plaintext character (A-Z)
 * @param {string} keyChar - Key character (A-Z)
 * @returns {string} - Encrypted character
 */
export const getBeaufortSquareChar = (plainChar, keyChar) => {
  const row = keyChar.charCodeAt(0) - 65; // Key determines row
  const col = plainChar.charCodeAt(0) - 65; // Plaintext determines column
  
  const resultCharCode = ((row - col + 26) % 26) + 65;
  return String.fromCharCode(resultCharCode);
};

/**
 * Analyze Beaufort ciphertext for cryptanalysis
 * Returns index of coincidence and likely key length
 */
export const analyzeBeaufort = (ciphertext) => {
  const text = prepareText(ciphertext);
  
  if (!text || text.length < 20) {
    return null;
  }
  
  // Calculate Index of Coincidence
  const frequencies = new Array(26).fill(0);
  for (let char of text) {
    frequencies[char.charCodeAt(0) - 65]++;
  }
  
  let ic = 0;
  const n = text.length;
  for (let freq of frequencies) {
    ic += freq * (freq - 1);
  }
  ic = ic / (n * (n - 1));
  
  // Try different key lengths (Kasiski examination)
  const likelyKeyLengths = [];
  for (let keyLength = 2; keyLength <= Math.min(20, Math.floor(text.length / 4)); keyLength++) {
    let avgIC = 0;
    
    // Split into keyLength groups
    for (let offset = 0; offset < keyLength; offset++) {
      const group = [];
      for (let i = offset; i < text.length; i += keyLength) {
        group.push(text[i]);
      }
      
      // Calculate IC for this group
      const groupFreq = new Array(26).fill(0);
      for (let char of group) {
        groupFreq[char.charCodeAt(0) - 65]++;
      }
      
      let groupIC = 0;
      const m = group.length;
      if (m > 1) {
        for (let freq of groupFreq) {
          groupIC += freq * (freq - 1);
        }
        groupIC = groupIC / (m * (m - 1));
      }
      
      avgIC += groupIC;
    }
    
    avgIC /= keyLength;
    
    // IC close to 0.065 suggests correct key length (for English)
    if (avgIC > 0.055) {
      likelyKeyLengths.push({
        length: keyLength,
        ic: avgIC,
        confidence: Math.min(100, (avgIC / 0.065) * 100)
      });
    }
  }
  
  // Sort by IC (higher is better)
  likelyKeyLengths.sort((a, b) => b.ic - a.ic);
  
  return {
    textLength: text.length,
    overallIC: ic,
    likelyKeyLengths: likelyKeyLengths.slice(0, 5),
    isReciprocal: true,
    note: 'IC close to 0.065 suggests monoalphabetic (correct key length). Beaufort is reciprocal.'
  };
};

/**
 * Attempt to find the keyword length using frequency analysis
 */
export const findKeywordLength = (ciphertext) => {
  const analysis = analyzeBeaufort(ciphertext);
  
  if (!analysis || !analysis.likelyKeyLengths.length) {
    return null;
  }
  
  return analysis.likelyKeyLengths[0].length;
};

// Export all functions
export default {
  beaufortEncrypt,
  beaufortDecrypt,
  getBeaufortVisualization,
  generateBeaufortSquare,
  getBeaufortSquareChar,
  analyzeBeaufort,
  findKeywordLength
};