'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RESUME } from '@/constants/resume';

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

const GITHUB_USERNAME = RESUME.githubUsername;

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
  const [isHovered, setIsHovered] = useState(false);

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
        className="w-fit max-w-[min(56rem,calc(100vw-2rem))] mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30 overflow-hidden"
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
        className="w-fit max-w-[min(56rem,calc(100vw-2rem))] mx-auto p-3 bg-white/10 dark:bg-neutral-800/10 backdrop-blur-[2px] rounded-xl border border-neutral-200/30 dark:border-neutral-700/30 overflow-hidden"
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
      className="relative w-fit max-w-[min(42rem,calc(100vw-2rem))] mx-auto p-3 rounded-xl border md:hover:translate-y-[-70%] transition-transform duration-500 ease-in-out will-change-transform overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.10) 25%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.10) 75%,
            rgba(255, 255, 255, 0.25) 100%
          )
        `,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.12),
          0 2px 8px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 rgba(255, 255, 255, 0.1)
        `,
      }}
      whileHover={{
        y: -4,
        boxShadow: `
          0 25px 50px rgba(0, 0, 0, 0.25), 
          0 0 0 1px rgba(34, 197, 94, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.5),
          inset 0 -1px 0 rgba(255, 255, 255, 0.15)
        `,
        borderColor: 'rgba(34, 197, 94, 0.3)'
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {/* Animated Background Effects */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-20 h-20 rounded-full opacity-10"
          style={{ 
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent)',
            top: '10%',
            left: '10%'
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full opacity-8"
          style={{ 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
            top: '60%',
            right: '15%'
          }}
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        />
        
        {/* Additional pulse rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 border-green-400 opacity-40"
          animate={{
            scale: [1, 8],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 border-blue-400 opacity-30"
          animate={{
            scale: [1, 6],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.4
          }}
        />
        
        {/* Moving Radial Gradient */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? 0.4 : 0,
            background: isHovered ? [
              `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.6) 0%,
                rgba(255, 255, 255, 0.2) 40%,
                transparent 70%
              )`,
              `radial-gradient(circle at 70% 70%, 
                rgba(255, 255, 255, 0.6) 0%,
                rgba(255, 255, 255, 0.2) 40%,
                transparent 70%
              )`,
              `radial-gradient(circle at 30% 30%, 
                rgba(255, 255, 255, 0.6) 0%,
                rgba(255, 255, 255, 0.2) 40%,
                transparent 70%
              )`
            ] : `radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.2) 40%,
              transparent 70%
            )`
          }}
          transition={{
            opacity: { duration: 0.3 },
            background: {
              duration: isHovered ? 3 : 0,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>

      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{
          x: ['100%', '100%'],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 1.2, 
          ease: 'easeInOut',
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 2
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.15), transparent)',
          transform: 'skew(-20deg)'
        }}
      />

      <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          GitHub Contributions
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-600 dark:text-neutral-400">
            {contributionsData.totalContributions} contributions in the last year
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

      <div className="relative w-fit max-w-full overflow-x-auto">
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
      </div>
    </motion.div>
  );
}