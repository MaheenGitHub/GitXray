import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Brain } from 'lucide-react'
import toast from 'react-hot-toast'
import { analyzeGitHubUser } from '../services/api'

const ResultsPage = () => {
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
        console.log('🔍 MAKING API CALL FOR USERNAME:', username);
        setLoading(true)
        const result = await analyzeGitHubUser(username)
        
        console.log('🔍 FRONTEND RECEIVED DATA:');
        console.log('Full Result:', JSON.stringify(result, null, 2));
        console.log('User Data:', result.user);
        console.log('User Followers:', result.user?.followers);
        console.log('Repository Stats:', result.repositories?.stats);
        console.log('Analysis Data:', result.analysis);
        console.log('Stats Object:', result.stats);
        
        setData(result)
      } catch (err) {
        console.error('🔍 API ERROR:', err);
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
  if (!data || !data.user || !data.repositories) {
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

  const { user, repositories, languages, personality } = data

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
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Debug Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Debug Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">User Data:</h3>
              <pre className="text-gray-300 text-sm overflow-auto max-h-40">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Repository Stats:</h3>
              <pre className="text-gray-300 text-sm overflow-auto max-h-40">
                {JSON.stringify(repositories, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Personality Data:</h3>
              <pre className="text-gray-300 text-sm overflow-auto max-h-40">
                {JSON.stringify(personality, null, 2)}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultsPage
