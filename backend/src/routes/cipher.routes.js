// src/routes/cipher.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { pool } = require('../config/database');

// Record cipher operation WITH FULL HISTORY
router.post('/record', protect, async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const userId = req.user.id;
    const { 
      cipher_type, 
      operation,
      input_text,
      output_text,
      key_data, // Object: {shift: 3} or {key: "SECRET"} etc
      time_spent
    } = req.body;

    // Validate required fields
    if (!cipher_type || !operation || !input_text || !output_text || !key_data) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cipher_type, operation, input_text, output_text, key_data'
      });
    }

    const timeInSeconds = Math.max(1, Math.round(time_spent || 1));
    const inputLength = input_text.length;
    const outputLength = output_text.length;

    console.log(`📊 Recording: ${cipher_type} - ${operation} - ${timeInSeconds}s`);

    // 1. Insert into cipher_history (NEW TABLE)
    await connection.query(
      `INSERT INTO cipher_history 
       (user_id, cipher_type, operation, input_text, output_text, key_data, time_spent, input_length, output_length)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        cipher_type,
        operation,
        input_text,
        output_text,
        JSON.stringify(key_data), // Store as JSON
        timeInSeconds,
        inputLength,
        outputLength
      ]
    );

    // 2. Update user_statistics
    const [existing] = await connection.query(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      const current = existing[0];
      const newTotalEncryptions = operation === 'encrypt' 
        ? current.total_encryptions + 1 
        : current.total_encryptions;
      const newTotalDecryptions = operation === 'decrypt' 
        ? current.total_decryptions + 1 
        : current.total_decryptions;
      const newTimeSpent = current.total_time_spent + timeInSeconds;

      await connection.query(
        `UPDATE user_statistics 
         SET total_encryptions = ?, 
             total_decryptions = ?, 
             total_time_spent = ?,
             last_activity = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [newTotalEncryptions, newTotalDecryptions, newTimeSpent, userId]
      );
    } else {
      await connection.query(
        `INSERT INTO user_statistics 
         (user_id, total_encryptions, total_decryptions, total_time_spent, favorite_cipher) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          operation === 'encrypt' ? 1 : 0,
          operation === 'decrypt' ? 1 : 0,
          timeInSeconds,
          cipher_type
        ]
      );
    }

    // 3. Update user_progress
    const [existingProgress] = await connection.query(
      'SELECT * FROM user_progress WHERE user_id = ? AND cipher_type = ?',
      [userId, cipher_type]
    );

    if (existingProgress.length > 0) {
      const current = existingProgress[0];
      const newAttempts = current.attempts + 1;
      const newTimeSpent = current.time_spent + timeInSeconds;
      
      await connection.query(
        `UPDATE user_progress 
         SET attempts = ?, 
             time_spent = ?,
             completed_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND cipher_type = ?`,
        [newAttempts, newTimeSpent, userId, cipher_type]
      );
    } else {
      await connection.query(
        `INSERT INTO user_progress 
         (user_id, cipher_type, attempts, time_spent, success_rate) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, cipher_type, 1, timeInSeconds, 100.00]
      );
    }

    // 4. Update favorite cipher - BASED ON MOST ATTEMPTS
const [cipherCounts] = await connection.query(
  `SELECT cipher_type, attempts 
FROM user_progress 
WHERE user_id = ? 
ORDER BY attempts DESC 
LIMIT 1`,
  [userId]
);

if (cipherCounts.length > 0) {
  await connection.query(
    'UPDATE user_statistics SET favorite_cipher = ? WHERE user_id = ?',
    [cipherCounts[0].cipher_type, userId]
  );
}


    await connection.commit();

    res.json({
      success: true,
      message: 'Cipher operation recorded successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error recording cipher operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record cipher operation',
      error: error.message
    });
  } finally {
    connection.release();
  }
});

// Get user statistics
router.get('/statistics', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const [stats] = await pool.query(
      'SELECT * FROM user_statistics WHERE user_id = ?',
      [userId]
    );

    const [progress] = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = ? ORDER BY attempts DESC',
      [userId]
    );

    res.json({
      success: true,
      data: {
        overall: stats[0] || {
          total_encryptions: 0,
          total_decryptions: 0,
          total_time_spent: 0,
          favorite_cipher: null
        },
        ciphers: progress
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Get cipher history (for export)
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 100, cipher_type, operation } = req.query;

    let query = `
      SELECT 
        id,
        cipher_type,
        operation,
        input_text,
        output_text,
        key_data,
        time_spent,
        input_length,
        output_length,
        created_at
      FROM cipher_history 
      WHERE user_id = ?
    `;
    const params = [userId];

    // Optional filters
    if (cipher_type) {
      query += ' AND cipher_type = ?';
      params.push(cipher_type);
    }

    if (operation) {
      query += ' AND operation = ?';
      params.push(operation);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [history] = await pool.query(query, params);

    // MySQL automatically parses JSON columns, no need for JSON.parse()
    res.json({
      success: true,
      data: history,
      count: history.length
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      error: error.message
    });
  }
});

// Delete history entry
router.delete('/history/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query(
      'DELETE FROM cipher_history WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found'
      });
    }

    res.json({
      success: true,
      message: 'History entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete history',
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const [leaderboard] = await pool.query(
      `SELECT 
        u.username,
        u.full_name,
        u.avatar_url,
        us.total_encryptions,
        us.total_decryptions,
        (us.total_encryptions + us.total_decryptions) as total_operations,
        us.favorite_cipher
       FROM user_statistics us
       JOIN users u ON us.user_id = u.id
       ORDER BY total_operations DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: leaderboard
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

module.exports = router;