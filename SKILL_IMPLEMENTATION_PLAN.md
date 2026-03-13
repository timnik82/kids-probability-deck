# Skill Implementation Plan

This plan sequences the most useful skill passes for this repo after the initial `frontend-design` review.

Assumptions:
- The current priority is improving the existing slide deck, not adding major new product scope.
- We want the strongest return from a small number of high-signal skill passes.
- The app is intended for kids about 10 years old, so educational clarity, pacing, and visual friendliness should be judged for that age group.
- The app should be mostly optimized for 10.9-inch tablets in landscape mode, especially the iPad Pro 10.9 form factor.
- The app should preserve deck flow, locale support, and kid-friendly clarity while improving UX and code quality.

## PR Delivery Model

- [ ] Treat each major implementation phase as one PR when the scope stays coherent
- [ ] Start each PR from the latest `main`
- [ ] Keep PRs sequential rather than stacked unless there is a strong reason to overlap work
- [x] Use the phase skill at the start of the branch, then implement only the accepted findings for that phase
- [ ] Run lint, typecheck, and manual deck QA before opening each PR
- [ ] Run `requesting-code-review` before merging each substantive PR
- [ ] Use `systematic-debugging` inside a phase PR when bugs are discovered, not necessarily as a separate PR

Working rule:
- A phase should usually map to one PR, but only if the changes feel like one reviewable unit
- If a phase produces two very different classes of change, split it into two PRs

## Recommended PR Sequence

### PR 1: Tablet-First Frontend Design Revisions

- [x] Branch name: `phase/tablet-frontend-design`
- [x] Primary skill: `frontend-design`
- [x] Suggested PR title: `Refine deck UI for 10.9-inch iPad landscape experience`
- [x] Scope: revisit sizing, spacing, visual density, button scale, slide composition, and overall tablet ergonomics for the 10.9-inch iPad landscape target
- [x] Keep within scope: visual design corrections driven by the missed tablet requirement
- [x] Avoid in this PR: accessibility audit cleanup, routing work, or React architecture changes

Merge criteria:
- [x] Buttons and key controls feel appropriately sized for tablet use, not oversized
- [x] Slide layouts feel balanced on the 10.9-inch iPad in landscape
- [x] The deck keeps its visual personality while fitting the primary device better
- [x] The changes are still understandable and inviting for kids around 10 years old

### PR 2: UX, Accessibility, And Tablet-First Polish

- [ ] Branch name: `phase/ux-tablet-accessibility`
- [ ] Primary skill: `web-design-guidelines`
- [ ] Suggested PR title: `Improve deck UX, accessibility, and iPad landscape experience`
- [ ] Scope: readability, spacing, hierarchy, touch targets, responsiveness, age-appropriate clarity, and tablet-first layout tuning
- [ ] Keep within scope: visual and interaction polish across slides and deck navigation
- [ ] Avoid in this PR: framework refactors, context reshaping, or architecture changes

Merge criteria:
- [ ] The deck feels strong on a 10.9-inch iPad in landscape
- [ ] The content is clear and friendly for kids around 10 years old
- [ ] Navigation and controls are easy to use across the full deck
- [ ] No major accessibility regressions are left open

### PR 3: Next.js Structure And Locale Hygiene

- [ ] Branch name: `phase/nextjs-architecture-cleanup`
- [ ] Primary skill: `next-best-practices`
- [ ] Suggested PR title: `Clean up Next.js routing, layout, and locale boundaries`
- [ ] Scope: App Router structure, locale layout flow, rendering boundaries, and maintainability improvements
- [ ] Keep within scope: route organization, layout ownership, and framework correctness
- [ ] Avoid in this PR: broad UI redesign or React state refactors unless required by a clean Next.js fix

Merge criteria:
- [ ] Locale-aware routing remains correct
- [ ] Client and server responsibilities are intentional
- [ ] Deck entry points and layouts are easier to reason about
- [ ] No framework-level regressions appear in the main deck flow

