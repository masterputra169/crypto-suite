// src/constants/colors.js

/**
 * Color Constants and Theme Configuration
 * Centralized color definitions untuk consistency
 */

// Primary Color Palette
export const PRIMARY_COLORS = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
};

// Secondary Color Palette
export const SECONDARY_COLORS = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
};

// Success Color Palette
export const SUCCESS_COLORS = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
};

// Warning Color Palette
export const WARNING_COLORS = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
};

// Danger/Error Color Palette
export const DANGER_COLORS = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
};

// Info Color Palette
export const INFO_COLORS = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

// Gray Scale
export const GRAY_COLORS = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

// Semantic Colors
export const SEMANTIC_COLORS = {
  success: SUCCESS_COLORS[600],
  warning: WARNING_COLORS[500],
  danger: DANGER_COLORS[600],
  info: INFO_COLORS[600],
  primary: PRIMARY_COLORS[600],
  secondary: SECONDARY_COLORS[600],
};

// Cipher Category Colors
export const CIPHER_CATEGORY_COLORS = {
  substitution: {
    light: PRIMARY_COLORS[500],
    dark: PRIMARY_COLORS[400],
    bg: PRIMARY_COLORS[50],
    bgDark: PRIMARY_COLORS[900],
    border: PRIMARY_COLORS[300],
    borderDark: PRIMARY_COLORS[700],
  },
  polygram: {
    light: SECONDARY_COLORS[600],
    dark: SECONDARY_COLORS[400],
    bg: SECONDARY_COLORS[50],
    bgDark: SECONDARY_COLORS[900],
    border: SECONDARY_COLORS[300],
    borderDark: SECONDARY_COLORS[700],
  },
  transposition: {
    light: SUCCESS_COLORS[600],
    dark: SUCCESS_COLORS[400],
    bg: SUCCESS_COLORS[50],
    bgDark: SUCCESS_COLORS[900],
    border: SUCCESS_COLORS[300],
    borderDark: SUCCESS_COLORS[700],
  },
};

// Difficulty Level Colors
export const DIFFICULTY_COLORS = {
  easy: {
    text: SUCCESS_COLORS[700],
    textDark: SUCCESS_COLORS[300],
    bg: SUCCESS_COLORS[100],
    bgDark: SUCCESS_COLORS[900],
    border: SUCCESS_COLORS[300],
    borderDark: SUCCESS_COLORS[700],
  },
  medium: {
    text: WARNING_COLORS[700],
    textDark: WARNING_COLORS[300],
    bg: WARNING_COLORS[100],
    bgDark: WARNING_COLORS[900],
    border: WARNING_COLORS[300],
    borderDark: WARNING_COLORS[700],
  },
  hard: {
    text: DANGER_COLORS[700],
    textDark: DANGER_COLORS[300],
    bg: DANGER_COLORS[100],
    bgDark: DANGER_COLORS[900],
    border: DANGER_COLORS[300],
    borderDark: DANGER_COLORS[700],
  },
};

// Security Level Colors
export const SECURITY_COLORS = {
  low: {
    text: DANGER_COLORS[700],
    bg: DANGER_COLORS[100],
    border: DANGER_COLORS[300],
  },
  medium: {
    text: WARNING_COLORS[700],
    bg: WARNING_COLORS[100],
    border: WARNING_COLORS[300],
  },
  high: {
    text: SUCCESS_COLORS[700],
    bg: SUCCESS_COLORS[100],
    border: SUCCESS_COLORS[300],
  },
};

// Chart Colors
export const CHART_COLORS = [
  PRIMARY_COLORS[600],    // Blue
  SECONDARY_COLORS[600],  // Purple
  SUCCESS_COLORS[600],    // Green
  WARNING_COLORS[500],    // Orange
  DANGER_COLORS[600],     // Red
  INFO_COLORS[600],       // Light Blue
  '#ec4899',              // Pink
  '#8b5cf6',              // Violet
  '#06b6d4',              // Cyan
  '#84cc16',              // Lime
];

