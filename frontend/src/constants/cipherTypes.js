// src/constants/cipherTypes.js

/**
 * Cipher Type Constants - Complete Implementation
 * Definisi lengkap untuk semua jenis cipher (Modul A-G)
 */

// ========================================
// CIPHER CATEGORIES
// ========================================
export const CIPHER_CATEGORIES = {
  SUBSTITUTION: 'substitution',
  POLYGRAM: 'polygram',
  TRANSPOSITION: 'transposition',
  ADVANCED_CLASSIC: 'advanced-classic',
  STREAM: 'stream',
  MODERN_BLOCK: 'modern-block',
  MODERN_ASYMMETRIC: 'modern-asymmetric',
};

// ========================================
// DIFFICULTY & SECURITY LEVELS
// ========================================
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const SECURITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  PERFECT: 'perfect', // for OTP
};

// ========================================
// MODUL A: SUBSTITUTION CIPHERS
// ========================================
export const SUBSTITUTION_CIPHERS = {
  CAESAR: {
    id: 'caesar',
    name: 'Caesar Cipher',
    shortName: 'Caesar',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/caesar',
    difficulty: DIFFICULTY_LEVELS.EASY,
    security: SECURITY_LEVELS.LOW,
    description: 'Simple shift cipher - one of the earliest known encryption techniques',
    longDescription: 'The Caesar cipher is a substitution cipher where each letter is shifted by a fixed number of positions in the alphabet. Named after Julius Caesar who used it for military communications.',
    keyType: 'number',
    keyRange: { min: 0, max: 25 },
    features: [
      'Simple alphabet shifting',
      'Easy to understand',
      'Quick encryption/decryption',
      'Visual alphabet mapping',
    ],
    useCases: [
      'Educational purposes',
      'Simple message obfuscation',
      'Historical demonstrations',
    ],
    strengths: [
      'Very fast processing',
      'No complex key management',
      'Easy to implement',
    ],
    weaknesses: [
      'Only 25 possible keys',
      'Vulnerable to brute force',
      'Frequency analysis attack',
      'Pattern preservation',
    ],
    historicalInfo: 'Used by Julius Caesar around 58 BC for military messages',
    icon: 'RotateCw',
  },
  
  VIGENERE: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    shortName: 'Vigenère',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/vigenere',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Polyalphabetic cipher using a keyword for repeated shifts',
    longDescription: 'The Vigenère cipher uses a keyword to perform multiple Caesar cipher shifts. Each letter of the keyword determines the shift for corresponding plaintext letters.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Polyalphabetic substitution',
      'Keyword-based encryption',
      'Tabula recta visualization',
      'Repeating key pattern',
    ],
    useCases: [
      'Moderate security messages',
      'Multi-layer encryption',
      'Historical cryptography study',
    ],
    strengths: [
      'Multiple shift values',
      'More secure than Caesar',
      'Key length flexibility',
    ],
    weaknesses: [
      'Vulnerable to Kasiski examination',
      'Frequency analysis on long texts',
      'Key repetition pattern',
    ],
    historicalInfo: 'Described by Giovan Battista Bellaso in 1553, misattributed to Blaise de Vigenère',
    icon: 'Grid3x3',
  },
  
  BEAUFORT: {
    id: 'beaufort',
    name: 'Beaufort Cipher',
    shortName: 'Beaufort',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/beaufort',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Reciprocal cipher - variant of Vigenère with reversed operation',
    longDescription: 'The Beaufort cipher is similar to Vigenère but uses subtraction instead of addition, making it a reciprocal cipher where encryption and decryption use the same process.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Reciprocal encryption',
      'Keyword-based like Vigenère',
      'Self-inverse operation',
      'Symmetric process',
    ],
    useCases: [
      'Alternative to Vigenère',
      'Reciprocal encryption needs',
      'Historical cipher study',
    ],
    strengths: [
      'Same process for encrypt/decrypt',
      'No separate decryption algorithm',
      'Similar strength to Vigenère',
    ],
    weaknesses: [
      'Similar weaknesses to Vigenère',
      'Pattern analysis vulnerability',
      'Key length dependency',
    ],
    historicalInfo: 'Named after Sir Francis Beaufort (1805)',
    icon: 'RefreshCcw',
  },
  
  AUTOKEY: {
    id: 'autokey',
    name: 'Autokey Cipher',
    shortName: 'Autokey',
    category: CIPHER_CATEGORIES.SUBSTITUTION,
    path: '/autokey',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Vigenère variant with self-extending key using plaintext',
    longDescription: 'The Autokey cipher improves upon Vigenère by using the plaintext itself to extend the key, eliminating the repeating key weakness.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Self-extending key',
      'No key repetition',
      'Plaintext-dependent encryption',
      'Improved over Vigenère',
    ],
    useCases: [
      'Enhanced polyalphabetic encryption',
      'Non-repeating key requirements',
      'Intermediate security needs',
    ],
    strengths: [
      'No repeating key pattern',
      'Resistant to Kasiski examination',
      'Longer effective key length',
    ],
    weaknesses: [
      'Error propagation',
      'Still vulnerable to modern attacks',
      'Known plaintext attacks',
    ],
    historicalInfo: 'Invented by Blaise de Vigenère in 1586',
    icon: 'Link',
  },
};

