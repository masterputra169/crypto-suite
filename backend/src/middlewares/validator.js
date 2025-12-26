// src/middlewares/validator.js

const { validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/responseHelper');

/**
 * Validation middleware
 * Checks for validation errors and sends formatted response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return sendValidationError(res, formattedErrors);
  }
  
  next();
};

module.exports = { validate };