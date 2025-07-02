'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Send, Mail, ExternalLink } from 'lucide-react';
import { PROFILE_DATA, ANIMATION_SETTINGS } from '@/constants/profile';

interface TerminalTypingProps {
  name: string;
  typingSpeed?: number;
  backspaceSpeed?: number;
  pauseTime?: number;
}

export default function TerminalTyping({ 
  name, 
  typingSpeed = ANIMATION_SETTINGS.typingSpeed,
  backspaceSpeed = ANIMATION_SETTINGS.backspaceSpeed,
  pauseTime = ANIMATION_SETTINGS.pauseTime 
}: TerminalTypingProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const description = `${PROFILE_DATA.designation}

${PROFILE_DATA.description}`;

  // Icon mapping
  const iconMap = { Github, Linkedin, Send, Mail };
  
  const socialMedia = PROFILE_DATA.socialMedia.map(social => ({
    ...social,
    icon: iconMap[social.icon as keyof typeof iconMap]
  }));

  // Measure content height
  useEffect(() => {
    if (isExpanded) {
      const measureHeight = () => {
        const content = document.getElementById('terminal-content');
        if (content) {
          setContentHeight(content.scrollHeight);
        }
      };
      measureHeight();
    }
  }, [isExpanded]);

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
    }, ANIMATION_SETTINGS.cursorBlinkSpeed);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <>
      {/* Single Expandable Terminal Card */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: 1, 
          x: 0
        }}
        transition={{ 
          opacity: { duration: 0.8, delay: 0.5 },
          x: { duration: 0.8, delay: 0.5 }
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="group fixed top-4 left-20 z-50 flex flex-col rounded-2xl overflow-hidden cursor-pointer max-w-sm"
        style={{
          minHeight: '48px',
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
          scale: 1.02,
          boxShadow: `
            0 12px 40px rgba(0, 0, 0, 0.15),
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(255, 255, 255, 0.15)
          `,
        }}
        whileTap={{
          scale: 0.98,
          boxShadow: `
            0 4px 16px rgba(0, 0, 0, 0.1),
            0 1px 4px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(255, 255, 255, 0.05)
          `,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
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
        
        {/* Main name section - always visible */}
        <div className="relative z-10 flex items-center px-3 h-12 flex-shrink-0">
          <span className="text-white mr-2 text-sm font-mono">$</span>
          <span 
            className="text-white font-mono text-sm"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}
          >
            {displayText}
            <span 
              className={`inline-block w-0.5 h-4 bg-white ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'opacity 0.1s' }}
            />
          </span>
        </div>

        {/* Expanded content */}
        <motion.div
          className="relative z-10 overflow-hidden"
          animate={{
            height: isExpanded ? contentHeight || 'auto' : 0
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            type: "tween"
          }}
        >
          <div id="terminal-content" className="px-3 pb-4">
            {/* Separator line */}
            <motion.div 
              animate={{ 
                scaleX: isExpanded ? 1 : 0,
                opacity: isExpanded ? 1 : 0
              }}
              transition={{ 
                duration: 0.4, 
                delay: isExpanded ? 0.3 : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="border-t border-white/20 mb-3 origin-left"
            />
            
            {/* Description section */}
            <motion.div
              animate={{ 
                opacity: isExpanded ? 1 : 0,
                y: isExpanded ? 0 : -15
              }}
              transition={{ 
                duration: 0.5, 
                delay: isExpanded ? 0.4 : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div className="flex items-center mb-2">
                <span className="text-white mr-2 text-sm font-mono">$</span>
                <span className="text-white font-mono text-sm">nano about.txt</span>
              </div>
              <motion.p
                animate={{ 
                  opacity: isExpanded ? 1 : 0,
                  y: isExpanded ? 0 : -8
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: isExpanded ? 0.5 : 0,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="text-white text-sm leading-relaxed font-mono whitespace-pre-line text-left"
              >
                {description}
              </motion.p>
            </motion.div>

            {/* Social Media Section */}
            <motion.div
              animate={{ 
                opacity: isExpanded ? 1 : 0,
                y: isExpanded ? 0 : 30,
                scale: isExpanded ? 1 : 0.9
              }}
              transition={{ 
                duration: 0.6, 
                delay: isExpanded ? 0.6 : 0,
                ease: [0.175, 0.885, 0.32, 1.275],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="mt-4"
            >
              <motion.div 
                className="flex items-center mb-3"
                animate={{
                  scale: isExpanded ? [1, 1.05, 1] : 1
                }}
                transition={{
                  duration: 0.6,
                  delay: isExpanded ? 0.7 : 0,
                  times: [0, 0.5, 1]
                }}
              >
                <span className="text-white mr-2 text-sm font-mono">$</span>
                <motion.span 
                  className="text-white font-mono text-sm"
                  animate={{
                    color: isExpanded ? ['#ffffff', '#22c55e', '#ffffff'] : '#ffffff'
                  }}
                  transition={{
                    duration: 1,
                    delay: isExpanded ? 0.8 : 0,
                    times: [0, 0.5, 1]
                  }}
                >
                  ls -la social/
                </motion.span>
              </motion.div>
              
              <div className="grid grid-cols-2 gap-3">
                {socialMedia.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ 
                        opacity: 0,
                        y: 20,
                        scale: 0.9
                      }}
                      animate={{ 
                        opacity: isExpanded ? 1 : 0,
                        y: isExpanded ? 0 : 20,
                        scale: isExpanded ? 1 : 0.9
                      }}
                      transition={{ 
                        duration: 0.5, 
                        delay: isExpanded ? 0.8 + (index * 0.1) : 0,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 hover:border-white/30 transition-all duration-200"
                      whileHover={{
                        scale: 1.02
                      }}
                      whileTap={{ 
                        scale: 0.98
                      }}
                    >
                      <IconComponent size={16} className="text-white/80 group-hover:text-white transition-colors duration-200" />
                      
                      <span className="text-white/80 group-hover:text-white text-xs font-mono transition-colors duration-200">
                        {social.command}
                      </span>
                      
                      <ExternalLink size={10} className="text-white/50 group-hover:text-white/80 ml-auto transition-colors duration-200" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.button>

      {/* Backdrop to close expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}