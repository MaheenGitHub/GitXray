import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

/**
 * Expandable Section Component
 * Dark, modern, minimal but engaging with smooth animations
 */
const ExpandableSection = ({
  title,
  children,
  icon,
  tooltip,
  defaultExpanded = false,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showTooltip, setShowTooltip] = useState(false)

  const sectionVariants = {
    collapsed: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  }

  const contentVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.1
      }
    }
  }

  const chevronVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 }
  }

  return (
    <motion.div
      className={`glass-morphism rounded-xl overflow-hidden ${className}`}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={sectionVariants}
      whileHover={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        transition: { duration: 0.2 }
      }}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors duration-200 ${headerClassName}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="text-blue-400"
            >
              {icon}
            </motion.div>
          )}
          
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>
          
          {tooltip && (
            <div className="relative">
              <motion.div
                className="text-gray-400 hover:text-white transition-colors"
                onHoverStart={() => setShowTooltip(true)}
                onHoverEnd={() => setShowTooltip(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Info className="w-4 h-4" />
              </motion.div>
              
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-6 z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 whitespace-nowrap max-w-xs"
                  >
                    {tooltip}
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 border-l border-r border-gray-700 transform rotate-45"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        <motion.div
          variants={chevronVariants}
          animate={isExpanded ? 'expanded' : 'collapsed'}
          transition={{ duration: 0.3 }}
          className="text-gray-400"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`p-6 pt-0 ${contentClassName}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ExpandableSection
