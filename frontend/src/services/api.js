import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 60000, // Increased to 60 seconds for complex analysis
  headers: {
    'Content-Type': 'application/json',
  },
})

// Debug: Log the actual base URL being used
console.log('🔧 API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 Fallback URL:', 'http://localhost:5000/api');
console.log('🔧 Final Base URL:', api.defaults.baseURL);

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response.data
  },
  (error) => {
    console.error('❌ API Response Error:', error)
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 404:
          toast.error(data.message || 'User not found')
          break
        case 429:
          toast.error('Rate limit exceeded. Please try again later.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data.message || 'An error occurred')
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other error
      toast.error('An unexpected error occurred')
    }
    
    return Promise.reject(error)
  }
)

/**
 * Analyze GitHub user profile
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeGitHubUser = async (username) => {
  try {
    console.log('🚀 Making API call to:', `/analyze/${username}`);
    console.log('🔧 Base URL:', api.defaults.baseURL);
    
    const response = await api.get(`/analyze/${username}`)
    console.log('✅ API response received:', response);
    console.log('📊 Response data:', response.data);
    console.log('📊 Response status:', response.status);
    
    return response.data
  } catch (error) {
    console.error('❌ API call failed:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error code:', error.code);
    
    // Re-throw the error so it can be caught by the component
    throw new Error(error.response?.data?.message || 'Failed to analyze user')
  }
}

/**
 * Get user profile information only
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (username) => {
  try {
    const response = await api.get(`/user/${username}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile')
  }
}

/**
 * Get user repositories
 * @param {string} username - GitHub username
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Repository data
 */
export const getUserRepositories = async (username, options = {}) => {
  try {
    const response = await api.get(`/repositories/${username}`, { params: options })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch repositories')
  }
}

/**
 * Get all personality types
 * @returns {Promise<Array>} Personality types
 */
export const getPersonalityTypes = async () => {
  try {
    const response = await api.get('/personality/types')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch personality types')
  }
}

/**
 * Get specific personality type
 * @param {string} type - Personality type
 * @returns {Promise<Object>} Personality type details
 */
export const getPersonalityType = async (type) => {
  try {
    const response = await api.get(`/personality/types/${type}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch personality type')
  }
}

/**
 * Get behavioral personality analysis
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} Behavioral insights
 */
export const getBehavioralAnalysis = async (username) => {
  try {
    const response = await api.get(`/behavioral/${username}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to analyze behavior')
  }
}

/**
 * Get GitHub profile roasts
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} Roast analysis
 */
export const getRoastAnalysis = async (username) => {
  try {
    const response = await api.get(`/roast/${username}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate roasts')
  }
}

/**
 * Check API health
 * @returns {Promise<Object>} Health status
 */
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API health check failed')
  }
}

export default api
