# Tablet-Focused Frontend Design Prompt

Use this prompt for the new `frontend-design` pass that specifically targets the 10.9-inch tablet experience.

```text
Review and improve this repo’s existing UI with a tablet-first focus.

Project context:
- This is a localized Next.js slide-based learning app for kids about 10 years old.
- It teaches basic probability and lotteries through a deck/slideshow format.
- The primary experience is in `app/[locale]/deck`.
- Core deck UI lives in `components/Deck/`.
- Slides live in `slides/`.
- Locale support must remain intact for `ru` and `pt`.

Primary design requirement:
- Optimize mostly for a 10.9-inch tablet in landscape mode, especially iPad Pro 10.9.
- This is now the main target device.
- Other screen sizes should remain usable, but the tablet landscape experience is the priority.

What I observed in real testing:
- Some buttons and UI elements feel too large on the tablet.
- Some layouts feel too loose / oversized rather than proportionate to the screen.
- I want a denser, more balanced layout without making it feel cramped or less kid-friendly.

Your task:
- Review the current deck UI and propose/implement design refinements specifically for the 10.9-inch iPad landscape experience.
- Focus on sizing, spacing, visual density, hierarchy, and slide composition.
- Reduce oversized buttons, controls, cards, and decorative elements where appropriate.
- Keep the app playful, clear, and inviting for kids around 10 years old.
- Preserve the existing deck flow and locale support.
- Do not do broad architecture refactors unless absolutely necessary for the design changes.

Design goals:
- Feels intentional and polished on 10.9-inch tablet landscape
- Better proportioned controls and slide content
- Strong readability for children around age 10
- Clear visual hierarchy
- Less oversized UI, but still comfortable touch targets
- Consistent slide-to-slide rhythm and spacing

Guardrails:
- Avoid generic “shrink everything” changes
- Keep touch interactions comfortable
- Do not regress educational clarity
- Do not break navigation or slide logic
- Preserve the app’s personality

Deliverables:
- Identify the most important tablet-specific UI problems
- Implement the highest-value design fixes
- Explain the main design decisions
- Note any remaining issues that should be handled in the later accessibility/UX pass

Additional context:
- Please also consult `SKILL_IMPLEMENTATION_PLAN.md` at the repo root for the agreed sequencing, assumptions, target device, and audience constraints.
- For this pass, implement only the tablet-first frontend design portion of that plan.
```
