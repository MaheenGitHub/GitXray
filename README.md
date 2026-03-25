# Dev DNA - GitHub Personality Analyzer

A full-stack web application that analyzes a GitHub user's profile and determines their coding personality type.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- GitHub Personal Access Token
- Git installed

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd DevDNA
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Add your GitHub token to .env file
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 Project Overview

Dev DNA analyzes GitHub profiles to determine coding personality types based on:
- Repository patterns and languages
- Commit frequency and timing
- Code collaboration style
- Project diversity

### Personality Types
- **Builder** - Consistent, structured developers
- **Explorer** - Experimental, multi-language developers  
- **Debugger** - Problem-solving focused developers
- **Collaborator** - Team-oriented, community builders
- **Innovator** - Creative, cutting-edge developers

## 🏗️ Architecture

### Frontend (React + Vite + Tailwind)
- Component-based architecture
- Responsive design
- Real-time data visualization
- Modern UI/UX patterns

### Backend (Node.js + Express)
- RESTful API design
- GitHub API integration
- Personality analysis engine
- Rate limiting and security

## 📚 Documentation

- [Project Structure](./project-structure.md)
- [Development Plan](./development-plan.md)
- [Dependencies](./dependencies.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🛠️ Development

### Environment Variables

**Backend (.env)**
```env
PORT=5000
GITHUB_API_TOKEN=your_github_token
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Scripts

**Frontend**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

**Backend**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect repository to deployment platform
2. Set environment variables
3. Deploy automatically on push to main

### Backend (Heroku/Railway)
1. Connect repository to deployment platform
2. Set environment variables including GitHub token
3. Deploy and configure custom domain

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)

---

Built with ❤️ by the Dev DNA team
