/**
 * Collaboration Analyzer
 * Analyzes GitHub collaboration patterns from forks, pull requests, and ownership data
 */

class CollaborationAnalyzer {
  constructor() {
    this.weights = {
      forks: 0.25,           // 25% weight
      pullRequests: 0.35,      // 35% weight
      ownership: 0.20,         // 20% weight
      communityEngagement: 0.20   // 20% weight
    }
  }

  /**
   * Analyze collaboration patterns
   */
  async analyzeCollaboration(userData, repositories, pullRequestData = null) {
    const metrics = {
      forks: this.analyzeForks(repositories),
      pullRequests: await this.analyzePullRequests(pullRequestData, userData),
      ownership: this.analyzeOwnership(repositories),
      communityEngagement: this.analyzeCommunityEngagement(repositories, userData)
    }

    const collaborationScore = this.calculateCollaborationScore(metrics)

    return {
      score: collaborationScore,
      insight: this.generateInsight(collaborationScore, metrics),
      metrics: metrics,
      breakdown: this.generateBreakdown(metrics),
      style: this.determineCollaborationStyle(collaborationScore),
      recommendations: this.generateRecommendations(collaborationScore, metrics)
    }
  }

  /**
   * Analyze fork patterns
   */
  analyzeForks(repositories) {
    const totalForks = repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0)
    const forkedRepos = repositories.filter(repo => repo.fork).length
    const originalRepos = repositories.filter(repo => !repo.fork).length

    // Fork ratio analysis
    const forkRatio = originalRepos > 0 ? (forkedRepos / (originalRepos + forkedRepos)) * 100 : 0

    // Fork success rate (how many repos get forked)
    const forkSuccessRate = originalRepos > 0 ? 
      (repositories.filter(repo => !repo.fork && (repo.forks_count || 0) > 0).length / originalRepos) * 100 : 0

    // Average forks per original repository
    const avgForksPerRepo = originalRepos > 0 ? totalForks / originalRepos : 0

