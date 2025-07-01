'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalTypingProps {
  name: string;
  typingSpeed?: number;
  backspaceSpeed?: number;
  pauseTime?: number;
}

export default function TerminalTyping({ 
  name, 
  typingSpeed = 150,
  backspaceSpeed = 100,
  pauseTime = 2000 
}: TerminalTypingProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const animate = () => {
      if (isTyping) {
        // Typing animation
        if (displayText.length < name.length) {
          timeout = setTimeout(() => {
            setDisplayText(prev => name.slice(0, prev.length + 1));
          }, typingSpeed);
        } else {
          // Pause before backspacing
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, pauseTime);
        }
      } else {
        // Backspacing animation
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(prev => prev.slice(0, -1));
          }, backspaceSpeed);
        } else {
          // Pause before typing again
          timeout = setTimeout(() => {
            setIsTyping(true);
          }, 500);
        }
      }
    };

    animate();

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, name, typingSpeed, backspaceSpeed, pauseTime]);

  // Cursor blinking animation
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-4 left-20 z-50 h-12 flex items-center rounded-2xl overflow-hidden"
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
    >
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
      
      <div className="relative z-10 flex items-center px-3">
        <span className="text-white mr-2 text-sm font-mono">$</span>
        <span 
          className="text-white font-mono text-sm"
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
        >
          {displayText}
          <span 
            className={`inline-block w-2 h-4 bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.1s' }}
          />
        </span>
      </div>
    </motion.div>
  );
}