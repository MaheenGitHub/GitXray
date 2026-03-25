/**
 * Developer Timeline Demo
 * Shows how the timeline analyzer generates developer journey stages
 */

const DeveloperTimeline = require('./backend/src/services/developerTimeline')

// Initialize timeline analyzer
const timelineAnalyzer = new DeveloperTimeline()

// Sample repository data (simulated GitHub API response)
const sampleRepositories = [
  // 2020 - Beginner stage
  {
    id: 1,
    name: 'hello-world',
    created_at: '2020-03-15T10:30:00Z',
    pushed_at: '2020-03-15T10:30:00Z',
    language: 'HTML',
    size: 50,
    stargazers_count: 1,
    forks_count: 0
  },
  {
    id: 2,
    name: 'css-practice',
    created_at: '2020-06-20T14:20:00Z',
    pushed_at: '2020-06-20T14:20:00Z',
    language: 'CSS',
    size: 80,
    stargazers_count: 0,
    forks_count: 0
  },
  {
    id: 3,
    name: 'javascript-basics',
    created_at: '2020-09-10T09:15:00Z',
    pushed_at: '2020-09-10T09:15:00Z',
    language: 'JavaScript',
    size: 120,
    stargazers_count: 2,
    forks_count: 1
  },
  
  // 2021 - Explorer stage
  {
    id: 4,
    name: 'react-todo-app',
    created_at: '2021-01-25T16:45:00Z',
    pushed_at: '2021-02-15T11:30:00Z',
    language: 'JavaScript',
    size: 350,
    stargazers_count: 5,
    forks_count: 2
  },
  {
    id: 5,
    name: 'python-scraper',
    created_at: '2021-04-18T13:20:00Z',
    pushed_at: '2021-04-25T10:15:00Z',
    language: 'Python',
    size: 280,
    stargazers_count: 3,
    forks_count: 1
  },
  {
    id: 6,
    name: 'vue-portfolio',
    created_at: '2021-07-08T12:00:00Z',
    pushed_at: '2021-07-22T16:45:00Z',
    language: 'Vue',
    size: 420,
    stargazers_count: 8,
    forks_count: 3
  },
  {
    id: 7,
    name: 'docker-setup',
    created_at: '2021-10-30T18:30:00Z',
    pushed_at: '2021-11-05T14:20:00Z',
    language: 'Dockerfile',
    size: 150,
    stargazers_count: 4,
    forks_count: 2
  },
  {
    id: 8,
    name: 'go-microservice',
    created_at: '2021-12-12T20:15:00Z',
    pushed_at: '2021-12-28T11:45:00Z',
    language: 'Go',
    size: 380,
    stargazers_count: 6,
    forks_count: 1
  },
  
  // 2022 - Builder stage
  {
    id: 9,
    name: 'node-api-server',
    created_at: '2022-02-14T15:30:00Z',
    pushed_at: '2022-03-10T09:20:00Z',
    language: 'JavaScript',
    size: 650,
    stargazers_count: 15,
    forks_count: 5
  },
  {
    id: 10,
    name: 'react-dashboard',
    created_at: '2022-05-20T11:45:00Z',
    pushed_at: '2022-06-15T14:30:00Z',
    language: 'JavaScript',
    size: 780,
    stargazers_count: 22,
    forks_count: 8
  },
  {
    id: 11,
    name: 'mobile-app',
    created_at: '2022-08-15T13:20:00Z',
    pushed_at: '2022-09-01T10:15:00Z',
    language: 'TypeScript',
    size: 920,
    stargazers_count: 18,
    forks_count: 6
  },
  {
    id: 12,
    name: 'database-designer',
    created_at: '2022-11-30T16:00:00Z',
    pushed_at: '2022-12-20T12:45:00Z',
    language: 'SQL',
    size: 540,
    stargazers_count: 12,
    forks_count: 4
  },
  
  // 2023 - Inconsistent stage
  {
    id: 13,
    name: 'ai-experiment',
    created_at: '2023-01-10T09:30:00Z',
    pushed_at: '2023-01-15T11:20:00Z',
    language: 'Python',
    size: 320,
    stargazers_count: 8,
    forks_count: 2
  },
  {
    id: 14,
    name: 'blockchain-demo',
    created_at: '2023-04-05T14:15:00Z',
    pushed_at: '2023-04-08T16:45:00Z',
    language: 'Solidity',
    size: 180,
    stargazers_count: 3,
    forks_count: 1
  },
  {
    id: 15,
    name: 'web3-wallet',
    created_at: '2023-07-22T18:00:00Z',
    pushed_at: '2023-07-25T10:30:00Z',
    language: 'TypeScript',
    size: 450,
    stargazers_count: 5,
    forks_count: 2
  }
]