### PR 4: React State And Rendering Performance

- [ ] Branch name: `phase/react-deck-performance`
- [ ] Primary skill: `vercel-react-best-practices`
- [ ] Suggested PR title: `Improve deck rendering and shared state performance`
- [ ] Scope: `DeckShell`, `SlideRenderer`, `deck-context`, and any related rerender or state ownership issues
- [ ] Keep within scope: render behavior, cross-slide state updates, and maintainability of the deck runtime
- [ ] Avoid in this PR: unrelated CSS cleanup or Next.js route changes

Merge criteria:
- [ ] Shared ticket state remains correct across slides
- [ ] Slide transitions and interactions stay predictable
- [ ] Obvious unnecessary rerenders are reduced
- [ ] The resulting state flow is simpler to maintain

### PR 5: Optional Composition Refactor

- [ ] Branch name: `phase/component-composition-refactor`
- [ ] Primary skill: `vercel-composition-patterns`
- [ ] Suggested PR title: `Refactor deck components for cleaner composition`
- [ ] Scope: only proceed if the earlier phases reveal repetitive or rigid component APIs
- [ ] Keep within scope: component API design, wrappers, and reusable deck composition patterns
- [ ] Skip this PR if the current component structure is already easy to extend

Merge criteria:
- [ ] The refactor clearly simplifies future slide or deck work
- [ ] The component APIs are easier to reason about than before
- [ ] No behavior regressions are introduced

### Final Review Gate

- [ ] Primary skill: `requesting-code-review`
- [ ] Run after each major PR and once more before declaring the overall initiative complete
- [ ] Treat this as a merge gate, not a separate feature PR, unless the review reveals a coherent follow-up fix set

Merge criteria:
- [ ] No unresolved high-severity findings remain
- [ ] Remaining risks are documented and acceptable
- [ ] The branch is ready to merge cleanly into `main`

## Phase 0: Baseline

- [x] Run `frontend-design`
- [x] Review the repo structure and identify likely follow-up skill passes
- [x] Run a second `frontend-design` pass with the explicit 10.9-inch iPad landscape requirement
- [ ] Capture any unresolved design notes from the `frontend-design` pass in `docs/` if they are not already documented

## Phase 1: Tablet-First Frontend Design Revisions

- [x] Run `frontend-design` again with the explicit 10.9-inch iPad landscape target
- [x] Review button sizes, spacing, visual density, and oversized UI elements on tablet
- [x] Tune slide composition for a better landscape balance on the 10.9-inch iPad
- [x] Preserve a playful, age-appropriate feel for kids around 10 years old while reducing oversized elements
- [x] Turn accepted findings into a focused tablet-first polish PR

Why this phase:
- The original design pass did not include the primary device requirement
- Real tablet testing already revealed that some controls and elements are too large
- This is the fastest way to correct the design baseline before other review passes build on top of it

Exit criteria:
- The primary tablet layout feels proportionate and intentional
- Large buttons and oversized elements have been corrected without hurting clarity

## Phase 2: UX And Accessibility Validation

- [ ] Run `web-design-guidelines`
- [ ] Review slide readability, contrast, hierarchy, tap targets, keyboard flow, and responsive behavior
- [ ] Verify the deck still feels clear, friendly, and age-appropriate for kids around 10 years old
- [ ] Prioritize the 10.9-inch iPad landscape experience while keeping other screen sizes usable
- [ ] Turn accepted findings into concrete UI fixes

Why this phase:
- `web-design-guidelines` is the best complement to `frontend-design`
- It helps catch accessibility and usability gaps that a visual design pass may miss

Exit criteria:
- Core deck interactions are accessible and understandable
- Mobile and desktop presentation quality is acceptable

## Phase 3: Next.js And App Architecture Pass

