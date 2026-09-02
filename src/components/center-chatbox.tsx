'use client';

import { useChat } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  BriefcaseBusiness,
  Laugh,
  Layers,
  PartyPopper,
  Plus,
  Sparkles,
  TerminalSquare,
  Square,
  UserRoundSearch,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PROFILE_DATA } from '@/constants/profile';

/* ---------- suggestion chips ---------- */
const SUGGESTIONS = [
  {
    key: 'Me',
    color: '#329696',
    icon: Laugh,
    query: 'Who are you? I want to know more about you.',
  },
  {
    key: 'Projects',
    color: '#3E9858',
    icon: BriefcaseBusiness,
    query: 'What are your projects? What are you working on right now?',
  },
  {
    key: 'Skills',
    color: '#856ED9',
    icon: Layers,
    query: 'What are your skills? Give me a list of your soft and hard skills.',
  },
  {
    key: 'Fun',
    color: '#B95F9D',
    icon: PartyPopper,
    query: 'What is the craziest thing you have ever done? What are your hobbies?',
  },
  {
    key: 'Contact',
    color: '#C19433',
    icon: UserRoundSearch,
    query: 'How can I reach you? What kind of work are you looking for?',
  },
] as const;

const MAX_TEXTAREA_HEIGHT = 160;

/* ---------- shared glass surface ---------- */
const GLASS_SURFACE = {
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
} as const;

const GLASS_CONTROL = {
  background: `
    linear-gradient(135deg,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0.10) 50%,
      rgba(255, 255, 255, 0.25) 100%
    )
  `,
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: `
    0 4px 16px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.35)
  `,
} as const;

