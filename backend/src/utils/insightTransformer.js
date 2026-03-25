/**
 * Insight Transformer System
 * Transforms base insights into different modes: Professional, Fun, and Roast
 */

class InsightTransformer {
  constructor() {
    this.transformers = {
      professional: new ProfessionalTransformer(),
      fun: new FunTransformer(),
      roast: new RoastTransformer()
    }
  }

  transform(insights, mode = 'professional') {
    const transformer = this.transformers[mode] || this.transformers.professional
    return insights.map(insight => transformer.transform(insight))
  }
}

/**
 * Base Insight Structure
 */
class BaseInsight {
  constructor(data) {
    this.id = data.id
    this.type = data.type // 'completion', 'consistency', 'collaboration', etc.
    this.baseMessage = data.baseMessage
    this.severity = data.severity // 'low', 'medium', 'high'
    this.confidence = data.confidence // 0-100
    this.context = data.context // additional context data
  }
}

/**
 * Professional Mode Transformer
 * Formal, constructive, career-focused insights
 */
class ProfessionalTransformer {
  transform(insight) {
    const transformation = this.getTransformation(insight.type, insight.baseMessage)
    
    return {
      ...insight,
      title: transformation.title,
      message: transformation.message,
      advice: transformation.advice,
      icon: this.getIcon(insight.type),
      color: this.getColor(insight.type),
      tone: 'professional'
    }
  }

  getTransformation(type, baseMessage) {
    const transformations = {
      // Project Completion Insights
      'low_completion': {
        title: 'Project Completion Analysis',
        message: 'Your project initiation rate exceeds completion rate. Consider implementing project management strategies to improve follow-through.',
        advice: 'Focus on one project at a time, set realistic deadlines, and celebrate small wins to maintain momentum.'
      },
      
      'abandoned_projects': {
        title: 'Project Portfolio Management',
        message: 'Multiple projects show initiative, but completion rates could be improved for maximum impact.',
        advice: 'Use Kanban boards, set weekly goals, and consider archiving inactive projects to maintain focus.'
      },

      // Consistency Insights
      'inconsistent_activity': {
        title: 'Development Consistency Assessment',
        message: 'Coding patterns indicate sporadic development cycles. Establishing consistent workflows may improve code quality.',
        advice: 'Set aside dedicated coding time, use habit-forming techniques, and track your progress to maintain consistency.'
      },
      
      'burst_coding': {
        title: 'Work Pattern Analysis',
        message: 'Productivity occurs in concentrated bursts. Consider distributing effort more evenly for sustainable development.',
        advice: 'Break large tasks into smaller chunks, use time-blocking techniques, and maintain a steady coding schedule.'
      },

      // Collaboration Insights
      'solo_developer': {
        title: 'Collaboration Style Evaluation',
        message: 'Development focus is primarily on independent projects. Open source contributions could enhance collaborative skills.',
        advice: 'Start with documentation contributions, join developer communities, and participate in code reviews to build collaboration experience.'
      },
      
      'low_engagement': {
        title: 'Community Engagement Analysis',
        message: 'Limited community interaction may restrict growth opportunities. Consider increasing visibility and networking.',
        advice: 'Share your work on social platforms, attend meetups, and contribute to discussions in relevant communities.'
      },

      // Language Insights
      'language_specialist': {
        title: 'Technical Specialization Assessment',
        message: 'Deep expertise in primary language demonstrates focused skill development. Consider complementary technologies for versatility.',
        advice: 'Master your core language while learning adjacent technologies that enhance your primary skill set.'
      },
      
      'language_hopper': {
        title: 'Skill Diversity Analysis',
        message: 'Exceptional language diversity demonstrates adaptability. Consider deepening expertise in 2-3 core languages.',
        advice: 'Choose languages that complement each other, build projects that combine multiple technologies, and document your learning journey.'
      },

      // Activity Insights
      'night_owl': {
        title: 'Peak Productivity Hours',
        message: 'Peak productivity occurs during late hours. Consider aligning schedule with natural productivity patterns.',
        advice: 'Embrace your natural rhythm while ensuring adequate rest. Consider flexible work arrangements that accommodate your peak hours.'
      },
      
      'early_bird': {
        title: 'Morning Productivity Pattern',
        message: 'Consistent morning activity demonstrates disciplined work habits. Maintain this competitive advantage.',
        advice: 'Protect your morning routine, use peak hours for challenging tasks, and schedule collaborative work during your most productive time.'
      },

      // Code Quality Insights
      'small_projects': {
        title: 'Project Scope Analysis',
        message: 'Preference for focused, smaller projects enables rapid iteration and learning. Consider scaling successful concepts.',
        advice: 'Build on successful small projects, create MVPs that can grow, and document your development patterns.'
      },
      
      'monolithic_projects': {
        title: 'Project Architecture Assessment',
        message: 'Large-scale projects demonstrate ambition and planning skills. Consider modularization for maintainability.',
        advice: 'Break projects into independent modules, implement comprehensive testing, and document architecture decisions.'
      }
    }

    return transformations[type] || {
      title: 'Development Pattern Analysis',
      message: baseMessage,
      advice: 'Continue monitoring your development patterns and adjust strategies based on results.'
    }
  }

