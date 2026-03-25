import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Sparkles, Flame } from 'lucide-react'
import { InfoTooltip } from './HoverTooltip'

/**
 * Interactive Mode Selector Component
 * Dark, modern, minimal but engaging with smooth animations
 */
const InteractiveModeSelector = ({ currentMode, onModeChange, className = '' }) => {
  const modes = [
    {
      id: 'professional',
      name: 'Professional',
      icon: Briefcase,
      description: 'Serious insights for career growth',
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'fun',
      name: 'Fun',
      icon: Sparkles,
      description: 'Light and engaging personality',
      color: 'from-purple-600 to-purple-800',
      hoverColor: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-600/20',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'roast',
      name: 'Roast',
      icon: Flame,
      description: 'Sarcastic but humorous',
      color: 'from-red-600 to-red-800',
      hoverColor: 'from-red-500 to-red-700',
      bgColor: 'bg-red-600/20',
      borderColor: 'border-red-500/30'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const modeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: 'easeInOut'
      }
    }
  }

  const activeIndicatorVariants = {
    hidden: { 
      width: '0%', 
      opacity: 0,
      transition: { duration: 0.3 }
    },
    visible: { 
      width: '100%', 
      opacity: 1,
      transition: { duration: 0.3, delay: 0.1 }
    }
  }

  return (
    <motion.div
      className={`flex flex-wrap gap-4 mb-8 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {modes.map((mode, index) => {
        const Icon = mode.icon
        const isActive = currentMode === mode.id
        
        return (
          <motion.button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`relative px-6 py-4 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
              isActive
                ? `border-transparent bg-gradient-to-r ${mode.color} text-white shadow-lg`
                : `border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white`
            }`}
            variants={modeVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            layoutId="activeMode"
          >
            {/* Active indicator background */}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r opacity-10"
                variants={activeIndicatorVariants}
                animate="visible"
              />
            )}
            
            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : mode.bgColor
                }`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              
              <div className="text-left">
                <div className="font-semibold text-white mb-1">{mode.name}</div>
                <div className="text-xs opacity-80 max-w-xs">{mode.description}</div>
              </div>
            </div>
            
            {/* Info tooltip */}
            <div className="absolute top-2 right-2">
              <InfoTooltip 
                content={`Switch to ${mode.name} mode for ${mode.description.toLowerCase()}`}
                position="top"
              />
            </div>
            
            {/* Active indicator line */}
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/60 to-white"
                variants={activeIndicatorVariants}
                animate="visible"
              />
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}

/**
 * Compact Mode Selector for smaller spaces
 */
export const CompactModeSelector = ({ currentMode, onModeChange, className = '' }) => {
  const modes = [
    { id: 'professional', name: 'Pro', icon: Briefcase, color: 'blue' },
    { id: 'fun', name: 'Fun', icon: Sparkles, color: 'purple' },
    { id: 'roast', name: 'Roast', icon: Flame, color: 'red' }
  ]

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-600 text-white border-blue-500' 
        : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-blue-500 hover:text-blue-400',
      purple: isActive 
        ? 'bg-purple-600 text-white border-purple-500' 
        : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-purple-500 hover:text-purple-400',
      red: isActive 
        ? 'bg-red-600 text-white border-red-500' 
        : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-red-500 hover:text-red-400'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = currentMode === mode.id
        
        return (
          <motion.button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${getColorClasses(mode.color, isActive)}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{mode.name}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

/**
 * Animated Mode Indicator
 */
export const ModeIndicator = ({ mode, className = '' }) => {
  const modeConfig = {
    professional: { name: 'Professional', color: 'blue', icon: Briefcase },
    fun: { name: 'Fun', color: 'purple', icon: Sparkles },
    roast: { name: 'Roast', color: 'red', icon: Flame }
  }

  const config = modeConfig[mode] || modeConfig.professional
  const Icon = config.icon

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white text-sm ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="w-3 h-3" />
      <span className="font-medium">{config.name}</span>
    </motion.div>
  )
}

export default InteractiveModeSelector
