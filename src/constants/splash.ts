/**
 * How often the splash screen plays.
 *
 *   'always'  — on every full page load. What you want while building, since a
 *               hard refresh (Cmd+Shift+R) does NOT clear sessionStorage, so
 *               'session' would hide it for the rest of the tab's life.
 *   'session'  — once per browser tab session. Kinder to real visitors, who
 *               otherwise sit through it on every reload.
 *
 * Defaults to 'always' in development and 'session' in production. Replace the
 * whole expression with a literal to force one everywhere, e.g.
 *   export const SPLASH_FREQUENCY: SplashFrequency = 'always';
 *
 * Both readers honour this: the component below and the pre-paint inline script
 * in src/app/layout.tsx.
 */
export type SplashFrequency = 'always' | 'session';

export const SPLASH_FREQUENCY: SplashFrequency =
  process.env.NODE_ENV === 'production' ? 'session' : 'always';

export const SPLASH_SESSION_KEY = 'rimon:splash';
