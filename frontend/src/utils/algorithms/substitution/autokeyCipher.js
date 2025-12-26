// src/utils/algorithms/substitution/autokeyCipher.js

/**
 * Autokey Cipher Algorithm
 * Polyalphabetic substitution cipher where plaintext becomes part of the key
 */

const prepareText = (text) => {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

const prepareKey = (key) => {
  return key.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Generate autokey by combining initial key with plaintext
 */
const generateAutokey = (plaintext, initialKey) => {
  const text = prepareText(plaintext);
  const key = prepareKey(initialKey);
  
  if (!key || !text) return '';
  
  // Autokey = initial key + plaintext (until text length is reached)
  let autokey = key;
  
  // Add plaintext to key until we have enough characters
  for (let i = 0; i < text.length - key.length; i++) {
    autokey += text[i];
  }
  
  // Trim to exact text length
  return autokey.substring(0, text.length);
};

/**
 * Encrypt plaintext using Autokey cipher
 * Formula: Ci = (Pi + Ki) mod 26
 * Where Ki changes: first few chars from key, then from plaintext
 */
export const autokeyEncrypt = (plaintext, initialKey) => {
  const text = prepareText(plaintext);
  const key = prepareKey(initialKey);
  
  if (!key) {
    throw new Error('Initial key is required');
  }
  
  if (!text) {
    return '';
  }
  
  const autokey = generateAutokey(text, key);
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const plainCharCode = text.charCodeAt(i) - 65; // A=0, B=1, ..., Z=25
    const keyCharCode = autokey.charCodeAt(i) - 65;
    const encryptedCharCode = (plainCharCode + keyCharCode) % 26;
    
    result += String.fromCharCode(encryptedCharCode + 65);
  }
  
  return result;
};

/**
 * Decrypt ciphertext using Autokey cipher
 * Formula: Pi = (Ci - Ki + 26) mod 26
 * Key regenerates progressively using decrypted plaintext
 */
export const autokeyDecrypt = (ciphertext, initialKey) => {
  const text = prepareText(ciphertext);
  const key = prepareKey(initialKey);
  
  if (!key) {
    throw new Error('Initial key is required');
  }
  
  if (!text) {
    return '';
  }
  
  let result = '';
  let currentKey = key;
  
  for (let i = 0; i < text.length; i++) {
    const cipherCharCode = text.charCodeAt(i) - 65;
    const keyCharCode = currentKey.charCodeAt(i) - 65;
    const decryptedCharCode = (cipherCharCode - keyCharCode + 26) % 26;
    
    const decryptedChar = String.fromCharCode(decryptedCharCode + 65);
    result += decryptedChar;
    
    // Add decrypted character to key for next iteration
    if (i >= key.length - 1) {
      currentKey += decryptedChar;
    }
  }
  
  return result;
};

/**
 * Get visualization data for Autokey cipher
 */
export const getAutokeyVisualization = (plaintext, initialKey) => {
  const text = prepareText(plaintext);
  const key = prepareKey(initialKey);
  
  if (!key || !text) {
    return null;
  }
  
  const autokey = generateAutokey(text, key);
  const ciphertext = autokeyEncrypt(plaintext, initialKey);
  
  // Create character mapping
  const mapping = [];
  for (let i = 0; i < text.length; i++) {
    const plainChar = text[i];
    const keyChar = autokey[i];
    const cipherChar = ciphertext[i];
    
    const plainValue = plainChar.charCodeAt(0) - 65;
    const keyValue = keyChar.charCodeAt(0) - 65;
    const cipherValue = cipherChar.charCodeAt(0) - 65;
    
    const isFromInitialKey = i < key.length;
    
    mapping.push({
      position: i,
      plainChar,
      keyChar,
      cipherChar,
      plainValue,
      keyValue,
      cipherValue,
      isFromInitialKey,
      keySource: isFromInitialKey ? 'Initial Key' : 'Plaintext',
      calculation: `(${plainValue} + ${keyValue}) mod 26 = ${cipherValue}`
    });
  }
  
  return {
    plaintext: text,
    ciphertext,
    initialKey: key,
    autokey,
    keyLength: key.length,
    textLength: text.length,
    mapping,
    note: 'Key starts with initial key, then continues with plaintext'
  };
};

/**
 * Generate Autokey Square (same as Vigenère Square)
 * 26x26 grid where each row is Caesar cipher with different shift
 */
export const generateAutokeySquare = () => {
  const square = [];
  
  for (let row = 0; row < 26; row++) {
    const rowArray = [];
    for (let col = 0; col < 26; col++) {
      const charCode = ((row + col) % 26) + 65;
      rowArray.push(String.fromCharCode(charCode));
    }
    square.push(rowArray);
  }
  
  return square;
};

/**
 * Analyze Autokey ciphertext for cryptanalysis
 * Returns index of coincidence and likely key length
 */
export const analyzeAutokey = (ciphertext) => {
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
  
  // Try different key lengths (similar to Vigenère but with autokey behavior)
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
    if (avgIC > 0.050) {
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
    note: 'Autokey uses plaintext as key after initial key. IC analysis helps find initial key length.',
    cipherType: 'Autokey (Progressive Key)'
  };
};

/**
 * Attempt to find the initial key length using frequency analysis
 */
export const findAutokeyKeyLength = (ciphertext) => {
  const analysis = analyzeAutokey(ciphertext);
  
  if (!analysis || !analysis.likelyKeyLengths.length) {
    return null;
  }
  
  return analysis.likelyKeyLengths[0].length;
};

// Export all functions
export default {
  autokeyEncrypt,
  autokeyDecrypt,
  getAutokeyVisualization,
  generateAutokeySquare,
  analyzeAutokey,
  findAutokeyKeyLength
};