'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  GitPullRequest,
  GitCommit,
  Bug,
  Users,
  TrendingUp
} from 'lucide-react';
import { 
  ContributionStats, 
  OpenSourceProject, 
  GITHUB_CONFIG 
} from '@/constants/open-source';


export default function OpenSourceContributions() {
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [projects, setProjects] = useState<OpenSourceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'activity'>('overview');

  useEffect(() => {
    fetchContributionData();
  }, []);

  const fetchContributionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch contribution stats
      const statsResponse = await fetch(GITHUB_CONFIG.API_ENDPOINTS.CONTRIBUTION_STATS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: GITHUB_CONFIG.USERNAME }),
      });

      if (!statsResponse.ok) {
        throw new Error('Could not load contribution stats from GitHub');
      }

      setStats(await statsResponse.json());

      // Fetch open source projects
      const projectsResponse = await fetch(GITHUB_CONFIG.API_ENDPOINTS.OPEN_SOURCE_PROJECTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: GITHUB_CONFIG.USERNAME }),
      });

      if (!projectsResponse.ok) {
        throw new Error('Could not load open source projects from GitHub');
      }

      const projectsData = await projectsResponse.json();
      setProjects(projectsData.projects || []);
    } catch (err) {
      // Showing an error beats showing invented numbers as if they were real.
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setStats(null);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return '—';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getContributionBadge = (type: 'owner' | 'maintainer' | 'contributor') => {
    const styles = {
      owner: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      maintainer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      contributor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto p-6 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-300 dark:bg-neutral-600 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto p-6"
      // style={{
      //   background: `
      //     linear-gradient(135deg, 
      //       rgba(255, 255, 255, 0.25) 0%,
      //       rgba(255, 255, 255, 0.10) 25%,
      //       rgba(255, 255, 255, 0.05) 50%,
      //       rgba(255, 255, 255, 0.10) 75%,
      //       rgba(255, 255, 255, 0.25) 100%
      //     )
      //   `,
      //   backdropFilter: 'blur(20px) saturate(180%)',
      //   WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      //   border: '1px solid rgba(255, 255, 255, 0.2)',
      //   boxShadow: `
      //     0 8px 32px rgba(0, 0, 0, 0.12),
      //     0 2px 8px rgba(0, 0, 0, 0.08),
      //     inset 0 1px 0 rgba(255, 255, 255, 0.4),
      //     inset 0 -1px 0 rgba(255, 255, 255, 0.1)
      //   `,
      // }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Open Source Contributions
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          My journey in open source development and community contributions
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/5 dark:bg-black/5 p-1 rounded-lg">
        {[
          { key: 'overview', label: 'Overview', icon: TrendingUp },
          { key: 'projects', label: 'Projects', icon: GitCommit },
          { key: 'activity', label: 'Activity', icon: GitPullRequest }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200/40 bg-red-500/5 p-4 dark:border-red-900/40">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Contributions', value: stats.totalContributions, icon: GitCommit, color: 'text-green-500' },
                { label: 'Stars Earned', value: stats.totalStars, icon: Star, color: 'text-yellow-500' },
                { label: 'Pull Requests', value: stats.totalPRs, icon: GitPullRequest, color: 'text-blue-500' },
                { label: 'Repositories', value: stats.totalRepos, icon: GitFork, color: 'text-purple-500' }
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/5 dark:bg-black/5 rounded-lg p-4 border border-neutral-200/20 dark:border-neutral-700/20">
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={20} className={color} />
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {formatNumber(value)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Languages Chart */}
          {stats?.languages && (
            <div className="bg-white/5 dark:bg-black/5 rounded-lg p-6 border border-neutral-200/20 dark:border-neutral-700/20">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                Most Used Languages
              </h3>
              <div className="space-y-3">
                {stats.languages.slice(0, 5).map((lang) => (
                  <div key={lang.name} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {lang.name}
                      </span>
                    </div>
                    <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: lang.color, 
                          width: `${lang.percentage}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 min-w-[40px] text-right">
                      {lang.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 dark:bg-black/5 rounded-lg p-4 border border-neutral-200/20 dark:border-neutral-700/20 hover:border-neutral-300/40 dark:hover:border-neutral-600/40 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h3>
                    {getContributionBadge(project.contributionType)}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.languageColor }}
                  />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {project.language}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {formatNumber(project.stars)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={14} className="text-neutral-500" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      {formatNumber(project.forks)}
                    </span>
                  </div>
                </div>
              </div>

              {project.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                  {project.topics.length > 3 && (
                    <span className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">
                      +{project.topics.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'activity' && stats?.recentActivity && (
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white/5 dark:bg-black/5 rounded-lg border border-neutral-200/20 dark:border-neutral-700/20"
            >
              <div className={`p-2 rounded-full ${
                activity.type === 'commit' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                activity.type === 'pr' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                activity.type === 'issue' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
              }`}>
                {activity.type === 'commit' && <GitCommit size={16} />}
                {activity.type === 'pr' && <GitPullRequest size={16} />}
                {activity.type === 'issue' && <Bug size={16} />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {activity.repo} • {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              
              <a
                href={activity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}