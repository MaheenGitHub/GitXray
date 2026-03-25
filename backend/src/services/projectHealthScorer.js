/**
 * Project Health Scoring System
 * Calculates comprehensive health metrics for GitHub repositories
 */

class ProjectHealthScorer {
  constructor() {
    this.weights = {
      completion: 0.35,      // 35% weight
      consistency: 0.30,    // 30% weight  
      quality: 0.35          // 35% weight
    }
  }

  /**
   * Calculate overall project health score
   */
  calculateProjectHealth(repositories, commitHistory = null) {
    const scores = {
      completion: this.calculateCompletionScore(repositories),
      consistency: this.calculateConsistencyScore(repositories, commitHistory),
      quality: this.calculateQualityScore(repositories)
    }

    const overall = Math.round(
      scores.completion * this.weights.completion +
      scores.consistency * this.weights.consistency +
      scores.quality * this.weights.quality
    )

    return {
      ...scores,
      overall,
      breakdown: this.generateBreakdown(scores),
      recommendations: this.generateRecommendations(scores),
      grade: this.getGrade(overall)
    }
  }

  /**
   * COMPLETION SCORE (0-100)
   * Measures how well projects are finished and maintained
   */
  calculateCompletionScore(repositories) {
    if (repositories.length === 0) return 0

    const metrics = {
      activeProjects: 0,
      recentActivity: 0,
      hasReadme: 0,
      hasLicense: 0,
      notArchived: 0
    }

    repositories.forEach(repo => {
      // Active projects (pushed in last 90 days)
      if (repo.pushed_at) {
        const lastPush = new Date(repo.pushed_at)
        const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        if (lastPush > ninetyDaysAgo) {
          metrics.recentActivity++
        }
      }

      // Not archived
      if (!repo.archived) {
        metrics.notArchived++
      }

      // Has README (simulated - in real API, check for README file)
      if (repo.has_readme || this.hasReadmeInDescription(repo.description)) {
        metrics.hasReadme++
      }

      // Has license (simulated)
      if (repo.license || repo.has_license) {
        metrics.hasLicense++
      }

      // Active projects (have some content and recent activity)
      if (repo.size > 0 && repo.pushed_at) {
        const lastPush = new Date(repo.pushed_at)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        if (lastPush > thirtyDaysAgo) {
          metrics.activeProjects++
        }
      }
    })

    const totalRepos = repositories.length

    // Calculate individual components
    const activityScore = (metrics.recentActivity / totalRepos) * 100
    const readmeScore = (metrics.hasReadme / totalRepos) * 100
    const licenseScore = (metrics.hasLicense / totalRepos) * 100
    const archivedScore = (metrics.notArchived / totalRepos) * 100
    const activeScore = (metrics.activeProjects / totalRepos) * 100

    // Weighted average for completion score
    const completionScore = Math.round(
      activityScore * 0.30 +      // Recent activity (30%)
      readmeScore * 0.20 +        // Documentation (20%)
      licenseScore * 0.15 +       // Legal compliance (15%)
      archivedScore * 0.15 +      // Not abandoned (15%)
      activeScore * 0.20          // Actively maintained (20%)
    )

    return Math.min(100, Math.max(0, completionScore))
  }

  /**
   * CONSISTENCY SCORE (0-100)
   * Measures regularity of development activity
   */
  calculateConsistencyScore(repositories, commitHistory) {
    if (repositories.length === 0) return 0

    let consistencyScore = 50 // Base score

    // Factor 1: Commit regularity (if commit history available)
    if (commitHistory && commitHistory.length > 0) {
      const commitRegularity = this.calculateCommitRegularity(commitHistory)
      consistencyScore = Math.max(0, consistencyScore + (commitRegularity - 50) * 0.5)
    }

    // Factor 2: Repository creation pattern
    const creationPattern = this.analyzeCreationPattern(repositories)
    consistencyScore += (creationPattern - 50) * 0.3

    // Factor 3: Update frequency
    const updateFrequency = this.calculateUpdateFrequency(repositories)
    consistencyScore += (updateFrequency - 50) * 0.2

    return Math.min(100, Math.max(0, Math.round(consistencyScore)))
  }

