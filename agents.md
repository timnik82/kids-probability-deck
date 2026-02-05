# agents.md -- AI Agent Guidelines for EuroMillions Probability Learning App

## Project Overview

This is an interactive educational slide deck application that teaches probability and combinatorics concepts using the EuroMillions lottery as a real-world context. The app guides learners through 13 progressive slides covering probability fundamentals, combinatorics, lottery mechanics, simulations, and a final quiz assessment. It supports two languages (Russian and Portuguese) and runs entirely client-side with no backend data persistence.

---

## Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| Framework        | Next.js 14 (App Router)                        |
| Language         | TypeScript 5.2                                 |
| UI Library       | React 18.2                                     |
| Styling          | Tailwind CSS 3.3 + tailwindcss-animate         |
| Component System | shadcn/ui (Radix primitives)                   |
| Icons            | lucide-react                                   |
| Animations       | Framer Motion 11                               |
| Charts           | Recharts 2.12                                  |
| i18n             | next-intl 3.26                                 |
| State Management | React Context (DeckContext)                     |
| Deployment       | Netlify (via @netlify/plugin-nextjs)            |
| Database         | Supabase (credentials configured, not yet used) |

---

## Architecture

### Routing & Locale Structure

```
/                       -> redirects to /ru/deck
/[locale]               -> redirects to /[locale]/deck
/[locale]/deck          -> main slide deck (server page renders DeckClient)
```

- Locales: `ru` (Russian, default), `pt` (Portuguese)
- Locale routing handled by `middleware.ts` using next-intl
- Current slide tracked via URL query param `?s={slideIndex}`

### Component Hierarchy

```
RootLayout
  └─ [locale]/layout.tsx (NextIntlClientProvider)
      └─ deck/page.tsx (Server Component, sets locale)
          └─ DeckClient.tsx (Client, Suspense boundary)
              └─ DeckProvider (React Context for user ticket state)
                  └─ DeckShell (main layout: header, content area, footer)
                      ├─ LanguageSwitcher (header)
                      ├─ SlideRenderer (renders Slide0..Slide12 by index)
                      ├─ ProgressDots (footer navigation)
                      └─ Prev/Next buttons (footer)
```

### State Management

- **DeckContext** (`lib/deck-context.tsx`): stores the user's lottery ticket selection (`userMains: number[]`, `userStars: number[]`). Created in Slide 5, consumed in Slides 9 and 10.
- **Navigation state**: managed locally in `DeckShell` via `useState` + URL query param sync.
- **Slide-local state**: each slide manages its own interactive state (e.g., coin flip results, simulation counts, quiz answers).

### File Organization

```
app/                    # Next.js App Router pages and layouts
  [locale]/             # Dynamic locale segment
    deck/               # Deck route
components/
  Deck/                 # Deck-specific components (DeckShell, SlideRenderer, ProgressDots, LanguageSwitcher)
  ui/                   # shadcn/ui primitives (button, card, dialog, tabs, chart, etc.)
slides/                 # 13 slide components (Slide0Welcome .. Slide12Wrapup)
lib/                    # Shared utilities and logic
  deck-context.tsx      # React Context for cross-slide state
  probability.ts        # Combinatorics math (comb, ways, odds, prize tiers)
  simulate.ts           # Lottery draw simulation engine
  constants.ts          # TOTAL_SLIDES, SLIDE_PARAM
  utils.ts              # cn() utility (clsx + tailwind-merge)
hooks/                  # Custom React hooks
messages/               # Translation JSON files (ru.json, pt.json)
```

---

## Slides Overview (13 Total)

| Index | File                  | Topic                     | Key Features                                      |
| ----- | --------------------- | ------------------------- | ------------------------------------------------- |
| 0     | Slide0Welcome.tsx     | Welcome & language select | Language picker, intro animation                   |
| 1     | Slide1WhatIs.tsx      | What is EuroMillions?     | Explains 5-of-50 + 2-of-12 mechanics              |
| 2     | Slide2Draw.tsx        | How does a draw work?     | Interactive lottery draw simulation                |
| 3     | Slide3Playground.tsx  | Probability playground    | 3 tabs: coin flip, dice roll, bag draw             |
| 4     | Slide4Combinations.tsx| Order doesn't matter      | Visual proof that combinations ignore order        |
| 5     | Slide5Ticket.tsx      | Create your ticket        | User picks 5 numbers + 2 stars (saved to Context)  |
| 6     | Slide6HowMany.tsx     | How many tickets exist?   | Shows C(50,5) x C(12,2) = 139,838,160             |
| 7     | Slide7Jackpot.tsx     | Jackpot odds              | Interactive slider visualizing 1-in-X odds         |
| 8     | Slide8Prizes.tsx      | Prize tiers               | All prize tier probabilities with interactive view  |
| 9     | Slide9Simulation.tsx  | Lottery simulation        | Runs N draws against user ticket, Recharts bar chart|
| 10    | Slide10Special.tsx    | Do special numbers help?  | Birthday vs random -- odds are identical           |
| 11    | Slide11Quiz.tsx       | Quiz                      | 5-question assessment with scoring                 |
| 12    | Slide12Wrapup.tsx     | Summary                   | Key takeaways and responsible gambling message      |