export default function CenterChatbox() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
    setMessages,
    error,
  } = useChat({ api: '/api/chat' });

  const hasConversation = messages.length > 0;

  // Grow with the content the way a chat composer does, then scroll.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [input]);

  // Follow the stream as tokens land.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    scroller.scrollTop = scroller.scrollHeight;
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter starts a new line.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  const startNewChat = () => {
    stop();
    setMessages([]);
    setInput('');
    textareaRef.current?.focus();
  };

  const canSend = input.trim().length > 0 && !isLoading;
  const awaitingFirstToken =
    isLoading && messages[messages.length - 1]?.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-20 w-full max-w-2xl"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Greeting — only before the first message */}
      {!hasConversation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 text-center"
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
            <TerminalSquare size={13} className="text-neutral-600 dark:text-neutral-300" />
            <span className="font-mono text-xs font-medium text-neutral-600 dark:text-neutral-300">
              ~/{PROFILE_DATA.name.split(' ')[0].toLowerCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
            Ask me anything
          </h1>
          <p className="mt-1.5 font-mono text-xs text-neutral-600 sm:text-sm dark:text-neutral-400">
            <span className="text-emerald-600 dark:text-emerald-400">$</span> ask
            --about{' '}
            <span className="text-neutral-900 dark:text-neutral-200">
              rust,flutter,ffi
            </span>
          </p>
        </motion.div>
      )}

      {/* Conversation + composer, all in one card */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-3xl"
        style={GLASS_SURFACE}
        animate={{
          boxShadow: isFocused
            ? `
              0 25px 50px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(34, 197, 94, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              inset 0 -1px 0 rgba(255, 255, 255, 0.15)
            `
            : GLASS_SURFACE.boxShadow,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Animated background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <motion.div
            className="absolute h-24 w-24 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent)',
              top: '8%',
              left: '6%',
            }}
            animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute h-20 w-20 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent)',
              bottom: '10%',
              right: '10%',
            }}
            animate={{ scale: [1, 1.4, 1], x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Pulse rings idle on an empty box; they would fight the text once a
              conversation is running. */}
          {!hasConversation && (
            <>
              <motion.div
                className="absolute top-1/2 left-1/2 h-4 w-4 rounded-full border-2 border-green-400 opacity-30"
                animate={{ scale: [1, 10], opacity: [0.3, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 h-4 w-4 rounded-full border-2 border-blue-400 opacity-20"
                animate={{ scale: [1, 8], opacity: [0.2, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
              />
            </>
          )}

          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: isHovered || isFocused ? 0.35 : 0,
              background: [
                `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)`,
                `radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)`,
                `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 70%)`,
              ],
            }}
            transition={{
              opacity: { duration: 0.3 },
              background: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        {/* Glass reflection */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
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

        <div className="relative z-10">
          {/* Conversation header */}
          {hasConversation && (
            <div className="flex items-center justify-between border-b border-white/15 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full bg-green-400 ${
                      isLoading ? 'animate-ping opacity-75' : 'opacity-0'
                    }`}
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  {isLoading ? 'Thinking…' : 'Conversation'}
                </span>
              </div>

              <motion.button
                type="button"
                onClick={startNewChat}
                className="group flex items-center gap-1.5 overflow-hidden rounded-xl px-2.5 py-1.5"
                style={GLASS_CONTROL}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Plus size={13} className="text-neutral-700 dark:text-neutral-300" />
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  New chat
                </span>
              </motion.button>
            </div>
          )}

          {/* Messages */}
          {hasConversation && (
            <div
              ref={scrollRef}
              className="max-h-[45dvh] space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      message.role === 'user'
                        ? 'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed text-neutral-800 dark:text-neutral-100'
                        : 'max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap text-neutral-700 dark:text-neutral-200'
                    }
                    style={message.role === 'user' ? GLASS_CONTROL : undefined}
                  >
                    {message.content}

                    {/* Only reachable when the provider actually emits tool
                        calls; the local 1.5B model answers in prose. */}
                    {message.toolInvocations?.map((invocation) => (
                      <span
                        key={invocation.toolCallId}
                        className="mt-1 mr-1 inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-300"
                      >
                        <Sparkles size={11} />
                        {invocation.toolName}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {awaitingFirstToken && (
                <div className="flex justify-start">
                  <div className="flex gap-1 py-2">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-neutral-500 dark:bg-neutral-400"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: dot * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-300/40 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
                  {error.message || 'Something went wrong. Please try again.'}
                </div>
              )}
            </div>
          )}

          {/* Composer */}
          <form
            className={`p-3 sm:p-4 ${hasConversation ? 'border-t border-white/15' : ''}`}
            onSubmit={handleSubmit}
          >
            <label htmlFor="portfolio-chat-input" className="sr-only">
              Ask a question
            </label>
            <textarea
              id="portfolio-chat-input"
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                hasConversation
                  ? 'Reply…'
                  : 'Ask about my projects, skills, or experience…'
              }
              className="w-full resize-none bg-transparent px-2 py-2 text-base leading-relaxed text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-400"
            />

            <div className="mt-1 flex items-center justify-between gap-3 px-2">
              <span className="hidden text-xs text-neutral-500 sm:block dark:text-neutral-400">
                <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-sans">
                  Enter
                </kbd>{' '}
                to send ·{' '}
                <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-sans">
                  Shift + Enter
                </kbd>{' '}
                for a new line
              </span>

              {isLoading ? (
                <motion.button
                  type="button"
                  onClick={stop}
                  aria-label="Stop generating"
                  className="group relative ml-auto flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                  style={GLASS_CONTROL}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <Square
                    size={14}
                    strokeWidth={2}
                    className="relative z-10 fill-current text-neutral-700 dark:text-neutral-300"
                  />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={!canSend}
                  aria-label="Send message"
                  className="group relative ml-auto flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl disabled:cursor-not-allowed disabled:opacity-40"
                  style={GLASS_CONTROL}
                  whileHover={canSend ? { scale: 1.05 } : undefined}
                  whileTap={canSend ? { scale: 0.95 } : undefined}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <ArrowUp
                    size={18}
                    strokeWidth={2}
                    className="relative z-10 text-neutral-700 transition-colors duration-200 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white"
                  />
                </motion.button>
              )}
            </div>
          </form>
        </div>
      </motion.div>

      {/* Suggestion chips — only on an empty conversation */}
      {!hasConversation && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-4 flex flex-wrap justify-center gap-2"
        >
          {SUGGESTIONS.map(({ key, color, icon: Icon, query }) => (
            <motion.button
              key={key}
              type="button"
              onClick={() => append({ role: 'user', content: query })}
              className="group flex items-center gap-2 overflow-hidden rounded-2xl px-3 py-2"
              style={GLASS_CONTROL}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <Icon size={15} strokeWidth={2} color={color} />
              <span className="text-xs font-medium text-neutral-700 transition-colors duration-200 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
                {key}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
