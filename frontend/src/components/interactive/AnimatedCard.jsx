import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Animated Card Component
 * Dark, modern, minimal but engaging with smooth animations
 */
const AnimatedCard = ({
  children,
  className = '',
  hoverScale = 1.02,
  tapScale = 0.98,
  initialOpacity = 0,
  animateOpacity = 1,
  delay = 0,
  staggerChildren = 0.1,
  hoverLift = true,
  glowEffect = true,
  onClick,
  as: Component = 'div'
}) => {
  const cardVariants = {
    initial: {
      opacity: initialOpacity,
      y: 30,
      scale: 0.95
    },
    animate: {
      opacity: animateOpacity,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay,
        staggerChildren
      }
    },
    hover: {
      scale: hoverScale,
      y: hoverLift ? -8 : 0,
      boxShadow: glowEffect ? '0 20px 40px rgba(59, 130, 246, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: tapScale,
      transition: {
        duration: 0.1,
        ease: 'easeInOut'
      }
    }
  }

  const contentVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: delay + 0.1
      }
    }
  }

  return (
    <motion.div
      as={Component}
      className={`glass-morphism rounded-xl p-6 cursor-pointer ${className}`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      layout
    >
      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/**
 * Metric Card Component for displaying stats
 */
export const MetricCard = ({
  title,
  value,
  icon,
  color = 'blue',
  trend = null,
  description,
  className = '',
  delay = 0
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    cyan: 'from-cyan-500 to-cyan-600'
  }

  const trendVariants = {
    up: { rotate: -45 },
    down: { rotate: 45 },
    neutral: { rotate: 0 }
  }

  return (
    <AnimatedCard
      delay={delay}
      hoverScale={1.03}
      className={`metric-card ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-gray-400 text-sm font-medium mb-1">{title}</h4>
          <div className="flex items-center gap-2">
            <motion.div
              className={`text-2xl font-bold text-white`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, duration: 0.3 }}
            >
              {value}
            </motion.div>
            
            {trend && (
              <motion.div
                className={`w-4 h-4 rounded-full bg-gradient-to-r ${colorClasses[trend.color || color]} flex items-center justify-center`}
                variants={trendVariants}
                animate={trend.direction}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-2 h-2 bg-white rounded-sm"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: delay + 0.4, duration: 0.3 }}
                />
              </motion.div>
            )}
          </div>
        </div>
        
        {icon && (
          <motion.div
            className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: delay + 0.1, duration: 0.4 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      {description && (
        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </AnimatedCard>
  )
}

/**
 * Progress Card Component for displaying progress bars
 */
export const ProgressCard = ({
  title,
  value,
  maxValue = 100,
  color = 'blue',
  size = 'medium',
  showPercentage = true,
  animated = true,
  className = '',
  delay = 0
}) => {
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  }

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500'
  }

  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))

  return (
    <AnimatedCard
      delay={delay}
      className={`progress-card ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold">{title}</h4>
        {showPercentage && (
          <motion.span
            className="text-sm font-medium text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
          >
            {percentage.toFixed(1)}%
          </motion.span>
        )}
      </div>
      
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            delay: delay + 0.3, 
            ease: 'easeOut' 
          }}
        />
      </div>
    </AnimatedCard>
  )
}

export default AnimatedCard
