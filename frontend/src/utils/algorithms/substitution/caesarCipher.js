// src/utils/algorithms/substitution/caesarCipher.js

/**
 * Caesar Cipher Algorithm
 * Menggeser karakter sebanyak K posisi
 */

export const caesarEncrypt = (plaintext, shift) => {
  let result = '';
  const normalizedShift = ((shift % 26) + 26) % 26;
  
  for (let i = 0; i < plaintext.length; i++) {
    const char = plaintext[i];
    
    if (char.match(/[a-z]/i)) {
      const code = plaintext.charCodeAt(i);
      
      // Uppercase
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
      }
      // Lowercase
      else if (code >= 97 && code <= 122) {
        result += String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97);
      }
    } else {
      result += char; // Non-alphabet characters remain unchanged
    }
  }
  
  return result;
};

export const caesarDecrypt = (ciphertext, shift) => {
  return caesarEncrypt(ciphertext, -shift);
};

export const rot13 = (text) => {
  return caesarEncrypt(text, 13);
};

// Visualisasi data untuk GUI
export const getCaesarVisualization = (plaintext, shift) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const normalizedShift = ((shift % 26) + 26) % 26;
  
  return {
    originalAlphabet: alphabet.split(''),
    shiftedAlphabet: alphabet.split('').map((_, i) => 
      alphabet[(i + normalizedShift) % 26]
    ),
    shift: normalizedShift,
    mapping: plaintext.toUpperCase().split('').filter(c => c.match(/[A-Z]/)).map(char => ({
      original: char,
      encrypted: caesarEncrypt(char, shift)
    }))
  };
};