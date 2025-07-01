'use client';

import FluidCursor from '@/components/FluidCursor';
import GitHubContributions from '@/components/github-contributions';
import LiquidGlassButton from '@/components/liquid-glass-button';
import PopularRepositories from '@/components/popular-repositories';
import TerminalTyping from '@/components/terminal-typing';
import { Button } from '@/components/ui/button';
import WelcomeModal from '@/components/welcome-modal';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Laugh,
  Layers,
  PartyPopper,
  UserRoundSearch,
  FolderGit2,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import GitHubButton from 'react-github-btn';

/* ---------- quick-question data ---------- */
const questions = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'What are your projects? What are you working on right now?',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Fun: 'What’s the craziest thing you’ve ever done? What are your hobbies?',
  Contact:
    'How can I reach you? What kind of project would make you say "yes" immediately?',
} as const;

const questionConfig = [
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Fun', color: '#B95F9D', icon: PartyPopper },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
] as const;

/* ---------- component ---------- */
export default function Home() {
  const [input, setInput] = useState('');
  const [showRepositories, setShowRepositories] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const goToChat = (query: string) =>
    router.push(`/chat?query=${encodeURIComponent(query)}`);

  /* hero animations (unchanged) */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'ease', duration: 0.8 },
    },
  };
  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'ease', duration: 0.8, delay: 0.2 },
    },
  };

  useEffect(() => {
    // Précharger les assets du chat en arrière-plan
    const img = new window.Image();
    img.src = '/landing-memojis.png';

    // Précharger les vidéos aussi
    const linkWebm = document.createElement('link');
    linkWebm.rel = 'preload'; // Note: prefetch au lieu de preload
    linkWebm.as = 'video';
    linkWebm.href = '/final_memojis.webm';
    document.head.appendChild(linkWebm);

    const linkMp4 = document.createElement('link');
    linkMp4.rel = 'prefetch';
    linkMp4.as = 'video';
    linkMp4.href = '/final_memojis_ios.mp4';
    document.head.appendChild(linkMp4);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* big blurred footer word */}
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: '-2.5rem' }}
        >
          Toukoum
        </div>
      </div> */}

      {/* GitHub button */}
      {/* <div className="absolute top-6 right-8 z-20">
        <GitHubButton
          href="https://github.com/toukoum/portfolio"
          data-color-scheme="no-preference: light; light: light; dark: light_high_contrast;"
          data-size="large"
          data-show-count="true"
          aria-label="Star toukoum/portfolio on GitHub"
        >
          Star
        </GitHubButton>
      </div> */}

      {/* <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => goToChat('Are you looking for an internship?')}
          className="cursor-pointer relative flex items-center gap-2 rounded-full border bg-white/30 px-4 py-1.5 text-sm font-medium text-black shadow-md backdrop-blur-lg transition hover:bg-white/60 dark:border-white dark:text-white dark:hover:bg-neutral-800"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          need an intern?
        </button>
      </div> */}

      {/* header */}
      {/* <motion.div
        className="z-1 mb-8 flex flex-col items-center text-center md:mb-12 mt-24 md:mt-4"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="z-100">
          <WelcomeModal />
        </div>

        <h2 className="text-secondary-foreground mt-1 text-xl font-semibold md:text-2xl">
          Hey, I'm Raphael 👋
        </h2>
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          AI portfolio
        </h1>
      </motion.div> */}

      {/* centre memoji */}
      {/* <div className="relative z-10 h-52 w-48 overflow-hidden sm:h-72 sm:w-72">
        <Image
          src="/landing-memojis.png"
          alt="Hero memoji"
          width={2000}
          height={2000}
          priority
          className="translate-y-14 scale-[2] object-cover"
        />
      </div> */}

      {/* input + quick buttons */}
      {/* <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) goToChat(input.trim());
          }}
          className="relative w-full max-w-lg"
        >
          <div className="mx-auto flex items-center rounded-full border border-neutral-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="w-full border-none bg-transparent text-base text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Submit question"
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {questionConfig.map(({ key, color, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => goToChat(questions[key])}
              variant="outline"
              className="shadow-none border-border hover:bg-border/30 aspect-square w-full cursor-pointer rounded-2xl border bg-white/30 py-8 backdrop-blur-lg active:scale-95 md:p-10"
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
                <Icon size={22} strokeWidth={2} color={color} />
                <span className="text-xs font-medium sm:text-sm">{key}</span>
              </div>
            </Button>
          ))}
        </div>
      </motion.div> */}
      
      {/* Liquid Glass Home Button */}
      <LiquidGlassButton />
      
      {/* Terminal Typing Animation */}
      <TerminalTyping name="Rimon Ahammad" />
      
      {/* Repositories Toggle Button */}
      <motion.button
        onClick={() => setShowRepositories(!showRepositories)}
        className="group fixed top-4 right-4 z-50 w-12 h-12 rounded-2xl overflow-hidden"
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
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <motion.div
            animate={{ rotate: showRepositories ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FolderGit2 
              size={20} 
              className="text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>
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
      
      {/* GitHub Cards Container */}
      <div className="fixed left-0 right-0 z-10 transform translate-y-[75%]" 
           style={{ bottom: '12px' }}>
        <div className="p-4 flex gap-4 justify-center items-end max-w-7xl mx-auto">
          <GitHubContributions />
        </div>
      </div>
      
      {/* PopularRepositories Slide Panel */}
      <motion.div
        className="fixed top-[71px] right-4 z-40"
        initial={{ x: '100vw' }}
        animate={{ x: showRepositories ? '0%' : '100vw' }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          duration: 0.6
        }}
      >
        <div className="w-96">
          <PopularRepositories />
        </div>
      </motion.div>
      
      {/* Backdrop */}
      {showRepositories && (
        <motion.div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowRepositories(false)}
        />
      )}
      
      <FluidCursor />
    </div>
  );
}
