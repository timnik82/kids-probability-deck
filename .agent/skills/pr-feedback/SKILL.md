---
name: pr-feedback
description: Fetch, analyze, and fix PR review feedback from automated bots (cubic-dev-ai, devin, gemini-code-assist, codeant-ai, kilo-code-bot). Token-optimized.
---

# PR Feedback Workflow

Fetch all PR review feedback (from automated bots), analyze and categorize it, and provide a prioritized fix plan.

## Tool: `.agent/skills/pr-feedback/scripts/fetch_pr_comments.py`

Located in the skill's `scripts/` directory. Uses GitHub REST API via `gh api`.

### Fetching feedback

```bash
# Actionable items only (skip raw comment dumps) — saves ~50% tokens vs full output
python3 .agent/skills/pr-feedback/scripts/fetch_pr_comments.py --actionable-only --stdout --no-write

# Write full report to file for selective reading
python3 .agent/skills/pr-feedback/scripts/fetch_pr_comments.py --actionable-only

# After a push, only show feedback since last commit
python3 .agent/skills/pr-feedback/scripts/fetch_pr_comments.py --actionable-only --since-commit HEAD~1 --stdout --no-write

# Full report (all 3 comment types, raw + actionable) — only when deep-diving
python3 .agent/skills/pr-feedback/scripts/fetch_pr_comments.py --stdout --no-write
```

> **Always use `--actionable-only`** unless you need to investigate a specific raw comment.
> The script auto-detects the current branch's PR. Use `--pr <number>` to override.

### Built-in token optimizations

The script automatically:
- **Strips bot metadata** (cubic-dev tool traces `<!-- metadata:... -->`, devin internal IDs `<!-- devin-review-comment ... -->`, kilo markers `<!-- kilo-review -->`)
- **Filters ignored bots** (e.g., vercel) that never produce actionable feedback
- **Filters status noise** ("reviewing your PR", "finished reviewing", `✅ Resolved` markers)
- **Deduplicates** exact reviewer+body+path collisions
- **Sorts by severity** (critical → high → medium → low)

### Configuring ignored bots

Edit `IGNORED_BOTS` in `.agent/skills/pr-feedback/scripts/fetch_pr_comments.py` to skip bots that don't produce useful feedback:
```python
IGNORED_BOTS: set[str] = {
    "vercel[bot]",
}
```

## Analysis workflow

### Step 1: Fetch and read

```bash
python3 .agent/skills/pr-feedback/scripts/fetch_pr_comments.py --actionable-only --stdout --no-write
```

### Step 2: Categorize into priority tiers

Organize the feedback into these categories:

1. **✅ Already fixed** — issues addressed in prior commits or marked resolved
2. **🔴 Fix first — real bugs** — logic errors, unhandled exceptions, accessibility violations
3. **🟡 Should fix — quality** — unstable references, missing error handling, perf improvements
4. **💡 Nice-to-have** — UX enhancements, style suggestions, premature optimizations
5. **👍 No issues** — bots that found nothing wrong

### Step 3: Deduplicate across bots

Multiple bots often flag the **same underlying issue**. Group duplicates and note which bots agreed. Common overlaps:
- **Accessibility**: cubic-dev + devin both flag dialog/focus issues
- **Error handling**: codeant-ai + cubic-dev + devin all flag unhandled promise rejections
- **Performance**: gemini-code-assist + cubic-dev both flag O(n²) lookups

### Step 4: Fix in priority order

1. Fix all **🔴 real bugs** first
2. Fix **🟡 quality** issues
3. Skip **💡 nice-to-have** unless the user requests them
4. After fixing, verify: `npm run typecheck && npm run lint && npx vitest run`

### Step 5: Commit, push, re-check

```bash
git add -A && git commit -m "fix: address PR review feedback" && git push

# Re-fetch to see if bots posted new comments on updated code
python3 .agent/skills/pr-feedback/scripts/fetch_pr_comments.py --actionable-only --since-commit HEAD~1 --stdout --no-write
```

## Bot reference: where each bot writes feedback

| Bot | General Comments | Inline Reviews | Review Summaries |
|-----|-----------------|----------------|------------------|
| **gemini-code-assist** | Summary (low value) | ✅ Code suggestions | ✅ Overall verdict |
| **codeant-ai** | ✅ Nitpicks + areas | ✅ Inline suggestions | Empty (skip) |
| **devin-ai-integration** | — | ✅ Analysis (🚩/🟡) | Badge links (low value) |
| **cubic-dev-ai** | — | ✅ Issues + fixes | ✅ Confidence score |
| **kilo-code-bot** | ✅ Full review | ✅ Inline reviews | — |
| **vercel** | Deployment (noise) | — | — |

## Alternative: `gh pr-reviews` extension

If your GitHub token has GraphQL commit-read permissions, you can use the more token-efficient `gh pr-reviews` extension:

```bash
gh extension install Nittarab/gh-pr-reviews
gh pr-reviews timnik82/MyoTerApp 348
```

> **Note**: Requires a token with `read:commit` scope for the GraphQL API.
> Falls back to `fetch_pr_comments.py` if permissions are insufficient.
