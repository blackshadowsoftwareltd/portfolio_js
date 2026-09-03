import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
import { RESUME } from '@/constants/resume';

const GITHUB_USERNAME = RESUME.githubUsername;

interface GitHubRepository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  html_url: string;
  homepage: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
  };
  private: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    const targetUsername = username || GITHUB_USERNAME;

    // Public repositories are readable without a token; the token only raises
    // the rate limit, so this path no longer short-circuits to mock data.
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    // Fetch user repositories, paginating past the 100-per-page cap
    const repositories: GitHubRepository[] = [];

    for (let page = 1; page <= 5; page++) {
      const reposResponse = await fetch(
        `https://api.github.com/users/${targetUsername}/repos?per_page=100&page=${page}&sort=updated&direction=desc`,
        { headers }
      );

      if (!reposResponse.ok) {
        throw new Error(`GitHub API responded with status: ${reposResponse.status}`);
      }

      const batch: GitHubRepository[] = await reposResponse.json();
      repositories.push(...batch);

      if (batch.length < 100) break;
    }

    // Filter and transform repositories for open source showcase
    const openSourceProjects = repositories
      .filter(repo => !repo.private) // Only public repos
      .map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language || 'Unknown',
        languageColor: getLanguageColor(repo.language || 'Unknown'),
        topics: repo.topics || [],
        isContributor: repo.owner.login === targetUsername,
        contributionType: repo.owner.login === targetUsername ? 'owner' as const : 'contributor' as const,
        lastUpdated: repo.updated_at,
        createdAt: repo.created_at
      }))
      .sort((a, b) => b.stars - a.stars); // Sort by stars

    // Descriptions and topics come from GitHub as-is. Two hardcoded overrides for
    // specific repo names used to replace them here; they were invented copy.
    const enhancedProjects = openSourceProjects;

    const result = {
      projects: enhancedProjects,
      totalProjects: enhancedProjects.length,
      totalStars: enhancedProjects.reduce((sum, proj) => sum + proj.stars, 0),
      totalForks: enhancedProjects.reduce((sum, proj) => sum + proj.forks, 0),
      languages: [...new Set(enhancedProjects.map(p => p.language))].filter(lang => lang !== 'Unknown'),
      featuredProjects: enhancedProjects.filter(proj => 
        proj.stars > 5 || 
        proj.name === 'animation_search_bar' || 
        proj.name === 'portfolio_js' ||
        proj.forks > 2
      ).slice(0, 6)
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching open source projects:', error);
    // Fail visibly rather than serving invented repositories.
    return NextResponse.json(
      { error: 'Failed to fetch open source projects from GitHub' },
      { status: 502 }
    );
  }
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
    'React': '#61DAFB',
    'Unknown': '#8B5A2B'
  };
  
  return colors[language] || '#8B5A2B';
}