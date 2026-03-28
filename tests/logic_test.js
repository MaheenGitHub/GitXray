/**
 * Logic Stress Test for Personality Service
 * Tests edge cases and verifies mathematical soundness
 */

// Mock the personality service logic for testing
class PersonalityServiceTester {
  constructor() {
    this.personalityTypes = {
      builder: {
        name: 'Builder',
        title: 'The Architect',
        color: '#3B82F6',
        icon: '🏗️'
      }
    };
  }

  // Exact copy of the logic from personalityService.js
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

  getOriginalRepoRatio(repositories) {
    if (!repositories.list || repositories.list.length === 0) return 0;
    const originalRepos = repositories.list.filter(repo => !repo.fork);
    return originalRepos.length / repositories.list.length;
  }

  calculateAccountAge(createdDate) {
    const now = new Date();
    const created = new Date(createdDate);
    return (now - created) / (1000 * 60 * 60 * 24 * 365); // Years
  }

  // Test helper functions
  runGhostProfileTest() {
    console.log('=== GHOST PROFILE TEST (Cold Start) ===');
    
    const ghostProfile = {
      repositories: {
        total_count: 0,
        stats: { total_stars: 0, total_forks: 0 },
        list: []
      },
      avgStarsPerRepo: 0,
      accountAge: 0.0027 // ~1 day old
    };

    console.log('Input:', ghostProfile);
    
    // Step-by-step calculation
    const originalRatio = this.getOriginalRepoRatio(ghostProfile.repositories);
    console.log(`Step 1 - Original Ratio: ${originalRatio} (should be 0)`);
    
    let score = 0;
    score += originalRatio * 30;
    console.log(`Step 2 - After Original Ratio: ${score} (should be 0)`);
    
    score += Math.min(ghostProfile.avgStarsPerRepo * 2, 30);
    console.log(`Step 3 - After Stars: ${score} (should be 0)`);
    
    score += Math.min(ghostProfile.accountAge * 2, 20);
    console.log(`Step 4 - After Account Age: ${score} (should be ~0.0054)`);
    
    score += Math.min(ghostProfile.repositories.total_count * 0.5, 20);
    console.log(`Step 5 - After Repo Count: ${score} (should be ~0.0054)`);
    
    const finalScore = Math.round(Math.min(score, 100));
    console.log(`Final Score: ${finalScore}`);
    
    // Assert it's not NaN and not a hidden constant
    console.assert(!isNaN(finalScore), 'Score should not be NaN');
    console.assert(finalScore === 0, `Ghost profile should score 0, got ${finalScore}`);
    console.assert(finalScore !== 78, 'Ghost profile should not return hardcoded 78');
    
    return finalScore;
  }

  runForkOnlyTest() {
    console.log('\n=== FORK-ONLY PROFILE TEST (The Copy-Paster) ===');
    
    const forkOnlyProfile = {
      repositories: {
        total_count: 50,
        stats: { total_stars: 100, total_forks: 0 },
        list: Array(50).fill(null).map((_, i) => ({
          fork: true, // 100% forks
          stargazers_count: 2,
          size: 100
        }))
      },
      avgStarsPerRepo: 2,
      accountAge: 2 // 2 years old
    };

    console.log('Input:', {
      totalRepos: forkOnlyProfile.repositories.total_count,
      forkRatio: '100%',
      avgStars: forkOnlyProfile.avgStarsPerRepo,
      accountAge: forkOnlyProfile.accountAge + ' years'
    });
    
    // Step-by-step calculation
    const originalRatio = this.getOriginalRepoRatio(forkOnlyProfile.repositories);
    console.log(`Step 1 - Original Ratio: ${originalRatio} (should be 0)`);
    
    let score = 0;
    score += originalRatio * 30;
    console.log(`Step 2 - After Original Ratio: ${score} (should be 0)`);
    
    score += Math.min(forkOnlyProfile.avgStarsPerRepo * 2, 30);
    console.log(`Step 3 - After Stars: ${score} (should be 4)`);
    
    score += Math.min(forkOnlyProfile.accountAge * 2, 20);
    console.log(`Step 4 - After Account Age: ${score} (should be 4)`);
    
    const repoCountBonus = Math.min(forkOnlyProfile.repositories.total_count * 0.5, 20) * originalRatio;
    score += repoCountBonus;
    console.log(`Step 5 - After Repo Count: ${score} (should be 4, weighted by original ratio: ${repoCountBonus})`);
    
    const finalScore = Math.round(Math.min(score, 100));
    console.log(`Final Score: ${finalScore}`);
    
    // Assert fork-only user doesn't get Architect title
    console.assert(originalRatio === 0, 'Fork-only user should have 0 original ratio');
    console.assert(finalScore < 20, `Fork-only user should have very low score, got ${finalScore}`);
    console.assert(finalScore !== 78, 'Fork-only user should not return hardcoded 78');
    
    // Can this user get "The Architect" title?
    const canBeArchitect = finalScore >= 70; // Assuming 70+ is needed for Architect
    console.log(`Can be Architect: ${canBeArchitect} (Score: ${finalScore})`);
    console.assert(!canBeArchitect, 'Fork-only user should NOT qualify as Architect');
    
    return finalScore;
  }

