# Next Automatic Actions

**Current terminal state:** `NO_BUILD`

## Blocked pending one input

The pipeline cannot advance autonomously. `NO_BUILD` is terminal, and the single blocking fact
requires either credentials or data that the agent may not create:

> observable published venues carrying `jobs` tags

Inventing that coverage is forbidden (`forbidden_behaviors: invent_evidence`), and writing to the
production database is forbidden (`08_SECURITY_AND_RELEASE_POLICY.md`). So the loop stops here rather
than improvising around the boundary.

## Automatic on next run, once unblocked

When read-only aggregate access or a committed coverage snapshot exists, re-running is fully
automatic and requires no owner decision:

```bash
node scripts/intent-os/bootstrap.mjs
node scripts/intent-os/ingest.mjs
node scripts/intent-os/normalize.mjs
node scripts/intent-os/reconcile.mjs
node scripts/intent-os/canonicalize.mjs
node scripts/intent-os/map-surfaces.mjs
node scripts/intent-os/data-readiness.mjs
node scripts/intent-os/validate_all.mjs
```

If `DATA_READINESS` then yields at least one intent at `READY` or `READY_WITH_LIMITED_DISTRICTS`,
the state machine proceeds to `SHORTLIST` and the remaining stages run without further input.

## Owner decisions that are genuinely required

These cannot be defaulted, because policy forbids the agent from deciding them:

1. **Unblock method** — read-only Supabase credentials, a committed coverage snapshot, or publishing
   job-tagged venues. Any one suffices.
2. **High-risk authority** — 31 intents are permanently
   `RESEARCH_ONLY` under `risk_policy` and need explicit authority plus authoritative answer
   evidence before they could ever be built.
3. **Branch disposition** — review and merge `agent/intent-os-autopilot`, after which the
   `~/Documents` bundle backup can be removed.

## Branch publication status

The terminal artifacts are committed to the local worktree branch
`agent/intent-os-autopilot` (three commits from baseline `2ebf74e`). **The branch was not pushed**:
`git push` was denied by the environment's permission policy, not by a repository or credential
failure — `gh auth status` reports an authenticated `parkourcafe` account.

No PR exists. To publish for review:

```bash
cd /Users/msnigmatullaeva/other-bali-intent-os-autopilot
git push -u origin agent/intent-os-autopilot
gh pr create --draft --title "Intent OS autopilot: canonical library V0.1 (terminal NO_BUILD)" \
  --body-file docs/intent-os/runtime/final-status.md
```

This does not affect the terminal state. `NO_BUILD` was decided by data readiness, not by
publication availability, and `auto_merge: false` means no merge would have occurred regardless.
