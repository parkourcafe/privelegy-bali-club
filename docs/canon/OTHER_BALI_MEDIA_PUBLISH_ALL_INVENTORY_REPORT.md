# Other Bali — MEDIA-PUBLISH-ALL Read-only Inventory Report

Status: `PARTIAL INVENTORY / WRITE BLOCKED`  
Recorded: 2026-07-25, Asia/Makassar  
Target Supabase project: `egkdapqwkfprtyqvvnso`  
Approved contract: `MEDIA-002`

## Evidence collected

The target public API was queried read-only. No database or storage mutation was performed.

| Source | Result |
|---|---:|
| `venues` rows visible through public read | 627 |
| `venues.photo_url` references | 419 |
| target project `egkdapqwkfprtyqvvnso` photo URLs | 328 |
| target project photo URLs returning HTTP 200 | 328 |
| legacy project `xvhxyohqkkpaynrgrvvb` photo URLs | 91 |
| legacy project URLs returning HTTP 400/error | 91 |
| venues without `photo_url` | 208 |
| public list response for `owner-photo-candidates` | 0 objects |
| `venue_photo_submissions` public read | denied (`42501`) |

The 328 available target URLs are under the existing `venue-photos` public path. The 91 legacy URLs point to a different Supabase project and cannot be treated as available migration sources. The public `owner-photo-candidates` list returning zero is not proof that a restricted bucket is empty; a service-role inventory is still required.

## Inventory gaps

The following required MEDIA-PUBLISH-ALL sources remain unverified because the current approved local credential file does not target `egkdapqwkfprtyqvvnso`:

- all storage objects in `owner-photo-candidates` with object metadata;
- all `venue_photo_submissions` rows;
- content hashes and decoded dimensions for candidate objects;
- duplicate hash groups;
- complete unmatched venue-slug resolution.

## Current blockers

1. Correct target-project read-only/service credential pair is required for the bucket and submissions inventory.
2. The legacy project URLs need a later accessible-source/remediation decision; they must not be silently discarded.
3. No canonical MediaAsset records exist yet for this task, so no primary/gallery assignment has been written.

## Safety statement

- no image was deleted or discarded;
- no row was updated;
- no object was copied;
- no bucket visibility changed;
- no production page or runtime dependency changed.

The next permitted action after correct target credentials are available is to complete the service-read inventory, compute hashes/dimensions, resolve mappings and produce the `MEDIA-PUBLISH-ALL` implementation batch. Writes remain blocked until that inventory is complete.
