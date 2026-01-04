// src/config/database.js

const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration with fallback for local development
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crypto_suite',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10 seconds
  // ✅ FIX: Railway MySQL uses self-signed certificates
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false  // ← UBAH DARI true KE false
  } : undefined
};

const pool = mysql.createPool(dbConfig);

// Test connection with retry logic
const testConnection = async (retries = 5) => {  // ← Tambah retry jadi 5
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ MySQL Database connected successfully');
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Host: ${dbConfig.host}`);
      console.log(`💾 Database: ${dbConfig.database}`);
      connection.release();
      return true;
    } catch (error) {
      console.error(`❌ MySQL connection attempt ${i + 1}/${retries} failed:`, error.message);
      
      // ✅ Enhanced error logging
      if (error.code) {
        console.error(`   Error code: ${error.code}`);
      }
      if (error.errno) {
        console.error(`   Error errno: ${error.errno}`);
      }
      
      if (i === retries - 1) {
        console.error('🔴 All connection attempts failed.');
        console.error('\n📋 Debug Information:');
        console.error('   DB_HOST:', process.env.DB_HOST || 'NOT SET');
        console.error('   DB_USER:', process.env.DB_USER || 'NOT SET');
        console.error('   DB_NAME:', process.env.DB_NAME || 'NOT SET');
        console.error('   DB_PORT:', process.env.DB_PORT || 'NOT SET');
        console.error('   DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET (hidden)' : 'NOT SET');
        console.error('   NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
        process.exit(1);
      }
      // Wait 3 seconds before retry (Railway MySQL might be starting)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
};

// Create tables if not exist
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('🔄 Initializing database tables...');
    
    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        avatar_url VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT true,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Users table ready');

    // User progress table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        cipher_type VARCHAR(50) NOT NULL,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        time_spent INT DEFAULT 0,
        attempts INT DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0.00,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_cipher (user_id, cipher_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ User progress table ready');

    // User statistics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_statistics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        total_encryptions INT DEFAULT 0,
        total_decryptions INT DEFAULT 0,
        total_time_spent INT DEFAULT 0,
        favorite_cipher VARCHAR(50),
        streak_days INT DEFAULT 0,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_stats (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ User statistics table ready');

    // Cipher operations history table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cipher_operations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        cipher_type VARCHAR(50) NOT NULL,
        operation VARCHAR(20) NOT NULL,
        input_text TEXT,
        output_text TEXT,
        key_used VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_user_operations (user_id, created_at),
        INDEX idx_cipher_type (cipher_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Cipher operations table ready');

    // ✅ TAMBAHAN: Cipher history table (for export)
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
    console.log('✅ Cipher history table ready');

    // ✅ TAMBAHAN: Password resets table
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
    `);
    console.log('✅ Password resets table ready');

    console.log('🎉 Database tables initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing pool:', error.message);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

module.exports = { 
  pool, 
  testConnection, 
  initDatabase,
  closePool 
};