// Sample commit history (simplified)
const sampleCommitHistory = {
  2020: [
    { date: '2020-03-15T10:30:00Z' },
    { date: '2020-03-16T11:45:00Z' },
    { date: '2020-06-20T14:20:00Z' },
    { date: '2020-09-10T09:15:00Z' }
  ],
  2021: [
    { date: '2021-01-25T16:45:00Z' },
    { date: '2021-01-26T10:20:00Z' },
    { date: '2021-01-27T15:30:00Z' },
    { date: '2021-02-15T11:30:00Z' },
    { date: '2021-04-18T13:20:00Z' },
    { date: '2021-04-25T10:15:00Z' },
    { date: '2021-07-08T12:00:00Z' },
    { date: '2021-07-22T16:45:00Z' },
    { date: '2021-10-30T18:30:00Z' },
    { date: '2021-11-05T14:20:00Z' },
    { date: '2021-12-12T20:15:00Z' },
    { date: '2021-12-28T11:45:00Z' }
  ],
  2022: [
    { date: '2022-02-14T15:30:00Z' },
    { date: '2022-02-16T09:20:00Z' },
    { date: '2022-02-18T14:45:00Z' },
    { date: '2022-03-10T09:20:00Z' },
    { date: '2022-03-12T11:30:00Z' },
    { date: '2022-03-14T16:15:00Z' },
    { date: '2022-05-20T11:45:00Z' },
    { date: '2022-05-22T10:30:00Z' },
    { date: '2022-06-15T14:30:00Z' },
    { date: '2022-06-17T09:15:00Z' },
    { date: '2022-08-15T13:20:00Z' },
    { date: '2022-08-17T11:45:00Z' },
    { date: '2022-09-01T10:15:00Z' },
    { date: '2022-11-30T16:00:00Z' },
    { date: '2022-12-20T12:45:00Z' }
  ],
  2023: [
    { date: '2023-01-10T09:30:00Z' },
    { date: '2023-01-15T11:20:00Z' },
    { date: '2023-04-05T14:15:00Z' },
    { date: '2023-04-08T16:45:00Z' },
    { date: '2023-07-22T18:00:00Z' },
    { date: '2023-07-25T10:30:00Z' }
  ]
}

// Generate timeline
console.log('='.repeat(80))
console.log('🛤️ DEVELOPER TIMELINE ANALYSIS')
console.log('='.repeat(80))

async function runDemo() {
  try {
    const timeline = await timelineAnalyzer.generateTimeline(sampleRepositories, sampleCommitHistory)
    
    console.log('\n📊 GENERATED TIMELINE:')
    console.log('-'.repeat(60))
    
    timeline.forEach((year, index) => {
      console.log(`\n📅 YEAR ${year.year}: ${year.stage}`)
      console.log(`   ${year.icon} ${year.description}`)
      console.log(`   📈 Confidence: ${year.confidence}%`)
      console.log(`   📋 Characteristics: ${year.characteristics.join(', ')}`)
      console.log(`   📊 Metrics:`)
      console.log(`      - Total Repos: ${year.metrics.totalRepos}`)
      console.log(`      - Active Repos: ${year.metrics.activeRepos}`)
      console.log(`      - Completion Rate: ${year.metrics.completionRate.toFixed(1)}%`)
      console.log(`      - Language Count: ${year.metrics.languageCount}`)
      console.log(`      - Avg Size: ${year.metrics.avgSize.toFixed(0)} KB`)
      console.log(`      - Community Engagement: ${year.metrics.communityEngagement.toFixed(1)}`)
      
      if (year.note) {
        console.log(`   📝 Note: ${year.note}`)
      }
      
      if (year.transitionStage) {
        console.log(`   🔄 Transition Year: Maintaining previous stage`)
      }
    })
    
    // Generate journey summary
    console.log('\n📈 JOURNEY SUMMARY:')
    console.log('-'.repeat(60))
    const summary = timelineAnalyzer.generateJourneySummary(timeline)
    console.log(summary)
    
    // Show simplified format (as requested)
    console.log('\n🎯 SIMPLIFIED OUTPUT FORMAT:')
    console.log('-'.repeat(60))
    const simplifiedOutput = timeline.map(year => ({
      year: year.year,
      stage: year.stage
    }))
    
    console.log(JSON.stringify(simplifiedOutput, null, 2))
    
  } catch (error) {
    console.error('Error generating timeline:', error)
  }
}

