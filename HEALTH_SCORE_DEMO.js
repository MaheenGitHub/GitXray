/**
 * Project Health Scoring Demo
 * Shows how the scoring system calculates completion, consistency, and quality scores
 */

const ProjectHealthScorer = require('./backend/src/services/projectHealthScorer')

// Initialize scorer
const healthScorer = new ProjectHealthScorer()

// Sample repository data
const sampleRepositories = [
  {
    id: 1,
    name: 'todo-app',
    created_at: '2023-01-15T10:30:00Z',
    pushed_at: '2023-12-10T14:20:00Z',
    size: 450,
    language: 'JavaScript',
    stargazers_count: 25,
    forks_count: 8,
    watchers_count: 5,
    open_issues_count: 3,
    archived: false,
    has_readme: true,
    has_license: true,
    description: 'A comprehensive todo application with React and Node.js'
  },
  {
    id: 2,
    name: 'weather-api',
    created_at: '2023-03-20T16:45:00Z',
    pushed_at: '2023-11-28T09:15:00Z',
    size: 280,
    language: 'Python',
    stargazers_count: 15,
    forks_count: 4,
    watchers_count: 2,
    open_issues_count: 1,
    archived: false,
    has_readme: true,
    has_license: true,
    description: 'RESTful weather API with data visualization'
  },
  {
    id: 3,
    name: 'abandoned-project',
    created_at: '2023-06-10T12:00:00Z',
    pushed_at: '2023-06-15T11:30:00Z',
    size: 120,
    language: 'HTML',
    stargazers_count: 2,
    forks_count: 0,
    watchers_count: 1,
    open_issues_count: 0,
    archived: false,
    has_readme: false,
    has_license: false,
    description: 'An experimental project'
  },
  {
    id: 4,
    name: 'data-visualizer',
    created_at: '2023-08-05T14:20:00Z',
    pushed_at: '2023-12-20T16:45:00Z',
    size: 680,
    language: 'TypeScript',
    stargazers_count: 42,
    forks_count: 12,
    watchers_count: 8,
    open_issues_count: 7,
    archived: false,
    has_readme: true,
    has_license: true,
    description: 'Interactive data visualization dashboard using D3.js'
  },
  {
    id: 5,
    name: 'mobile-game',
    created_at: '2023-10-12T18:30:00Z',
    pushed_at: '2023-10-25T10:15:00Z',
    size: 320,
    language: 'Dart',
    stargazers_count: 8,
    forks_count: 2,
    watchers_count: 3,
    open_issues_count: 2,
    archived: false,
    has_readme: true,
    has_license: false,
    description: 'Flutter mobile game with leaderboard'
  }
]

// Sample commit history
const sampleCommitHistory = [
  { date: '2023-01-15T10:30:00Z', repo: 'todo-app' },
  { date: '2023-01-16T11:45:00Z', repo: 'todo-app' },
  { date: '2023-01-17T14:20:00Z', repo: 'todo-app' },
  { date: '2023-01-18T09:15:00Z', repo: 'todo-app' },
  { date: '2023-01-19T16:30:00Z', repo: 'todo-app' },
  { date: '2023-01-20T12:45:00Z', repo: 'todo-app' },
  { date: '2023-01-21T10:20:00Z', repo: 'todo-app' },
  { date: '2023-03-20T16:45:00Z', repo: 'weather-api' },
  { date: '2023-03-21T09:30:00Z', repo: 'weather-api' },
  { date: '2023-03-22T14:15:00Z', repo: 'weather-api' },
  { date: '2023-03-23T11:20:00Z', repo: 'weather-api' },
  { date: '2023-03-24T16:45:00Z', repo: 'weather-api' },
  { date: '2023-03-25T10:30:00Z', repo: 'weather-api' },
  { date: '2023-06-10T12:00:00Z', repo: 'abandoned-project' },
  { date: '2023-06-11T14:20:00Z', repo: 'abandoned-project' },
  { date: '2023-06-12T09:15:00Z', repo: 'abandoned-project' },
  { date: '2023-06-13T16:30:00Z', repo: 'abandoned-project' },
  { date: '2023-06-14T11:45:00Z', repo: 'abandoned-project' },
  { date: '2023-06-15T11:30:00Z', repo: 'abandoned-project' },
  { date: '2023-08-05T14:20:00Z', repo: 'data-visualizer' },
  { date: '2023-08-06T09:30:00Z', repo: 'data-visualizer' },
  { date: '2023-08-07T16:15:00Z', repo: 'data-visualizer' },
  { date: '2023-08-08T11:20:00Z', repo: 'data-visualizer' },
  { date: '2023-08-09T14:45:00Z', repo: 'data-visualizer' },
  { date: '2023-08-10T10:30:00Z', repo: 'data-visualizer' },
  { date: '2023-08-11T12:20:00Z', repo: 'data-visualizer' },
  { date: '2023-08-12T09:15:00Z', repo: 'data-visualizer' },
  { date: '2023-10-12T18:30:00Z', repo: 'mobile-game' },
  { date: '2023-10-13T14:20:00Z', repo: 'mobile-game' },
  { date: '2023-10-14T10:15:00Z', repo: 'mobile-game' },
  { date: '2023-10-25T10:15:00Z', repo: 'mobile-game' }
]

