'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { RESUME } from '@/constants/resume';

export default function AllProjects() {
  return (
    <div className="h-full w-full pt-8">
      <h2 className="text-neutral-800 dark:text-neutral-200 mx-auto max-w-7xl font-sans text-xl font-bold md:text-3xl">
        My Projects
      </h2>

      <div className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2">
        {RESUME.projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border-border bg-accent/60 flex flex-col rounded-2xl border p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-foreground font-semibold">{project.title}</h3>
              <span className="text-muted-foreground bg-background shrink-0 rounded-full px-2.5 py-1 text-xs">
                {project.category}
              </span>
            </div>

            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {project.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-background text-muted-foreground rounded-md px-2 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>

            {(project.githubUrl || project.demoUrl) && (
              <div className="mt-4 flex items-center gap-4 pt-1">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
