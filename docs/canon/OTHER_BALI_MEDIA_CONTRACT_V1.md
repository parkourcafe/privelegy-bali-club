# Other Bali — Media Contract V1

Status: `APPROVED FOR SEPARATE MEDIA-PUBLISH-ALL EXECUTION`  
Recorded: 2026-07-25, Asia/Makassar  
Owner decision: `MEDIA-002`  
Supabase project: `egkdapqwkfprtyqvvnso`  
Current storage source: `owner-photo-candidates`  
Rights basis: `PROJECT_OWNER_GLOBAL_PUBLICATION_AUTHORIZATION`  
Publication intent: `PUBLISH_ALL_VALID_MEDIA`

## Owner authorization

The project owner grants global public-publication permission for every valid image in the current project media inventory. The following are not publication blockers for this inventory: a missing `venue_photo_consents` row, a missing `venue_photo_tokens` row, `owner_confirmed_by = NULL`, admin upload, a shared `owner_confirmed_at` timestamp, or storage under `owner-photo-candidates`.

No image may be silently discarded. A temporary technical blocker must be explicit and queued for remediation.

## Canonical media record

Every inventory item must resolve to one canonical media record with these fields:

| Field | Contract |
|---|---|
| `id` | stable canonical identifier |
| `entity_type` / `entity_id` | mapped venue/property/brand or other approved entity |
| `media_scope` | `entity_primary`, `entity_gallery`, or explicitly approved cross-entity scope |
| `content_hash` | deterministic hash for duplicate detection |
| `object_locator` | bucket/path or migrated public object locator |
| `object_exists` | checked boolean with check timestamp |
| `width` / `height` | decoded pixel dimensions |
| `mime_type` / `byte_size` | validated technical metadata |
| `provenance` | source bucket, submission, venue reference or external URL |
| `rights_basis` | `PROJECT_OWNER_GLOBAL_PUBLICATION_AUTHORIZATION` for this inventory |
| `rights_grant_reference` | `MEDIA-002` plus inventory/source reference |
| `publication_status` | `candidate`, `ready`, `published`, `blocked`, `remediation`, `unpublished` |
| `role` | `primary` or `gallery` |
| `alt_text` | factual accessible description; no invented claims |
| `credit_line` | required where source/credit terms apply; otherwise explicit `not_required` |
| `created_at` / `verified_at` | record and technical verification timestamps |

## Validity and blockers

An image is valid when the object is accessible, decodes successfully, has an allowed image MIME, has dimensions, has a resolved entity mapping, has a content hash and has the owner rights basis above. Temporary blockers are limited to:

- missing object;
- inaccessible legacy source;
- corrupt file;
- invalid MIME;
- unresolved entity mapping;
- invalid technical format;
- duplicate canonicalization.

For duplicates, retain the authorized canonical asset, prevent duplicate rendering inside one gallery, and permit reuse across entities only when `media_scope` explicitly permits it.

## Required final state: MEDIA-PUBLISH-ALL

- every valid authorized image has a canonical media record;
- every mapped image is publicly available;
- each venue has one primary image;
- remaining authorized images appear in its gallery;
- unresolved images are in a visible remediation queue;
- no production page depends on an unavailable legacy project;
- `owner-photo-candidates` visibility changes only after runtime dependencies have migrated.

This contract is approved for the separately authorized `MEDIA-PUBLISH-ALL` task. The current `CONTRACTS_ONLY / DRY_RUN_ONLY` phase authorizes inventory and manifest generation only, not data mutation, storage changes, public bucket changes or runtime implementation.