  getIcon(type) {
    const icons = {
      'low_completion': '📊',
      'abandoned_projects': '📋',
      'inconsistent_activity': '📈',
      'burst_coding': '⚡',
      'solo_developer': '👤',
      'low_engagement': '🌐',
      'language_specialist': '🎯',
      'language_hopper': '🌈',
      'night_owl': '🌙',
      'early_bird': '🌅',
      'small_projects': '🔧',
      'monolithic_projects': '🏗️'
    }
    return icons[type] || '💡'
  }

  getColor(type) {
    const colors = {
      'low_completion': '#3B82F6',
      'abandoned_projects': '#6366F1',
      'inconsistent_activity': '#8B5CF6',
      'burst_coding': '#A855F7',
      'solo_developer': '#EC4899',
      'low_engagement': '#F43F5E',
      'language_specialist': '#F59E0B',
      'language_hopper': '#10B981',
      'night_owl': '#6366F1',
      'early_bird': '#10B981',
      'small_projects': '#3B82F6',
      'monolithic_projects': '#8B5CF6'
    }
    return colors[type] || '#6B7280'
  }
}

/**
 * Fun Mode Transformer
 * Light, engaging, positive spin on insights
 */
class FunTransformer {
  transform(insight) {
    const transformation = this.getTransformation(insight.type, insight.baseMessage)
    
    return {
      ...insight,
      title: transformation.title,
      message: transformation.message,
      advice: transformation.advice,
      icon: this.getFunIcon(insight.type),
      color: this.getFunColor(insight.type),
      tone: 'fun'
    }
  }

