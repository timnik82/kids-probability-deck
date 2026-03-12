# Batch 3 Fresh-Session Plan: Slides 10, 11, 12, and Final Deck Polish

## Summary

The fresh session should continue on the existing `design` branch and complete the remaining redesign scope: Slide 10, Slide 11, Slide 12, plus one final full-deck consistency pass before merge.

Use the same skills in this order:
`brainstorming` -> `frontend-design` -> `requesting-code-review`

Do not merge the branch until the Batch 3 slide work and the final deck-wide review are both complete.

## Key Changes

- Reuse the established `Playful Science Lab` system from the shell and completed earlier batches before adding any new shared abstractions.
- Keep routing, locale flow, quiz logic, score flow, wrap-up content structure, and slide prop contracts unchanged.
- Allow small copy/message updates only when they improve clarity, pacing, or CTA labels in the final section of the deck.
- Slide 10 should become a clear “myth-busting experiment” that compares birthday-number picks versus random picks without changing the underlying equal-odds lesson.
- Slide 10 should preserve the current mode toggle and equal jackpot-odds outcome, but make the comparison feel more visual and more memorable.
- Slide 11 should become a “quiz show / lab check” moment with stronger answer states, clearer progression, and a more satisfying finish state while preserving the current question order, correctness logic, score flow, and restart behavior.
- Slide 11 should make the result state feel intentional for both correct and wrong answers, especially on mobile.
- Slide 12 should become a confident “graduation poster / takeaway board” that closes the lesson warmly, keeps the adult note readable, and makes the final message feel like a real finish.
- After slides 10, 11, and 12 are redesigned, do one full-deck consistency pass across slides 0 through 12 for spacing, button styles, message tone, motion, language overflow, and mobile responsiveness.
- The final consistency pass may include tiny touch-ups on earlier slides if they are necessary to make the deck feel cohesive, but it should avoid reopening core interactions unless a real issue is discovered.
- Keep motion short and purposeful.

## Public Interfaces / Types

- No route changes.
- No data-model, odds, simulation, or scoring changes.
- No slide prop changes.
- No question-count or answer-key changes in Slide 11 unless a real content bug is found.
- Message-file changes are allowed only for small Batch 3 labels, result text, supporting lines, or final consistency fixes.

## Test Plan

- Verify slides 10, 11, and 12 visually match the redesigned shell and completed earlier batches.
- Check `ru` and `pt` rendering for any new or adjusted message keys.
- Confirm Slide 10 still communicates that both pick styles have the same jackpot odds.
- Confirm Slide 11 still keeps the same question flow, score updates, next-question progression, finish state, and restart behavior.
- Confirm Slide 12 still presents all takeaway points and the adult note correctly.
- Do one end-to-end full-deck walkthrough from slide 0 to slide 12 on desktop and mobile widths.
- Check language switching mid-deck and confirm the slide state / locale flow still behaves correctly.
- Validate mobile and desktop layouts, especially the quiz flow and end slides.
- Run `npm run typecheck`, `npm run lint`, and `npm run build`.
- Finish with a `requesting-code-review` pass before merge.

## Assumptions

- Continue on `design`.
- Scope is `Visual + small copy + final consistency polish`.
- Batch membership is Slide 10, Slide 11, Slide 12, plus the final deck-wide review.
- The fresh session should use the current shell and completed slides 0 through 9 as the direct style reference.
- The final batch should make the deck feel complete, not just individually redesigned.

## Completion Criteria

- Slides 10, 11, and 12 match the deck’s final visual language.
- The whole deck feels consistent from opening slide to wrap-up.
- No known PR-feedback issues remain that are relevant to the completed redesign scope.
- The branch is ready for final review and merge discussion once the final review pass is complete.
