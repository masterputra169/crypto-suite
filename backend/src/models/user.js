// src/models/User.js

/**
 * User Model Documentation
 * 
 * This is a documentation file for the User entity.
 * The actual database operations are handled through direct SQL queries
 * using the mysql2 connection pool.
 */

/**
 * User Schema
 * 
 * Table: users
 * 
 * @property {number} id - Auto-increment primary key
 * @property {string} username - Unique username (3-50 chars, alphanumeric + underscore)
 * @property {string} email - Unique email address
 * @property {string} password - Bcrypt hashed password
 * @property {string} full_name - User's full name (max 100 chars)
 * @property {string} avatar_url - URL to user's avatar image
 * @property {string} bio - User biography (max 500 chars)
 * @property {Date} created_at - Account creation timestamp
 * @property {Date} updated_at - Last update timestamp
 * @property {Date} last_login - Last login timestamp
 * @property {boolean} is_active - Account active status
 */

/**
 * User Statistics Schema
 * 
 * Table: user_statistics
 * 
 * @property {number} id - Auto-increment primary key
 * @property {number} user_id - Foreign key to users table
 * @property {number} total_encryptions - Total encryption operations
 * @property {number} total_decryptions - Total decryption operations
 * @property {number} total_time_spent - Total time spent in seconds
 * @property {string} favorite_cipher - User's most used cipher
 * @property {number} streak_days - Current streak in days
 * @property {Date} last_activity - Last activity timestamp
 */

/**
 * User Progress Schema
 * 
 * Table: user_progress
 * 
 * @property {number} id - Auto-increment primary key
 * @property {number} user_id - Foreign key to users table
 * @property {string} cipher_type - Type of cipher practiced
 * @property {Date} completed_at - Completion timestamp
 * @property {number} time_spent - Time spent on this attempt (seconds)
 * @property {number} attempts - Number of attempts
 * @property {number} success_rate - Success rate percentage (0-100)
 */

/**
 * Example User Object (response format)
 */
const userExample = {
  id: 1,
  username: 'johndoe',
  email: 'john@example.com',
  full_name: 'John Doe',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Cryptography enthusiast',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  last_login: '2024-01-01T00:00:00.000Z',
  is_active: true
};

/**
 * Example Statistics Object
 */
const statisticsExample = {
  id: 1,
  user_id: 1,
  total_encryptions: 150,
  total_decryptions: 120,
  total_time_spent: 3600, // seconds
  favorite_cipher: 'Caesar',
  streak_days: 7,
  last_activity: '2024-01-01T00:00:00.000Z'
};

/**
 * Example Progress Object
 */
const progressExample = {
  id: 1,
  user_id: 1,
  cipher_type: 'Caesar',
  completed_at: '2024-01-01T00:00:00.000Z',
  time_spent: 120, // seconds
  attempts: 3,
  success_rate: 85.5
};

module.exports = {
  userExample,
  statisticsExample,
  progressExample
};