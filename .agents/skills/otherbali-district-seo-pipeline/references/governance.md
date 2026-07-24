# Governance and publication gates

## Statuses

Topic status: `P0_UPDATE`, `P0_CREATE`, `P1_UPDATE`, `P1_CREATE`, `MERGE_INTO_EXISTING`, `HOLD`, `REJECT`.

Claim label: `EXTRACTED`, `INTERPRETED`, `UNVERIFIED`.

Claim publication status: `READY_FOR_CODEX_DRAFT`, `HOLD_EVIDENCE`, `HOLD_OWNER_CONFIRMATION`, `HOLD_FIELD_VERIFICATION`, `NEEDS_MANUAL_MAPS_CONFIRMATION`, `REJECTED`.

Pipeline state: `not_started`, `in_progress`, `complete`, `blocked`, `not_applicable`.

## Gates

1. Repository: route, canonical, sitemap and competing owners inventoried.
2. Intent: one distinct user decision and no duplicate active owner.
3. Evidence: every public factual claim has an allowed ledger row and valid source.
4. Dependency: required owner, field and Maps checks closed.
5. Editorial: brief, claim wording and visible copy agree.
6. Technical: canonical, robots, schema, SSR, sitemap, links and mobile pass.
7. Release: independent review passed; commit and preview exist.
8. Production: separately authorized after all preceding gates.

Any failed mandatory gate prevents publication. It does not block other independent topics.
