# DATABASE WIPE COMMANDS FOR GITXRAY

## MongoDB Database Commands (if using MongoDB)

### Clear specific user data
```bash
# Connect to MongoDB
mongo

# Switch to GitXray database
use gitxray

# Delete specific user entry
db.users.deleteOne({ username: "MaheenGitHub" })

# Delete all cached analyses
db.analyses.deleteMany({ username: "MaheenGitHub" })

# Check remaining entries
db.users.find({ username: "MaheenGitHub" })
db.analyses.find({ username: "MaheenGitHub" })
```

## SQLite Database Commands (if using SQLite)

### Clear specific user data
```bash
# Navigate to backend directory
cd backend

# Open SQLite database
sqlite3 database.db

# Delete specific user entry
DELETE FROM users WHERE username = 'MaheenGitHub';

# Delete cached analyses
DELETE FROM analyses WHERE username = 'MaheenGitHub';

# Check remaining entries
SELECT * FROM users WHERE username = 'MaheenGitHub';
SELECT * FROM analyses WHERE username = 'MaheenGitHub';
```

## Redis Cache Commands (if using Redis)

### Clear specific user cache
```bash
# Connect to Redis
redis-cli

# Delete specific user keys
DEL user:MaheenGitHub
DEL analysis:MaheenGitHub
DEL repos:MaheenGitHub

# Clear all cache (if needed)
FLUSHALL
```

## Generic Cache Clear

### Clear any in-memory cache
```bash
# Restart backend to clear in-memory cache
npm run dev

# Or kill and restart
pkill -f "node.*server"
npm run dev
```

## Verification Commands

### After wiping, test fresh API call
```bash
# Test API directly
curl -H "User-Agent: GitXray/1.0.0" http://localhost:5000/api/analyze/MaheenGitHub

# Check for fresh data in response
# Should show current date and updated_at field
```

## Force Refresh Frontend

### Clear browser cache
```bash
# In browser: Ctrl+Shift+R (hard refresh)
# Or open in incognito mode
```

## Expected Result

After running these commands, the Debug Information should show:
- **total_stars**: 2 (not 31)
- **updated_at**: Current date (not 2026-03-26)
- **Fresh API response** with current rate limit headers
