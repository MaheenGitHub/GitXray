/**
 * GitHub API Service
 * Handles all interactions with the GitHub REST API
 */

const axios = require('axios');
const logger = require('../utils/logger');

class GitHubService {
  constructor() {
    // Base URL for GitHub API
    this.baseURL = process.env.GITHUB_API_URL || 'https://api.github.com';
    
    // Create axios instance with default configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Dev-DNA-Analyzer/1.0.0',
        // Add GitHub token if available (for higher rate limits)
        ...(process.env.GITHUB_API_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_API_TOKEN}`
        })
      }
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`GitHub API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('GitHub API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`GitHub API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        if (error.response) {
          logger.error(`GitHub API Error: ${error.response.status} ${error.response.config.url}`);
          logger.error('Error details:', error.response.data);
        } else if (error.request) {
          logger.error('GitHub API Network Error:', error.message);
        } else {
          logger.error('GitHub API Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch user profile information
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile(username) {
    try {
      const response = await this.client.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      this.handleGitHubError(error, 'user profile', username);
    }
  }

  /**
   * Fetch all repositories for a user
   * @param {string} username - GitHub username
   * @param {Object} options - Additional options (type, sort, direction)
   * @returns {Promise<Array>} Array of repositories
   */
  async getUserRepositories(username, options = {}) {
    try {
      const params = {
        type: options.type || 'all', // all, owner, member
        sort: options.sort || 'updated', // created, updated, pushed, full_name
        direction: options.direction || 'desc', // asc, desc
        per_page: options.per_page || 100, // GitHub max is 100
        page: 1
      };

      let allRepositories = [];
      let hasMore = true;

      // Fetch all pages of repositories
      while (hasMore) {
        const response = await this.client.get(`/users/${username}/repos`, { params });
        
        allRepositories = allRepositories.concat(response.data);
        
        // Check if there are more pages
        const linkHeader = response.headers.link;
        hasMore = linkHeader && linkHeader.includes('rel="next"');
        
        if (hasMore) {
          params.page++;
        }

        // Prevent infinite loop - safety check
        if (params.page > 100) {
          logger.warn(`Reached maximum page limit for user ${username}`);
          break;
        }
      }

      logger.info(`Fetched ${allRepositories.length} repositories for ${username}`);
      return allRepositories;
    } catch (error) {
      this.handleGitHubError(error, 'repositories', username);
    }
  }

  /**
   * Fetch languages used in a specific repository
   * @param {string} username - GitHub username
   * @param {string} repoName - Repository name
   * @returns {Promise<Object>} Languages with byte counts
   */
  async getRepositoryLanguages(username, repoName) {
    try {
      const response = await this.client.get(`/repos/${username}/${repoName}/languages`);
      return response.data;
    } catch (error) {
      // Don't throw error for language fetching, just log and return empty object
      logger.warn(`Could not fetch languages for ${username}/${repoName}: ${error.message}`);
      return {};
    }
  }

  /**
   * Get comprehensive user analysis including profile, repositories, and languages
   * @param {string} username - GitHub username
   * @returns {Promise<Object>} Complete user analysis data
   */
  async getUserAnalysis(username) {
    try {
      logger.info(`Starting analysis for GitHub user: ${username}`);

      // Fetch user profile and repositories in parallel
      const [userProfile, repositories] = await Promise.all([
        this.getUserProfile(username),
        this.getUserRepositories(username)
      ]);

      // Calculate basic statistics
      const stats = this.calculateBasicStats(repositories);
      
      // Fetch languages for all repositories (with concurrency limit)
      const languages = await this.getAllLanguages(username, repositories);

      // Combine all data
      const analysis = {
        user: {
          username: userProfile.login,
          name: userProfile.name,
          bio: userProfile.bio,
          location: userProfile.location,
          company: userProfile.company,
          followers: userProfile.followers,
          following: userProfile.following,
          created_at: userProfile.created_at,
          updated_at: userProfile.updated_at,
          avatar_url: userProfile.avatar_url,
          html_url: userProfile.html_url
        },
        repositories: {
          total_count: repositories.length,
          public_repos: userProfile.public_repos,
          stats: stats
        },
        languages: languages,
        analysis_timestamp: new Date().toISOString()
      };

      logger.info(`Analysis completed for ${username}: ${repositories.length} repos, ${Object.keys(languages).length} languages`);
      return analysis;

    } catch (error) {
      logger.error(`Failed to analyze user ${username}:`, error);
      throw error;
    }
  }

  /**
   * Calculate basic repository statistics
   * @param {Array} repositories - Array of repository objects
   * @returns {Object} Basic statistics
   */
  calculateBasicStats(repositories) {
    const stats = {
      total_stars: 0,
      total_forks: 0,
      total_watchers: 0,
      total_size: 0,
      archived_count: 0,
      forked_count: 0,
      original_count: 0,
      languages_count: new Set()
    };

    repositories.forEach(repo => {
      stats.total_stars += repo.stargazers_count || 0;
      stats.total_forks += repo.forks_count || 0;
      stats.total_watchers += repo.watchers_count || 0;
      stats.total_size += repo.size || 0;
      
      if (repo.archived) stats.archived_count++;
      if (repo.fork) stats.forked_count++;
      else stats.original_count++;
      
      if (repo.language) {
        stats.languages_count.add(repo.language);
      }
    });

    // Convert Set to count
    stats.languages_count = stats.languages_count.size;

    return stats;
  }

  /**
   * Get all languages used across all repositories
   * @param {string} username - GitHub username
   * @param {Array} repositories - Array of repository objects
   * @returns {Promise<Object>} Combined language statistics
   */
  async getAllLanguages(username, repositories) {
    const languageStats = {};
    let processedCount = 0;

    // Process repositories in batches to avoid overwhelming GitHub API
    const batchSize = 10;
    for (let i = 0; i < repositories.length; i += batchSize) {
      const batch = repositories.slice(i, i + batchSize);
      
      const languagePromises = batch.map(async (repo) => {
        try {
          const languages = await this.getRepositoryLanguages(username, repo.name);
          return { repo: repo.name, languages };
        } catch (error) {
          logger.warn(`Skipping language fetch for ${repo.name}: ${error.message}`);
          return { repo: repo.name, languages: {} };
        }
      });

      const batchResults = await Promise.all(languagePromises);
      
      // Aggregate language statistics
      batchResults.forEach(({ languages }) => {
        Object.entries(languages).forEach(([language, bytes]) => {
          if (!languageStats[language]) {
            languageStats[language] = 0;
          }
          languageStats[language] += bytes;
        });
      });

      processedCount += batch.length;
      logger.debug(`Processed ${processedCount}/${repositories.length} repositories for languages`);

      // Small delay between batches to be respectful to GitHub API
      if (i + batchSize < repositories.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Sort languages by usage (bytes)
    const sortedLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [lang, bytes]) => {
        acc[lang] = bytes;
        return acc;
      }, {});

    return sortedLanguages;
  }

  /**
   * Handle GitHub API errors and provide meaningful messages
   * @param {Error} error - The error object
   * @param {string} resource - The resource being accessed
   * @param {string} username - The username being accessed
   */
  handleGitHubError(error, resource, username) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown error';

      switch (status) {
        case 404:
          throw new Error(`GitHub user '${username}' not found`);
        case 403:
          if (message.includes('rate limit')) {
            throw new Error('GitHub API rate limit exceeded. Please try again later.');
          }
          throw new Error(`Access forbidden to ${resource} for user '${username}'`);
        case 401:
          throw new Error('Invalid GitHub API token. Please check your configuration.');
        default:
          throw new Error(`GitHub API error (${status}): ${message}`);
      }
    } else if (error.request) {
      throw new Error('Unable to connect to GitHub API. Please check your internet connection.');
    } else {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  }
}

module.exports = new GitHubService();
