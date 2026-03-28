/**
 * Personality Analysis Service
 * Analyzes GitHub data to determine developer personality types
 */

class PersonalityService {
  constructor() {
    // Define personality types with dynamic trait generation
    this.personalityTypes = {
      builder: {
        name: 'Builder',
        title: 'The Architect',
        color: '#3B82F6',
        icon: '🏗️'
      },
      explorer: {
        name: 'Explorer',
        title: 'The Adventurer',
        color: '#10B981',
        icon: '🧭'
      },
      debugger: {
        name: 'Debugger',
        title: 'The Problem Solver',
        color: '#F59E0B',
        icon: '🔍'
      },
      perfectionist: {
        name: 'Perfectionist',
        title: 'The Craftsperson',
        color: '#8B5CF6',
        icon: '💎'
      },
      hustler: {
        name: 'Hustler',
        title: 'The Networker',
        color: '#EF4444',
        icon: '🚀'
      }
    };
  }

  /**
   * Calculate dynamic personality scores based on real GitHub data
   */
  calculatePersonalityScores(githubData) {
    const { repositories, languages, user } = githubData;
    const repoCount = repositories.total_count;
    const totalStars = repositories.stats.total_stars;
    const totalForks = repositories.stats.total_forks;
    const languageCount = Object.keys(languages).length;
    const accountAge = this.calculateAccountAge(user.created_at);
    
    // Calculate metrics
    const avgStarsPerRepo = repoCount > 0 ? totalStars / repoCount : 0;
    const forkRatio = repoCount > 0 ? totalForks / repoCount : 0;
    const languageDiversity = Math.min(languageCount / 10, 1); // Normalize to 0-1
    
    // Dynamic score calculations
    const scores = {
      builder: this.calculateBuilderScore(repositories, avgStarsPerRepo, accountAge),
      explorer: this.calculateExplorerScore(languageCount, languageDiversity, repositories),
      debugger: this.calculateDebuggerScore(totalForks, repoCount, accountAge),
      perfectionist: this.calculatePerfectionistScore(avgStarsPerRepo, totalStars, repositories),
      hustler: this.calculateHustlerScore(user.followers, totalStars, repoCount)
    };
    
    return scores;
  }

  calculateBuilderScore(repositories, avgStarsPerRepo, accountAge) {
    let score = 0;
    
    // Original repos vs forks (builders create original content)
    const originalRatio = this.getOriginalRepoRatio(repositories);
    score += originalRatio * 30;
    
    // Quality indicators (stars per repo)
    score += Math.min(avgStarsPerRepo * 2, 30);
    
    // Consistency (account age with activity)
    score += Math.min(accountAge * 2, 20);
    
    // Repo count (builders have substantial portfolios - weighted by originality)
    score += Math.min(repositories.total_count * 0.5, 20) * originalRatio;
    
    return Math.round(Math.min(score, 100));
  }

  calculateExplorerScore(languageCount, languageDiversity, repositories) {
    let score = 0;
    
    // Language diversity (explorers try many languages)
    score += languageDiversity * 40;
    
    // Experimentation (many small projects)
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    const smallProjects = repoList.filter(repo => repo.size < 100).length;
    score += Math.min((smallProjects / repoList.length) * 30, 30);
    
    // Recent activity (explorers are always trying new things)
    score += this.getRecentActivityScore(repositories) * 30;
    
    return Math.round(Math.min(score, 100));
  }

  calculateDebuggerScore(totalForks, repoCount, accountAge) {
    let score = 0;
    
    // Fork ratio (debuggers like to fix/improve existing code)
    const forkRatio = repoCount > 0 ? (totalForks / repoCount) * 10 : 0;
    score += Math.min(forkRatio, 40);
    
    // Account age (debuggers gain skills over time)
    score += Math.min(accountAge * 1.5, 30);
    
    // Community involvement (indicated by forks received)
    score += Math.min(totalForks * 0.1, 30);
    
    return Math.round(Math.min(score, 100));
  }

  calculatePerfectionistScore(avgStarsPerRepo, totalStars, repositories) {
    let score = 0;
    
    // Quality focus (high star ratios indicate quality)
    score += Math.min(avgStarsPerRepo * 5, 40);
    
    // Documentation presence (README files)
    const documentedRepos = this.getDocumentedRepoCount(repositories);
    const documentationRatio = repositories.total_count > 0 ? documentedRepos / repositories.total_count : 0;
    score += documentationRatio * 30;
    
    // Project depth (larger repos indicate more thorough work)
    const avgRepoSize = this.getAverageRepoSize(repositories);
    score += Math.min(avgRepoSize * 0.1, 30);
    
    return Math.round(Math.min(score, 100));
  }