  getTransformation(type, baseMessage) {
    const transformations = {
      // Project Completion Insights
      'low_completion': {
        title: '🚀 Project Launch Master',
        message: 'You\'re like a kid in a candy store - so many exciting projects to start! 🍬',
        advice: 'Try the "2-week rule" - spend 2 weeks on each new project before starting another. Your future self will thank you! ✨'
      },
      
      'abandoned_projects': {
        title: '💫 Idea Generator',
        message: 'Your brain is a fountain of creativity! Sometimes you just need to pick one stream and follow it to the end 🌊',
        advice: 'Create a "project graveyard" GitHub repo to memorialize your adventures. It\'s not failure, it\'s R&D! 🧪'
      },

      // Consistency Insights
      'inconsistent_activity': {
        title: '⚡ Lightning Coder',
        message: 'You code like a superhero - saving the world in bursts of brilliant code! ⚡',
        advice: 'Set a "code streak" goal - even 15 minutes daily counts. Your future projects will love the consistency! 📅'
      },
      
      'burst_coding': {
        title: '🎮 Coding Gamer',
        message: 'You approach coding like a boss battle - intense focus, epic results, then well-deserved rest! 🎮',
        advice: 'Try "sprint planning" - schedule your coding bursts and recovery time. It\'s not lazy, it\'s strategic! 🗺️'
      },

      // Collaboration Insights
      'solo_developer': {
        title: '🦸‍♂️ Indie Developer',
        message: 'You\'re building your own universe! Every line of code is your personal masterpiece 🌌',
        advice: 'Join a "hackathon" or "game jam" - it\'s like collaboration training wheels with fun! 🎪'
      },
      
      'low_engagement': {
        title: '🌟 Hidden Gem',
        message: 'You\'re like a rare Pokemon - amazing skills but not everyone has discovered you yet! 🔮',
        advice: 'Share your "aha!" moments on Twitter or LinkedIn. Your insights could help someone else level up! 📢'
      },

      // Language Insights
      'language_specialist': {
        title: '🎯 Language Ninja',
        message: 'You\'ve mastered a language so well you could probably teach it to your cat! 🐱💻',
        advice: 'Try teaching a workshop or writing tutorials. Teaching is the best way to become a true master! 🎓'
      },
      
      'language_hopper': {
        title: '🌈 Code Rainbow',
        message: 'You speak more programming languages than most people speak human languages! 🗣️',
        advice: 'Create a "language tour" project - same app in 5 different languages. It\'ll be your coding passport! 🛂'
      },

      // Activity Insights
      'night_owl': {
        title: '🦉 Night Ninja',
        message: 'You\'re part of the midnight coding club! Welcome to the dark side, we have cookies! 🍪',
        advice: 'Join the "2 AM Club" on Discord - you\'ll find your people and share productivity tips! 🌙'
      },
      
      'early_bird': {
        title: '🌅 Early Bird',
        message: 'You catch the bugs while everyone else is still dreaming! Your code is caffeinated before most people wake up ☕',
        advice: 'Share your morning routine - you could inspire other early birds to join your productivity flock! 🐦'
      },

      // Code Quality Insights
      'small_projects': {
        title: '🔧 Quick Build Master',
        message: 'You\'re like a LEGO master - building amazing things, one brick at a time! 🧱',
        advice: 'Try combining your small projects into a "super project" - like Voltron but with code! 🤖'
      },
      
      'monolithic_projects': {
        title: '🏗️ Castle Builder',
        message: 'You don\'t just build projects, you build empires! Your code has its own zip code! 🏰',
        advice: 'Document your "building philosophy" - others could learn from your ambitious approach! 📚'
      }
    }

    return transformations[type] || {
      title: '✨ Coding Adventure',
      message: baseMessage,
      advice: 'Keep exploring and having fun with your coding journey! 🎉'
    }
  }

  getFunIcon(type) {
    const icons = {
      'low_completion': '🚀',
      'abandoned_projects': '💫',
      'inconsistent_activity': '⚡',
      'burst_coding': '🎮',
      'solo_developer': '🦸‍♂️',
      'low_engagement': '🌟',
      'language_specialist': '🎯',
      'language_hopper': '🌈',
      'night_owl': '🦉',
      'early_bird': '🌅',
      'small_projects': '🔧',
      'monolithic_projects': '🏗️'
    }
    return icons[type] || '✨'
  }

  getFunColor(type) {
    const colors = {
      'low_completion': '#8B5CF6',
      'abandoned_projects': '#A855F7',
      'inconsistent_activity': '#EC4899',
      'burst_coding': '#F43F5E',
      'solo_developer': '#F59E0B',
      'low_engagement': '#10B981',
      'language_specialist': '#3B82F6',
      'language_hopper': '#06B6D4',
      'night_owl': '#6366F1',
      'early_bird': '#10B981',
      'small_projects': '#F59E0B',
      'monolithic_projects': '#8B5CF6'
    }
    return colors[type] || '#EC4899'
  }
}

/**
 * Roast Mode Transformer
 * Sarcastic, humorous but not offensive insights
 */
class RoastTransformer {
  transform(insight) {
    const transformation = this.getTransformation(insight.type, insight.baseMessage)
    
    return {
      ...insight,
      title: transformation.title,
      message: transformation.message,
      advice: transformation.advice,
      icon: this.getRoastIcon(insight.type),
      color: this.getRoastColor(insight.type),
      tone: 'roast'
    }
  }

