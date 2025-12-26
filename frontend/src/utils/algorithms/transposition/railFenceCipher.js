// src/utils/algorithms/transposition/railFenceCipher.js

import PropTypes from 'prop-types';

/**
 * Rail Fence Cipher Algorithm
 * Writes message in zigzag pattern across multiple rails, then reads row by row
 * Implements: Encryption, Decryption, Pattern Generation, Visualization, Analysis
 */

// ==================== PROP TYPES DEFINITIONS ====================

/**
 * PropTypes for Rail Pattern Position
 */
export const RailPositionPropTypes = PropTypes.shape({
  position: PropTypes.number.isRequired,
  rail: PropTypes.number.isRequired,
  char: PropTypes.string.isRequired,
});

/**
 * PropTypes for Reading Order
 */
export const ReadingOrderPropTypes = PropTypes.shape({
  rail: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  char: PropTypes.string.isRequired,
});

/**
 * PropTypes for Visualization Data
 */
export const RailFenceVisualizationPropTypes = PropTypes.shape({
  grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  pattern: PropTypes.arrayOf(RailPositionPropTypes).isRequired,
  readingOrder: PropTypes.arrayOf(ReadingOrderPropTypes).isRequired,
  rails: PropTypes.number.isRequired,
  encrypted: PropTypes.string.isRequired,
});

/**
 * PropTypes for Analysis Result
 */
