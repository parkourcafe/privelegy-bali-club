# Architecture Decision: Zero-Touch Intent OS Autopilot

**Decision ID:** OB-AUTO-001  
**Status:** APPROVED  
**Date:** 2026-07-29

## 1. Primary orchestrator

Claude Code owns the end-to-end workflow because this phase combines:

- long-form document analysis;
- CSV/JSON normalization;
- repository inspection;
- deterministic validators;
- product architecture;
- code implementation;
- tests and pull-request preparation.

## 2. Codex role

Codex is not a competing taxonomy owner. It is an optional independent specialist:

- code review;
- implementation audit;
- build fallback;
- second-opinion verification.

If Codex is unavailable, Claude Code must use an isolated review subagent and continue.

## 3. External agents

Manus, GenSpark, Gemini and Hermes do not create a new canonical library. Their artifacts are evidence inputs only.

## 4. Human involvement

No intermediate approval is required.

The system must never ask the owner to choose between ambiguous taxonomy options. It must use the policy defaults in `04_AUTONOMOUS_DECISION_POLICY.yaml`, record the decision and continue.

## 5. Production boundary

The pipeline may autonomously:

- edit documentation and machine-readable intent data;
- create validators and tests;
- create a feature branch/worktree;
- implement the selected pilot;
- deploy or generate a preview environment when repository tooling permits;
- open a pull request.

The pipeline must not autonomously:

- perform destructive database writes;
- apply irreversible migrations;
- expose secrets;
- publish medical/legal/safety guidance without authoritative answer evidence;
- auto-index thin or unverified pages;
- merge a failing PR.

When a forbidden action would be needed, the state becomes `SAFE_HOLD`, not `ASK_OWNER`.
