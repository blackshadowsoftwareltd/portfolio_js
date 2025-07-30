'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Building2, ExternalLink } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string;
  type: string;
  description: string[];
  technologies: string[];
  website?: string;
  logo?: string;
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Tech Solutions Inc.",
    position: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    duration: "Jan 2023 - Present",
    type: "Full-time",
    description: [
      "Led development of scalable web applications serving 100k+ users",
      "Architected microservices infrastructure using Node.js and Docker",
      "Mentored junior developers and conducted code reviews",
      "Implemented CI/CD pipelines reducing deployment time by 60%"
    ],
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
    website: "https://techsolutions.com"
  },
  {
    id: "2",
    company: "Digital Innovations LLC",
    position: "Frontend Developer",
    location: "New York, NY",
    duration: "Jun 2021 - Dec 2022",
    type: "Full-time",
    description: [
      "Built responsive web applications using React and TypeScript",
      "Collaborated with design team to implement pixel-perfect UI components",
      "Optimized application performance resulting in 40% faster load times",
      "Integrated RESTful APIs and GraphQL endpoints"
    ],
    technologies: ["React", "TypeScript", "Sass", "GraphQL", "Jest", "Webpack"],
    website: "https://digitalinnovations.com"
  },
  {
    id: "3",
    company: "StartupXYZ",
    position: "Junior Web Developer",
    location: "Austin, TX",
    duration: "Sep 2020 - May 2021",
    type: "Full-time",
    description: [
      "Developed and maintained e-commerce platform features",
      "Fixed bugs and implemented new functionality based on user feedback",
      "Participated in agile development process and daily standups",
      "Learned modern web development best practices"
    ],
    technologies: ["JavaScript", "HTML5", "CSS3", "PHP", "MySQL", "Bootstrap"],
    website: "https://startupxyz.com"
  },
  {
    id: "4",
    company: "Freelance",
    position: "Web Developer",
    location: "Remote",
    duration: "Jan 2020 - Aug 2020",
    type: "Contract",
    description: [
      "Built custom websites for small businesses and entrepreneurs",
      "Provided ongoing maintenance and support for client projects",
      "Managed project timelines and client communications",
      "Delivered projects on time and within budget"
    ],
    technologies: ["WordPress", "JavaScript", "PHP", "HTML5", "CSS3", "MySQL"]
  }
];

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1.0] as const
      }
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Professional Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            My journey through the tech industry
          </p>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              className="relative group"
            >
              <div className="relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
                {/* Timeline connector */}
                {index < experiences.length - 1 && (
                  <div className="absolute left-8 top-full h-6 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 opacity-30" />
                )}
                
                {/* Timeline dot */}
                <div className="absolute -left-2 top-8 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg" />

                <div className="ml-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 size={18} className="text-blue-500" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {exp.company}
                        </h3>
                        {exp.website && (
                          <a
                            href={exp.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        {exp.position}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {exp.description.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {exp.technologies.map((tech, techIdx) => (
                        <motion.span
                          key={techIdx}
                          className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Want to know more about my experience? Feel free to reach out!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}