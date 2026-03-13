#!/usr/bin/env python3
"""Fetch PR feedback for the current branch using GitHub CLI API.

Collects:
1) PR details (metadata/stats/description)
2) General PR comments (issue comments)
3) Review comments (line-specific)
4) Review summaries (pull request reviews)

Also prints an "actionable feedback" section grouped with inferred severity.
"""

from __future__ import annotations

import argparse
from difflib import SequenceMatcher
import json
import re
import subprocess
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, List, Sequence


# Bots that never produce actionable feedback — skip entirely.
IGNORED_BOTS: set[str] = {
    "vercel[bot]",
}

# HTML-comment metadata prefixes injected by bots (pure noise for consumers).
# These are stripped from comment bodies before processing/output.
BOT_METADATA_PATTERN = re.compile(
    r"<!--\s*metadata:\{.*?\}\s*-->|"
    r"<!--\s*devin-review-comment\s*\{.*?\}\s*-->|"
    r"<!--\s*devin-review-badge-begin\s*-->.*?<!--\s*devin-review-badge-end\s*-->|"
    r"<!--\s*kilo-review\s*-->",
    re.DOTALL,
)

AI_AGENT_PROMPT_BLOCK_PATTERN = re.compile(
    r"<details>\s*<summary>\s*Prompt for AI agents.*?</details>",
    re.IGNORECASE | re.DOTALL,
)

REVIEW_WRAPPER_FOOTER_PATTERN = re.compile(
    r"Reply with feedback, questions, or to request a fix\..*$",
    re.IGNORECASE | re.DOTALL,
)

HTML_TAG_PATTERN = re.compile(r"</?[^>]+>")
URL_PATTERN = re.compile(r"https?://\S+")

STATUS_NOISE_PATTERNS = [
    re.compile(r"^@[\w\-\[\]]+", re.IGNORECASE),  # command pings (e.g. @bot review)
    re.compile(r"codeant ai is running the review", re.IGNORECASE),
    re.compile(r"codeant ai finished running the review", re.IGNORECASE),
    re.compile(r"skipping pr review because a bot author is detected", re.IGNORECASE),
    re.compile(r"latest updates on your projects", re.IGNORECASE),
    re.compile(r"^vc\b", re.IGNORECASE),
    re.compile(r"status\s*no issues found", re.IGNORECASE),
    re.compile(r"recommendation\s*merge", re.IGNORECASE),
    re.compile(r"^summary of changes\b", re.IGNORECASE),
    re.compile(r"^code review summary\b", re.IGNORECASE),
    re.compile(r"^pull request overview\b", re.IGNORECASE),
    re.compile(r"^devin review found\b", re.IGNORECASE),
    re.compile(r"^\d+\s+issues?\s+found\s+across\s+\d+\s+files?\b", re.IGNORECASE),
    re.compile(r"^no issues found\b", re.IGNORECASE),
    re.compile(r"^review notes\b", re.IGNORECASE),
    re.compile(r"i.ve left a few suggestions for improvement", re.IGNORECASE),
    re.compile(r"^\W*resolved\b", re.IGNORECASE),
    re.compile(r"resolved\b.*has been fixed", re.IGNORECASE),
    re.compile(r"\baddressed in\b\s+[0-9a-f]{7,40}\b", re.IGNORECASE),
    # CodeRabbit-specific administrative noise
    re.compile(r"actionable comments posted", re.IGNORECASE),
    re.compile(r"planning.*disabled.*administrator", re.IGNORECASE),
    re.compile(r"this is an auto-generated comment", re.IGNORECASE),
    re.compile(r"fingerprinting.*poseidon.*ocelot", re.IGNORECASE),
    re.compile(r"walkthrough.*changes", re.IGNORECASE),
    re.compile(r"sequence diagram", re.IGNORECASE),
]

BROAD_BOT_ISSUE_COMMENT_PATTERNS = [
    re.compile(r"^##\s*nitpicks\b", re.IGNORECASE),
    re.compile(r"^nitpicks\b", re.IGNORECASE),
    re.compile(r"recommended areas for review", re.IGNORECASE),
    re.compile(r"^review notes\b", re.IGNORECASE),
    re.compile(r"^summary of changes\b", re.IGNORECASE),
    # CodeRabbit administrative patterns (but keep nitpicks)
    re.compile(r"^##\s*walkthrough\b", re.IGNORECASE),
    re.compile(r"^##\s*sequence diagram\b", re.IGNORECASE),
    re.compile(r"adds.*end-to-end.*test.*infra", re.IGNORECASE),
    re.compile(r"integrates.*playwright", re.IGNORECASE),
]

