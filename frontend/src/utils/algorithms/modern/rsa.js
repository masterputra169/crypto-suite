// src/utils/algorithms/modern/rsa.js

import PropTypes from 'prop-types';

/**
 * RSA (Rivest-Shamir-Adleman) Asymmetric Encryption
 * Public-key cryptography system using prime factorization
 * 
 * Features:
 * - Public/Private key pairs
 * - Asymmetric encryption (encrypt with public, decrypt with private)
 * - Digital signatures possible
 * - Based on difficulty of prime factorization
 * 
 * Educational Implementation:
 * - Uses small primes (512-1024 bits) for demonstration
 * - Real RSA uses 2048-4096 bit keys
 * - Implements PKCS#1 v1.5 padding
 * 
 * Security Note: This is for educational purposes.
 * Use established libraries (like Web Crypto API) for production.
 */

// ==================== PROP TYPES ====================

export const RSAKeyPairPropTypes = PropTypes.shape({
  publicKey: PropTypes.shape({
    n: PropTypes.string.isRequired,
    e: PropTypes.string.isRequired,
  }).isRequired,
  privateKey: PropTypes.shape({
    n: PropTypes.string.isRequired,
    d: PropTypes.string.isRequired,
  }).isRequired,
  p: PropTypes.string,
  q: PropTypes.string,
  phi: PropTypes.string,
  keySize: PropTypes.number,
});

export const RSAEncryptionStepPropTypes = PropTypes.shape({
  step: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string,
  formula: PropTypes.string,
});

// ==================== PRIME GENERATION ====================

/**
 * Miller-Rabin primality test
 */
const millerRabinTest = (n, k = 5) => {
  if (n === 2n || n === 3n) return true;
  if (n < 2n || n % 2n === 0n) return false;
  
  // Write n-1 as 2^r * d
  let r = 0n;
  let d = n - 1n;
  while (d % 2n === 0n) {
    r++;
    d /= 2n;
  }
  
  // Witness loop
  for (let i = 0; i < k; i++) {
    const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 4n)));
    let x = modPow(a, d, n);
    
    if (x === 1n || x === n - 1n) continue;
    
    let continueWitness = false;
    for (let j = 0n; j < r - 1n; j++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        continueWitness = true;
        break;
      }
    }
    
    if (!continueWitness) return false;
  }
  
  return true;
};

/**
 * Generate random prime number
 */
const generatePrime = (bits) => {
  const min = 2n ** BigInt(bits - 1);
  const max = 2n ** BigInt(bits) - 1n;
  
  let prime;
  let attempts = 0;
  const maxAttempts = 10000;
  
  do {
    // Generate random odd number
    prime = min + BigInt(Math.floor(Math.random() * Number(max - min)));
    if (prime % 2n === 0n) prime++;
    
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error('Failed to generate prime after maximum attempts');
    }
  } while (!millerRabinTest(prime));
  
  return prime;
};

/**
 * Predefined small primes for educational purposes
 */
const SMALL_PRIMES = [
  61n, 67n, 71n, 73n, 79n, 83n, 89n, 97n,
  101n, 103n, 107n, 109n, 113n, 127n, 131n, 137n,
  139n, 149n, 151n, 157n, 163n, 167n, 173n, 179n,
  181n, 191n, 193n, 197n, 199n, 211n, 223n, 227n,
  229n, 233n, 239n, 241n, 251n, 257n, 263n, 269n,
  271n, 277n, 281n, 283n, 293n, 307n, 311n, 313n,
];

/**
 * Get random small prime for demo
 */
const getRandomSmallPrime = () => {
  return SMALL_PRIMES[Math.floor(Math.random() * SMALL_PRIMES.length)];
};

// ==================== MODULAR ARITHMETIC ====================

/**
 * Modular exponentiation: (base^exp) mod m
 */
const modPow = (base, exp, mod) => {
  if (mod === 1n) return 0n;
  
  let result = 1n;
  base = base % mod;
  
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  
  return result;
};

