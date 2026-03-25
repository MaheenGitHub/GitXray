/**
 * Collaboration Analysis Demo
 * Shows how collaboration analyzer calculates scores and generates insights
 */

const CollaborationAnalyzer = require('./backend/src/services/collaborationAnalyzer')

// Initialize analyzer
const collaborationAnalyzer = new CollaborationAnalyzer()

// Sample user data
const sampleUserData = {
  login: 'developer123',
  followers: 45,
  following: 120,
  public_repos: 12
}

// Sample repository data
const sampleRepositories = [
  {
    id: 1,
    name: 'awesome-project',
    fork: false,
    forks_count: 25,
    stargazers_count: 150,
    watchers_count: 15,
    open_issues_count: 12,
    language: 'JavaScript'
  },
  {
    id: 2,
    name: 'cool-library',
    fork: false,
    forks_count: 8,
    stargazers_count: 45,
    watchers_count: 8,
    open_issues_count: 3,
    language: 'TypeScript'
  },
  {
    id: 3,
    name: 'react-components',
    fork: false,
    forks_count: 32,
    stargazers_count: 89,
    watchers_count: 12,
    open_issues_count: 7,
    language: 'JavaScript'
  },
  {
    id: 4,
    name: 'python-toolkit',
    fork: false,
    forks_count: 15,
    stargazers_count: 67,
    watchers_count: 6,
    open_issues_count: 4,
    language: 'Python'
  },
  {
    id: 5,
    name: 'forked-project',
    fork: true,
    forks_count: 2,
    stargazers_count: 5,
    watchers_count: 2,
    open_issues_count: 1,
    language: 'Go'
  },
  {
    id: 6,
    name: 'another-fork',
    fork: true,
    forks_count: 1,
    stargazers_count: 3,
    watchers_count: 1,
    open_issues_count: 0,
    language: 'Rust'
  }
]

// Sample pull request data (if available)
const samplePullRequestData = [
  {
    number: 1,
    title: 'Fix bug in authentication',
    state: 'closed',
    merged: true,
    repo_owner: 'otheruser',
    created_at: '2023-01-15T10:30:00Z'
  },
  {
    number: 2,
    title: 'Add new feature to API',
    state: 'closed',
    merged: true,
    repo_owner: 'anotheruser',
    created_at: '2023-02-20T14:20:00Z'
  },
  {
    number: 3,
    title: 'Update documentation',
    state: 'open',
    merged: false,
    repo_owner: 'developer123',
    created_at: '2023-03-10T09:15:00Z'
  },
  {
    number: 4,
    title: 'Refactor code structure',
    state: 'closed',
    merged: true,
    repo_owner: 'opensource-project',
    created_at: '2023-04-05T16:45:00Z'
  },
  {
    number: 5,
    title: 'Add unit tests',
    state: 'closed',
    merged: true,
    repo_owner: 'library-maintainer',
    created_at: '2023-05-12T11:30:00Z'
  }
]

console.log('='.repeat(80))
console.log('🤝 COLLABORATION ANALYSIS SYSTEM')
console.log('='.repeat(80))

