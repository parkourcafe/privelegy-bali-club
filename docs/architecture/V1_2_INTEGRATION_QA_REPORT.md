# Other Bali v1.2 — Integration QA report

## Scope

Integrated in dependency order: Agent 1 data contracts, Agent 3 journey
contracts, Agent 2 mobile selection experience, then independent QA.
No production database, provider account or deployment was contacted.

## Verified

- Owner-approved v1.2 authority is recorded in the governing documents.
- Import validation is fail-closed, idempotent and performs no writes.
- Place actions, field verification and media truth are additive contracts.
- Trip/Event/Route/Level 1–2 offline contracts remain provider-neutral.
- Discover and Map/List consume the same ordered published venue input.
- Paid state does not change the presentation adapter order.
- Explicit Previous/Next and primary card actions have native button paths.
- Provider failure returns an exact external Maps fallback, never fake success.
- All 19 required stable error codes have HTTP, retry, fallback and severity metadata.

## Warnings and blocked gates

- Migration `0060` is review-only and has not been compared with the live
  migration ledger or applied.
- The existing repository contains duplicate historical migration numbers.
- UI still adapts the current mobile v1 payload; runtime `DiscoveryCardTruth`,
  durable feed sessions and the shared Decision API are not implemented.
- Today/Trip and sync are domain contracts, not yet persistent APIs.
- Provider pricing, licence, caching, attribution, Bali route quality,
  platform parity and privacy remain unknown pending the required spike.
- Real-device iOS/Android, screen-reader and airplane-mode QA remain blocked.
- Next.js and its matching ESLint config were patch-updated from `16.2.10` to
  `16.2.12`, closing the direct Next.js advisories reported for `<16.2.11`.
- Production audit still reports two linked high advisories because Next.js
  `16.2.12` currently permits Sharp `^0.34.5`, while the inherited libvips
  advisory marks Sharp `<0.35.0`. No unsupported override or major downgrade
  was applied; this remains an upstream dependency gate.

## Release recommendation

`PASS_WITH_WARNINGS` for a reviewable, feature-flagged development slice.
`BLOCKED` for production migration, import, provider activation or deployment
until owner approval and the remaining gates above are closed.

## Rollback

Revert the QA integration commits in reverse order. If migration `0060` is ever
approved and applied, first verify dependencies, then drop
`place_actions_v1_2`, followed by `field_verifications`.
