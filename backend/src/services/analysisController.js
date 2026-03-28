/**
 * Analysis Controller
 * Integrates personality analysis with GitHub data
 */

const personalityService = require('./personalityService');
const behavioralAnalyzer = require('./behavioralAnalyzer');
const evolutionAnalyzer = require('./evolutionAnalyzer');
const githubService = require('./githubService');
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
    
    // Generate behavioral insights
    const behavioralInsights = behavioralAnalyzer.analyze({
      repo_count: githubData.repositories.total_count,
      stars: githubData.repositories.stats.total_stars,
      forks: githubData.repositories.stats.total_forks,
      languages: githubData.languages,
      commit_pattern: 'consistent', // This would come from actual commit analysis
      builder_score: personalityAnalysis.scores.builder || 0,
      explorer_score: personalityAnalysis.scores.explorer || 0,
      debugger_score: personalityAnalysis.scores.debugger || 0,
      perfectionist_score: personalityAnalysis.scores.perfectionist || 0,
      hustler_score: personalityAnalysis.scores.hustler || 0
    });

    // Generate evolution timeline
    const repositories = await githubService.getUserRepositories(githubData.user.username);
    
    const evolutionTimeline = evolutionAnalyzer.analyze({
      repositories: repositories || [],
      account_creation_date: githubData.user.created_at,
      languages: githubData.languages,
      repo_count: githubData.repositories.total_count,
      stars: githubData.repositories.stats.total_stars,
      forks: githubData.repositories.stats.total_forks
    });
    
    // Combine with GitHub data
    const enhancedAnalysis = {
      ...githubData,
      personality: personalityAnalysis,
      behavioral_insights: behavioralInsights,
      evolution_timeline: evolutionTimeline,
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
