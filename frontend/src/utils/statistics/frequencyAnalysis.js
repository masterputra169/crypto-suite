// src/utils/statistics/frequencyAnalysis.js

/**
 * Frequency Analysis
 * Analisis frekuensi karakter untuk cryptanalysis
 */

/**
 * Hitung frekuensi setiap karakter
 */
export const calculateFrequency = (text) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const frequency = {};
  const total = cleanText.length;

  // Initialize all letters with 0
  for (let i = 65; i <= 90; i++) {
    frequency[String.fromCharCode(i)] = 0;
  }

  // Count occurrences
  for (const char of cleanText) {
    frequency[char]++;
  }

  // Convert to percentage and create array
  const frequencyArray = Object.entries(frequency).map(([letter, count]) => ({
    letter,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
    frequency: total > 0 ? count / total : 0
  }));

  return {
    frequency: frequencyArray,
    total,
    uniqueChars: frequencyArray.filter(f => f.count > 0).length
  };
};

/**
 * Frekuensi bahasa Inggris (standar)
 */
export const ENGLISH_FREQUENCY = {
  E: 12.70, T: 9.06, A: 8.17, O: 7.51, I: 6.97,
  N: 6.75, S: 6.33, H: 6.09, R: 5.99, D: 4.25,
  L: 4.03, C: 2.78, U: 2.76, M: 2.41, W: 2.36,
  F: 2.23, G: 2.02, Y: 1.97, P: 1.93, B: 1.29,
  V: 0.98, K: 0.77, J: 0.15, X: 0.15, Q: 0.10, Z: 0.07
};

/**
 * Get expected frequency untuk bahasa Inggris
 */
export const getExpectedFrequency = () => {
  return Object.entries(ENGLISH_FREQUENCY).map(([letter, percentage]) => ({
    letter,
    percentage,
    frequency: percentage / 100
  }));
};

/**
 * Compare dengan frekuensi bahasa Inggris
 */
export const compareWithEnglish = (text) => {
  const actual = calculateFrequency(text);
  const expected = getExpectedFrequency();

  const comparison = actual.frequency.map(({ letter, percentage }) => {
    const expectedData = expected.find(e => e.letter === letter);
    const expectedPercentage = expectedData ? expectedData.percentage : 0;
    
    return {
      letter,
      actual: percentage,
      expected: expectedPercentage,
      difference: Math.abs(percentage - expectedPercentage),
      ratio: expectedPercentage > 0 ? percentage / expectedPercentage : 0
    };
  });

  return {
    comparison,
    chiSquared: calculateChiSquared(actual.frequency, expected),
    indexOfCoincidence: calculateIndexOfCoincidence(text)
  };
};

/**
 * Calculate Chi-Squared statistic
 */
export const calculateChiSquared = (observed, expected) => {
  let chiSquared = 0;

  for (const obs of observed) {
    const exp = expected.find(e => e.letter === obs.letter);
    if (exp && exp.frequency > 0) {
      const diff = obs.frequency - exp.frequency;
      chiSquared += (diff * diff) / exp.frequency;
    }
  }

  return chiSquared;
};

/**
 * Calculate Index of Coincidence (IC)
 * IC menunjukkan apakah text adalah monoalphabetic atau polyalphabetic
 */
export const calculateIndexOfCoincidence = (text) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const n = cleanText.length;
  
  if (n <= 1) return 0;

  const frequency = {};
  
  // Count frequencies
  for (const char of cleanText) {
    frequency[char] = (frequency[char] || 0) + 1;
  }

  // Calculate IC: sum of fi(fi-1) / n(n-1)
  let sum = 0;
  for (const count of Object.values(frequency)) {
    sum += count * (count - 1);
  }

  const ic = sum / (n * (n - 1));

  return {
    value: ic,
    normalized: ic * 26, // Normalized to alphabet size
    interpretation: getICInterpretation(ic)
  };
};

/**
 * Interpretasi Index of Coincidence
 */
const getICInterpretation = (ic) => {
  if (ic >= 0.06) {
    return {
      type: 'Monoalphabetic',
      confidence: 'High',
      description: 'Text likely encrypted with monoalphabetic cipher (Caesar, substitution)'
    };
  } else if (ic >= 0.045) {
    return {
      type: 'Mixed',
      confidence: 'Medium',
      description: 'Text may be polyalphabetic with short key or plaintext'
    };
  } else {
    return {
      type: 'Polyalphabetic',
      confidence: 'High',
      description: 'Text likely encrypted with polyalphabetic cipher (Vigenère, etc.)'
    };
  }
};

/**
 * Find most common n-grams
 */
export const findNGrams = (text, n = 2, topK = 10) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
  const ngrams = {};

  // Generate n-grams
  for (let i = 0; i <= cleanText.length - n; i++) {
    const ngram = cleanText.substring(i, i + n);
    ngrams[ngram] = (ngrams[ngram] || 0) + 1;
  }

  // Sort by frequency
  const sorted = Object.entries(ngrams)
    .map(([ngram, count]) => ({
      ngram,
      count,
      percentage: (count / (cleanText.length - n + 1)) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topK);

  return sorted;
};

/**
 * Analyze digraphs (2-grams)
 */
export const analyzeDigraphs = (text) => {
  return findNGrams(text, 2, 20);
};

/**
 * Analyze trigraphs (3-grams)
 */
export const analyzeTrigraphs = (text) => {
  return findNGrams(text, 3, 15);
};

/**
 * Get complete frequency analysis report
 */
export const getFrequencyReport = (text) => {
  const basicFreq = calculateFrequency(text);
  const comparison = compareWithEnglish(text);
  const digraphs = analyzeDigraphs(text);
  const trigraphs = analyzeTrigraphs(text);
  const ic = calculateIndexOfCoincidence(text);

  return {
    basic: basicFreq,
    comparison,
    digraphs,
    trigraphs,
    indexOfCoincidence: ic,
    summary: {
      totalChars: basicFreq.total,
      uniqueChars: basicFreq.uniqueChars,
      mostCommon: basicFreq.frequency
        .filter(f => f.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      leastCommon: basicFreq.frequency
        .filter(f => f.count > 0)
        .sort((a, b) => a.count - b.count)
        .slice(0, 5)
    }
  };
};