/**
 * Demo: Insight Transformation System
 * Shows how the same insight is transformed across 3 modes
 */

const { InsightTransformer, InsightFactory, BaseInsight } = require('./backend/src/utils/insightTransformer')

// Initialize transformer
const transformer = new InsightTransformer()

// Example base insights
const baseInsights = [
  new BaseInsight({
    id: 'low_completion',
    type: 'low_completion',
    baseMessage: 'Low project completion rate',
    severity: 'high',
    confidence: 85,
    context: { completionRate: 35 }
  }),
  
  new BaseInsight({
    id: 'inconsistent_activity',
    type: 'inconsistent_activity',
    baseMessage: 'Inconsistent coding activity',
    severity: 'medium',
    confidence: 75,
    context: { consistency: 0.3 }
  }),
  
  new BaseInsight({
    id: 'solo_developer',
    type: 'solo_developer',
    baseMessage: 'Mostly works alone',
    severity: 'medium',
    confidence: 80,
    context: { collaborationScore: 25 }
  }),
  
  new BaseInsight({
    id: 'night_owl',
    type: 'night_owl',
    baseMessage: 'Codes late at night',
    severity: 'low',
    confidence: 70,
    context: { peakHour: 2 }
  })
]

// Transform insights for each mode
console.log('='.repeat(80))
console.log('🎭 INSIGHT TRANSFORMATION DEMO')
console.log('='.repeat(80))

baseInsights.forEach((insight, index) => {
  console.log(`\n📊 INSIGHT ${index + 1}: ${insight.baseMessage}`)
  console.log('-'.repeat(60))
  
  // Professional Mode
  const professional = transformer.transform([insight], 'professional')[0]
  console.log('\n👔 PROFESSIONAL MODE:')
  console.log(`   Title: ${professional.title}`)
  console.log(`   Message: ${professional.message}`)
  console.log(`   Advice: ${professional.advice}`)
  console.log(`   Icon: ${professional.icon} | Color: ${professional.color}`)
  
  // Fun Mode
  const fun = transformer.transform([insight], 'fun')[0]
  console.log('\n🎉 FUN MODE:')
  console.log(`   Title: ${fun.title}`)
  console.log(`   Message: ${fun.message}`)
  console.log(`   Advice: ${fun.advice}`)
  console.log(`   Icon: ${fun.icon} | Color: ${fun.color}`)
  
  // Roast Mode
  const roast = transformer.transform([insight], 'roast')[0]
  console.log('\n🔥 ROAST MODE:')
  console.log(`   Title: ${roast.title}`)
  console.log(`   Message: ${roast.message}`)
  console.log(`   Advice: ${roast.advice}`)
  console.log(`   Icon: ${roast.icon} | Color: ${roast.color}`)
  
  console.log('\n' + '='.repeat(60))
})

// Example usage in backend controller
console.log('\n🔧 BACKEND CONTROLLER USAGE:')
console.log('-'.repeat(60))

const exampleControllerUsage = `
// In your GitHub controller:
const { InsightTransformer, InsightFactory } = require('../utils/insightTransformer')

async analyzeUser(req, res) {
  try {
    const { username } = req.params
    const { mode = 'professional' } = req.query
    
    // Fetch user data
    const userData = await githubService.getUserProfile(username)
    const repositories = await githubService.getUserRepositories(username)
    
    // Generate base insights
    const baseInsights = InsightFactory.createInsights(userData, repositories, personality)
    
    // Transform based on mode
    const transformer = new InsightTransformer()
    const transformedInsights = transformer.transform(baseInsights, mode)
    
    // Return enhanced analysis
    res.json({
      success: true,
      data: {
        user: userData,
        insights: transformedInsights,
        mode: mode
      }
    })
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
`

console.log(exampleControllerUsage)

// Example usage in frontend
console.log('\n🎨 FRONTEND COMPONENT USAGE:')
console.log('-'.repeat(60))

const frontendUsage = `
// In your React component:
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const InsightsDisplay = ({ insights, mode, onModeChange }) => {
  const [expandedInsight, setExpandedInsight] = useState(null)
  
  const getModeColors = (tone) => {
    const colors = {
      professional: 'from-blue-500 to-blue-700',
      fun: 'from-purple-500 to-purple-700',
      roast: 'from-red-500 to-red-700'
    }
    return colors[tone] || colors.professional
  }
  
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={\`glass-morphism rounded-xl p-6\`}
        >
          <div className="flex items-start gap-4">
            <div className={\`text-2xl\`}>{insight.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">{insight.title}</h3>
              <p className="text-gray-300 mb-3">{insight.message}</p>
              
              {expandedInsight === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className="pt-3 border-t border-gray-700"
                >
                  <p className="text-sm text-gray-400">{insight.advice}</p>
                </motion.div>
              )}
              
              <button
                onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {expandedInsight === index ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Mode Selector Component
const ModeSelector = ({ currentMode, onModeChange }) => {
  const modes = [
    { id: 'professional', name: 'Professional', icon: '👔', color: 'blue' },
    { id: 'fun', name: 'Fun', icon: '🎉', color: 'purple' },
    { id: 'roast', name: 'Roast', icon: '🔥', color: 'red' }
  ]
  
  return (
    <div className="flex gap-4 mb-6">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={\`px-4 py-2 rounded-lg transition-all \${
            currentMode === mode.id
              ? \`bg-\${mode.color}-600 text-white\`
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }\`}
        >
          <span className="mr-2">{mode.icon}</span>
          {mode.name}
        </button>
      ))}
    </div>
  )
}
`

console.log(frontendUsage)

console.log('\n🎯 KEY FEATURES:')
console.log('-'.repeat(60))
console.log('✅ Same insight, 3 different presentations')
console.log('✅ Context-aware transformations')
console.log('✅ Mode-specific icons and colors')
console.log('✅ Maintains data integrity')
console.log('✅ Easy to extend with new modes')
console.log('✅ Frontend-friendly structure')

console.log('\n🚀 READY TO INTEGRATE!')
console.log('='.repeat(80))
