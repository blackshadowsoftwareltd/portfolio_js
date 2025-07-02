'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, GitForkIcon, ExternalLinkIcon, ChevronDownIcon } from 'lucide-react';

interface Repository {
  name: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface RepositoriesData {
  repositories: Repository[];
}

type SortOption = 'stars' | 'updated' | 'created';

interface SortConfig {
  value: SortOption;
  label: string;
  description: string;
}

const sortOptions: SortConfig[] = [
  { value: 'stars', label: 'Most Starred', description: 'Repositories sorted by star count' },
  { value: 'updated', label: 'Recently Updated', description: 'Repositories sorted by last update' },
  { value: 'created', label: 'Recently Created', description: 'Repositories sorted by creation date' }
];

export default function PopularRepositories() {
  const [repositoriesData, setRepositoriesData] = useState<RepositoriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchRepositories();
  }, [sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.sort-dropdown')) {
          setShowDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/popular-repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'blackshadowsoftwareltd', sortBy }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepositoriesData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const truncateDescription = (description: string | null, maxLength: number = 50) => {
    if (!description) return 'No description available';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-80 mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Popular Repositories
          </h2>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded mb-2"></div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-96 mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Popular Repositories
          </h2>
        </div>
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={fetchRepositories}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-96 mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Popular Repositories
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {repositoriesData?.repositories.length || 0} repos
          </span>
          <a
            href={`https://github.com/blackshadowsoftwareltd?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ExternalLinkIcon size={16} />
          </a>
        </div>
      </div>

      <div className="relative mb-3 sort-dropdown">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-md border border-neutral-200/20 dark:border-neutral-700/20 hover:border-neutral-300/40 dark:hover:border-neutral-600/40 transition-all duration-200"
        >
          <span className="text-neutral-700 dark:text-neutral-300">
            {sortOptions.find(option => option.value === sortBy)?.label}
          </span>
          <ChevronDownIcon 
            size={16} 
            className={`text-neutral-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>
        
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 shadow-lg z-10"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors first:rounded-t-md last:rounded-b-md ${
                  sortBy === option.value 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="space-y-2 max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] lg:max-h-[75vh] xl:max-h-[80vh] overflow-y-auto custom-scrollbar">
        {repositoriesData?.repositories.map((repo, index) => (
          <motion.div
            key={repo.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group"
          >
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 rounded-md border border-neutral-200/20 dark:border-neutral-700/20 hover:border-neutral-300/40 dark:hover:border-neutral-600/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm truncate flex-1">
                  {repo.name}
                </h3>
                <ExternalLinkIcon size={12} className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors flex-shrink-0 ml-2" />
              </div>
              
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 leading-tight">
                {truncateDescription(repo.description)}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {repo.primaryLanguage && (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: repo.primaryLanguage.color }}
                      ></div>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">
                        {repo.primaryLanguage.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <StarIcon size={12} className="text-yellow-500" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {formatNumber(repo.stargazerCount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitForkIcon size={12} className="text-neutral-500" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {formatNumber(repo.forkCount)}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}