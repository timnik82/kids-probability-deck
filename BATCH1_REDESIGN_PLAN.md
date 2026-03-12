# Batch 1 Fresh-Session Plan: Slides 1, 2, 4, and 6

## Summary

The fresh session should continue on the existing `design` branch and extend the `Playful Science Lab` design system to Batch 1 only: Slide 1, Slide 2, Slide 4, and Slide 6.

Use the same skills in this order:
`brainstorming` -> `frontend-design` -> `requesting-code-review`

Do not merge the branch after Batch 1.

## Key Changes

- Reuse the existing shell-level design system and extend it only when repetition clearly justifies it.
- Keep routing, locale flow, state shape, and slide prop contracts unchanged.
- Allow small copy/message updates only when needed for the redesigned layouts.
- Slide 1 should become the “specimen board” explanation of how the lottery works.
- Slide 2 should become a “two machines in the lab” draw experience while preserving current draw/reset behavior.
- Slide 4 should become a tactile combinations lesson that visually proves order does not matter.
- Slide 6 should become a memorable multiplication reveal for the total number of tickets.
- Keep motion short and purposeful.
- Do not redesign slides 0, 3, or 5 in this batch except for tiny consistency fixes caused by shared styles.

## Public Interfaces / Types

- No route changes.
- No data-model or math changes.
- No slide prop changes.
- Message-file changes are allowed only for small Batch 1 labels or supporting lines.

## Test Plan

- Verify slides 1, 2, 4, and 6 visually match the redesigned shell and anchor slides.
- Check `ru` and `pt` rendering for any new or adjusted message keys.
- Confirm Slide 2 draw/reset behavior is unchanged.
- Confirm Slide 4 pair selection and Slide 6 math reveal still behave correctly.
- Validate mobile and desktop layouts.
- Run `npm run typecheck`, `npm run lint`, and `npm run build`.
- Finish with a `requesting-code-review` pass before the next PR review round.

## Assumptions

- Continue on `design`.
- Scope is `Visual + small copy`.
- Batch membership is fixed to slides 1, 2, 4, and 6.
- The fresh session should use the current shell plus slides 0, 3, and 5 as the style reference.

## Future Batches

- Batch 2 should cover slides 7, 8, and 9, focusing on odds, prize tiers, and simulation visuals.
- Batch 3 should cover slides 10, 11, and 12, focusing on the final concept slides, quiz polish, and end-of-lesson consistency.
- After Batch 3, do one full-deck consistency, accessibility, and responsive review before merge.
