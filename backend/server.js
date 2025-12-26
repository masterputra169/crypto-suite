// ==================== server.js ====================
// ✅ PENTING: Load .env PALING ATAS sebelum import apapun
require('dotenv').config();

const app = require('./src/app');
const { testConnection, initDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// ✅ Log environment variables saat startup
console.log('\n' + '='.repeat(60));
console.log('🚀 CRYPTO SUITE BACKEND - STARTING');
console.log('='.repeat(60));
console.log('📝 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', PORT);
console.log('🌐 Client URL:', process.env.CLIENT_URL || 'http://localhost:5173');
console.log('💾 Database:', process.env.DB_NAME || 'NOT SET');

// ✅ Verify email configuration
console.log('\n📧 Email Configuration:');
console.log('   Host:', process.env.EMAIL_HOST || '❌ NOT SET');
console.log('   Port:', process.env.EMAIL_PORT || '❌ NOT SET');
console.log('   User:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('   Password:', process.env.EMAIL_PASSWORD ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('   From:', process.env.EMAIL_FROM || '❌ NOT SET');

if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.log('\n⚠️  WARNING: Email configuration incomplete!');
  console.log('   Password reset emails will NOT be sent.');
  console.log('   Please configure EMAIL_* variables in .env file.\n');
}

console.log('='.repeat(60) + '\n');

const startServer = async () => {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test database connection
    await testConnection();
    console.log('✅ Database connected successfully');
    
    console.log('🔄 Initializing database tables...');
    
    // Initialize database tables
    await initDatabase();
    console.log('✅ Database tables initialized');
    
    console.log('\n🔄 Starting HTTP server...');
    
    // Start listening
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✅ SERVER IS READY!');
      console.log('='.repeat(60));
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
      console.log('='.repeat(60) + '\n');
      console.log('Press Ctrl+C to stop the server\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to start server:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('\n❌ Unhandled Promise Rejection:', err.message);
  console.error('Shutting down gracefully...');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n❌ Uncaught Exception:', err.message);
  console.error('Shutting down immediately...');
  process.exit(1);
});

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  process.exit(0);
});

startServer();