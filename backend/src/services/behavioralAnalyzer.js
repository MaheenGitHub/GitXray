/**
 * Behavioral Analyst for Developers
 * Generates sharp, specific, and slightly uncomfortable personality insights
 * based on GitHub activity patterns
 */

class BehavioralAnalyzer {
  constructor() {
    // Personality trait weights and patterns
    this.personalityPatterns = {
      builder: {
        keywords: ['framework', 'library', 'tool', 'system', 'architecture'],
        behaviors: ['consistent commits', 'documentation', 'structured repos'],
        insights: [
          "You build systems that others rely on, but secretly crave recognition for the foundation, not just the facade",
          "Your code is your legacy - you're not just writing functions, you're crafting monuments",
          "You'd rather maintain 10 well-architected repos than start 50 flashy side projects"
        ]
      },
      explorer: {
        keywords: ['experiment', 'prototype', 'research', 'novel', 'cutting-edge'],
        behaviors: ['diverse languages', 'spikes in activity', 'abandoned projects'],
        insights: [
          "You chase novelty like an addiction, leaving trails of brilliant but unfinished experiments",
          "Your GitHub is a museum of curiosities - fascinating artifacts that tell stories of what could have been",
          "You learn in public, but your curiosity outpaces your commitment"
        ]
      },
      debugger: {
        keywords: ['fix', 'patch', 'issue', 'bug', 'optimize'],
        behaviors: ['issue contributions', 'forked repos', 'incremental improvements'],
        insights: [
          "You see problems others miss, but sometimes fix things that weren't broken to begin with",
          "You're the person who reads the fine print in documentation others skim",
          "Your superpower is finding the needle, but you sometimes forget why you needed it"
        ]
      },
      perfectionist: {
        keywords: ['refactor', 'cleanup', 'standardize', 'optimize'],
        behaviors: ['consistent formatting', 'comprehensive tests', 'documentation'],
        insights: [
          "Your code is cleaner than your living room, and that's saying something",
          "You spend more time perfecting the code than celebrating the working product",
          "You'd rather have no solution than a messy one"
        ]
      },
      hustler: {
        keywords: ['launch', 'ship', 'product', 'startup', 'business'],
        behaviors: ['rapid commits', 'feature additions', 'marketing repos'],
        insights: [
          "You treat every project like it's the next unicorn, even when it's clearly a pony",
          "Your GitHub reads like a startup pitch deck - ambitious, polished, and slightly exaggerated",
          "You ship first and ask questions later, which is both your strength and your danger zone"
        ]
      }
    };
  }

  /**
   * Generate humorous but slightly savage roasts based on GitHub stats
   * @param {Object} data - GitHub statistics
   * @returns {Array} Array of roast lines
   */
  generateRoast(data) {
    const { repo_count, stars, forks } = data;
    const avgStars = repo_count > 0 ? Math.floor(stars / repo_count) : 0;
    
    let roast = [];

    if (repo_count > 20 && avgStars < 2) {
      roast.push("You build a lot… but the internet is still not impressed.");
    }

    if (forks === 0) {
      roast.push("No forks? You're coding solo like it's a survival mission.");
    }

    if (repo_count > 10 && stars < 10) {
      roast.push("You've been busy… but nobody noticed yet.");
    }

    if (repo_count < 5) {
      roast.push("Minimalist or just getting started? Hard to tell.");
    }

    // Additional spicy roasts based on patterns
    if (stars > 1000 && repo_count < 10) {
      roast.push("One-hit wonder or just got lucky? The data is confused.");
    }

    if (avgStars > 50 && repo_count < 5) {
      roast.push("Quality over quantity? Or just scared of commitment?");
    }

    if (forks > stars) {
      roast.push("More forks than stars? Your code is being used more than it's being appreciated.");
    }

    if (roast.length === 0) {
      roast.push("You're doing well… sadly no roast available 😌");
    }

    return roast;
  }

  /**
   * Analyze developer behavior and generate personality insights
   * @param {Object} data - GitHub activity data
   * @returns {Object} Personality analysis
   */
  analyze(data) {
    const {
      repo_count,
      stars,
      forks,
      languages,
      commit_pattern,
      builder_score,
      explorer_score,
      debugger_score,
      perfectionist_score,
      hustler_score
    } = data;

    // Calculate dominant personality
    const personalities = {
      builder: builder_score,
      explorer: explorer_score,
      debugger: debugger_score,
      perfectionist: perfectionist_score,
      hustler: hustler_score
    };

    const dominant = Object.entries(personalities)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Generate core insight
    const coreInsight = this.generateCoreInsight(dominant, data);

    // Generate truth bombs
    const truthBombs = this.generateTruthBombs(dominant, data);

    // Generate strengths and blind spots
    const strengths = this.generateStrengths(dominant, data);
    const blindSpots = this.generateBlindSpots(dominant, data);

    // Generate growth suggestions
    const growthSuggestions = this.generateGrowthSuggestions(dominant, data);

    // Generate identity statement
    const identityStatement = this.generateIdentityStatement(dominant, data);
    
    // Generate roasts
    const roasts = this.generateRoast(data);

    return {
      coreInsight,
      truthBombs,
      strengths,
      blindSpots,
      growthSuggestions,
      identityStatement,
      roasts
    };
  }