export const AnalysisResultPropTypes = PropTypes.shape({
  textLength: PropTypes.number.isRequired,
  possibleRails: PropTypes.arrayOf(PropTypes.shape({
    rails: PropTypes.number.isRequired,
    avgRailLength: PropTypes.number.isRequired,
    confidence: PropTypes.string.isRequired,
  })).isRequired,
  mostLikely: PropTypes.number.isRequired,
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Prepare text - remove non-alphabetic characters and convert to uppercase
 */
const prepareText = (text) => {
  if (typeof text !== 'string') {
    throw new Error('prepareText: text must be a string');
  }
  return text.toUpperCase().replace(/[^A-Z]/g, '');
};

/**
 * Validate number of rails
 */
const validateRails = (rails, textLength) => {
  if (typeof rails !== 'number' || !Number.isInteger(rails)) {
    throw new Error('Rails must be an integer');
  }
  if (rails < 2) {
    throw new Error('Rails must be at least 2');
  }
  if (rails >= textLength) {
    throw new Error('Rails must be less than text length');
  }
  return true;
};

// ==================== MAIN FUNCTIONS ====================

/**
 * Encrypt plaintext using Rail Fence cipher
 * @param {string} plaintext - Text to encrypt
 * @param {number} rails - Number of rails
 * @returns {string} - Encrypted ciphertext
 */
export const railFenceEncrypt = (plaintext, rails) => {
  // Validate inputs
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('railFenceEncrypt: plaintext must be a non-empty string');
  }
  if (typeof rails !== 'number') {
    throw new Error('railFenceEncrypt: rails must be a number');
  }
  
  try {
    const text = prepareText(plaintext);
    
    if (text.length === 0) {
      throw new Error('railFenceEncrypt: plaintext contains no alphabetic characters');
    }
    
    validateRails(rails, text.length);
    
    // Create rail arrays
    const fence = Array(rails).fill(null).map(() => []);
    let rail = 0;
    let direction = 1; // 1 for down, -1 for up
    
    // Place characters on rails in zigzag pattern
    for (let i = 0; i < text.length; i++) {
      fence[rail].push(text[i]);
      
      // Change direction at boundaries
      if (rail === 0) {
        direction = 1;
      } else if (rail === rails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    // Read fence row by row
    return fence.map(row => row.join('')).join('');
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt ciphertext using Rail Fence cipher
 * @param {string} ciphertext - Text to decrypt
 * @param {number} rails - Number of rails
 * @returns {string} - Decrypted plaintext
 */
export const railFenceDecrypt = (ciphertext, rails) => {
  // Validate inputs
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('railFenceDecrypt: ciphertext must be a non-empty string');
  }
  if (typeof rails !== 'number') {
    throw new Error('railFenceDecrypt: rails must be a number');
  }
  
  try {
    const text = prepareText(ciphertext);
    
    if (text.length === 0) {
      throw new Error('railFenceDecrypt: ciphertext contains no alphabetic characters');
    }
    
    validateRails(rails, text.length);
    
    // Calculate characters per rail by marking positions
    const fence = Array(rails).fill(null).map(() => []);
    let rail = 0;
    let direction = 1;
    
    // Mark positions with placeholder
    for (let i = 0; i < text.length; i++) {
      fence[rail].push('*');
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === rails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    // Fill fence with actual characters row by row
    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < fence[r].length; c++) {
        fence[r][c] = text[index++];
      }
    }
    
    // Read fence in zigzag pattern
    let result = '';
    rail = 0;
    direction = 1;
    
    for (let i = 0; i < text.length; i++) {
      result += fence[rail].shift();
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === rails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    return result;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

/**
 * Generate rail fence pattern for visualization
 * @param {string} text - Text to visualize
 * @param {number} rails - Number of rails
 * @returns {Array} - Pattern array with position info
 */
export const generateRailPattern = (text, rails) => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('generateRailPattern: text must be a non-empty string');
  }
  if (typeof rails !== 'number') {
    throw new Error('generateRailPattern: rails must be a number');
  }
  
  const cleanText = prepareText(text);
  
  if (cleanText.length === 0) {
    return null;
  }
  
  validateRails(rails, cleanText.length);
  
  const pattern = [];
  let rail = 0;
  let direction = 1;
  
  for (let i = 0; i < cleanText.length; i++) {
    pattern.push({
      position: i,
      rail: rail,
      char: cleanText[i],
    });
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  return pattern;
};

/**
 * Get visualization data for Rail Fence cipher
 * @param {string} plaintext - Original text
 * @param {number} rails - Number of rails
 * @returns {Object} - Visualization data
 */
export const getRailFenceVisualization = (plaintext, rails) => {
  if (typeof plaintext !== 'string' || !plaintext.trim()) {
    throw new Error('getRailFenceVisualization: plaintext must be a non-empty string');
  }
  if (typeof rails !== 'number') {
    throw new Error('getRailFenceVisualization: rails must be a number');
  }
  
  try {
    const text = prepareText(plaintext);
    
    if (text.length === 0) {
      return null;
    }
    
    validateRails(rails, text.length);
    
    // Create visualization grid
    const grid = Array(rails).fill(null).map(() => Array(text.length).fill(''));
    let rail = 0;
    let direction = 1;
    
    const pattern = [];
    
    for (let i = 0; i < text.length; i++) {
      grid[rail][i] = text[i];
      pattern.push({ position: i, rail, char: text[i] });
      
      if (rail === 0) {
        direction = 1;
      } else if (rail === rails - 1) {
        direction = -1;
      }
      
      rail += direction;
    }
    
    // Get reading order (row by row)
    const readingOrder = [];
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (grid[r][c] !== '') {
          readingOrder.push({
            rail: r,
            position: c,
            char: grid[r][c],
          });
        }
      }
    }
    
    return {
      grid,
      pattern,
      readingOrder,
      rails,
      encrypted: railFenceEncrypt(plaintext, rails),
      plaintext: text,
    };
  } catch (error) {
    throw new Error(`Visualization generation failed: ${error.message}`);
  }
};

/**
 * Analyze rail fence ciphertext
 * @param {string} ciphertext - Encrypted text
 * @returns {Object} - Analysis results
 */
export const analyzeRailFence = (ciphertext) => {
  if (typeof ciphertext !== 'string' || !ciphertext.trim()) {
    throw new Error('analyzeRailFence: ciphertext must be a non-empty string');
  }
  
  const text = prepareText(ciphertext);
  
  if (text.length < 6) {
    return {
      textLength: text.length,
      error: 'Text too short for meaningful analysis (minimum 6 characters)',
    };
  }
  
  const textLength = text.length;
  
  // Calculate possible rail counts
  const possibleRails = [];
  
  for (let r = 2; r <= Math.min(textLength - 1, 20); r++) {
    // Calculate average characters per rail
    const avgRailLength = textLength / r;
    
    // Calculate confidence based on how evenly distributed the text would be
    let confidence;
    if (avgRailLength >= 3 && avgRailLength <= 10) {
      confidence = 'High';
    } else if (avgRailLength >= 2 && avgRailLength <= 15) {
      confidence = 'Medium';
    } else {
      confidence = 'Low';
    }
    
    possibleRails.push({
      rails: r,
      avgRailLength: parseFloat(avgRailLength.toFixed(2)),
      confidence,
      score: calculateRailScore(r, textLength),
    });
  }
  
  // Sort by score
  possibleRails.sort((a, b) => b.score - a.score);
  
  return {
    textLength,
    possibleRails: possibleRails.slice(0, 15),
    mostLikely: possibleRails[0].rails,
    note: 'Rail count between 3-7 is most common for manual encryption',
  };
};

/**
 * Calculate rail score for analysis
 */
const calculateRailScore = (rails, textLength) => {
  const avgLength = textLength / rails;
  
  // Ideal average length is 4-8 characters per rail
  let score = 0;
  
  if (avgLength >= 4 && avgLength <= 8) {
    score = 100;
  } else if (avgLength >= 3 && avgLength <= 10) {
    score = 80;
  } else if (avgLength >= 2 && avgLength <= 12) {
    score = 60;
  } else {
    score = 40;
  }
  
  // Prefer common rail counts (3, 4, 5)
  if (rails >= 3 && rails <= 5) {
    score += 20;
  } else if (rails >= 6 && rails <= 8) {
    score += 10;
  }
  
  return score;
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Validate rail fence parameters
 */
export const validateRailFenceParams = (text, rails) => {
  const errors = [];
  
  if (!text || typeof text !== 'string') {
    errors.push('Text must be a non-empty string');
  }
  
  if (typeof rails !== 'number') {
    errors.push('Rails must be a number');
  } else if (!Number.isInteger(rails)) {
    errors.push('Rails must be an integer');
  } else if (rails < 2) {
    errors.push('Rails must be at least 2');
  }
  
  const cleanText = text ? prepareText(text) : '';
  if (cleanText.length === 0) {
    errors.push('Text must contain at least one alphabetic character');
  }
  
  if (rails && cleanText.length && rails >= cleanText.length) {
    errors.push('Rails must be less than text length');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate zigzag cycle length
 * @param {number} rails - Number of rails
 * @returns {number} - Cycle length
 */
export const calculateCycleLength = (rails) => {
  if (rails < 2) return 0;
  return 2 * (rails - 1);
};

/**
 * Get characters per rail
 * @param {string} text - Text
 * @param {number} rails - Number of rails
 * @returns {Array<number>} - Character count per rail
 */
export const getCharsPerRail = (text, rails) => {
  const cleanText = prepareText(text);
  validateRails(rails, cleanText.length);
  
  const counts = Array(rails).fill(0);
  let rail = 0;
  let direction = 1;
  
  for (let i = 0; i < cleanText.length; i++) {
    counts[rail]++;
    
    if (rail === 0) {
      direction = 1;
    } else if (rail === rails - 1) {
      direction = -1;
    }
    
    rail += direction;
  }
  
  return counts;
};

/**
 * Format grid for display
 */
export const formatGrid = (grid) => {
  if (!Array.isArray(grid) || grid.length === 0) {
    return '';
  }
  
  return grid.map(row => 
    row.map(cell => cell || '·').join(' ')
  ).join('\n');
};

/**
 * Calculate efficiency for rail fence
 */
export const calculateEfficiency = (text, rails) => {
  const cleanText = prepareText(text);
  validateRails(rails, cleanText.length);
  
  const charsPerRail = getCharsPerRail(cleanText, rails);
  const maxChars = Math.max(...charsPerRail);
  const minChars = Math.min(...charsPerRail);
  const avgChars = cleanText.length / rails;
  
  return {
    totalChars: cleanText.length,
    rails,
    charsPerRail,
    maxChars,
    minChars,
    avgChars: parseFloat(avgChars.toFixed(2)),
    balance: parseFloat(((1 - (maxChars - minChars) / maxChars) * 100).toFixed(2)),
  };
};

// ==================== EXPORTS ====================

export default {
  railFenceEncrypt,
  railFenceDecrypt,
  getRailFenceVisualization,
  generateRailPattern,
  analyzeRailFence,
  validateRailFenceParams,
  calculateCycleLength,
  getCharsPerRail,
  formatGrid,
  calculateEfficiency,
  
  // PropTypes exports
  RailPositionPropTypes,
  ReadingOrderPropTypes,
  RailFenceVisualizationPropTypes,
  AnalysisResultPropTypes,
};