// src/middlewares/authMiddleware.js

const { verifyToken } = require('../utils/tokenHelper');
const { sendUnauthorized } = require('../utils/responseHelper');
const { pool } = require('../config/database');

/**
 * Protect routes - require authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Check if token exists
  if (!token) {
    return sendUnauthorized(res, 'Akses ditolak. Harap login terlebih dahulu.');
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, avatar_url, bio, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return sendUnauthorized(res, 'User tidak ditemukan');
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return sendUnauthorized(res, 'Akun tidak aktif');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return sendUnauthorized(res, 'Token tidak valid atau sudah expired');
  }
};

/**
 * Optional authentication - doesn't require login but attaches user if logged in
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const [users] = await pool.query(
        'SELECT id, username, email, full_name, avatar_url, bio FROM users WHERE id = ? AND is_active = true',
        [decoded.id]
      );

      if (users.length > 0) {
        req.user = users[0];
      }
    } catch (error) {
      // Token invalid, but continue without user
    }
  }

  next();
};

module.exports = {
  protect,
  optionalAuth
};