// ========================================
// MODUL B: POLYGRAM CIPHERS
// ========================================
export const POLYGRAM_CIPHERS = {
  PLAYFAIR: {
    id: 'playfair',
    name: 'Playfair Cipher',
    shortName: 'Playfair',
    category: CIPHER_CATEGORIES.POLYGRAM,
    path: '/playfair',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: '5×5 grid cipher encrypting letter pairs (digraphs)',
    longDescription: 'The Playfair cipher encrypts pairs of letters using a 5×5 grid of letters. It was the first practical digraph substitution cipher.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      '5×5 letter grid',
      'Digraph encryption',
      'Three transformation rules',
      'I/J combination',
    ],
    useCases: [
      'Digraph-level encryption',
      'Historical military use',
      'Pattern obfuscation',
    ],
    strengths: [
      'Breaks frequency analysis',
      'Digraph-based security',
      'Manual encryption possible',
    ],
    weaknesses: [
      'Vulnerable to digraph analysis',
      'Known plaintext attacks',
      'Grid limitations',
    ],
    historicalInfo: 'Created by Charles Wheatstone in 1854, named after Lord Playfair',
    icon: 'Grid3x3',
  },
  
  HILL: {
    id: 'hill',
    name: 'Hill Cipher',
    shortName: 'Hill',
    category: CIPHER_CATEGORIES.POLYGRAM,
    path: '/hill',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Matrix-based polygram cipher using linear algebra',
    longDescription: 'The Hill cipher uses matrix multiplication with a key matrix to encrypt blocks of letters. It was the first polygraph cipher that was practical to operate.',
    keyType: 'matrix',
    matrixSize: { rows: 2, cols: 2 },
    features: [
      'Matrix multiplication',
      'Block cipher operation',
      'Linear algebra based',
      'Invertible key matrix',
    ],
    useCases: [
      'High-security classical encryption',
      'Block cipher study',
      'Mathematical cryptography',
    ],
    strengths: [
      'Completely hides frequency',
      'Resistant to frequency analysis',
      'Mathematical foundation',
    ],
    weaknesses: [
      'Known plaintext attacks',
      'Key matrix validation needed',
      'Complex key generation',
    ],
    historicalInfo: 'Developed by Lester S. Hill in 1929',
    icon: 'Hash',
  },
};

