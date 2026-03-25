import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Developer Card Preview Component
 * Shows a preview of the shareable card with copy functionality
 */
const DeveloperCardPreview = ({ user, personality, className = '' }) => {
  const [copied, setCopied] = useState(false)

  // Generate tagline
  const generateTagline = () => {
    const taglines = {
      builder: "Building the future, one commit at a time",
      explorer: "Exploring new technologies daily",
      debugger: "Finding solutions in complex problems",
      perfectionist: "Crafting elegant, pixel-perfect code",
      hustler: "Shipping fast, learning faster"
    }
    
    return taglines[personality.dominant_personality.type] || taglines.builder
  }

  const getPersonalityGradient = () => {
    const gradients = {
      builder: 'from-blue-600 to-blue-800',
      explorer: 'from-emerald-600 to-cyan-700',
      debugger: 'from-amber-600 to-red-700',
      perfectionist: 'from-purple-600 to-indigo-700',
      hustler: 'from-rose-600 to-fuchsia-700'
    }
    return gradients[personality.dominant_personality.type] || gradients.builder
  }

  const copyToClipboard = async () => {
    const cardData = {
      name: user.name || user.username,
      username: user.username,
      personality: personality.dominant_personality.title,
      score: personality.dominant_personality.score,
      tagline: generateTagline(),
      avatar: user.avatar_url,
      repos: user.public_repos,
      followers: user.followers,
      languages: Object.keys(personality.metrics?.languages || {}).length
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(cardData, null, 2))
      setCopied(true)
      toast.success('Card data copied to clipboard!')
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const tagline = generateTagline()
  const gradient = getPersonalityGradient()

  return (
    <motion.div
      className={`glass-morphism rounded-xl p-6 max-w-md mx-auto ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Mini Preview Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-4">
        {/* Header */}
        <div className={`bg-gradient-to-r ${gradient} p-4`}>
          <div className="flex items-center gap-3">
            <img
              src={user.avatar_url}
              alt={user.name || user.username}
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">
                {user.name || user.username}
              </h3>
              <p className="text-white/80 text-xs">
                @{user.username}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Score</div>
              <div className="text-sm font-bold text-white">
                {personality.dominant_personality.score}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">
              {personality.dominant_personality.icon}
            </span>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                {personality.dominant_personality.title}
              </h4>
              <p className="text-gray-600 text-xs italic">
                "{tagline}"
              </p>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {user.public_repos || 0}
              </div>
              <div className="text-xs text-gray-600">Repos</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {user.followers?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600">Followers</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">
                {Object.keys(personality.metrics?.languages || {}).length}
              </div>
              <div className="text-xs text-gray-600">Languages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={copyToClipboard}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Data</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => {/* Preview full card */}}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DeveloperCardPreview
