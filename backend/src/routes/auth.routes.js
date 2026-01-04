// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../config/database');
const { protect } = require('../middlewares/authMiddleware');

// ... existing routes (register, login, logout, me, profile, password)

// ==================== FORGOT PASSWORD ====================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const [users] = await pool.query(
      'SELECT id, username, email FROM users WHERE email = ?',
      [email]
    );

    // Security: Always return success (prevent email enumeration)
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If that email exists, a reset link has been sent'
      });
    }

    const user = users[0];

    // Generate reset token (32 random bytes)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token before storing
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

    // Log reset link (for development - remove in production)
    console.log('='.repeat(60));
    console.log('🔑 PASSWORD RESET REQUESTED');
    console.log('='.repeat(60));
    console.log(`Email: ${email}`);
    console.log(`Reset Token: ${resetToken}`);
    console.log(`Reset Link: http://cryptosuite.online/reset-password?token=${resetToken}`);
    console.log(`Expires At: ${expiresAt.toLocaleString()}`);
    console.log('='.repeat(60));

    // TODO: Send email in production
    // await sendResetEmail(email, resetToken);

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
});

// ==================== RESET PASSWORD ====================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find valid reset token
    const [resets] = await pool.query(
      `SELECT pr.user_id, pr.expires_at, u.email 
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

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

    console.log(`✅ Password reset successful for: ${reset.email}`);

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
});

module.exports = router;