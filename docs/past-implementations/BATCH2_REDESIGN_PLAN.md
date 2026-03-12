# Batch 2 Fresh-Session Plan: Slides 7, 8, and 9

## Summary

The fresh session should continue on the existing `design` branch and extend the current `Playful Science Lab` design system to Batch 2 only: Slide 7, Slide 8, and Slide 9.

Use the same skills in this order:
`brainstorming` -> `frontend-design` -> `requesting-code-review`

Do not merge the branch after Batch 2.

## Key Changes

- Reuse the existing shell-level design system and the completed Batch 1 language before adding new shared abstractions.
- Keep routing, locale flow, deck context usage, simulation logic, chart inputs, and slide prop contracts unchanged.
- Allow small copy/message updates only when they support clearer Batch 2 layouts or labels.
- Slide 7 should become an “odds observatory” or “searchlight in a giant crowd” experience that makes `1 in 139,838,160` feel emotionally memorable.
- Slide 7 should preserve the current four stop values and the slider-based interaction, but make each stop feel like a stronger visual scale jump.
- Slide 8 should become a “prize ladder / prize control panel” that helps kids compare prize tiers, odds, and match combinations without changing the current odds math.
- Slide 8 should make the currently selected `(mains, stars)` state more obvious and visually separate “prize tier” from “no prize” outcomes.
- Slide 9 should become a “simulation lab console” centered on the child’s ticket, the run buttons, and the chart result, while preserving the existing simulation counts and no-ticket fallback behavior.
- Slide 9 should treat the chart and result summary as the hero moment, not just a default card dropped under buttons.
- Keep motion short and purposeful.
- Do not redesign slides 6, 10, 11, or 12 in this batch except for tiny consistency fixes caused by shared styles.

## Public Interfaces / Types

- No route changes.
- No data-model, odds, prize-tier, or simulation changes.
- No slide prop changes.
- No changes to draw-count presets in Slide 9.
- Message-file changes are allowed only for small Batch 2 labels, state text, or supporting lines.

## Test Plan

- Verify slides 7, 8, and 9 visually match the redesigned shell and the completed Batch 1 slides.
- Check `ru` and `pt` rendering for any new or adjusted message keys.
- Confirm Slide 7 still uses the same stop values and explanatory states.
- Confirm Slide 8 still calculates prize / no-prize states and odds correctly for the selected `(mains, stars)` combination.
- Confirm Slide 9 still blocks simulation when no valid ticket exists and still runs the same preset simulation counts.
- Confirm the chart still renders correctly after the redesign and remains readable on mobile.
- Validate mobile and desktop layouts.
- Run `npm run typecheck`, `npm run lint`, and `npm run build`.
- Finish with a `requesting-code-review` pass before the next PR review round.

## Assumptions

- Continue on `design`.
- Scope is `Visual + small copy`.
- Batch membership is fixed to slides 7, 8, and 9.
- The fresh session should use the current shell and completed slides 0 through 6 as the direct style reference.
- The redesign should keep the educational pacing intact: Slide 7 explains scale, Slide 8 explains prize structure, and Slide 9 turns that understanding into an experiment.

## Future Batches

- Batch 3 should cover slides 10, 11, and 12, focusing on the final concept slides, quiz polish, and end-of-lesson consistency.
- After Batch 3, do one full-deck consistency, accessibility, responsive, and copy review before merge.
