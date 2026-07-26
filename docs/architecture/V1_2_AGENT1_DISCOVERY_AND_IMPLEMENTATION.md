# v1.2 Agent 1 — discovery and implementation note

## Read-only discovery

- Repository: `other-bali-v12-data`
- Branch: `codex/arch-v12-data`
- Baseline HEAD: `33e0fcd149e59607a353d1b5c9dc647d646e5647`
- Initial dirty state: clean
- Remote: `origin` → `parkourcafe/privelegy-bali-club`
- Runtime: Next.js 16, React 19, TypeScript, Supabase, Capacitor 8.
- Canonical Place is `venues`; creating a second Place model is prohibited.
- Existing action truth is `venue_action_capabilities`; Maps remains
  `venues.gmaps_url` in the current implementation.
- Existing evidence foundations include `venue_fact_sources`, immutable
  menu/action snapshots, source manifests, per-image consent/submission data
  and deterministic Data Ops compilation.
- Saved uses `GuestRef` and `saved_places`; trip extension migrations 0056/0057
  exist. Visited is not a clearly established canonical persisted contract in
  the inspected data layer.
- Migration numbers 0015–0035 contain duplicates. README explicitly says the
  live migration ledger is not reconciled and migrations must not be applied.
- Production database state, route-safe coordinate coverage, media-rights
  coverage and provider terms remain unknown.

## Chosen slice

The smallest complete Agent 1 slice:

1. synchronize governing documents with the owner-approved v1.2 authority;
2. publish additive TypeScript contracts without changing runtime reads;
3. add a review-only FieldVerification migration and a compatibility view over
   the existing action table;
4. add deterministic, no-write import validation with required error families;
5. test missing sources, broken/wrong actions, coordinates, duplicates and
   branches, media rights, taxonomy, evidence conflicts and idempotency;
6. emit the required dry-run artifacts against a synthetic fixture.

## Safety and rollout

- No production or staging database was contacted.
- No import or migration was applied.
- Migration 0060 is a review artifact until migration-history reconciliation,
  isolated staging apply and owner approval.
- Rollback before apply: revert the commit.
- Rollback after a future approved apply: drop `place_actions_v1_2` and
  `field_verifications` only after confirming no downstream consumer or
  evidence row depends on them.