  getTransformation(type, baseMessage) {
    const transformations = {
      // Project Completion Insights
      'low_completion': {
        title: '🪦 Project Graveyard Keeper',
        message: 'Your GitHub profile looks like a cemetery of abandoned dreams. Maybe finish something for once?',
        advice: 'Try the "one project at a time" rule. Your future self will thank you for not creating more digital ghosts.'
      },
      
      'abandoned_projects': {
        title: '💀 Serial Project Killer',
        message: 'You start projects like I start diets - with enthusiasm that dies by Tuesday.',
        advice: 'Pick one project and actually finish it. The shock might break the internet!'
      },

      // Consistency Insights
      'inconsistent_activity': {
        title: '🐌 Commit Sloth',
        message: 'Your commit graph looks like my WiFi signal - mostly offline with occasional spikes.',
        advice: 'Try coding consistently. I know it\'s a radical concept, but it might just work!'
      },
      
      'burst_coding': {
        title: '🌪️ Code Hurricane',
        message: 'You code like a natural disaster - intense, destructive to your sleep schedule, and then gone.',
        advice: 'Maybe spread out that energy? Your keyboard needs a break too.'
      },

      // Collaboration Insights
      'solo_developer': {
        title: '🏝️ Island Developer',
        message: 'Your collaboration score is lower than my motivation on Monday mornings.',
        advice: 'Try talking to other developers. They won\'t bite, I promise. Probably.'
      },
      
      'low_engagement': {
        title: '👻 Code Ghost',
        message: 'You\'re less visible than a comment section on a controversial YouTube video.',
        advice: 'Share your work! The worst that can happen is... actually, don\'t think about that.'
      },

      // Language Insights
      'language_specialist': {
        title: '🦎 One-Trick Pony',
        message: 'You\'re the Jack of all trades, master of one. Pick a lane, buddy!',
        advice: 'Learn another language before your current one gets jealous and deletes your code.'
      },
      
      'language_hopper': {
        title: '🤔 Language Hoarder',
        message: 'You collect programming languages like my grandma collects cats - impressive but concerning.',
        advice: 'Maybe master ONE language before starting your own programming language museum?'
      },

      // Activity Insights
      'night_owl': {
        title: '🦇 Vampire Coder',
        message: 'Normal people sleep. You write bugs at 2 AM. At least you\'re consistent about being inconsistent.',
        advice: 'Vampires are cool, but sunlight has vitamin D. Just saying.'
      },
      
      'early_bird': {
        title: '🐓 Rooster Coder',
        message: 'You wake up so early the sun is like, "Dude, give me a break!"',
        advice: 'Not everyone needs to know you code at 5 AM. Some mysteries are worth keeping.'
      },

      // Code Quality Insights
      'small_projects': {
        title: '🧱 LEGO Builder',
        message: 'Your projects are like IKEA furniture - look impressive but probably missing screws.',
        advice: 'Try building something bigger than a todo app. I believe in you! Mostly.'
      },
      
      'monolithic_projects': {
        title: '🏰 Castle Overbuilder',
        message: 'You don\'t build projects, you build digital prisons for future maintainers.',
        advice: 'Ever heard of "microservices"? Look it up. Your future collaborators will thank you.'
      }
    }

    return transformations[type] || {
      title: '🔥 Code Critic',
      message: 'Your code has... character. That\'s what we\'ll call it.',
      advice: 'Keep coding! Everyone starts somewhere. Some of us just start lower than others.'
    }
  }

  getRoastIcon(type) {
    const icons = {
      'low_completion': '🪦',
      'abandoned_projects': '💀',
      'inconsistent_activity': '🐌',
      'burst_coding': '🌪️',
      'solo_developer': '🏝️',
      'low_engagement': '👻',
      'language_specialist': '🦎',
      'language_hopper': '🤔',
      'night_owl': '🦇',
      'early_bird': '🐓',
      'small_projects': '🧱',
      'monolithic_projects': '🏰'
    }
    return icons[type] || '🔥'
  }

