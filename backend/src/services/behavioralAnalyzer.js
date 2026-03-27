/**
 * Behavioral Analyzer for Developers
 * Generates core insights, fun, and roast outputs
 * Now fully explainable: every insight comes with a reason
 */

class BehavioralAnalyzer {
  analyze(data) {
    const {
      repo_count = 0,
      stars = 0,
      forks = 0,
      languages = {},
      account_age_years = 1,
    } = data;

    const avgStars = repo_count ? stars / repo_count : 0;
    const langCount = Object.keys(languages).length;

    return {
      coreInsight: this.core(data, avgStars, langCount),
      truthBombs: this.truth(data, avgStars, langCount),
      strengths: this.strengths(data, avgStars),
      blindSpots: this.blind(data, avgStars),
      growthSuggestions: this.growth(data),
      identityStatement: this.identity(data),

      funInsights: this.fun(data, avgStars, langCount),
      roasts: this.roast(data, avgStars),
    };
  }

  // -----------------------------
  // CORE INSIGHT (PROFESSIONAL)
  // -----------------------------
  core(d, avgStars, langCount) {
    if (d.repo_count > 20 && avgStars < 2) {
      return {
        message: "You build a lot. But impact is still catching up.",
        reason: `You have ${d.repo_count} repos but average stars per repo is only ${avgStars.toFixed(
          1
        )}`,
      };
    }

    if (avgStars > 10 && d.repo_count < 10) {
      return {
        message: "You don't build much — but people notice when you do.",
        reason: `Few repos (${d.repo_count}) but high engagement (avg stars ${avgStars.toFixed(
          1
        )})`,
      };
    }

    if (langCount > 6) {
      return {
        message: "You explore a lot.",
        reason: `Used ${langCount} different languages, showing curiosity over consistency`,
      };
    }

    if (d.repo_count > 15 && avgStars > 5) {
      return {
        message: "You're balanced.",
        reason: `You build ${d.repo_count} repos with good engagement (avg stars ${avgStars.toFixed(
          1
        )})`,
      };
    }

    return {
      message: "You're still figuring out your developer rhythm.",
      reason: "Keep building and experimenting to find your unique style",
    };
  }

  // -----------------------------
  // TRUTH BOMBS (EXPLAINABLE)
  // -----------------------------
  truth(d, avgStars, langCount) {
    const t = [];

    if (d.repo_count > 15 && avgStars < 2) {
      t.push({
        message: "You start strong… but rarely finish strong.",
        reason: `High repo count (${d.repo_count}) but low engagement (avg stars ${avgStars.toFixed(
          1
        )})`,
      });
    }

    if (avgStars < 1) {
      t.push({
        message: "You're building… but no one is watching.",
        reason: `Low average stars (${avgStars.toFixed(1)}) across your repos`,
      });
    }

    if (langCount > 6) {
      t.push({
        message: "You try everything… master nothing.",
        reason: `Explored ${langCount} languages but engagement spread thin`,
      });
    }

    if (d.repo_count < 5) {
      t.push({
        message: "Either beginner… or commitment issues.",
        reason: `Only ${d.repo_count} repos yet`,
      });
    }

    if (d.forks === 0) {
      t.push({
        message: "You code alone. Like… alone alone.",
        reason: "No forks found — solo developer style",
      });
    }

    return t.slice(0, 4);
  }

  // -----------------------------
  // FUN MODE (HUMANE + RELATABLE)
  // -----------------------------
  fun(d, avgStars, langCount) {
    const f = [];

    if (langCount > 5) {
      f.push({
        message: "You install new languages like apps on your phone.",
        reason: `You've experimented with ${langCount} languages`,
      });
    }

    if (d.repo_count > 20) {
      f.push({
        message: "You have more repos than finished ideas ",
        reason: `Repo count is ${d.repo_count}`,
      });
    }

    if (avgStars < 1) {
      f.push({
        message: "Your repos are hidden gems… VERY hidden.",
        reason: `Average stars are only ${avgStars.toFixed(1)}`,
      });
    }

    if (d.forks === 0) {
      f.push({
        message: "Even you didn't fork your own repo ",
        reason: "Zero forks recorded",
      });
    }

    f.push({
      message: "You definitely copy-pasted from StackOverflow today.",
      reason: "Trust us, we can see the patterns ",
    });

    return f;
  }

  // -----------------------------
  // ROAST MODE (SAVAGE + EXPLAINABLE)
  // -----------------------------
  roast(d, avgStars) {
    const r = [];

    if (d.repo_count > 20 && avgStars < 2) {
      r.push({
        message: "You're not a developer. You're a repo generator.",
        reason: `High repo count (${d.repo_count}) with very low average stars (${avgStars.toFixed(
          1
        )})`,
      });
    }

    if (avgStars < 1 && d.repo_count > 10) {
      r.push({
        message: "You've been working… but the internet disagrees.",
        reason: `Avg stars ${avgStars.toFixed(1)} across ${d.repo_count} repos`,
      });
    }

    if (d.forks === 0) {
      r.push({
        message: "No forks. Even your code doesn't trust itself.",
        reason: "Zero forks across all repos",
      });
    }

    if (d.repo_count < 5) {
      r.push({
        message: "This GitHub is still in beta.",
        reason: `Only ${d.repo_count} repos yet`,
      });
    }

    if (avgStars > 20 && d.repo_count < 5) {
      r.push({
        message: "You got lucky once and retired.",
        reason: `High avg stars (${avgStars.toFixed(1)}) but very few repos (${d.repo_count})`,
      });
    }

    if (r.length === 0) {
      r.push({
        message: "You're safe… for now ",
        reason: "No significant patterns detected for roast",
      });
    }

    return r;
  }

  // -----------------------------
  // STRENGTHS
  // -----------------------------
  strengths(d, avgStars) {
    if (avgStars > 5) {
      return [
        "Builds things people actually value",
        "Understands impact",
        "Not just coding for practice",
      ];
    }

    return ["Actively building", "Experimenting", "Learning through doing"];
  }

  // -----------------------------
  // BLIND SPOTS
  // -----------------------------
  blind(d, avgStars) {
    const b = [];

    if (d.repo_count > 20 && avgStars < 2) b.push("Too many unfinished ideas");
    if (avgStars < 1) b.push("Lack of visibility or polish");
    if (d.forks === 0) b.push("No collaboration");

    return b.length ? b : ["Needs consistency"];
  }

  // -----------------------------
  // GROWTH
  // -----------------------------
  growth(d) {
    const g = [];

    if (d.repo_count > 20) g.push("Finish 2–3 projects properly");
    if (d.forks === 0) g.push("Contribute to open source");
    if (d.repo_count < 5) g.push("Build more projects");

    return g;
  }

  // -----------------------------
  // IDENTITY
  // -----------------------------
  identity(d) {
    if (d.repo_count > 20) return "Idea generator";
    if (d.repo_count < 5) return "Early builder";
    return "Growing developer";
  }
}

module.exports = new BehavioralAnalyzer();
