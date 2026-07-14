# Other Bali Four-Session Status Board

Frozen implementation baseline SHA: `1d77f1e`

Environment metadata commit is the single child of this baseline and contains only
this board plus empty handoffs. Every session worktree is created from that metadata
commit; product implementation diffs are therefore measured against `1d77f1e`.

| Session | Branch | Status | Final SHA | Handoff |
| --- | --- | --- | --- | --- |
| 0 — AI Data Ops | `loop/00-data-ops` | 208/208 reconciled; deterministic draft package ready for operator review/import dry-run/staging apply; forbidden to publish | `f72bf43` (handoff `50ded7a`) | `docs/loop/handoffs/session-0.md` |
| 1 — Data foundation | `loop/01-data-foundation` | integrated; post-merge gate pass | `8b00cfe` (handoff `6a70108`) | `docs/loop/handoffs/session-1.md` |
| 2 — Place/menu UI | `loop/02-menu-place-ui` | integrated; post-merge gate pass | `eba6775` (handoff `8798fc3`) | `docs/loop/handoffs/session-2.md` |
| 3 — Action gateway | `loop/03-action-gateway` | integrated; post-merge gate pass | `a5d39b8` (handoff `a1dec6d`) | `docs/loop/handoffs/session-3.md` |
| 4 — Admin/integration | `loop/04-admin-integration` | integrated; ready for release review | `51a5a49` (integrated implementation) | `docs/loop/handoffs/session-4.md` |

## Session 0 Data Ops closeout

- Denominator: 208/208 (`207` repo replay + confirmed live-only
  `kynd-community`); 153 complete research records, 55 blocked, 0 queued.
- Package digest after the release-integration completeness gate:
  `ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081`.
- Menu completeness: 1 full candidate (`kynd-community`) and 126
  partial/subset candidates. Partial candidates are importable drafts but are
  technically blocked from the verified full-menu publication workflow.
- Gates: `denominatorReconciled=true`, `readyForImportDryRun=true`,
  `readyForStagingApply=true`, `readyForPublish=false`.
- All 208 records remain operator-review-only, draft, unverified and forbidden
  to publish. Exact compiler/test/check commands and results are in the Session
  0 handoff; no import, publication, deployment or external message occurred.

## Merge gate

Session 4 may integrate a session only when its handoff names a final SHA, its owned
scope and migrations comply, and focused tests/lint/build results are recorded. Merge
order: Session 1, Session 3, Session 2.
Integration order completed: Session 1 merge `10efe86`, Session 3 merge
`9824d93`, Session 2 merge `575f671`; vertical wiring `51a5a49`. The final
Data Ops package is integrated for staging import review, while every candidate
remains draft and non-public.

## Release-integration staging rehearsal

- Disposable staging apply completed at `2026-07-14T08:42:40Z` through
  Supabase JS/PostgREST: 127 menus, 165 sections, 881 items and 250 action
  capabilities.
- Post-apply reconciliation found zero duplicates, zero orphan rows, zero
  unexpected verified/public rows and zero anonymous draft visibility.
- The publication gate rejected a partial menu; the full KYND publication path
  passed inside a rolled-back operator transaction.
- Production was not connected to or mutated by this rehearsal. Full evidence
  is in `docs/loop/handoffs/staging_import_20260714.md`.

## Transactional production-import rehearsal

- The production-only one-shot importer now validates the exact package and
  input digests, expected row counts, draft/unverified state, HTTPS evidence,
  venue mapping and service-role caller before any write.
- A full disposable Supabase JS/PostgREST rehearsal imported `127 / 165 / 881 /
  250` menu/action rows, preserved a simulated confirmed compatibility action
  as version 1 and linked its new package draft as version 2.
- Exact repeat was idempotent. A forced mid-import unique-key failure rolled
  back every package and ledger row; the pre-existing confirmed action survived.
- Anonymous visibility remained zero for all imported drafts. Full evidence is
  in `docs/loop/handoffs/production_import_rpc_20260714.md`.
- Preview deployment `dpl_4fRc6CzhZo3KdH6EPL6KMiWn4baU` is `READY`; its
  production-only import endpoint returns fail-closed `404` in preview.
- The exact lockdown → bridge → `0031` → `0032` → `0033` → `0034` sequence
  passes on a disposable clone with stop-on-first-error enabled. Three
  pre-existing policy-name collisions in `0031` were made idempotent.
- Production remains unchanged by this rehearsal and still requires the bridge,
  schema application, one-time import call and operator publication gate.

## Current production content reconciliation

- While release work was in progress, Vercel promoted production deployment
  `dpl_533Ribbd8KZHhm1dPUB3rrap1zLX` from content SHA `0c532b0`.
- That production SHA was integrated before release deployment so the new
  Ubud, Jimbaran, guide, catalogue and service-worker fixes are preserved.
- The content stream's already-applied `0030_enrich_remaining_wellness.sql`
  was archived as handoff evidence outside `supabase/migrations`; numbered
  migration `0030` remains owned by `0030_photo_consent.sql`.
- The combined tree passes all `57` Node tests, TypeScript, zero-warning lint
  and an optimized build containing `39` application routes.
- Combined preview `dpl_GTBvzWh4rDCUVYugXFnGw9LLDWuf` is `READY`; home,
  Ubud things-to-do, Jimbaran and places return `200`, while the production-only
  import route remains fail-closed with `404`.

## Production release completion — 2026-07-14

- Public domains are served by deployment
  `dpl_HQ17z3Ymh6N5sg6P7QeirQbteA1e` from runtime release commit `98c7c74`.
- The exact Data Ops package was imported atomically as `127 / 165 / 881 / 250`
  private draft menu/section/item/action rows.
- KYND Community is the sole newly published menu: `22` sections, `120` items,
  verified against the official May 2026 PDF and expiring on 2026-09-12.
- Only the official KYND cafe page and Seminyak WhatsApp action were published.
  The Canggu booking target and all photos remain closed.
- The remaining `126` partial menus and `248` package actions remain private
  drafts. Anonymous visibility is limited to the one verified KYND menu and its
  contents.
- One-time import/operator environment variables and temporary mutation or
  diagnostic deployments were removed. The unauthenticated production import
  endpoint returns `401`.
- Full release evidence is recorded in
  `docs/loop/PRODUCTION_RELEASE_COMPLETION_20260714.md`.

## Public menu coverage follow-on — 2026-07-14

- Menu implementation commit `eb74912` and the concurrent content line through
  `7e79ffa` were reconciled in release commit `35ac394`. The combined production
  deployment `dpl_5H7tUbge6zaChcJRhzaTN3zdNFpc` is aliased to
  `https://www.otherbali.com`.
- The exact digest/count-gated migration completed successfully and reported
  `1` verified full menu plus `126` public partial source snapshots (`127`
  total). `verified_at` remains null for every partial snapshot.
- All 127 detail routes were checked after activation and returned HTTP `200`.
  Partial pages show their official source and selected-items warning and are
  `noindex, follow`; only the verified KYND detail is present in the sitemap.
- The 81 reconciled venues without a structured menu remain future Data Ops
  coverage work. The 126 source snapshots must be refreshed or replaced by
  verified full menus before their 60-day freshness window expires.
- A transient alias replacement by the content-only deployment was detected
  during the live audit. The combined release now preserves both menu routes
  and the new Nusa Penida/safety/island-guide content; post-deploy checks passed
  for all 127 menu pages and the three new guide routes.
