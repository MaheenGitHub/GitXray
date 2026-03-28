/**
 * Evolution Timeline Analyzer
 * Generates personalized developer evolution timeline based on real GitHub data
 */

class EvolutionAnalyzer {
  analyze(userData) {
    const {
      repositories = [],
      account_creation_date = null,
      languages = {},
      repo_count = 0,
      stars = 0,
      forks = 0
    } = userData;

    // Sort repositories by creation date
    const sortedRepos = repositories
      .filter(repo => repo.created_at)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Group repositories by year
    const reposByYear = this.groupReposByYear(sortedRepos);
    
    // Generate timeline phases
    const timeline = this.generateTimelinePhases(reposByYear, userData);
    
    return timeline;
  }

  groupReposByYear(repositories) {
    const grouped = {};
    
    repositories.forEach(repo => {
      const year = new Date(repo.created_at).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(repo);
    });
    
    return grouped;
  }

  generateTimelinePhases(reposByYear, userData) {
    const phases = [];
    const years = Object.keys(reposByYear).map(Number).sort((a, b) => a - b);
    
    if (years.length === 0) {
      return this.getDefaultTimeline();
    }

    // Analyze each year for behavior patterns
    const yearlyAnalysis = years.map(year => {
      const yearRepos = reposByYear[year] || [];
      return this.analyzeYear(year, yearRepos, userData);
    });

    // Convert analysis to timeline phases
    yearlyAnalysis.forEach((analysis, index) => {
      if (analysis.repoCount > 0) {
        phases.push(this.createTimelineEntry(analysis));
      }
    });

    // Ensure we have at least 3 phases
    while (phases.length < 3 && phases.length < years.length) {
      const lastAnalysis = yearlyAnalysis[years[phases.length]];
      if (lastAnalysis && lastAnalysis.repoCount > 0) {
        phases.push(this.createTimelineEntry(lastAnalysis));
      }
    }

    return phases.slice(0, 5); // Max 5 phases
  }

  analyzeYear(year, yearRepos, userData) {
    const repoCount = yearRepos.length;
    const totalStars = yearRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = yearRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const avgStars = repoCount > 0 ? totalStars / repoCount : 0;
    
    // Analyze language diversity
    const yearLanguages = {};
    yearRepos.forEach(repo => {
      if (repo.language) {
        yearLanguages[repo.language] = (yearLanguages[repo.language] || 0) + 1;
      }
    });
    const languageCount = Object.keys(yearLanguages).length;

    // Calculate behavior metrics
    const activityLevel = this.calculateActivityLevel(repoCount, totalStars);
    const growthRate = this.calculateGrowthRate(year, yearRepos);
    const focusScore = this.calculateFocusScore(languageCount, repoCount);

    // Determine role and description
    const role = this.determineRole(repoCount, avgStars, languageCount, focusScore, activityLevel);
    const description = this.generateDescription(role, repoCount, avgStars, languageCount, totalStars, year);

    return {
      year,
      repoCount,
      totalStars,
      avgStars: Number(avgStars.toFixed(1)),
      languageCount,
      activityLevel,
      growthRate,
      focusScore,
      role,
      description,
      reason: this.generateReason(role, repoCount, avgStars, languageCount, totalStars, year),
      color: this.getRoleColor(role),
      confidence: this.calculateConfidence(repoCount, avgStars, totalStars)
    };
  }

  calculateActivityLevel(repoCount, totalStars) {
    if (repoCount >= 10 && totalStars >= 50) return 'high';
    if (repoCount >= 5 && totalStars >= 20) return 'medium';
    if (repoCount >= 2) return 'low';
    return 'minimal';
  }

  calculateGrowthRate(year, yearRepos) {
    // Simple growth calculation based on repo creation pattern
    const monthClusters = {};
    yearRepos.forEach(repo => {
      const month = new Date(repo.created_at).getMonth();
      monthClusters[month] = (monthClusters[month] || 0) + 1;
    });
    
    const avgReposPerMonth = Object.values(monthClusters).reduce((sum, count) => sum + count, 0) / 12;
    if (avgReposPerMonth >= 2) return 'rapid';
    if (avgReposPerMonth >= 1) return 'steady';
    return 'slow';
  }