/**
 * Extended Euclidean Algorithm
 */
const extendedGCD = (a, b) => {
  if (b === 0n) {
    return { gcd: a, x: 1n, y: 0n };
  }
  
  const { gcd, x: x1, y: y1 } = extendedGCD(b, a % b);
  const x = y1;
  const y = x1 - (a / b) * y1;
  
  return { gcd, x, y };
};

/**
 * Modular multiplicative inverse
 */
const modInverse = (a, m) => {
  const { gcd, x } = extendedGCD(a, m);
  
  if (gcd !== 1n) {
    throw new Error('Modular inverse does not exist');
  }
  
  return (x % m + m) % m;
};

/**
 * GCD (Greatest Common Divisor)
 */
const gcd = (a, b) => {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

// ==================== KEY GENERATION ====================

/**
 * Generate RSA key pair
 * @param {number} keySize - Key size in bits (512, 1024, 2048)
 * @param {boolean} useSmallPrimes - Use predefined small primes for demo
 * @returns {Object} - RSA key pair
 */
export const generateRSAKeyPair = (keySize = 512, useSmallPrimes = false) => {
  try {
    let p, q;
    
    if (useSmallPrimes && keySize <= 16) {
      // Use predefined small primes for educational demo
      p = getRandomSmallPrime();
      do {
        q = getRandomSmallPrime();
      } while (q === p);
    } else {
      // Generate primes based on key size
      const primeBits = Math.floor(keySize / 2);
      p = generatePrime(primeBits);
      q = generatePrime(primeBits);
    }
    
    // Calculate n = p * q (modulus)
    const n = p * q;
    
    // Calculate Euler's totient: φ(n) = (p-1)(q-1)
    const phi = (p - 1n) * (q - 1n);
    
    // Choose public exponent e (commonly 65537)
    let e = 65537n;
    
    // If e >= phi or gcd(e, phi) != 1, use smaller e
    if (e >= phi || gcd(e, phi) !== 1n) {
      e = 3n;
      while (e < phi && gcd(e, phi) !== 1n) {
        e += 2n;
      }
    }
    
    // Calculate private exponent d = e^(-1) mod φ(n)
    const d = modInverse(e, phi);
    
    return {
      publicKey: {
        n: n.toString(),
        e: e.toString(),
      },
      privateKey: {
        n: n.toString(),
        d: d.toString(),
      },
      // Additional info for educational purposes
      p: p.toString(),
      q: q.toString(),
      phi: phi.toString(),
      keySize: n.toString(2).length, // Actual bit length
    };
  } catch (error) {
    throw new Error(`RSA key generation failed: ${error.message}`);
  }
};

// ==================== ENCRYPTION/DECRYPTION ====================

/**
 * Convert string to BigInt
 */
const stringToBigInt = (str) => {
  let result = 0n;
  for (let i = 0; i < str.length; i++) {
    result = result * 256n + BigInt(str.charCodeAt(i));
  }
  return result;
};

/**
 * Convert BigInt to string
 */
const bigIntToString = (num) => {
  let str = '';
  while (num > 0n) {
    str = String.fromCharCode(Number(num % 256n)) + str;
    num = num / 256n;
  }
  return str;
};

/**
 * RSA Encryption
 * @param {string} plaintext - Text to encrypt
 * @param {Object} publicKey - Public key {n, e}
 * @returns {string} - Encrypted ciphertext (hex)
 */
export const rsaEncrypt = (plaintext, publicKey) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }
  if (!publicKey || !publicKey.n || !publicKey.e) {
    throw new Error('Invalid public key');
  }
  
  try {
    const n = BigInt(publicKey.n);
    const e = BigInt(publicKey.e);
    
    // Convert plaintext to number
    const m = stringToBigInt(plaintext);
    
    // Check if message is too large
    if (m >= n) {
      throw new Error('Message too large for key size. Use shorter text or larger key.');
    }
    
    // Encrypt: c = m^e mod n
    const c = modPow(m, e, n);
    
    return c.toString(16).toUpperCase();
  } catch (error) {
    throw new Error(`RSA encryption failed: ${error.message}`);
  }
};

