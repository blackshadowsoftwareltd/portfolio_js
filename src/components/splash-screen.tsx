'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { RESUME } from '@/constants/resume';
import { SPLASH_FREQUENCY, SPLASH_SESSION_KEY } from '@/constants/splash';

/**
 * Boot-sequence splash.
 *
 * Shown once per browser session (sessionStorage), skippable with any key or a
 * click. The log lines are derived from RESUME, so the numbers can never go
 * stale — empty out the CV and this degrades to sensible fallbacks rather than
 * printing blanks.
 *
 * A blocking inline script in layout.tsx sets data-splash="off" on <html> for
 * returning visitors, so the SSR markup is hidden before first paint instead of
 * flashing and then being torn down at hydration.
 */

const SESSION_KEY = SPLASH_SESSION_KEY;
const ONCE_PER_SESSION = SPLASH_FREQUENCY === 'session';

/**
 * useLayoutEffect warns when a component is server-rendered. On the client we
 * still want it (it runs before paint, so a repeat visitor never sees a frame
 * of the splash); on the server useEffect is a no-op stand-in.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Rust and Dart brand hues, lifted for legibility on a near-black ground.
const RUST = '#E4623F';
const DART = '#3DA9F5';
const OK = '#4ADE80';

const GLASS = {
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

const LINE_MS = 105;
const HOLD_MS = 320;
const REVEAL_MS = 620;

export default function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  // useReducedMotion() is null during SSR and the first client render. Branching
  // on it in JSX would make the server markup differ from the client's (the orbs
  // and the `initial` styles), which React reports as a hydration mismatch. Gate
  // it behind `mounted` so the first render matches on both sides, then adapt.
  const rm = mounted ? Boolean(reduceMotion) : false;
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const lines = useMemo(() => {
    const roles = RESUME.experience.length;
    const bullets = RESUME.experience.reduce((n, e) => n + e.highlights.length, 0);
    const groups = RESUME.skills.length;
    const stack = RESUME.tags.slice(0, 3).join(' · ');
    return [
      { label: 'identity', value: RESUME.name || 'portfolio' },
      { label: 'role', value: RESUME.title || 'software engineer' },
      { label: 'stack', value: stack || 'rust · flutter · ffi' },
      { label: 'skills', value: groups ? `${groups} groups` : 'loading' },
      { label: 'experience', value: roles ? `${roles} roles · ${bullets} shipped` : 'loading' },
      { label: 'chat', value: 'local model online' },
    ];
  }, []);

  const total = lines.length;

  const dismiss = useCallback(() => {
    setVisible(false);
    if (!ONCE_PER_SESSION) return;
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode — the splash simply shows again next load */
    }
  }, []);

  useEffect(() => setMounted(true), []);

  // Hide before paint for anyone who has already seen it this session.
  useIsomorphicLayoutEffect(() => {
    if (!ONCE_PER_SESSION) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') setVisible(false);
    } catch {
      /* ignore */
    }
  }, []);

  // Reduced motion: no theatre, just a beat and out.
  useEffect(() => {
    if (!visible || !reduceMotion) return;
    const t = setTimeout(dismiss, 500);
    return () => clearTimeout(t);
  }, [visible, reduceMotion, dismiss]);

  // Advance the boot log, then reveal, then leave.
  useEffect(() => {
    if (!visible || reduceMotion) return;
    if (step < total) {
      const t = setTimeout(() => setStep((s) => s + 1), LINE_MS);
      return () => clearTimeout(t);
    }
    const toReveal = setTimeout(() => setRevealed(true), HOLD_MS);
    const toExit = setTimeout(dismiss, HOLD_MS + REVEAL_MS + 480);
    return () => {
      clearTimeout(toReveal);
      clearTimeout(toExit);
    };
  }, [visible, reduceMotion, step, total, dismiss]);

  // Skip on any key or pointer, and lock scrolling while covering the page.
  useEffect(() => {
    if (!visible) return;
    const skip = () => dismiss();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      document.body.style.overflow = prev;
    };
  }, [visible, dismiss]);

  // With reduced motion we never advance `step`, so read through these two
  // instead: the card renders its completed state immediately.
  const shown = rm ? total : step;
  const isRevealed = rm ? true : revealed;
  const pct = Math.round((Math.min(shown, total) / total) * 100);
  const firstName = (RESUME.name || 'portfolio').split(' ')[0];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="splash"
          role="status"
          aria-label="Loading portfolio"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden px-4"
          style={{ background: '#06080B' }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: rm ? 1 : 1.03,
            filter: rm ? 'blur(0px)' : 'blur(12px)',
          }}
          transition={{ duration: rm ? 0.25 : 0.62, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Drifting orbs — the two halves of the stack, heavily blurred */}
          {!rm && (
            <>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute h-[26rem] w-[26rem] rounded-full"
                style={{ background: `radial-gradient(circle, ${RUST}30, transparent 70%)`, filter: 'blur(46px)' }}
                initial={{ x: '-38%', y: '-22%' }}
                animate={{ x: ['-38%', '-30%', '-38%'], y: ['-22%', '-14%', '-22%'] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute h-[24rem] w-[24rem] rounded-full"
                style={{ background: `radial-gradient(circle, ${DART}30, transparent 70%)`, filter: 'blur(46px)' }}
                initial={{ x: '36%', y: '24%' }}
                animate={{ x: ['36%', '28%', '36%'], y: ['24%', '16%', '24%'] }}
                transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
              />
            </>
          )}

          {/* Grid, faded out toward the edges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.13]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '46px 46px',
              maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 25%, transparent 78%)',
              WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 25%, transparent 78%)',
            }}
          />

          {/* Hairline loader pinned to the very top of the viewport */}
          <motion.div
            aria-hidden
            className="absolute top-0 left-0 h-px"
            style={{ background: `linear-gradient(90deg, ${RUST}, ${DART})` }}
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />

          {/* The card */}
          <motion.div
            className="relative w-[min(30rem,calc(100vw-2rem))] overflow-hidden rounded-2xl"
            style={GLASS}
            initial={rm ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            {/* One diagonal sheen sweep across the glass */}
            {!rm && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.13) 50%, transparent 62%)',
                }}
                initial={{ x: '-120%' }}
                animate={{ x: '120%' }}
                transition={{ duration: 1.5, delay: 0.35, ease: 'easeInOut' }}
              />
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: OK }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: OK }} />
                </span>
                <span className="font-mono text-[11px] tracking-wide text-neutral-400">
                  ~/{firstName.toLowerCase()}
                </span>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-neutral-500">
                {String(pct).padStart(3, ' ')}%
              </span>
            </div>

            {/* Boot log */}
            <div className="px-5 pt-4 pb-1 font-mono text-[12px] leading-[1.9]">
              <div className="mb-2 text-neutral-500">
                <span style={{ color: OK }}>$</span> ./portfolio --init
              </div>
              {lines.map((line, i) => (
                <motion.div
                  key={line.label}
                  className="flex items-baseline gap-2"
                  initial={rm ? false : { opacity: 0, y: 4 }}
                  animate={shown > i ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <span className="shrink-0 text-neutral-500">{line.label}</span>
                  <span className="min-w-0 flex-1 translate-y-[-3px] border-b border-dotted border-white/15" />
                  <span className="shrink-0 truncate text-neutral-300">{line.value}</span>
                  <motion.span
                    className="shrink-0"
                    style={{ color: OK }}
                    initial={rm ? false : { scale: 0, opacity: 0 }}
                    animate={shown > i ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 18, delay: rm ? 0 : 0.09 }}
                  >
                    ok
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* FFI bridge: rust node ──── dart node. Plain elements, not SVG —
                a viewBox this wide and short gets fitted by height and collapses. */}
            <div className="flex items-center gap-2 px-5 pt-4">
              <motion.span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: RUST, boxShadow: `0 0 10px ${RUST}` }}
                initial={rm ? false : { scale: 0 }}
                animate={shown >= total ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 460, damping: 20 }}
              />
              <div className="relative h-px flex-1 overflow-hidden">
                <motion.div
                  className="h-px w-full origin-left"
                  style={{ background: `linear-gradient(90deg, ${RUST}, ${DART})` }}
                  initial={rm ? false : { scaleX: 0 }}
                  animate={shown >= total ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: rm ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* a single packet crossing the bridge once it is up */}
                {!rm && shown >= total && (
                  <motion.div
                    className="absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white"
                    initial={{ left: '0%', opacity: 0 }}
                    animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
                  />
                )}
              </div>
              <motion.span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: DART, boxShadow: `0 0 10px ${DART}` }}
                initial={rm ? false : { scale: 0 }}
                animate={shown >= total ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 460, damping: 20, delay: rm ? 0 : 0.6 }}
              />
            </div>

            {/* Name resolving on the bridge */}
            <div className="px-5 pt-4 pb-6">
              <div className="overflow-hidden">
                <motion.h1
                  className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[1.75rem]"
                  initial={rm ? false : { y: '110%' }}
                  animate={isRevealed ? { y: '0%' } : { y: '110%' }}
                  transition={{ duration: rm ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
                >
                  {RESUME.name || 'Portfolio'}
                </motion.h1>
              </div>
              <motion.p
                className="mt-1.5 line-clamp-2 font-mono text-[11px] leading-relaxed text-balance text-neutral-400"
                initial={rm ? false : { opacity: 0 }}
                animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: rm ? 0 : 0.4, delay: rm ? 0 : 0.16 }}
              >
                {RESUME.headline || 'interactive portfolio'}
              </motion.p>
            </div>
          </motion.div>

          {/* Skip affordance */}
          <motion.button
            type="button"
            onClick={dismiss}
            className="absolute bottom-8 font-mono text-[11px] text-neutral-600 transition-colors hover:text-neutral-300 focus-visible:text-neutral-300 focus-visible:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            press any key to skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
