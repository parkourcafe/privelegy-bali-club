# Other Bali — Decision Log

Status: active reconciliation log  
Recorded: 2026-07-25, Asia/Makassar  
Decision owner: Selena  
Scope: canonical governance only

This log records the owner decisions supplied for the current reconciliation run. Historical documents are not rewritten.

## 2026-07-25 — ROUTE-001

```text
CURRENT_LIVE_CANONICAL: /my-day
TARGET_CANONICAL: /today
REDIRECT_NOW: NO
MIGRATION: only after preservation review and approved Migration Map V1
```

Decision: keep `/my-day` as the current live canonical. Do not create a redirect or change links in this stage. A future `/today` migration requires route inventory, internal-link and analytics preservation, canonical/SEO review, regression tests and an approved Migration Map V1.

## 2026-07-25 — ROUTE-002

```text
CURRENT_LIVE_CANONICAL: /me
TARGET_CANONICAL: /my-bali
REDIRECT_NOW: NO
MIGRATION: create and validate /my-bali first; redirect /me only after
state preservation, internal-link, canonical and regression review
```

Decision: `/me` remains the current live Saved carrier. No `/my-bali` route, redirect or navigation migration is implemented here.

## 2026-07-25 — MONEY-001

```text
ONLY PAID PRODUCT:
fixed fee per confirmed seated reservation through supported attribution

FORBIDDEN:
sponsored visibility tier
paid organic ranking
Featured paid placement
paid route placement
category sponsorship
```

Decision: public Sponsored contracts and old trial/listing language are legacy/conflicting implementation evidence, not authority. No commercial copy or runtime money code is changed in this stage.

## 2026-07-25 — TODAY-001

`/my-day` must eventually return a district-honest short result:

1. best choice;
2. backup;
3. contrast.

No silent island-wide fill is allowed when the selected district lacks enough results. A partial or empty state must be explicit. This is a future implementation contract, not a code change in the current stage.

## 2026-07-25 — TRUTH-001

- no hardcoded place/district counts unless generated from canonical data;
- `verified` requires status and/or date;
- `open now` requires verified current hours;
- official actions are shown only when individually verified;
- unknown remains explicit.

## Decision mechanics

Any URL, money, schema, publication or ranking change requires a new dated owner decision and, where applicable, approved Data Dictionary/Taxonomy/Migration Map entries. Competitive findings cannot override this log.

## 2026-07-25 — CONTRACTS-001

The first `CONTRACTS_ONLY` draft set was created:

- `OTHER_BALI_DATA_DICTIONARY_V1.md`;
- `OTHER_BALI_TAXONOMY_V1.md`;
- `OTHER_BALI_MIGRATION_MAP_V1.md`.

This records document creation only. Approval is pending; no schema, migration, route, UI, event or money implementation is authorized.
