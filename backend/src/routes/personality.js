/**
 * Personality Analysis Routes
 * Routes specifically for personality type information
 */

const express = require('express');
const { getAllPersonalityTypes, getPersonalityType } = require('../services/analysisController');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * GET /api/personality/types
 * Get all available personality types
 */
router.get('/types', (req, res) => {
  try {
    const types = getAllPersonalityTypes();
    
    res.status(200).json({
      success: true,
      data: types,
      message: 'Successfully retrieved personality types',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Failed to get personality types:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve personality types',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/personality/types/:type
 * Get specific personality type information
 */
router.get('/types/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    const personalityType = getPersonalityType(type);
    
    res.status(200).json({
      success: true,
      data: personalityType,
      message: `Successfully retrieved ${type} personality type`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error(`Failed to get personality type ${req.params.type}:`, error);
    
    res.status(404).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
