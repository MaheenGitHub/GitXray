/**
 * Personality Service Test Suite
 * Test the personality analysis with sample data
 */

const personalityService = require('./personalityService');

// Sample GitHub data for testing different personality types
const testData = {
  // Builder type - many repos, consistent, original projects
  builder: {
    user: {
      username: 'builder-dev',
      name: 'Alex Builder',
      bio: 'Full-stack developer focused on building robust applications',
      followers: 150,
      following: 50,
      public_repos: 85,
      created_at: '2018-01-01T00:00:00Z'
    },
    repositories: {
      total_count: 85,
      stats: {
        total_stars: 450,
        total_forks: 120,
        total_watchers: 200,
        archived_count: 3,
        forked_count: 8,
        original_count: 77
      }
    },
    languages: {
      JavaScript: 150000,
      TypeScript: 80000,
      Python: 60000,
      HTML: 30000,
      CSS: 20000
    }
  },

  // Explorer type - many languages, experimental projects
  explorer: {
    user: {
      username: 'explorer-dev',
      name: 'Sam Explorer',
      bio: 'Curious developer experimenting with new technologies',
      followers: 80,
      following: 120,
      public_repos: 45,
      created_at: '2020-06-01T00:00:00Z'
    },
    repositories: {
      total_count: 45,
      stats: {
        total_stars: 180,
        total_forks: 90,
        total_watchers: 150,
        archived_count: 10,
        forked_count: 25,
        original_count: 20
      }
    },
    languages: {
      JavaScript: 20000,
      Python: 18000,
      Rust: 15000,
      Go: 12000,
      TypeScript: 10000,
      Ruby: 8000,
      Elixir: 6000,
      Haskell: 4000,
      Clojure: 3000,
      Swift: 2000
    }
  },

  // Perfectionist type - high quality, well-regarded projects
  perfectionist: {
    user: {
      username: 'perfectionist-dev',
      name: 'Jordan Perfectionist',
      bio: 'Crafting elegant solutions with attention to detail',
      followers: 500,
      following: 30,
      public_repos: 12,
      created_at: '2017-03-15T00:00:00Z'
    },
    repositories: {
      total_count: 12,
      stats: {
        total_stars: 2500,
        total_forks: 400,
        total_watchers: 600,
        archived_count: 0,
        forked_count: 1,
        original_count: 11
      }
    },
    languages: {
      TypeScript: 80000,
      Rust: 40000,
      JavaScript: 20000
    }
  },

  // Hustler type - high activity, social engagement
  hustler: {
    user: {
      username: 'hustler-dev',
      name: 'Taylor Hustler',
      bio: 'Shipping fast and building in public',
      followers: 2000,
      following: 500,
      public_repos: 60,
      created_at: '2019-01-01T00:00:00Z'
    },
    repositories: {
      total_count: 60,
      stats: {
        total_stars: 800,
        total_forks: 200,
        total_watchers: 400,
        archived_count: 5,
        forked_count: 15,
        original_count: 45
      }
    },
    languages: {
      JavaScript: 100000,
      TypeScript: 60000,
      Python: 30000,
      'C#': 20000
    }
  }
};

/**
 * Test function to demonstrate personality analysis
 */
function testPersonalityAnalysis() {
  console.log('🧪 Testing Personality Analysis Service\n');
  
  Object.entries(testData).forEach(([type, data]) => {
    console.log(`📊 Testing ${type.toUpperCase()} Personality Type:`);
    console.log('='.repeat(50));
    
    try {
      const analysis = personalityService.analyzePersonality(data);
      
      console.log(`🎯 Dominant Personality: ${analysis.dominant_personality.name} (${analysis.dominant_personality.title})`);
      console.log(`⭐ Score: ${analysis.dominant_personality.score}/100`);
      console.log(`🎪 Confidence: ${analysis.dominant_personality.confidence}`);
      console.log(`🔮 Expected: ${type}`);
      console.log(`✅ Match: ${analysis.dominant_personality.type === type ? 'YES' : 'NO'}`);
      
      console.log('\n📈 All Scores:');
      Object.entries(analysis.scores).forEach(([personality, score]) => {
        const icon = personalityService.personalityTypes[personality].icon;
        console.log(`  ${icon} ${personality.charAt(0).toUpperCase() + personality.slice(1)}: ${score}/100`);
      });
      
      console.log('\n💪 Strengths:');
      analysis.insights.strengths.forEach(strength => {
        console.log(`  • ${strength}`);
      });
      
      console.log('\n🎯 Career Suggestions:');
      analysis.insights.career_suggestions.forEach(career => {
        console.log(`  • ${career}`);
      });
      
      console.log('\n' + '='.repeat(50) + '\n');
      
    } catch (error) {
      console.error(`❌ Error analyzing ${type}:`, error.message);
    }
  });
}

/**
 * Test edge cases
 */
function testEdgeCases() {
  console.log('🔍 Testing Edge Cases:');
  console.log('='.repeat(30));
  
  // Test with minimal data
  const minimalData = {
    user: {
      username: 'minimal',
      name: 'Minimal User',
      followers: 1,
      following: 1,
      public_repos: 1,
      created_at: '2023-01-01T00:00:00Z'
    },
    repositories: {
      total_count: 1,
      stats: {
        total_stars: 0,
        total_forks: 0,
        total_watchers: 0,
        archived_count: 0,
        forked_count: 0,
        original_count: 1
      }
    },
    languages: {
      JavaScript: 1000
    }
  };
  
  try {
    const analysis = personalityService.analyzePersonality(minimalData);
    console.log(`✅ Minimal data handled successfully`);
    console.log(`   Dominant: ${analysis.dominant_personality.name} (${analysis.dominant_personality.score}/100)`);
  } catch (error) {
    console.error(`❌ Error with minimal data:`, error.message);
  }
  
  console.log('\n');
}

/**
 * Demonstrate the scoring system
 */
function demonstrateScoring() {
  console.log('🎯 Scoring System Demonstration:');
  console.log('='.repeat(40));
  
  const sampleMetrics = {
    total_repos: 50,
    avg_repos_per_year: 10,
    avg_stars_per_repo: 15,
    language_count: 8,
    original_repo_ratio: 0.8,
    followers: 200,
    follower_to_following_ratio: 4
  };
  
  console.log('Sample Metrics:');
  Object.entries(sampleMetrics).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  console.log('\nCalculated Scores:');
  const scores = personalityService.calculatePersonalityScores(sampleMetrics);
  Object.entries(scores).forEach(([type, score]) => {
    const icon = personalityService.personalityTypes[type].icon;
    console.log(`  ${icon} ${type}: ${score}/100`);
  });
  
  console.log('\n');
}

// Run all tests if this file is executed directly
if (require.main === module) {
  testPersonalityAnalysis();
  testEdgeCases();
  demonstrateScoring();
}

module.exports = {
  testPersonalityAnalysis,
  testEdgeCases,
  demonstrateScoring,
  testData
};
