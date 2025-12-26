// src/utils/statistics/entropyCalculator.js

/**
 * Entropy Calculator
 * Menghitung Shannon Entropy untuk mengukur randomness
 */

/**
 * Calculate Shannon Entropy
 * H(X) = -Σ p(x) * log2(p(x))
 */
export const calculateEntropy = (text) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  if (cleanText.length === 0) return 0;

  // Count character frequencies
  const frequency = {};
  for (const char of cleanText) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  // Calculate probabilities and entropy
  const total = cleanText.length;
  let entropy = 0;

  for (const count of Object.values(frequency)) {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
};

/**
 * Calculate normalized entropy (0-1)
 */
export const calculateNormalizedEntropy = (text) => {
  const entropy = calculateEntropy(text);
  const maxEntropy = Math.log2(26); // Maximum entropy for 26 letters
  
  return {
    entropy,
    maxEntropy,
    normalized: entropy / maxEntropy,
    percentage: (entropy / maxEntropy) * 100
  };
};

/**
 * Calculate conditional entropy H(Y|X)
 */
export const calculateConditionalEntropy = (text) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  if (cleanText.length < 2) return 0;

  // Count bigram frequencies
  const bigrams = {};
  const unigramCounts = {};

  for (let i = 0; i < cleanText.length - 1; i++) {
    const bigram = cleanText.substring(i, i + 2);
    const first = cleanText[i];
    
    bigrams[bigram] = (bigrams[bigram] || 0) + 1;
    unigramCounts[first] = (unigramCounts[first] || 0) + 1;
  }

  // Calculate conditional entropy
  let conditionalEntropy = 0;
  const totalBigrams = cleanText.length - 1;

  for (const [bigram, count] of Object.entries(bigrams)) {
    const first = bigram[0];
    const pBigram = count / totalBigrams;
    const pConditional = count / unigramCounts[first];
    
    conditionalEntropy -= pBigram * Math.log2(pConditional);
  }

  return conditionalEntropy;
};

/**
 * Calculate entropy per character (rate)
 */
export const calculateEntropyRate = (text) => {
  const entropy = calculateEntropy(text);
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  return {
    totalEntropy: entropy,
    length: cleanText.length,
    rate: cleanText.length > 0 ? entropy / cleanText.length : 0
  };
};

/**
 * Estimate key length menggunakan Kasiski examination
 */
export const estimateKeyLength = (text, maxKeyLength = 20) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  if (cleanText.length < 6) return null;

  // Find repeated sequences (3+ chars)
  const sequences = {};
  const minLength = 3;

  for (let len = minLength; len <= Math.min(6, cleanText.length / 2); len++) {
    for (let i = 0; i <= cleanText.length - len; i++) {
      const seq = cleanText.substring(i, i + len);
      
      if (!sequences[seq]) {
        sequences[seq] = [];
      }
      sequences[seq].push(i);
    }
  }

  // Find sequences that appear multiple times
  const repeatedSequences = Object.entries(sequences)
    .filter(([_, positions]) => positions.length > 1)
    .map(([seq, positions]) => {
      const distances = [];
      for (let i = 1; i < positions.length; i++) {
        distances.push(positions[i] - positions[i - 1]);
      }
      return { seq, positions, distances };
    });

  if (repeatedSequences.length === 0) return null;

  // Calculate GCD of all distances
  const allDistances = repeatedSequences.flatMap(rs => rs.distances);
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const gcdAll = allDistances.reduce((a, b) => gcd(a, b));

  // Count factors
  const factors = {};
  for (const distance of allDistances) {
    for (let i = 2; i <= Math.min(distance, maxKeyLength); i++) {
      if (distance % i === 0) {
        factors[i] = (factors[i] || 0) + 1;
      }
    }
  }

  const likelyKeyLengths = Object.entries(factors)
    .map(([length, count]) => ({
      length: parseInt(length),
      count,
      score: count / repeatedSequences.length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    repeatedSequences,
    gcd: gcdAll,
    likelyKeyLengths,
    mostLikely: likelyKeyLengths[0]?.length || null
  };
};

/**
 * Calculate entropy untuk setiap position dalam key
 */
export const calculatePositionalEntropy = (text, keyLength) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const positions = Array(keyLength).fill('').map(() => '');

  // Split text by position
  for (let i = 0; i < cleanText.length; i++) {
    positions[i % keyLength] += cleanText[i];
  }

  // Calculate entropy for each position
  return positions.map((posText, index) => ({
    position: index,
    length: posText.length,
    entropy: calculateEntropy(posText),
    normalized: calculateNormalizedEntropy(posText)
  }));
};

/**
 * Interpret entropy value
 */
const interpretEntropy = (normalizedEntropy) => {
  if (normalizedEntropy >= 0.9) {
    return {
      level: 'Very High',
      quality: 'Excellent',
      description: 'Text appears highly random, likely well-encrypted or random data'
    };
  } else if (normalizedEntropy >= 0.7) {
    return {
      level: 'High',
      quality: 'Good',
      description: 'Text has good randomness, likely encrypted with strong cipher'
    };
  } else if (normalizedEntropy >= 0.5) {
    return {
      level: 'Medium',
      quality: 'Moderate',
      description: 'Text has moderate randomness, may be weakly encrypted'
    };
  } else if (normalizedEntropy >= 0.3) {
    return {
      level: 'Low',
      quality: 'Poor',
      description: 'Text has low randomness, likely plaintext or weak encryption'
    };
  } else {
    return {
      level: 'Very Low',
      quality: 'Very Poor',
      description: 'Text appears as plaintext or has very weak encryption'
    };
  }
};

/**
 * Get entropy analysis report
 */
export const getEntropyReport = (text) => {
  const basicEntropy = calculateEntropy(text);
  const normalized = calculateNormalizedEntropy(text);
  const conditional = calculateConditionalEntropy(text);
  const rate = calculateEntropyRate(text);
  const keyLength = estimateKeyLength(text);

  return {
    shannon: basicEntropy,
    normalized,
    conditional,
    rate,
    keyLengthEstimate: keyLength,
    interpretation: interpretEntropy(normalized.normalized),
    summary: {
      entropy: basicEntropy.toFixed(4),
      normalizedPercentage: normalized.percentage.toFixed(2) + '%',
      randomness: interpretEntropy(normalized.normalized).level,
      estimatedKeyLength: keyLength?.mostLikely || 'Unknown'
    }
  };
};

/**
 * Compare entropy before and after encryption
 */
export const compareEntropy = (plaintext, ciphertext) => {
  const plaintextEntropy = calculateNormalizedEntropy(plaintext);
  const ciphertextEntropy = calculateNormalizedEntropy(ciphertext);

  return {
    plaintext: plaintextEntropy,
    ciphertext: ciphertextEntropy,
    difference: ciphertextEntropy.entropy - plaintextEntropy.entropy,
    improvement: ((ciphertextEntropy.normalized - plaintextEntropy.normalized) / plaintextEntropy.normalized) * 100,
    effectivenessScore: calculateEffectivenessScore(plaintextEntropy.normalized, ciphertextEntropy.normalized)
  };
};

/**
 * Calculate effectiveness score (0-100)
 */
const calculateEffectivenessScore = (plaintextNorm, ciphertextNorm) => {
  // Higher ciphertext entropy compared to plaintext = better encryption
  const improvement = ciphertextNorm - plaintextNorm;
  
  // Ideal: plaintext low (~0.3-0.5), ciphertext high (~0.8-1.0)
  const idealImprovement = 0.5;
  const score = Math.min(100, (improvement / idealImprovement) * 100);
  
  return Math.max(0, score);
};