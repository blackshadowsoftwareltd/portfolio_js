import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'RemonAhammad';
const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

interface RestRepository {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  size: number;
  fork: boolean;
}

interface GitHubEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
    ref?: string;
    size?: number;
    head?: string;
    pull_request?: { title: string; html_url: string };
    issue?: { title: string; html_url: string };
    release?: { name: string; html_url: string };
  };
}

type ActivityType = 'commit' | 'pr' | 'issue' | 'release';

interface RecentActivity {
  type: ActivityType;
  repo: string;
  title: string;
  date: string;
  url: string;
}

interface ContributionStats {
  totalContributions: number;
  // null when the metric is not obtainable — these come from the authenticated
  // contributionsCollection API, so they stay null without a GITHUB_TOKEN
  // rather than being estimated from the repo count.
  totalCommits: number | null;
  totalPRs: number | null;
  totalIssues: number | null;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  languages: { name: string; percentage: number; color: string }[];
  recentActivity: RecentActivity[];
}

const CONTRIBUTION_STATS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: {field: STARGAZERS, direction: DESC}) {
        totalCount
        nodes {
          stargazerCount
          forkCount
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        contributionCalendar {
          totalContributions
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  const { username } = await request.json().catch(() => ({ username: undefined }));
  const targetUsername = username || GITHUB_USERNAME;

  try {
    const stats = GITHUB_TOKEN
      ? await fetchAuthenticatedStats(targetUsername)
      : await fetchPublicStats(targetUsername);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching contribution stats:', error);
    // Surface the failure instead of returning invented numbers — a portfolio
    // showing plausible-but-wrong counts is worse than one showing an error.
    return NextResponse.json(
      { error: 'Failed to fetch contribution stats from GitHub' },
      { status: 502 }
    );
  }
}

async function fetchAuthenticatedStats(username: string): Promise<ContributionStats> {
  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: CONTRIBUTION_STATS_QUERY,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL responded with status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GitHub GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  const user = data.data?.user;

  if (!user) {
    throw new Error(`User not found: ${username}`);
  }

  const repos = user.repositories.nodes as {
    stargazerCount: number;
    forkCount: number;
    languages: { edges: { size: number; node: { name: string; color: string | null } }[] };
  }[];

  // Real byte counts per language, summed across every public repository.
  const languageBytes: Record<string, { size: number; color: string | null }> = {};

  for (const repo of repos) {
    for (const edge of repo.languages?.edges ?? []) {
      const existing = languageBytes[edge.node.name];
      languageBytes[edge.node.name] = {
        size: (existing?.size ?? 0) + edge.size,
        color: edge.node.color ?? existing?.color ?? null,
      };
    }
  }

  const contributions = user.contributionsCollection;

  return {
    totalContributions: contributions.contributionCalendar.totalContributions,
    totalCommits: contributions.totalCommitContributions,
    totalPRs: contributions.totalPullRequestContributions,
    totalIssues: contributions.totalIssueContributions,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazerCount, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forkCount, 0),
    totalRepos: user.repositories.totalCount,
    languages: toLanguagePercentages(languageBytes),
    recentActivity: await fetchRecentActivity(username),
  };
}

async function fetchPublicStats(username: string): Promise<ContributionStats> {
  console.warn(
    'No GITHUB_TOKEN set — commit/PR/issue counts are unavailable on the public API and will be reported as null.'
  );

  const repos = await fetchAllPublicRepos(username);

  // The unauthenticated REST list only exposes each repo's *primary* language,
  // so weight it by repo size. Less precise than the authenticated byte counts,
  // but derived from real data rather than invented.
  const languageBytes: Record<string, { size: number; color: string | null }> = {};

  for (const repo of repos) {
    if (!repo.language) continue;
    const existing = languageBytes[repo.language];
    languageBytes[repo.language] = {
      size: (existing?.size ?? 0) + repo.size,
      color: getLanguageColor(repo.language),
    };
  }

  return {
    totalContributions: await fetchPublicContributionTotal(username),
    totalCommits: null,
    totalPRs: null,
    totalIssues: null,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    totalRepos: repos.length,
    languages: toLanguagePercentages(languageBytes),
    recentActivity: await fetchRecentActivity(username),
  };
}

async function fetchAllPublicRepos(username: string): Promise<RestRepository[]> {
  const repos: RestRepository[] = [];

  // Paginate — the account can hold more than one page of repositories.
  for (let page = 1; page <= 5; page++) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=owner`,
      { headers: restHeaders() }
    );

    if (!response.ok) {
      throw new Error(`GitHub REST responded with status: ${response.status}`);
    }

    const batch: RestRepository[] = await response.json();
    repos.push(...batch);

    if (batch.length < 100) break;
  }

  return repos;
}

// Mirrors the rolling 365-day window the contribution heatmap renders, so the
// two panels agree.
async function fetchPublicContributionTotal(username: string): Promise<number> {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
    headers: { 'User-Agent': 'Portfolio-App' },
  });

  if (!response.ok) {
    throw new Error(`Public contributions API responded with status: ${response.status}`);
  }

  const data = await response.json();
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (data.contributions ?? [])
    .filter((day: { date: string }) => {
      const date = new Date(day.date);
      return date >= oneYearAgo && date <= today;
    })
    .reduce((sum: number, day: { count: number }) => sum + day.count, 0);
}

async function fetchRecentActivity(username: string): Promise<RecentActivity[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=30`,
      { headers: restHeaders() }
    );

    if (!response.ok) return [];

    const events: GitHubEvent[] = await response.json();

    const seen = new Set<string>();

    return events
      .map(toActivity)
      .filter((activity): activity is RecentActivity => activity !== null)
      .filter((activity) => {
        const key = `${activity.type}:${activity.repo}:${activity.title}:${activity.date.slice(0, 10)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  } catch (error) {
    console.warn('Failed to fetch recent activity:', error);
    return [];
  }
}

function toActivity(event: GitHubEvent): RecentActivity | null {
  const repo = event.repo.name.split('/').pop() ?? event.repo.name;
  const repoUrl = `https://github.com/${event.repo.name}`;

  switch (event.type) {
    case 'PushEvent': {
      // The public events feed often omits `commits` and `size`, so fall back
      // through message -> count -> a plain "pushed" line rather than printing
      // a bogus "0 commits".
      const commits = event.payload.commits ?? [];
      const message = commits[commits.length - 1]?.message?.split('\n')[0];
      const branch = event.payload.ref?.replace('refs/heads/', '');
      const count = event.payload.size ?? commits.length;

      let title: string;
      if (message) {
        title = message;
      } else if (count > 0) {
        title = `Pushed ${count} commit${count === 1 ? '' : 's'}${branch ? ` to ${branch}` : ''}`;
      } else {
        title = `Pushed${branch ? ` to ${branch}` : ''}`;
      }

      return {
        type: 'commit',
        repo,
        title,
        date: event.created_at,
        url: event.payload.head
          ? `${repoUrl}/commit/${event.payload.head}`
          : `${repoUrl}/commits${branch ? `/${branch}` : ''}`,
      };
    }
    case 'PullRequestEvent':
      return event.payload.pull_request
        ? {
            type: 'pr',
            repo,
            title: event.payload.pull_request.title,
            date: event.created_at,
            url: event.payload.pull_request.html_url,
          }
        : null;
    case 'IssuesEvent':
      return event.payload.issue
        ? {
            type: 'issue',
            repo,
            title: event.payload.issue.title,
            date: event.created_at,
            url: event.payload.issue.html_url,
          }
        : null;
    case 'ReleaseEvent':
      return event.payload.release
        ? {
            type: 'release',
            repo,
            title: event.payload.release.name || `Released ${repo}`,
            date: event.created_at,
            url: event.payload.release.html_url,
          }
        : null;
    default:
      return null;
  }
}

function toLanguagePercentages(
  languageBytes: Record<string, { size: number; color: string | null }>
): { name: string; percentage: number; color: string }[] {
  const total = Object.values(languageBytes).reduce((sum, lang) => sum + lang.size, 0);

  if (total === 0) return [];

  return Object.entries(languageBytes)
    .map(([name, { size, color }]) => ({
      name,
      percentage: (size / total) * 100,
      color: color ?? getLanguageColor(name),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}

function restHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-App',
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
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
    'CMake': '#DA3434',
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
