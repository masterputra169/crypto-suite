// src/utils/passwordHelper.js

const bcrypt = require('bcryptjs');

/**
 * Hash password menggunakan bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Verify password dengan hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password dari database
 * @returns {Promise<boolean>} True jika cocok
 */
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Validasi kekuatan password
 * @param {string} password - Password untuk divalidasi
 * @returns {Object} Result dengan valid dan errors
 */
const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf kapital');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung angka');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password harus mengandung karakter spesial');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = {
  hashPassword,
  verifyPassword,
  validatePasswordStrength
};