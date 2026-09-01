'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import React from 'react';
import { RESUME } from '@/constants/resume';

export function Presentation() {
  // Animation variants for text elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1.0] as const },
    },
  };

  // Animation for the entire paragraph rather than word-by-word
  const paragraphAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1.0] as const,
        delay: 0.2,
      },
    },
  };

  const links = [
    { label: 'GitHub', href: RESUME.github, icon: Github },
    { label: 'LinkedIn', href: RESUME.linkedin, icon: Linkedin },
    { label: 'Email', href: `mailto:${RESUME.email}`, icon: Mail },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl py-6 font-sans">
      <motion.div initial="hidden" animate="visible" variants={textVariants}>
        <h1 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-2xl font-semibold text-transparent md:text-4xl">
          {RESUME.name}
        </h1>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          {RESUME.title}
        </p>
        <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{RESUME.location}</span>
        </div>
      </motion.div>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={paragraphAnimation}
        className="text-foreground mt-6 leading-relaxed"
      >
        {RESUME.summary}
      </motion.p>

      {/* Tags/Keywords */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-2"
      >
        {RESUME.tags.map((tag) => (
          <span
            key={tag}
            className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-6 flex flex-wrap gap-3"
      >
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-foreground hover:bg-secondary flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors"
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </motion.div>
    </div>
  );
}

export default Presentation;
