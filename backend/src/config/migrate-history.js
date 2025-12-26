// src/config/migrate-history.js
// Run: node src/config/migrate-history.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateDatabase() {
  let connection;

  try {
    console.log('🔄 Starting database migration...');

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database');

    // Create cipher_history table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cipher_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        cipher_type VARCHAR(50) NOT NULL,
        operation ENUM('encrypt', 'decrypt') NOT NULL,
        
        input_text TEXT NOT NULL,
        output_text TEXT NOT NULL,
        key_data JSON NOT NULL COMMENT 'Stores shift, key, matrix, etc.',
        
        time_spent INT DEFAULT 1 COMMENT 'Time spent in seconds',
        input_length INT DEFAULT 0,
        output_length INT DEFAULT 0,
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        
        INDEX idx_user_cipher (user_id, cipher_type),
        INDEX idx_operation (operation),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ cipher_history table created');

    // Add comment to table
    await connection.query(`
      ALTER TABLE cipher_history 
      COMMENT = 'Detailed history of cipher operations for export functionality'
    `);

    console.log('✅ Table comment added');

    // Verify tables exist
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN ('users', 'user_statistics', 'user_progress', 'cipher_history')
    `, [process.env.DB_NAME]);

    console.log('\n📊 Current tables:');
    tables.forEach(table => {
      console.log(`  ✓ ${table.TABLE_NAME}`);
    });

    // Check cipher_history structure
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'cipher_history'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME]);

    console.log('\n📋 cipher_history structure:');
    columns.forEach(col => {
      console.log(`  ${col.COLUMN_NAME} (${col.DATA_TYPE}) - Nullable: ${col.IS_NULLABLE}`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n👋 Database connection closed');
    }
  }
}

// Run migration
migrateDatabase();