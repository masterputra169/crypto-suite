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

    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      return sendError(res, 400, 'Username atau email sudah terdaftar');
    }

    const hashedPassword = await hashPassword(password);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, full_name || username]
    );

    await pool.query(
      'INSERT INTO user_statistics (user_id) VALUES (?)',
      [result.insertId]
    );

    const [users] = await pool.query(
      'SELECT id, username, email, full_name, avatar_url, bio, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];

    sendWelcomeEmail(email, username).catch(err => 
      console.error('Welcome email failed:', err)
    );

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

    if (!email || !password) {
      return sendError(res, 400, 'Email dan password harus diisi');
    }

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return sendError(res, 401, 'Email atau password salah');
    }

    const user = users[0];

    if (!user.is_active) {
      return sendError(res, 401, 'Akun tidak aktif');
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Email atau password salah');
    }

    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

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

    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return sendError(res, 404, 'User tidak ditemukan');
    }

    const isPasswordValid = await verifyPassword(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Password saat ini salah');
    }

    const hashedPassword = await hashPassword(newPassword);

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
 * 
 * ✅ DEVELOPMENT MODE: Print link ke console jika email gagal
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.query(
      'SELECT id, username, email FROM users WHERE email = ?',
      [email]
    );

    // Security: Always return success
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

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

    const clientUrl = process.env.CLIENT_URL || 'http://cryptosuite.online';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    // ✅ TRY to send email, but ALWAYS show link in console
    try {
      await sendPasswordResetEmail(email, resetToken);
      console.log('✅ Password reset email sent successfully');
    } catch (emailError) {
      console.log('⚠️  Email failed, but continuing with console link...');
    }

    // ✅ ALWAYS log reset link (development safety)
    console.log('\n' + '='.repeat(70));
    console.log('🔑 PASSWORD RESET REQUEST');
    console.log('='.repeat(70));
    console.log(`📧 Email:        ${email}`);
    console.log(`👤 Username:     ${user.username}`);
    console.log(`🔗 Reset Link:   ${resetUrl}`);
    console.log(`⏰ Expires:      ${expiresAt.toLocaleString()}`);
    console.log('='.repeat(70));
    console.log('Copy the link above and paste it in your browser');
    console.log('='.repeat(70) + '\n');

    res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent. Check server console for the link.',
      // ✅ DEVELOPMENT ONLY: Include link in response
      ...(process.env.NODE_ENV === 'development' && {
        dev_reset_url: resetUrl,
        dev_note: 'This field only appears in development mode'
      })
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

    // ✅ ENHANCED LOGGING
    console.log('\n' + '='.repeat(70));
    console.log('🔑 PASSWORD RESET ATTEMPT');
    console.log('='.repeat(70));
    console.log('📥 Received token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    console.log('📥 Token length:', token ? token.length : 0);
    console.log('📥 Password provided:', newPassword ? 'YES' : 'NO');

    if (!token || !newPassword) {
      console.log('❌ Missing required fields');
      console.log('='.repeat(70) + '\n');
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password
    if (newPassword.length < 8) {
      console.log('❌ Password too short');
      console.log('='.repeat(70) + '\n');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash the token from URL to match database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    console.log('🔐 Hashed token:', hashedToken.substring(0, 20) + '...');
    console.log('🔍 Searching database...');

    // First, check if ANY reset tokens exist
    const [allTokens] = await pool.query(
      'SELECT user_id, token, expires_at FROM password_resets'
    );
    console.log(`📊 Total tokens in database: ${allTokens.length}`);

    if (allTokens.length > 0) {
      console.log('📋 Database tokens:');
      allTokens.forEach((t, idx) => {
        console.log(`   ${idx + 1}. User ${t.user_id}: ${t.token.substring(0, 20)}... (expires: ${t.expires_at})`);
        console.log(`      Match: ${t.token === hashedToken ? '✅ YES' : '❌ NO'}`);
        console.log(`      Expired: ${new Date(t.expires_at) < new Date() ? '⚠️  YES' : '✅ NO'}`);
      });
    }

    // Find valid reset token (not expired)
    const [resets] = await pool.query(
      `SELECT pr.user_id, pr.token, pr.expires_at, pr.created_at, u.email, u.username
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.token = ?`,
      [hashedToken]
    );

    console.log(`🔍 Matching tokens found: ${resets.length}`);

    if (resets.length === 0) {
      console.log('❌ Token not found in database');
      console.log('💡 Possible reasons:');
      console.log('   1. Token was already used and deleted');
      console.log('   2. Token is incorrect (copy-paste error)');
      console.log('   3. Database was cleared');
      console.log('='.repeat(70) + '\n');
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token. Please request a new password reset link.'
      });
    }

    const reset = resets[0];
    const now = new Date();
    const expiresAt = new Date(reset.expires_at);
    const isExpired = expiresAt < now;

    console.log('✅ Token found in database');
    console.log(`   User: ${reset.email} (${reset.username})`);
    console.log(`   Created: ${reset.created_at}`);
    console.log(`   Expires: ${reset.expires_at}`);
    console.log(`   Now: ${now.toISOString()}`);
    console.log(`   Status: ${isExpired ? '⚠️  EXPIRED' : '✅ VALID'}`);

    if (isExpired) {
      console.log('❌ Token has expired');
      console.log('='.repeat(70) + '\n');
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired. Please request a new password reset link.'
      });
    }

    console.log('🔄 Updating password...');

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, reset.user_id]
    );

    console.log('✅ Password updated in database');

    // Delete used token
    await pool.query(
      'DELETE FROM password_resets WHERE user_id = ?',
      [reset.user_id]
    );

    console.log('🗑️  Used token deleted');
    console.log(`✅ Password reset successful for: ${reset.email} (${reset.username})`);
    console.log('='.repeat(70) + '\n');

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    console.log('='.repeat(70) + '\n');
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