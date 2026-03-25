<div align="center">

# 🧬 Dev DNA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://www.javascript.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

*Discover your developer personality through GitHub analysis*

[**Live Demo**](https://devdna-demo.vercel.app) • [**Try It Now**](#-quick-start) • [**Contribute**](CONTRIBUTING.md)

</div>

---

## 🌟 Overview

**Dev DNA** is a cutting-edge full-stack application that analyzes GitHub profiles to uncover unique developer personality types. By examining coding patterns, repository statistics, and language preferences, Dev DNA provides insights into your development style, strengths, and potential career paths.

### ✨ Key Features

- 🔍 **GitHub Profile Analysis**: Comprehensive analysis of public repositories, languages, and coding patterns
- 🧠 **Personality Detection**: 5 distinct personality types with detailed insights
- 📊 **Beautiful Visualizations**: Interactive charts and graphs displaying your coding DNA
- 📱 **Modern UI/UX**: Dark-themed, responsive design with smooth animations
- 📸 **Shareable Results**: Generate beautiful, branded images of your personality analysis
- 🚀 **Blazing Fast**: Built with Vite, React, and modern web technologies
- 🎨 **Glass Morphism**: Stunning visual design with contemporary aesthetics

### 🎭 Personality Types

| Personality | Icon | Description | Career Paths |
|------------|------|-------------|---------------|
| **🏗️ Builder** | The Architect | Consistent developers who build structured, reliable projects | Software Architect, Tech Lead, DevOps |
| **🧭 Explorer** | The Adventurer | Curious developers who experiment with new technologies | Full-Stack, Solutions Architect, Consultant |
| **🔍 Debugger** | The Problem Solver | Analytical developers who excel at finding issues | QA Engineer, Security Engineer, Performance |
| **💎 Perfectionist** | The Craftsperson | Detail-oriented developers creating high-quality code | Senior Developer, Code Review Lead, UI/UX |
| **🚀 Hustler** | The Go-Getter | Ambitious developers who ship quickly and build their brand | Technical Founder, Developer Advocate, Manager |

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 16+ and npm
- **GitHub Personal Access Token** (optional, for higher rate limits)

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dev-dna.git
   cd dev-dna
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Add your GitHub token to .env file
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### 🎮 Try It Now

No installation required! Test with these popular developers:

- [**octocat**](https://devdna-demo.vercel.app/results/octocat) - GitHub's mascot
- [**torvalds**](https://devdna-demo.vercel.app/results/torvalds) - Linux creator
- [**gaearon**](https://devdna-demo.vercel.app/results/gaearon) - React team member
- [**sindresorhus**](https://devdna-demo.vercel.app/results/sindresorhus) - Open source legend

---

## 🏗️ Architecture

### 📁 Project Structure

```
DevDNA/
├── 📂 frontend/                 # React + Vite + Tailwind
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI components
│   │   ├── 📂 pages/         # Route components
│   │   ├── 📂 services/      # API integration
│   │   └── 📂 utils/         # Helper functions
│   ├── 📄 package.json
│   └── ⚙️ vite.config.js
├── 📂 backend/                  # Node.js + Express
│   ├── 📂 src/
│   │   ├── 📂 controllers/    # Route handlers
│   │   ├── 📂 services/       # Business logic
│   │   ├── 📂 middleware/     # Express middleware
│   │   └── 📂 utils/         # Helper functions
│   ├── 📄 package.json
│   └── 🔧 server.js
└── 📚 docs/                     # Documentation
```

### 🔄 Tech Stack

#### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Chart.js** - Data visualization
- **html2canvas** - Image generation

#### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Axios** - HTTP client
- **Winston** - Logging
- **Rate Limiting** - API protection

#### APIs & Services
- **GitHub REST API** - User data source
- **Chart.js** - Interactive charts
- **html2canvas** - Image generation

---

## 🧪 Development

### 🛠️ Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
```

### 🧩 Environment Variables

#### Backend (.env)
```env
PORT=5000
GITHUB_API_TOKEN=your_github_token
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

---

## 📊 API Documentation

### 🔗 Endpoints

#### Analyze User
```http
GET /api/analyze/:username
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* GitHub user data */ },
    "repositories": { /* Repository statistics */ },
    "languages": { /* Language distribution */ },
    "personality": {
      "dominant_personality": { /* Personality analysis */ },
      "scores": { /* All personality scores */ },
      "insights": { /* Strengths, recommendations, careers */ }
    }
  }
}
```

#### Get Personality Types
```http
GET /api/personality/types
```

#### Health Check
```http
GET /api/health
```

### 📝 Rate Limiting

- **100 requests** per **15 minutes** per IP
- **Higher limits** with GitHub API token
- **CORS enabled** for frontend integration

---

## 🎨 Features Deep Dive

### 🧠 Personality Analysis Algorithm

Our sophisticated algorithm analyzes multiple dimensions:

#### Scoring Factors
- **Repository Patterns**: Count, frequency, originality
- **Language Diversity**: Number of languages, distribution
- **Community Engagement**: Stars, forks, followers
- **Code Quality**: Documentation, project maintenance
- **Activity Levels**: Consistency, recent contributions

#### Confidence Levels
- **Very High** (>30 point lead)
- **High** (>20 point lead)
- **Medium** (>10 point lead)
- **Low** (>5 point lead)
- **Very Low** (≤5 point lead)

### 📈 Visualizations

#### Interactive Charts
- **Personality Scores**: Bar chart with animations
- **Language Distribution**: Doughnut chart with percentages
- **Repository Statistics**: Multi-metric bar chart
- **Performance Metrics**: Key performance indicators

#### Shareable Images
- **High Resolution**: 1600px × 1200px (2x scale)
- **Personality Branding**: Unique gradients per type
- **Professional Design**: Glass morphism effects
- **Social Ready**: Optimized for social platforms

---

## 🚀 Deployment

### 🌐 Production Deployment

#### Frontend (Vercel/Netlify)
```bash
# Build
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
npm run build
# Upload dist/ folder to Netlify
```

#### Backend (Heroku/Railway)
```bash
# Deploy to Heroku
cd backend
heroku create
git push heroku main

# Or deploy to Railway
railway login
railway deploy
```

### 🐳 Docker Deployment

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### ⚙️ Environment Setup

1. **Configure all environment variables**
2. **Set up GitHub API token**
3. **Configure CORS for production**
4. **Set up monitoring and logging**
5. **Enable HTTPS in production**

---

## 🤝 Contributing

We love contributions! 🎉 Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### 🌟 Good First Issues

Perfect for newcomers:
- [🐛 Bug: Fix mobile responsiveness issues](https://github.com/yourusername/dev-dna/issues/1)
- [✨ Feature: Add more personality types](https://github.com/yourusername/dev-dna/issues/2)
- [📚 Docs: Improve API documentation](https://github.com/yourusername/dev-dna/issues/3)
- [🎨 UI: Add light theme toggle](https://github.com/yourusername/dev-dna/issues/4)
- [⚡ Performance: Optimize chart rendering](https://github.com/yourusername/dev-dna/issues/5)

### 📋 How to Contribute

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear commit messages
4. **Add tests** if applicable
5. **Ensure all tests pass**
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open Pull Request** with detailed description

### 📖 Development Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation for API changes
- Ensure responsive design
- Test on multiple browsers

📖 **Detailed contributing guidelines**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **GitHub** for providing the amazing API
- **Chart.js** for beautiful data visualization
- **Tailwind CSS** for the awesome utility framework
- **Framer Motion** for smooth animations
- **html2canvas** for image generation
- **All contributors** who make this project better

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [Open an Issue](https://github.com/yourusername/dev-dna/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Open an Issue](https://github.com/yourusername/dev-dna/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/dev-dna/discussions)
- 📧 **Email**: dev-dna@example.com

---

<div align="center">

**⭐ Star this repo if it helped you discover your developer DNA!**

Made with ❤️ by the Dev DNA team

[![GitHub stars](https://img.shields.io/github/stars/yourusername/dev-dna?style=social)](https://github.com/yourusername/dev-dna)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/dev-dna?style=social)](https://github.com/yourusername/dev-dna/fork)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/dev-dna)](https://github.com/yourusername/dev-dna/issues)

</div>
