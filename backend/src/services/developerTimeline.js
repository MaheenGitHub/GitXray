/**
 * Developer Timeline Analyzer
 * Analyzes GitHub repository dates and commit history to generate developer journey stages
 */

class DeveloperTimeline {
  constructor() {
    this.stageDefinitions = {
      'Beginner': {
        description: 'Just starting out, learning the basics',
        characteristics: ['Small projects', 'Learning Git', 'Experimenting with languages'],
        color: '#10B981',
        icon: '🌱'
      },
      'Explorer': {
        description: 'Discovering different technologies and approaches',
        characteristics: ['Diverse languages', 'Many small projects', 'Active learning'],
        color: '#3B82F6',
        icon: '🧭'
      },
      'Builder': {
        description: 'Consistently building and completing projects',
        characteristics: ['Larger projects', 'Consistent commits', 'Established patterns'],
        color: '#8B5CF6',
        icon: '🏗️'
      },
      'Specialist': {
        description: 'Deepening expertise in specific areas',
        characteristics: ['Focused languages', 'Quality over quantity', 'Complex projects'],
        color: '#F59E0B',
        icon: '🎯'
      },
      'Inconsistent': {
        description: 'Variable activity patterns, possible burnout',
        characteristics: ['Irregular commits', 'Abandoned projects', 'Fluctuating focus'],
        color: '#EF4444',
        icon: '📊'
      },
      'Master': {
        description: 'Expert-level contributions and mentorship',
        characteristics: ['Open source leadership', 'Complex architectures', 'Teaching others'],
        color: '#EC4899',
        icon: '👑'
      }
    }
  }

  /**
   * Generate developer timeline from repositories and commit data
   */
  async generateTimeline(repositories, commitHistory = null) {
    // Sort repositories by creation date
    const sortedRepos = repositories
      .filter(repo => repo.created_at)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

    // Group repositories by year
    const yearlyData = this.groupReposByYear(sortedRepos)
    
    // Analyze each year and determine stage
    const timeline = []
    
    for (const [year, yearRepos] of Object.entries(yearlyData)) {
      const stage = this.determineStage(yearRepos, commitHistory, year)
      
      timeline.push({
        year: parseInt(year),
        stage: stage.name,
        description: stage.description,
        characteristics: stage.characteristics,
        metrics: stage.metrics,
        confidence: stage.confidence,
        color: this.stageDefinitions[stage.name].color,
        icon: this.stageDefinitions[stage.name].icon
      })
    }

    // Smooth transitions between years
    return this.smoothTimeline(timeline)
  }

  /**
   * Group repositories by creation year
   */
  groupReposByYear(repositories) {
    const grouped = {}
    
    repositories.forEach(repo => {
      const year = new Date(repo.created_at).getFullYear()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(repo)
    })
    
    return grouped
  }

  /**
   * Determine the development stage for a given year
   */
  determineStage(yearRepos, commitHistory, year) {
    const metrics = this.calculateYearMetrics(yearRepos, commitHistory, year)
    
    // Stage determination logic
    let stage = this.analyzeStage(metrics)
    
    return {
      name: stage,
      metrics: metrics,
      confidence: this.calculateConfidence(metrics, stage)
    }
  }

  /**
   * Calculate metrics for a given year
   */
  calculateYearMetrics(yearRepos, commitHistory, year) {
    const totalRepos = yearRepos.length
    const activeRepos = yearRepos.filter(repo => 
      repo.pushed_at && 
      new Date(repo.pushed_at).getFullYear() === year
    ).length
    
    // Language diversity
    const languages = new Set()
    yearRepos.forEach(repo => {
      if (repo.language) languages.add(repo.language)
    })
    const languageCount = languages.size
    
    // Project sizes
    const sizes = yearRepos.map(repo => repo.size || 0)
    const avgSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length
    const maxSize = Math.max(...sizes)
    
    // Community engagement
    const totalStars = yearRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
    const totalForks = yearRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0)
    
    // Commit consistency (if commit data available)
    let commitConsistency = 0.5 // default
    if (commitHistory && commitHistory[year]) {
      commitConsistency = this.calculateCommitConsistency(commitHistory[year])
    }
    
    // Project completion rate
    const completionRate = totalRepos > 0 ? (activeRepos / totalRepos) * 100 : 0
    
