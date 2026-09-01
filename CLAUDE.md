# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # both package-lock.json and pnpm-lock.yaml exist; npm is what run.sh/Dockerfile use
npm run dev          # Next.js dev server on port 3000 (hardcoded via -p 3000)
npm run build        # production build
npm start            # serve the production build
npm run lint         # next lint
./run.sh             # installs deps if node_modules is missing, then npm run dev
```

There is no test framework, test script, or test file in this repo — do not assume one exists.

`next.config.ts` sets `eslint.ignoreDuringBuilds: true`, so `npm run build` will not surface lint errors. Run `npm run lint` explicitly.

## Environment

`GITHUB_TOKEN` in `.env.local` (git-ignored, not present in a fresh clone). Every GitHub-backed API route degrades gracefully without it — see "GitHub data routes" below. `dev.log` shows the app running entirely on mock data, which is the normal local state.

### Chat model

`/api/chat` defaults to a **local model served by Ollama**, not OpenAI. Ollama exposes an
OpenAI-compatible endpoint on `/v1`, so `src/app/api/chat/model.ts` points the existing
`@ai-sdk/openai` provider at it via `baseURL` — no extra dependency.

| var | default | notes |
| --- | --- | --- |
| `LLM_PROVIDER` | `ollama` | set to `openai` for the hosted model |
| `OLLAMA_BASE_URL` | `http://localhost:11434/v1` | |
| `OLLAMA_MODEL` | `qwen2.5:1.5b` | 1.5B, Q4_K_M, ~1 GB |
| `OPENAI_MODEL` | `gpt-4o-mini` | only when `LLM_PROVIDER=openai` |
| `OPENAI_API_KEY` | — | only when `LLM_PROVIDER=openai`, read implicitly by `@ai-sdk/openai` |

Start the model server with `ollama serve` (weights live in `~/.ollama/models`, outside this
repo; `.gitignore` also covers `*.gguf`, `/models/` and friends). The route health-checks
Ollama first and returns **503 with a readable message** when it is not running, rather than a
connection stack trace in the chat UI.

## Origin and identity

