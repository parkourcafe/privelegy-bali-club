# Other Bali — MEDIA-PUBLISH-ALL Read-only Inventory Report

Status: `READ-ONLY INVENTORY COMPLETE / WRITE BLOCKED`  
Recorded: 2026-07-25, Asia/Makassar  
Target Supabase project: `egkdapqwkfprtyqvvnso`  
Approved contract: `MEDIA-002`

## Evidence collected

The target public API was queried read-only. No database or storage mutation was performed.

| Source | Result |
|---|---:|
| `venues` rows visible through service read | 838 |
| `venues.photo_url` references | 419 |
| target project `egkdapqwkfprtyqvvnso` photo URLs | 328 |
| target project photo URLs returning HTTP 200 | 328 |
| legacy project `xvhxyohqkkpaynrgrvvb` photo URLs | 91 |
| legacy project URLs returning HTTP 400/error | 91 |
| venues without `photo_url` | 419 |
| storage objects in `owner-photo-candidates` | 1,089 |
| `confirmed-official-2026-07-24` objects | 48 |
| `owner-candidates` objects | 1,041 |
| `venue_photo_submissions` rows | 101 |
| submission statuses | 87 `draft`, 14 `approved` |
| technically valid objects | 1,089 / 1,089 |
| unique SHA-256 hashes | 988 |
| duplicate hash groups / assets | 79 groups / 180 assets |

The 328 available target URLs resolve to the target project’s published `owner-photo-candidates` or `confirmed-official-2026-07-24` paths. The 91 legacy URLs point to a different Supabase project and cannot be treated as available migration sources. Recursive service inventory found the full 1,089-object set.

## Mapping and validation findings

The following required sources are now inventoried:

- all storage objects with object metadata;
- all `venue_photo_submissions` rows;
- content hashes and decoded dimensions for every object;
- duplicate hash groups;
- venue mappings and legacy URL references.

One unresolved mapping remains: storage slug `lava-gastrobar-and-grill` versus venue slug `lava-gastrobar-grill`. It is queued for remediation and no image is discarded.

## Current blockers before writes

1. The 91 legacy project URLs need an accessible-source/remediation decision; they must not be silently discarded.
2. The one unmatched venue slug needs explicit mapping review.
3. Canonical MediaAsset records, primary/gallery assignments and public migration have not been written yet.

## Safety statement

- no image was deleted or discarded;
- no row was updated;
- no object was copied;
- no bucket visibility changed;
- no production page or runtime dependency changed.

The read-only inventory is complete. The next permitted action is a separate implementation batch that resolves the two remediation classes above, creates canonical MediaAsset records, migrates valid objects and assigns primary/gallery roles. Writes remain blocked until that batch is explicitly started.
