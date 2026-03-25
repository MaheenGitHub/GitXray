import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, HelpCircle, AlertCircle } from 'lucide-react'

/**
 * Hover Tooltip Component
 * Dark, modern, minimal but engaging with smooth animations
 */
const HoverTooltip = ({
  children,
  content,
  position = 'top',
  icon = Info,
  delay = 0.2,
  className = '',
  tooltipClassName = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)

  const Icon = icon

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    setIsVisible(false)
  }

  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    }
    return positions[position] || positions.top
  }

  const getArrowClasses = () => {
    const arrows = {
      top: 'top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-l-gray-700 border-r-gray-700 border-t-gray-900',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 translate-y-1/2 border-l-gray-700 border-r-gray-700 border-b-gray-900',
      left: 'left-full top-1/2 transform -translate-y-1/2 -translate-x-1/2 border-t-gray-700 border-b-gray-700 border-l-gray-900',
      right: 'right-full top-1/2 transform -translate-y-1/2 translate-x-1/2 border-t-gray-700 border-b-gray-700 border-r-gray-900'
    }
    return arrows[position] || arrows.top
  }

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  }

  const arrowVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.1 }
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, delay: 0.1 }
    }
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children || (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <Icon className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-2xl border border-gray-700 max-w-xs ${getPositionClasses()} ${tooltipClassName}`}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="relative">
              {content}
              
              {/* Arrow */}
              <motion.div
                className={`absolute w-2 h-2 bg-gray-900 border ${getArrowClasses()}`}
                variants={arrowVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{
                  [position]: '100%',
                  left: position === 'left' || position === 'right' ? '50%' : 'auto',
                  right: position === 'left' || position === 'right' ? 'auto' : '50%',
                  top: position === 'top' || position === 'bottom' ? '50%' : 'auto',
                  bottom: position === 'top' || position === 'bottom' ? 'auto' : '50%',
                  transform: position === 'top' ? 'translate(-50%, -50%) rotate(45deg)' :
                            position === 'bottom' ? 'translate(-50%, -50%) rotate(45deg)' :
                            position === 'left' ? 'translate(-50%, -50%) rotate(45deg)' :
                            'translate(-50%, -50%) rotate(45deg)'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Simple Tooltip Component for quick usage
 */
export const SimpleTooltip = ({ content, children, className = '' }) => {
  return (
    <HoverTooltip
      content={content}
      position="top"
      delay={0.1}
      className={className}
    >
      {children}
    </HoverTooltip>
  )
}

/**
 * Info Tooltip Component with Info icon
 */
export const InfoTooltip = ({ content, className = '' }) => {
  return (
    <HoverTooltip
      content={content}
      icon={Info}
      position="top"
      className={className}
    />
  )
}

/**
 * Help Tooltip Component with HelpCircle icon
 */
export const HelpTooltip = ({ content, className = '' }) => {
  return (
    <HoverTooltip
      content={content}
      icon={HelpCircle}
      position="top"
      className={className}
    />
  )
}

/**
 * Alert Tooltip Component with AlertCircle icon
 */
export const AlertTooltip = ({ content, className = '' }) => {
  return (
    <HoverTooltip
      content={content}
      icon={AlertCircle}
      position="top"
      className={className}
    />
  )
}

export default HoverTooltip
