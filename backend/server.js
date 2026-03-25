/**
 * Main Server Entry Point
 * Starts the Express server and handles graceful shutdown
 */

const app = require('./src/app');
const logger = require('./src/utils/logger');

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Dev DNA API Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('💤 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('💤 Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
