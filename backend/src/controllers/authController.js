// src/controllers/authController.js

const crypto = require('crypto');
const { pool } = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/passwordHelper');
const { sendTokenResponse } = require('../utils/tokenHelper');
const { sendError, sendSuccess } = require('../utils/responseHelper');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/emailService');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return sendError(res, 400, 'Username atau email sudah terdaftar');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name || username]
    );

    // Initialize user statistics
    await pool.query(
      'INSERT INTO user_statistics (user_id) VALUES (?)',
      [result.insertId]
    );

    // Get created user
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, avatar_url, bio, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(email, username).catch(err => 
      console.error('Welcome email failed:', err)
    );

    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat registrasi');
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return sendError(res, 400, 'Email dan password harus diisi');
    }

    // Get user from database
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return sendError(res, 401, 'Email atau password salah');
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return sendError(res, 401, 'Akun tidak aktif');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Email atau password salah');
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat login');
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  sendSuccess(res, 200, 'Logout berhasil');
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, avatar_url, bio, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return sendError(res, 404, 'User tidak ditemukan');
    }

    sendSuccess(res, 200, 'User data retrieved', users[0]);
  } catch (error) {
    console.error('Get me error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mengambil data user');
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { full_name, bio, avatar_url } = req.body;
    const userId = req.user.id;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (full_name !== undefined) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }
    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      values.push(avatar_url);
    }

    if (updates.length === 0) {
      return sendError(res, 400, 'Tidak ada data yang diupdate');
    }

    values.push(userId);

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user
    const [users] = await pool.query(
      'SELECT id, username, email, full_name, avatar_url, bio, created_at FROM users WHERE id = ?',
      [userId]
    );

    sendSuccess(res, 200, 'Profile berhasil diupdate', users[0]);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat update profile');
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return sendError(res, 404, 'User tidak ditemukan');
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Password saat ini salah');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    sendSuccess(res, 200, 'Password berhasil diubah');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 500, 'Terjadi kesalahan saat mengubah password');
  }
};

/**
 * @desc    Forgot password - Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const [users] = await pool.query(
      'SELECT id, username, email FROM users WHERE email = ?',
      [email]
    );

    // Security: Always return success (prevent email enumeration attacks)
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent'
      });
    }

    const user = users[0];

    // Generate reset token (32 random bytes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before storing (security best practice)
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiration (1 hour from now)
    const expiresAt = new Date(Date.now() + 3600000);

    // Store in database
    await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       token = VALUES(token), 
       expires_at = VALUES(expires_at), 
       created_at = CURRENT_TIMESTAMP`,
      [user.id, hashedToken, expiresAt]
    );

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('✅ Password reset email sent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError);
      // Fallback: Log reset link to console for development
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      console.log('='.repeat(60));
      console.log('🔑 PASSWORD RESET LINK (Email failed, use this):');
      console.log('='.repeat(60));
      console.log(`User: ${user.username} (${email})`);
      console.log(`Reset Link: ${clientUrl}/reset-password?token=${resetToken}`);
      console.log(`Expires: ${expiresAt.toLocaleString()}`);
      console.log('='.repeat(60));
    }

    res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request'
    });
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Hash the token from URL to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find valid reset token (not expired)
    const [resets] = await pool.query(
      `SELECT pr.user_id, pr.expires_at, u.email, u.username
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.token = ? AND pr.expires_at > NOW()`,
      [hashedToken]
    );

    if (resets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const reset = resets[0];

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, reset.user_id]
    );

    // Delete used reset token
    await pool.query(
      'DELETE FROM password_resets WHERE user_id = ?',
      [reset.user_id]
    );

    console.log(`✅ Password reset successful for: ${reset.email} (${reset.username})`);

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};