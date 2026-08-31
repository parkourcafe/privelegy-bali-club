# AVLI production publication record

**Authorization:** owner explicitly authorized publication of the AVLI page on
2026-08-30.

**Production project:** `bali-privilege` (`egkdapqwkfprtyqvvnso`)

## Applied records

- Venue: `v_import_avli_bali`, slug `avli-bali`
- Venue state: `status=active`, `publication_status=published`,
  `editorial_status=review`
- Canonical district: `uluwatu-bukit`
- Verification: `2026-08-30T04:42:40Z`; source is the official AVLI website
  and official Maps handoff
- Maps identity: the short URL and coordinates are stored; `/g/11xghttkxm` is
  retained as an evidence token and is intentionally not stored as a
  `google_place_id` because it is not a standard Place ID.
- Menu: `50b3a1f4-076e-4ebb-a25c-105e3096173f`, version 1
- Menu state: `source_snapshot`, `partial`, `food`
- Menu coverage: 2 sections, 13 items; source snapshot published at
  `2026-08-30T06:00:00Z`; expires `2026-09-30T04:42:40Z`

## Verification performed

1. Exact read-only dedupe by AVLI name, proposed slug, official domain, Maps
   URL and Google token returned no prior AVLI row.
2. One-row venue insert dry-run completed and was rolled back successfully.
3. Atomic production transaction inserted the venue, menu, sections and items;
   the menu was promoted from `draft` to `source_snapshot` only after its
   sections and items existed, satisfying the production trigger.
4. Production read-back confirmed the venue fields, coordinates
   `-8.8165625,115.0958125`, open-ended `Monday-Sunday 5pm-late`, and menu
   counts `2 sections / 13 items`.

## Scope boundaries

- The menu is explicitly a partial selection from the official image menus, not
  the full restaurant menu.
- The exact street-and-number address remains unconfirmed; the page carries the
  official locality and Maps coordinates without inventing a street address.
- No Uluwatu guide edit was made.
- The production URL remains unverified until PR #305 is merged and deployed;
  the current PR is still a draft and the live URL returned 404 during this run.
