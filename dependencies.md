# Dev DNA - Required Dependencies

## Frontend Dependencies (package.json)

```json
{
  "name": "devdna-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "axios": "^1.3.4",
    "chart.js": "^4.2.1",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "^0.323.0",
    "clsx": "^1.2.1",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^3.1.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.36.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "postcss": "^8.4.21",
    "tailwindcss": "^3.2.7",
    "vite": "^4.1.0"
  }
}
```

### Frontend Dependencies Explained

#### Core Dependencies
- **react** (^18.2.0) - Main UI library
- **react-dom** (^18.2.0) - React DOM renderer
- **react-router-dom** (^6.8.1) - Client-side routing
- **axios** (^1.3.4) - HTTP client for API calls

#### UI & Visualization
- **chart.js** (^4.2.1) - Charting library for data visualization
- **react-chartjs-2** (^5.2.0) - React wrapper for Chart.js
- **lucide-react** (^0.323.0) - Modern icon library
- **clsx** (^1.2.1) - Utility for conditional CSS classes

#### User Experience
- **react-hot-toast** (^2.4.0) - Beautiful toast notifications

#### Development Dependencies
- **@vitejs/plugin-react** (^3.1.0) - Vite plugin for React
- **vite** (^4.1.0) - Build tool and dev server
- **tailwindcss** (^3.2.7) - Utility-first CSS framework
- **autoprefixer** (^10.4.14) - PostCSS plugin for vendor prefixes
- **postcss** (^8.4.21) - CSS transformation tool
- **eslint** & plugins - Code linting and formatting

## Backend Dependencies (package.json)

```json
{
  "name": "devdna-backend",
  "version": "1.0.0",
  "description": "Dev DNA Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^6.0.1",
    "dotenv": "^16.0.3",
    "axios": "^1.3.4",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.8.3",
    "winston": "^3.8.2",
    "compression": "^1.7.4",
    "express-validator": "^6.15.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0",
    "supertest": "^6.3.3",
    "eslint": "^8.36.0"
  }
}
```

### Backend Dependencies Explained

#### Core Dependencies
- **express** (^4.18.2) - Web framework for Node.js
- **cors** (^2.8.5) - Enable Cross-Origin Resource Sharing
- **helmet** (^6.0.1) - Security middleware for Express
- **dotenv** (^16.0.3) - Load environment variables from .env file
- **axios** (^1.3.4) - HTTP client for GitHub API calls

#### Middleware & Validation
- **express-rate-limit** (^6.7.0) - Rate limiting for API endpoints
- **joi** (^17.8.3) - Data validation library
- **express-validator** (^6.15.0) - Express middleware for validation
- **compression** (^1.7.4) - Response compression middleware

#### Logging & Development
- **winston** (^3.8.2) - Logging library
- **nodemon** (^2.0.22) - Auto-restart server during development
- **jest** (^29.5.0) - Testing framework
- **supertest** (^6.3.3) - HTTP assertion library for testing

## Installation Commands

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Initialize npm project
npm init -y

# Install all dependencies
npm install react react-dom react-router-dom axios chart.js react-chartjs-2 lucide-react clsx react-hot-toast

# Install dev dependencies
npm install -D @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss vite
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Initialize npm project
npm init -y

# Install production dependencies
npm install express cors helmet dotenv axios express-rate-limit joi winston compression express-validator

# Install dev dependencies
npm install -D nodemon jest supertest eslint
```

## Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# GitHub API
GITHUB_API_TOKEN=your_github_personal_access_token
GITHUB_API_URL=https://api.github.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## GitHub API Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with these permissions:
   - `public_repo` (Access public repositories)
   - `read:user` (Read user profile data)
3. Add token to backend `.env` file

## Development Scripts

### Frontend Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### Backend Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

## Additional Tools (Optional)

### For Enhanced Development
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files
- **Redis** - For caching API responses
- **MongoDB** - For storing user analysis history

### For Production Deployment
- **PM2** - Process manager for Node.js
- **Nginx** - Reverse proxy and load balancer
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## Version Compatibility

All dependencies are chosen to work together:
- Node.js 16+ recommended
- React 18 with modern hooks
- Express 4.x for stability
- Tailwind CSS 3.x for latest features
- Vite 4.x for fast development

## Security Considerations

- Use environment variables for sensitive data
- Implement rate limiting to prevent abuse
- Validate all user inputs
- Use HTTPS in production
- Keep dependencies updated regularly
- Audit dependencies for vulnerabilities
