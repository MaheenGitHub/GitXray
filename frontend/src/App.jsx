import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import ResultsPageV2 from './pages/ResultsPageV2'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results/:username" element={<ResultsPage />} />
            <Route path="/results-v2/:username" element={<ResultsPageV2 />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  )
}

export default App