// ========================================
// MODUL C: TRANSPOSITION CIPHERS
// ========================================
export const TRANSPOSITION_CIPHERS = {
  RAIL_FENCE: {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    shortName: 'Rail Fence',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/railfence',
    difficulty: DIFFICULTY_LEVELS.EASY,
    security: SECURITY_LEVELS.LOW,
    description: 'Zigzag pattern transposition across multiple rails',
    longDescription: 'The Rail Fence cipher writes the plaintext in a zigzag pattern across a number of "rails" and reads off the rows to create the ciphertext.',
    keyType: 'number',
    keyRange: { min: 2, max: 10 },
    features: [
      'Zigzag writing pattern',
      'Configurable rail count',
      'Visual grid layout',
      'Simple transposition',
    ],
    useCases: [
      'Basic message scrambling',
      'Educational demonstrations',
      'Simple obfuscation',
    ],
    strengths: [
      'Easy to implement',
      'Fast processing',
      'Adjustable difficulty',
    ],
    weaknesses: [
      'Pattern visible in output',
      'Limited key space',
      'Anagram attacks',
    ],
    historicalInfo: 'Ancient transposition method, exact origin unknown',
    icon: 'TrendingDown',
  },
  
  COLUMNAR: {
    id: 'columnar',
    name: 'Columnar Transposition',
    shortName: 'Columnar',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/columnar',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Column rearrangement based on keyword order',
    longDescription: 'Columnar transposition writes the plaintext in rows and reads it in columns according to a keyword-determined order.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Keyword-based ordering',
      'Column permutation',
      'Grid visualization',
      'Alphabetical sorting',
    ],
    useCases: [
      'Message scrambling',
      'Multi-layer encryption',
      'Intermediate security',
    ],
    strengths: [
      'Variable column count',
      'Flexible key length',
      'Good obfuscation',
    ],
    weaknesses: [
      'Anagram properties',
      'Frequency preserved',
      'Pattern analysis',
    ],
    historicalInfo: 'Used extensively in World War I',
    icon: 'Columns',
  },
  
  MYSZKOWSKI: {
    id: 'myszkowski',
    name: 'Myszkowski Transposition',
    shortName: 'Myszkowski',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/myszkowski',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Columnar variant handling duplicate keyword letters',
    longDescription: 'The Myszkowski transposition is a variant of columnar transposition that handles duplicate letters in the keyword by grouping them together.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    features: [
      'Duplicate letter handling',
      'Column grouping',
      'Enhanced columnar method',
      'Irregular patterns',
    ],
    useCases: [
      'Enhanced transposition',
      'Alternative to columnar',
      'Pattern disruption',
    ],
    strengths: [
      'Handles duplicates well',
      'Irregular output pattern',
      'Flexible keyword choice',
    ],
    weaknesses: [
      'Similar to columnar weaknesses',
      'Anagram vulnerability',
      'Frequency preservation',
    ],
    historicalInfo: 'Named after Émile Victor Théodore Myszkowski',
    icon: 'Layers',
  },
  
  DOUBLE_TRANSPOSITION: {
    id: 'double',
    name: 'Double Transposition',
    shortName: 'Double',
    category: CIPHER_CATEGORIES.TRANSPOSITION,
    path: '/double',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Two-pass columnar transposition for enhanced security',
    longDescription: 'Double transposition applies columnar transposition twice, potentially with different keys, significantly increasing security over single transposition.',
    keyType: 'text',
    keyValidation: /^[A-Za-z]+$/,
    requiresSecondKey: true,
    features: [
      'Two-pass encryption',
      'Dual keyword support',
      'Compound security',
      'Layered transposition',
    ],
    useCases: [
      'High-security transposition',
      'Military communications',
      'Multi-layer encryption',
    ],
    strengths: [
      'Very strong transposition',
      'Two independent keys',
      'Compound complexity',
    ],
    weaknesses: [
      'Still anagram-based',
      'Computationally intensive',
      'Complex key management',
    ],
    historicalInfo: 'Used by German military in WWII',
    icon: 'Repeat',
  },
};

// ========================================
// MODUL D: ADVANCED CLASSIC CIPHERS
// ========================================
export const ADVANCED_CLASSIC_CIPHERS = {
  SUPER_ENCRYPTION: {
    id: 'super-encryption',
    name: 'Super Encryption',
    shortName: 'Super',
    category: CIPHER_CATEGORIES.ADVANCED_CLASSIC,
    path: '/super-encryption',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Combined substitution + transposition for maximum classical security',
    longDescription: 'Super encryption combines Vigenère substitution followed by Columnar transposition, creating a compound cipher that is significantly more secure than either method alone.',
    keyType: 'multiple',
    requiresMultipleKeys: true,
    features: [
      'Two-layer encryption',
      'Substitution + Transposition',
      'Vigenère + Columnar',
      'Compound cipher system',
    ],
    useCases: [
      'Maximum classical security',
      'Multi-layer protection',
      'Advanced cryptography study',
    ],
    strengths: [
      'Combines two cipher types',
      'Very strong for classical',
      'Resistant to simple attacks',
    ],
    weaknesses: [
      'Complex key management',
      'Slower processing',
      'Still vulnerable to modern cryptanalysis',
    ],
    historicalInfo: 'Used in military communications during WWII',
    icon: 'Layers',
  },
  
  OTP: {
    id: 'otp',
    name: 'One Time Pad',
    shortName: 'OTP',
    category: CIPHER_CATEGORIES.ADVANCED_CLASSIC,
    path: '/otp',
    difficulty: DIFFICULTY_LEVELS.EASY,
    security: SECURITY_LEVELS.PERFECT,
    description: 'Theoretically unbreakable cipher with perfect secrecy',
    longDescription: 'One Time Pad uses a truly random key that is as long as the plaintext and is never reused. When used correctly, it provides perfect secrecy and is mathematically unbreakable.',
    keyType: 'random',
    keyGeneration: 'truly-random',
    features: [
      'Perfect secrecy guarantee',
      'Random key generation',
      'Key length = message length',
      'One-time use only',
    ],
    useCases: [
      'Maximum security communications',
      'Diplomatic messages',
      'Top-secret information',
    ],
    strengths: [
      'Mathematically unbreakable',
      'Perfect information-theoretic security',
      'No pattern in output',
    ],
    weaknesses: [
      'Key must be truly random',
      'Key distribution problem',
      'Key length = message length',
      'Cannot reuse keys',
    ],
    historicalInfo: 'Invented by Gilbert Vernam in 1917, proven by Claude Shannon in 1949',
    icon: 'Lock',
  },
};

