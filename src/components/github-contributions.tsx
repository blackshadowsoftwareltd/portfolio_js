'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionsData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const GITHUB_USERNAME = 'blackshadowsoftwareltd';

const getContributionLevel = (count: number): string => {
  if (count === 0) return 'bg-neutral-100 dark:bg-neutral-800 blur-[0.5px] opacity-60';
  if (count <= 3) return 'bg-green-200 dark:bg-green-900';
  if (count <= 6) return 'bg-green-300 dark:bg-green-700';
  if (count <= 9) return 'bg-green-400 dark:bg-green-600';
  return 'bg-green-500 dark:bg-green-500';
};

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GitHubContributions() {
  const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch('/api/github-contributions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: GITHUB_USERNAME }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contributions');
        }

        const data = await response.json();
        setContributionsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-fit max-w-4xl mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            GitHub Contributions
          </h2>
          <div className="animate-pulse bg-neutral-300 dark:bg-neutral-600 h-5 w-28 rounded"></div>
        </div>
        <div className="space-y-0.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex gap-0.5">
              {Array.from({ length: 53 }).map((_, j) => (
                <div className="w-2.5 h-2.5 flex items-center justify-center" key={j}>
                  <div className="w-1.5 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-sm animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error || !contributionsData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-fit max-w-4xl mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
      >
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
            GitHub Contributions
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {error || 'Failed to load contributions data'}
          </p>
        </div>
      </motion.div>
    );
  }

  const currentYear = new Date().getFullYear();
  const firstWeek = contributionsData.weeks[0];
  const firstDay = firstWeek?.contributionDays[0];
  const startDate = firstDay ? new Date(firstDay.date) : new Date();

  const getMonthLabels = () => {
    const labels: { month: string; index: number }[] = [];
    let currentMonth = -1;
    
    contributionsData.weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week.contributionDays[0].date);
      const monthOfWeek = firstDayOfWeek.getMonth();
      
      if (monthOfWeek !== currentMonth) {
        labels.push({
          month: months[monthOfWeek],
          index: weekIndex
        });
        currentMonth = monthOfWeek;
      }
    });
    
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-fit max-w-4xl mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          GitHub Contributions
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {contributionsData.totalContributions} contributions in {currentYear}
          </span>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            View on GitHub
          </a>
        </div>
      </div>

      <div className="relative w-fit">
        {/* Month labels */}
        <div className="relative mb-1 ml-6 h-4">
          {monthLabels.map(({ month, index }) => (
            <div
              key={`${month}-${index}`}
              className="absolute text-xs text-neutral-600 dark:text-neutral-400"
              style={{ left: `${index * 12}px` }}
            >
              {month}
            </div>
          ))}
        </div>

        <div className="flex w-fit">
          {/* Weekday labels */}
          <div className="flex flex-col gap-0.5 mr-1 w-6">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, index) => (
              <div
                key={index}
                className="h-2.5 text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-end pr-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex gap-0.5">
            {contributionsData.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className="w-2.5 h-2.5 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: (weekIndex * 7 + dayIndex) * 0.001,
                        duration: 0.2 
                      }}
                      className={`w-1.5 h-1.5 rounded-sm ${getContributionLevel(day.contributionCount)} hover:ring-1 hover:ring-blue-400 transition-all duration-200 cursor-pointer`}
                      title={`${day.contributionCount} contributions on ${new Date(day.date).toLocaleDateString()}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <span>Less</span>
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-neutral-100 dark:bg-neutral-800 blur-[0.5px] opacity-60 rounded-sm"></div>
              </div>
              <div className="w-2.5 h-2.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-200 dark:bg-green-900 rounded-sm"></div>
              </div>
              <div className="w-2.5 h-2.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-300 dark:bg-green-700 rounded-sm"></div>
              </div>
              <div className="w-2.5 h-2.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-400 dark:bg-green-600 rounded-sm"></div>
              </div>
              <div className="w-2.5 h-2.5 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-500 rounded-sm"></div>
              </div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}