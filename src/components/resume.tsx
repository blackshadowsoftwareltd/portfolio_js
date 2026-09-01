'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, GraduationCap, Linkedin, Mail, MapPin } from 'lucide-react';
import { RESUME } from '@/constants/resume';

/**
 * Renders the resume inline rather than offering a PDF download — the original
 * PDF belonged to the upstream project's author and was removed. Drop a file in
 * public/ and add a download button here if a PDF is ever wanted.
 */
export function Resume() {
  return (
    <motion.div
      className="mx-auto w-full max-w-3xl py-8 font-sans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="bg-accent rounded-2xl p-6 md:p-8">
        {/* Header */}
        <h2 className="text-foreground text-2xl font-semibold md:text-3xl">
          {RESUME.name}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          {RESUME.headline}
        </p>

        <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {RESUME.location}
          </span>
          <a
            className="flex items-center gap-1.5 hover:underline"
            href={`mailto:${RESUME.email}`}
          >
            <Mail className="h-4 w-4" />
            {RESUME.email}
          </a>
          <a
            className="flex items-center gap-1.5 hover:underline"
            href={RESUME.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            className="flex items-center gap-1.5 hover:underline"
            href={RESUME.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        </div>

        {/* Summary */}
        <p className="text-foreground mt-6 text-sm leading-relaxed">
          {RESUME.summary}
        </p>

        {/* Experience */}
        <h3 className="text-foreground mt-8 text-lg font-semibold">
          Experience
        </h3>
        <div className="mt-3 space-y-4">
          {RESUME.experience.map((job) => (
            <div
              key={job.id}
              className="border-border border-l-2 pl-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-foreground font-medium">{job.company}</p>
                <p className="text-muted-foreground text-xs">{job.duration}</p>
              </div>
              <p className="text-muted-foreground text-sm">{job.position}</p>
              <p className="text-foreground/80 mt-1.5 text-sm leading-relaxed">
                {job.summary}
              </p>
            </div>
          ))}
        </div>

        {/* Education */}
        <h3 className="text-foreground mt-8 flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="h-5 w-5" />
          Education
        </h3>
        <div className="mt-3 space-y-3">
          {RESUME.education.map((entry) => (
            <div
              key={entry.degree}
              className="flex flex-wrap items-baseline justify-between gap-x-3"
            >
              <div>
                <p className="text-foreground text-sm font-medium">
                  {entry.degree}
                </p>
                <p className="text-muted-foreground text-sm">
                  {entry.institution} · {entry.location}
                </p>
              </div>
              <p className="text-muted-foreground text-xs">{entry.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Resume;