// ========================================
// MODUL E: STREAM CIPHERS
// ========================================
export const STREAM_CIPHERS = {
  LCG: {
    id: 'lcg',
    name: 'LCG Stream Cipher',
    shortName: 'LCG',
    category: CIPHER_CATEGORIES.STREAM,
    path: '/lcg',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.LOW,
    description: 'Stream cipher using Linear Congruential Generator',
    longDescription: 'LCG stream cipher uses a simple pseudo-random number generator based on linear congruence to create a keystream for XOR encryption.',
    keyType: 'parameters',
    parameters: ['seed', 'multiplier', 'increment', 'modulus'],
    features: [
      'PRNG-based keystream',
      'Fast generation',
      'XOR encryption',
      'Deterministic output',
    ],
    useCases: [
      'Educational PRNG study',
      'Fast encryption needs',
      'Non-cryptographic use',
    ],
    strengths: [
      'Very fast computation',
      'Simple implementation',
      'Low memory usage',
    ],
    weaknesses: [
      'Predictable with known parameters',
      'Not cryptographically secure',
      'Short period possible',
    ],
    historicalInfo: 'First proposed by D. H. Lehmer in 1951',
    icon: 'Activity',
  },
  
  BBS: {
    id: 'bbs',
    name: 'BBS Stream Cipher',
    shortName: 'BBS',
    category: CIPHER_CATEGORIES.STREAM,
    path: '/bbs',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Cryptographically secure stream cipher using Blum Blum Shub',
    longDescription: 'BBS is a cryptographically secure pseudo-random number generator based on the difficulty of integer factorization, providing provable security.',
    keyType: 'primes',
    parameters: ['p', 'q', 'seed'],
    features: [
      'Cryptographically secure PRNG',
      'Based on number theory',
      'Provable security',
      'Large prime numbers',
    ],
    useCases: [
      'Secure stream encryption',
      'Cryptographic applications',
      'Research and study',
    ],
    strengths: [
      'Provably secure',
      'Based on hard math problem',
      'Unpredictable output',
    ],
    weaknesses: [
      'Slower than other PRNGs',
      'Requires large primes',
      'Complex implementation',
    ],
    historicalInfo: 'Proposed by Lenore Blum, Manuel Blum, and Michael Shub in 1986',
    icon: 'Shield',
  },
  
  STREAM: {
    id: 'stream',
    name: 'Generic Stream Cipher',
    shortName: 'Stream',
    category: CIPHER_CATEGORIES.STREAM,
    path: '/stream',
    difficulty: DIFFICULTY_LEVELS.MEDIUM,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Customizable XOR-based stream cipher',
    longDescription: 'Generic stream cipher allows choosing different pseudo-random generators to create a keystream for XOR encryption with plaintext.',
    keyType: 'seed',
    features: [
      'Flexible PRNG selection',
      'XOR-based encryption',
      'Bit-level operation',
      'Customizable parameters',
    ],
    useCases: [
      'General stream encryption',
      'Custom PRNG testing',
      'Educational purposes',
    ],
    strengths: [
      'Fast encryption',
      'Flexible configuration',
      'Simple concept',
    ],
    weaknesses: [
      'Security depends on PRNG',
      'Key reuse vulnerable',
      'Synchronization required',
    ],
    historicalInfo: 'Stream ciphers date back to the Vernam cipher (1917)',
    icon: 'Radio',
  },
};

