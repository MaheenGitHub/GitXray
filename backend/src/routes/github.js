/**
 * GitHub API Routes
 * Defines all endpoints related to GitHub user analysis
 */

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const githubService = require('../services/githubService');
const { analyzeWithPersonality } = require('../services/analysisController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * Validation middleware
 * Checks if the request parameters are valid
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * GET /api/analyze/:username
 * Analyze a GitHub user's profile and return comprehensive data
 * 
 * @param {string} username - GitHub username to analyze
 * @returns {Object} User analysis including profile, repositories, and languages
 */
router.get('/analyze/:username', 
  [
    // Validate username parameter
    param('username')
      .isLength({ min: 1, max: 39 })
      .withMessage('Username must be between 1 and 39 characters')
      .matches(/^[a-zA-Z0-9]([a-zA-Z0-9\-])*[a-zA-Z0-9]$/)
      .withMessage('Username can only contain alphanumeric characters and hyphens, and cannot start or end with a hyphen')
  ],
  validateRequest,
  async (req, res) => {
    const { username } = req.params;
    
    try {
      logger.info(`🔍 Starting analysis for GitHub user: ${username}`);
      
      // Get comprehensive user analysis from GitHub service
      const githubAnalysis = await githubService.getUserAnalysis(username);
      
      // Perform personality analysis
      const enhancedAnalysis = await analyzeWithPersonality(githubAnalysis);
      
      // Return successful response
      res.status(200).json({
        success: true,
        data: enhancedAnalysis,
        message: `Successfully analyzed GitHub user: ${username}`,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`✅ Analysis completed successfully for ${username}`);
      
    } catch (error) {
      logger.error(`❌ Analysis failed for ${username}:`, error);
      
      // Determine appropriate status code based on error type
      let statusCode = 500;
      let errorType = 'internal_error';
      
      if (error.message.includes('not found')) {
        statusCode = 404;
        errorType = 'user_not_found';
      } else if (error.message.includes('rate limit')) {
        statusCode = 429;
        errorType = 'rate_limit_exceeded';
      } else if (error.message.includes('Access forbidden')) {
        statusCode = 403;
        errorType = 'access_forbidden';
      } else if (error.message.includes('Invalid GitHub API token')) {
        statusCode = 401;
        errorType = 'invalid_token';
      }
      
      res.status(statusCode).json({
        success: false,
        error: errorType,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * GET /api/user/:username
 * Get basic user profile information
 * 
 * @param {string} username - GitHub username
 * @returns {Object} Basic user profile data
 */
router.get('/user/:username',
  [
    param('username')
      .isLength({ min: 1, max: 39 })
      .withMessage('Username must be between 1 and 39 characters')
      .matches(/^[a-zA-Z0-9]([a-zA-Z0-9\-])*[a-zA-Z0-9]$/)
      .withMessage('Username can only contain alphanumeric characters and hyphens')
  ],
  validateRequest,
  async (req, res) => {
    const { username } = req.params;
    
    try {
      logger.info(`👤 Fetching profile for GitHub user: ${username}`);
      
      const userProfile = await githubService.getUserProfile(username);
      
      res.status(200).json({
        success: true,
        data: userProfile,
        message: `Successfully fetched profile for: ${username}`,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error(`❌ Failed to fetch profile for ${username}:`, error);
      
      let statusCode = 500;
      if (error.message.includes('not found')) {
        statusCode = 404;
      }
      
      res.status(statusCode).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * GET /api/repositories/:username
 * Get all repositories for a user
 * 
 * @param {string} username - GitHub username
 * @param {string} type - Repository type (all, owner, member)
 * @param {string} sort - Sort order (created, updated, pushed, full_name)
 * @param {string} direction - Sort direction (asc, desc)
 * @returns {Array} Array of repository objects
 */
router.get('/repositories/:username',
  [
    param('username')
      .isLength({ min: 1, max: 39 })
      .withMessage('Username must be between 1 and 39 characters')
      .matches(/^[a-zA-Z0-9]([a-zA-Z0-9\-])*[a-zA-Z0-9]$/)
      .withMessage('Username can only contain alphanumeric characters and hyphens'),
    // Optional query parameters
    // .query('type').optional().isIn(['all', 'owner', 'member']),
    // .query('sort').optional().isIn(['created', 'updated', 'pushed', 'full_name']),
    // .query('direction').optional().isIn(['asc', 'desc'])
  ],
  validateRequest,
  async (req, res) => {
    const { username } = req.params;
    const { type = 'all', sort = 'updated', direction = 'desc' } = req.query;
    
    try {
      logger.info(`📚 Fetching repositories for GitHub user: ${username}`);
      
      const repositories = await githubService.getUserRepositories(username, {
        type,
        sort,
        direction
      });
      
      res.status(200).json({
        success: true,
        data: {
          repositories,
          count: repositories.length,
          username,
          filters: { type, sort, direction }
        },
        message: `Successfully fetched ${repositories.length} repositories for: ${username}`,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error(`❌ Failed to fetch repositories for ${username}:`, error);
      
      let statusCode = 500;
      if (error.message.includes('not found')) {
        statusCode = 404;
      }
      
      res.status(statusCode).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * POST /api/analyze
 * Alternative endpoint for analyzing users via POST request
 * Accepts username in request body
 */
router.post('/analyze',
  [
    body('username')
      .isLength({ min: 1, max: 39 })
      .withMessage('Username must be between 1 and 39 characters')
      .matches(/^[a-zA-Z0-9]([a-zA-Z0-9\-])*[a-zA-Z0-9]$/)
      .withMessage('Username can only contain alphanumeric characters and hyphens, and cannot start or end with a hyphen')
  ],
  validateRequest,
  async (req, res) => {
    const { username } = req.body;
    
    try {
      logger.info(`🔍 Starting POST analysis for GitHub user: ${username}`);
      
      const analysis = await githubService.getUserAnalysis(username);
      
      res.status(200).json({
        success: true,
        data: analysis,
        message: `Successfully analyzed GitHub user: ${username}`,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      logger.error(`❌ POST analysis failed for ${username}:`, error);
      
      let statusCode = 500;
      if (error.message.includes('not found')) {
        statusCode = 404;
      }
      
      res.status(statusCode).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * GET /api/health
 * Health check endpoint for GitHub service
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'github-api',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
