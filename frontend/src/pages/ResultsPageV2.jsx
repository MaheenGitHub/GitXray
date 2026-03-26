import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, 
  Star, 
  GitBranch, 
  Zap, 
  Brain, 
  TrendingUp,
  Users,
  Eye,
  Target,
  Flame,
  Sparkles,
  Award,
  ArrowRight,
  Calendar,
  Lightbulb,
  Shield,
  Rocket
} from 'lucide-react';
import { getBehavioralAnalysis, getRoastAnalysis, analyzeGitHubUser } from '../services/api';
import toast from 'react-hot-toast';

const ResultsPageV2 = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('professional'); // professional, fun, roast
  const [activeSection, setActiveSection] = useState('insight');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Starting analysis for username:', username);
        
        // Start with basic analysis first - it's more reliable
        let basicData;
        try {
          basicData = await analyzeGitHubUser(username);
          console.log('Basic analysis successful:', basicData);
        } catch (apiError) {
          console.error('API call failed:', apiError);
          // Use mock data for testing if API fails
          basicData = {
            success: true,
            data: {
              user: {
                username: username,
                name: 'Test User',
                bio: 'Test bio',
                location: 'Test location',
                followers: 5,
                following: 7,
                avatar_url: 'https://avatars.githubusercontent.com/u/146413921?v=4'
              },
              personality: {
                dominant_personality: {
                  type: 'builder',
                  name: 'Builder',
                  title: 'The Architect',
                  description: 'Consistent developers who build structured, reliable projects',
                  traits: ['Creates many repositories', 'Consistent commit patterns'],
                  score: 78
                },
                insights: {
                  strengths: ['Consistent project delivery', 'Strong architectural skills'],
                  recommendations: ['Focus on documentation', 'Consider mentoring']
                }
              },
              repositories: {
                total_count: 26,
                stats: { total_stars: 31, total_forks: 0 }
              }
            }
          };
          console.log('Using mock data:', basicData);
        }
        
        console.log('🔍 Basic data type:', typeof basicData);
        console.log('🔍 Basic data keys:', basicData ? Object.keys(basicData) : 'undefined');
        console.log('🔍 Basic data.data:', basicData?.data);
        console.log('🔍 Basic data structure:', {
          hasData: !!basicData,
          hasDataData: !!basicData?.data,
          hasUser: !!basicData?.data?.user,
          dataKeys: basicData?.data ? Object.keys(basicData.data) : 'no data',
          basicDataString: JSON.stringify(basicData, null, 2).substring(0, 500) + '...'
        });
        
        // Check if we have the expected data structure
        if (!basicData) {
          console.error('❌ No basicData found');
          throw new Error('No response received from API');
        }
        
        // The API might be returning the data directly or nested under 'data'
        let actualData = basicData;
        if (basicData.data) {
          actualData = basicData.data;
        } else if (basicData.success && basicData.data) {
          actualData = basicData.data;
        } else if (basicData.user) {
          // Data is directly in the response
          actualData = basicData;
        }
        
        console.log('🔧 Using actualData:', actualData);
        console.log('🔧 actualData keys:', actualData ? Object.keys(actualData) : 'undefined');
        
        if (!actualData) {
          console.error('❌ No actualData found');
          throw new Error('API response missing data field');
        }
        
        if (!actualData.user) {
          console.error('❌ No actualData.user found');
          throw new Error('API response missing user data');
        }
        
        // Try to get enhanced data if available, but don't fail if it doesn't work
        let enhancedData = null;
        try {
          enhancedData = await getBehavioralAnalysis(username);
          console.log('Enhanced analysis successful:', enhancedData);
        } catch (error) {
          console.log('Enhanced analysis not available, using basic data:', error);
        }
        
        let roastData = null;
        try {
          roastData = await getRoastAnalysis(username);
          console.log('Roast analysis successful:', roastData);
        } catch (error) {
          console.log('Roast analysis not available, using fallback:', error);
        }
        
        // Use enhanced data if available, otherwise create it from basic data
        const analysisData = enhancedData || {
          user: actualData.user,
          behavioral_insights: {
            coreInsight: `${actualData.personality.dominant_personality.name}: ${actualData.personality.dominant_personality.description}`,
            truthBombs: actualData.personality.insights.strengths.slice(0, 4),
            strengths: actualData.personality.insights.strengths,
            blindSpots: actualData.personality.insights.improvement_areas || ['Keep learning and growing'],
            growthSuggestions: actualData.personality.insights.recommendations,
            identityStatement: `The ${actualData.personality.dominant_personality.name}`,
            roasts: ['You\'re doing great! Keep up the good work!']
          }
        };
        
        const finalRoastData = roastData || {
          roasts: ['You\'re doing great! Keep up the good work!'],
          stats: {
            repo_count: actualData.repositories?.total_count || 0,
            stars: actualData.repositories?.stats?.total_stars || 0,
            forks: actualData.repositories?.stats?.total_forks || 0,
            avg_stars: actualData.repositories?.total_count > 0 ? 
              Math.floor((actualData.repositories?.stats?.total_stars || 0) / actualData.repositories.total_count) : 0
          }
        };
        
        console.log('🎯 Setting data:', { analysis: analysisData, roast: finalRoastData, stats: actualData.user });
        
        setData({
          analysis: analysisData,
          roast: finalRoastData,
          stats: actualData.user
        });
      } catch (error) {
        console.error('Analysis failed:', error);
        console.error('Error details:', error.response?.data || error.message);
        console.error('Error stack:', error.stack);
        toast.error(`Failed to load analysis: ${error.message || 'Unknown error'}`);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
          <p className="text-gray-400 mb-6">Unable to analyze user</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { analysis, roast, stats } = data;
  const insights = analysis.behavioral_insights;
  const dominantPersonality = analysis.personality?.dominant_personality;
  const confidence = dominantPersonality?.score || 0;

  const modeData = {
    professional: {
      insight: insights.coreInsight,
      points: insights.strengths,
      title: "Professional Analysis",
      color: "blue"
    },
    fun: {
      insight: insights.truthBombs[0] || insights.coreInsight,
      points: insights.truthBombs,
      title: "Fun Facts",
      color: "purple"
    },
    roast: {
      insight: roast.roasts[0] || "You're too perfect to roast!",
      points: roast.roasts,
      title: "Roast Mode 😈",
      color: "red"
    }
  };

  const currentMode = modeData[mode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      
      {/* HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-12 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img 
                  src={stats.avatar_url} 
                  alt={stats.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>

            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {stats.name || stats.username}
              </h1>
              <p className="text-xl text-gray-300 mb-4">@{stats.username}</p>
              
              {/* Personality Type */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="inline-block"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                  <span className="text-lg font-semibold text-purple-300">
                    {dominantPersonality?.name || 'The Architect'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2 italic">
                  "{dominantPersonality?.description || 'Builds systems, not just code.'}"
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Confidence Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="h-2 bg-gray-700 rounded-full overflow-hidden mb-8"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r from-${currentMode.color}-500 to-purple-500`}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* MODE TOGGLE */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="px-4 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-2 p-1 bg-gray-800/50 rounded-full backdrop-blur-sm">
            {Object.keys(modeData).map((modeKey) => (
              <button
                key={modeKey}
                onClick={() => setMode(modeKey)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  mode === modeKey
                    ? `bg-${modeData[modeKey].color}-500 text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {modeKey === 'professional' && (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Professional
                  </span>
                )}
                {modeKey === 'fun' && (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Fun
                  </span>
                )}
                {modeKey === 'roast' && (
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Roast 😈
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CORE INSIGHT SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-4 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-block"
            >
              <div className={`p-8 bg-gradient-to-br from-${currentMode.color}-500/10 to-purple-500/10 rounded-2xl border border-${currentMode.color}-400/20 backdrop-blur-sm`}>
                <Lightbulb className={`w-8 h-8 text-${currentMode.color}-400 mx-auto mb-4`} />
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                  {currentMode.insight}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* POINTS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="px-4 mb-12"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl font-bold mb-8 text-center text-${currentMode.color}-400`}>
            {mode === 'professional' && '💪 Strengths'}
            {mode === 'fun' && '💣 Truth Bombs'}
            {mode === 'roast' && '💀 Savage Roasts'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {currentMode.points.map((point, index) => (
                <motion.div
                  key={`${mode}-${index}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                  className={`p-6 bg-gradient-to-br from-${currentMode.color}-500/10 to-purple-500/10 rounded-xl border border-${currentMode.color}-400/20 backdrop-blur-sm cursor-pointer transition-all duration-300`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 bg-${currentMode.color}-400 rounded-full mt-2 flex-shrink-0`} />
                    <p className="text-gray-200 leading-relaxed">{point}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* EVOLUTION TIMELINE */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="px-4 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Evolution Timeline
          </h2>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
            
            <div className="space-y-8">
              {[
                { year: 2023, type: 'Explorer', color: 'green' },
                { year: 2024, type: 'Builder', color: 'blue' },
                { year: 2025, type: 'Architect', color: 'purple' }
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
                  className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-1'}`}>
                    <div className={`p-4 bg-${item.color}-500/10 rounded-lg border border-${item.color}-400/30`}>
                      <div className="font-semibold text-lg">{item.year}</div>
                      <div className="text-sm text-gray-300">{item.type}</div>
                    </div>
                  </div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.6 + index * 0.2, duration: 0.4 }}
                    className={`w-12 h-12 bg-${item.color}-500 rounded-full border-4 border-gray-900 flex items-center justify-center z-10`}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* IMPROVE YOUR DNA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="px-4 pb-20"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-green-400" />
            Improve Your DNA
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {insights.growthSuggestions?.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-400/20 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <Rocket className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-gray-200">{suggestion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FLOATING ACTION BUTTONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="fixed bottom-8 right-8 flex flex-col gap-3"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-white rotate-90" />
        </button>
      </motion.div>
    </div>
  );
};

export default ResultsPageV2;