// ========================================
// MODUL F: MODERN BLOCK CIPHERS (DES)
// ========================================
export const MODERN_BLOCK_CIPHERS = {
  DES: {
    id: 'des',
    name: 'DES Algorithm',
    shortName: 'DES',
    category: CIPHER_CATEGORIES.MODERN_BLOCK,
    path: '/des',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Data Encryption Standard - 64-bit Feistel block cipher',
    longDescription: 'DES is a symmetric-key algorithm using a 56-bit key to encrypt 64-bit blocks through 16 rounds of Feistel network operations.',
    keyType: '64-bit',
    blockSize: 64,
    keySize: 56, // effective
    features: [
      '16-round Feistel network',
      'S-box substitution',
      'Permutation operations',
      '64-bit block processing',
    ],
    useCases: [
      'Block cipher study',
      'Historical encryption standard',
      'Cryptography education',
    ],
    strengths: [
      'Well-studied algorithm',
      'Fast in hardware',
      'Proven design',
    ],
    weaknesses: [
      'Small key size (56 bits)',
      'Vulnerable to brute force',
      'Deprecated for security',
    ],
    historicalInfo: 'Adopted as US federal standard in 1977, deprecated in 2005',
    icon: 'Package',
  },
  
  DES_ECB: {
    id: 'des-ecb',
    name: 'DES ECB Mode',
    shortName: 'DES-ECB',
    category: CIPHER_CATEGORIES.MODERN_BLOCK,
    path: '/des-ecb',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.LOW,
    description: 'Electronic Code Book - simplest DES block mode',
    longDescription: 'ECB mode encrypts each 64-bit block independently with DES. Identical plaintext blocks produce identical ciphertext blocks.',
    keyType: '64-bit',
    blockSize: 64,
    features: [
      'Independent block encryption',
      'Parallelizable',
      'Deterministic output',
      'No IV required',
    ],
    useCases: [
      'Simple block encryption',
      'Mode comparison study',
      'Random data encryption',
    ],
    strengths: [
      'Simple implementation',
      'Parallel processing',
      'No error propagation',
    ],
    weaknesses: [
      'Pattern preservation',
      'Identical blocks visible',
      'Not recommended for use',
    ],
    historicalInfo: 'Original DES mode, now considered insecure',
    icon: 'Square',
  },
  
  DES_CBC: {
    id: 'des-cbc',
    name: 'DES CBC Mode',
    shortName: 'DES-CBC',
    category: CIPHER_CATEGORIES.MODERN_BLOCK,
    path: '/des-cbc',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.MEDIUM,
    description: 'Cipher Block Chaining - chained DES block encryption',
    longDescription: 'CBC mode XORs each plaintext block with the previous ciphertext block before DES encryption, hiding patterns and providing better security.',
    keyType: '64-bit + IV',
    blockSize: 64,
    requiresIV: true,
    features: [
      'Block chaining',
      'IV-based randomization',
      'Pattern hiding',
      'Sequential processing',
    ],
    useCases: [
      'Secure block encryption',
      'File encryption',
      'Mode comparison study',
    ],
    strengths: [
      'Hides patterns',
      'Better than ECB',
      'IV provides randomization',
    ],
    weaknesses: [
      'Sequential encryption',
      'Error propagation',
      'Still limited by DES key size',
    ],
    historicalInfo: 'Most common DES mode in practical use',
    icon: 'Link',
  },
};

// ========================================
// MODUL G: MODERN ASYMMETRIC (RSA)
// ========================================
export const MODERN_ASYMMETRIC_CIPHERS = {
  RSA: {
    id: 'rsa',
    name: 'RSA Encryption',
    shortName: 'RSA',
    category: CIPHER_CATEGORIES.MODERN_ASYMMETRIC,
    path: '/rsa',
    difficulty: DIFFICULTY_LEVELS.HARD,
    security: SECURITY_LEVELS.HIGH,
    description: 'Public-key cryptography using modular exponentiation',
    longDescription: 'RSA is an asymmetric cryptographic algorithm using two keys (public and private) based on the difficulty of factoring large prime numbers.',
    keyType: 'key-pair',
    keyGeneration: 'prime-based',
    features: [
      'Public-key cryptography',
      'Key pair generation',
      'Modular exponentiation',
      'Digital signatures capable',
    ],
    useCases: [
      'Secure key exchange',
      'Digital signatures',
      'Asymmetric encryption',
      'SSL/TLS foundations',
    ],
    strengths: [
      'No shared secret needed',
      'Public key distribution',
      'Digital signature support',
      'Well-established security',
    ],
    weaknesses: [
      'Slower than symmetric',
      'Large key sizes needed',
      'Vulnerable to quantum computing',
      'Requires large primes',
    ],
    historicalInfo: 'Invented by Rivest, Shamir, and Adleman in 1977',
    icon: 'Key',
  },
};