This project began as a rebrand of the open-source `toukoum/portfolio` AI-memoji portfolio (originally Raphaël Giraud's). **The upstream author's identity has been removed** — persona, biography, photos, project cards, resume PDF and credit links are all gone, along with the tools that only made sense for him (`getSport`, `getCrazy`, `getInternship`).

**`src/constants/resume.ts` is the single source of truth for personal data.** It holds Rimon Ahammad's CV — identity, summary, skills, experience, education, projects — and everything else reads from it:

- `src/app/api/chat/prompt.ts` composes the chat persona from `RESUME`, so the AI's answers can't drift from the rendered cards
- `src/constants/profile.ts`, `src/constants/projects.ts` re-export from it
- `presentation.tsx`, `skills.tsx`, `experience.tsx`, `resume.tsx`, `projects/AllProjects.tsx` all render from it

Add or correct a fact there, not in a component. The prompt explicitly instructs the model to say "I don't know" rather than invent anything absent from that file.

Residual inconsistency: the name is spelled both "Remon" (GitHub username `RemonAhammad`, Telegram, LinkedIn slug) and "Rimon" (display name). The username spellings are real account handles — don't "fix" them.

## Architecture

Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui (new-york, zinc, `@/*` → `src/*`). Client-heavy: nearly every component is `'use client'`.

### Two independent UIs

**`/` (`src/app/page.tsx`, ~1270 lines)** — the rebranded landing page. The original hero (memoji, "Ask me anything" input, five quick-question buttons) is still there but **commented out**; the live UI is `TerminalTyping` + `LiquidGlassButton` + `GitHubContributions` + a row of fixed glass buttons that slide panels in from the right.

Panel mechanics, all inside `page.tsx`:
- `BUTTON_CONFIG` declares the buttons; `calculateButtonPositions()` derives each `right:` offset from `BUTTON_SIZES` at module load. Adding or resizing a button shifts everything to its left automatically — but the panels read the same `BUTTON_POSITIONS` map, so button and panel stay aligned only if the `key` matches the `panel` field.
- Each panel is a separate `motion.div` with duplicated glass styling (backdrop-blur gradient, floating orbs, pulse rings, shimmer). Changing the glass look means editing every copy.
- Panels are mutually exclusive: the click handler resets all six `showX` states then sets one.
- Panel content is remounted on open via `key={showX ? 'open' : 'closed'}` to re-trigger entry animations.
- `page.tsx:312` computes the active flag with `eval(\`show${...}\`)` reading local `useState` variables. It works only because the state variable names are in scope at that point — renaming a state variable or moving the map breaks it silently at runtime, not at compile time.

**`/chat` (`src/components/chat/chat.tsx`)** — the inherited full-page chat, reached only by direct URL now that the landing page hosts the conversation inline in `center-chatbox.tsx`. Uses `useChat` from `@ai-sdk/react` and reads an initial `?query=` param. The talking-head memoji `<video>` was the upstream author's face and is gone; the avatar is now a monogram, so `videoRef` and `isTalking` are inert leftovers.

### Chat tool pipeline

Server (`src/app/api/chat/route.ts`) → `streamText` with the model from `model.ts` (Ollama by default), `maxSteps: 2`, `toolCallStreaming: true`. `SYSTEM_PROMPT` is `unshift`ed onto the incoming messages.

Wired tools: `getPresentation`, `getExperience`, `getProjects`, `getSkills`, `getResume`, `getContact`.

Tools do **not** return the content the user sees. Each tool in `src/app/api/chat/tools/` returns a short throwaway string; the actual UI is a React component picked by `toolName` in `src/components/chat/tool-renderer.tsx`. The system prompt reinforces this ("the tool already provides a response so you don't need to repeat the information").

Adding a chat tool therefore takes four edits:
1. new file in `src/app/api/chat/tools/`
2. import + entry in the `tools` object in `route.ts`
3. a `case` in `tool-renderer.tsx` mapping the name to a component
4. a line under "Tool Usage Guidelines" in `prompt.ts`

`getWeather.ts` exists but is deliberately not wired into `route.ts` — it's a leftover demo, useful as a template for a tool that takes parameters.

### GitHub data routes

Four routes under `src/app/api/`: `github-contributions`, `contribution-stats`, `popular-repositories`, `open-source-projects`. All are **POST** taking `{ username }` in the body (not GET with a query param), and all follow the same three-tier fallback:

`GITHUB_TOKEN` set → GitHub GraphQL/REST → no token → public API or unauthenticated REST → that fails → **generated mock data**.

Consequence: these endpoints always return 200 with plausible-looking data, so a broken token or wrong username shows up as fake repos rather than an error. Check the server console for `No GitHub token provided, returning mock ...`.

`contribution-stats` also fabricates parts of its response even on the authenticated path — `totalCommits`, `totalPRs`, `totalIssues`, and `recentActivity` are estimated/hardcoded, not fetched.

The username `RemonAhammad` is hardcoded in seven places (plus `constants/projects.ts`): `contribution-stats/route.ts`, `open-source-projects/route.ts`, `github-contributions.tsx`, `popular-repositories.tsx`, `constants/profile.ts`, and `GITHUB_CONFIG` in `constants/open-source.ts`. Change all of them together.

### Where content lives

Split, inconsistently:
- `src/constants/resume.ts` — **the CV: identity, summary, skills, experience, education, projects.** Everything personal comes from here
- `src/constants/profile.ts` — re-exports name/email/designation/socials from `RESUME` (drives `TerminalTyping`)
- `src/constants/projects.ts` — derives `projectsData` from `RESUME.projects` plus a category-colour helper
- `src/constants/tools.ts` — the tech-stack grid
- `src/constants/open-source.ts` — types, `GITHUB_CONFIG`, and sample fallback data

## Config quirks

- **Two ESLint configs.** `eslint.config.mjs` (flat, what Next 15 actually uses) and a legacy `.eslintrc.js` that references a `tailwind.config.js` which does not exist — Tailwind v4 is CSS-first, configured in `src/app/globals.css` via `@theme inline`. Editing `.eslintrc.js` has no effect.
- `next.config.ts` is a `.ts` file using CommonJS `module.exports`. It also sets `devIndicators: false` and allow-lists `images.unsplash.com` / `assets.aceternity.com`.
- `src/app/glob.css` is dead — only `globals.css` is imported.
- `src/app/test/` holds two scratch pages (carousel demo, styled title) that are routable in production.
- Theme is forced dark: `ThemeProvider` uses `defaultTheme="dark"` with `enableSystem={false}`, so a light-mode bug won't reproduce unless the class is toggled manually.
- Widespread `suppressHydrationWarning` — hydration mismatches are being suppressed rather than fixed, so genuine SSR/client divergence stays invisible.

## Deployment

`deploy.md` documents the live setup: VPS `159.198.32.51`, domain `portfolio.blackshadow.software`, Docker Compose (Next app + nginx reverse proxy on port 80), source synced from `/root/projects/portfolio_js` to `/var/www/portfolio` with rsync. Note the documented Dockerfile runs `npm run dev` in production, and its inline `next.config.js` differs from the repo's `next.config.ts` (adds `output: 'standalone'`, `images.unoptimized`, `typescript.ignoreBuildErrors`). None of those Docker files are committed to this repo — they live only on the server and in `deploy.md`.
