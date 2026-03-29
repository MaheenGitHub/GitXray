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
  Info,
  X,
  Linkedin,
  Code2,
  Rocket,
  Package,
  GitFork
} from 'lucide-react';
import { getBehavioralAnalysis, getRoastAnalysis, analyzeGitHubUser } from '../services/api';
import toast from 'react-hot-toast';
import HoverTooltip, { InfoTooltip, HelpTooltip } from '../components/interactive/HoverTooltip';

const ResultsPageV2 = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('professional'); // professional, fun, roast
  const [activeSection, setActiveSection] = useState('insight');
  const [showArchitectModal, setShowArchitectModal] = useState(false);

  // Production-ready fallback timeline generation
  const generateFallbackTimeline = (userData) => {
    const currentYear = new Date().getFullYear();
    const repoCount = userData.repositories?.total_count || 0;
    const totalStars = userData.repositories?.stats?.total_stars || 0;
    const actualLanguages = Object.keys(userData.languages || {}).length;
    
    return [
      {
        year: currentYear - 2,
        role: 'Explorer',
        description: 'Started exploring programming and experimenting with different technologies',
        reason: 'Beginning of development journey',
        repoCount: Math.max(1, Math.floor(repoCount * 0.2)),
        avgStars: Math.max(0, Math.round((totalStars / repoCount) * 0.5)),
        languageCount: Math.max(1, Math.floor(actualLanguages * 0.3)),
        confidence: 60,
        color: 'green'
      },
      {
        year: currentYear - 1,
        role: repoCount > 5 ? 'Builder' : 'Explorer',
        description: repoCount > 5 ? 'Began creating more structured and consistent projects' : 'Continued exploring and learning new technologies',
        reason: repoCount > 5 ? 'Developing foundational skills and habits' : 'Building foundational knowledge',
        repoCount: Math.max(1, Math.floor(repoCount * 0.4)),
        avgStars: Math.max(0, Math.round((totalStars / repoCount) * 0.7)),
        languageCount: Math.max(1, Math.floor(actualLanguages * 0.6)),
        confidence: 75,
        color: repoCount > 5 ? 'blue' : 'green'
      },
      {
        year: currentYear,
        role: repoCount > 20 ? 'Architect' : repoCount > 10 ? 'Builder' : 'Explorer',
        description: repoCount > 20 ? 'Currently focusing on high-quality, impactful projects' : repoCount > 10 ? 'Building consistent projects and improving skills' : 'Actively learning and growing as a developer',
        reason: repoCount > 20 ? 'Applying accumulated knowledge and experience' : repoCount > 10 ? 'Developing technical expertise' : 'Continuous learning and improvement',
        repoCount: Math.max(1, Math.floor(repoCount * 0.4)),
        avgStars: Math.max(0, Math.round((totalStars / repoCount) * 0.8)),
        languageCount: Math.max(1, actualLanguages),
        confidence: repoCount > 20 ? 85 : repoCount > 10 ? 75 : 65,
        color: repoCount > 20 ? 'purple' : repoCount > 10 ? 'blue' : 'green'
      }
    ];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('🔍 MAKING API CALL FOR USERNAME:', username);
        
        // Start with basic analysis first - it's more reliable
        let basicData;
        try {
          basicData = await analyzeGitHubUser(username);
          console.log('Basic analysis successful:', basicData);
        } catch (apiError) {
          console.error('API call failed:', apiError);
          toast.error('Failed to fetch GitHub data. Please try again.');
          navigate('/');
          return;
        }
        
        // DEBUG: Log the actual data received
        console.log('🔍 FRONTEND RECEIVED DATA:');
        console.log('Full Result:', JSON.stringify(basicData, null, 2));
        console.log('User Data:', basicData.user);
        console.log('User Followers:', basicData.user?.followers);
        console.log('Repository Stats:', basicData.repositories?.stats);
        console.log('Analysis Data:', basicData.analysis);
        console.log('Stats Object:', basicData.stats);
        
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
        
        // The API returns data nested under 'data' field
        let actualData = basicData.data || basicData;
        
        console.log('🔧 Using actualData:', actualData);
        console.log('🔧 actualData keys:', actualData ? Object.keys(actualData) : 'undefined');
        console.log('🔧 actualData.user:', actualData?.user);
        console.log('🔧 actualData.repositories:', actualData?.repositories);
        
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
          console.log('Evolution timeline from API:', enhancedData?.evolution_timeline);
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
            coreInsight: {
              message: `${actualData.personality?.dominant_personality?.name || 'Developer'}: ${actualData.personality?.dominant_personality?.description || 'Building great projects'}`,
              reason: "Based on personality analysis"
            },
            truthBombs: actualData.personality?.insights?.strengths?.slice(0, 4).map(strength => ({
              message: strength,
              reason: "Derived from personality strengths"
            })) || [],
            strengths: actualData.personality?.insights?.strengths || ['Keep learning and growing'],
            blindSpots: actualData.personality?.insights?.improvement_areas || ['Keep learning and growing'],
            growthSuggestions: actualData.personality?.insights?.recommendations || ['Continue your journey'],
            identityStatement: {
              message: `The ${actualData.personality?.dominant_personality?.name || 'Developer'}`,
              reason: "Based on dominant personality type"
            },
            roasts: [{
              message: "You're doing great! Keep up the good work!",
              reason: "Positive encouragement"
            }]
          },
          evolution_timeline: enhancedData?.evolution_timeline || generateFallbackTimeline(actualData)
        };
        
        const finalRoastData = roastData || {
          roasts: [{
            message: "You're too perfect to roast!",
            reason: "Positive vibes only"
          }]
        };
        
        // Combine user data with repositories and languages for the frontend
        const userData = {
          ...actualData.user,
          repositories: actualData.repositories,
          languages: actualData.languages,
          personality: actualData.personality
        };
        
        console.log('🎯 Setting data:', { analysis: analysisData, roast: finalRoastData, stats: userData });
        
        setData({
          analysis: analysisData,
          roast: finalRoastData,
          stats: userData
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
  const user = stats;
  const repositories = stats.repositories || {};
  const languages = stats.languages || {};
  const personality = analysis?.behavioral_insights || {};
  
  const repoStats = {
    repo_count: repositories?.total_count || 0,
    stars: repositories?.stats?.total_stars || 0,
    forks: repositories?.stats?.total_forks || 0,
    languages_count: Object.keys(languages || {}).length
  };
  const insights = analysis?.behavioral_insights || {};
  const evolutionTimeline = analysis?.evolution_timeline || [];

  // Production-ready data validation and sanitization
  const sanitizeTimelineData = (timeline) => {
    if (!Array.isArray(timeline)) return [];
    
    return timeline.map(item => ({
      year: item?.year || new Date().getFullYear(),
      role: item?.role || 'Explorer',
      description: item?.description || 'Building your developer journey',
      reason: item?.reason || '',
      repoCount: Math.max(0, parseInt(item?.repoCount) || 0),
      avgStars: Math.max(0, parseFloat(item?.avgStars) || 0),
      languageCount: Math.max(0, parseInt(item?.languageCount) || 0),
      confidence: Math.min(100, Math.max(0, parseInt(item?.confidence) || 50)),
      color: item?.color || 'green'
    })).sort((a, b) => a.year - b.year);
  };

  const sanitizedTimeline = sanitizeTimelineData(evolutionTimeline);

  // Helper function to extract message from object or handle string fallback
  const extractMessage = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item.message || '';
    }
    return item || '';
  };

  // Helper function to extract reason from object
  const extractReason = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item.reason || '';
    }
    return '';
  };

  const modes = {
    professional: {
      color: 'blue',
      insight: typeof insights.coreInsight === 'object' ? insights.coreInsight.message : insights.coreInsight,
      points: insights.strengths || [],
      title: "Professional Analysis",
    },
    fun: {
      color: 'purple',
      insight: insights.truthBombs?.[0] ? extractMessage(insights.truthBombs[0]) : (typeof insights.coreInsight === 'object' ? insights.coreInsight.message : insights.coreInsight),
      points: insights.truthBombs || [],
      title: "Fun Facts",
    },
    roast: {
      color: 'red',
      insight: insights.roasts?.[0] ? extractMessage(insights.roasts[0]) : "You're too perfect to roast!",
      points: insights.roasts || [],
      title: "Savage Analysis",
    }
  };

  const currentMode = modes[mode];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative">
      {/* Watermark - Lower z-index to prevent content overlap */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-gray-500/5 text-xs font-mono tracking-widest transform rotate-[-15deg]">
          GitXray Intelligence Engine v2.0
        </div>
      </div>
      
      {/* Header with Architect Profile Info */}
      <div className="absolute top-4 right-4 z-40">
        <motion.button
          onClick={() => setShowArchitectModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 0 8px rgba(16, 185, 129, 0)"],
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity },
          }}
          className="flex items-center gap-2 p-3 text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/30 transition-all duration-200 backdrop-blur-sm"
          title="Architect Profile"
        >
          <Info className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* HERO SECTION - Full Width */}
      <section className="relative pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Profile */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            
            {/* User Info */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {user.name}
              </h1>
              <p className="text-xl text-gray-300 mb-4">@{user.username}</p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="inline-block"
              >
                <div className={`px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 backdrop-blur-sm`}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold">{typeof insights.identityStatement === 'object' ? insights.identityStatement.message : insights.identityStatement}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Real GitHub Data */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-4 mb-12"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Package,
                label: 'Project Portfolio',
                value: repoStats?.repo_count || 0,
                color: 'text-blue-500'
              },
              {
                icon: Star,
                label: 'Community Impact',
                value: (repoStats?.stars || 0).toLocaleString(),
                color: 'text-yellow-500'
              },
              {
                icon: GitFork,
                label: 'Network Reach',
                value: (repoStats?.forks || 0).toLocaleString(),
                color: 'text-purple-500'
              },
              {
                icon: Code2,
                label: 'Tech Diversity',
                value: repoStats?.languages_count || 0,
                color: 'text-green-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className="glass-morphism rounded-xl p-6 text-center"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TABS - Above Core Insight */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="px-4 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-700">
              {Object.keys(modes).map((modeKey) => (
                <button
                  key={modeKey}
                  onClick={() => setMode(modeKey)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    mode === modeKey
                      ? `bg-${modes[modeKey].color}-500 text-white shadow-lg shadow-${modes[modeKey].color}-500/25`
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
                      Roast 👀
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CORE INSIGHT SECTION - Full Width Centered */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="px-4 mb-12"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
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
                  {mode === 'professional' && "Focused on building, learning, and improving with each step forward."}
                  {mode === 'fun' && "Somewhere between planning everything and just going with the flow… and it works."}
                  {mode === 'roast' && "Wo (Profile) dekhny mn kaisi seedhi saadhi lagti 😂 Hai bolti k wo toh Kuch nahi samjhti"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SPLIT SCREEN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 px-4 pb-20 max-w-7xl mx-auto">
        
        {/* LEFT COLUMN - Static Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:w-2/5 space-y-8"
        >
          {/* Evolution Timeline - Previous Beautiful Styling with Real Data */}
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-400/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold">Evolution Timeline</h3>
            </div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
              
              <div className="space-y-6">
                {sanitizedTimeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-6' : 'text-left pl-6 order-1'}`}>
                      <div className={`p-3 bg-${item.color}-500/10 rounded-lg border border-${item.color}-400/30`}>
                        <div className="font-semibold text-sm">{item.year}</div>
                        <div className="text-xs text-gray-300">{item.role}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.repoCount} repos • {item.avgStars} Impact • {item.languageCount} Tech</div>
                      </div>
                    </div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                      className={`w-8 h-8 bg-${item.color}-500 rounded-full border-4 border-gray-900 flex items-center justify-center z-10`}
                    >
                      <Calendar className="w-3 h-3 text-white" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Suggestions */}
          <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-400/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold">Evolve Your Developer DNA</h3>
            </div>
            
            <div className="space-y-4">
              {insights.growthSuggestions?.slice(0, 3).map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -2 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start gap-3">
                    <Rocket className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-200 text-sm leading-relaxed">{suggestion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Dynamic Tab Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:w-3/5"
        >
          <div className="bg-gradient-to-br from-gray-800/50 to-purple-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
            
            {/* TAB CONTENT */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Mode-specific Header Card */}
                  <div className={`p-6 bg-gradient-to-br from-${currentMode.color}-500/10 to-purple-500/10 rounded-xl border border-${currentMode.color}-400/20 backdrop-blur-sm`}>
                    <div className="flex items-center gap-3 mb-4">
                      {mode === 'professional' && <Lightbulb className={`w-6 h-6 text-${currentMode.color}-400`} />}
                      {mode === 'fun' && <Lightbulb className={`w-6 h-6 text-${currentMode.color}-400`} />}
                      <h4 className={`text-lg font-semibold text-${currentMode.color}-400`}>
                        {mode === 'professional' && 'Professional Analysis'}
                        {mode === 'fun' && 'Fun Facts & Truths'}
                        {mode === 'roast' && 'Hehe Let\'s be Honest'}
                      </h4>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                      {mode === 'professional' && "Based on your repository patterns, you demonstrate strong architectural thinking and systematic approach to development."}
                      {mode === 'fun' && "Somewhere between planning everything and just going with the flow… and it works."}
                      {mode === 'roast' && "Your commit history looks like a roller coaster of motivation and procrastination."}
                    </p>
                  </div>

                  {/* Mode-specific Points */}
                  <div>
                    <h4 className={`text-xl font-bold mb-6 text-${currentMode.color}-400`}>
                      {mode === 'professional' && '💪 Key Strengths'}
                      {mode === 'fun' && '💣 Truth Bombs'}
                      {mode === 'roast' && '💀 Seedhi Baat No Bakwaas'}
                    </h4>
                    
                    <div className="grid gap-4">
                      {currentMode.points.map((point, index) => {
                        const message = extractMessage(point);
                        const reason = extractReason(point);
                        return (
                          <motion.div
                            key={`${mode}-${index}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                              delay: index * 0.1, 
                              duration: 0.3,
                              ease: "easeOut"
                            }}
                            whileHover={{ 
                              y: -2, 
                              scale: 1.02,
                              boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                            }}
                            className={`p-4 bg-gradient-to-br from-${currentMode.color}-500/10 to-purple-500/10 rounded-lg border border-${currentMode.color}-400/20 backdrop-blur-sm cursor-pointer transition-all duration-300`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 bg-${currentMode.color}-400 rounded-full mt-2 flex-shrink-0`} />
                              <div className="flex-1">
                                <p className="text-gray-200 leading-relaxed font-medium">{message}</p>
                                {reason && (
                                  <p className="text-gray-400 text-sm mt-2 italic">{reason}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Mode-specific Content */}
                  {mode === 'professional' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                        <h5 className="font-semibold text-blue-400 mb-3">Career Suggestions</h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-gray-300">Software Architect</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-gray-300">Technical Lead</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-sm text-gray-300">DevOps Engineer</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
                        <h5 className="font-semibold text-blue-400 mb-3">Collaboration Style</h5>
                        <p className="text-sm text-gray-300">
                          Prefers structured collaboration and clear project boundaries
                        </p>
                      </div>
                    </div>
                  )}

                  {mode === 'fun' && (
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-400/20">
                      <h5 className="font-semibold text-purple-400 mb-3">Fun Fact</h5>
                      <p className="text-sm text-gray-300">
                        Your coding style suggests you probably organize your socks by color and have strong opinions about indentation!
                      </p>
                    </div>
                  )}

                  {mode === 'roast' && (
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/20">
                      <h5 className="font-semibold text-red-400 mb-3">Bye Byeeee!</h5>
                      <p className="text-sm text-gray-300">
                        Sach bola tha maine, thoda sa rough tha tone,<br/>Dil pe mat lena yaar… it was all for fun alone.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

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
      
      {/* Architect Profile Modal */}
      {showArchitectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowArchitectModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-900/90 to-emerald-900/90 rounded-2xl border border-emerald-500/30 backdrop-blur-xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Maheen Fatima</h2>
              <p className="text-emerald-400 font-medium">Project Creator | BSIT @ PUCIT (Batch 2022)</p>
            </div>

            {/* Professional Bio */}
            <div className="mb-8">
              <p className="text-gray-300 leading-relaxed text-sm">
                Final-year BSIT student at PUCIT with a focus on Machine Learning and Full-Stack Development. I enjoy building data-driven tools and exploring the intersection of AI and Cybersecurity.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <a
                href="https://www.linkedin.com/in/maheenfatimaa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
              <a
                href="https://maheen-ai.hashnode.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Brain className="w-4 h-4" />
                <span className="text-sm font-medium">AI Lab Blog</span>
              </a>
              <a
                href="https://maheen-hacking-diary.hashnode.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Code2 className="w-4 h-4" />
                <span className="text-sm font-medium">Hacking Diary</span>
              </a>
              <a
                href="https://www.upwork.com/freelancers/~017a150168182cf524"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Upwork</span>
              </a>
            </div>

            {/* Signature Branding */}
            <div className="text-center pt-4 border-t border-emerald-500/20">
              <p className="text-emerald-400 text-sm italic font-medium">
                "Code is poetry — every line tells a story."
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowArchitectModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultsPageV2;
