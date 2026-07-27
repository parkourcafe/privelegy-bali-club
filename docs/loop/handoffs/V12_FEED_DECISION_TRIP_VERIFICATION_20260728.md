# Other Bali v1.2 — Feed, Decision and Trip verification

Date: 2026-07-28  
Branch: `codex/v12-feed-decision-trip`

## Implemented

- Added a mobile Feed API with exact district/category filtering, bounded opaque
  cursors, deterministic organic ordering and truthful reason/freshness fields.
- Made Discover, Map/List and Decision use the same published venue candidate
  universe. Paid status does not influence ordering or scoring.
- Added bounded mobile feed parsing, timeout handling and complete-page loading.
- Added cross-session local Feed resume with policy-version validation and an
  explicit fallback when the last entity is no longer available.
- Reworked Decision to rank the shared candidate universe with exact area,
  budget, company and energy inputs. Partial results remain honest and do not
  duplicate or cross-fill candidates.
- Extended Trip with canonical 3/5/7/10-day plans, ready-made route adaptation,
  replace, remove, reorder, move between days, skip/restore, visited state and
  bounded editable notes.
- Added event lifecycle reconciliation: published cancellations remain available
  only until verification expiry so stale Today/Trip entries can be invalidated;
  cancelled events are never treated as usable.
- Regenerated the tracked native web bundle in `ios-web`.

## Verification

- `npm run test:v12:integration` — 99 passed, 0 failed.
- `npx tsc --noEmit --incremental false` — passed.
- `npm run lint` — 0 errors; one pre-existing `no-img-element` warning in
  `PhotoReviewPanel.tsx`.
- `git diff --check` — passed.
- `npm run build` — production Next.js build passed.
- `npm run mobile:build` — native web bundle generated successfully.

## Truthful boundary

This release closes the core Feed/Decision/Trip gate. The following broader
second-queue enhancements are not represented as completed by this handoff:

- server-account cross-device Feed resume (local cross-session resume is live);
- short vertical video and explicit data-saving controls;
- Hide/Not interested/Similar feedback and personalization consent;
- Trip reminders, memories, rich checklist and web-plan deep links.

They are separate product enhancements and are not prerequisites for beginning
the explicitly ordered Offline Level 3 work.

## Operational dependencies

- Production migration application/verification still requires credentials for
  Supabase project `egkdapqwkfprtyqvvnso`.
- Offline Level 3 remains fail-closed until provider capability and physical
  device acceptance gates are satisfied.
