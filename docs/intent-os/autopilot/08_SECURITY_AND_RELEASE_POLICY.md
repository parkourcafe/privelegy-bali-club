# Security and Release Policy

## Allowed automatically

- read repository files;
- create/edit documentation and data artifacts;
- run tests, lint, typecheck and build;
- use isolated branch/worktree;
- create feature-flagged code;
- create preview deployment;
- open pull request;
- query approved read-only aggregate sources when credentials exist.

## Forbidden automatically

- production database writes;
- destructive migrations;
- changing access grants;
- exposing or logging secrets;
- sending personal user data to external models;
- storing user-content analytics;
- publishing medical/legal/safety claims without authoritative answer evidence;
- indexing thin, duplicate or unverified pages;
- auto-merging failing or high-risk changes.

## Safe-stop behavior

A forbidden requirement produces:

```text
SAFE_HOLD
```

The agent records the exact blocker and remediation. It does not ask the owner and does not improvise around the boundary.
