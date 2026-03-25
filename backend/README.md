# Dev DNA Backend API

GitHub Personality Analyzer Backend Service

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- GitHub Personal Access Token (optional but recommended)

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

3. **Configure your GitHub token** (optional but recommended for higher rate limits)
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `public_repo` and `read:user` permissions
   - Add token to `.env` file: `GITHUB_API_TOKEN=your_token_here`

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Main Analysis Endpoint
```
GET /api/analyze/:username
```

**Example:**
```bash
curl http://localhost:5000/api/analyze/octocat
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "username": "octocat",
      "name": "The Octocat",
      "bio": "GitHub's official mascot",
      "followers": 1234,
      "following": 567,
      "public_repos": 89,
      "created_at": "2011-01-25T18:44:36Z"
    },
    "repositories": {
      "total_count": 89,
      "stats": {
        "total_stars": 12345,
        "total_forks": 6789,
        "total_watchers": 2345,
        "archived_count": 5,
        "forked_count": 12,
        "original_count": 77,
        "languages_count": 8
      }
    },
    "languages": {
      "JavaScript": 123456,
      "Python": 98765,
      "TypeScript": 45678,
      "HTML": 23456
    },
    "analysis_timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Successfully analyzed GitHub user: octocat",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Additional Endpoints

#### Get User Profile Only
```
GET /api/user/:username
```

#### Get User Repositories Only
```
GET /api/repositories/:username?type=all&sort=updated&direction=desc
```

#### POST Analysis (alternative)
```
POST /api/analyze
Content-Type: application/json

{
  "username": "octocat"
}
```

#### Health Check
```
GET /api/health
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `GITHUB_API_TOKEN` | GitHub API token | None |
| `FRONTEND_URL` | Allowed frontend URL | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### Rate Limiting
- 100 requests per 15 minutes per IP by default
- Configurable via environment variables
- Higher limits with GitHub API token

## 📊 Features

### Data Extracted
- **User Profile**: Name, bio, followers, following, creation date
- **Repository Statistics**: Count, stars, forks, watchers, size
- **Language Analysis**: Bytes of code per language across all repos
- **Repository Types**: Original vs forked, archived count

### Error Handling
- Comprehensive error responses with proper HTTP status codes
- GitHub API specific error handling (rate limits, not found, etc.)
- Input validation with detailed error messages
- Structured logging for debugging

### Security
- CORS configuration for frontend integration
- Rate limiting to prevent abuse
- Input sanitization and validation
- Security headers with Helmet

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Logs

Logs are written to:
- Console (development)
- `logs/combined.log` (all logs)
- `logs/error.log` (errors only)

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure all required environment variables
3. Ensure GitHub API token is set for production use

### Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name "devdna-api"

# Monitor
pm2 monit

# Logs
pm2 logs devdna-api
```

## 📚 API Response Format

All responses follow this structure:

```json
{
  "success": boolean,
  "data": object, // Only on success
  "error": string, // Only on error
  "message": string,
  "timestamp": "ISO 8601 timestamp"
}
```

## 🔍 Error Codes

| Code | Description |
|------|-------------|
| `user_not_found` | GitHub user doesn't exist |
| `rate_limit_exceeded` | GitHub API rate limit exceeded |
| `access_forbidden` | Access to user data forbidden |
| `invalid_token` | Invalid GitHub API token |
| `validation_error` | Invalid input parameters |
| `internal_error` | Server-side error |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details
