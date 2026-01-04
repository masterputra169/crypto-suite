// src/config/environment.js

require('dotenv').config();

/**
 * Environment Configuration
 * Centralized configuration for all environment variables
 */
const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'crypto_suite_db',
    port: parseInt(process.env.DB_PORT) || 3306,
    connectionLimit: 10,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
    cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CLIENT_URL || 'https://cryptosuite.online',
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Upload Configuration (for future use)
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },

  // Email Configuration (for future features like password reset)
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@cryptosuite.com',
  },

  // Security
  security: {
    bcryptRounds: 10,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
  const requiredVars = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);

  if (missing.length > 0 && config.server.isProduction) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1);
  }

  if (config.server.isProduction && config.jwt.secret === 'your-secret-key-change-in-production') {
    console.error('❌ Please change JWT_SECRET in production!');
    process.exit(1);
  }
};

// Validate on load
validateConfig();

module.exports = config;