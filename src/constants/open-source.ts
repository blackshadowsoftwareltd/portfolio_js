export interface ContributionStats {
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  languages: { name: string; percentage: number; color: string }[];
  recentActivity: {
    type: 'commit' | 'pr' | 'issue' | 'release';
    repo: string;
    title: string;
    date: string;
    url: string;
  }[];
}

export interface OpenSourceProject {
  name: string;
  description: string;
  url: string;
  homepage?: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  topics: string[];
  isContributor: boolean;
  contributionType: 'owner' | 'maintainer' | 'contributor';
  lastUpdated: string;
}

export const SAMPLE_CONTRIBUTION_STATS: ContributionStats = {
  totalContributions: 284,
  totalCommits: 156,
  totalPRs: 47,
  totalIssues: 23,
  totalStars: 45,
  totalForks: 18,
  totalRepos: 12,
  languages: [
    { name: 'Dart', percentage: 35.2, color: '#00B4AB' },
    { name: 'TypeScript', percentage: 28.7, color: '#2b7489' },
    { name: 'JavaScript', percentage: 18.4, color: '#f1e05a' },
    { name: 'Python', percentage: 12.1, color: '#3572A5' },
    { name: 'HTML', percentage: 5.6, color: '#e34c26' }
  ],
  recentActivity: [
    {
      type: 'commit',
      repo: 'animation_search_bar',
      title: 'Enhanced animation search bar with new customization options',
      date: new Date().toISOString(),
      url: 'https://github.com/blackshadowsoftwareltd/animation_search_bar'
    },
    {
      type: 'pr',
      repo: 'portfolio_js',
      title: 'Added open source contributions showcase',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://github.com/blackshadowsoftwareltd/portfolio_js'
    },
    {
      type: 'issue',
      repo: 'animation_search_bar',
      title: 'Feature request: Add more animation types',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      url: 'https://github.com/blackshadowsoftwareltd/animation_search_bar/issues'
    }
  ]
};

export const SAMPLE_OPEN_SOURCE_PROJECTS: OpenSourceProject[] = [
  {
    name: 'animation_search_bar',
    description: 'A beautiful, customizable animated search bar widget for Flutter applications with extensive styling options and smooth animations.',
    url: 'https://github.com/blackshadowsoftwareltd/animation_search_bar',
    homepage: '',
    stars: 21,
    forks: 8,
    language: 'Dart',
    languageColor: '#00B4AB',
    topics: ['flutter', 'animation', 'search', 'ui-components', 'dart-package'],
    isContributor: true,
    contributionType: 'owner',
    lastUpdated: '2024-01-15T10:30:00Z'
  }
];

export const GITHUB_CONFIG = {
  USERNAME: 'blackshadowsoftwareltd',
  API_ENDPOINTS: {
    CONTRIBUTION_STATS: '/api/contribution-stats',
    OPEN_SOURCE_PROJECTS: '/api/open-source-projects'
  }
} as const;