'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar, Star, GitFork, ArrowUpRight } from 'lucide-react';
import { projectsData, getStatusColor, getCategoryColor } from '@/constants/projects';

export function Projects() {
  return (
    <div className="mx-auto w-full h-full flex flex-col">
      <div className="w-full rounded-3xl px-2 py-3 font-sans sm:px-3 md:px-4 md:py-4 flex-1 min-h-0 flex flex-col" >
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            My Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            A collection of projects I've built using various technologies
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-3">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 group cursor-pointer relative"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {/* Redirect Button */}
              {(project.demoUrl || project.githubUrl) && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = project.demoUrl || project.githubUrl;
                    if (url) window.open(url, '_blank');
                  }}
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 hover:scale-110"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  title={project.demoUrl ? "Preview Demo" : "View on GitHub"}
                >
                  <ArrowUpRight size={12} className="text-gray-700 dark:text-gray-300" />
                </motion.button>
              )}

              {/* Project Image Placeholder */}
              <div className="w-full h-28 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                <div className="text-white text-base font-semibold opacity-75">
                  {project.category}
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-1.5">
                {/* Title & Status */}
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 flex-1">
                    {project.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Category */}
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium ${getCategoryColor(project.category)}`}>
                    {project.category}
                  </span>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats & Links */}
                <div className="flex items-center justify-between pt-1.5">
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star size={12} />
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork size={12} />
                      <span>{project.forks}</span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github size={14} />
                      </motion.a>
                    )}
                    {project.demoUrl && (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>

          {/* Stats Footer */}
          <div className="mt-6 text-center pb-3">
            <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-semibold text-lg text-purple-600 dark:text-purple-400 block">
                  {projectsData.length}
                </span>
                <span>Projects</span>
              </div>
              <div>
                <span className="font-semibold text-lg text-green-600 dark:text-green-400 block">
                  {projectsData.filter(p => p.status === 'Completed').length}
                </span>
                <span>Completed</span>
              </div>
              <div>
                <span className="font-semibold text-lg text-blue-600 dark:text-blue-400 block">
                  {[...new Set(projectsData.flatMap(p => p.technologies))].length}
                </span>
                <span>Technologies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;