  calculateHustlerScore(followers, totalStars, repoCount) {
    let score = 0;
    
    // Network reach (followers indicate networking)
    score += Math.min(Math.log(followers + 1) * 10, 40);
    
    // Impact (total stars show reach)
    score += Math.min(Math.log(totalStars + 1) * 5, 30);
    
    // Visibility (repo count with good distribution)
    score += Math.min(repoCount * 0.8, 30);
    
    return Math.round(Math.min(score, 100));
  }

  /**
   * Generate dynamic traits based on actual user behavior
   */
  generateDynamicTraits(personalityType, githubData, score) {
    const { repositories, languages, user } = githubData;
    const traits = [];
    
    switch (personalityType) {
      case 'builder':
        if (this.getOriginalRepoRatio(repositories) > 0.8) {
          traits.push('Creates original projects');
        }
        if (repositories.total_count > 10) {
          traits.push('Maintains multiple active repositories');
        }
        if (this.getAverageStarsPerRepo(repositories) > 5) {
          traits.push('Builds high-quality, well-regarded projects');
        }
        if (this.calculateAccountAge(user.created_at) > 2) {
          traits.push('Consistent long-term contributor');
        }
        break;
        
      case 'explorer':
        if (Object.keys(languages).length > 5) {
          traits.push('Experiments with diverse technologies');
        }
        if (this.getRecentActivityScore(repositories) > 0.7) {
          traits.push('Actively explores new frameworks');
        }
        if (this.getSmallProjectRatio(repositories) > 0.6) {
          traits.push('Loves rapid prototyping');
        }
        if (this.getLanguageDiversity(languages) > 0.7) {
          traits.push('Curious about different paradigms');
        }
        break;
        
      case 'debugger':
        if (repositories.total_count > 5) {
          traits.push('Systematic problem-solver');
        }
        if (this.getForkContribution(repositories) > 0.3) {
          traits.push('Improves existing codebases');
        }
        if (this.calculateAccountAge(user.created_at) > 1) {
          traits.push('Detail-oriented developer');
        }
        if (user.followers > 10) {
          traits.push('Community problem solver');
        }
        break;
        
      case 'perfectionist':
        if (this.getDocumentedRepoCount(repositories) / repositories.total_count > 0.8) {
          traits.push('Meticulous documentation');
        }
        if (this.getAverageRepoSize(repositories) > 500) {
          traits.push('Thorough project implementation');
        }
        if (this.getAverageStarsPerRepo(repositories) > 10) {
          traits.push('High code quality standards');
        }
        if (this.getTestCoverage(repositories) > 0.5) {
          traits.push('Comprehensive testing approach');
        }
        break;
        
      case 'hustler':
        if (user.followers > 50) {
          traits.push('Strong network presence');
        }
        if (repositories.stats.total_stars > 100) {
          traits.push('Creates impactful projects');
        }
        if (this.getCollaborationScore(repositories) > 0.5) {
          traits.push('Active collaborator');
        }
        if (repositories.total_count > 20) {
          traits.push('Prolific project creator');
        }
        break;
    }
    
    // Ensure at least 2 traits
    if (traits.length < 2) {
      traits.push('Dedicated developer');
      traits.push('Continuous learner');
    }
    
    return traits.slice(0, 4); // Return top 4 traits
  }

  /**
   * Generate dynamic description based on actual metrics
   */
  generateDynamicDescription(personalityType, githubData, score) {
    const { repositories, languages, user } = githubData;
    
    switch (personalityType) {
      case 'builder':
        if (score > 80) {
          return `Master architect who has built ${repositories.total_count} original repositories with exceptional quality standards`;
        } else if (score > 60) {
          return `Reliable builder who creates structured projects and maintains ${repositories.total_count} active repositories`;
        } else {
          return `Emerging builder focused on creating solid, well-structured projects`;
        }
        
      case 'explorer':
        if (score > 80) {
          return `Adventurous developer who experiments with ${Object.keys(languages).length} different technologies and frameworks`;
        } else if (score > 60) {
          return `Curious explorer who enjoys trying new programming languages and approaches`;
        } else {
          return `Beginning explorer starting to discover different technologies`;
        }
        
      case 'debugger':
        if (score > 80) {
          return `Expert problem-solver with systematic approach to debugging and code improvement`;
        } else if (score > 60) {
          return `Analytical developer who excels at finding and fixing complex issues`;
        } else {
          return `Developing problem-solving skills through debugging experience`;
        }
        
      case 'perfectionist':
        if (score > 80) {
          return `Craftsperson who maintains exceptional code quality across ${repositories.total_count} projects`;
        } else if (score > 60) {
          return `Quality-focused developer who pays attention to detail and best practices`;
        } else {
          return `Growing focus on code quality and professional standards`;
        }
        
      case 'hustler':
        if (score > 80) {
          return `Networked impact creator with ${user.followers} followers and ${repositories.stats.total_stars} total stars`;
        } else if (score > 60) {
          return `Community-focused developer who builds connections and creates visibility`;
        } else {
          return `Building network presence and project impact`;
        }
    }
  }

