/**
 * Global Error Handler Middleware
 * Catches and handles all errors in the application
 */

const logger = require('../utils/logger');

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle Joi validation errors
 * @param {Error} error - Joi validation error
 * @returns {Object} Formatted error response
 */
const handleJoiError = (error) => {
  const errors = error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }));

  return {
    success: false,
    error: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: errors,
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle JWT errors (if implemented later)
 * @param {Error} error - JWT error
 * @returns {Object} Formatted error response
 */
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return {
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
      timestamp: new Date().toISOString()
    };
  }
  
  if (error.name === 'TokenExpiredError') {
    return {
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired',
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: false,
    error: 'AUTH_ERROR',
    message: 'Authentication error',
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle duplicate key errors (MongoDB/Database)
 * @param {Error} error - Database error
 * @returns {Object} Formatted error response
 */
const handleDuplicateFieldsError = (error) => {
  const value = error.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  
  return {
    success: false,
    error: 'DUPLICATE_FIELD',
    message: `Duplicate field value: ${value}. Please use another value.`,
    timestamp: new Date().toISOString()
  };
};

/**
 * Handle cast errors (invalid data types)
 * @param {Error} error - Cast error
 * @returns {Object} Formatted error response
 */
const handleCastError = (error) => {
  return {
    success: false,
    error: 'INVALID_DATA_TYPE',
    message: `Invalid ${error.path}: ${error.value}`,
    timestamp: new Date().toISOString()
  };
};

/**
 * Send error response in development mode
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  logger.error('Development Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    errorCode: err.errorCode
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.errorCode || 'INTERNAL_ERROR',
    message: err.message,
    stack: err.stack,
    details: err.details || null,
    timestamp: new Date().toISOString()
  });
};

/**
 * Send error response in production mode
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.errorCode,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('Production Error:', {
      message: err.message,
      stack: err.stack
    });

    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Something went wrong on our end. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.errorCode = err.errorCode || 'INTERNAL_ERROR';

  // Log the error
  logger.error('Global Error Handler:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle specific error types
  let error = { ...err };
  error.message = err.message;

  // Joi validation errors
  if (err.isJoi) {
    const joiError = handleJoiError(err);
    return res.status(400).json(joiError);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const jwtError = handleJWTError(err);
    return res.status(401).json(jwtError);
  }

  // Database duplicate field errors
  if (err.code === 11000) {
    const duplicateError = handleDuplicateFieldsError(err);
    return res.status(400).json(duplicateError);
  }

  // Database cast errors
  if (err.name === 'CastError') {
    const castError = handleCastError(err);
    return res.status(400).json(castError);
  }

  // GitHub API specific errors
  if (err.message.includes('GitHub API')) {
    return res.status(err.statusCode || 502).json({
      success: false,
      error: 'GITHUB_API_ERROR',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }

  // Rate limiting errors
  if (err.message.includes('rate limit')) {
    return res.status(429).json({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      retryAfter: err.retryAfter || 60,
      timestamp: new Date().toISOString()
    });
  }

  // Send appropriate error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Async error wrapper for catching errors in async routes
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  globalErrorHandler,
  catchAsync
};
