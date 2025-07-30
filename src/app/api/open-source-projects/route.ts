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

    // If no GitHub token, return mock data
    if (!GITHUB_TOKEN) {
      console.warn('No GitHub token provided, returning mock open source projects');
      return NextResponse.json(generateMockOpenSourceProjects(targetUsername));
    }

    const headers = {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-App',
    };

    // Fetch user repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${targetUsername}/repos?per_page=100&sort=updated&direction=desc`,
      { headers }
    );

    if (!reposResponse.ok) {
      console.warn(`GitHub API error: ${reposResponse.status}, returning mock data`);
      return NextResponse.json(generateMockOpenSourceProjects(targetUsername));
    }

    const repositories: GitHubRepository[] = await reposResponse.json();

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

    // Add some highlighted projects with enhanced descriptions
    const enhancedProjects = openSourceProjects.map(project => {
      // Special handling for known projects
      if (project.name === 'animation_search_bar') {
        return {
          ...project,
          description: 'A beautiful, customizable animated search bar widget for Flutter applications with extensive styling options and smooth animations.',
          topics: [...project.topics, 'flutter', 'animation', 'search', 'ui-components', 'dart-package'].filter((topic, index, arr) => arr.indexOf(topic) === index)
        };
      }
      
      if (project.name === 'portfolio_js') {
        return {
          ...project,
          description: 'Modern, interactive portfolio website built with Next.js, featuring AI-powered chat, dynamic GitHub integration, and stunning glass morphism UI.',
          topics: [...project.topics, 'nextjs', 'portfolio', 'react', 'typescript', 'ai', 'glassmorphism'].filter((topic, index, arr) => arr.indexOf(topic) === index)
        };
      }

      return project;
    });

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
    const targetUsername = GITHUB_USERNAME;
    return NextResponse.json(generateMockOpenSourceProjects(targetUsername));
  }
}

function generateMockOpenSourceProjects(username: string) {
  const mockProjects = [
    {
      name: 'animation_search_bar',
      description: 'A beautiful, customizable animated search bar widget for Flutter applications with extensive styling options and smooth animations.',
      url: `https://github.com/${username}/animation_search_bar`,
      homepage: 'https://pub.dev/packages/animation_search_bar',
      stars: 42,
      forks: 8,
      language: 'Dart',
      languageColor: '#00B4AB',
      topics: ['flutter', 'animation', 'search', 'ui-components', 'dart-package'],
      isContributor: true,
      contributionType: 'owner' as const,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'portfolio_js',
      description: 'Modern, interactive portfolio website built with Next.js, featuring AI-powered chat, dynamic GitHub integration, and stunning glass morphism UI.',
      url: `https://github.com/${username}/portfolio_js`,
      homepage: 'https://blackshadow.dev',
      stars: 28,
      forks: 5,
      language: 'TypeScript',
      languageColor: '#2b7489',
      topics: ['nextjs', 'portfolio', 'react', 'typescript', 'ai', 'glassmorphism'],
      isContributor: true,
      contributionType: 'owner' as const,
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'flutter_mobile_app',
      description: 'Cross-platform mobile application built with Flutter, featuring modern UI design and seamless user experience.',
      url: `https://github.com/${username}/flutter_mobile_app`,
      homepage: '',
      stars: 15,
      forks: 3,
      language: 'Dart',
      languageColor: '#00B4AB',
      topics: ['flutter', 'mobile', 'cross-platform', 'ui-design'],
      isContributor: true,
      contributionType: 'owner' as const,
      lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      name: 'javascript_algorithms',
      description: 'Collection of JavaScript algorithms and data structures with detailed explanations and examples.',
      url: `https://github.com/${username}/javascript_algorithms`,
      homepage: '',
      stars: 67,
      forks: 12,
      language: 'JavaScript',
      languageColor: '#f1e05a',
      topics: ['algorithms', 'data-structures', 'javascript', 'coding-interview'],
      isContributor: true,
      contributionType: 'owner' as const,
      lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  return {
    projects: mockProjects,
    totalProjects: mockProjects.length,
    totalStars: mockProjects.reduce((sum, proj) => sum + proj.stars, 0),
    totalForks: mockProjects.reduce((sum, proj) => sum + proj.forks, 0),
    languages: [...new Set(mockProjects.map(p => p.language))],
    featuredProjects: mockProjects.slice(0, 3)
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
    'React': '#61DAFB',
    'Unknown': '#8B5A2B'
  };
  
  return colors[language] || '#8B5A2B';
}