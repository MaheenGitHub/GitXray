import { motion } from 'framer-motion'
import { Award, TrendingUp, Users, Target } from 'lucide-react'

const PersonalityCard = ({ personality }) => {
  const { dominant_personality, scores, confidence } = personality
  
  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'Very High': return 'text-green-500'
      case 'High': return 'text-blue-500'
      case 'Medium': return 'text-yellow-500'
      case 'Low': return 'text-orange-500'
      case 'Very Low': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

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

  const getPersonalityGlow = (type) => {
    const glows = {
      builder: 'glow',
      explorer: 'glow-green',
      debugger: 'glow-amber',
      perfectionist: 'glow-purple',
      hustler: 'glow-red'
    }
    return glows[type] || ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`glass-morphism rounded-2xl p-8 relative overflow-hidden ${getPersonalityGlow(dominant_personality.type)}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getPersonalityGradient(dominant_personality.type)} opacity-10`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 mb-4"
          >
            <span className="text-4xl">{dominant_personality.icon}</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            {dominant_personality.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-300 mb-4"
          >
            {dominant_personality.description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{dominant_personality.score}</span>
              <span className="text-gray-400">/100</span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                {confidence} Confidence
              </span>
            </div>
          </div>
        </div>

        {/* Personality Traits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Key Traits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dominant_personality.traits.map((trait, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">{trait}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* All Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            All Personality Scores
          </h3>
          <div className="space-y-3">
            {Object.entries(scores).map(([type, score]) => {
              const isDominant = type === dominant_personality.type
              const personalityInfo = {
                builder: { name: 'Builder', icon: '🏗️', color: 'bg-blue-500' },
                explorer: { name: 'Explorer', icon: '🧭', color: 'bg-green-500' },
                debugger: { name: 'Debugger', icon: '🔍', color: 'bg-amber-500' },
                perfectionist: { name: 'Perfectionist', icon: '💎', color: 'bg-purple-500' },
                hustler: { name: 'Hustler', icon: '🚀', color: 'bg-red-500' }
              }
              
              const info = personalityInfo[type]
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 + Object.keys(scores).indexOf(type) * 0.1 }}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    isDominant 
                      ? 'bg-gray-800/50 border border-gray-700' 
                      : 'bg-gray-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{info.icon}</span>
                      <span className={`font-medium ${isDominant ? 'text-white' : 'text-gray-400'}`}>
                        {info.name}
                      </span>
                      {isDominant && (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          Dominant
                        </span>
                      )}
                    </div>
                    <span className={`font-bold ${isDominant ? 'text-white' : 'text-gray-400'}`}>
                      {score}/100
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 1 + Object.keys(scores).indexOf(type) * 0.1 }}
                      className={`h-2 rounded-full ${info.color}`}
                    ></motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default PersonalityCard
