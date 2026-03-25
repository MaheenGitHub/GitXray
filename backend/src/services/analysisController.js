/**
 * Analysis Controller
 * Integrates personality analysis with GitHub data
 */

const personalityService = require('./personalityService');
const logger = require('../utils/logger');

/**
 * Enhanced analysis function that combines GitHub data with personality analysis
 * @param {Object} githubData - Complete GitHub analysis data
 * @returns {Object} Enhanced analysis with personality insights
 */
async function analyzeWithPersonality(githubData) {
  try {
    logger.info(`🧠 Starting personality analysis for ${githubData.user.username}`);
    
    // Perform personality analysis
    const personalityAnalysis = personalityService.analyzePersonality(githubData);
    
    // Combine with GitHub data
    const enhancedAnalysis = {
      ...githubData,
      personality: personalityAnalysis,
      analysis_type: 'comprehensive'
    };
    
    logger.info(`✅ Personality analysis completed for ${githubData.user.username}`);
    logger.info(`🎯 Dominant personality: ${personalityAnalysis.dominant_personality.name} (${personalityAnalysis.dominant_personality.score}/100)`);
    
    return enhancedAnalysis;
    
  } catch (error) {
    logger.error(`❌ Personality analysis failed for ${githubData.user.username}:`, error);
    throw error;
  }
}

/**
 * Get personality type information
 * @param {string} type - Personality type
 * @returns {Object} Personality type details
 */
function getPersonalityType(type) {
  const personality = personalityService.personalityTypes[type];
  
  if (!personality) {
    throw new Error(`Unknown personality type: ${type}`);
  }
  
  return {
    type: type,
    ...personality
  };
}

/**
 * Get all personality types
 * @returns {Array} All personality types
 */
function getAllPersonalityTypes() {
  return Object.entries(personalityService.personalityTypes).map(([type, personality]) => ({
    type,
    ...personality
  }));
}

module.exports = {
  analyzeWithPersonality,
  getPersonalityType,
  getAllPersonalityTypes
};