  getRoastColor(type) {
    const colors = {
      'low_completion': '#DC2626',
      'abandoned_projects': '#B91C1C',
      'inconsistent_activity': '#991B1B',
      'burst_coding': '#7F1D1D',
      'solo_developer': '#DC2626',
      'low_engagement': '#B91C1C',
      'language_specialist': '#EA580C',
      'language_hopper': '#C2410C',
      'night_owl': '#7C2D12',
      'early_bird': '#92400E',
      'small_projects': '#B45309',
      'monolithic_projects': '#78350F'
    }
    return colors[type] || '#DC2626'
  }
}

/**
 * Insight Factory
 * Creates base insights from analysis data
 */
class InsightFactory {
  static createInsights(userData, repositories, personality) {
    const insights = []

    // Project Completion Analysis
    const completionRate = this.calculateCompletionRate(repositories)
    if (completionRate < 50) {
      insights.push(new BaseInsight({
        id: 'low_completion',
        type: 'low_completion',
        baseMessage: 'Low project completion rate',
        severity: 'high',
        confidence: 85,
        context: { completionRate }
      }))
    }

    // Activity Consistency
    const consistency = this.calculateConsistency(userData, repositories)
    if (consistency < 0.5) {
      insights.push(new BaseInsight({
        id: 'inconsistent_activity',
        type: 'inconsistent_activity',
        baseMessage: 'Inconsistent coding activity',
        severity: 'medium',
        confidence: 75,
        context: { consistency }
      }))
    }

    // Collaboration Style
    const collaborationScore = this.calculateCollaborationScore(repositories)
    if (collaborationScore < 30) {
      insights.push(new BaseInsight({
        id: 'solo_developer',
        type: 'solo_developer',
        baseMessage: 'Mostly works alone',
        severity: 'medium',
        confidence: 80,
        context: { collaborationScore }
      }))
    }

    // Language Specialization
    const languageDiversity = this.calculateLanguageDiversity(repositories)
    if (languageDiversity < 3) {
      insights.push(new BaseInsight({
        id: 'language_specialist',
        type: 'language_specialist',
        baseMessage: 'Specializes in few languages',
        severity: 'low',
        confidence: 90,
        context: { languageDiversity }
      }))
    } else if (languageDiversity > 8) {
      insights.push(new BaseInsight({
        id: 'language_hopper',
        type: 'language_hopper',
        baseMessage: 'Uses many different languages',
        severity: 'low',
        confidence: 85,
        context: { languageDiversity }
      }))
    }

    // Activity Timing
    const peakHour = this.calculatePeakHour(userData)
    if (peakHour >= 22 || peakHour <= 5) {
      insights.push(new BaseInsight({
        id: 'night_owl',
        type: 'night_owl',
        baseMessage: 'Codes late at night',
        severity: 'low',
        confidence: 70,
        context: { peakHour }
      }))
    } else if (peakHour >= 5 && peakHour <= 9) {
      insights.push(new BaseInsight({
        id: 'early_bird',
        type: 'early_bird',
        baseMessage: 'Codes early in morning',
        severity: 'low',
        confidence: 70,
        context: { peakHour }
      }))
    }

    return insights
  }

  static calculateCompletionRate(repositories) {
    const totalRepos = repositories.length
    const activeRepos = repositories.filter(r => 
      r.pushed_at && 
      new Date(r.pushed_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    ).length
    return (activeRepos / totalRepos) * 100
  }

  static calculateConsistency(userData, repositories) {
    // Simplified consistency calculation
    const recentActivity = repositories.filter(r => 
      new Date(r.pushed_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length
    return Math.min(1, recentActivity / 10)
  }

  static calculateCollaborationScore(repositories) {
    const totalForks = repositories.reduce((sum, r) => sum + (r.forks_count || 0), 0)
    const totalStars = repositories.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
    return Math.min(100, (totalForks + totalStars) / 50)
  }

  static calculateLanguageDiversity(repositories) {
    const languages = new Set()
    repositories.forEach(repo => {
      if (repo.language) {
        languages.add(repo.language)
      }
    })
    return languages.size
  }

  static calculatePeakHour(userData) {
    // This would ideally use commit data
    // For demo, return a random hour
    return Math.floor(Math.random() * 24)
  }
}

module.exports = {
  InsightTransformer,
  InsightFactory,
  BaseInsight,
  ProfessionalTransformer,
  FunTransformer,
  RoastTransformer
}