console.log('='.repeat(80))
console.log('🏥 PROJECT HEALTH SCORING SYSTEM')
console.log('='.repeat(80))

// Calculate health scores
const healthScores = healthScorer.calculateProjectHealth(sampleRepositories, sampleCommitHistory)

console.log('\n📊 OVERALL HEALTH SCORES:')
console.log('-'.repeat(60))
console.log(`Completion: ${healthScores.completion}/100`)
console.log(`Consistency: ${healthScores.consistency}/100`)
console.log(`Quality: ${healthScores.quality}/100`)
console.log(`Overall: ${healthScores.overall}/100 (${healthScores.grade})`)

console.log('\n🎯 DETAILED BREAKDOWN:')
console.log('-'.repeat(60))

// Completion breakdown
console.log('\n📋 COMPLETION SCORE BREAKDOWN:')
console.log(`Score: ${healthScores.breakdown.completion.score}/100 (${healthScores.breakdown.completion.grade})`)
console.log('Factors:')
Object.entries(healthScores.breakdown.completion.factors).forEach(([key, description]) => {
  console.log(`  • ${description}`)
})

// Consistency breakdown
console.log('\n⏰ CONSISTENCY SCORE BREAKDOWN:')
console.log(`Score: ${healthScores.breakdown.consistency.score}/100 (${healthScores.breakdown.consistency.grade})`)
console.log('Factors:')
Object.entries(healthScores.breakdown.consistency.factors).forEach(([key, description]) => {
  console.log(`  • ${description}`)
})

// Quality breakdown
console.log('\n⭐ QUALITY SCORE BREAKDOWN:')
console.log(`Score: ${healthScores.breakdown.quality.score}/100 (${healthScores.breakdown.quality.grade})`)
console.log('Factors:')
Object.entries(healthScores.breakdown.quality.factors).forEach(([key, description]) => {
  console.log(`  • ${description}`)
})

console.log('\n💡 RECOMMENDATIONS:')
console.log('-'.repeat(60))
healthScores.recommendations.forEach((rec, index) => {
  console.log(`\n${index + 1}. ${rec.title} (${rec.priority})`)
  console.log(`   ${rec.description}`)
  console.log('   Actions:')
  rec.actions.forEach(action => {
    console.log(`   • ${action}`)
  })
})

console.log('\n🔧 SCORE CALCULATION EXPLANATION:')
console.log('-'.repeat(60))

console.log(`
📋 COMPLETION SCORE (35% weight):
Measures how well projects are finished and maintained.

Formula:
Completion = (Recent Activity × 0.30) + 
            (Documentation × 0.20) + 
            (Legal Compliance × 0.15) + 
            (Not Abandoned × 0.15) + 
            (Active Maintenance × 0.20)

Components:
• Recent Activity: Repos pushed in last 90 days
• Documentation: README files present
• Legal Compliance: License files present  
• Not Abandoned: Projects not archived
• Active Maintenance: Regular updates and pushes

⏰ CONSISTENCY SCORE (30% weight):
Measures regularity of development activity.

Formula:
Consistency = Base Score + 
              (Commit Regularity × 0.50) + 
              (Creation Pattern × 0.30) + 
              (Update Frequency × 0.20)

Components:
• Commit Regularity: Standard deviation of weekly commits
• Creation Pattern: Consistency in project creation intervals
• Update Frequency: Recent pushes relative to project age

⭐ QUALITY SCORE (35% weight):
Measures star-to-effort ratio and community engagement.

Formula:
Quality = Average Repository Quality + Diversity Bonus

Repository Quality = (Size Score × 0.30) + 
                   (Engagement Score × 0.35) + 
                   (Issues Score × 0.15) + 
                   (Language Bonus × 0.10) + 
                   (Age Bonus × 0.10)

Components:
• Size Score: Logarithmic scale of repository size
• Engagement Score: Stars, forks, and watchers
• Issues Score: Open issues indicating community interest
• Language Bonus: Popular technology choices
• Age Bonus: Project longevity and sustainability

📈 OVERALL SCORE:
Overall = (Completion × 0.35) + 
          (Consistency × 0.30) + 
          (Quality × 0.35)
`)

