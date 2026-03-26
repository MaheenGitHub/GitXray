import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Github, Sparkles, Brain, Code2, Zap, Rocket, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const HomePage = () => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useV2, setUseV2] = useState(true) // Default to new experience
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast.error('Please enter a GitHub username')
      return
    }

    if (username.length < 1 || username.length > 39) {
      toast.error('Username must be between 1 and 39 characters')
      return
    }

    setIsLoading(true)
    
    try {
      // Navigate to appropriate results page based on experience choice
      if (useV2) {
        navigate(`/results-v2/${username.toLowerCase()}`)
      } else {
        navigate(`/results/${username.toLowerCase()}`)
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    // Only allow alphanumeric characters, hyphens, and underscores
    const sanitized = value.replace(/[^a-zA-Z0-9\-_]/g, '')
    setUsername(sanitized)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Brain className="w-12 h-12 text-blue-500" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Dev DNA
            </h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-2"
          >
            Discover Your Developer Personality
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Analyze GitHub profiles to uncover unique coding patterns, personality traits, and career insights
          </motion.p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-morphism rounded-2xl p-8 md:p-12 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Github className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={handleInputChange}
                placeholder="Enter GitHub username..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                disabled={isLoading}
                autoComplete="off"
                spellCheck="false"
              />
              {username && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !username.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5"
                  >
                    <Search />
                  </motion.div>
                  <span>Analyzing<span className="loading-dots"></span></span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze Developer DNA</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Experience Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-4 p-1 bg-gray-800/50 rounded-full backdrop-blur-sm">
            <span className="text-sm text-gray-400 px-3">Experience:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setUseV2(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  !useV2
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Classic
              </button>
              <button
                onClick={() => setUseV2(true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  useV2
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <Rocket className="w-4 h-4 inline mr-1" />
                V2 ✨
              </button>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Brain,
              title: 'Personality Analysis',
              description: 'Discover your unique developer personality type based on coding patterns',
              color: 'text-blue-500'
            },
            {
              icon: Code2,
              title: 'Code Insights',
              description: 'Get detailed analysis of your coding habits and technology preferences',
              color: 'text-purple-500'
            },
            {
              icon: Zap,
              title: 'Career Guidance',
              description: 'Receive personalized career suggestions based on your developer profile',
              color: 'text-yellow-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="glass-morphism rounded-xl p-6 text-center hover:scale-105 transition-transform duration-200"
            >
              <feature.icon className={`w-8 h-8 ${feature.color} mx-auto mb-3`} />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Sample Users */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">Try these popular developers:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['octocat', 'torvalds', 'gaearon', 'sindresorhus', 'addyosmani'].map((sample) => (
              <button
                key={sample}
                onClick={() => setUsername(sample)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors duration-200"
              >
                @{sample}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default HomePage