ACTIONABLE_KEYWORDS = [
    "p0",
    "p1",
    "p2",
    "p3",
    "critical",
    "high",
    "major",
    "medium",
    "warning",
    "low",
    "info",
    "suggestion",
    "should",
    "must",
    "fix",
    "bug",
    "issue",
    "regression",
    "noncompliant",
    "accessibility",
    "aria",
    "logic error",
    "changes requested",
]


@dataclass
class ActionableItem:
    item_type: str
    reviewer: str
    severity: str
    url: str
    body: str
    path: str | None = None
    line: int | None = None
    created_at: str | None = None
    also_reported_by: list[str] = field(default_factory=list)


def run(cmd: List[str]) -> str:
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        stderr = proc.stderr.strip() or proc.stdout.strip()
        raise RuntimeError(f"Command failed ({' '.join(cmd)}): {stderr}")
    return proc.stdout


def parse_iso_datetime(value: str) -> datetime:
    text = value.strip()
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    return datetime.fromisoformat(text).astimezone(timezone.utc)


def get_commit_timestamp(commit_ref: str) -> datetime:
    raw = run(["git", "show", "-s", "--format=%cI", commit_ref]).strip()
    if not raw:
        raise RuntimeError(f"Could not resolve commit timestamp for '{commit_ref}'.")
    return parse_iso_datetime(raw)


def filter_since(
    items: list[dict[str, Any]],
    since_dt: datetime,
    timestamp_fields: Sequence[str],
) -> list[dict[str, Any]]:
    filtered: list[dict[str, Any]] = []
    for item in items:
        candidate_ts: datetime | None = None
        for field in timestamp_fields:
            raw = item.get(field)
            if not raw:
                continue
            try:
                parsed = parse_iso_datetime(str(raw))
            except ValueError:
                continue
            if candidate_ts is None or parsed > candidate_ts:
                candidate_ts = parsed
        if candidate_ts and candidate_ts > since_dt:
            filtered.append(item)
    return filtered


def gh_api(endpoint: str, paginate: bool = False) -> Any:
    cmd = ["gh", "api", endpoint]
    if paginate:
        cmd.append("--paginate")
    raw = run(cmd).strip()
    if not raw:
        return []
    if not paginate:
        return json.loads(raw)

    # `gh api --paginate` prints one JSON page per line. Parse all pages robustly.
    decoder = json.JSONDecoder()
    idx = 0
    pages: List[Any] = []
    while idx < len(raw):
        while idx < len(raw) and raw[idx].isspace():
            idx += 1
        if idx >= len(raw):
            break
        page, consumed = decoder.raw_decode(raw, idx)
        pages.append(page)
        idx = consumed

    merged: List[Any] = []
    for page in pages:
        if isinstance(page, list):
            merged.extend(page)
        else:
            merged.append(page)
    return merged


def get_current_branch() -> str:
    return run(["git", "branch", "--show-current"]).strip()


