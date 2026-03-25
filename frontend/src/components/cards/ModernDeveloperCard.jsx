import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'
import { Download, Share2, Sparkles, Code2, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Modern Shareable Developer Card Component
 * Modern, visually appealing with download functionality
 */
const ModernDeveloperCard = ({ user, personality, className = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const cardRef = useRef(null)

  // Generate tagline based on personality
  const generateTagline = () => {
    const taglines = {
      builder: [
        "Building the future, one commit at a time",
        "Architect of digital solutions",
        "Crafting code with precision",
        "Structured thinker, systematic builder"
      ],
      explorer: [
        "Exploring new technologies daily",
        "Digital adventurer, tech explorer",
        "Curiosity-driven developer",
        "Always learning, always growing"
      ],
      debugger: [
        "Finding solutions in complex problems",
        "Code detective, bug hunter",
        "Analytical mind, systematic approach",
        "Turning errors into opportunities"
      ],
      perfectionist: [
        "Crafting elegant, pixel-perfect code",
        "Quality-focused developer",
        "Attention to detail in every line",
        "Pursuit of code perfection"
      ],
      hustler: [
        "Shipping fast, learning faster",
        "Rapid prototyping, quick iteration",
        "Ambitious developer, constant growth",
        "Building at the speed of ideas"
      ]
    }
    
    const personalityTaglines = taglines[personality.dominant_personality.type] || taglines.builder
    return personalityTaglines[Math.floor(Math.random() * personalityTaglines.length)]
  }

  // Get personality gradient
  const getPersonalityGradient = () => {
    const gradients = {
      builder: 'from-blue-600 via-blue-700 to-blue-800',
      explorer: 'from-emerald-600 via-teal-600 to-cyan-700',
      debugger: 'from-amber-600 via-orange-600 to-red-700',
      perfectionist: 'from-purple-600 via-violet-600 to-indigo-700',
      hustler: 'from-rose-600 via-pink-600 to-fuchsia-700'
    }
    return gradients[personality.dominant_personality.type] || gradients.builder
  }

  // Get personality accent color
  const getPersonalityAccent = () => {
    const accents = {
      builder: 'bg-blue-500',
      explorer: 'bg-emerald-500',
      debugger: 'bg-amber-500',
      perfectionist: 'bg-purple-500',
      hustler: 'bg-rose-500'
    }
    return accents[personality.dominant_personality.type] || accents.builder
  }

  // Generate download as image
  const downloadAsImage = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    
    try {
      // Show the card temporarily if it's hidden
      const card = cardRef.current
      const originalDisplay = card.style.display
      card.style.display = 'block'

      // Configure canvas options for high quality
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: card.offsetWidth,
        height: card.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // Ensure all images load
          const clonedCard = clonedDoc.body.firstChild
          const images = clonedCard.querySelectorAll('img')
          images.forEach(img => {
            img.crossOrigin = 'anonymous'
          })
        }
      })

      // Restore original display
      card.style.display = originalDisplay

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${user.username}-dev-dna-card.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          toast.success('Developer card downloaded successfully!')
        }
      }, 'image/png', 1.0)

    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate card. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Share functionality
  const shareCard = async () => {
    if (!cardRef.current) return

    setIsSharing(true)
    
    try {
      const card = cardRef.current
      const originalDisplay = card.style.display
      card.style.display = 'block'

      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: card.offsetWidth,
        height: card.offsetHeight
      })

      card.style.display = originalDisplay

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `${user.username}-dev-dna-card.png`, { type: 'image/png' })
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `Dev DNA - ${user.name || user.username}`,
                text: `I'm a ${personality.dominant_personality.title}! Discover your developer personality type.`,
                files: [file]
              })
              toast.success('Card shared successfully!')
            } catch (error) {
              if (error.name !== 'AbortError') {
                throw error
              }
            }
          } else {
            // Fallback to download
            downloadAsImage()
          }
        }
      }, 'image/png')

    } catch (error) {
      console.error('Error sharing image:', error)
      toast.error('Failed to share card. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const tagline = generateTagline()
  const gradient = getPersonalityGradient()
  const accent = getPersonalityAccent()

  return (
    <>
      {/* Hidden Shareable Card for Image Generation */}
      <div 
        ref={cardRef}
        className="fixed -top-[9999px] -left-[9999px] w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ display: 'none' }}
      >
        {/* Card Header */}
        <div className={`bg-gradient-to-r ${gradient} p-8 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={user.name || user.username}
                className="w-20 h-20 rounded-2xl border-4 border-white/20 shadow-xl"
              />
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {user.name || user.username}
                </h1>
                <p className="text-white/80 text-sm">
                  @{user.username}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-white/60 mb-1">Dev DNA</div>
              <div className="text-xl font-bold text-white">
                {personality.dominant_personality.score}/100
              </div>
            </div>
          </div>
        </div>

        {/* Personality Section */}
        <div className="p-8 bg-gray-50">
          <div className="flex items-center gap-4 mb-6">
            <div className={`text-5xl`}>
              {personality.dominant_personality.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {personality.dominant_personality.title}
              </h2>
              <p className="text-gray-600 text-sm max-w-md">
                {personality.dominant_personality.description}
              </p>
            </div>
          </div>

          {/* Personality Score Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Personality Score</span>
              <span className="font-semibold">{personality.dominant_personality.score}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
                style={{ width: `${personality.dominant_personality.score}%` }}
              ></div>
            </div>
          </div>

          {/* Key Traits */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Traits</h3>
            <div className="grid grid-cols-2 gap-2">
              {personality.dominant_personality.traits.slice(0, 4).map((trait, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${accent} rounded-full`}></div>
                  <span className="text-sm text-gray-700">{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {user.public_repos || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Repositories</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {user.followers?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-600 mt-1">Followers</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(personality.metrics?.languages || {}).length}
              </div>
              <div className="text-xs text-gray-600 mt-1">Languages</div>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-center">
              <Sparkles className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600 italic">
                "{tagline}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`bg-gradient-to-r ${gradient} p-4 text-center`}>
          <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
            <Code2 className="w-4 h-4" />
            <span>Dev DNA - GitHub Personality Analyzer</span>
            <Heart className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${className}`}>
        <motion.button
          onClick={downloadAsImage}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${gradient} text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isGenerating ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Card</span>
            </>
          )}
        </motion.button>

        {navigator.share && (
          <motion.button
            onClick={shareCard}
            disabled={isSharing}
            className={`flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-gray-200`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSharing ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </>
  )
}

export default ModernDeveloperCard
