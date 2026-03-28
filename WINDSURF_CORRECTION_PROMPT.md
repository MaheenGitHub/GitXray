# WINDSURF BRUTAL CORRECTION PROMPT

## DATA INTEGRITY CRISIS - IMMEDIATE FIX REQUIRED

**Windsurf, stop using mock data immediately!**

### THE PROBLEM:
I just checked my live GitHub profile (MaheenGitHub) and your app's stats are completely hallucinated:

| Metric | App Shows | Real GitHub | Status |
|--------|------------|-------------|---------|
| Repositories | 26 | 24 | ❌ STALE |
| Stars | 31 | 2 | ❌ FAKE |
| Followers | 5 | 2 | ❌ WRONG |
| Title | "The Architect" | N/A | ❌ UNDESERVED |
| Confidence | 78/100 | N/A | ❌ ARBITRARY |

### ROOT CAUSE ANALYSIS:
Your app is either:
1. **Caching stale data** forever
2. **Falling back to mock data** on API failures
3. **Using a hardcoded default user** object

### IMMEDIATE TASKS:

#### Task 1: API Call Verification
- Check the GitHub API service in backend/
- Verify it's actually calling `https://api.github.com/users/MaheenGitHub`
- Add console.log() to show the REAL JSON response
- If API fails, show ERROR message, not fake stats

#### Task 2: Data Flow Audit
- Trace from GitHub API → backend → frontend
- Identify where the fake "31 stars" is coming from
- Find any mockResponse or defaultUser objects
- Remove ALL hardcoded fallbacks

#### Task 3: Real-Time Data Refresh
- Implement fresh API calls for each analysis
- Add cache-busting parameters
- Show loading states instead of fake data

#### Task 4: Error Handling
- If GitHub API fails: Show "API Error - Try Again"
- If user has no data: Show "No Data Available"
- NEVER show fake "78/100" scores

### VERIFICATION REQUIREMENTS:
1. Show me the actual GitHub API response JSON in console
2. Recalculate my personality based on REAL data (2 stars, 24 repos)
3. Update the UI to reflect my actual stats
4. Remove all mock/fallback data

### EXPECTED RESULT:
My score should drop dramatically from "78/100 Architect" to something realistic for a user with only 2 stars and 24 repos.

**This is a data integrity crisis. Fix it now.**