    return {
      totalForks,
      forkedRepos,
      originalRepos,
      forkRatio,
      forkSuccessRate,
      avgForksPerRepo,
      score: this.calculateForkScore(totalForks, originalRepos, forkSuccessRate)
    }
  }

  /**
   * Analyze pull request patterns
   */
  async analyzePullRequests(pullRequestData, userData) {
    // If PR data is not available, estimate from repository activity
    if (!pullRequestData) {
      return this.estimatePullRequestActivity(userData)
    }

    const totalPRs = pullRequestData.length || 0
    const mergedPRs = pullRequestData.filter(pr => pr.merged).length || 0
    const openPRs = pullRequestData.filter(pr => pr.state === 'open').length || 0

    // PR success rate
    const prSuccessRate = totalPRs > 0 ? (mergedPRs / totalPRs) * 100 : 0

    // PR activity level
    const prActivityLevel = Math.min(100, (totalPRs / 10) * 100)

    // Community contribution (PRs to other repos)
    const externalPRs = pullRequestData.filter(pr => pr.repo_owner !== userData.login).length || 0
    const contributionRatio = totalPRs > 0 ? (externalPRs / totalPRs) * 100 : 0

    return {
      totalPRs,
      mergedPRs,
      openPRs,
      prSuccessRate,
      prActivityLevel,
      externalPRs,
      contributionRatio,
      score: this.calculatePRScore(totalPRs, prSuccessRate, contributionRatio)
    }
  }

  /**
   * Estimate pull request activity when PR data is not available
   */
  estimatePullRequestActivity(userData) {
    // Estimate based on user's followers and following count
    const followers = userData.followers || 0
    const following = userData.following || 0
    const publicRepos = userData.public_repos || 0

    // Social engagement score
    const socialEngagement = (followers + following) / 2

    // Estimated PR activity (heuristic)
    const estimatedPRs = Math.min(50, Math.max(0, socialEngagement * 0.3 + publicRepos * 0.5))
    const estimatedMergedPRs = estimatedPRs * 0.7 // Assume 70% merge rate
    const estimatedExternalPRs = estimatedPRs * 0.4 // Assume 40% external contributions

    return {
      totalPRs: Math.round(estimatedPRs),
      mergedPRs: Math.round(estimatedMergedPRs),
      openPRs: Math.round(estimatedPRs * 0.2),
      prSuccessRate: 70,
      prActivityLevel: Math.min(100, (estimatedPRs / 10) * 100),
      externalPRs: Math.round(estimatedExternalPRs),
      contributionRatio: 40,
      score: Math.min(100, estimatedPRs * 2)
    }
  }

  /**
   * Analyze repository ownership patterns
   */
  analyzeOwnership(repositories) {
    const totalRepos = repositories.length
    const ownedRepos = repositories.filter(repo => !repo.fork).length
    const forkedRepos = repositories.filter(repo => repo.fork).length

    // Ownership ratio (how many repos are original)
    const ownershipRatio = totalRepos > 0 ? (ownedRepos / totalRepos) * 100 : 0

    // Collaboration potential (having both owned and forked repos)
    const collaborationPotential = (ownedRepos > 0 && forkedRepos > 0) ? 80 : 
                              (ownedRepos > 0) ? 40 : 20

    // Repository diversity (different types of projects)
    const languages = new Set()
    repositories.forEach(repo => {
      if (repo.language) languages.add(repo.language)
    })
    const diversityScore = Math.min(100, languages.size * 10)

    return {
      totalRepos,
      ownedRepos,
      forkedRepos,
      ownershipRatio,
      collaborationPotential,
      diversityScore,
      score: this.calculateOwnershipScore(ownershipRatio, collaborationPotential, diversityScore)
    }
  }

  /**
   * Analyze community engagement patterns
   */
  analyzeCommunityEngagement(repositories, userData) {
    // Social metrics
    const followers = userData.followers || 0
    const following = userData.following || 0

    // Repository engagement
    const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
    const totalWatchers = repositories.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0)
    const totalIssues = repositories.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0)

    // Engagement ratios
    const followerRatio = followers > 0 ? Math.min(100, followers / 10) : 0
    const starRatio = totalStars > 0 ? Math.min(100, totalStars / 50) : 0
    const issueRatio = totalIssues > 0 ? Math.min(100, totalIssues / 20) : 0

    // Community activity score
    const communityActivity = (followerRatio + starRatio + issueRatio) / 3

    // Interaction balance (followers vs following)
    const interactionBalance = (followers + following) > 0 ? 
      Math.min(100, (Math.min(followers, following) / Math.max(followers, following)) * 100) : 0

    return {
      followers,
      following,
      totalStars,
      totalWatchers,
      totalIssues,
      followerRatio,
      starRatio,
      issueRatio,
      communityActivity,
      interactionBalance,
      score: this.calculateCommunityScore(communityActivity, interactionBalance)
    }
  }

  /**
   * Calculate overall collaboration score
   */
  calculateCollaborationScore(metrics) {
    const score = 
      metrics.forks.score * this.weights.forks +
      metrics.pullRequests.score * this.weights.pullRequests +
      metrics.ownership.score * this.weights.ownership +
      metrics.communityEngagement.score * this.weights.communityEngagement

    return Math.min(100, Math.max(0, Math.round(score)))
  }

  /**
   * Calculate fork score component
   */
  calculateForkScore(totalForks, originalRepos, forkSuccessRate) {
    if (originalRepos === 0) return 0

    const forkVolume = Math.min(50, (totalForks / originalRepos) * 10)
    const successBonus = (forkSuccessRate / 100) * 30
    const volumeBonus = Math.min(20, totalForks / 10)

    return forkVolume + successBonus + volumeBonus
  }

  /**
   * Calculate pull request score component
   */
  calculatePRScore(totalPRs, prSuccessRate, contributionRatio) {
    const activityScore = Math.min(40, (totalPRs / 5) * 20)
    const successBonus = (prSuccessRate / 100) * 30
    const contributionBonus = (contributionRatio / 100) * 30

    return activityScore + successBonus + contributionBonus
  }

  /**
   * Calculate ownership score component
   */
  calculateOwnershipScore(ownershipRatio, collaborationPotential, diversityScore) {
    const ownershipScore = (ownershipRatio / 100) * 40
    const potentialScore = collaborationPotential * 0.3
    const diversityScoreBonus = diversityScore * 0.3

    return ownershipScore + potentialScore + diversityScoreBonus
  }

  /**
   * Calculate community engagement score component
   */
  calculateCommunityScore(communityActivity, interactionBalance) {
    return (communityActivity * 0.7) + (interactionBalance * 0.3)
  }

  /**
   * Generate collaboration insight
   */
  generateInsight(score, metrics) {
    const insights = {
      solo: [
        "You prefer working independently on your own projects.",
        "Your development style focuses on personal projects and self-directed learning.",
        "You're a solo developer who builds and maintains your own codebase."
      ],
      selective: [
        "You collaborate selectively, choosing projects that align with your interests.",
        "You balance independent work with occasional community contributions.",
        "You're thoughtful about collaboration, contributing when it matters most."
      ],
      active: [
        "You actively collaborate with the open source community.",
        "You thrive on community interaction and collaborative development.",
        "You're a team player who enjoys contributing to shared projects."
      ],
      leader: [
        "You're a community leader who inspires collaboration.",
        "Your projects attract significant community engagement and contributions.",
        "You're a collaboration catalyst who brings developers together."
      ]
    }

    let style = 'solo'
    if (score >= 75) style = 'leader'
    else if (score >= 50) style = 'active'
    else if (score >= 25) style = 'selective'

    const insightMessages = insights[style]
    const randomIndex = Math.floor(Math.random() * insightMessages.length)
    const baseMessage = insightMessages[randomIndex]

    // Add contextual details
    let contextualMessage = baseMessage

    if (metrics.forks.totalForks > 50) {
      contextualMessage += ` Your projects have been forked ${metrics.forks.totalForks} times, showing strong community interest.`
    }

    if (metrics.pullRequests.totalPRs > 20) {
      contextualMessage += ` With ${metrics.pullRequests.totalPRs} pull requests, you're clearly active in community development.`
    }

    if (metrics.communityEngagement.followers > 100) {
      contextualMessage += ` Your ${metrics.communityEngagement.followers} followers indicate you're building a strong developer network.`
    }

    return contextualMessage
  }

  /**
   * Determine collaboration style
   */
  determineCollaborationStyle(score) {
    const styles = {
      solo: {
        name: 'Solo Developer',
        description: 'Prefers independent work and personal projects',
        color: '#3B82F6',
        icon: '👤'
      },
      selective: {
        name: 'Selective Collaborator',
        description: 'Chooses collaborations strategically',
        color: '#8B5CF6',
        icon: '🤔'
      },
      active: {
        name: 'Active Collaborator',
        description: 'Regularly contributes to community projects',
        color: '#10B981',
        icon: '🤝'
      },
      leader: {
        name: 'Community Leader',
        description: 'Inspires and leads collaborative efforts',
        color: '#F59E0B',
        icon: '👑'
      }
    }

    let style = 'solo'
    if (score >= 75) style = 'leader'
    else if (score >= 50) style = 'active'
    else if (score >= 25) style = 'selective'

    return styles[style]
  }

  /**
   * Generate detailed breakdown
   */
  generateBreakdown(metrics) {
    return {
      forks: {
        score: metrics.forks.score,
        label: 'Fork Activity',
        description: 'How often your projects are forked by others',
        details: {
          totalForks: metrics.forks.totalForks,
          forkSuccessRate: `${metrics.forks.forkSuccessRate.toFixed(1)}%`,
          avgForksPerRepo: metrics.forks.avgForksPerRepo.toFixed(1)
        }
      },
      pullRequests: {
        score: metrics.pullRequests.score,
        label: 'Pull Request Activity',
        description: 'Your contributions to other projects',
        details: {
          totalPRs: metrics.pullRequests.totalPRs,
          prSuccessRate: `${metrics.pullRequests.prSuccessRate.toFixed(1)}%`,
          externalPRs: metrics.pullRequests.externalPRs
        }
      },
      ownership: {
        score: metrics.ownership.score,
        label: 'Project Ownership',
        description: 'Balance between owning and contributing to projects',
        details: {
          ownedRepos: metrics.ownership.ownedRepos,
          forkedRepos: metrics.ownership.forkedRepos,
          ownershipRatio: `${metrics.ownership.ownershipRatio.toFixed(1)}%`
        }
      },
      communityEngagement: {
        score: metrics.communityEngagement.score,
        label: 'Community Engagement',
        description: 'Social interaction and community involvement',
        details: {
          followers: metrics.communityEngagement.followers,
          totalStars: metrics.communityEngagement.totalStars,
          interactionBalance: `${metrics.communityEngagement.interactionBalance.toFixed(1)}%`
        }
      }
    }
  }

  /**
   * Generate recommendations based on collaboration score
   */
  generateRecommendations(score, metrics) {
    const recommendations = []

    if (score < 30) {
      recommendations.push({
        category: 'engagement',
        priority: 'high',
        title: 'Increase Community Involvement',
        description: 'Your collaboration activity is minimal. Start engaging with the developer community.',
        actions: [
          'Contribute to open source projects',
          'Participate in code reviews',
          'Join developer communities and forums',
          'Follow and interact with other developers'
        ]
      })
    }

    if (metrics.forks.totalForks < 10 && metrics.ownership.ownedRepos > 5) {
      recommendations.push({
        category: 'visibility',
        priority: 'medium',
        title: 'Improve Project Visibility',
        description: 'Your projects aren\'t getting much community attention.',
        actions: [
          'Write comprehensive README files',
          'Add proper documentation',
          'Share your work on social media',
          'Submit to relevant directories and newsletters'
        ]
      })
    }

    if (metrics.pullRequests.totalPRs < 10) {
      recommendations.push({
        category: 'contribution',
        priority: 'medium',
        title: 'Contribute More Pull Requests',
        description: 'Increase your contributions to other projects.',
        actions: [
          'Find projects you use and improve them',
          'Fix bugs in open source software',
          'Help with documentation',
          'Review and comment on existing PRs'
        ]
      })
    }

    if (metrics.communityEngagement.followers < 50) {
      recommendations.push({
        category: 'networking',
        priority: 'low',
        title: 'Build Your Developer Network',
        description: 'Expand your professional connections.',
        actions: [
          'Engage with developers on Twitter/X',
          'Participate in GitHub discussions',
          'Attend virtual or local meetups',
          'Share your learning journey'
        ]
      })
    }

    if (score >= 75) {
      recommendations.push({
        category: 'leadership',
        priority: 'low',
        title: 'Leverage Your Influence',
        description: 'You\'re a collaboration leader - use it to make bigger impact.',
        actions: [
          'Mentor other developers',
          'Start your own open source projects',
          'Speak at conferences or meetups',
          'Write about collaboration best practices'
        ]
      })
    }

    return recommendations
  }
}

module.exports = CollaborationAnalyzer