// ========================================
// ALL CIPHERS COMBINED
// ========================================
export const ALL_CIPHERS = {
  ...SUBSTITUTION_CIPHERS,
  ...POLYGRAM_CIPHERS,
  ...TRANSPOSITION_CIPHERS,
  ...ADVANCED_CLASSIC_CIPHERS,
  ...STREAM_CIPHERS,
  ...MODERN_BLOCK_CIPHERS,
  ...MODERN_ASYMMETRIC_CIPHERS,
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get cipher by ID
 */
export const getCipherById = (id) => {
  return ALL_CIPHERS[id.toUpperCase().replace(/-/g, '_')] || null;
};

/**
 * Get ciphers by category
 */
export const getCiphersByCategory = (category) => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.category === category
  );
};

/**
 * Get ciphers by difficulty
 */
export const getCiphersByDifficulty = (difficulty) => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.difficulty === difficulty
  );
};

/**
 * Get ciphers by security level
 */
export const getCiphersBySecurity = (security) => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.security === security
  );
};

/**
 * Get cipher count by category
 */
export const getCipherCountByCategory = () => {
  const counts = {};
  Object.values(ALL_CIPHERS).forEach(cipher => {
    counts[cipher.category] = (counts[cipher.category] || 0) + 1;
  });
  return counts;
};

// ========================================
// CIPHER METADATA FOR UI
// ========================================
export const CIPHER_METADATA = {
  totalCount: Object.keys(ALL_CIPHERS).length,
  categories: {
    [CIPHER_CATEGORIES.SUBSTITUTION]: {
      name: 'Substitution Ciphers',
      description: 'Replace each character with another character',
      count: Object.keys(SUBSTITUTION_CIPHERS).length,
      icon: 'Lock',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    [CIPHER_CATEGORIES.POLYGRAM]: {
      name: 'Polygram Ciphers',
      description: 'Encrypt multiple characters as a block',
      count: Object.keys(POLYGRAM_CIPHERS).length,
      icon: 'Grid3x3',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
    [CIPHER_CATEGORIES.TRANSPOSITION]: {
      name: 'Transposition Ciphers',
      description: 'Rearrange character positions',
      count: Object.keys(TRANSPOSITION_CIPHERS).length,
      icon: 'Shuffle',
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
    [CIPHER_CATEGORIES.ADVANCED_CLASSIC]: {
      name: 'Advanced Classic',
      description: 'Combined and perfect classical ciphers',
      count: Object.keys(ADVANCED_CLASSIC_CIPHERS).length,
      icon: 'Layers',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
    },
    [CIPHER_CATEGORIES.STREAM]: {
      name: 'Stream Ciphers',
      description: 'Bit-by-bit encryption with keystream',
      count: Object.keys(STREAM_CIPHERS).length,
      icon: 'Activity',
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
    },
    [CIPHER_CATEGORIES.MODERN_BLOCK]: {
      name: 'Modern Block Ciphers',
      description: 'Fixed-size block encryption (DES family)',
      count: Object.keys(MODERN_BLOCK_CIPHERS).length,
      icon: 'Package',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    [CIPHER_CATEGORIES.MODERN_ASYMMETRIC]: {
      name: 'Modern Asymmetric',
      description: 'Public-key cryptography systems',
      count: Object.keys(MODERN_ASYMMETRIC_CIPHERS).length,
      icon: 'Key',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
    },
  },
  difficultyLevels: {
    [DIFFICULTY_LEVELS.EASY]: {
      name: 'Easy',
      description: 'Beginner-friendly algorithms',
      color: 'green',
      count: Object.values(ALL_CIPHERS).filter(c => c.difficulty === DIFFICULTY_LEVELS.EASY).length,
    },
    [DIFFICULTY_LEVELS.MEDIUM]: {
      name: 'Medium',
      description: 'Intermediate complexity',
      color: 'yellow',
      count: Object.values(ALL_CIPHERS).filter(c => c.difficulty === DIFFICULTY_LEVELS.MEDIUM).length,
    },
    [DIFFICULTY_LEVELS.HARD]: {
      name: 'Hard',
      description: 'Advanced algorithms',
      color: 'red',
      count: Object.values(ALL_CIPHERS).filter(c => c.difficulty === DIFFICULTY_LEVELS.HARD).length,
    },
  },
  securityLevels: {
    [SECURITY_LEVELS.LOW]: {
      name: 'Low Security',
      description: 'Educational purposes only',
      color: 'red',
      count: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.LOW).length,
    },
    [SECURITY_LEVELS.MEDIUM]: {
      name: 'Medium Security',
      description: 'Moderate protection',
      color: 'yellow',
      count: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.MEDIUM).length,
    },
    [SECURITY_LEVELS.HIGH]: {
      name: 'High Security',
      description: 'Strong protection',
      color: 'green',
      count: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.HIGH).length,
    },
    [SECURITY_LEVELS.PERFECT]: {
      name: 'Perfect Security',
      description: 'Information-theoretic security',
      color: 'blue',
      count: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.PERFECT).length,
    },
  },
};