  /**
   * QUALITY SCORE (0-100)
   * Measures star-to-effort ratio and community engagement
   */
  calculateQualityScore(repositories) {
    if (repositories.length === 0) return 0

    let totalQualityScore = 0

    repositories.forEach(repo => {
      const repoQuality = this.calculateRepositoryQuality(repo)
      totalQualityScore += repoQuality
    })

    const averageQuality = totalQualityScore / repositories.length

    // Bonus for having multiple successful projects
    const diversityBonus = Math.min(10, repositories.length * 2)

    return Math.min(100, Math.round(averageQuality + diversityBonus))
  }

  /**
   * Calculate quality score for individual repository
   */
  calculateRepositoryQuality(repo) {
    let qualityScore = 0

    // Base score from size (effort indicator)
    const sizeScore = Math.min(50, Math.log10(Math.max(1, repo.size || 1)) * 10)
    qualityScore += sizeScore

    // Star-to-effort ratio
    const stars = repo.stargazers_count || 0
    const forks = repo.forks_count || 0
    const watchers = repo.watchers_count || 0
    
    // Calculate engagement score
    const engagementScore = Math.min(30, (stars + forks + watchers) * 2)
    qualityScore += engagementScore

    // Open issues (community engagement)
    if (repo.open_issues_count !== undefined) {
      const issuesScore = Math.min(10, repo.open_issues_count * 0.5)
      qualityScore += issuesScore
    }

    // Language popularity bonus
    const languageBonus = this.getLanguageBonus(repo.language)
    qualityScore += languageBonus

    // Age bonus (longevity)
    if (repo.created_at) {
      const ageInDays = (Date.now() - new Date(repo.created_at)) / (1000 * 60 * 60 * 24)
      const ageBonus = Math.min(10, ageInDays / 365 * 5)
      qualityScore += ageBonus
    }

    return Math.min(100, qualityScore)
  }

  /**
   * Calculate commit regularity score
   */
  calculateCommitRegularity(commitHistory) {
    if (commitHistory.length < 7) return 30 // Not enough data

    // Group commits by week
    const weeklyCommits = {}
    commitHistory.forEach(commit => {
      const week = this.getWeekNumber(new Date(commit.date))
      if (!weeklyCommits[week]) {
        weeklyCommits[week] = 0
      }
      weeklyCommits[week]++
    })

    const commitCounts = Object.values(weeklyCommits)
    const avgCommits = commitCounts.reduce((sum, count) => sum + count, 0) / commitCounts.length

    if (avgCommits === 0) return 0

    // Calculate standard deviation
    const variance = commitCounts.reduce((sum, count) => {
      return sum + Math.pow(count - avgCommits, 2)
    }, 0) / commitCounts.length

    const stdDev = Math.sqrt(variance)
    const coefficientOfVariation = stdDev / avgCommits

    // Lower variation = higher regularity
    const regularityScore = Math.max(0, 100 - (coefficientOfVariation * 100))
    return Math.min(100, regularityScore)
  }