// Additional demo with different scenarios
console.log('\n🧪 DIFFERENT SCENARIOS:')
console.log('-'.repeat(60))

// Scenario 1: Consistent Builder
const consistentBuilder = [
  { created_at: '2021-01-01T00:00:00Z', size: 200, language: 'JavaScript', stargazers_count: 10, forks_count: 3 },
  { created_at: '2021-06-01T00:00:00Z', size: 300, language: 'JavaScript', stargazers_count: 15, forks_count: 5 },
  { created_at: '2022-01-01T00:00:00Z', size: 500, language: 'JavaScript', stargazers_count: 25, forks_count: 8 },
  { created_at: '2022-06-01T00:00:00Z', size: 600, language: 'JavaScript', stargazers_count: 35, forks_count: 12 }
]

// Scenario 2: Explorer
const explorer = [
  { created_at: '2021-01-01T00:00:00Z', size: 100, language: 'Python', stargazers_count: 5, forks_count: 1 },
  { created_at: '2021-03-01T00:00:00Z', size: 150, language: 'JavaScript', stargazers_count: 3, forks_count: 2 },
  { created_at: '2021-06-01T00:00:00Z', size: 120, language: 'Go', stargazers_count: 4, forks_count: 1 },
  { created_at: '2021-09-01T00:00:00Z', size: 180, language: 'Rust', stargazers_count: 6, forks_count: 2 },
  { created_at: '2021-12-01T00:00:00Z', size: 140, language: 'TypeScript', stargazers_count: 7, forks_count: 3 }
]

// Scenario 3: Specialist
const specialist = [
  { created_at: '2021-01-01T00:00:00Z', size: 400, language: 'Python', stargazers_count: 20, forks_count: 8 },
  { created_at: '2021-06-01T00:00:00Z', size: 600, language: 'Python', stargazers_count: 30, forks_count: 12 },
  { created_at: '2022-01-01T00:00:00Z', size: 800, language: 'Python', stargazers_count: 45, forks_count: 18 },
  { created_at: '2022-06-01T00:00:00Z', size: 1000, language: 'Python', stargazers_count: 60, forks_count: 25 }
]

async function analyzeScenarios() {
  console.log('\n🏗️ CONSISTENT BUILDER SCENARIO:')
  const builderTimeline = await timelineAnalyzer.generateTimeline(consistentBuilder)
  console.log(JSON.stringify(builderTimeline.map(t => ({ year: t.year, stage: t.stage })), null, 2))
  
  console.log('\n🧭 EXPLORER SCENARIO:')
  const explorerTimeline = await timelineAnalyzer.generateTimeline(explorer)
  console.log(JSON.stringify(explorerTimeline.map(t => ({ year: t.year, stage: t.stage })), null, 2))
  
  console.log('\n🎯 SPECIALIST SCENARIO:')
  const specialistTimeline = await timelineAnalyzer.generateTimeline(specialist)
  console.log(JSON.stringify(specialistTimeline.map(t => ({ year: t.year, stage: t.stage })), null, 2))
}

// Run the demo
runDemo().then(() => {
  analyzeScenarios()
})

console.log('\n🔧 INTEGRATION GUIDE:')
console.log('-'.repeat(60))
console.log(`
// Backend Integration:
const DeveloperTimeline = require('./services/developerTimeline')

async analyzeUserTimeline(req, res) {
  const { username } = req.params
  
  // Fetch user repositories
  const repositories = await githubService.getUserRepositories(username)
  
  // Generate timeline
  const timelineAnalyzer = new DeveloperTimeline()
  const timeline = await timelineAnalyzer.generateTimeline(repositories)
  
  res.json({
    success: true,
    data: {
      timeline: timeline,
      summary: timelineAnalyzer.generateJourneySummary(timeline)
    }
  })
}

// Frontend Integration:
const TimelineChart = ({ timeline }) => {
  return (
    <div className="timeline">
      {timeline.map((year, index) => (
        <div key={year.year} className="timeline-year">
          <div className="year-header">
            <span className="year">{year.year}</span>
            <span className="stage">{year.icon} {year.stage}</span>
          </div>
          <div className="year-details">
            <p>{year.description}</p>
            <div className="metrics">
              <span>Repos: {year.metrics.totalRepos}</span>
              <span>Completion: {year.metrics.completionRate}%</span>
              <span>Languages: {year.metrics.languageCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
`)

console.log('\n🚀 TIMELINE ANALYSIS COMPLETE!')
console.log('='.repeat(80))
