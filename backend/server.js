/**
 * Main Server Entry Point
 * Starts the Express server and handles graceful shutdown
 * For Vercel: Export the app instance for serverless functions
 */

const app = require('./src/app');
const logger = require('./src/utils/logger');

// Check if we're in a Vercel serverless environment
const isVercel = process.env.VERCEL === '1';

// Only start the server if NOT in Vercel environment
if (!isVercel) {
  // Get port from environment or use default
  const PORT = process.env.PORT || 5000;

  // Start the server
  const server = app.listen(PORT, () => {
    try {
      logger.info(`🚀 GitXray API Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
    } catch (error) {
      console.error('Server startup logging error:', error);
      console.log(`🚀 GitXray API Server running on port ${PORT}`);
    }
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    try {
      logger.info('👋 SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('💤 Server closed');
        process.exit(0);
      });
    } catch (error) {
      console.error('Shutdown error:', error);
      process.exit(0);
    }
  });

  process.on('SIGINT', () => {
    try {
      logger.info('👋 SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('💤 Server closed');
        process.exit(0);
      });
    } catch (error) {
      console.error('Shutdown error:', error);
      process.exit(0);
    }
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
}

// Export the app for Vercel serverless functions
module.exports = app;