  generateCoreInsight(dominant, data) {
    const insights = {
      builder: `You construct digital cathedrals while others build tents. Your ${data.repo_count} repositories aren't just projects - they're a systematic approach to problem-solving that values reliability over revolution.`,
      explorer: `You're a digital nomad of code, collecting languages like souvenirs. Your ${Object.keys(data.languages || {}).length} technologies tell a story of curiosity that sometimes abandons the destination for the journey.`,
      debugger: `You see the matrix that others miss. Your ${data.stars || 0} stars come from being the person who finds the bug everyone else gave up on - you're the emergency contact for broken code.`,
      perfectionist: `Your code is cleaner than production environments deserve. With ${data.forks || 0} forks, people don't just use your work - they study it like scripture.`,
      hustler: `Every commit is a product launch. Your ${data.repo_count} repos read like a startup portfolio - ambitious, market-ready, and always selling the next big thing.`
    };

    return insights[dominant] || "Your code tells a story that's still being written.";
  }

  generateTruthBombs(dominant, data) {
    const bombPatterns = {
      builder: [
        `You've spent more time documenting other people's code than celebrating your own ${data.stars || 0} stars`,
        "Your README files are longer than most people's actual code",
        "You secretly judge repos without proper test coverage",
        "You'd rather refactor someone else's mess than start from scratch"
      ],
      explorer: [
        `You have ${Object.keys(data.languages || {}).length} languages but probably master none`,
        "Your GitHub is a graveyard of brilliant weekend projects",
        "You learn frameworks just to say you tried them",
        "You bookmark tutorials more than you actually code"
      ],
      debugger: [
        "You can't resist pointing out inefficiencies in working code",
        "You spend more time in issues than in features",
        "You read error messages like they're mystery novels",
        "You've fixed bugs in repos you don't even use"
      ],
      perfectionist: [
        "You've spent hours debating semicolon placement",
        "Your code passes tests but misses deadlines",
        "You'd rather delete and rewrite than patch imperfect code",
        "You have strong opinions about code formatting in languages you don't use"
      ],
      hustler: [
        "You've added 'startup-ready' to projects that barely run",
        "Your commit messages read like marketing copy",
        "You calculate potential ROI while writing hello world",
        "You have more 'launch' repos than actual launched products"
      ]
    };

    return bombPatterns[dominant]?.slice(0, 4) || [
      "Your GitHub activity suggests you're still figuring out your developer identity",
      "Your code patterns are evolving faster than your consistency",
      "You're balancing multiple developer personalities at once"
    ];
  }

  generateStrengths(dominant, data) {
    const strengthPatterns = {
      builder: [
        "Creates systems that scale and last",
        "Thinks about maintainability from day one",
        "Documentation that actually helps people"
      ],
      explorer: [
        "Learns new technologies at lightning speed",
        "Brings fresh perspectives to stale problems",
        "Not afraid to experiment with bold approaches"
      ],
      debugger: [
        "Finds bugs no one else can locate",
        "Optimizes performance with surgical precision",
        "Turns chaos into working order"
      ],
      perfectionist: [
        "Code quality that sets team standards",
        "Attention to detail prevents future disasters",
        "Creates work others can build upon confidently"
      ],
      hustler: [
        "Ships products that people actually want",
        "Turns ideas into reality at remarkable speed",
        "Understands the business side of development"
      ]
    };

    return strengthPatterns[dominant] || [
      "Adaptable to different coding challenges",
      "Balances multiple development approaches",
      "Versatile problem-solving mindset"
    ];
  }

  generateBlindSpots(dominant, data) {
    const blindSpotPatterns = {
      builder: [
        "Over-engineers simple solutions",
        "Misses opportunities while perfecting foundations",
        "Values structure over innovation"
      ],
      explorer: [
        "Starts more projects than they finish",
        "Chases novelty over necessity",
        "Underestimates maintenance costs"
      ],
      debugger: [
        "Focuses on problems instead of progress",
        "Optimizes things that don't need optimization",
        "Gets stuck in analysis paralysis"
      ],
      perfectionist: [
        "Lets perfect be the enemy of shipped",
        "Critiques others' work more than building their own",
        "Misses deadlines chasing unattainable standards"
      ],
      hustler: [
        "Prioritizes speed over substance",
        "Overpromises and underdelivers",
        "Builds features without solid foundations"
      ]
    };

    return blindSpotPatterns[dominant] || [
      "Sometimes loses focus in the middle of projects",
      "Struggles with long-term commitment to single approaches",
      "Balances too many priorities at once"
    ];
  }

  generateGrowthSuggestions(dominant, data) {
    const growthPatterns = {
      builder: [
        "Launch a 'quick and dirty' project just for fun",
        "Collaborate on someone else's messy codebase",
        "Spend time on creative, non-technical hobbies"
      ],
      explorer: [
        "Pick one technology and master it completely",
        "Maintain a project for 6+ months without adding new features",
        "Document your learning journey systematically"
      ],
      debugger: [
        "Build something from scratch without optimizing",
        "Focus on features instead of fixes for one month",
        "Celebrate working solutions, not just perfect ones"
      ],
      perfectionist: [
        "Ship something with known bugs (and live with it)",
        "Set strict deadlines and stick to them",
        "Collaborate on messy, experimental projects"
      ],
      hustler: [
        "Build something purely for learning, not launching",
        "Spend time understanding technical debt",
        "Focus on one project for a full year"
      ]
    };

    return growthPatterns[dominant] || [
      "Find a balance between exploration and execution",
      "Develop consistent coding habits",
      "Collaborate with developers who complement your style"
    ];
  }

  generateIdentityStatement(dominant, data) {
    const statements = {
      builder: `The architect who builds the foundations others stand on`,
      explorer: `The digital nomad who collects technologies like experiences`,
      debugger: `The code detective who finds what others can't see`,
      perfectionist: `The craftsman who treats every line like a signature`,
      hustler: `The product-minded builder who ships dreams into reality`
    };

    return statements[dominant] || `The evolving developer finding their signature style`;
  }
}

module.exports = new BehavioralAnalyzer();
