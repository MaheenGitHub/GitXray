import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import ResultsPageV2 from './pages/ResultsPageV2'
import NotFoundPage from './pages/NotFoundPage'

// Add PDF print styles
const printStyles = `
  @media print {
    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      background: white !important;
      color: black !important;
      font-family: 'Arial', 'Helvetica', sans-serif !important;
    }
    
    /* Zero Ghosting - Hide all icons and emojis */
    svg, .lucide, [data-lucide], .w-4, .w-5, .w-6, .w-8, .w-12 {
      display: none !important;
      visibility: hidden !important;
      position: absolute !important;
      left: -9999px !important;
    }
    
    /* Additional ghost character cleanup */
    .text-2xl, .text-lg, .text-xl {
      font-family: 'Arial', 'Helvetica', sans-serif !important;
    }
    
    /* Hide any decorative elements that might render as text */
    img, picture, .icon, .emoji {
      display: none !important;
      visibility: hidden !important;
    }
    
    /* Remove any decorative Unicode characters that might cause issues */
    *::before, *::after {
      content: none !important;
    }
    
    /* Force background images to be ignored */
    * {
      background-image: none !important;
    }
    
    /* Replace icons with text labels */
    .glass-morphism::before {
      content: '' !important;
    }
    
    /* Professional PDF Header */
    body::before {
      content: 'GitXray Behavioral Intelligence Report | Candidate: Maheen Fatima' !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      background: #1f2937 !important;
      color: white !important;
      padding: 12px !important;
      text-align: center !important;
      font-size: 14px !important;
      font-weight: bold !important;
      font-family: 'Arial', 'Helvetica', sans-serif !important;
      z-index: 9999 !important;
      border-bottom: 2px solid #10b981 !important;
    }
    
    /* White background for all cards */
    .glass-morphism {
      background: white !important;
      border: 2px solid #e5e7eb !important;
      color: black !important;
      margin-bottom: 20px !important;
      page-break-inside: avoid !important;
    }
    
    /* Vertical stack for Career Matches */
    .grid-cols-1.md\\:grid-cols-3 {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }
    
    /* Vertical stack for Repository Highlights */
    .grid.grid-cols-1.md\\:grid-cols-3 {
      grid-template-columns: 1fr !important;
      gap: 20px !important;
    }
    
    /* Typography fixes */
    .text-gray-400, .text-gray-300, .text-gray-500 {
      color: #374151 !important;
      font-weight: 500 !important;
    }
    
    .text-white {
      color: black !important;
      font-weight: 600 !important;
    }
    
    .text-blue-400, .text-purple-400, .text-emerald-400 {
      color: #1f2937 !important;
      font-weight: 600 !important;
    }
    
    .text-lg {
      font-size: 16px !important;
      font-weight: bold !important;
      color: black !important;
      margin-bottom: 12px !important;
    }
    
    .text-sm {
      font-size: 12px !important;
      line-height: 1.4 !important;
      color: #374151 !important;
    }
    
    .text-xs {
      font-size: 10px !important;
      line-height: 1.3 !important;
      color: #6b7280 !important;
    }
    
    /* Remove all truncation */
    .max-h-24, .max-h-\\[24rem\\], .max-h-\\[280px\\] {
      max-height: none !important;
    }
    
    .line-clamp-2, .line-clamp-3 {
      display: block !important;
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: unset !important;
      overflow: visible !important;
      text-overflow: unset !important;
    }
    
    .truncate {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: unset !important;
      word-wrap: break-word !important;
      word-break: break-word !important;
    }
    
    .overflow-hidden {
      overflow: visible !important;
    }
    
    /* Repository name and description fixes */
    .text-white.font-medium.text-sm {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: unset !important;
      word-wrap: break-word !important;
      line-height: 1.4 !important;
      padding-bottom: 6px !important;
      margin-top: 2px !important;
      position: relative !important;
      z-index: 10 !important;
    }
    
    .text-gray-400.text-xs {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: unset !important;
      word-wrap: break-word !important;
      line-height: 1.4 !important;
    }
    
    /* Repository card border fixes */
    .bg-gray-800\\/50.backdrop-blur-sm {
      border: 2px solid #e5e7eb !important;
      position: relative !important;
      z-index: 1 !important;
    }
    
    /* Stats separation */
    .text-sm.text-gray-400 {
      font-weight: bold !important;
      margin-top: 15px !important;
      padding-top: 10px !important;
      border-top: 1px solid #e5e7eb !important;
    }
    
    /* Hide decorative elements */
    .absolute.inset-0.flex.items-center.justify-center.pointer-events-none,
    .fixed.bottom-0.left-0.right-0,
    .absolute.top-4.right-4,
    .absolute.-top-2.-left-2,
    .absolute.-inset-1,
    .blur-sm,
    .shadow-2xl,
    .backdrop-blur-sm {
      display: none !important;
    }
    
    /* Remove transitions and animations */
    .transition-all, .transition-colors, .transition-opacity, .transition-transform {
      transition: none !important;
    }
    
    .hover\\:scale-105:hover, .hover\\:text-blue-400:hover, .group:hover .group-hover\\:opacity-100, .group:hover .group-hover\\:text-blue-400 {
      transform: none !important;
      color: inherit !important;
      opacity: 1 !important;
    }
    
    /* Chart containers */
    .h-80, .h-64 {
      height: 300px !important;
      margin-bottom: 20px !important;
    }
    
    .flex-1.flex.items-center.justify-center {
      margin-bottom: 20px !important;
    }
    
    /* Spacing fixes */
    .p-6, .p-8 {
      padding: 20px !important;
    }
    
    .mb-4, .mb-6 {
      margin-bottom: 20px !important;
    }
    
    .mt-4, .mt-3, .mt-6 {
      margin-top: 20px !important;
    }
    
    .gap-4, .gap-3, .gap-2\\.5 {
      gap: 15px !important;
    }
    
    /* Legend and chart fixes */
    .grid.gap-2\\.5 {
      gap: 10px !important;
      margin-top: 20px !important;
    }
    
    /* Page setup */
    @page {
      margin: 1in;
      size: A4;
    }
    
    /* Ensure content doesn't get cut off */
    * {
      page-break-inside: avoid !important;
    }
    
    /* Add space for header */
    .container, .min-h-screen {
      padding-top: 60px !important;
    }
  }
`;

function App() {
  // Inject print styles
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
