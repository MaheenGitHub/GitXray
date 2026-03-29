import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import ResultsPageV2 from './pages/ResultsPageV2'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8 pb-20"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results/:username" element={<ResultsPage />} />
            <Route path="/results-v2/:username" element={<ResultsPageV2 />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </div>
      
      {/* Global Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 opacity-80 hover:opacity-100 transition-opacity duration-300">
        <div className="text-center py-2 px-4 text-xs text-emerald-100/80 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800">
          © 2026 GitXray | Designed & Engineered by Maheen Fatima
        </div>
      </footer>
    </div>
  )
}

export default App
