import { RESUME } from '@/constants/resume';

// Derived from the CV in src/constants/resume.ts — the same list the chat's
// getProjects tool renders, so the panel and the AI answers stay in sync.
// Star/fork counts deliberately live only in the GitHub-backed panels, which
// fetch them for real, rather than being hardcoded here.
export const projectsData = RESUME.projects.map((project, index) => ({
  id: index + 1,
  ...project,
}));

export const getCategoryColor = (category: string) => {
  const colors = {
    'Full-Stack': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Flutter Package': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Interop: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Mobile / AI': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    Systems: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Real-Time': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  };
  return (
    colors[category as keyof typeof colors] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  );
};
