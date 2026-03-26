import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, Camera, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

const ShareableImage = ({ user, personality, repositories, className = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const cardRef = useRef(null)

  const getPersonalityGradient = (type) => {
    const gradients = {
      builder: 'from-blue-600 to-blue-800',
      explorer: 'from-green-600 to-green-800',
      debugger: 'from-amber-600 to-amber-800',
      perfectionist: 'from-purple-600 to-purple-800',
      hustler: 'from-red-600 to-red-800'
    }
    return gradients[type] || 'from-gray-600 to-gray-800'
  }

  const getPersonalityColor = (type) => {
    const colors = {
      builder: '#3B82F6',
      explorer: '#10B981',
      debugger: '#F59E0B',
      perfectionist: '#8B5CF6',
      hustler: '#EF4444'
    }
    return colors[type] || '#6B7280'
  }

  const generateImage = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    
    try {
      // Show the card temporarily if it's hidden
      const card = cardRef.current
      const originalDisplay = card.style.display
      card.style.display = 'block'

      // Configure canvas options
      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: card.offsetWidth,
        height: card.offsetHeight,
        scrollX: 0,
        scrollY: 0
      })

      // Restore original display
      card.style.display = originalDisplay

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${user.username}-dev-dna-result.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          toast.success('Image downloaded successfully!')
        }
      }, 'image/png')

    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const shareImage = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    
    try {
      const card = cardRef.current
      const originalDisplay = card.style.display
      card.style.display = 'block'

      const canvas = await html2canvas(card, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      })

      card.style.display = originalDisplay

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `${user.username}-dev-dna-result.png`, { type: 'image/png' })
          
          if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `Dev DNA - ${user.name || user.username}`,
                text: `I'm a ${personality.dominant_personality.name}! Discover your developer personality type.`,
                files: [file]
              })
              toast.success('Image shared successfully!')
            } catch (error) {
              if (error.name !== 'AbortError') {
                throw error
              }
            }
          } else {
            // Fallback to download
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${user.username}-dev-dna-result.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            
            toast.success('Image downloaded successfully!')
          }
        }
      }, 'image/png')

    } catch (error) {
      console.error('Error sharing image:', error)
      toast.error('Failed to share image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Hidden Shareable Card for Image Generation */}
      <div 
        ref={cardRef}
        className="fixed -top-[9999px] -left-[9999px] w-[800px] bg-white"
        style={{ display: 'none' }}
      >
        <div className={`bg-gradient-to-br ${getPersonalityGradient(personality.dominant_personality.type)} p-8 rounded-2xl`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url}
                alt={user.name || user.username}
                className="w-16 h-16 rounded-full border-4 border-white/20"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.name || user.username}
                </h1>
                <p className="text-white/80">@{user.username}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60 mb-1">Dev DNA</div>
              <div className="text-lg font-bold text-white">
                {personality.dominant_personality.score}/100
              </div>
            </div>
          </div>

          {/* Personality Result */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{personality.dominant_personality.icon}</div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {personality.dominant_personality.title}
                </h2>
                <p className="text-white/80 text-sm">
                  {personality.dominant_personality.description}
                </p>
              </div>
            </div>

            {/* Personality Score Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>Personality Score</span>
                <span>{personality.dominant_personality.score}/100</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-white transition-all duration-1000"
                  style={{ width: `${personality.dominant_personality.score}%` }}
                ></div>
              </div>
            </div>

            {/* Key Traits */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Key Traits</h3>
              <div className="grid grid-cols-2 gap-2">
                {personality.dominant_personality.traits.slice(0, 4).map((trait, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs text-white/90">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {repositories?.total_count || 0}
              </div>
              <div className="text-xs text-white/60">Repositories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {user.followers?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-white/60">Followers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {Object.keys(personality.metrics?.languages || {}).length}
              </div>
              <div className="text-xs text-white/60">Languages</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  🧬
                </div>
                <span className="text-white/80 text-sm">Dev DNA - GitHub Personality Analyzer</span>
              </div>
              <div className="text-white/60 text-xs">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${className}`}>
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </>
          )}
        </button>

        {navigator.share && (
          <button
            onClick={shareImage}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sharing...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        )}
      </div>
    </>
  )
}

export default ShareableImage
