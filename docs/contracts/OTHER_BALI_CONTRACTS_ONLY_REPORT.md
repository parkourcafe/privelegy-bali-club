# Other Bali — CONTRACTS_ONLY Report

Status: `DRY_RUN_ONLY`; no implementation executed  
Recorded: 2026-07-25, Asia/Makassar  
Repository: `other-bali-t0-diagnostics`  
Baseline: `026a314` plus docs-only contract/media commits

## Files inspected

- `AGENTS.md`;
- `docs/canon/OTHER_BALI_DECISION_LOG.md`;
- `docs/canon/OTHER_BALI_SOURCE_OF_TRUTH.md`;
- `docs/canon/OTHER_BALI_ROUTE_DECISIONS.md`;
- `docs/canon/OTHER_BALI_MONEY_MODEL_DECISION.md`;
- `OTHER_BALI_MASTER_ARCHITECTURE_V3_1_CORRECTED.md`;
- `OTHER_BALI_PUBLIC_EXPERIENCE_ARCHITECTURE_1.md`;
- `OTHERBALI_CODEX_FINAL_TZ_V1.md`;
- four T0 diagnostic artifacts;
- relevant Supabase migrations and media code paths;
- read-only Supabase project `egkdapqwkfprtyqvvnso`.

## Fresh Supabase snapshot

Snapshot: `2026-07-25 01:12 Asia/Makassar` (`2026-07-24T17:12:21.776Z` UTC). It is an observed snapshot, not a permanent constant.

| Carrier | Observed |
|---|---:|
| storage objects | 1,089 |
| `owner-candidates` objects | 1,041 |
| `confirmed-official-2026-07-24` objects | 48 |
| total bytes | 423,061,456 (~403.46 MiB) |
| technically valid objects | 1,089 / 1,089 |
| unique SHA-256 hashes | 988 |
| duplicate groups / assets | 79 / 180 |
| venues | 838 |
| venues with `photo_url` | 419 |
| `venue_photo_submissions` | 101 (87 draft, 14 approved) |
| `venue_photos` target registry rows | 48 |
| `venue_photo_consents` / `venue_photo_tokens` | 0 / 0 |
| approved submissions referencing legacy project | 4 |
| unavailable legacy-project URL references | 91 |
| venue without any `photo_url` | 419 |

The dry-run manifest is `OTHER_BALI_MEDIA_PUBLISH_ALL_DRY_RUN.csv` with 1,180 rows: 1,089 storage objects, 91 inaccessible legacy URL references and submission references folded into the current source mapping. One mapping mismatch requires remediation: `lava-gastrobar-and-grill` vs `lava-gastrobar-grill`. Valid files are not discarded.

## Contracts created

- `OTHER_BALI_DATA_DICTIONARY_V1.md` — field-level current-to-target contract;
- `OTHER_BALI_TAXONOMY_V1.md` — controlled vocabularies and navigation boundary;
- `OTHER_BALI_MIGRATION_MAP_V1.md` — later executable migration records and rollback;
- `OTHER_BALI_CONTRACTS_VALIDATION_MATRIX.csv` — T0 conflict-to-contract/task matrix;
- `OTHER_BALI_MEDIA_CONTRACT_V1.md` — approved MEDIA-002 media rights contract;
- `OTHER_BALI_MEDIA_PUBLISH_ALL_DRY_RUN.csv` — read-only manifest;
- this report.

## Current-to-target and contradictions

- `/me` remains current; `/my-bali` target only after state/link/canonical/regression review.
- `/my-day` remains current; `/today` target only after preservation and district-honest output review.
- Sponsored fields and copy remain legacy evidence; they are mapped but unchanged.
- `venue_photos` is the target public registry, currently empty; no rows were created.
- Legacy external URLs are inaccessible and enter recovery/remediation, not silent discard.
- Today requires best/backup/contrast and explicit partial/empty; no island-wide fill is implemented.

## Verification performed

- service-read recursive storage listing;
- service-read `venues` and `venue_photo_submissions` queries;
- HTTP object retrieval;
- SHA-256 hashing;
- MIME/size/dimension validation with `sharp`;
- duplicate grouping;
- venue/object slug mapping;
- no writes, deletes, bucket policy changes, schema changes, route changes or deploy.

## Implementation tasks produced

`MEDIA-PUBLISH-ALL` (future write phase), `ROUTE-MY-BALI`, `ROUTE-TODAY`, `ROUTE-DISTRICT-AUDIT`, `ROUTE-VILLAS-PRESERVE`, `MONEY-SPONSORED-QUARANTINE`, `TODAY-TRIPTYCH`, `TRUTH-EVIDENCE-REVIEW`, `DATA-DICTIONARY-IMPLEMENT` and `TAXONOMY-IMPLEMENT`.

## Owner decisions still required

1. mapping resolution for `lava-gastrobar-and-grill` ↔ `lava-gastrobar-grill`;
2. remediation/recovery treatment for 91 inaccessible legacy URLs;
3. approval of Data Dictionary/Taxonomy/Migration Map drafts before implementation;
4. later decision between retained authorized bucket and dedicated publication bucket after runtime dependency review.

## Gate

No `READY_FOR_P0_IMPLEMENTATION` is set. The exact final gate is in the handoff response; this commit authorizes documentation and dry-run evidence only.