// Analyze collaboration
async function runCollaborationDemo() {
  try {
    const collaboration = await collaborationAnalyzer.analyzeCollaboration(
      sampleUserData, 
      sampleRepositories, 
      samplePullRequestData
    )
    
    console.log('\n📊 COLLABORATION SCORE:')
    console.log('-'.repeat(60))
    console.log(`Overall Score: ${collaboration.score}/100`)
    console.log(`Style: ${collaboration.style.icon} ${collaboration.style.name}`)
    console.log(`Insight: ${collaboration.insight}`)
    
    console.log('\n🔍 DETAILED METRICS:')
    console.log('-'.repeat(60))
    
    Object.entries(collaboration.metrics).forEach(([key, metric]) => {
      console.log(`\n📈 ${key.toUpperCase()}:`)
      console.log(`   Score: ${metric.score}/100`)
      
      if (key === 'forks') {
        console.log(`   Total Forks: ${metric.totalForks}`)
        console.log(`   Fork Success Rate: ${metric.forkSuccessRate.toFixed(1)}%`)
        console.log(`   Avg Forks per Repo: ${metric.avgForksPerRepo.toFixed(1)}`)
      }
      
      if (key === 'pullRequests') {
        console.log(`   Total PRs: ${metric.totalPRs}`)
        console.log(`   Merged PRs: ${metric.mergedPRs}`)
        console.log(`   PR Success Rate: ${metric.prSuccessRate.toFixed(1)}%`)
        console.log(`   External PRs: ${metric.externalPRs}`)
      }
      
      if (key === 'ownership') {
        console.log(`   Owned Repos: ${metric.ownedRepos}`)
        console.log(`   Forked Repos: ${metric.forkedRepos}`)
        console.log(`   Ownership Ratio: ${metric.ownershipRatio.toFixed(1)}%`)
      }
      
      if (key === 'communityEngagement') {
        console.log(`   Followers: ${metric.followers}`)
        console.log(`   Following: ${metric.following}`)
        console.log(`   Total Stars: ${metric.totalStars}`)
        console.log(`   Community Activity: ${metric.communityActivity.toFixed(1)}%`)
      }
    })
    
    console.log('\n📋 SCORE BREAKDOWN:')
    console.log('-'.repeat(60))
    Object.entries(collaboration.breakdown).forEach(([key, breakdown]) => {
      console.log(`\n${breakdown.icon} ${breakdown.label}: ${breakdown.score}/100`)
      console.log(`   ${breakdown.description}`)
      console.log('   Details:')
      Object.entries(breakdown.details).forEach(([detailKey, detailValue]) => {
        console.log(`     • ${detailKey}: ${detailValue}`)
      })
    })
    
    console.log('\n💡 RECOMMENDATIONS:')
    console.log('-'.repeat(60))
    collaboration.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.title} (${rec.priority})`)
      console.log(`   ${rec.description}`)
      console.log('   Actions:')
      rec.actions.forEach(action => {
        console.log(`   • ${action}`)
      })
    })
    
  } catch (error) {
    console.error('Error analyzing collaboration:', error)
  }
}

// Test different collaboration scenarios
console.log('\n🎪 DIFFERENT COLLABORATION SCENARIOS:')
console.log('-'.repeat(60))

// Scenario 1: Solo Developer
const soloDev = {
  login: 'solodev',
  followers: 10,
  following: 5,
  public_repos: 8
}

const soloRepos = [
  { fork: false, forks_count: 1, stargazers_count: 5, language: 'JavaScript' },
  { fork: false, forks_count: 0, stargazers_count: 2, language: 'Python' },
  { fork: false, forks_count: 2, stargazers_count: 8, language: 'HTML' }
]

// Scenario 2: Active Collaborator
const activeDev = {
  login: 'activedev',
  followers: 250,
  following: 180,
  public_repos: 15
}

const activeRepos = [
  { fork: false, forks_count: 45, stargazers_count: 200, language: 'JavaScript' },
  { fork: false, forks_count: 32, stargazers_count: 150, language: 'TypeScript' },
  { fork: true, forks_count: 5, stargazers_count: 25, language: 'Go' }
]

const activePRs = [
  { state: 'closed', merged: true, repo_owner: 'otheruser' },
  { state: 'closed', merged: true, repo_owner: 'anotheruser' },
  { state: 'closed', merged: true, repo_owner: 'project' },
  { state: 'open', merged: false, repo_owner: 'library' }
]

// Scenario 3: Community Leader
const leaderDev = {
  login: 'leaderdev',
  followers: 500,
  following: 300,
  public_repos: 25
}

const leaderRepos = [
  { fork: false, forks_count: 120, stargazers_count: 800, language: 'JavaScript' },
  { fork: false, forks_count: 85, stargazers_count: 450, language: 'Python' },
  { fork: false, forks_count: 95, stargazers_count: 600, language: 'Go' }
]

const leaderPRs = [
  { state: 'closed', merged: true, repo_owner: 'otheruser' },
  { state: 'closed', merged: true, repo_owner: 'anotheruser' },
  { state: 'closed', merged: true, repo_owner: 'project' },
  { state: 'closed', merged: true, repo_owner: 'library' },
  { state: 'closed', merged: true, repo_owner: 'framework' }
]

async function analyzeScenarios() {
  console.log('\n👤 SOLO DEVELOPER SCENARIO:')
  const soloAnalysis = await collaborationAnalyzer.analyzeCollaboration(soloDev, soloRepos)
  console.log(`Score: ${soloAnalysis.score}/100 - ${soloAnalysis.style.name}`)
  console.log(`Insight: ${soloAnalysis.insight}`)
  
  console.log('\n🤝 ACTIVE COLLABORATOR SCENARIO:')
  const activeAnalysis = await collaborationAnalyzer.analyzeCollaboration(activeDev, activeRepos, activePRs)
  console.log(`Score: ${activeAnalysis.score}/100 - ${activeAnalysis.style.name}`)
  console.log(`Insight: ${activeAnalysis.insight}`)
  
  console.log('\n👑 COMMUNITY LEADER SCENARIO:')
  const leaderAnalysis = await collaborationAnalyzer.analyzeCollaboration(leaderDev, leaderRepos, leaderPRs)
  console.log(`Score: ${leaderAnalysis.score}/100 - ${leaderAnalysis.style.name}`)
  console.log(`Insight: ${leaderAnalysis.insight}`)
}

// Run the demo
runCollaborationDemo().then(() => {
  analyzeScenarios()
})

console.log('\n🔧 INTEGRATION GUIDE:')
console.log('-'.repeat(60))
console.log(`
// Backend Integration:
const CollaborationAnalyzer = require('./services/collaborationAnalyzer')

async analyzeCollaboration(req, res) {
  const { username } = req.params
  
  // Fetch user data
  const userData = await githubService.getUserProfile(username)
  const repositories = await githubService.getUserRepositories(username)
  const pullRequests = await githubService.getUserPullRequests(username)
  
  // Analyze collaboration
  const analyzer = new CollaborationAnalyzer()
  const collaboration = await analyzer.analyzeCollaboration(userData, repositories, pullRequests)
  
  res.json({
    success: true,
    data: {
      score: collaboration.score,
      insight: collaboration.insight,
      style: collaboration.style,
      metrics: collaboration.metrics,
      recommendations: collaboration.recommendations
    }
  })
}

// Frontend Integration:
const CollaborationDisplay = ({ collaboration }) => {
  return (
    <div className="collaboration-analysis">
      <div className="score-display">
        <h3>Collaboration Score</h3>
        <div className="score-circle">
          {collaboration.score}%
        </div>
        <p>{collaboration.insight}</p>
      </div>
      
      <div className="style-display">
        <h4>{collaboration.style.icon} {collaboration.style.name}</h4>
        <p>{collaboration.style.description}</p>
      </div>
      
      <div className="metrics-grid">
        {Object.entries(collaboration.metrics).map(([key, metric]) => (
          <div key={key} className="metric-card">
            <h5>{key}</h5>
            <div className="score">{metric.score}/100</div>
          </div>
        ))}
      </div>
    </div>
  )
}
`)

console.log('\n🚀 COLLABORATION ANALYSIS COMPLETE!')
console.log('='.repeat(80))
