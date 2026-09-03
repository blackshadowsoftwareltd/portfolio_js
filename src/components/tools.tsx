'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { toolsData, toolCategories, Tool } from '@/constants/tools';
import { ExternalLink } from 'lucide-react';

const Tools = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const filteredTools = selectedCategory === 'All' 
    ? toolsData 
    : toolsData.filter(tool => tool.category === selectedCategory);

  const categories = ['All', ...toolCategories];

  const handleToolClick = (tool: Tool) => {
    if (tool.website) {
      window.open(tool.website, '_blank');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4">
      {/* Header */}
      <motion.div 
        className="text-center mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Developer Tools
        </h2>
      </motion.div>

      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-1.5 mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
            <span className="ml-1.5 opacity-60 tabular-nums">
              {category === 'All'
                ? toolsData.length
                : toolsData.filter((t) => t.category === category).length}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Tools Grid */}
      <motion.div 
        className="grid items-stretch gap-3 [grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr))]"
        layout
      >
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            onHoverStart={() => setHoveredTool(tool.id)}
            onHoverEnd={() => setHoveredTool(null)}
            onClick={() => handleToolClick(tool)}
            className={`
              relative flex h-full flex-col overflow-hidden rounded-2xl p-4 cursor-pointer
              bg-white/80 dark:bg-gray-800/80 
              backdrop-blur-sm border border-gray-200 dark:border-gray-700
              ${tool.website ? 'hover:border-blue-300 dark:hover:border-blue-500' : ''}
            `}
            style={{
              background: hoveredTool === tool.id 
                ? `linear-gradient(135deg, ${tool.color}15, ${tool.color}08)`
                : undefined
            }}
            whileHover={{
              y: -8,
              boxShadow: `0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px ${tool.color}20`,
              transition: { type: 'spring', stiffness: 400, damping: 25 }
            }}
            whileTap={{
              scale: 0.98,
              transition: { type: 'spring', stiffness: 400, damping: 25 }
            }}
          >
            {/* Tool Icon */}
            <motion.div 
              className="mb-2 text-2xl leading-none"
              animate={{ 
                scale: hoveredTool === tool.id ? 1.15 : 1,
                rotate: hoveredTool === tool.id ? 8 : 0,
                y: hoveredTool === tool.id ? -2 : 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {tool.icon}
            </motion.div>

            {/* Tool Info */}
            <div className="relative z-10 flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 items-start gap-1.5">
                <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h3>
                {tool.website && (
                  <motion.div
                    className="mt-0.5 shrink-0"
                    animate={{ 
                      scale: hoveredTool === tool.id ? 1.1 : 1,
                      opacity: hoveredTool === tool.id ? 1 : 0.45
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExternalLink size={13} className="text-gray-500 dark:text-gray-400" />
                  </motion.div>
                )}
              </div>

              <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>

              <span
                className="mt-2.5 w-fit max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
                style={{
                  backgroundColor: `${tool.color}22`,
                  // The raw brand hex is often too dark to read on the dark card
                  // (e.g. Assembly #6E4C13). Mix it toward white so every pill
                  // keeps its identity and stays legible.
                  color: `color-mix(in srgb, ${tool.color} 55%, white)`,
                  border: `1px solid ${tool.color}45`
                }}
              >
                {tool.category}
              </span>
            </div>

            {/* Animated Background Particles */}
            <motion.div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
              animate={{ opacity: hoveredTool === tool.id ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Floating Orbs */}
              <motion.div
                className="absolute w-20 h-20 rounded-full opacity-20"
                style={{ 
                  background: `radial-gradient(circle, ${tool.color}60, transparent)`,
                  top: '10%',
                  left: '10%'
                }}
                animate={{
                  scale: hoveredTool === tool.id ? [1, 1.5, 1] : 1,
                  x: hoveredTool === tool.id ? [0, 20, 0] : 0,
                  y: hoveredTool === tool.id ? [0, -10, 0] : 0,
                }}
                transition={{ 
                  duration: 2, 
                  repeat: hoveredTool === tool.id ? Infinity : 0,
                  ease: 'easeInOut'
                }}
              />
              <motion.div
                className="absolute w-16 h-16 rounded-full opacity-15"
                style={{ 
                  background: `radial-gradient(circle, ${tool.color}40, transparent)`,
                  top: '60%',
                  right: '15%'
                }}
                animate={{
                  scale: hoveredTool === tool.id ? [1, 1.3, 1] : 1,
                  x: hoveredTool === tool.id ? [0, -15, 0] : 0,
                  y: hoveredTool === tool.id ? [0, 15, 0] : 0,
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: hoveredTool === tool.id ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: 0.3
                }}
              />
              <motion.div
                className="absolute w-12 h-12 rounded-full opacity-25"
                style={{ 
                  background: `radial-gradient(circle, ${tool.color}50, transparent)`,
                  bottom: '20%',
                  left: '70%'
                }}
                animate={{
                  scale: hoveredTool === tool.id ? [1, 1.2, 1] : 1,
                  x: hoveredTool === tool.id ? [0, 10, 0] : 0,
                  y: hoveredTool === tool.id ? [0, -20, 0] : 0,
                }}
                transition={{ 
                  duration: 1.8, 
                  repeat: hoveredTool === tool.id ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: 0.6
                }}
              />
            </motion.div>

            {/* Hover Effect Overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 pointer-events-none rounded-2xl"
              animate={{ opacity: hoveredTool === tool.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: `radial-gradient(circle at 50% 50%, ${tool.color}15, transparent 70%)`
              }}
            />
            
            {/* Animated Wave Background */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
              animate={{ opacity: hoveredTool === tool.id ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(45deg, transparent, ${tool.color}08, transparent, ${tool.color}12, transparent)`,
                  backgroundSize: '200% 200%'
                }}
                animate={{
                  backgroundPosition: hoveredTool === tool.id ? ['0% 0%', '100% 100%'] : '0% 0%'
                }}
                transition={{
                  duration: 3,
                  repeat: hoveredTool === tool.id ? Infinity : 0,
                  ease: 'linear'
                }}
              />
            </motion.div>
            
            {/* Pulse Rings */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              animate={{ opacity: hoveredTool === tool.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 opacity-40"
                style={{ borderColor: tool.color }}
                animate={{
                  scale: hoveredTool === tool.id ? [1, 8] : 1,
                  opacity: hoveredTool === tool.id ? [0.4, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredTool === tool.id ? Infinity : 0,
                  ease: 'easeOut'
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 opacity-30"
                style={{ borderColor: tool.color }}
                animate={{
                  scale: hoveredTool === tool.id ? [1, 6] : 1,
                  opacity: hoveredTool === tool.id ? [0.3, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: hoveredTool === tool.id ? Infinity : 0,
                  ease: 'easeOut',
                  delay: 0.4
                }}
              />
            </motion.div>
            
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: hoveredTool === tool.id ? '100%' : '-100%',
                opacity: hoveredTool === tool.id ? [0, 1, 0] : 0
              }}
              transition={{ 
                duration: 0.8, 
                ease: 'easeInOut',
                times: [0, 0.5, 1]
              }}
              style={{
                background: `linear-gradient(90deg, transparent, ${tool.color}25, transparent)`,
                transform: 'skew(-20deg)'
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-semibold text-2xl text-blue-600 dark:text-blue-400 block">
              {filteredTools.length}
            </span>
            <span>Tools</span>
          </div>
          <div>
            <span className="font-semibold text-2xl text-purple-600 dark:text-purple-400 block">
              {categories.length - 1}
            </span>
            <span>Categories</span>
          </div>
          <div>
            <span className="font-semibold text-2xl text-green-600 dark:text-green-400 block">
              {toolsData.filter(t => t.website).length}
            </span>
            <span>External Links</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Tools;