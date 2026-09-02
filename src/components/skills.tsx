'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Code,
  Cpu,
  Database,
  Layers,
  Link2,
  Radio,
  Smartphone,
  Wrench,
} from 'lucide-react';
import { RESUME } from '@/constants/resume';

const Skills = () => {
  // Icons are assigned per category so the list stays driven by the CV in
  // src/constants/resume.ts — add a category there and it renders here.
  const categoryIcons: Record<string, React.ReactNode> = {
    Rust: <Cpu className="h-5 w-5" />,
    'Flutter & Dart': <Smartphone className="h-5 w-5" />,
    'FFI & Interop': <Link2 className="h-5 w-5" />,
    Databases: <Database className="h-5 w-5" />,
    'Real-Time & Networking': <Radio className="h-5 w-5" />,
    'Cross-Platform': <Layers className="h-5 w-5" />,
    Tooling: <Wrench className="h-5 w-5" />,
  };

  const skillsData = RESUME.skills.map((group) => ({
    category: group.category,
    icon: categoryIcons[group.category] ?? <Code className="h-5 w-5" />,
    skills: group.skills,
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full shadow-none border-none pb-12 px-0">
        <CardHeader className="pb-1 px-0">
          <CardTitle className="text-primary text-4xl font-bold px-0">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className='px-0'>
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge
                        className={`border px-3 py-1.5 font-normal`}
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
