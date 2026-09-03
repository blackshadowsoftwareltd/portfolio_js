import { NextRequest, NextResponse } from 'next/server';
// Add this interface definition
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
 
const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const POPULAR_REPOS_QUERY = `
  query($username: String!, $orderBy: RepositoryOrderField!, $direction: OrderDirection!) {
    user(login: $username) {
      repositories(first: 8, orderBy: {field: $orderBy, direction: $direction}, privacy: PUBLIC) {
        nodes {
          name
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
            color
          }
          url
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { username, sortBy = 'stars' } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Map sortBy to GraphQL field and direction
    const getSortConfig = (sortBy: string) => {
      switch (sortBy) {
        case 'stars':
          return { orderBy: 'STARGAZERS', direction: 'DESC' };
        case 'updated':
          return { orderBy: 'UPDATED_AT', direction: 'DESC' };
        case 'created':
          return { orderBy: 'CREATED_AT', direction: 'DESC' };
        default:
          return { orderBy: 'STARGAZERS', direction: 'DESC' };
      }
    };

    const { orderBy, direction } = getSortConfig(sortBy);

    // Check if we have a GitHub token in environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      // If no token, try to fetch from GitHub's REST API as fallback
      return await fetchRepositoriesWithoutToken(username, sortBy);
    }

    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: POPULAR_REPOS_QUERY,
        variables: { username, orderBy, direction },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GitHub API errors: ${JSON.stringify(data.errors)}`);
    }

    const repositories = data.data?.user?.repositories?.nodes;

    if (!repositories) {
      throw new Error('User not found or repositories data unavailable');
    }

    // Apply client-side sorting to ensure correct order (even for GraphQL)
    const sortedRepos = repositories.sort((a: any, b: any) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazerCount - a.stargazerCount;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.stargazerCount - a.stargazerCount;
      }
    });

    return NextResponse.json({ repositories: sortedRepos });
  } catch (error) {
    console.error('Error fetching popular repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories data' },
      { status: 500 }
    );
  }
}

// Fallback function when no GitHub token is available
async function fetchRepositoriesWithoutToken(username: string, sortBy: string = 'stars') {
  try {
    // NOTE: the REST repos endpoint accepts sort=created|updated|pushed|full_name
    // only. Passing sort=stars makes GitHub silently fall back to `created`, so
    // asking for 8 rows returned the 8 newest repos and the star sort below only
    // reordered those. Pull the full list and rank it here instead.
    const restApiUrl = `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=100&type=public`;
    
    const response = await fetch(restApiUrl, {
      headers: {
        'User-Agent': 'Portfolio-App',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub REST API responded with status: ${response.status}`);
    }

    const repositories = await response.json();
    
    // Transform the data to match our expected format
    const transformedRepos = repositories.map((repo: { 
      name: string; 
      description: string; 
      stargazers_count: number; 
      forks_count: number; 
      language: string | null; 
      html_url: string; 
      created_at: string; 
      updated_at: string; 
    }) => ({
      name: repo.name,
      description: repo.description,
      stargazerCount: repo.stargazers_count,
      forkCount: repo.forks_count,
      primaryLanguage: repo.language ? {
        name: repo.language,
        color: getLanguageColor(repo.language)
      } : null,
      url: repo.html_url,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
    }));

    // Apply client-side sorting to ensure correct order (GitHub API sorting might not be reliable)
    const sortedRepos = transformedRepos.sort((a:Repository, b:Repository) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazerCount - a.stargazerCount;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return b.stargazerCount - a.stargazerCount;
      }
    });

    return NextResponse.json({ repositories: sortedRepos.slice(0, 8) });
  } catch (error) {
    console.error('Error fetching from REST API:', error);
    
    // Surface the failure rather than inventing repositories — a portfolio
    // showing plausible-but-fake repos is worse than one showing an error.
    return NextResponse.json(
      { error: 'Failed to fetch repositories from GitHub' },
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
    'C++': '#f34b7d',
    'C': '#555555',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'Vue': '#2c3e50',
    'React': '#61dafb',
  };
  return colors[language] || '#586069';
}