---

## Math & Simulation Modules

### `lib/probability.ts`

- `MAIN_COUNT = 50`, `MAIN_PICK = 5`, `STAR_COUNT = 12`, `STAR_PICK = 2`
- `comb(n, k)` -- binomial coefficient
- `TOTAL_OUTCOMES = C(50,5) * C(12,2) = 139,838,160`
- `ways(k, s)` -- favorable outcomes for matching k mains and s stars
- `probability(k, s)` -- exact probability for a prize tier
- `oddsString(k, s)` -- human-readable odds string (e.g., "1 in 139,838,160")
- `PRIZE_TIERS` -- ordered array of [mains_matched, stars_matched] tuples

### `lib/simulate.ts`

- `drawOnce()` -- generates one random EuroMillions draw
- `countMatches(ticket, draw)` -- compares user ticket to a draw result
- `simulate(mains, stars, n)` -- runs n draws, returns `SimResult` object with match counts per tier
- `generateBirthdayTicket()` -- generates ticket using only numbers 1-31

---

## Coding Conventions

### General

- All slide and deck components use `"use client"` directive
- Slide components receive `goTo: (n: number) => void` as their only prop
- Translations accessed via `useTranslations('slide{N}')` from next-intl
- TypeScript strict mode; interfaces named `Props` within each component file
- Tailwind utility classes for all styling; no separate CSS modules

### Color Palette

- **Teal** (`teal-600`): primary actions, main lottery numbers
- **Amber** (`amber-500`): secondary actions, star numbers
- **Slate** (`slate-700`): body text
- **Rose/Emerald**: error/success feedback states
- **No purple/indigo/violet** used anywhere in the design

### Animation Patterns

- Framer Motion `motion.div` for slide transitions (fade + vertical slide)
- `AnimatePresence` for enter/exit animations
- Tailwind `animate-pulse`, `animate-bounce` for micro-interactions
- Hover states use `scale` transforms

### Naming Conventions

- Component files: PascalCase (`DeckShell.tsx`, `SlideRenderer.tsx`)
- Slide files: `Slide{Index}{Name}.tsx`
- Utility files: camelCase (`probability.ts`, `simulate.ts`)
- Translation keys: `slide0`, `slide1`, ... `slide12` (nested objects)

---

## Key Patterns for AI Agents

### Adding a New Slide

1. Create `slides/Slide{N}{Name}.tsx` with `"use client"` and `Props` interface containing `goTo`
2. Add translation keys under `slide{N}` in both `messages/ru.json` and `messages/pt.json`
3. Update `TOTAL_SLIDES` in `lib/constants.ts`
4. Add the import and case to `components/Deck/SlideRenderer.tsx`

### Modifying Probability Logic

- All math lives in `lib/probability.ts` -- pure functions, no side effects
- Simulation engine is in `lib/simulate.ts` -- also pure, stateless
- Changes to lottery rules (number ranges, pick counts) require updating constants in `probability.ts` and corresponding translations

### Adding a New Language

1. Create `messages/{locale}.json` with the same key structure as `ru.json`
2. Update `middleware.ts` locale list and `i18n.ts` loader
3. Update `generateStaticParams()` in `app/[locale]/deck/page.tsx`
4. Add the new locale option to `LanguageSwitcher.tsx`

### Working with User State

- Read/write user ticket via `useDeck()` hook from `lib/deck-context.tsx`
- Context provides `userMains`, `userStars`, `setUserMains`, `setUserStars`
- Only Slide 5 writes to context; Slides 9 and 10 read from it

### Adding Backend Features (Supabase)

- Supabase client credentials exist in `.env` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `@supabase/supabase-js` is installed but no client instance is created yet
- To add persistence: create a Supabase client singleton in `lib/supabase.ts`, then use it in slide components or a new API layer
- Database migrations should use the Supabase MCP tools

### UI Components

- All base UI components are in `components/ui/` (shadcn/ui)
- Use existing shadcn components before installing new ones
- Deck-specific components go in `components/Deck/`
- Charts use Recharts (already configured with shadcn chart wrapper)

---

## Environment Variables

| Variable                          | Purpose                       |
| --------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anonymous/public key |

Both are `NEXT_PUBLIC_` prefixed, meaning they are available client-side.

---

## Build & Deployment

- **Build**: `npm run build` (Next.js production build)
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`)
- **Lint**: `npm run lint` (`next lint`)
- **Deploy target**: Netlify (configured via `netlify.toml` and `@netlify/plugin-nextjs`)
- **Image optimization**: disabled (`unoptimized: true` in `next.config.mjs`)
- **ESLint**: ignored during builds (`ignoreDuringBuilds: true`)

---

## Constraints & Guardrails

- The app is purely client-side; no server actions, API routes, or edge functions exist yet
- All lottery math must remain accurate to real EuroMillions rules
- Translations must stay in sync across all locale files (same key structure)
- Slide count is defined in `lib/constants.ts` and must match the actual number of slide components
- The `goTo` callback is the only way slides communicate navigation intent to the shell
- No external API calls are made; all computation happens in the browser
