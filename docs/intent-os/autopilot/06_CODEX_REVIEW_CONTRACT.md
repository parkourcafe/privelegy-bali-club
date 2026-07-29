# Codex Independent Review Contract

Codex acts only as an independent reviewer of the completed branch/diff.

## Review scope

1. Source-record integrity.
2. Canonical/child/modifier parent-link integrity.
3. CSV/JSON validity.
4. Scope compliance with the approved product brief.
5. Reuse of existing `/plan` or `/my-day` engines.
6. Security and privacy.
7. Analytics payload safety.
8. Route, canonical and sitemap conflicts.
9. Tests, typecheck, lint and build.
10. Rollback and feature-flag behavior.

## Forbidden scope

Codex must not:

- invent or replace external evidence;
- redesign the taxonomy;
- create new canonical intents;
- expand the product scope;
- publish pages;
- merge the PR.

## Output

Create:

```text
docs/intent-os/runtime/codex-independent-review.md
```

Use severity:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Any CRITICAL or HIGH finding blocks completion until fixed and re-reviewed.