// Gradient Presets
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${PRIMARY_COLORS[500]} 0%, ${PRIMARY_COLORS[700]} 100%)`,
  secondary: `linear-gradient(135deg, ${SECONDARY_COLORS[500]} 0%, ${SECONDARY_COLORS[700]} 100%)`,
  success: `linear-gradient(135deg, ${SUCCESS_COLORS[500]} 0%, ${SUCCESS_COLORS[700]} 100%)`,
  warning: `linear-gradient(135deg, ${WARNING_COLORS[400]} 0%, ${WARNING_COLORS[600]} 100%)`,
  danger: `linear-gradient(135deg, ${DANGER_COLORS[500]} 0%, ${DANGER_COLORS[700]} 100%)`,
  
  // Multi-color gradients
  rainbow: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ocean: `linear-gradient(135deg, ${PRIMARY_COLORS[400]} 0%, ${PRIMARY_COLORS[700]} 100%)`,
  sunset: `linear-gradient(135deg, ${WARNING_COLORS[400]} 0%, ${DANGER_COLORS[500]} 100%)`,
  forest: `linear-gradient(135deg, ${SUCCESS_COLORS[400]} 0%, ${SUCCESS_COLORS[700]} 100%)`,
  purple: `linear-gradient(135deg, ${SECONDARY_COLORS[400]} 0%, ${SECONDARY_COLORS[700]} 100%)`,
  
  // Subtle gradients
  softBlue: `linear-gradient(135deg, ${PRIMARY_COLORS[50]} 0%, ${PRIMARY_COLORS[100]} 100%)`,
  softPurple: `linear-gradient(135deg, ${SECONDARY_COLORS[50]} 0%, ${SECONDARY_COLORS[100]} 100%)`,
  softGreen: `linear-gradient(135deg, ${SUCCESS_COLORS[50]} 0%, ${SUCCESS_COLORS[100]} 100%)`,
};

// Background Colors
export const BACKGROUND_COLORS = {
  light: {
    primary: '#ffffff',
    secondary: GRAY_COLORS[50],
    tertiary: GRAY_COLORS[100],
  },
  dark: {
    primary: GRAY_COLORS[900],
    secondary: GRAY_COLORS[800],
    tertiary: GRAY_COLORS[700],
  },
};

// Text Colors
export const TEXT_COLORS = {
  light: {
    primary: GRAY_COLORS[900],
    secondary: GRAY_COLORS[700],
    tertiary: GRAY_COLORS[500],
    disabled: GRAY_COLORS[400],
  },
  dark: {
    primary: GRAY_COLORS[50],
    secondary: GRAY_COLORS[300],
    tertiary: GRAY_COLORS[400],
    disabled: GRAY_COLORS[600],
  },
};

// Border Colors
export const BORDER_COLORS = {
  light: {
    primary: GRAY_COLORS[200],
    secondary: GRAY_COLORS[300],
    focus: PRIMARY_COLORS[500],
  },
  dark: {
    primary: GRAY_COLORS[700],
    secondary: GRAY_COLORS[600],
    focus: PRIMARY_COLORS[400],
  },
};

// Shadow Colors
export const SHADOW_COLORS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// Status Colors
export const STATUS_COLORS = {
  online: SUCCESS_COLORS[500],
  offline: GRAY_COLORS[400],
  busy: DANGER_COLORS[500],
  away: WARNING_COLORS[500],
};

// Badge Variant Colors
export const BADGE_COLORS = {
  primary: {
    bg: PRIMARY_COLORS[100],
    text: PRIMARY_COLORS[800],
    bgDark: PRIMARY_COLORS[900],
    textDark: PRIMARY_COLORS[200],
  },
  secondary: {
    bg: SECONDARY_COLORS[100],
    text: SECONDARY_COLORS[800],
    bgDark: SECONDARY_COLORS[900],
    textDark: SECONDARY_COLORS[200],
  },
  success: {
    bg: SUCCESS_COLORS[100],
    text: SUCCESS_COLORS[800],
    bgDark: SUCCESS_COLORS[900],
    textDark: SUCCESS_COLORS[200],
  },
  warning: {
    bg: WARNING_COLORS[100],
    text: WARNING_COLORS[800],
    bgDark: WARNING_COLORS[900],
    textDark: WARNING_COLORS[200],
  },
  danger: {
    bg: DANGER_COLORS[100],
    text: DANGER_COLORS[800],
    bgDark: DANGER_COLORS[900],
    textDark: DANGER_COLORS[200],
  },
  info: {
    bg: INFO_COLORS[100],
    text: INFO_COLORS[800],
    bgDark: INFO_COLORS[900],
    textDark: INFO_COLORS[200],
  },
  gray: {
    bg: GRAY_COLORS[100],
    text: GRAY_COLORS[800],
    bgDark: GRAY_COLORS[700],
    textDark: GRAY_COLORS[200],
  },
};

// Utility Functions
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const getColorWithOpacity = (color, opacity) => {
  const rgb = hexToRgb(color);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : color;
};

// Get color by variant
export const getColorByVariant = (variant, shade = 600) => {
  const colorMap = {
    primary: PRIMARY_COLORS,
    secondary: SECONDARY_COLORS,
    success: SUCCESS_COLORS,
    warning: WARNING_COLORS,
    danger: DANGER_COLORS,
    info: INFO_COLORS,
    gray: GRAY_COLORS,
  };
  
  return colorMap[variant]?.[shade] || GRAY_COLORS[shade];
};

// Get color by category
export const getCategoryColor = (category, theme = 'light') => {
  return CIPHER_CATEGORY_COLORS[category]?.[theme] || PRIMARY_COLORS[500];
};

// Get difficulty color
export const getDifficultyColor = (difficulty) => {
  return DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.medium;
};

// Get security color
export const getSecurityColor = (security) => {
  return SECURITY_COLORS[security] || SECURITY_COLORS.medium;
};

// Export default
export default {
  PRIMARY_COLORS,
  SECONDARY_COLORS,
  SUCCESS_COLORS,
  WARNING_COLORS,
  DANGER_COLORS,
  INFO_COLORS,
  GRAY_COLORS,
  SEMANTIC_COLORS,
  CIPHER_CATEGORY_COLORS,
  DIFFICULTY_COLORS,
  SECURITY_COLORS,
  CHART_COLORS,
  GRADIENTS,
  BACKGROUND_COLORS,
  TEXT_COLORS,
  BORDER_COLORS,
  SHADOW_COLORS,
  STATUS_COLORS,
  BADGE_COLORS,
  hexToRgb,
  rgbToHex,
  getColorWithOpacity,
  getColorByVariant,
  getCategoryColor,
  getDifficultyColor,
  getSecurityColor,
};