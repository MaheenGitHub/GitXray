/**
 * Personality Analysis Service
 * Analyzes GitHub data to determine developer personality types
 */

class PersonalityService {
  constructor() {
    // Define personality types with their characteristics
    this.personalityTypes = {
      builder: {
        name: 'Builder',
        title: 'The Architect',
        description: 'Consistent developers who build structured, reliable projects',
        traits: [
          'Creates many repositories',
          'Consistent commit patterns',
          'Prefers quality over quantity',
          'Builds lasting projects'
        ],
        color: '#3B82F6',
        icon: '🏗️'
      },
      explorer: {
        name: 'Explorer',
        title: 'The Adventurer',
        description: 'Curious developers who love experimenting with new technologies',
        traits: [
          'Uses diverse programming languages',
          'Experiments with new frameworks',
          'Has many small projects',
          'Loves learning new things'
        ],
        color: '#10B981',
        icon: '🧭'
      },
      debugger: {
        name: 'Debugger',
        title: 'The Problem Solver',
        description: 'Analytical developers who excel at finding and fixing issues',
        traits: [
          'High commit frequency',
          'Detailed commit messages',
          'Active in issue resolution',
          'Systematic approach to coding'
        ],
        color: '#F59E0B',
        icon: '🔍'
      },
      perfectionist: {
        name: 'Perfectionist',
        title: 'The Craftsperson',
        description: 'Detail-oriented developers who create high-quality, polished code',
        traits: [
          'High star-to-repo ratio',
          'Well-documented projects',
          'Clean, optimized code',
          'Focus on code quality'
        ],
        color: '#8B5CF6',
        icon: '💎'
      },
      hustler: {
        name: 'Hustler',
        title: 'The Go-Getter',
        description: 'Ambitious developers who ship quickly and build their personal brand',
        traits: [
          'High activity levels',
          'Many followers',
          'Active community engagement',
          'Rapid project development'
        ],
        color: '#EF4444',
        icon: '🚀'
      }
    };
  }

  /**
   * Main personality analysis function
   * @param {Object} githubData - Complete GitHub analysis data
   * @returns {Object} Personality analysis results
   */
  analyzePersonality(githubData) {
    try {
      // Extract relevant metrics
      const metrics = this.extractMetrics(githubData);
      
      // Calculate scores for each personality type
      const scores = this.calculatePersonalityScores(metrics);
      
      // Determine dominant personality
      const dominantPersonality = this.findDominantPersonality(scores);
      
      // Generate insights
      const insights = this.generateInsights(metrics, scores, dominantPersonality);
      
      return {
        dominant_personality: dominantPersonality,
        scores: scores,
        metrics: metrics,
        insights: insights,
        analysis_timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      throw new Error(`Personality analysis failed: ${error.message}`);
    }
  }

  /**
   * Extract key metrics from GitHub data
   * @param {Object} githubData - GitHub analysis data
   * @returns {Object} Extracted metrics
   */
  extractMetrics(githubData) {
    const { user, repositories, languages } = githubData;
    
    // Account age in years
    const accountAge = this.calculateAccountAge(user.created_at);
    
    // Activity metrics
    const avgReposPerYear = repositories.total_count / Math.max(accountAge, 1);
    const avgStarsPerRepo = repositories.stats.total_stars / Math.max(repositories.total_count, 1);
    const avgForksPerRepo = repositories.stats.total_forks / Math.max(repositories.total_count, 1);
    
    // Language diversity
    const languageCount = Object.keys(languages).length;
    const dominantLanguageRatio = this.calculateDominantLanguageRatio(languages);
    
    // Project quality indicators
    const originalRepoRatio = repositories.stats.original_count / Math.max(repositories.total_count, 1);
    const archivedRatio = repositories.stats.archived_count / Math.max(repositories.total_count, 1);
    
    // Social metrics
    const followerToFollowingRatio = user.followers / Math.max(user.following, 1);
    
    return {
      // Basic metrics
      total_repos: repositories.total_count,
      public_repos: user.public_repos,
      total_stars: repositories.stats.total_stars,
      total_forks: repositories.stats.total_forks,
      followers: user.followers,
      following: user.following,
      
      // Calculated metrics
      account_age_years: accountAge,
      avg_repos_per_year: avgReposPerYear,
      avg_stars_per_repo: avgStarsPerRepo,
      avg_forks_per_repo: avgForksPerRepo,
      
      // Language metrics
      language_count: languageCount,
      dominant_language_ratio: dominantLanguageRatio,
      
      // Project metrics
      original_repo_ratio: originalRepoRatio,
      archived_ratio: archivedRatio,
      
      // Social metrics
      follower_to_following_ratio: followerToFollowingRatio,
      
      // Raw data for advanced analysis
      languages: languages,
      repository_stats: repositories.stats
    };
  }

  /**
   * Calculate personality scores based on metrics
   * @param {Object} metrics - Extracted metrics
   * @returns {Object} Personality scores
   */
  calculatePersonalityScores(metrics) {
    const scores = {};

    // Builder Score - Based on consistency and project volume
    scores.builder = this.calculateBuilderScore(metrics);
    
    // Explorer Score - Based on language diversity and experimentation
    scores.explorer = this.calculateExplorerScore(metrics);
    
    // Debugger Score - Based on activity patterns (estimated from available data)
    scores.debugger = this.calculateDebuggerScore(metrics);
    
    // Perfectionist Score - Based on quality indicators
    scores.perfectionist = this.calculatePerfectionistScore(metrics);
    
    // Hustler Score - Based on ambition and social engagement
    scores.hustler = this.calculateHustlerScore(metrics);

    return scores;
  }

  /**
   * Calculate Builder personality score
   * Builders create many repositories and are consistent
   */
  calculateBuilderScore(metrics) {
    let score = 0;
    
    // High repository count (max 30 points)
    score += Math.min(metrics.total_repos * 0.5, 30);
    
    // Consistent project creation (max 25 points)
    score += Math.min(metrics.avg_repos_per_year * 5, 25);
    
    // High original repository ratio (max 20 points)
    score += metrics.original_repo_ratio * 20;
    
    // Low archived ratio (max 15 points)
    score += (1 - metrics.archived_ratio) * 15;
    
    // Account maturity (max 10 points)
    score += Math.min(metrics.account_age_years * 2, 10);
    
    return Math.round(score);
  }

  /**
   * Calculate Explorer personality score
   * Explorers experiment with many languages and technologies
   */
  calculateExplorerScore(metrics) {
    let score = 0;
    
    // Language diversity (max 35 points)
    score += Math.min(metrics.language_count * 7, 35);
    
    // Low dominant language ratio (max 25 points)
    score += (1 - metrics.dominant_language_ratio) * 25;
    
    // Many small projects (max 20 points)
    if (metrics.avg_repos_per_year > 10) {
      score += 20;
    } else {
      score += metrics.avg_repos_per_year * 2;
    }
    
    // Experimentation indicators (max 20 points)
    const experimentationScore = 
      (metrics.total_forks > metrics.total_repos * 0.3 ? 10 : 0) +
      (metrics.language_count > 5 ? 10 : 0);
    score += experimentationScore;
    
    return Math.round(score);
  }

  /**
   * Calculate Debugger personality score
   * Debuggers are highly active and systematic
   * Note: This is estimated from available metrics
   */
  calculateDebuggerScore(metrics) {
    let score = 0;
    
    // High activity level (max 30 points)
    score += Math.min(metrics.avg_repos_per_year * 3, 30);
    
    // Project maintenance (max 25 points)
    score += Math.min(metrics.total_forks * 0.1, 25);
    
    // Systematic approach (max 25 points)
    const systematicScore = 
      (metrics.original_repo_ratio > 0.7 ? 15 : 0) +
      (metrics.archived_ratio < 0.1 ? 10 : 0);
    score += systematicScore;
    
    // Community engagement (max 20 points)
    score += Math.min(metrics.followers * 0.5, 20);
    
    return Math.round(score);
  }

  /**
   * Calculate Perfectionist personality score
   * Perfectionists focus on quality and earn recognition
   */
  calculatePerfectionistScore(metrics) {
    let score = 0;
    
    // High star-to-repo ratio (max 40 points)
    score += Math.min(metrics.avg_stars_per_repo * 4, 40);
    
    // High fork-to-repo ratio (max 25 points)
    score += Math.min(metrics.avg_forks_per_repo * 5, 25);
    
    // Quality indicators (max 20 points)
    const qualityScore = 
      (metrics.original_repo_ratio > 0.8 ? 10 : 0) +
      (metrics.avg_stars_per_repo > 10 ? 10 : 0);
    score += qualityScore;
    
    // Recognition (max 15 points)
    score += Math.min(metrics.followers * 0.3, 15);
    
    return Math.round(score);
  }

  /**
   * Calculate Hustler personality score
   * Hustlers are ambitious and build their brand
   */
  calculateHustlerScore(metrics) {
    let score = 0;
    
    // High follower count (max 30 points)
    score += Math.min(metrics.followers * 0.3, 30);
    
    // High follower-to-following ratio (max 25 points)
    score += Math.min(metrics.follower_to_following_ratio * 5, 25);
    
    // Rapid development (max 25 points)
    score += Math.min(metrics.avg_repos_per_year * 2.5, 25);
    
    // Social engagement (max 20 points)
    const engagementScore = 
      (metrics.followers > 100 ? 10 : 0) +
      (metrics.total_stars > 100 ? 10 : 0);
    score += engagementScore;
    
    return Math.round(score);
  }

  /**
   * Find the dominant personality type
   * @param {Object} scores - Personality scores
   * @returns {Object} Dominant personality with details
   */
  findDominantPersonality(scores) {
    const personalityTypes = Object.keys(scores);
    const maxScore = Math.max(...Object.values(scores));
    const dominantType = personalityTypes.find(type => scores[type] === maxScore);
    
    const personality = this.personalityTypes[dominantType];
    
    return {
      type: dominantType,
      name: personality.name,
      title: personality.title,
      description: personality.description,
      traits: personality.traits,
      color: personality.color,
      icon: personality.icon,
      score: maxScore,
      confidence: this.calculateConfidence(scores, maxScore)
    };
  }

  /**
   * Calculate confidence level in the dominant personality
   * @param {Object} scores - All personality scores
   * @param {number} maxScore - Highest score
   * @returns {string} Confidence level
   */
  calculateConfidence(scores, maxScore) {
    const sortedScores = Object.values(scores).sort((a, b) => b - a);
    const secondHighest = sortedScores[1] || 0;
    const scoreDifference = maxScore - secondHighest;
    
    if (scoreDifference > 30) return 'Very High';
    if (scoreDifference > 20) return 'High';
    if (scoreDifference > 10) return 'Medium';
    if (scoreDifference > 5) return 'Low';
    return 'Very Low';
  }

  /**
   * Generate personality insights
   * @param {Object} metrics - Extracted metrics
   * @param {Object} scores - Personality scores
   * @param {Object} dominantPersonality - Dominant personality info
   * @returns {Object} Insights and recommendations
   */
  generateInsights(metrics, scores, dominantPersonality) {
    const insights = {
      strengths: [],
      recommendations: [],
      career_suggestions: [],
      collaboration_style: ''
    };

    // Generate insights based on dominant personality
    switch (dominantPersonality.type) {
      case 'builder':
        insights.strengths = [
          'Consistent project delivery',
          'Strong architectural skills',
          'Reliable and dependable'
        ];
        insights.recommendations = [
          'Focus on documentation to share your architectural knowledge',
          'Consider mentoring junior developers',
          'Explore cloud architecture patterns'
        ];
        insights.career_suggestions = [
          'Software Architect',
          'Technical Lead',
          'DevOps Engineer'
        ];
        insights.collaboration_style = 'Prefers structured collaboration and clear project boundaries';
        break;

      case 'explorer':
        insights.strengths = [
          'Adaptable to new technologies',
          'Quick learner',
          'Versatile skill set'
        ];
        insights.recommendations = [
          'Consider specializing in one area while maintaining breadth',
          'Share your learning through blog posts or talks',
          'Build a showcase project demonstrating multiple technologies'
        ];
        insights.career_suggestions = [
          'Full-Stack Developer',
          'Technology Consultant',
          'Solutions Architect'
        ];
        insights.collaboration_style = 'Enjoys experimenting with new approaches and technologies';
        break;

      case 'debugger':
        insights.strengths = [
          'Strong problem-solving skills',
          'Attention to detail',
          'Systematic approach'
        ];
        insights.recommendations = [
          'Develop expertise in testing frameworks',
          'Consider security or performance optimization',
          'Share debugging techniques with the community'
        ];
        insights.career_suggestions = [
          'Quality Assurance Engineer',
          'Security Engineer',
          'Performance Engineer'
        ];
        insights.collaboration_style = 'Excels at identifying and resolving complex issues';
        break;

      case 'perfectionist':
        insights.strengths = [
          'High code quality standards',
          'Strong attention to detail',
          'Creates well-regarded projects'
        ];
        insights.recommendations = [
          'Balance perfectionism with delivery speed',
          'Consider code review leadership roles',
          'Develop design and UX skills'
        ];
        insights.career_suggestions = [
          'Senior Developer',
          'Code Review Lead',
          'UI/UX Developer'
        ];
        insights.collaboration_style = 'Sets high standards and helps teams improve code quality';
        break;

      case 'hustler':
        insights.strengths = [
          'High productivity',
          'Strong personal brand',
          'Community engagement'
        ];
        insights.recommendations = [
          'Focus on sustainable development practices',
          'Consider technical leadership roles',
          'Balance speed with technical debt management'
        ];
        insights.career_suggestions = [
          'Technical Founder',
          'Developer Advocate',
          'Engineering Manager'
        ];
        insights.collaboration_style = 'Energetic and motivating, drives team momentum';
        break;
    }

    // Add metric-based insights
    if (metrics.language_count > 10) {
      insights.strengths.push('Exceptional language diversity');
    }
    
    if (metrics.avg_stars_per_repo > 50) {
      insights.strengths.push('Creates highly valued projects');
    }
    
    if (metrics.followers > 1000) {
      insights.strengths.push('Strong community influence');
    }

    return insights;
  }

  /**
   * Calculate account age in years
   * @param {string} createdAt - GitHub account creation date
   * @returns {number} Age in years
   */
  calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return diffTime / (1000 * 60 * 60 * 24 * 365);
  }

  /**
   * Calculate dominant language ratio
   * @param {Object} languages - Language object with byte counts
   * @returns {number} Ratio of dominant language (0-1)
   */
  calculateDominantLanguageRatio(languages) {
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    if (totalBytes === 0) return 0;
    
    const maxBytes = Math.max(...Object.values(languages));
    return maxBytes / totalBytes;
  }
}

module.exports = new PersonalityService();
