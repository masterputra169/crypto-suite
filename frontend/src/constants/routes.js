// src/constants/routes.js

/**
 * Application Routes Constants
 * Centralized route definitions for navigation
 */

// Base Routes
export const BASE_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ABOUT: '/about',
  DOCS: '/docs',
  SETTINGS: '/settings',
  HELP: '/help',
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

// Substitution Cipher Routes
export const SUBSTITUTION_ROUTES = {
  CAESAR: '/caesar',
  VIGENERE: '/vigenere',
  BEAUFORT: '/beaufort',
  AUTOKEY: '/autokey',
};

// Polygram Cipher Routes
export const POLYGRAM_ROUTES = {
  PLAYFAIR: '/playfair',
  HILL: '/hill',
};

// Transposition Cipher Routes
export const TRANSPOSITION_ROUTES = {
  RAIL_FENCE: '/railfence',
  COLUMNAR: '/columnar',
  MYSZKOWSKI: '/myszkowski',
  DOUBLE: '/double',
};

// All Cipher Routes
export const CIPHER_ROUTES = {
  ...SUBSTITUTION_ROUTES,
  ...POLYGRAM_ROUTES,
  ...TRANSPOSITION_ROUTES,
};

// All Routes Combined
export const ROUTES = {
  ...BASE_ROUTES,
  ...CIPHER_ROUTES,
};

// Route Groups for Navigation
export const ROUTE_GROUPS = [
  {
    title: 'Main',
    icon: 'Home',
    routes: [
      { path: BASE_ROUTES.HOME, label: 'Home', icon: 'Home' },
      { path: BASE_ROUTES.DASHBOARD, label: 'Dashboard', icon: 'BarChart3', badge: 'New' },
    ],
  },
  {
    title: 'Substitution Ciphers',
    icon: 'Lock',
    category: 'substitution',
    routes: [
      { path: SUBSTITUTION_ROUTES.CAESAR, label: 'Caesar', description: 'Shift cipher' },
      { path: SUBSTITUTION_ROUTES.VIGENERE, label: 'Vigenère', description: 'Polyalphabetic' },
      { path: SUBSTITUTION_ROUTES.BEAUFORT, label: 'Beaufort', description: 'Reversed Vigenère' },
      { path: SUBSTITUTION_ROUTES.AUTOKEY, label: 'Autokey', description: 'Self-extending key' },
    ],
  },
  {
    title: 'Polygram Ciphers',
    icon: 'Grid3x3',
    category: 'polygram',
    routes: [
      { path: POLYGRAM_ROUTES.PLAYFAIR, label: 'Playfair', description: '5×5 grid' },
      { path: POLYGRAM_ROUTES.HILL, label: 'Hill', description: 'Matrix cipher' },
    ],
  },
  {
    title: 'Transposition Ciphers',
    icon: 'Shuffle',
    category: 'transposition',
    routes: [
      { path: TRANSPOSITION_ROUTES.RAIL_FENCE, label: 'Rail Fence', description: 'Zigzag pattern' },
      { path: TRANSPOSITION_ROUTES.COLUMNAR, label: 'Columnar', description: 'Column rearrangement' },
      { path: TRANSPOSITION_ROUTES.MYSZKOWSKI, label: 'Myszkowski', description: 'Grouped columns' },
      { path: TRANSPOSITION_ROUTES.DOUBLE, label: 'Double', description: 'Two-pass transposition' },
    ],
  },
];

// Breadcrumb mappings
export const BREADCRUMB_NAMES = {
  [BASE_ROUTES.HOME]: 'Home',
  [BASE_ROUTES.DASHBOARD]: 'Dashboard',
  [BASE_ROUTES.ABOUT]: 'About',
  [BASE_ROUTES.DOCS]: 'Documentation',
  [BASE_ROUTES.SETTINGS]: 'Settings',
  [BASE_ROUTES.HELP]: 'Help',
  
  [SUBSTITUTION_ROUTES.CAESAR]: 'Caesar Cipher',
  [SUBSTITUTION_ROUTES.VIGENERE]: 'Vigenère Cipher',
  [SUBSTITUTION_ROUTES.BEAUFORT]: 'Beaufort Cipher',
  [SUBSTITUTION_ROUTES.AUTOKEY]: 'Autokey Cipher',
  
  [POLYGRAM_ROUTES.PLAYFAIR]: 'Playfair Cipher',
  [POLYGRAM_ROUTES.HILL]: 'Hill Cipher',
  
  [TRANSPOSITION_ROUTES.RAIL_FENCE]: 'Rail Fence Cipher',
  [TRANSPOSITION_ROUTES.COLUMNAR]: 'Columnar Transposition',
  [TRANSPOSITION_ROUTES.MYSZKOWSKI]: 'Myszkowski Transposition',
  [TRANSPOSITION_ROUTES.DOUBLE]: 'Double Transposition',
};

// Get route name
export const getRouteName = (path) => {
  return BREADCRUMB_NAMES[path] || 'Unknown';
};