def get_repo_slug() -> str:
    slug = run(["gh", "repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]).strip()
    if not slug or "/" not in slug:
        raise RuntimeError("Could not determine GitHub repo slug from `gh repo view`.")
    return slug


def parse_repo_slug(slug: str) -> tuple[str, str]:
    owner, repo = slug.split("/", 1)
    return owner, repo


def resolve_pr(owner: str, repo: str, branch: str, pr_number: int | None) -> dict[str, Any]:
    if pr_number is not None:
        return gh_api(f"repos/{owner}/{repo}/pulls/{pr_number}")

    open_prs = gh_api(f"repos/{owner}/{repo}/pulls?state=open&head={owner}:{branch}")
    if open_prs:
        return open_prs[0]

    all_prs = gh_api(f"repos/{owner}/{repo}/pulls?state=all&head={owner}:{branch}")
    if all_prs:
        return all_prs[0]

    raise RuntimeError(
        f"No PR found for branch '{branch}'. Pass --pr <number> to fetch a specific PR."
    )


def strip_bot_metadata(body: str) -> str:
    """Remove bot-internal HTML comment metadata from a comment body."""
    cleaned = BOT_METADATA_PATTERN.sub("", body)
    cleaned = AI_AGENT_PROMPT_BLOCK_PATTERN.sub("", cleaned)
    cleaned = REVIEW_WRAPPER_FOOTER_PATTERN.sub("", cleaned)
    cleaned = HTML_TAG_PATTERN.sub(" ", cleaned)
    return cleaned.strip()


def normalize_for_matching(body: str) -> str:
    text = strip_bot_metadata(body)
    text = URL_PATTERN.sub("", text)
    text = re.sub(r"`+", "", text)
    text = re.sub(r"[*_>#\[\]\(\)\-|:]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def get_comment_user(comment: dict[str, Any]) -> str:
    return (comment.get("user") or {}).get("login", "unknown")


def is_ignored_bot(comment: dict[str, Any]) -> bool:
    return get_comment_user(comment) in IGNORED_BOTS


def filter_ignored_bots(comments: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Remove comments from bots in IGNORED_BOTS."""
    return [c for c in comments if not is_ignored_bot(c)]


def is_status_noise(body: str) -> bool:
    text = normalize_for_matching(body)
    if not text:
        return True
    for pattern in STATUS_NOISE_PATTERNS:
        if pattern.search(text):
            return True
    return False


def infer_severity(body: str) -> str:
    text = normalize_for_matching(body).lower()
    if "p0" in text or "critical" in text:
        return "critical"
    if "p1" in text or "high" in text or "major" in text:
        return "high"
    if "p2" in text or "medium" in text or "warning" in text:
        return "medium"
    if "p3" in text or "low" in text or "info" in text or "suggestion" in text or "nit" in text:
        return "low"
    return "medium"


def looks_actionable(comment_type: str, body: str) -> bool:
    if is_status_noise(body):
        return False

    # Filter out CodeRabbit administrative content
    if is_coderabbit_administrative(body):
        return False

    lowered = normalize_for_matching(body).lower()
    if any(keyword in lowered for keyword in ACTIONABLE_KEYWORDS):
        return True

    # Line-specific review comments are usually actionable unless they're status noise.
    if comment_type == "review_comment":
        return True

    return False


def is_bot_reviewer(reviewer: str) -> bool:
    return reviewer.endswith("[bot]") or reviewer.lower() == "copilot"


def is_broad_bot_issue_comment(body: str) -> bool:
    text = strip_bot_metadata(body)
    if any(pattern.search(text) for pattern in BROAD_BOT_ISSUE_COMMENT_PATTERNS):
        return True

    normalized = normalize_for_matching(text).lower()
    has_checklist = "- [ ]" in text or "- [x]" in text
    has_multiple_bullets = text.count("\n- ") >= 2
    return (
        ("nitpicks" in normalized or "recommended areas for review" in normalized)
        and (has_checklist or has_multiple_bullets)
    )


def is_coderabbit_administrative(body: str) -> bool:
    """Check if this is CodeRabbit administrative/meta content that should be filtered."""
    text = normalize_for_matching(body).lower()

    # Administrative messages that are pure noise
    administrative_markers = [
        "actionable comments posted",
        "planning has been disabled",
        "auto-generated comment by coderabbit",
        "fingerprinting:phantom:poseidon:ocelot",
        "this is an auto-generated comment",
        "reply with feedback, questions, or to request a fix",
        "tag @cubic-dev-ai to re-run a review",
        "sub>cubic:attribution important",
    ]

    # Keep nitpicks and actual code suggestions
    if any(marker in text for marker in administrative_markers):
        return True

    return False


def shorten(text: str, max_len: int = 220) -> str:
    one_line = " ".join(text.strip().split())
    if len(one_line) <= max_len:
        return one_line
    return one_line[: max_len - 1] + "…"


DEDUP_STOPWORDS = {
    "the",
    "and",
    "that",
    "this",
    "with",
    "from",
    "into",
    "when",
    "will",
    "they",
    "them",
    "then",
    "than",
    "your",
    "their",
    "have",
    "been",
    "only",
    "same",
    "does",
    "using",
    "used",
    "like",
    "line",
    "lines",
    "file",
    "files",
    "comment",
    "comments",
    "review",
}

SUPPORTIVE_MARKERS = ("intentional", "intentionally", "by design", "expected")
PROBLEM_MARKERS = (
    "bug",
    "issue",
    "regression",
    "broken",
    "gap",
    "gaps",
    "missing",
    "skip",
    "skipped",
    "should",
    "must",
    "fix",
    "problem",
)


def dedupe_tokens(body: str) -> set[str]:
    text = normalize_for_matching(body).lower()
    words = re.findall(r"[a-z0-9_]+", text)
    return {word for word in words if len(word) >= 4 and word not in DEDUP_STOPWORDS}


def issue_polarity(body: str) -> str:
    text = normalize_for_matching(body).lower()
    if any(marker in text for marker in SUPPORTIVE_MARKERS):
        return "supportive"
    if any(marker in text for marker in PROBLEM_MARKERS):
        return "problem"
    return "neutral"


def items_are_duplicates(existing: ActionableItem, candidate: ActionableItem) -> bool:
    if existing.item_type != candidate.item_type:
        return False
    if existing.path and candidate.path and existing.path != candidate.path:
        return False
    if existing.line and candidate.line and abs(existing.line - candidate.line) > 8:
        return False

    existing_polarity = issue_polarity(existing.body)
    candidate_polarity = issue_polarity(candidate.body)
    if {existing_polarity, candidate_polarity} == {"supportive", "problem"}:
        return False

    existing_tokens = dedupe_tokens(existing.body)
    candidate_tokens = dedupe_tokens(candidate.body)
    if not existing_tokens or not candidate_tokens:
        return False

    shared = existing_tokens & candidate_tokens
    if len(shared) < 4:
        return False

    overlap = len(shared) / min(len(existing_tokens), len(candidate_tokens))
    text_similarity = SequenceMatcher(
        None,
        normalize_for_matching(existing.body).lower(),
        normalize_for_matching(candidate.body).lower(),
    ).ratio()
    return overlap >= 0.45 or text_similarity >= 0.55


def build_actionable_items(
    issue_comments: Iterable[dict[str, Any]],
    review_comments: Iterable[dict[str, Any]],
    reviews: Iterable[dict[str, Any]],
) -> List[ActionableItem]:
    review_comments = list(review_comments)
    issue_comments = list(issue_comments)
    reviews = list(reviews)
    items: List[ActionableItem] = []
    actionable_inline_reviewers: set[str] = set()

    for c in review_comments:
        body = strip_bot_metadata(c.get("body", "") or "")
        if looks_actionable("review_comment", body):
            actionable_inline_reviewers.add(get_comment_user(c))

    for c in issue_comments:
        body = strip_bot_metadata(c.get("body", "") or "")
        reviewer = get_comment_user(c)
        if (
            is_bot_reviewer(reviewer)
            and reviewer in actionable_inline_reviewers
            and is_broad_bot_issue_comment(body)
        ):
            continue
        if looks_actionable("issue_comment", body):
            items.append(
                ActionableItem(
                    item_type="issue_comment",
                    reviewer=reviewer,
                    severity=infer_severity(body),
                    url=c.get("html_url", ""),
                    body=body,
                    created_at=c.get("created_at"),
                )
            )

    for c in review_comments:
        body = strip_bot_metadata(c.get("body", "") or "")
        if looks_actionable("review_comment", body):
            items.append(
                ActionableItem(
                    item_type="review_comment",
                    reviewer=get_comment_user(c),
                    severity=infer_severity(body),
                    url=c.get("html_url", ""),
                    body=body,
                    path=c.get("path"),
                    line=c.get("line"),
                    created_at=c.get("created_at"),
                )
            )

    for r in reviews:
        body = strip_bot_metadata(r.get("body", "") or "")
        if looks_actionable("review", body):
            items.append(
                ActionableItem(
                    item_type="review",
                    reviewer=get_comment_user(r),
                    severity=infer_severity(body),
                    url=r.get("html_url", ""),
                    body=body,
                    created_at=r.get("submitted_at"),
                )
            )

    # Deduplicate exact reviewer+body+path collisions first.
    unique: dict[str, ActionableItem] = {}
    for item in items:
        key = f"{item.item_type}|{item.reviewer}|{item.path or ''}|{item.line or ''}|{item.body.strip()}"
        unique[key] = item

    severity_rank = {"critical": 0, "high": 1, "medium": 2, "low": 3}

    clustered: list[ActionableItem] = []
    precluster_items = sorted(unique.values(), key=lambda i: i.created_at or "", reverse=True)
    precluster_items = sorted(precluster_items, key=lambda i: severity_rank.get(i.severity, 9))

    for item in precluster_items:
        duplicate = next((existing for existing in clustered if items_are_duplicates(existing, item)), None)
        if duplicate is None:
            clustered.append(item)
            continue

        if item.reviewer != duplicate.reviewer and item.reviewer not in duplicate.also_reported_by:
            duplicate.also_reported_by.append(item.reviewer)

    for item in clustered:
        item.also_reported_by.sort()

    # Stable sort allows doing this in two passes:
    # 1. Sort by timestamp (descending)
    sorted_by_time = sorted(clustered, key=lambda i: i.created_at or "", reverse=True)
    # 2. Sort by severity (ascending)
    return sorted(sorted_by_time, key=lambda i: severity_rank.get(i.severity, 9))


def render_markdown(
    repo_slug: str,
    branch: str,
    pr_details: dict[str, Any],
    issue_comments: list[dict[str, Any]],
    review_comments: list[dict[str, Any]],
    reviews: list[dict[str, Any]],
    actionable_items: list[ActionableItem],
    only_actionable: bool,
    since_commit: str | None,
    since_timestamp: str | None,
    pre_filter_counts: tuple[int, int, int] | None,
) -> str:
    number = pr_details.get("number")
    title = pr_details.get("title", "")
    pr_url = pr_details.get("html_url", "")
    state = pr_details.get("state", "")
    author = (pr_details.get("user") or {}).get("login", "unknown")
    changed_files = pr_details.get("changed_files", "n/a")
    additions = pr_details.get("additions", "n/a")
    deletions = pr_details.get("deletions", "n/a")

    lines: List[str] = []
    lines.append(f"# PR Feedback Report: #{number}")
    lines.append("")
    lines.append("## PR Details")
    lines.append(f"- Repository: `{repo_slug}`")
    lines.append(f"- Branch: `{branch}`")
    lines.append(f"- PR: #{number} - {title}")
    lines.append(f"- URL: {pr_url}")
    lines.append(f"- State: {state}")
    lines.append(f"- Author: @{author}")
    lines.append(f"- Stats: +{additions} / -{deletions}, files changed: {changed_files}")
    lines.append("")
    lines.append("## Counts")
    if pre_filter_counts:
        issue_total, review_comment_total, review_total = pre_filter_counts
        lines.append(
            f"- Filter mode: after commit `{since_commit}` ({since_timestamp})"
        )
        lines.append(
            f"- General comments: {len(issue_comments)} (from {issue_total} total)"
        )
        lines.append(
            f"- Review comments (inline): {len(review_comments)} (from {review_comment_total} total)"
        )
        lines.append(
            f"- Review summaries: {len(reviews)} (from {review_total} total)"
        )
    else:
        lines.append(f"- General comments: {len(issue_comments)}")
        lines.append(f"- Review comments (inline): {len(review_comments)}")
        lines.append(f"- Review summaries: {len(reviews)}")
    lines.append(f"- Actionable feedback items: {len(actionable_items)}")
    lines.append("")
    lines.append("## Actionable Feedback (All Three Comment Types)")
    if not actionable_items:
        lines.append("- No actionable feedback detected by heuristic filters.")
    else:
        for idx, item in enumerate(actionable_items, start=1):
            location = f" ({item.path}:{item.line})" if item.path and item.line else ""
            lines.append(
                f"{idx}. [{item.severity.upper()}] `{item.item_type}` by @{item.reviewer}{location}"
            )
            lines.append(f"   - {shorten(item.body)}")
            if item.also_reported_by:
                also_reported_by = ", ".join(f"@{reviewer}" for reviewer in item.also_reported_by)
                lines.append(f"   - Also reported by {also_reported_by}")
            lines.append(f"   - {item.url}")
    if not only_actionable:
        lines.append("")
        lines.append("## Raw: General Comments")
        for idx, c in enumerate(issue_comments, start=1):
            reviewer = (c.get("user") or {}).get("login", "unknown")
            body = strip_bot_metadata(c.get("body", "") or "")
            if is_status_noise(body):
                continue
            lines.append(f"{idx}. @{reviewer} - {c.get('html_url', '')}")
            lines.append(f"   - {shorten(body, 300)}")
        lines.append("")
        lines.append("## Raw: Review Comments (Inline)")
        for idx, c in enumerate(review_comments, start=1):
            reviewer = (c.get("user") or {}).get("login", "unknown")
            body = strip_bot_metadata(c.get("body", "") or "")
            if is_status_noise(body):
                continue
            path = c.get("path", "n/a")
            line = c.get("line", "n/a")
            lines.append(f"{idx}. @{reviewer} - {path}:{line} - {c.get('html_url', '')}")
            lines.append(f"   - {shorten(body, 300)}")
        lines.append("")
        lines.append("## Raw: Review Summaries")
        for idx, r in enumerate(reviews, start=1):
            reviewer = (r.get("user") or {}).get("login", "unknown")
            state = r.get("state", "")
            body = strip_bot_metadata(r.get("body", "") or "")
            if is_status_noise(body):
                continue
            lines.append(f"{idx}. @{reviewer} [{state}] - {r.get('html_url', '')}")
            if body.strip():
                lines.append(f"   - {shorten(body, 300)}")
            else:
                lines.append("   - (no body)")
    lines.append("")
    lines.append(f"_Generated at {datetime.now(timezone.utc).isoformat()}_")
    return "\n".join(lines)


def resolve_since_commit_arg(args: argparse.Namespace) -> str | None:
    if args.since_commit and args.new_comments:
        raise ValueError("Use either --since-commit or --new-comments, not both.")
    if args.new_comments:
        return "HEAD"
    return args.since_commit


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch PR feedback with gh api.")
    parser.add_argument("--repo", help="owner/repo slug (default: current gh repo)")
    parser.add_argument("--branch", help="branch name (default: current git branch)")
    parser.add_argument("--pr", type=int, help="PR number (default: resolve from branch)")
    parser.add_argument(
        "--since-commit",
        help="Only include feedback created after this commit timestamp (e.g. HEAD, HEAD~1, <sha>)",
    )
    parser.add_argument(
        "--new-comments",
        action="store_true",
        help="Shortcut for --since-commit HEAD to fetch only comments created after the latest local commit.",
    )
    parser.add_argument(
        "--actionable-only",
        action="store_true",
        help="Write only the actionable section (skip raw comment dumps).",
    )
    parser.add_argument(
        "--output",
        default="docs/PR_FEEDBACK_REPORT.md",
        help="Output markdown path (default: docs/PR_FEEDBACK_REPORT.md)",
    )
    parser.add_argument(
        "--stdout",
        action="store_true",
        help="Print the generated report to stdout.",
    )
    parser.add_argument(
        "--no-write",
        action="store_true",
        help="Do not write report to disk.",
    )
    args = parser.parse_args()

    try:
        since_commit = resolve_since_commit_arg(args)
        repo_slug = args.repo or get_repo_slug()
        owner, repo = parse_repo_slug(repo_slug)
        branch = args.branch or get_current_branch()
        pr = resolve_pr(owner, repo, branch, args.pr)
        pr_number = int(pr["number"])

        pr_details = gh_api(f"repos/{owner}/{repo}/pulls/{pr_number}")
        issue_comments = gh_api(f"repos/{owner}/{repo}/issues/{pr_number}/comments", paginate=True)
        review_comments = gh_api(f"repos/{owner}/{repo}/pulls/{pr_number}/comments", paginate=True)
        reviews = gh_api(f"repos/{owner}/{repo}/pulls/{pr_number}/reviews", paginate=True)

        pre_filter_counts: tuple[int, int, int] | None = None
        since_timestamp: str | None = None
        if since_commit:
            pre_filter_counts = (
                len(issue_comments),
                len(review_comments),
                len(reviews),
            )
            since_dt = get_commit_timestamp(since_commit)
            since_timestamp = since_dt.isoformat()
            issue_comments = filter_since(issue_comments, since_dt, ("created_at",))
            review_comments = filter_since(review_comments, since_dt, ("created_at",))
            reviews = filter_since(reviews, since_dt, ("submitted_at", "submittedAt", "created_at"))

        # Filter out bots that never produce actionable feedback.
        issue_comments = filter_ignored_bots(issue_comments)
        review_comments = filter_ignored_bots(review_comments)
        reviews = filter_ignored_bots(reviews)

        actionable_items = build_actionable_items(issue_comments, review_comments, reviews)
        report = render_markdown(
            repo_slug=repo_slug,
            branch=branch,
            pr_details=pr_details,
            issue_comments=issue_comments,
            review_comments=review_comments,
            reviews=reviews,
            actionable_items=actionable_items,
            only_actionable=args.actionable_only,
            since_commit=since_commit,
            since_timestamp=since_timestamp,
            pre_filter_counts=pre_filter_counts,
        )

        if args.stdout:
            print(report)

        print(f"Fetched PR #{pr_number} for branch '{branch}' in {repo_slug}")
        print(
            "Counts: "
            f"general={len(issue_comments)}, "
            f"review_inline={len(review_comments)}, "
            f"review_summaries={len(reviews)}, "
            f"actionable={len(actionable_items)}"
        )
        if not args.no_write:
            out_path = Path(args.output)
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(report, encoding="utf-8")
            print(f"Report written to: {out_path}")
        else:
            print("Report write skipped (--no-write).")
        return 0
    except Exception as exc:  # noqa: BLE001 - intentional script-level error handling
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
