// src/utils/algorithms/substitution/caesarCipher.js

/**
 * Caesar Cipher Algorithm
 * Simple shift cipher - shifts each letter by a fixed number
 * ✅ Following the same pattern as vigenereCipher.js
 */

/**
 * Prepare text: convert to uppercase and remove non-letters
 * ✅ SAME AS VIGENERE PATTERN
 */
const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Normalize shift value to 0-25 range
 */
const normalizeShift = (shift) => {
  return ((shift % 26) + 26) % 26;
};

/**
 * Encrypt plaintext using Caesar cipher
 * Formula: Ci = (Pi + K) mod 26
 * 
 * @param {string} plaintext - Text to encrypt
 * @param {number} shift - Shift value (0-25)
 * @returns {string} - Encrypted text (UPPERCASE, letters only)
 */
export const caesarEncrypt = (plaintext, shift) => {
  const text = prepareText(plaintext); // ✅ SAME AS VIGENERE
  const normalizedShift = normalizeShift(shift);
  
  if (!text) {
    return '';
  }
  
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) - 65; // A=0, B=1, ..., Z=25
    const encryptedCharCode = (charCode + normalizedShift) % 26;
    result += String.fromCharCode(encryptedCharCode + 65);
  }
  
  return result;
};

/**
 * Decrypt ciphertext using Caesar cipher
 * Formula: Pi = (Ci - K + 26) mod 26
 * 
 * @param {string} ciphertext - Text to decrypt
 * @param {number} shift - Shift value (0-25)
 * @returns {string} - Decrypted text (UPPERCASE, letters only)
 */
export const caesarDecrypt = (ciphertext, shift) => {
  // Decryption is encryption with negative shift
  return caesarEncrypt(ciphertext, -shift);
};

/**
 * ROT13 cipher - special case of Caesar with shift=13
 * ROT13 is its own inverse (encrypt = decrypt)
 * 
 * @param {string} text - Text to process
 * @returns {string} - Processed text (UPPERCASE, letters only)
 */
export const rot13 = (text) => {
  return caesarEncrypt(text, 13);
};

/**
 * Get visualization data for Caesar cipher
 * ✅ SAME PATTERN AS VIGENERE getVigenereVisualization
 */
export const getCaesarVisualization = (plaintext, shift) => {
  const text = prepareText(plaintext); // ✅ SAME AS VIGENERE
  const normalizedShift = normalizeShift(shift);
  
  if (!text) {
    return null;
  }
  
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ciphertext = caesarEncrypt(plaintext, shift);
  
  // Create character mapping (similar to Vigenere)
  const mapping = [];
  for (let i = 0; i < text.length; i++) {
    const plainChar = text[i];
    const cipherChar = ciphertext[i];
    
    const plainValue = plainChar.charCodeAt(0) - 65;
    const cipherValue = cipherChar.charCodeAt(0) - 65;
    
    mapping.push({
      position: i,
      plainChar,
      cipherChar,
      plainValue,
      cipherValue,
      calculation: `(${plainValue} + ${normalizedShift}) mod 26 = ${cipherValue}`
    });
  }
  
  return {
    plaintext: text,
    ciphertext,
    shift: normalizedShift,
    originalAlphabet: alphabet.split(''),
    shiftedAlphabet: alphabet.split('').map((_, i) => 
      alphabet[(i + normalizedShift) % 26]
    ),
    mapping: mapping.slice(0, 20), // Limit to first 20 for display
    note: `Each letter shifted by ${normalizedShift} positions`
  };
};

/**
 * Brute force attack - try all possible shifts
 * Returns all 26 possible decryptions
 * 
 * @param {string} ciphertext - Text to decrypt
 * @returns {Array} - Array of {shift, plaintext} objects
 */
export const caesarBruteForce = (ciphertext) => {
  const text = prepareText(ciphertext);
  const results = [];
  
  for (let shift = 0; shift < 26; shift++) {
    results.push({
      shift,
      plaintext: caesarDecrypt(text, shift)
    });
  }
  
  return results;
};

/**
 * Calculate frequency analysis for Caesar cipher
 * Helps identify the most likely shift value
 * 
 * @param {string} ciphertext - Text to analyze
 * @returns {Object} - Frequency data
 */
export const caesarFrequencyAnalysis = (ciphertext) => {
  const text = prepareText(ciphertext);
  
  if (!text || text.length < 20) {
    return null;
  }
  
  // Count letter frequencies
  const frequencies = new Array(26).fill(0);
  for (let char of text) {
    frequencies[char.charCodeAt(0) - 65]++;
  }
  
  // Find most common letter
  let maxFreq = 0;
  let mostCommonIndex = 0;
  for (let i = 0; i < 26; i++) {
    if (frequencies[i] > maxFreq) {
      maxFreq = frequencies[i];
      mostCommonIndex = i;
    }
  }
  
  // Assume 'E' (index 4) is most common in English
  const likelyShift = (mostCommonIndex - 4 + 26) % 26;
  
  return {
    textLength: text.length,
    frequencies,
    mostCommonLetter: String.fromCharCode(mostCommonIndex + 65),
    mostCommonFrequency: maxFreq,
    likelyShift,
    suggestedPlaintext: caesarDecrypt(text, likelyShift),
    note: 'Based on assumption that E is most common letter in English'
  };
};

// Export all functions (same pattern as Vigenere)
export default {
  caesarEncrypt,
  caesarDecrypt,
  rot13,
  getCaesarVisualization,
  caesarBruteForce,
  caesarFrequencyAnalysis
};