/**
 * Enhanced Personality Service with Multi-Mode Insight System
 */

const { InsightTransformer, InsightFactory } = require('../utils/insightTransformer')

class EnhancedPersonalityService {
  constructor() {
    this.insightTransformer = new InsightTransformer()
    this.basePersonalityService = require('./personalityService')
  }

  async analyzePersonality(userData, repositories, languages, mode = 'professional') {
    // Get base personality analysis (existing logic)
    const basePersonality = await this.basePersonalityService.analyzePersonality(userData, repositories, languages)

    // Generate base insights from data
    const baseInsights = InsightFactory.createInsights(userData, repositories, basePersonality)

    // Transform insights based on mode
    const transformedInsights = this.insightTransformer.transform(baseInsights, mode)

    // Return enhanced personality analysis
    return {
      ...basePersonality,
      insights: transformedInsights,
      metadata: {
        mode: mode,
        insightCount: baseInsights.length,
        analysisDate: new Date().toISOString()
      }
    }
  }

  // Method to switch modes dynamically
  async switchMode(personalityData, newMode) {
    const baseInsights = this.revertToBaseInsights(personalityData.insights)
    const transformedInsights = this.insightTransformer.transform(baseInsights, newMode)

    return {
      ...personalityData,
      insights: transformedInsights,
      metadata: {
        ...personalityData.metadata,
        mode: newMode,
        lastModeSwitch: new Date().toISOString()
      }
    }
  }

  // Helper to extract base insights from transformed ones
  revertToBaseInsights(transformedInsights) {
    return transformedInsights.map(insight => ({
      id: insight.id,
      type: insight.type,
      baseMessage: this.extractBaseMessage(insight),
      severity: this.extractSeverity(insight),
      confidence: insight.confidence || 75,
      context: insight.context || {}
    }))
  }

  extractBaseMessage(transformedInsight) {
    // Extract the core issue from the transformed message
    const messageMap = {
      'Project Initiation Pattern': 'Low project completion',
      'Development Consistency Assessment': 'Inconsistent activity',
      'Collaboration Style Evaluation': 'Solo developer',
      'Technical Specialization Assessment': 'Language specialist',
      'Peak Productivity Hours': 'Night owl coding',
      'Project Launch Master': 'Low project completion',
      'Lightning Coder': 'Inconsistent activity',
      'Indie Developer': 'Solo developer',
      'Language Ninja': 'Language specialist',
      'Night Ninja': 'Night owl coding',
      'Project Graveyard Keeper': 'Low project completion',
      'Commit Sloth': 'Inconsistent activity',
      'Island Developer': 'Solo developer',
      'One-Trick Pony': 'Language specialist',
      'Vampire Coder': 'Night owl coding'
    }
    
    return messageMap[transformedInsight.title] || transformedInsight.baseMessage || 'General coding pattern'
  }

  extractSeverity(transformedInsight) {
    // Map tone and content to severity
    if (transformedInsight.tone === 'roast') {
      return 'medium' // Roasts are always medium severity
    }
    
    // Extract from confidence or context
    if (transformedInsight.confidence > 80) return 'high'
    if (transformedInsight.confidence > 60) return 'medium'
    return 'low'
  }
}

module.exports = new EnhancedPersonalityService()