  /**
   * Analyze repository creation pattern
   */
  analyzeCreationPattern(repositories) {
    if (repositories.length < 2) return 50

    const creationDates = repositories
      .filter(repo => repo.created_at)
      .map(repo => new Date(repo.created_at))
      .sort((a, b) => a - b)

    if (creationDates.length < 2) return 50

    // Calculate intervals between creations
    const intervals = []
    for (let i = 1; i < creationDates.length; i++) {
      const interval = creationDates[i] - creationDates[i - 1]
      intervals.push(interval)
    }

    // More consistent intervals = higher score
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2)
    }, 0) / intervals.length

    const stdDev = Math.sqrt(variance)
    const coefficientOfVariation = avgInterval > 0 ? stdDev / avgInterval : 1

    // Convert to 0-100 scale
    const patternScore = Math.max(0, 100 - (coefficientOfVariation * 50))
    return Math.min(100, patternScore)
  }

  /**
   * Calculate update frequency score
   */
  calculateUpdateFrequency(repositories) {
    if (repositories.length === 0) return 0

    let totalUpdateScore = 0

    repositories.forEach(repo => {
      if (!repo.pushed_at || !repo.created_at) return

      const created = new Date(repo.created_at)
      const lastPush = new Date(repo.pushed_at)
      const now = new Date()

      const totalDays = (now - created) / (1000 * 60 * 60 * 24)
      const daysSinceLastPush = (now - lastPush) / (1000 * 60 * 60 * 24)

      if (totalDays === 0) return

      // Recent activity bonus
      const recencyScore = Math.max(0, 100 - (daysSinceLastPush / totalDays * 100))
      
      // Longevity bonus (older repos with recent updates)
      const longevityBonus = Math.min(20, totalDays / 365 * 10)
      
      totalUpdateScore += recencyScore + longevityBonus
    })

    return Math.min(100, totalUpdateScore / repositories.length)
  }

  /**
   * Get bonus points based on language popularity
   */
  getLanguageBonus(language) {
    if (!language) return 0

    const popularLanguages = {
      'JavaScript': 8,
      'TypeScript': 7,
      'Python': 8,
      'Java': 6,
      'Go': 5,
      'Rust': 4,
      'C++': 5,
      'C#': 6,
      'PHP': 4,
      'Ruby': 3,
      'Swift': 4,
      'Kotlin': 4,
      'Dart': 3,
      'Vue': 5,
      'React': 6,
      'Angular': 5
    }

    return popularLanguages[language] || 2
  }

  /**
   * Check if repository likely has README based on description
   */
  hasReadmeInDescription(description) {
    if (!description) return false
    
    const readmeIndicators = [
      'readme', 'documentation', 'docs', 'guide', 'tutorial',
      'how to', 'usage', 'installation', 'getting started'
    ]
    
    const lowerDesc = description.toLowerCase()
    return readmeIndicators.some(indicator => lowerDesc.includes(indicator))
  }

  /**
   * Get week number from date
   */
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  /**
   * Generate detailed breakdown of scores
   */
  generateBreakdown(scores) {
    return {
      completion: {
        score: scores.completion,
        factors: {
          recentActivity: 'Recent pushes and updates',
          documentation: 'README files and documentation',
          maintenance: 'Active maintenance status',
          legal: 'License files present'
        },
        grade: this.getGrade(scores.completion)
      },
      consistency: {
        score: scores.consistency,
        factors: {
          commitPattern: 'Regularity of commits',
          creationPattern: 'Consistency in project creation',
          updateFrequency: 'Regular updates and maintenance'
        },
        grade: this.getGrade(scores.consistency)
      },
      quality: {
        score: scores.quality,
        factors: {
          starEffort: 'Stars relative to project size',
          communityEngagement: 'Forks, issues, and interactions',
          languageChoice: 'Popular and relevant languages',
          longevity: 'Project age and sustainability'
        },
        grade: this.getGrade(scores.quality)
      }
    }
  }

  /**
   * Generate recommendations based on scores
   */
  generateRecommendations(scores) {
    const recommendations = []

    if (scores.completion < 50) {
      recommendations.push({
        category: 'completion',
        priority: 'high',
        title: 'Improve Project Completion',
        description: 'Focus on finishing existing projects before starting new ones.',
        actions: [
          'Set realistic project goals',
          'Create project milestones',
          'Archive inactive projects',
          'Add README files to all projects'
        ]
      })
    }

    if (scores.consistency < 50) {
      recommendations.push({
        category: 'consistency',
        priority: 'medium',
        title: 'Establish Consistent Development Habits',
        description: 'Regular activity patterns lead to better project outcomes.',
        actions: [
          'Set weekly coding goals',
          'Use commit schedules',
          'Maintain regular update cycles',
          'Track development progress'
        ]
      })
    }

    if (scores.quality < 60) {
      recommendations.push({
        category: 'quality',
        priority: 'medium',
        title: 'Enhance Project Quality',
        description: 'Improve community engagement and project presentation.',
        actions: [
          'Write comprehensive documentation',
          'Choose popular technologies',
          'Engage with the community',
          'Maintain regular updates'
        ]
      })
    }

    if (scores.overall > 80) {
      recommendations.push({
        category: 'maintenance',
        priority: 'low',
        title: 'Maintain Excellence',
        description: 'You\'re doing great! Keep up the excellent work.',
        actions: [
          'Share your knowledge with others',
          'Contribute to open source',
          'Mentor other developers',
          'Continue best practices'
        ]
      })
    }

    return recommendations
  }

  /**
   * Get letter grade for score
   */
  getGrade(score) {
    if (score >= 90) return 'A+'
    if (score >= 85) return 'A'
    if (score >= 80) return 'A-'
    if (score >= 75) return 'B+'
    if (score >= 70) return 'B'
    if (score >= 65) return 'B-'
    if (score >= 60) return 'C+'
    if (score >= 55) return 'C'
    if (score >= 50) return 'C-'
    if (score >= 45) return 'D+'
    if (score >= 40) return 'D'
    return 'F'
  }
}

module.exports = ProjectHealthScorer
