// ==================== server.js ====================
// ✅ PENTING: Load .env PALING ATAS sebelum import apapun
require('dotenv').config();

const app = require('./src/app');
const { testConnection, initDatabase, closePool } = require('./src/config/database');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// ✅ Enhanced startup logging
const logStartup = () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 CRYPTO SUITE BACKEND - STARTING');
  console.log('='.repeat(60));
  console.log('📝 Environment:', NODE_ENV);
  console.log('🔌 Port:', PORT);
  console.log('🌐 Client URL:', process.env.CLIENT_URL || 'http://localhost:5173');
  
  // Database info (safe for production)
  console.log('\n💾 Database Configuration:');
  console.log('   Host:', process.env.DB_HOST ? 
    (IS_PRODUCTION ? '✅ SET (hidden)' : process.env.DB_HOST) : '❌ NOT SET');
  console.log('   Database:', process.env.DB_NAME || '❌ NOT SET');
  console.log('   User:', process.env.DB_USER ? '✅ SET' : '❌ NOT SET');
  console.log('   Password:', process.env.DB_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('   Port:', process.env.DB_PORT || 3306);

  // Email configuration
  console.log('\n📧 Email Configuration:');
  console.log('   Host:', process.env.EMAIL_HOST || '❌ NOT SET');
  console.log('   Port:', process.env.EMAIL_PORT || '❌ NOT SET');
  console.log('   User:', process.env.EMAIL_USER || '❌ NOT SET');
  console.log('   Password:', process.env.EMAIL_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('   From:', process.env.EMAIL_FROM || '❌ NOT SET');

  // JWT configuration
  console.log('\n🔐 JWT Configuration:');
  console.log('   Secret:', process.env.JWT_SECRET ? '✅ SET (hidden)' : '❌ NOT SET');
  console.log('   Expire:', process.env.JWT_EXPIRE || '7d');

  // Warnings
  const warnings = [];
  
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    warnings.push('⚠️  Database configuration incomplete!');
  }
  
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    warnings.push('⚠️  Email configuration incomplete - Password reset will not work!');
  }

  if (!process.env.JWT_SECRET) {
    warnings.push('⚠️  JWT_SECRET not set - Using default (INSECURE!)');
  }

  if (warnings.length > 0) {
    console.log('\n' + '⚠️ '.repeat(30));
    warnings.forEach(warning => console.log(warning));
    console.log('⚠️ '.repeat(30));
  }

  console.log('='.repeat(60) + '\n');
};

// ✅ Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  console.log(`\n👋 ${signal} received. Shutting down gracefully...`);
  
  try {
    // Close database connections
    await closePool();
    console.log('✅ Database connections closed');
    
    // Give server time to finish ongoing requests
    setTimeout(() => {
      console.log('✅ Server shutdown complete');
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  }
};

// ✅ Main server startup
const startServer = async () => {
  try {
    // Log startup info
    logStartup();
    
    console.log('🔄 Testing database connection...');
    
    // Test database connection with retry
    await testConnection();
    console.log('✅ Database connected successfully');
    
    console.log('🔄 Initializing database tables...');
    
    // Initialize database tables
    const dbInitSuccess = await initDatabase();
    
    if (!dbInitSuccess) {
      throw new Error('Database initialization failed');
    }
    
    console.log('✅ Database tables initialized');
    
    console.log('\n🔄 Starting HTTP server...');
    
    // Start listening
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ SERVER IS READY!');
      console.log('='.repeat(60));
      
      if (IS_PRODUCTION) {
        console.log(`🚀 Server running on port: ${PORT}`);
        console.log(`🏥 Health check: /health`);
        console.log(`📚 API Base URL: /api`);
      } else {
        console.log(`🚀 Server running on: http://localhost:${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
      }
      
      console.log('='.repeat(60) + '\n');
      
      if (!IS_PRODUCTION) {
        console.log('💡 Development mode - Press Ctrl+C to stop the server\n');
      }
    });

    // Set server timeout for long-running requests
    server.timeout = 30000; // 30 seconds

    // Setup graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Close database pool if it was opened
    try {
      await closePool();
    } catch (closeError) {
      console.error('Error closing database pool:', closeError.message);
    }
    
    process.exit(1);
  }
};

// ✅ Handle unhandled promise rejections
process.on('unhandledRejection', async (err, promise) => {
  console.error('\n❌ Unhandled Promise Rejection!');
  console.error('Error:', err.message);
  console.error('Promise:', promise);
  
  if (!IS_PRODUCTION) {
    console.error('Stack:', err.stack);
  }
  
  console.error('\nShutting down gracefully...');
  
  try {
    await closePool();
  } catch (closeError) {
    console.error('Error closing pool:', closeError.message);
  }
  
  process.exit(1);
});

// ✅ Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('\n❌ Uncaught Exception!');
  console.error('Error:', err.message);
  
  if (!IS_PRODUCTION) {
    console.error('Stack:', err.stack);
  }
  
  console.error('\nShutting down immediately...');
  
  try {
    await closePool();
  } catch (closeError) {
    console.error('Error closing pool:', closeError.message);
  }
  
  process.exit(1);
});

// ✅ Start the server
startServer();