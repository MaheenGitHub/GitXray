# Dev DNA Frontend

Modern React frontend for GitHub personality analyzer with dark theme and beautiful UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend API running on port 5000

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎨 Features

### Modern Dark Theme
- Beautiful gradient backgrounds
- Glass morphism effects
- Smooth animations with Framer Motion
- Responsive design for all devices

### Pages
- **Home Page**: GitHub username input with modern form
- **Results Page**: Comprehensive personality analysis display
- **404 Page**: Custom not found page

### Components
- **PersonalityCard**: Displays personality type with scores
- **StatsChart**: Bar chart for personality scores
- **LanguageChart**: Doughnut chart for language distribution

### Interactive Elements
- Animated loading states
- Hover effects and transitions
- Toast notifications
- Share and download functionality

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Chart.js** - Data visualization
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Adaptive layouts

## 🎯 User Experience

- Smooth page transitions
- Loading animations
- Error handling with toast notifications
- Keyboard navigation support
- Accessibility considerations

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Dev DNA
VITE_APP_VERSION=1.0.0
```

### Tailwind CSS Configuration
- Dark mode enabled
- Custom color palette
- Custom animations
- Extended theme

## 📊 Charts and Visualizations

### Personality Scores Chart
- Bar chart showing all personality scores
- Animated on load
- Interactive tooltips
- Color-coded by personality type

### Language Distribution Chart
- Doughnut chart for language usage
- Top 8 languages displayed
- Percentage calculations
- Size in MB display

## 🎭 Animations

- Page transitions with Framer Motion
- Component entrance animations
- Hover states and micro-interactions
- Loading spinners and progress bars

## 🔗 API Integration

- Automatic error handling
- Request/response interceptors
- Loading states management
- Toast notifications for user feedback

## 📦 Build and Deploy

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 🌟 Key Features

### Glass Morphism Design
- Modern frosted glass effect
- Backdrop blur filters
- Layered transparency
- Beautiful depth perception

### Personality Display
- Dynamic color schemes
- Personality-specific gradients
- Confidence indicators
- Progress bars with animations

### Interactive Elements
- Share functionality
- Download reports
- External profile links
- Sample user suggestions

## 🎨 Design System

### Color Palette
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Purple: Purple (#8B5CF6)
- Danger: Red (#EF4444)

### Typography
- Inter font for UI text
- JetBrains Mono for code
- Responsive font sizes
- High contrast for readability

### Spacing
- Consistent spacing scale
- Responsive breakpoints
- Component-based layouts
- Flexible grid system

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Configure build settings
3. Set environment variables

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript for new components
3. Add tests for new features
4. Update documentation

## 📄 License

MIT License - see LICENSE file for details
