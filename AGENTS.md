# App Overview

Kids Probability Deck is a localized Next.js slide-based learning app for kids around 10 years old to learn basic probability theory and understand how lotteries work through a lottery-style example.

# Stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- `next-intl` for `ru` and `pt`
- Deck UI in `components/Deck/`
- Slides in `slides/`

# Structure

- `app/[locale]/deck` renders the deck experience
- `components/Deck/DeckShell.tsx` owns layout and slide navigation
- `components/Deck/SlideRenderer.tsx` maps slide index to slide component
- `lib/deck-context.tsx` stores cross-slide ticket state

# Notes

- The app is presentation-first and mostly client-side
- The main work is usually UI/design changes, slide interactions, and educational clarity
- Prefer preserving the slide/deck flow and locale support when editing

# MCPs

## When external knowledge is needed, choose the MCP source by question type.

Use `Context7` for known libraries, frameworks, or SDKs when the task is implementation-specific and you want package-scoped docs and examples quickly. Use `Ref` when you need authoritative documentation, exact API behavior, or the correct official page and section. Use `EXA` when the task is broader or more exploratory, including web discovery, current information, comparisons, cross-source code examples, or multi-source research.

## Selection rules:

1. Known package + “how do I implement/configure this?” -> `Context7`
2. “Find the official docs / exact API behavior / standards guidance” -> `Ref`
3. “Research this / compare options / find recent info / gather examples” -> `EXA`
4. If `Context7` is too narrow, use `Ref`
5. If `Ref` is precise but incomplete, expand with `EXA`