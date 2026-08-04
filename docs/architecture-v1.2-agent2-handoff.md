# Architecture v1.2 — Agent 2 mobile UX handoff

## Discovery evidence

- Worktree: `other-bali-v12-mobile`
- Branch: `codex/arch-v12-mobile`
- Baseline: `33e0fcd149e59607a353d1b5c9dc647d646e5647`
- Existing shell: Capacitor 8 + React, read-only `/api/mobile/v1`, native
  Preferences snapshots, external Google Maps handoff.
- Existing public mobile payload has compact venue facts but no feed session,
  reason/freshness fields, route-safe coordinates or v1.2 `PlaceAction` array.

## Implemented boundary

`discovery-model.ts` is a presentation adapter. It preserves API order and
does not calculate fit or create a second recommendation engine.

| Action | Current behavior | Required shared contract |
| --- | --- | --- |
| Save | Persists existing venue snapshot | Existing Preferences contract |
| Add to today | Visible, session-only notice | Agent 3 Today mutation |
| Add to trip | Honest blocked notice | Agent 3 Trip mutation |
| Go now | Loads exact venue detail then verified Maps handoff | Existing exact Maps URL; future `directions` PlaceAction |
| View details | Opens current venue detail; back restores card | Existing venue detail |
| Book / Delivery / Website / Instagram / WhatsApp | Hidden | Agent 1 verified PlaceAction array |

Dynamic ETA and opening state are deliberately hidden. The current payload
cannot prove source/freshness. Map view is not faked without route-safe
coordinates; filtered List is available and uses the same published universe.

## Accessibility and QA

- All targets are native buttons/inputs/selects and at least 48 px high.
- Discover exposes explicit Previous/Next controls; no gesture-only dependency.
- Focus-visible styling is retained.
- Reduced-motion media query is retained.
- Media fallback is labelled and is not presented as venue photography.
- Browser QA: Chrome, 390 × 844, mock read-only API, 27 July 2026.
- Verified: Discover renders; Next moves 1/2 → 2/2; Details → Back restores
  `Ubud Reset` at 2/2; all quick actions have accessible names.
- Screenshot: `/private/tmp/other-bali-mobile-discover-390.png`
- No physical-device, screen-reader or switch-control claim was made.

## Unresolved dependencies

1. Agent 1: `DiscoveryCardTruth` and `PlaceAction` runtime mapper including
   media rights, scoped freshness, opening/travel source and action verification.
2. Agent 3: durable Today/Trip mutations, offline action queue and route-safe
   map coordinates.
3. Feed API: cursor/session persistence for reload/background and cursor errors.
4. Decision API: Best/Backup/Contrast. The UI refuses client-side guessed rank.

## Rollback

Revert the Agent 2 commit. No migration, production data, URL, native permission
or deployment configuration is changed.
