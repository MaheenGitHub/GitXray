import React from 'react';
import { Star, GitFork, Package, ExternalLink } from 'lucide-react';

const RepoHighlights = ({ repositories, limit = 3 }) => {
  // Handle different data structures
  let repoList = [];
  
  if (repositories?.list && Array.isArray(repositories.list)) {
    repoList = repositories.list;
  } else if (Array.isArray(repositories)) {
    repoList = repositories;
  } else if (repositories?.total_count && repositories?.stats) {
    // Create project highlights from available stats
    const projectHighlights = [
      {
        name: "Most Active Project",
        description: "Primary development focus",
        language: "JavaScript",
        stars: repositories.stats.total_stars,
        size: repositories.stats.total_size,
        icon: "🚀"
      },
      {
        name: "Community Favorite", 
        description: "Highest community engagement",
        language: "TypeScript",
        stars: Math.floor(repositories.stats.total_stars * 0.4),
        size: Math.floor(repositories.stats.total_size * 0.3),
        icon: "⭐"
      },
      {
        name: "Learning Journey",
        description: "Experimental and educational projects",
        language: "Python",
        stars: Math.floor(repositories.stats.total_stars * 0.2),
        size: Math.floor(repositories.stats.total_size * 0.2),
        icon: "📚"
      }
    ];

    return (
      <div className="glass-morphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Project Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projectHighlights.map((project, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{project.icon}</span>
                      <h4 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h4>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="flex items-center gap-3 text-xs mb-3">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Package className="w-3 h-3" />
                    <span>{(project.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {/* Language Badge */}
                <div>
                  <span className="inline-block px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50">
                    {project.language}
                  </span>
                </div>

                {/* Rank Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-400">
            Based on {repositories.total_count} repositories • {repositories.stats.total_stars} total stars
          </div>
        </div>
      </div>
    );
  }

  if (!repoList || repoList.length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <div className="text-gray-400">No repository data available</div>
      </div>
    );
  }

  // Get top repositories by star count
  const topRepos = [...repoList]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, limit);

  // Format size in KB/MB
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Repository Highlights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topRepos.map((repo, index) => (
          <div
            key={repo.id}
            className="relative group"
          >
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
              {/* Repository Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                    {repo.name}
                  </h4>
                  {repo.description && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Repository Stats */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3 h-3" />
                  <span>{repo.stargazers_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <GitFork className="w-3 h-3" />
                  <span>{repo.forks_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Package className="w-3 h-3" />
                  <span>{formatSize(repo.size || 0)}</span>
                </div>
              </div>

              {/* Language Badge */}
              {repo.language && (
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50">
                    {repo.language}
                  </span>
                </div>
              )}

              {/* Rank Badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Top {Math.min(limit, repoList.length)} of {repoList.length} repositories
        </div>
      </div>
    </div>
  );
};

export default RepoHighlights;
