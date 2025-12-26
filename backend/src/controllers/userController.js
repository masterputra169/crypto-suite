// src/controllers/userController.js

const { pool } = require('../config/database');
const { sendError, sendSuccess, sendNotFound } = require('../utils/responseHelper');

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/:username
 * @access  Public
 */
const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const [users] = await pool.query(
      `SELECT 
        u.id, u.username, u.email, u.full_name, u.avatar_url, u.bio, u.created_at,
        us.total_encryptions, us.total_decryptions, us.total_time_spent, 
        us.favorite_cipher, us.streak_days, us.last_activity
      FROM users u
      LEFT JOIN user_statistics us ON u.id = us.user_id
      WHERE u.username = ? AND u.is_active = true`,
      [username]
    );

    if (users.length === 0) {
      return sendNotFound(res, 'User tidak ditemukan');
    }

    // Remove email if not own profile
    const user = users[0];
    if (!req.user || req.user.id !== user.id) {
      delete user.email;
    }

    sendSuccess(res, 200, 'User profile retrieved', user);
  } catch (error) {
    console.error('Get user profile error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mengambil profile user');
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/:username/statistics
 * @access  Public
 */
const getUserStatistics = async (req, res) => {
  try {
    const { username } = req.params;

    // Get user ID from username
    const [users] = await pool.query(
      'SELECT id FROM users WHERE username = ? AND is_active = true',
      [username]
    );

    if (users.length === 0) {
      return sendNotFound(res, 'User tidak ditemukan');
    }

    const userId = users[0].id;

    // Get overall statistics
    const [stats] = await pool.query(
      `SELECT 
        total_encryptions, total_decryptions, total_time_spent,
        favorite_cipher, streak_days, last_activity
      FROM user_statistics
      WHERE user_id = ?`,
      [userId]
    );

    // Get progress by cipher type
    const [progress] = await pool.query(
      `SELECT 
        cipher_type, 
        COUNT(*) as attempts,
        AVG(success_rate) as avg_success_rate,
        SUM(time_spent) as total_time,
        MAX(completed_at) as last_attempt
      FROM user_progress
      WHERE user_id = ?
      GROUP BY cipher_type
      ORDER BY last_attempt DESC`,
      [userId]
    );

    sendSuccess(res, 200, 'User statistics retrieved', {
      overall: stats[0] || {},
      progress: progress || []
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mengambil statistik user');
  }
};

/**
 * @desc    Get user progress
 * @route   GET /api/users/me/progress
 * @access  Private
 */
const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [progress] = await pool.query(
      `SELECT 
        id, cipher_type, completed_at, time_spent, attempts, success_rate
      FROM user_progress
      WHERE user_id = ?
      ORDER BY completed_at DESC
      LIMIT 50`,
      [userId]
    );

    sendSuccess(res, 200, 'User progress retrieved', progress);
  } catch (error) {
    console.error('Get user progress error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mengambil progress');
  }
};

/**
 * @desc    Add user progress entry
 * @route   POST /api/users/me/progress
 * @access  Private
 */
const addUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cipher_type, time_spent, success_rate } = req.body;

    // Validate required fields
    if (!cipher_type) {
      return sendError(res, 400, 'Cipher type harus diisi');
    }

    // Insert progress entry
    await pool.query(
      `INSERT INTO user_progress (user_id, cipher_type, time_spent, attempts, success_rate)
       VALUES (?, ?, ?, 1, ?)`,
      [userId, cipher_type, time_spent || 0, success_rate || 0]
    );

    // Update user statistics
    await pool.query(
      `UPDATE user_statistics 
       SET total_encryptions = total_encryptions + 1,
           total_time_spent = total_time_spent + ?,
           last_activity = NOW()
       WHERE user_id = ?`,
      [time_spent || 0, userId]
    );

    sendSuccess(res, 201, 'Progress berhasil disimpan');
  } catch (error) {
    console.error('Add user progress error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat menyimpan progress');
  }
};

/**
 * @desc    Get user leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, orderBy = 'total_encryptions' } = req.query;

    // Validate orderBy parameter
    const validOrderBy = ['total_encryptions', 'total_decryptions', 'total_time_spent', 'streak_days'];
    const orderByColumn = validOrderBy.includes(orderBy) ? orderBy : 'total_encryptions';

    const [leaderboard] = await pool.query(
      `SELECT 
        u.username, u.full_name, u.avatar_url,
        us.total_encryptions, us.total_decryptions, 
        us.total_time_spent, us.favorite_cipher, us.streak_days
      FROM users u
      INNER JOIN user_statistics us ON u.id = us.user_id
      WHERE u.is_active = true
      ORDER BY us.${orderByColumn} DESC
      LIMIT ?`,
      [parseInt(limit)]
    );

    sendSuccess(res, 200, 'Leaderboard retrieved', leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mengambil leaderboard');
  }
};

/**
 * @desc    Update user statistics
 * @route   PUT /api/users/me/statistics
 * @access  Private
 */
const updateUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      total_encryptions, 
      total_decryptions, 
      total_time_spent,
      favorite_cipher,
      streak_days 
    } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (total_encryptions !== undefined) {
      updates.push('total_encryptions = total_encryptions + ?');
      values.push(total_encryptions);
    }
    if (total_decryptions !== undefined) {
      updates.push('total_decryptions = total_decryptions + ?');
      values.push(total_decryptions);
    }
    if (total_time_spent !== undefined) {
      updates.push('total_time_spent = total_time_spent + ?');
      values.push(total_time_spent);
    }
    if (favorite_cipher !== undefined) {
      updates.push('favorite_cipher = ?');
      values.push(favorite_cipher);
    }
    if (streak_days !== undefined) {
      updates.push('streak_days = ?');
      values.push(streak_days);
    }

    if (updates.length === 0) {
      return sendError(res, 400, 'Tidak ada data yang diupdate');
    }

    updates.push('last_activity = NOW()');
    values.push(userId);

    await pool.query(
      `UPDATE user_statistics SET ${updates.join(', ')} WHERE user_id = ?`,
      values
    );

    // Get updated statistics
    const [stats] = await pool.query(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [userId]
    );

    sendSuccess(res, 200, 'Statistik berhasil diupdate', stats[0]);
  } catch (error) {
    console.error('Update user statistics error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat update statistik');
  }
};

/**
 * @desc    Search users
 * @route   GET /api/users/search
 * @access  Public
 */
const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return sendError(res, 400, 'Query pencarian minimal 2 karakter');
    }

    const searchTerm = `%${q}%`;

    const [users] = await pool.query(
      `SELECT 
        u.id, u.username, u.full_name, u.avatar_url, u.bio,
        us.total_encryptions, us.favorite_cipher
      FROM users u
      LEFT JOIN user_statistics us ON u.id = us.user_id
      WHERE u.is_active = true 
        AND (u.username LIKE ? OR u.full_name LIKE ?)
      LIMIT ?`,
      [searchTerm, searchTerm, parseInt(limit)]
    );

    sendSuccess(res, 200, 'Search results', users);
  } catch (error) {
    console.error('Search users error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mencari user');
  }
};

module.exports = {
  getUserProfile,
  getUserStatistics,
  getUserProgress,
  addUserProgress,
  getLeaderboard,
  updateUserStatistics,
  searchUsers
};