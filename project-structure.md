# Dev DNA - Project Structure

## Complete Folder Structure

```
DevDNA/
├── frontend/                          # React Vite + Tailwind CSS
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── Card.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Layout.jsx
│   │   │   └── features/
│   │   │       ├── SearchForm.jsx
│   │   │       ├── ProfileCard.jsx
│   │   │       ├── LanguageChart.jsx
│   │   │       ├── PersonalityResult.jsx
│   │   │       └── StatsGrid.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Error.jsx
│   │   ├── hooks/
│   │   │   ├── useGitHubAPI.js
│   │   │   └── usePersonalityAnalysis.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── personalityAnalyzer.js
│   │   │   └── formatters.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                           # Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── githubController.js
│   │   │   └── analysisController.js
│   │   ├── services/
│   │   │   ├── githubService.js
│   │   │   └── personalityService.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── cors.js
│   │   ├── routes/
│   │   │   ├── github.js
│   │   │   └── analysis.js
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── environment.js
│   │   └── app.js
│   ├── package.json
│   ├── .env.example
│   └── server.js
├── docs/                              # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── PERSONALITY_TYPES.md
├── .gitignore
├── README.md
└── docker-compose.yml                 # Optional for deployment
```

## Key Design Decisions

### Frontend Structure
- **Components-based architecture** with separation of concerns
- **Feature-based organization** for scalable development
- **Custom hooks** for reusable logic
- **Centralized API service** for backend communication

### Backend Structure
- **MVC pattern** for clean separation of logic
- **Service layer** for business logic and external API calls
- **Middleware** for cross-cutting concerns (error handling, rate limiting)
- **Environment-based configuration** for security

### Data Flow
1. Frontend sends GitHub username to backend
2. Backend fetches data from GitHub API
3. Backend analyzes data and determines personality
4. Backend returns structured results to frontend
5. Frontend displays results with charts and insights

This structure supports:
- Easy scaling and maintenance
- Clear separation of concerns
- Reusable components and services
- Environment-specific configurations
- Professional development workflow
