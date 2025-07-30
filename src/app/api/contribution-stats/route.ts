import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'blackshadowsoftwareltd';

interface GitHubRepository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  html_url: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
  };
}

interface GitHubLanguage {
  [key: string]: number;
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    const targetUsername = username || GITHUB_USERNAME;

    // If no GitHub token, return mock data
    if (!GITHUB_TOKEN) {
      console.warn('No GitHub token provided, returning mock contribution stats');
      return NextResponse.json(generateMockContributionStats(targetUsername));
    }

    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };

    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${targetUsername}/repos?per_page=100&sort=stars&direction=desc`,
      { headers }
    );

    if (!reposResponse.ok) {
      console.warn(`GitHub API error: ${reposResponse.status}, returning mock data`);
      return NextResponse.json(generateMockContributionStats(targetUsername));
    }

    const repositories: GitHubRepository[] = await reposResponse.json();

    // Calculate statistics
    const totalRepos = repositories.length;
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Get language statistics
    const languageStats: { [key: string]: number } = {};
    let totalSize = 0;

    for (const repo of repositories.slice(0, 20)) { // Limit to top 20 repos to avoid rate limits
      if (repo.language) {
        try {
          const langResponse = await fetch(
            `https://api.github.com/repos/${targetUsername}/${repo.name}/languages`,
            { headers }
          );
          
          if (langResponse.ok) {
            const languages: GitHubLanguage = await langResponse.json();
            Object.entries(languages).forEach(([lang, size]) => {
              languageStats[lang] = (languageStats[lang] || 0) + size;
              totalSize += size;
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch languages for ${repo.name}:`, error);
        }
      }
    }

    // Convert to percentages and get top 5
    const languagePercentages = Object.entries(languageStats)
      .map(([name, size]) => ({
        name,
        percentage: (size / totalSize) * 100,
        color: getLanguageColor(name)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Mock recent activity (you can enhance this with actual GitHub events API)
    const recentActivity = [
      {
        type: 'commit' as const,
        repo: 'animation_search_bar',
        title: 'Enhanced animation search bar with new customization options',
        date: new Date().toISOString(),
        url: `https://github.com/${targetUsername}/animation_search_bar`
      },
      {
        type: 'pr' as const,
        repo: 'portfolio_js',
        title: 'Added open source contributions showcase',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        url: `https://github.com/${targetUsername}/portfolio_js`
      },
      {
        type: 'issue' as const,
        repo: 'animation_search_bar',
        title: 'Feature request: Add more animation types',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        url: `https://github.com/${targetUsername}/animation_search_bar/issues`
      }
    ];

    const contributionStats = {
      totalContributions: totalStars + totalForks + 150, // Estimated total contributions
      totalCommits: repositories.length * 15, // Estimated
      totalPRs: Math.floor(repositories.length * 2.5), // Estimated
      totalIssues: Math.floor(repositories.length * 1.8), // Estimated
      totalStars,
      totalForks,
      totalRepos,
      languages: languagePercentages,
      recentActivity
    };

    return NextResponse.json(contributionStats);

  } catch (error) {
    console.error('Error fetching contribution stats:', error);
    const targetUsername = GITHUB_USERNAME;
    return NextResponse.json(generateMockContributionStats(targetUsername));
  }
}

function generateMockContributionStats(username: string) {
  const mockLanguages = [
    { name: 'JavaScript', percentage: 35.2, color: '#f1e05a' },
    { name: 'TypeScript', percentage: 28.7, color: '#2b7489' },
    { name: 'Python', percentage: 18.1, color: '#3572A5' },
    { name: 'HTML', percentage: 10.5, color: '#e34c26' },
    { name: 'CSS', percentage: 7.5, color: '#563d7c' },
  ];

  const mockActivity = [
    {
      type: 'commit' as const,
      repo: 'animation_search_bar',
      title: 'Enhanced animation search bar with new customization options',
      date: new Date().toISOString(),
      url: `https://github.com/${username}/animation_search_bar`
    },
    {
      type: 'pr' as const,
      repo: 'portfolio_js',
      title: 'Added open source contributions showcase',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      url: `https://github.com/${username}/portfolio_js`
    },
    {
      type: 'issue' as const,
      repo: 'flutter_projects',
      title: 'Feature request: Add more customization options',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      url: `https://github.com/${username}/flutter_projects/issues`
    }
  ];

  return {
    totalContributions: 1247,
    totalCommits: 892,
    totalPRs: 45,
    totalIssues: 23,
    totalStars: 156,
    totalForks: 78,
    totalRepos: 25,
    languages: mockLanguages,
    recentActivity: mockActivity
  };
}

function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'Dart': '#00B4AB',
    'Flutter': '#02569B',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'C++': '#f34b7d',
    'C': '#555555',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'C#': '#239120',
    'Shell': '#89e051',
    'Vue': '#4FC08D',
    'React': '#61DAFB'
  };
  
  return colors[language] || '#8B5A2B';
}