// Check if route is cipher page
export const isCipherRoute = (path) => {
  return Object.values(CIPHER_ROUTES).includes(path);
};

// Get cipher category from route
export const getCipherCategory = (path) => {
  if (Object.values(SUBSTITUTION_ROUTES).includes(path)) return 'substitution';
  if (Object.values(POLYGRAM_ROUTES).includes(path)) return 'polygram';
  if (Object.values(TRANSPOSITION_ROUTES).includes(path)) return 'transposition';
  return null;
};

// Navigation structure for sidebar
export const NAVIGATION_STRUCTURE = {
  main: [
    {
      name: 'Home',
      path: BASE_ROUTES.HOME,
      icon: 'Home',
      exact: true,
    },
    {
      name: 'Dashboard',
      path: BASE_ROUTES.DASHBOARD,
      icon: 'BarChart3',
      badge: 'New',
    },
  ],
  ciphers: [
    {
      category: 'Substitution Ciphers',
      icon: 'Lock',
      items: [
        { name: 'Caesar', path: SUBSTITUTION_ROUTES.CAESAR },
        { name: 'Vigenère', path: SUBSTITUTION_ROUTES.VIGENERE },
        { name: 'Beaufort', path: SUBSTITUTION_ROUTES.BEAUFORT },
        { name: 'Autokey', path: SUBSTITUTION_ROUTES.AUTOKEY },
      ],
    },
    {
      category: 'Polygram Ciphers',
      icon: 'Grid3x3',
      items: [
        { name: 'Playfair', path: POLYGRAM_ROUTES.PLAYFAIR },
        { name: 'Hill', path: POLYGRAM_ROUTES.HILL },
      ],
    },
    {
      category: 'Transposition Ciphers',
      icon: 'Shuffle',
      items: [
        { name: 'Rail Fence', path: TRANSPOSITION_ROUTES.RAIL_FENCE },
        { name: 'Columnar', path: TRANSPOSITION_ROUTES.COLUMNAR },
        { name: 'Myszkowski', path: TRANSPOSITION_ROUTES.MYSZKOWSKI },
        { name: 'Double', path: TRANSPOSITION_ROUTES.DOUBLE },
      ],
    },
  ],
  settings: [
    {
      name: 'Settings',
      path: BASE_ROUTES.SETTINGS,
      icon: 'Settings',
    },
    {
      name: 'Help',
      path: BASE_ROUTES.HELP,
      icon: 'HelpCircle',
    },
  ],
};

// External links
export const EXTERNAL_LINKS = {
  GITHUB: 'https://github.com/yourusername/crypto-suite',
  DOCS: 'https://docs.cryptosuite.com',
  WIKI: 'https://en.wikipedia.org/wiki/Classical_cipher',
  SUPPORT: 'mailto:support@cryptosuite.com',
};

// Meta information for routes
export const ROUTE_META = {
  [BASE_ROUTES.HOME]: {
    title: 'Home - Crypto Suite',
    description: 'Classical cryptography learning platform',
  },
  [BASE_ROUTES.DASHBOARD]: {
    title: 'Dashboard - Crypto Suite',
    description: 'Performance analytics and statistics',
  },
  [SUBSTITUTION_ROUTES.CAESAR]: {
    title: 'Caesar Cipher - Crypto Suite',
    description: 'Simple shift cipher encryption and decryption',
  },
  [SUBSTITUTION_ROUTES.VIGENERE]: {
    title: 'Vigenère Cipher - Crypto Suite',
    description: 'Polyalphabetic substitution cipher',
  },
  // Add more as needed
};

// Quick actions for different routes
export const ROUTE_ACTIONS = {
  [BASE_ROUTES.DASHBOARD]: [
    { label: 'Export Stats', action: 'export', icon: 'Download' },
    { label: 'Clear Data', action: 'clear', icon: 'Trash2' },
  ],
  cipher: [
    { label: 'Save Config', action: 'save', icon: 'Save' },
    { label: 'Share', action: 'share', icon: 'Share2' },
    { label: 'Export Result', action: 'export', icon: 'Download' },
    { label: 'Reset', action: 'reset', icon: 'RotateCcw' },
  ],
};

// Route permissions (for future use)
export const ROUTE_PERMISSIONS = {
  public: Object.values(BASE_ROUTES),
  authenticated: [], // Add routes that require authentication
  admin: [], // Add admin-only routes
};

export default {
  ROUTES,
  BASE_ROUTES,
  CIPHER_ROUTES,
  SUBSTITUTION_ROUTES,
  POLYGRAM_ROUTES,
  TRANSPOSITION_ROUTES,
  ROUTE_GROUPS,
  BREADCRUMB_NAMES,
  NAVIGATION_STRUCTURE,
  EXTERNAL_LINKS,
  ROUTE_META,
  ROUTE_ACTIONS,
  ROUTE_PERMISSIONS,
  getRouteName,
  isCipherRoute,
  getCipherCategory,
};