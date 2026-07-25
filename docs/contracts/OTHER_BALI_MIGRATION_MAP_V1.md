# Other Bali — Migration Map V1

Status: `CONTRACTS_ONLY / DRY_RUN_ONLY`  
Recorded: 2026-07-25, Asia/Makassar  
Implementation: none; every row below is a later executable task, not an instruction to mutate data

## Migration record schema

Every migration requires: migration ID, current state, target state, owner decision, dependencies, preconditions, affected routes/tables/components/events, backfill, redirect strategy, rollback, dry-run, validation, monitoring, implementation task ID and blocked/unblocked status.

| ID | Current → target | Owner decision | Preconditions / dependencies | Rollback / validation | Task | Status |
|---|---|---|---|---|---|---|
| ROUTE-002-MAP | `/me` → `/my-bali` | ROUTE-002 | target route first; GuestRef state; internal links; canonical/robots/sitemap | preserve state; preview/prod regression; rollback to `/me` | `ROUTE-MY-BALI` | BLOCKED |
| ROUTE-001-MAP | `/my-day` → `/today` | ROUTE-001 | district/query/hash/event preservation; target output | analytics/SEO/regression; rollback to `/my-day` | `ROUTE-TODAY` | BLOCKED |
| ROUTE-DISTRICT-MAP | live `/bali/[district]/[intent]` → approved pillar/child candidates | Source of Truth | slug inventory, taxonomy and link graph | one-slug dry run; no mass redirect | `ROUTE-DISTRICT-AUDIT` | BLOCKED |
| ROUTE-VILLAS-MAP | current `/villas` → preserved target carrier | Source of Truth | current route/SEO/links | route snapshot + rollback | `ROUTE-VILLAS-PRESERVE` | BLOCKED |
| MONEY-001-MAP | legacy Sponsored fields/contracts → quarantined non-ranking legacy state | MONEY-001 | inventory read model/UI/admin/sales consumers | historical data preserved; assert no rank influence | `MONEY-SPONSORED-QUARANTINE` | BLOCKED |
| TODAY-001-MAP | long-list/island-wide fill → best/backup/contrast district-honest result | TODAY-001 | taxonomy, fit evidence, area key, freshness | district empty/partial regression; old carrier rollback | `TODAY-TRIPTYCH` | BLOCKED |
| MEDIA-PUBLISH-ALL | current authorized media → canonical `venue_photos` registry/public objects | MEDIA-002 | dry-run manifest, mapping/remediation review, target registry and rollback | object/hash/count parity; no deletion; legacy recovery queue | `MEDIA-PUBLISH-ALL` | REMEDIATION REVIEW COMPLETE / WRITE BLOCKED |
| TRUTH-001-MAP | hardcoded/weak freshness claims → field evidence/status/date | TRUTH-001 | Data Dictionary + taxonomy + source inventory | copy regression; unknown remains explicit | `TRUTH-EVIDENCE-REVIEW` | BLOCKED |

## MEDIA-PUBLISH-ALL dry-run contract

The dry-run manifest is `docs/contracts/OTHER_BALI_MEDIA_PUBLISH_ALL_DRY_RUN.csv`. It must contain storage bucket/path, source project, object existence, SHA-256, MIME, size, width, height, inferred/matched venue, scope, duplicate group, rights basis/reference, current DB reference, target record placeholder, primary candidate, action, blocker and remediation action.

Rules:

1. Exact duplicate bytes may share a canonical asset, but every valid logical association remains.
2. Duplicate rendering inside one gallery is forbidden.
3. Cross-venue reuse requires explicit `media_scope`.
4. Temporary blockers are missing object, corrupt file, invalid MIME, inaccessible legacy source, unresolved mapping, unsupported dimensions/format or hash collision requiring review.
5. Every blocker enters remediation; no silent discard.
6. `owner_confirmed_by`, consent/token rows, admin upload and candidate bucket location are not rights gates for MEDIA-002.
7. No bucket visibility change is part of this stage.

## Storage recommendation (not implemented)

**Option A — retain `owner-photo-candidates` as publication storage** is recommended for the current dry-run because 1,089 objects already resolve in the target project, 328 current venue URLs are public, and it minimizes copy/rollback risk. Separate intake and publication prefixes (`owner-candidates` and `confirmed-official-2026-07-24`) should remain explicit in the registry. Option B (copy to a dedicated canonical bucket) remains a later alternative if intake isolation, RLS or lifecycle operations require it. No visibility change is authorized now.

## Phase separation

Docs/dry-run → review/remediation approval → registry/backfill → public availability verification → primary/gallery render migration → legacy dependency removal → optional bucket policy review. Redirects, schema, UI and production deploys are separate tasks.