- [ ] Run `next-best-practices`
- [ ] Review App Router structure, locale routing, and client/server boundaries
- [ ] Check whether `app/[locale]/deck`, `DeckClient`, and layout files follow clean Next.js patterns
- [ ] Apply only the changes that improve maintainability without disrupting the deck flow

Why this phase:
- This repo is a localized Next.js App Router app
- A framework-specific pass is the fastest way to catch routing, rendering, and structure issues early

Exit criteria:
- Locale-aware routing is sound
- Rendering boundaries are intentional
- No obvious framework-level anti-patterns remain

## Phase 4: React Performance And State Review

- [ ] Run `vercel-react-best-practices`
- [ ] Review `components/Deck/DeckShell.tsx`
- [ ] Review `components/Deck/SlideRenderer.tsx`
- [ ] Review `lib/deck-context.tsx`
- [ ] Check for unnecessary rerenders, over-broad client state, and slide-to-slide update churn
- [ ] Implement the highest-value performance and maintainability improvements

Why this phase:
- The app is presentation-first and mostly client-side
- The deck shell, slide renderer, and shared ticket state are the most likely places for React-level issues

Exit criteria:
- State ownership is clear
- Cross-slide updates are predictable
- No obvious performance hotspots remain in the main deck flow

## Phase 5: Component API Cleanup If Needed

- [ ] Run `vercel-composition-patterns` only if component APIs feel repetitive, rigid, or hard to extend
- [ ] Evaluate whether slide wrappers or deck controls would benefit from cleaner composition
- [ ] Refactor only if the payoff is real and the change will simplify future slide work

Why this phase:
- This is a conditional pass, not a default one
- It is valuable when component structure starts slowing future design or content changes

Exit criteria:
- Skip this phase if current component structure is already easy to work with
- If used, component APIs should become simpler and more extensible

## Phase 6: Bug Hunt And Stability Pass

- [ ] Run `systematic-debugging` if any navigation, locale, simulation, or interaction bugs appear during earlier phases
- [ ] Reproduce issues with exact steps
- [ ] Fix root causes instead of patching symptoms
- [ ] Re-test affected slides and deck transitions

Why this phase:
- This skill is best used as soon as concrete bugs show up
- It keeps us from treating symptoms as isolated UI issues

Exit criteria:
- Known bugs are reproducible, explained, fixed, and rechecked

## Phase 7: Final Review Before Shipping

- [ ] Run `requesting-code-review`
- [ ] Prioritize bugs, regressions, missing tests, and risky edge cases
- [ ] Address findings or explicitly accept low-priority risks
- [ ] Confirm the final state is ready for merge or handoff

Why this phase:
- This gives us a quality pass with a review mindset rather than another implementation mindset
- It is the best final gate before calling the work complete

Exit criteria:
- No unresolved high-severity findings remain
- Remaining risks are documented and acceptable

## Optional Phase: Security Review

- [ ] Run `security-best-practices` only if Supabase usage expands or the app starts handling meaningful user data

Why this phase:
- Security is lower priority for the current presentation-first deck
- It becomes more important if persistence, auth, or sensitive data handling grows

## Recommended Sequence

- [ ] `frontend-design`
- [x] PR 1 with `frontend-design` again, this time explicitly targeting the 10.9-inch iPad in landscape
- [ ] PR 2 with `web-design-guidelines`
- [ ] PR 3 with `next-best-practices`
- [ ] PR 4 with `vercel-react-best-practices`
- [ ] PR 5 with `vercel-composition-patterns` if needed
- [ ] Use `systematic-debugging` inside any PR where bugs appear
- [ ] Run `requesting-code-review` before each merge
- [ ] Run `security-best-practices` only if scope expands

## Definition Of Done

- [ ] The deck looks intentional and polished
- [ ] The deck is accessible and easy for kids to follow
- [ ] Locale-aware routing and rendering are clean
- [ ] Shared state and slide rendering are maintainable
- [ ] No major known bugs remain
- [ ] A final review pass is completed before merge
