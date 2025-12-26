// src/middlewares/errorHandler.js

const { sendError } = require('../utils/responseHelper');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 400, 'Data sudah terdaftar');
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return sendError(res, 400, 'Data referensi tidak ditemukan');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Token tidak valid');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token sudah expired');
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan server';

  sendError(res, statusCode, message);
};

/**
 * Handle 404 errors
 */
const notFound = (req, res) => {
  sendError(res, 404, `Route ${req.originalUrl} tidak ditemukan`);
};

module.exports = {
  errorHandler,
  notFound
};