  calculateFocusScore(languageCount, repoCount) {
    if (languageCount > 5 && repoCount < 10) return 'explorer';
    if (languageCount <= 3 && repoCount >= 10) return 'focused';
    return 'balanced';
  }

  determineRole(repoCount, avgStars, languageCount, focusScore, activityLevel) {
    // Explorer: Many languages, many experiments, low consistency
    if (languageCount >= 4 && repoCount >= 8 && avgStars < 5) {
      return 'Explorer';
    }
    
    // Builder: Consistent building, moderate success
    if (languageCount <= 3 && repoCount >= 5 && avgStars >= 2 && focusScore >= 4) {
      return 'Builder';
    }
    
    // Architect: High quality, impactful projects
    if (languageCount <= 2 && repoCount >= 3 && avgStars >= 10 && focusScore >= 6) {
      return 'Architect';
    }
    
    // Hustler: Many repos, rapid shipping
    if (repoCount >= 15 && activityLevel === 'high' && avgStars >= 3) {
      return 'Hustler';
    }
    
    // Debugger: Low creation, high maintenance
    if (repoCount <= 3 && avgStars >= 5) {
      return 'Debugger';
    }
    
    return 'Explorer'; // Default
  }

  generateDescription(role, repoCount, avgStars, languageCount, totalStars, year) {
    const descriptions = {
      Explorer: `Explored ${languageCount} different languages and created ${repoCount} experimental projects`,
      Builder: `Built ${repoCount} consistent repositories with ${avgStars} average stars per project`,
      Architect: `Designed ${repoCount} high-impact projects averaging ${avgStars} stars each`,
      Hustler: `Shipped ${repoCount} projects rapidly with ${totalStars} total stars gained`,
      Debugger: `Maintained ${repoCount} quality projects with ${totalStars} cumulative stars`
    };
    
    return descriptions[role] || 'Continued development journey';
  }

  generateReason(role, repoCount, avgStars, languageCount, totalStars, year) {
    const reasons = {
      Explorer: `High experimentation with ${languageCount} languages shows curiosity and exploration`,
      Builder: `Consistent output of ${repoCount} repos demonstrates reliability and steady progress`,
      Architect: `High average of ${avgStars} stars across ${repoCount} projects shows quality focus`,
      Hustler: `Rapid creation of ${repoCount} repos generated ${totalStars} total stars indicates high productivity`,
      Debugger: `Low repo count but high star average (${avgStars}) shows focus on quality over quantity`
    };
    
    return reasons[role] || 'Active development';
  }

  getRoleColor(role) {
    const colors = {
      Explorer: 'green',
      Builder: 'blue', 
      Architect: 'purple',
      Hustler: 'orange',
      Debugger: 'red'
    };
    
    return colors[role] || 'gray';
  }

  calculateConfidence(repoCount, avgStars, totalStars) {
    let confidence = 50; // Base confidence
    
    // Boost confidence based on indicators
    if (repoCount >= 5) confidence += 10;
    if (avgStars >= 5) confidence += 15;
    if (totalStars >= 50) confidence += 15;
    if (repoCount >= 10) confidence += 10;
    
    return Math.min(confidence, 95);
  }

  getDefaultTimeline() {
    const currentYear = new Date().getFullYear();
    return [
      {
        year: currentYear - 2,
        role: 'Explorer',
        description: 'Started exploring programming and experimenting with different technologies',
        reason: 'Beginning of development journey',
        color: 'green',
        confidence: 60
      },
      {
        year: currentYear - 1,
        role: 'Builder',
        description: 'Began creating more structured and consistent projects',
        reason: 'Developing foundational skills and habits',
        color: 'blue',
        confidence: 75
      },
      {
        year: currentYear,
        role: 'Architect',
        description: 'Currently focusing on high-quality, impactful projects',
        reason: 'Applying accumulated knowledge and experience',
        color: 'purple',
        confidence: 85
      }
    ];
  }

  createTimelineEntry(analysis) {
    return {
      year: analysis.year,
      role: analysis.role,
      description: analysis.description,
      reason: analysis.reason,
      repoCount: analysis.repoCount,
      avgStars: analysis.avgStars,
      languageCount: analysis.languageCount,
      confidence: analysis.confidence,
      color: this.getRoleColor(analysis.role)
    };
  }
}

module.exports = new EvolutionAnalyzer();