    return {
      totalRepos,
      activeRepos,
      completionRate,
      languageCount,
      avgSize,
      maxSize,
      totalStars,
      totalForks,
      commitConsistency,
      communityEngagement: (totalStars + totalForks) / totalRepos
    }
  }

  /**
   * Analyze metrics to determine stage
   */
  analyzeStage(metrics) {
    const { 
      totalRepos, 
      completionRate, 
      languageCount, 
      avgSize, 
      communityEngagement,
      commitConsistency 
    } = metrics

    // Beginner stage
    if (totalRepos <= 5 && avgSize < 100 && completionRate < 50) {
      return 'Beginner'
    }

    // Explorer stage
    if (languageCount >= 5 && avgSize < 500 && totalRepos > 5) {
      return 'Explorer'
    }

    // Builder stage
    if (completionRate > 70 && commitConsistency > 0.6 && avgSize > 100) {
      return 'Builder'
    }

    // Specialist stage
    if (languageCount <= 3 && avgSize > 500 && communityEngagement > 10) {
      return 'Specialist'
    }

    // Master stage
    if (completionRate > 80 && communityEngagement > 50 && avgSize > 1000) {
      return 'Master'
    }

    // Inconsistent stage (catch-all for irregular patterns)
    if (completionRate < 40 || commitConsistency < 0.3) {
      return 'Inconsistent'
    }

    // Default to Builder if no strong signals
    return 'Builder'
  }

  /**
   * Calculate confidence score for stage determination
   */
  calculateConfidence(metrics, stage) {
    const { completionRate, languageCount, communityEngagement, commitConsistency } = metrics
    
    const confidenceFactors = {
      'Beginner': [
        metrics.totalRepos <= 5 ? 0.9 : 0.3,
        metrics.avgSize < 100 ? 0.8 : 0.4,
        metrics.completionRate < 50 ? 0.7 : 0.5
      ],
      'Explorer': [
        metrics.languageCount >= 5 ? 0.9 : 0.3,
        metrics.avgSize < 500 ? 0.7 : 0.5,
        metrics.totalRepos > 5 ? 0.8 : 0.4
      ],
      'Builder': [
        metrics.completionRate > 70 ? 0.9 : 0.3,
        metrics.commitConsistency > 0.6 ? 0.8 : 0.4,
        metrics.avgSize > 100 ? 0.7 : 0.5
      ],
      'Specialist': [
        metrics.languageCount <= 3 ? 0.9 : 0.3,
        metrics.avgSize > 500 ? 0.8 : 0.4,
        metrics.communityEngagement > 10 ? 0.7 : 0.5
      ],
      'Master': [
        metrics.completionRate > 80 ? 0.9 : 0.3,
        metrics.communityEngagement > 50 ? 0.8 : 0.4,
        metrics.avgSize > 1000 ? 0.7 : 0.5
      ],
      'Inconsistent': [
        metrics.completionRate < 40 ? 0.9 : 0.3,
        metrics.commitConsistency < 0.3 ? 0.8 : 0.4,
        metrics.totalRepos > 10 ? 0.6 : 0.5
      ]
    }

    const factors = confidenceFactors[stage] || [0.5]
    const averageConfidence = factors.reduce((sum, factor) => sum + factor, 0) / factors.length
    
    return Math.round(averageConfidence * 100)
  }

  /**
   * Calculate commit consistency for a year
   */
  calculateCommitConsistency(yearlyCommits) {
    if (!yearlyCommits || yearlyCommits.length === 0) return 0.5

    // Group commits by week
    const weeklyCommits = {}
    yearlyCommits.forEach(commit => {
      const week = this.getWeekNumber(new Date(commit.date))
      if (!weeklyCommits[week]) {
        weeklyCommits[week] = 0
      }
      weeklyCommits[week]++
    })

    // Calculate variance in weekly commit counts
    const commitCounts = Object.values(weeklyCommits)
    const avgCommits = commitCounts.reduce((sum, count) => sum + count, 0) / commitCounts.length
    
    if (avgCommits === 0) return 0

    const variance = commitCounts.reduce((sum, count) => {
      return sum + Math.pow(count - avgCommits, 2)
    }, 0) / commitCounts.length

    // Convert variance to consistency score (lower variance = higher consistency)
    const maxVariance = Math.pow(avgCommits, 2)
    const consistency = maxVariance > 0 ? 1 - (variance / maxVariance) : 1

    return Math.max(0, Math.min(1, consistency))
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
   * Smooth transitions between years to avoid jarring stage changes
   */
  smoothTimeline(timeline) {
    if (timeline.length <= 1) return timeline

    const smoothed = []
    
    for (let i = 0; i < timeline.length; i++) {
      const current = timeline[i]
      
      // Look at previous year to smooth transition
      if (i > 0) {
        const previous = timeline[i - 1]
        
        // If stage change is dramatic and confidence is low, smooth it
        if (this.isDramaticChange(previous.stage, current.stage) && 
            (current.confidence < 70 || previous.confidence < 70)) {
          
          // Keep previous stage but update confidence
          smoothed.push({
            ...current,
            stage: previous.stage,
            description: this.stageDefinitions[previous.stage].description,
            note: `Transitioning from ${previous.stage} to ${current.stage}`,
            transitionStage: true
          })
          continue
        }
      }
      
      smoothed.push(current)
    }
    
    return smoothed
  }

  /**
   * Check if stage change is dramatic
   */
  isDramaticChange(fromStage, toStage) {
    const dramaticTransitions = [
      ['Beginner', 'Master'],
      ['Explorer', 'Inconsistent'],
      ['Builder', 'Beginner'],
      ['Specialist', 'Explorer'],
      ['Master', 'Inconsistent']
    ]
    
    return dramaticTransitions.some(([from, to]) => 
      (fromStage === from && toStage === to) || 
      (fromStage === to && toStage === from)
    )
  }

  /**
   * Generate summary of the developer journey
   */
  generateJourneySummary(timeline) {
    if (timeline.length === 0) return 'No timeline data available'

    const stages = timeline.map(item => item.stage)
    const uniqueStages = [...new Set(stages)]
    
    const totalYears = timeline.length
    const currentStage = timeline[timeline.length - 1].stage
    
    let summary = `Developer journey over ${totalYears} years:\n`
    
    uniqueStages.forEach((stage, index) => {
      const years = timeline.filter(item => item.stage === stage).length
      summary += `- ${stage}: ${years} year${years > 1 ? 's' : ''}\n`
    })
    
    summary += `\nCurrent stage: ${currentStage}`
    
    return summary
  }
}

module.exports = DeveloperTimeline
