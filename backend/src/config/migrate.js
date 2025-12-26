// src/config/migrate.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Database Migration Script
 * Run this to create database and tables
 */

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Starting database migration...');
    console.log(`📍 Connecting to MySQL at ${config.host}:${config.port}`);
    
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../../database/schema.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 Executing SQL migration...');
    
    // Execute SQL statements
    await connection.query(sqlContent);
    
    console.log('✅ Database migration completed successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log('');
    console.log('📋 Created tables:');
    console.log('   - users');
    console.log('   - user_statistics');
    console.log('   - user_progress');
    console.log('');
    console.log('🎉 Migration finished! You can now start the server.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Make sure MySQL is running');
    console.error('2. Check your .env file configuration');
    console.error('3. Verify MySQL credentials');
    console.error('4. Ensure you have permission to create databases');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migration
runMigration();