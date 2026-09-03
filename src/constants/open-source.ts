import { RESUME } from '@/constants/resume';

export interface ContributionStats {
  totalContributions: number;
  // null when unavailable — these need an authenticated contributionsCollection
  // query, and are reported as null rather than estimated.
  totalCommits: number | null;
  totalPRs: number | null;
  totalIssues: number | null;
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

export const GITHUB_CONFIG = {
  USERNAME: RESUME.githubUsername,
  API_ENDPOINTS: {
    CONTRIBUTION_STATS: '/api/contribution-stats',
    OPEN_SOURCE_PROJECTS: '/api/open-source-projects'
  }
} as const;