import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Brain, Star, GitFork, Users, Package, Code2, Share2, Download, FileText, Image, ChevronDown, X, Linkedin, Twitter, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { analyzeGitHubUser } from '../services/api'
import LanguageDistributionChart from '../components/charts/LanguageDistributionChart'
import PersonalityRadarChart from '../components/charts/PersonalityRadarChart'
import RepoHighlights from '../components/charts/RepoHighlights'
import CareerMatch from '../components/charts/CareerMatch'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ResultsPage = () => {
  console.log('🔍 ResultsPage component initializing...');
  
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const dashboardRef = useRef(null)
  
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
        console.log('Timestamp Data:', {
          analysis_timestamp: result.analysis_timestamp,
          fetch_timestamp: result.fetch_timestamp,
          cache_bust: result.cache_bust
        });
        
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

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/results/${username}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  const handleSocialShare = (platform, message) => {
    const shareUrl = `${window.location.origin}/results/${username}`
    const fullMessage = `${message} ${shareUrl}`
    
    const urls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(fullMessage)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullMessage)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(fullMessage)}`
    }
    
    window.open(urls[platform], '_blank')
  }

  const handleDownload = () => {
    if (!data || !data.user || !data.personality) {
      toast.error('Data not loaded yet');
      return;
    }
    
    const reportData = {
      user: data.user,
      personality: data.personality,
      analysis_date: new Date().toISOString(),
      fetch_timestamp: data.fetch_timestamp,
      cache_bust: data.cache_bust,
    }
    
    const filename = `${username}-gitxray.json`
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Report downloaded successfully!')
  }

  const handlePDFExport = async () => {
    if (!dashboardRef.current) {
      toast.error('Dashboard not ready for export')
      return;
    }

    try {
      toast.loading('Generating PDF...')
      
      // Capture the dashboard area (excluding the back button)
      const element = dashboardRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1f2937'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${username}-gitxray.pdf`)
      
      toast.success('PDF exported successfully!')
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to export PDF')
    }
  }

  const handleImageExport = async () => {
    if (!dashboardRef.current) {
      toast.error('Dashboard not ready for export')
      return;
    }

    try {
      toast.loading('Generating image...')
      
      const element = dashboardRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1f2937'
      })
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${username}-gitxray.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        toast.success('Image exported successfully!')
      }, 'image/png')
    } catch (error) {
      console.error('Image export error:', error)
      toast.error('Failed to export image')
    }
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

  // Comprehensive debugging
  console.log('🔍 DETAILED DATA STRUCTURE ANALYSIS:');
  console.log('Full data object:', data);
  console.log('User object:', user);
  console.log('Repositories object:', repositories);
  console.log('Languages object:', languages);
  console.log('Personality object:', personality);
  console.log('Data type checks:', {
    data: typeof data,
    user: typeof user,
    repositories: typeof repositories,
    languages: typeof languages,
    personality: typeof personality
  });
  console.log('Value checks:', {
    userFollowers: user?.followers,
    userUsername: user?.username,
    repoTotalCount: repositories?.total_count,
    repoStats: repositories?.stats,
    repoStars: repositories?.stats?.total_stars,
    languagesCount: Object.keys(languages || {}).length
  });

  // Core stats array
  const coreStats = [
    {
      icon: Package,
      label: 'Project Portfolio',
      value: repositories?.total_count || 0,
      color: 'text-blue-500'
    },
    {
      icon: Star,
      label: 'Community Impact',
      value: (repositories?.stats?.total_stars || 0).toLocaleString(),
      color: 'text-yellow-500'
    },
    {
      icon: GitFork,
      label: 'Network Reach',
      value: (repositories?.stats?.total_forks || 0).toLocaleString(),
      color: 'text-purple-500'
    },
    {
      icon: Code2,
      label: 'Tech Diversity',
      value: Object.keys(languages || {}).length,
      color: 'text-green-500'
    }
  ];

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
          
          {/* Action Buttons Container */}
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg border-2 border-emerald-600 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share Profile</span>
            </motion.button>
            
            {/* Export Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg border-2 border-indigo-600 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
                <ChevronDown className="w-3 h-3" />
              </motion.button>
              
              {showExportDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span className="text-white">Download JSON</span>
                  </button>
                  <button
                    onClick={handlePDFExport}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span className="text-white">Download PDF</span>
                  </button>
                  <button
                    onClick={handleImageExport}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors"
                  >
                    <Image className="w-4 h-4 text-green-400" />
                    <span className="text-white">Save as Image</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Dashboard Content */}
        <div ref={dashboardRef} className="space-y-8">

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
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{user?.followers || 0} followers</span>
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">{repositories?.total_count || 0} repos</span>
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{repositories?.stats?.total_stars || 0} stars</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {coreStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="glass-morphism rounded-xl p-6 text-center"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Personality Card */}
        {personality && personality.dominant_personality && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-morphism rounded-2xl p-8 mb-8"
          >
            <div className="text-center">
              <motion.div 
                className="text-6xl mb-4 inline-block"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {personality.dominant_personality.icon}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {personality.dominant_personality.title}
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                {personality.dominant_personality.description}
              </p>
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-white">
                  {personality.dominant_personality.score}/100
                </div>
                <div className="text-lg text-gray-400">
                  Confidence: {personality.confidence}
                </div>
              </div>
              {personality.dominant_personality.traits && (
                <div className="flex flex-wrap justify-center gap-2">
                  {personality.dominant_personality.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Data Visualization Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Language Distribution Chart */}
          <LanguageDistributionChart languages={languages} />
          
          {/* Personality Radar Chart */}
          <PersonalityRadarChart personality={personality} />
        </motion.div>

        {/* Repository Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <RepoHighlights repositories={repositories} username={username} limit={3} />
        </motion.div>

        {/* Career Match Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <CareerMatch personality={personality} languages={languages} />
        </motion.div>

        {/* Data Verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-morphism rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Data Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Analysis Date</div>
              <div className="text-white">
                {new Date(data.analysis_timestamp).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Fetch Time</div>
              <div className="text-white">
                {new Date(data.fetch_timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Cache Status</div>
              <div className="text-green-400">Live Data</div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
      
      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Share Your Developer DNA</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-700/50 rounded-lg">
              {data?.user?.avatar_url ? (
                <img 
                  src={data.user.avatar_url} 
                  alt={data.user.username}
                  className="w-16 h-16 rounded-full"
                />
              ) : null}
              <div>
                <div className="text-lg font-semibold text-white mb-1">
                  {data?.user?.username}
                </div>
                <div className="text-sm text-blue-400">
                  Developer DNA: {data?.personality?.dominant_personality?.title}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Share Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/results/${username}`}
                  readOnly
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-3">Share on Social Media</div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => handleSocialShare('linkedin', 'Check out my Developer DNA report on GitXray! 🧭')}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-blue-400" />
                  <span className="text-white text-sm">LinkedIn</span>
                </button>
                <button
                  onClick={() => handleSocialShare('twitter', 'Check out my Developer DNA report on GitXray! 🧭')}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Twitter className="w-6 h-6 text-sky-400" />
                  <span className="text-white text-sm">Twitter/X</span>
                </button>
                <button
                  onClick={() => handleSocialShare('whatsapp', 'Check out my Developer DNA report on GitXray! 🧭')}
                  className="flex flex-col items-center gap-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-green-400" />
                  <span className="text-white text-sm">WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ResultsPage