  /**
   * Calculate confidence score based on data completeness and consistency
   */
  calculateConfidence(githubData, dominantScore) {
    const { repositories, languages, user } = githubData;
    let confidence = 0;
    
    // Data completeness factors
    if (repositories.total_count > 0) confidence += 20;
    if (Object.keys(languages).length > 0) confidence += 20;
    if (user.followers > 0 || user.following > 0) confidence += 15;
    if (repositories.stats.total_stars > 0) confidence += 15;
    if (user.created_at) confidence += 10;
    
    // Consistency factors
    if (repositories.total_count > 5) confidence += 10;
    if (dominantScore > 70) confidence += 10;
    
    // Convert to confidence level
    if (confidence >= 85) return 'Very High';
    if (confidence >= 70) return 'High';
    if (confidence >= 55) return 'Medium';
    if (confidence >= 40) return 'Low';
    return 'Very Low';
  }

  // Helper methods
  calculateAccountAge(createdDate) {
    const now = new Date();
    const created = new Date(createdDate);
    return (now - created) / (1000 * 60 * 60 * 24 * 365); // Years
  }

  getOriginalRepoRatio(repositories) {
    // Handle both array and object formats
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    if (repoList.length === 0) return 0;
    const originalRepos = repoList.filter(repo => !repo.fork);
    return originalRepos.length / repoList.length;
  }

  getRecentActivityScore(repositories) {
    // Handle both array and object formats
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    if (repoList.length === 0) return 0;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentRepos = repoList.filter(repo => 
      new Date(repo.updated_at) > sixMonthsAgo
    );
    
    return recentRepos.length / repoList.length;
  }

  getDocumentedRepoCount(repositories) {
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    if (repoList.length === 0) return 0;
    return repoList.filter(repo => repo.has_pages || repo.description).length;
  }

  getAverageRepoSize(repositories) {
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    if (repoList.length === 0) return 0;
    const totalSize = repoList.reduce((sum, repo) => sum + (repo.size || 0), 0);
    return totalSize / repoList.length;
  }

  getAverageStarsPerRepo(repositories) {
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    if (repoList.length === 0) return 0;
    const totalStars = repoList.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    return totalStars / repoList.length;
  }

  getSmallProjectRatio(repositories) {
    const repoList = Array.isArray(repositories) ? repositories : repositories.list || [];
    if (repoList.length === 0) return 0;
    const smallProjects = repoList.filter(repo => (repo.size || 0) < 100);
    return smallProjects.length / repoList.length;
  }

  getLanguageDiversity(languages) {
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    if (totalBytes === 0) return 0;
    
    const entropy = Object.values(languages).reduce((sum, bytes) => {
      const ratio = bytes / totalBytes;
      return sum - (ratio * Math.log2(ratio));
    }, 0);
    
    return Math.min(entropy / 3, 1); // Normalize to 0-1
  }

  getForkContribution(repositories) {
    if (!repositories.list || repositories.list.length === 0) return 0;
    const forks = repositories.list.filter(repo => repo.fork);
    return forks.length / repositories.list.length;
  }

  getTestCoverage(repositories) {
    // Simplified test coverage estimation
    // In real implementation, this would analyze actual test files
    return Math.random() * 0.8; // Placeholder
  }

  getCollaborationScore(repositories) {
    if (!repositories.list || repositories.list.length === 0) return 0;
    const collaborators = repositories.list.reduce((sum, repo) => 
      sum + (repo.collaborators || 0), 0
    );
    return Math.min(collaborators / (repositories.list.length * 5), 1);
  }

  /**
   * Main analysis function
   */
  analyzePersonality(githubData) {
    // Calculate dynamic scores
    const scores = this.calculatePersonalityScores(githubData);
    
    // Find dominant personality
    const dominantType = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];
    
    const dominantPersonality = this.personalityTypes[dominantType];
    const dominantScore = scores[dominantType];
    
    // Generate dynamic traits
    const traits = this.generateDynamicTraits(dominantType, githubData, dominantScore);
    
    // Generate dynamic description
    const description = this.generateDynamicDescription(dominantType, githubData, dominantScore);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(githubData, dominantScore);
    
    return {
      dominant_personality: {
        type: dominantType,
        name: dominantPersonality.name,
        title: dominantPersonality.title,
        description: description,
        traits: traits,
        score: dominantScore,
        color: dominantPersonality.color,
        icon: dominantPersonality.icon
      },
      scores: scores,
      confidence: confidence
    };
  }
}

module.exports = new PersonalityService();
