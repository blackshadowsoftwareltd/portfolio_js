'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function LiquidGlassButton() {
  return (
    <motion.button
      className="group fixed top-4 left-4 z-50 w-12 h-12 rounded-2xl overflow-hidden"
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
        scale: 1.05,
        boxShadow: `
          0 12px 40px rgba(0, 0, 0, 0.15),
          0 4px 12px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.5),
          inset 0 -1px 0 rgba(255, 255, 255, 0.15)
        `,
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: `
          0 4px 16px rgba(0, 0, 0, 0.1),
          0 1px 4px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(255, 255, 255, 0.05)
        `,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      {/* Specular highlight that moves with interaction */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.2) 40%,
              transparent 70%
            )
          `,
        }}
        animate={{
          background: [
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
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Home icon */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Home 
          size={20} 
          className="text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200"
          strokeWidth={1.5}
        />
      </div>

      {/* Glass reflection effect */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(135deg,
              transparent 0%,
              rgba(255, 255, 255, 0.3) 20%,
              rgba(255, 255, 255, 0.1) 40%,
              transparent 60%,
              rgba(255, 255, 255, 0.1) 80%,
              transparent 100%
            )
          `,
        }}
      />
    </motion.button>
  );
}