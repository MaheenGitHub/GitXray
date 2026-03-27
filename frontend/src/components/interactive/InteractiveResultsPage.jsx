import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Github, 
  Star, 
  GitFork, 
  Users, 
  Package,
  TrendingUp,
  Brain,
  Target,
  Lightbulb,
  Share2,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

// Import our new interactive components
import ExpandableSection from './ExpandableSection'
import HoverTooltip, { InfoTooltip, HelpTooltip } from './HoverTooltip'
import AnimatedCard, { MetricCard, ProgressCard } from './AnimatedCard'

// Import existing components
import { analyzeGitHubUser } from '../services/api'
import ShareableImage from '../ShareableImage'

/**
 * Interactive Results Page with expandable sections, tooltips, and animations
 */
const InteractiveResultsPage = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    personality: true,
    insights: false,
    metrics: false,
    recommendations: false
  })

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!data) {
    return <EmptyState />
  }

  const { user, personality, repositories, languages } = data

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          <div className="flex items-center gap-3">
            <ShareableImage 
              user={user}
              personality={personality}
              className="flex items-center gap-2"
            />
            <motion.button
              onClick={() => {/* Share functionality */}}
              className="p-2 glass-morphism rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* User Profile Section */}
        <motion.div variants={itemVariants}>
          <AnimatedCard className="mb-8">
            <div className="flex items-center gap-6">
              <motion.img
                src={user.avatar_url}
                alt={user.name || user.username}
                className="w-20 h-20 rounded-full border-4 border-blue-500/20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
              />
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {user.name || user.username}
                </h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <span>@{user.username}</span>
                  <span>•</span>
                  <InfoTooltip content="Public repositories">
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {user.public_repos}
                    </span>
                  </InfoTooltip>
                  <span>•</span>
                  <InfoTooltip content="Followers on GitHub">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {user.followers}
                    </span>
                  </InfoTooltip>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </motion.div>

        {/* Personality Analysis Section */}
        <motion.div variants={itemVariants}>
          <ExpandableSection
            title="Cognitive Blueprint"
            icon={<Brain className="w-5 h-5 text-blue-400" />}
            tooltip="Deep analysis of your coding psychology and problem-solving approaches"
            isExpanded={expandedSections.personality}
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dominant Personality */}
              <AnimatedCard delay={0.1} className="md:col-span-2">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="text-4xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {personality.dominant_personality.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {personality.dominant_personality.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {personality.dominant_personality.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-white font-semibold">
                      {personality.dominant_personality.confidence}%
                    </span>
                  </div>
                  
                  <ProgressCard
                    title="Personality Score"
                    value={personality.dominant_personality.score}
                    maxValue={100}
                    color="blue"
                    size="large"
                    delay={0.3}
                  />
                </div>
              </AnimatedCard>

              {/* Personality Traits */}
              <AnimatedCard delay={0.2}>
                <h4 className="text-lg font-semibold text-white mb-4">Key Traits</h4>
                <div className="space-y-3">
                  {personality.dominant_personality.traits.map((trait, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{trait}</span>
                    </motion.div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* All Personality Scores */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-4">All Personality Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(personality.scores).map(([type, score], index) => (
                  <AnimatedCard key={type} delay={0.4 + index * 0.1}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 capitalize">{type}</span>
                      <span className="text-white font-semibold">{score}</span>
                    </div>
                    <ProgressCard
                      value={score}
                      maxValue={100}
                      color={type === personality.dominant_personality.type ? 'blue' : 'gray'}
                      size="small"
                      animated={false}
                    />
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </ExpandableSection>
        </motion.div>

        {/* Insights Section */}
        <motion.div variants={itemVariants}>
          <ExpandableSection
            title="Behavioral Patterns"
            icon={<Lightbulb className="w-5 h-5 text-amber-400" />}
            tooltip="AI-driven insights into your coding behaviors and development habits"
            isExpanded={expandedSections.insights}
            className="mb-6"
          >
            <div className="space-y-4">
              {personality.insights?.map((insight, index) => (
                <AnimatedCard key={index} delay={index * 0.1}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      {insight.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-white">{insight.title}</h5>
                        <HelpTooltip content={`Confidence: ${insight.confidence}%`}>
                          <span className="text-xs text-gray-400">
                            {insight.confidence}% confidence
                          </span>
                        </HelpTooltip>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{insight.message}</p>
                      
                      {insight.advice && (
                        <motion.div
                          className="p-3 bg-gray-800/50 rounded-lg"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                        >
                          <p className="text-xs text-gray-400">
                            <strong>Advice:</strong> {insight.advice}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </ExpandableSection>
        </motion.div>

        {/* Metrics Section */}
        <motion.div variants={itemVariants}>
          <ExpandableSection
            title="Development Analytics"
            icon={<Target className="w-5 h-5 text-green-400" />}
            tooltip="Comprehensive statistics about your coding activity and project contributions"
            isExpanded={expandedSections.metrics}
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Code Projects"
                value={repositories.length}
                icon={<Package className="w-5 h-5" />}
                color="blue"
                description="Active development repositories"
                delay={0}
              />
              
              <MetricCard
                title="Community Recognition"
                value={repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)}
                icon={<Star className="w-5 h-5" />}
                color="amber"
                description="Total stars earned"
                delay={0.1}
              />
              
              <MetricCard
                title="Collaboration Impact"
                value={repositories.reduce((sum, repo) => sum + (repo.forks_count || 0), 0)}
                icon={<GitFork className="w-5 h-5" />}
                color="purple"
                description="Project forks created"
                delay={0.2}
              />
              
              <MetricCard
                title="Technology Stack"
                value={Object.keys(languages || {}).length}
                icon={<TrendingUp className="w-5 h-5" />}
                color="green"
                description="Programming languages used"
                delay={0.3}
              />
            </div>

            {/* Language Distribution */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Technology Landscape</h4>
              <div className="space-y-3">
                {Object.entries(languages || {})
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([language, bytes], index) => {
                    const total = Object.values(languages || {}).reduce((sum, val) => sum + val, 0)
                    const percentage = ((bytes / total) * 100).toFixed(1)
                    
                    return (
                      <AnimatedCard key={language} delay={0.5 + index * 0.1}>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{language}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">{percentage}%</span>
                            <div className="w-32 bg-gray-700 rounded-full h-2">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                              />
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
                    )
                  })}
              </div>
            </div>
          </ExpandableSection>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div variants={itemVariants}>
          <ExpandableSection
            title="Growth Strategies"
            icon={<Target className="w-5 h-5 text-purple-400" />}
            tooltip="Personalized action items to accelerate your professional development"
            isExpanded={expandedSections.recommendations}
            className="mb-6"
          >
            <div className="space-y-4">
              {personality.recommendations?.map((rec, index) => (
                <AnimatedCard key={index} delay={index * 0.1}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        rec.priority === 'high' ? 'bg-red-500' :
                        rec.priority === 'medium' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      {rec.priority.toUpperCase()}
                    </motion.div>
                    
                    <div className="flex-1">
                      <h5 className="font-semibold text-white mb-2">{rec.title}</h5>
                      <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
                      
                      {rec.actions && (
                        <div className="space-y-2">
                          <strong className="text-xs text-gray-400">Actions:</strong>
                          {rec.actions.map((action, actionIndex) => (
                            <motion.div
                              key={actionIndex}
                              className="flex items-center gap-2 text-xs text-gray-300"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + actionIndex * 0.05, duration: 0.2 }}
                            >
                              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                              {action}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </ExpandableSection>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

// Error State Component
const ErrorState = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      className="glass-morphism rounded-xl p-8 max-w-md text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-white mb-4">Error</h2>
      <p className="text-gray-300">{error}</p>
    </motion.div>
  </div>
)

// Empty State Component
const EmptyState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-white mb-4">No Data Available</h2>
      <p className="text-gray-400">Unable to load user data.</p>
    </motion.div>
  </div>
)

export default InteractiveResultsPage