// ========================================
// CATEGORY DISPLAY NAMES
// ========================================
export const CATEGORY_NAMES = {
  [CIPHER_CATEGORIES.SUBSTITUTION]: 'Substitution Ciphers',
  [CIPHER_CATEGORIES.POLYGRAM]: 'Polygram Ciphers',
  [CIPHER_CATEGORIES.TRANSPOSITION]: 'Transposition Ciphers',
  [CIPHER_CATEGORIES.ADVANCED_CLASSIC]: 'Advanced Classic',
  [CIPHER_CATEGORIES.STREAM]: 'Stream Ciphers',
  [CIPHER_CATEGORIES.MODERN_BLOCK]: 'Modern Block Ciphers',
  [CIPHER_CATEGORIES.MODERN_ASYMMETRIC]: 'Modern Asymmetric',
};

// ========================================
// CATEGORY DESCRIPTIONS
// ========================================
export const CATEGORY_DESCRIPTIONS = {
  [CIPHER_CATEGORIES.SUBSTITUTION]: 'Replace each character with another character based on a key',
  [CIPHER_CATEGORIES.POLYGRAM]: 'Encrypt multiple characters together as a single unit',
  [CIPHER_CATEGORIES.TRANSPOSITION]: 'Rearrange the positions of characters without changing them',
  [CIPHER_CATEGORIES.ADVANCED_CLASSIC]: 'Combined techniques and theoretically unbreakable ciphers',
  [CIPHER_CATEGORIES.STREAM]: 'Encrypt data bit-by-bit or byte-by-byte using a keystream',
  [CIPHER_CATEGORIES.MODERN_BLOCK]: 'Encrypt fixed-size blocks using complex operations',
  [CIPHER_CATEGORIES.MODERN_ASYMMETRIC]: 'Use key pairs for encryption and digital signatures',
};

// ========================================
// SEARCH AND FILTER
// ========================================

/**
 * Search ciphers by name or description
 */
export const searchCiphers = (query) => {
  const lowerQuery = query.toLowerCase();
  return Object.values(ALL_CIPHERS).filter(cipher =>
    cipher.name.toLowerCase().includes(lowerQuery) ||
    cipher.shortName.toLowerCase().includes(lowerQuery) ||
    cipher.description.toLowerCase().includes(lowerQuery) ||
    cipher.longDescription?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get recommended ciphers for beginners
 */
export const getBeginnerCiphers = () => {
  return Object.values(ALL_CIPHERS).filter(
    cipher => cipher.difficulty === DIFFICULTY_LEVELS.EASY
  );
};

/**
 * Get most popular/featured ciphers
 */
export const getFeaturedCiphers = () => {
  return [
    ALL_CIPHERS.CAESAR,
    ALL_CIPHERS.VIGENERE,
    ALL_CIPHERS.PLAYFAIR,
    ALL_CIPHERS.RAIL_FENCE,
    ALL_CIPHERS.COLUMNAR,
    ALL_CIPHERS.HILL,
    ALL_CIPHERS.OTP,
    ALL_CIPHERS.RSA,
  ].filter(Boolean);
};

/**
 * Get cipher statistics
 */
export const getCipherStatistics = () => {
  return {
    total: Object.keys(ALL_CIPHERS).length,
    byCategory: getCipherCountByCategory(),
    byDifficulty: {
      easy: Object.values(ALL_CIPHERS).filter(c => c.difficulty === DIFFICULTY_LEVELS.EASY).length,
      medium: Object.values(ALL_CIPHERS).filter(c => c.difficulty === DIFFICULTY_LEVELS.MEDIUM).length,
      hard: Object.values(ALL_CIPHERS).filter(c => c.difficulty === DIFFICULTY_LEVELS.HARD).length,
    },
    bySecurity: {
      low: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.LOW).length,
      medium: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.MEDIUM).length,
      high: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.HIGH).length,
      perfect: Object.values(ALL_CIPHERS).filter(c => c.security === SECURITY_LEVELS.PERFECT).length,
    },
  };
};