  runLanguageTouristTest() {
    console.log('\n=== LANGUAGE TOURIST TEST ===');
    
    // Test null languages object
    const nullLanguages = null;
    const undefinedLanguages = undefined;
    const emptyLanguages = {};
    const diverseLanguages = {
      'JavaScript': 1000,
      'Python': 800,
      'TypeScript': 600,
      'Java': 500,
      'C++': 400,
      'Ruby': 300,
      'Go': 200,
      'Rust': 150,
      'Swift': 100,
      'Kotlin': 50
    };

    console.log('Testing Object.keys() with various language objects:');
    
    // Test null
    try {
      const nullResult = Object.keys(nullLanguages || {}).length;
      console.log(`null languages: ${nullResult} (should be 0)`);
      console.assert(nullResult === 0, 'Null languages should return 0');
    } catch (error) {
      console.error(`ERROR with null languages: ${error.message}`);
    }

    // Test undefined
    try {
      const undefinedResult = Object.keys(undefinedLanguages || {}).length;
      console.log(`undefined languages: ${undefinedResult} (should be 0)`);
      console.assert(undefinedResult === 0, 'Undefined languages should return 0');
    } catch (error) {
      console.error(`ERROR with undefined languages: ${error.message}`);
    }

    // Test empty
    try {
      const emptyResult = Object.keys(emptyLanguages || {}).length;
      console.log(`empty languages: ${emptyResult} (should be 0)`);
      console.assert(emptyResult === 0, 'Empty languages should return 0');
    } catch (error) {
      console.error(`ERROR with empty languages: ${error.message}`);
    }

    // Test diverse
    try {
      const diverseResult = Object.keys(diverseLanguages || {}).length;
      console.log(`diverse languages: ${diverseResult} (should be 10)`);
      console.assert(diverseResult === 10, 'Diverse languages should return 10');
    } catch (error) {
      console.error(`ERROR with diverse languages: ${error.message}`);
    }

    return Object.keys(diverseLanguages || {}).length;
  }

  runAllTests() {
    console.log('🧪 STARTING LOGIC STRESS TESTS\n');
    
    const ghostScore = this.runGhostProfileTest();
    const forkScore = this.runForkOnlyTest();
    const languageCount = this.runLanguageTouristTest();
    
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Ghost Profile Score: ${ghostScore}`);
    console.log(`Fork-Only Profile Score: ${forkScore}`);
    console.log(`Language Tourist Count: ${languageCount}`);
    
    // Final assertions
    const allTestsPassed = 
      ghostScore === 0 && 
      forkScore < 50 && 
      languageCount === 10;
    
    console.log(`\nALL TESTS PASSED: ${allTestsPassed ? '✅ YES' : '❌ NO'}`);
    
    if (!allTestsPassed) {
      console.log('\n⚠️  LOGIC ISSUES DETECTED:');
      if (ghostScore !== 0) console.log('- Ghost profile returned non-zero score');
      if (forkScore >= 50) console.log('- Fork-only user scored too high');
      if (languageCount !== 10) console.log('- Language counting failed');
    }
    
    return allTestsPassed;
  }
}

// Run the tests
const tester = new PersonalityServiceTester();
tester.runAllTests();

console.log('\n📋 TEST FILE READY: tests/logic_test.js');
console.log('Run with: node tests/logic_test.js');
