# 🧬 GitXray — Developer Intelligence Engine

> Advanced GitHub profile analysis that reveals your unique Developer DNA through data-driven personality insights.

![License](https://img.shields.io/github/license/MaheenGitHub/GitXray?style=flat-square)
![React Version](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat-square)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)
![Node Version](https://img.shields.io/badge/Node.js-16+-green?style=flat-square)

---

## The "Developer DNA" Concept

GitXray transforms GitHub activity patterns into actionable personality insights using a sophisticated analysis engine. The system evaluates developers across five core personality types, each with distinct characteristics:

| Personality Type | Title | Accent Color | Core Traits |
|------------------|-------|--------------|-------------|
| **Explorer** | The Adventurer | Emerald (#10B981) | Experimental, diverse tech stack, curiosity-driven |
| **Builder** | The Architect | Blue (#3B82F6) | Structured, consistent, quality-focused |
| **Debugger** | The Problem Solver | Amber (#F59E0B) | Analytical, issue-resolution focused |
| **Perfectionist** | The Craftsperson | Purple (#8B5CF6) | Detail-oriented, refined code quality |
| **Hustler** | The Networker | Red (#EF4444) | Collaborative, community-driven |

The analysis leverages GitHub REST API data including:
- Repository patterns and commit consistency
- Language diversity and technology adoption
- Community engagement (stars, forks, collaborations)
- Contribution timing and project evolution

---

## Core Features

### � Real-time GitHub Profile Analysis
- Instantaneous data fetching via GitHub REST API
- Comprehensive repository and contribution metrics
- Language distribution and technology stack analysis

### 🧬 Dynamic "Developer DNA" Reporting
- Personality-specific accent colors (e.g., Emerald for The Adventurer)
- Behavioral insights based on actual coding patterns
- Evolution timeline showing developer growth trajectory
- Confidence scoring for personality trait assessment

### 📊 Advanced Data Visualization
- Interactive charts for language distribution
- Repository highlights and impact metrics
- Career matching based on technical strengths
- Animated timeline with milestone tracking

### 🔄 Comprehensive Sharing System
- Custom-branded modal interface
- Dynamic URL generation using `window.location.origin`
- Social media integration (LinkedIn, Twitter, WhatsApp)
- Clipboard functionality for seamless sharing

### 💾 Data Export Capabilities
- Instant JSON report generation with complete analysis
- Portable data format for integration with other tools
- Timestamped analysis for tracking progress over time
- Structured output with personality insights and metrics

---

## Installation

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn package manager
- GitHub Personal Access Token

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
# GitHub API Configuration
VITE_GITHUB_TOKEN=your_github_personal_access_token

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## Usage Example

### The Adventurer Personality Profile

When analyzing a developer with Explorer traits, GitXray generates:

```json
{
  "personality": {
    "dominant_personality": {
      "name": "Explorer",
      "title": "The Adventurer",
      "score": 87,
      "color": "#10B981"
    },
    "insights": {
      "strengths": [
        "Technology experimentation",
        "Rapid prototyping",
        "Cross-domain learning"
      ],
      "improvement_areas": [
        "Project consistency",
        "Documentation practices"
      ]
    }
  },
  "evolution_timeline": [
    {
      "year": 2023,
      "role": "Explorer",
      "repoCount": 6,
      "avgStars": 0,
      "languageCount": 2,
      "color": "green"
    }
  ]
}
```

The UI renders this with Emerald accent colors, reflecting the Adventurer's experimental nature and diverse technology exploration.

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze/:username` | GET | Comprehensive user analysis |
| `/api/behavioral/:username` | GET | Behavioral insights |
| `/api/roast/:username` | GET | Personality-based roast analysis |
| `/api/health` | GET | System health check |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- GitHub REST API for providing comprehensive developer data
- React community for exceptional UI libraries
- Open source contributors who make developer tools possible