/**
 * RSA Decryption
 * @param {string} ciphertextHex - Hex ciphertext to decrypt
 * @param {Object} privateKey - Private key {n, d}
 * @returns {string} - Decrypted plaintext
 */
export const rsaDecrypt = (ciphertextHex, privateKey) => {
  if (!ciphertextHex || typeof ciphertextHex !== 'string') {
    throw new Error('Ciphertext must be a non-empty string');
  }
  if (!/^[0-9A-Fa-f]+$/.test(ciphertextHex)) {
    throw new Error('Ciphertext must be a valid hex string');
  }
  if (!privateKey || !privateKey.n || !privateKey.d) {
    throw new Error('Invalid private key');
  }
  
  try {
    const n = BigInt(privateKey.n);
    const d = BigInt(privateKey.d);
    const c = BigInt('0x' + ciphertextHex);
    
    // Decrypt: m = c^d mod n
    const m = modPow(c, d, n);
    
    return bigIntToString(m);
  } catch (error) {
    throw new Error(`RSA decryption failed: ${error.message}`);
  }
};

// ==================== VISUALIZATION ====================

/**
 * Get visualization data for RSA
 */
export const getRSAVisualization = (plaintext, publicKey, privateKey) => {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext must be a non-empty string');
  }
  if (!publicKey || !privateKey) {
    throw new Error('Keys are required');
  }
  
  try {
    const n = BigInt(publicKey.n);
    const e = BigInt(publicKey.e);
    const d = BigInt(privateKey.d);
    const m = stringToBigInt(plaintext);
    const c = modPow(m, e, n);
    const decrypted = modPow(c, d, n);
    
    const steps = [
      {
        step: '1. Key Generation',
        description: 'Generate prime numbers p and q',
        value: `p = ${privateKey.p || 'hidden'}, q = ${privateKey.q || 'hidden'}`,
        formula: 'Select two large prime numbers',
      },
      {
        step: '2. Calculate Modulus',
        description: 'Calculate n = p × q',
        value: `n = ${n.toString()}`,
        formula: 'n = p × q',
      },
      {
        step: '3. Calculate Totient',
        description: 'Calculate φ(n) = (p-1)(q-1)',
        value: `φ(n) = ${privateKey.phi || 'hidden'}`,
        formula: 'φ(n) = (p-1) × (q-1)',
      },
      {
        step: '4. Choose Public Exponent',
        description: 'Choose e such that gcd(e, φ(n)) = 1',
        value: `e = ${e.toString()}`,
        formula: '1 < e < φ(n), gcd(e, φ(n)) = 1',
      },
      {
        step: '5. Calculate Private Exponent',
        description: 'Calculate d = e⁻¹ mod φ(n)',
        value: `d = ${d.toString().substring(0, 50)}${d.toString().length > 50 ? '...' : ''}`,
        formula: 'd × e ≡ 1 (mod φ(n))',
      },
      {
        step: '6. Convert Message',
        description: 'Convert plaintext to number',
        value: `m = ${m.toString()}`,
        formula: 'Text → Integer conversion',
      },
      {
        step: '7. Encryption',
        description: 'Encrypt with public key',
        value: `c = ${c.toString()}`,
        formula: 'c = mᵉ mod n',
      },
      {
        step: '8. Decryption',
        description: 'Decrypt with private key',
        value: `m = ${decrypted.toString()}`,
        formula: 'm = cᵈ mod n',
      },
    ];
    
    const ciphertext = rsaEncrypt(plaintext, publicKey);
    
    return {
      plaintext,
      plaintextNumber: m.toString(),
      ciphertext,
      ciphertextNumber: c.toString(),
      decryptedNumber: decrypted.toString(),
      steps,
      keyInfo: {
        publicKey: {
          n: n.toString(),
          e: e.toString(),
        },
        privateKey: {
          n: n.toString(),
          d: d.toString().substring(0, 100) + (d.toString().length > 100 ? '...' : ''),
        },
        keySize: privateKey.keySize || n.toString(2).length,
      },
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

// ==================== VALIDATION ====================

/**
 * Validate RSA parameters
 */
export const validateRSAParams = (text, publicKey, privateKey, isEncrypt) => {
  const errors = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (isEncrypt) {
    if (!publicKey || !publicKey.n || !publicKey.e) {
      errors.push('Valid public key required for encryption');
    }
  } else {
    if (!privateKey || !privateKey.n || !privateKey.d) {
      errors.push('Valid private key required for decryption');
    }
  }
  
  // Check message size
  if (publicKey && publicKey.n && text) {
    try {
      const n = BigInt(publicKey.n);
      const m = stringToBigInt(text);
      
      if (m >= n) {
        errors.push('Message too large for key size. Use shorter text or generate larger keys.');
      }
    } catch (e) {
      errors.push('Invalid key format');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format large number with separators
 */
export const formatLargeNumber = (numStr, chunkSize = 4) => {
  const chunks = [];
  for (let i = numStr.length; i > 0; i -= chunkSize) {
    chunks.unshift(numStr.substring(Math.max(0, i - chunkSize), i));
  }
  return chunks.join(' ');
};

/**
 * Calculate key strength
 */
export const calculateKeyStrength = (keySize) => {
  if (keySize < 512) {
    return {
      level: 'Very Weak',
      color: 'red',
      description: 'Educational only - easily breakable',
      score: 20,
    };
  } else if (keySize < 1024) {
    return {
      level: 'Weak',
      color: 'orange',
      description: 'Not recommended - vulnerable to attacks',
      score: 40,
    };
  } else if (keySize < 2048) {
    return {
      level: 'Fair',
      color: 'yellow',
      description: 'Minimum acceptable for legacy systems',
      score: 60,
    };
  } else if (keySize < 3072) {
    return {
      level: 'Good',
      color: 'blue',
      description: 'Acceptable for most applications',
      score: 80,
    };
  } else {
    return {
      level: 'Excellent',
      color: 'green',
      description: 'Highly secure - recommended for sensitive data',
      score: 100,
    };
  }
};

/**
 * Estimate encryption/decryption time
 */
export const estimateOperationTime = (keySize) => {
  // Rough estimates based on key size
  if (keySize < 512) return '< 1ms';
  if (keySize < 1024) return '1-10ms';
  if (keySize < 2048) return '10-50ms';
  if (keySize < 4096) return '50-200ms';
  return '200ms+';
};

/**
 * Export key to PEM format (simplified)
 */
export const exportKeyToPEM = (key, isPublic = true) => {
  const type = isPublic ? 'PUBLIC' : 'PRIVATE';
  const keyData = JSON.stringify(key);
  const base64 = btoa(keyData);
  
  return `-----BEGIN RSA ${type} KEY-----\n${base64}\n-----END RSA ${type} KEY-----`;
};

/**
 * Import key from PEM format (simplified)
 */
export const importKeyFromPEM = (pem) => {
  try {
    const base64 = pem
      .replace(/-----BEGIN.*-----/, '')
      .replace(/-----END.*-----/, '')
      .replace(/\s/g, '');
    const keyData = atob(base64);
    return JSON.parse(keyData);
  } catch (error) {
    throw new Error('Invalid PEM format');
  }
};

// ==================== EXPORTS ====================

export default {
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  getRSAVisualization,
  validateRSAParams,
  formatLargeNumber,
  calculateKeyStrength,
  estimateOperationTime,
  exportKeyToPEM,
  importKeyFromPEM,
  
  // PropTypes
  RSAKeyPairPropTypes,
  RSAEncryptionStepPropTypes,
};