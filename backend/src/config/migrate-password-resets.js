// backend/src/config/migrate-password-resets.js
// Run: node backend/src/config/migrate-password-resets.js

const mysql = require('mysql2/promise');
const path = require('path');

// ✅ Load .env dari backend folder (2 levels up)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function migratePasswordResets() {
  let connection;

  try {
    console.log('🔄 Starting password_resets table migration...');
    
    // ✅ Debug: Show loaded env vars
    console.log('📍 Using database config:');
    console.log('   Host:', process.env.DB_HOST || 'NOT SET');
    console.log('   User:', process.env.DB_USER || 'NOT SET');
    console.log('   Database:', process.env.DB_NAME || 'NOT SET');
    console.log('   Port:', process.env.DB_PORT || 'NOT SET');

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database');

    // Create password_resets table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        
        INDEX idx_token (token),
        INDEX idx_user_id (user_id),
        INDEX idx_expires_at (expires_at),
        
        UNIQUE KEY unique_user_reset (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      COMMENT='Password reset tokens for forgot password functionality'
    `);

    console.log('✅ password_resets table created');

    // Optional: Create cleanup event for expired tokens
    try {
      await connection.query(`DROP EVENT IF EXISTS cleanup_expired_tokens`);
      await connection.query(`
        CREATE EVENT cleanup_expired_tokens
        ON SCHEDULE EVERY 1 DAY
        DO
          DELETE FROM password_resets WHERE expires_at < NOW()
      `);
      console.log('✅ Cleanup event created (runs daily)');
    } catch (err) {
      console.log('⚠️  Event creation skipped (requires EVENT privilege)');
    }

    // Verify table exists
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'password_resets'
    `, [process.env.DB_NAME]);

    if (tables.length > 0) {
      console.log('\n✅ Table verified: password_resets');
      
      // Show structure
      const [columns] = await connection.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'password_resets'
        ORDER BY ORDINAL_POSITION
      `, [process.env.DB_NAME]);

      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`  ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.COLUMN_KEY ? `[${col.COLUMN_KEY}]` : ''}`);
      });
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Database connection closed');
    }
  }
}

// Run migration
migratePasswordResets();