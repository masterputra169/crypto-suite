// ==================== src/app.js ====================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// ✅ dotenv sudah di-load di server.js, tidak perlu di sini
// require('dotenv').config(); ← HAPUS INI

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cipherRoutes = require('./routes/cipher.routes');

// Import middlewares
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

const corsOptions = {
  origin: [
    'https://cryptosuite.online',
    'https://www.cryptosuite.online',
    'http://localhost:5173',  // untuk development
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ✅ Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Crypto Suite API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      cipher: '/api/cipher'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected', // Could add actual DB health check here
    email: process.env.EMAIL_HOST ? 'configured' : 'not configured'
  });
});

// ✅ API routes
app.use('/api/cipher', require('./routes/cipher.routes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// ✅ Log all registered routes (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('\n📍 Registered Routes:');
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      console.log(`   ${methods.padEnd(8)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
          const path = middleware.regexp.toString()
            .replace('/^', '')
            .replace('\\/?(?=\\/|$)', '')
            .replace(/\\\//g, '/')
            .replace(/\\/g, '');
          console.log(`   ${methods.padEnd(8)} ${path}${handler.route.path}`);
        }
      });
    }
  });
  console.log('');
}

// 404 handler - Must be AFTER all routes
app.use(notFound);

// Error handler - Must be LAST
app.use(errorHandler);

module.exports = app;