# WhatsApp contact batch

Source: `ALL_RESTAURANTS_CAFES_FOUND.csv` — an external WhatsApp-lookup pass over Bali
restaurants & cafés (71 venues with a number found; captured 2026-07-19).

## How it was loaded

Each of the 71 rows was deduped against the catalogue (`supabase/migrations/*.sql` +
`data/data-ops/coverage/canonical-venue-registry.json`) and split:

- **63 already-existing venues → enriched in `supabase/migrations/0038_whatsapp_contact_enrichment.sql`.**
  Non-destructive `coalesce` UPDATEs fill `whatsapp` (and, where present, `instagram_url`
  and a real Google Maps place link) only when the field is currently empty. `whatsapp`
  is stored digits-only/intl for the `wa.me` action gateway.
- **8 not-yet-in-catalogue candidates → `new-warung-candidates.json` (this dir), `needs_verification`.**
  Held unpublished because their existence / identity / district could not be confirmed
  from an official source (fuzzy Instagram matches, a directory number, a possible
  duplicate of `Warung Biah Biah`, a differently-spelled account for D'Buchu).

## Data-quality handling

- **WhatsApp numbers** arrived in a float format (`628…0`); converted via `int(float())`,
  not digit-stripping, to avoid a spurious trailing `0`. All verified to `62 8…` mobile
  format and to match the source integer exactly.
- **District mislabels** corrected: a large cluster was tagged `seminyak`; districts were
  re-derived from the venue name (e.g. `Warung Ceria Uluwatu → uluwatu-bukit`).
- **Google Maps**: only real place / short links were loaded; bare `?query=` search links
  were skipped.

## Verification

- All 63 UPDATE target slugs confirmed to exist in the repo; no duplicate targets.
- Numbers are public venue business contacts for the ordering gateway, not personal PII.
- Migration is idempotent (coalesce) and applies to existing live rows only.
- **Production apply is a separate step** — this commit prepares the migration; it is not
  auto-applied.

## Promotion path for the 8 candidates

Confirm the venue is real, distinct and correctly located (address + Google Maps), set the
final district/category, then insert via a follow-up migration.
