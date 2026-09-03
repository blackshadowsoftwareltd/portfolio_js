import { NextRequest, NextResponse } from 'next/server';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check if we have a GitHub token in environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      // If no token, try to fetch from GitHub's public API using a different approach
      // We'll use a proxy service or scraping approach as a fallback
      return await fetchContributionsWithoutToken(username);
    }

    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GitHub API errors: ${JSON.stringify(data.errors)}`);
    }

    const contributionsData = data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!contributionsData) {
      throw new Error('User not found or contributions data unavailable');
    }

    return NextResponse.json(contributionsData);
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions data' },
      { status: 500 }
    );
  }
}

// Fallback function when no GitHub token is available
async function fetchContributionsWithoutToken(username: string) {
  try {
    // Use a public GitHub contribution API service
    const publicApiUrl = `https://github-contributions-api.jogruber.de/v4/${username}`;
    
    const response = await fetch(publicApiUrl, {
      headers: {
        'User-Agent': 'Portfolio-App',
      },
    });

    if (!response.ok) {
      throw new Error(`Public API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match our expected format
    const weeks = transformContributionsToWeeks(data.contributions || []);

    // Sum the days actually rendered. data.total[year] is the calendar year to
    // date, but the grid below the label covers a rolling 365-day window, so
    // the two disagree for most of the year.
    const transformedData = {
      totalContributions: weeks.reduce(
        (sum: number, week: { contributionDays: { contributionCount: number }[] }) =>
          sum + week.contributionDays.reduce((s: number, d: { contributionCount: number }) => s + d.contributionCount, 0),
        0
      ),
      weeks
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching from public API:', error);
    
    // Surface the failure rather than generating a random heatmap.
    return NextResponse.json(
      { error: 'Failed to fetch contributions from GitHub' },
      { status: 502 }
    );
  }
}

function getContributionColor(count: number): string {
  if (count === 0) return '#ebedf0';
  if (count <= 3) return '#9be9a8';
  if (count <= 6) return '#40c463';
  if (count <= 9) return '#30a14e';
  return '#216e39';
}

function transformContributionsToWeeks(contributions: any[]) {
  const weeks = [];
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  
  // Filter contributions to last year only
  const yearContributions = contributions.filter((contrib: any) => {
    const contribDate = new Date(contrib.date);
    return contribDate >= oneYearAgo && contribDate <= today;
  });

  // Group by weeks starting from Sunday
  const firstSunday = new Date(oneYearAgo);
  firstSunday.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());
  
  let currentDate = new Date(firstSunday);
  
  while (currentDate <= today) {
    const week = [];
    
    for (let day = 0; day < 7; day++) {
      if (currentDate <= today) {
        const dateString = currentDate.toISOString().split('T')[0];
        const contrib = yearContributions.find((c: any) => c.date === dateString);
        const count = contrib ? contrib.count : 0;
        
        week.push({
          contributionCount: count,
          date: dateString,
          color: getContributionColor(count),
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (week.length > 0) {
      weeks.push({ contributionDays: week });
    }
  }

  return weeks;
}