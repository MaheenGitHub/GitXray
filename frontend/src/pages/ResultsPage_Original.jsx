import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Github, 
  Star, 
  GitFork, 
  Users, 
  Package, 
  Code2,
  TrendingUp,
  Award,
  Brain,
  Target,
  Lightbulb,
  Briefcase,
  Share2,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import { analyzeGitHubUser } from '../services/api'
import PersonalityCard from '../components/PersonalityCard'
import StatsChart from '../components/StatsChart'
import LanguageChart from '../components/LanguageChart'
import LanguagePieChart from '../components/LanguagePieChart'
import RepoStatsChart from '../components/RepoStatsChart'
import ShareableImage from '../components/ShareableImage'

const ResultsPage = () => {
  try {
    console.log('🔍 ResultsPage component initializing...');
    
    const { username } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    console.log('🔍 ResultsPage state initialized:', { username, loading, error, data });

    useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await analyzeGitHubUser(username)
        setData(result)
      } catch (err) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchData()
    }
  }, [username])

  const handleShare = async () => {
    if (!data || !data.user || !data.personality) {
      toast.error('Data not loaded yet');
      return;
    }
    
    const shareData = {
      title: `GitXray - ${data.user.name || username}`,
      text: `I'm a ${data.personality.dominant_personality?.name || 'developer'}! Discover your developer personality type.`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } catch (err) {
      toast.error('Failed to share')
    }
  }

  const handleDownload = () => {
    if (!data || !data.user || !data.personality) {
      toast.error('Data not loaded yet');
      return;
    }
    
    const reportData = {
      user: data.user,
      personality: data.personality,
      analysis_date: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${username}-dev-dna-report.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Brain className="w-16 h-16 text-blue-500" />
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="text-red-500 mb-4">
            <Github className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  // Additional safety check
  if (!data || !user || !repositories) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="text-yellow-500 mb-4">
            <Github className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Data Loading</h2>
          <p className="text-gray-400 mb-6">Please wait while we fetch your GitHub data...</p>
        </motion.div>
      </div>
    )
  }

  const { user, repositories, languages, personality } = data || {}

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center gap-3">
            <ShareableImage 
              user={user}
              personality={personality}
              repositories={data.repositories}
              className="flex items-center gap-2"
            />
            <button
              onClick={handleShare}
              className="p-2 glass-morphism rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
              title="Share results link"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 glass-morphism rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
              title="Download report"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-morphism rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user.avatar_url}
              alt={user.name || username}
              className="w-24 h-24 rounded-full border-4 border-gray-700"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.name || username}
              </h1>
              <p className="text-gray-400 mb-4">@{user.username}</p>
              {user.bio && (
                <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>{user.followers.toLocaleString()} followers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Package className="w-4 h-4" />
                  <span>{repositories.total_count} repos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="w-4 h-4" />
                  <span>{repositories.stats.total_stars.toLocaleString()} stars</span>
                </div>
              </div>
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View Profile
            </a>
          </div>
        </motion.div>

        {/* Personality Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <PersonalityCard personality={personality} />
        </motion.div>

        {/* Core Competencies Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              icon: Package,
              label: 'Project Portfolio',
              value: repositories.total_count,
              color: 'text-blue-500'
            },
            {
              icon: Star,
              label: 'Community Impact',
              value: repositories.stats.total_stars.toLocaleString(),
              color: 'text-yellow-500'
            },
            {
              icon: GitFork,
              label: 'Network Reach',
              value: repositories.stats.total_forks.toLocaleString(),
              color: 'text-purple-500'
            },
            {
              icon: Code2,
              label: 'Tech Diversity',
              value: Object.keys(languages).length,
              color: 'text-green-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="glass-morphism rounded-xl p-6 text-center"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Cognitive Architecture
            </h3>
            <StatsChart scores={personality.scores} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-green-500" />
              Technology Ecosystem
            </h3>
            <LanguagePieChart languages={languages} />
          </motion.div>
        </div>

        {/* Additional Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" />
              Project Analytics
            </h3>
            <RepoStatsChart repositoryStats={repositories.stats} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Performance Indicators
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Engagement Rate</span>
                <span className="text-white font-semibold">
                  {repositories.total_count > 0 
                    ? (repositories.stats.total_stars / repositories.total_count).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Collaboration Index</span>
                <span className="text-white font-semibold">
                  {repositories.total_count > 0 
                    ? (repositories.stats.total_forks / repositories.total_count).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Innovation Ratio</span>
                <span className="text-white font-semibold">
                  {repositories.total_count > 0 
                    ? `${((repositories.stats.original_count / repositories.total_count) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <span className="text-gray-300">Developer Tenure</span>
                <span className="text-white font-semibold">
                  {Math.floor((new Date() - new Date(user.created_at)) / (365.25 * 24 * 60 * 60 * 1000))} years
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Strategic Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            className="glass-morphism rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">Core Advantages</h3>
            </div>
            <ul className="space-y-2">
              {personality.insights.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.0 }}
            className="glass-morphism rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-white">Growth Opportunities</h3>
            </div>
            <ul className="space-y-2">
              {personality.insights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            className="glass-morphism rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-white">Professional Pathways</h3>
            </div>
            <ul className="space-y-2">
              {personality.insights.career_suggestions.map((career, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm">{career}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('🔍 ResultsPage component error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Component Error</h2>
          <p className="text-white mb-4">Something went wrong loading this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}

export default ResultsPage
