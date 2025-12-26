// src/utils/responseHelper.js

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message
  };

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array} errors - Array of error details
 */
const sendError = (res, statusCode = 500, message = 'Error', errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors
 */
const sendValidationError = (res, errors) => {
  sendError(res, 400, 'Validation Error', errors);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  sendError(res, 404, message);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
  sendError(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Forbidden message
 */
const sendForbidden = (res, message = 'Access forbidden') => {
  sendError(res, 403, message);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden
};