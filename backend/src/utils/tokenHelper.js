// src/utils/tokenHelper.js

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - Data untuk disimpan dalam token
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Create token response dengan cookie options
 * @param {Object} user - User data
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Generate token
  const token = generateToken({ 
    id: user.id, 
    username: user.username,
    email: user.email 
  });

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from user object
  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    created_at: user.created_at
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userResponse
    });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse
};