console.log('\n🎪 DIFFERENT SCENARIOS:')
console.log('-'.repeat(60))

// Scenario 1: Perfect developer
const perfectDev = [
  {
    created_at: '2023-01-01T00:00:00Z',
    pushed_at: '2023-12-31T23:59:59Z',
    size: 500,
    language: 'JavaScript',
    stargazers_count: 100,
    forks_count: 25,
    watchers_count: 15,
    open_issues_count: 10,
    archived: false,
    has_readme: true,
    has_license: true
  }
]

const perfectScores = healthScorer.calculateProjectHealth(perfectDev)
console.log('\n🌟 PERFECT DEVELOPER:')
console.log(`Completion: ${perfectScores.completion}, Consistency: ${perfectScores.consistency}, Quality: ${perfectScores.quality}`)

// Scenario 2: Inconsistent developer
const inconsistentDev = [
  {
    created_at: '2023-01-01T00:00:00Z',
    pushed_at: '2023-01-15T00:00:00Z',
    size: 50,
    language: 'HTML',
    stargazers_count: 1,
    forks_count: 0,
    watchers_count: 1,
    open_issues_count: 0,
    archived: false,
    has_readme: false,
    has_license: false
  },
  {
    created_at: '2023-06-01T00:00:00Z',
    pushed_at: '2023-06-05T00:00:00Z',
    size: 30,
    language: 'CSS',
    stargazers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    open_issues_count: 0,
    archived: false,
    has_readme: false,
    has_license: false
  }
]

const inconsistentScores = healthScorer.calculateProjectHealth(inconsistentDev)
console.log('\n📊 INCONSISTENT DEVELOPER:')
console.log(`Completion: ${inconsistentScores.completion}, Consistency: ${inconsistentScores.consistency}, Quality: ${inconsistentScores.quality}`)

// Scenario 3: Quality-focused developer
const qualityDev = [
  {
    created_at: '2022-01-01T00:00:00Z',
    pushed_at: '2023-12-31T23:59:59Z',
    size: 1000,
    language: 'TypeScript',
    stargazers_count: 500,
    forks_count: 100,
    watchers_count: 50,
    open_issues_count: 25,
    archived: false,
    has_readme: true,
    has_license: true
  }
]

const qualityScores = healthScorer.calculateProjectHealth(qualityDev)
console.log('\n⭐ QUALITY-FOCUSED DEVELOPER:')
console.log(`Completion: ${qualityScores.completion}, Consistency: ${qualityScores.consistency}, Quality: ${qualityScores.quality}`)

console.log('\n🔧 INTEGRATION GUIDE:')
console.log('-'.repeat(60))
console.log(`
// Backend Integration:
const ProjectHealthScorer = require('./services/projectHealthScorer')

async analyzeProjectHealth(req, res) {
  const { username } = req.params
  
  // Fetch user repositories
  const repositories = await githubService.getUserRepositories(username)
  const commitHistory = await githubService.getCommitHistory(username)
  
  // Calculate health scores
  const scorer = new ProjectHealthScorer()
  const healthScores = scorer.calculateProjectHealth(repositories, commitHistory)
  
  res.json({
    success: true,
    data: {
      scores: {
        completion: healthScores.completion,
        consistency: healthScores.consistency,
        quality: healthScores.quality
      },
      overall: healthScores.overall,
      grade: healthScores.grade,
      breakdown: healthScores.breakdown,
      recommendations: healthScores.recommendations
    }
  })
}

// Frontend Integration:
const HealthScoreDisplay = ({ scores }) => {
  return (
    <div className="health-scores">
      <div className="score-item">
        <h3>Completion</h3>
        <div className="score-circle" style={{ '--score': scores.completion }}>
          {scores.completion}%
        </div>
      </div>
      
      <div className="score-item">
        <h3>Consistency</h3>
        <div className="score-circle" style={{ '--score': scores.consistency }}>
          {scores.consistency}%
        </div>
      </div>
      
      <div className="score-item">
        <h3>Quality</h3>
        <div className="score-circle" style={{ '--score': scores.quality }}>
          {scores.quality}%
        </div>
      </div>
    </div>
  )
}
`)

console.log('\n🚀 HEALTH SCORING SYSTEM READY!')
console.log('='.repeat(80))
