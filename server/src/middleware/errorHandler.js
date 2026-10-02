const config = require('../config/env');

/**
 * Centralized error-handling middleware.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
  const message = err.message || 'An unexpected error occurred.';

  console.error(`[Error] ${req.method} ${req.originalUrl} - ${statusCode} [${errorCode}]: ${message}`);
  if (config.nodeEnv === 'development' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      ...(config.nodeEnv === 'development' && { details: err.details || err.stack }),
    },
  });
}

/**
 * 404 Not Found handler for unmatched API routes.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist on this server.`,
    },
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
