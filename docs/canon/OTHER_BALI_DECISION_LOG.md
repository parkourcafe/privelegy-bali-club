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

## 2026-07-25 — MEDIA-002

The project owner confirms global publication permission for all valid images in the current project media inventory:

```text
SUPABASE_PROJECT: egkdapqwkfprtyqvvnso
STORAGE_SOURCE: owner-photo-candidates
RIGHTS_BASIS: PROJECT_OWNER_GLOBAL_PUBLICATION_AUTHORIZATION
PUBLICATION_INTENT: PUBLISH_ALL_VALID_MEDIA
DASHBOARD_REFERENCE: https://supabase.com/dashboard/project/egkdapqwkfprtyqvvnso/storage/buckets/owner-photo-candidates
```

Missing consent/token rows, a null `owner_confirmed_by`, admin upload, a shared confirmation timestamp and the current candidate bucket are not blockers for this existing inventory. Only the technical blockers listed in `OTHER_BALI_MEDIA_CONTRACT_V1.md` may temporarily block an item. No data or storage is modified in `CONTRACTS_ONLY`.

## 2026-07-25 — MEDIA-002 APPROVAL

Owner approval received:

> Утверждаю Media Contract V1 и разрешаю отдельный запуск MEDIA-PUBLISH-ALL.

The approval authorizes a separate `MEDIA-PUBLISH-ALL` execution task governed by the approved Media Contract. It does not authorize unrelated product, route, money, schema or navigation work. Execution must begin with a read-only inventory and preserve a remediation queue; no image may be silently discarded.

## 2026-07-25 — MEDIA-002 PREVIEW ACCEPTANCE

Owner visual acceptance received:

> Preview принимаю

Decision: the bounded MEDIA-002 preview sample is accepted. The acceptance
covers the 10 venue-photo routes recorded in
`MEDIA_PUBLICATION_POLICY_PREVIEW_BRANCH_RESULTS.csv`, including their desktop
and mobile rendering, image optimization and alt text. It does not authorize a
production deployment, production data or Storage writes, promotion or merge of
the Supabase preview branch, or deletion of that branch. Those remain separate
explicitly authorized operations.

The known full-staging blocker remains open: the preview branch is not a
complete staging database because its inherited migration history failed.

## 2026-07-30 — MESSAGING-001

```text
CANONICAL_PRODUCT_PROMISE:
The right place for the moment you’re in.

CAMPAIGN_LINE:
Discover Bali together.

PRODUCT_PROOF:
Resident-curated places, routes and plans for every Bali moment.

OUTCOME:
Less searching. More Bali.
```

Decision: `together` means choosing, sharing and planning with people the
traveller already knows. It does not authorize claims about finding new
friends, people search, public profiles, social matching, chat, dating or
collaborative Trip editing. Release-facing copy must describe only capabilities
verified in the exact shipped source. The full usage contract is recorded in
`OTHER_BALI_MESSAGING_SYSTEM.md`.