/**
 * Get cipher learning path (ordered by difficulty)
 */
export const getLearningPath = () => {
  return [
    // Start with basics
    ALL_CIPHERS.CAESAR,
    ALL_CIPHERS.RAIL_FENCE,
    
    // Move to intermediate
    ALL_CIPHERS.VIGENERE,
    ALL_CIPHERS.COLUMNAR,
    ALL_CIPHERS.BEAUFORT,
    ALL_CIPHERS.AUTOKEY,
    ALL_CIPHERS.PLAYFAIR,
    ALL_CIPHERS.MYSZKOWSKI,
    ALL_CIPHERS.LCG,
    ALL_CIPHERS.STREAM,
    
    // Advanced classical
    ALL_CIPHERS.HILL,
    ALL_CIPHERS.DOUBLE_TRANSPOSITION,
    ALL_CIPHERS.SUPER_ENCRYPTION,
    ALL_CIPHERS.OTP,
    
    // Modern ciphers
    ALL_CIPHERS.BBS,
    ALL_CIPHERS.DES,
    ALL_CIPHERS.DES_ECB,
    ALL_CIPHERS.DES_CBC,
    ALL_CIPHERS.RSA,
  ].filter(Boolean);
};

/**
 * Get related ciphers
 */
export const getRelatedCiphers = (cipherId) => {
  const cipher = getCipherById(cipherId);
  if (!cipher) return [];
  
  // Get ciphers from same category
  return getCiphersByCategory(cipher.category).filter(
    c => c.id !== cipher.id
  );
};

/**
 * Validate cipher configuration
 */
export const validateCipherConfig = (cipherId, config) => {
  const cipher = getCipherById(cipherId);
  if (!cipher) return { valid: false, error: 'Cipher not found' };
  
  const errors = [];
  
  // Validate based on key type
  switch (cipher.keyType) {
    case 'number':
      if (config.key === undefined || config.key === null) {
        errors.push('Key is required');
      } else if (cipher.keyRange) {
        if (config.key < cipher.keyRange.min || config.key > cipher.keyRange.max) {
          errors.push(`Key must be between ${cipher.keyRange.min} and ${cipher.keyRange.max}`);
        }
      }
      break;
      
    case 'text':
      if (!config.key || typeof config.key !== 'string') {
        errors.push('Key must be a text string');
      } else if (cipher.keyValidation && !cipher.keyValidation.test(config.key)) {
        errors.push('Key contains invalid characters');
      }
      break;
      
    case 'matrix':
      if (!config.matrix || !Array.isArray(config.matrix)) {
        errors.push('Matrix is required');
      } else if (cipher.matrixSize) {
        if (config.matrix.length !== cipher.matrixSize.rows) {
          errors.push(`Matrix must have ${cipher.matrixSize.rows} rows`);
        }
      }
      break;
      
    case 'multiple':
      if (cipher.requiresMultipleKeys) {
        if (!config.key1 || !config.key2) {
          errors.push('Multiple keys are required');
        }
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
  };
};

// ========================================
// EXPORT DEFAULT
// ========================================
export default {
  CIPHER_CATEGORIES,
  DIFFICULTY_LEVELS,
  SECURITY_LEVELS,
  SUBSTITUTION_CIPHERS,
  POLYGRAM_CIPHERS,
  TRANSPOSITION_CIPHERS,
  ADVANCED_CLASSIC_CIPHERS,
  STREAM_CIPHERS,
  MODERN_BLOCK_CIPHERS,
  MODERN_ASYMMETRIC_CIPHERS,
  ALL_CIPHERS,
  CIPHER_METADATA,
  CATEGORY_NAMES,
  CATEGORY_DESCRIPTIONS,
  getCipherById,
  getCiphersByCategory,
  getCiphersByDifficulty,
  getCiphersBySecurity,
  getCipherCountByCategory,
  searchCiphers,
  getBeginnerCiphers,
  getFeaturedCiphers,
  getCipherStatistics,
  getLearningPath,
  getRelatedCiphers,
  validateCipherConfig,
};