# Nusa Dua district product — 2026-07-13

Sixth deep district, same shape as Seminyak (planning_only resort enclave).
Migration: `0029_nusa_dua_wellness.sql`, applied to prod.

## Data
Nusa Dua's restaurants were already enriched (12 publishable) and its Reddit
flagships (Bumbu Bali, Koral, Kayuputi, Cucina, Soleil) were already in the
catalogue. The gap was wellness:
- **Enriched 9 empty rows** — resort spas (Mulia Spa, The Apurva Spa, Kriya at
  Grand Hyatt, REVĪVŌ), three hotel fitness centres, and two resort yoga
  programmes — all verified against the resorts' official sites.
- **Added 1 new row** — **Warung Dobiel** (Pak Dobiel babi guling, Bualu), the one
  genuinely-missing local contrast to the resort dining, from the Reddit signal-A
  list. Daytime-only, so `jobs = [local_food_calm]` (dropped `just_landed_easy_dinner`
  — no dinner service).

**Nusa Dua: 13 → 23/23 active venues publishable.**

Fitness centres are complimentary in-house guest facilities, so `price_anchor` is
null for those; they carry a `what_to_order` facility line, so they still clear the
publication gate honestly.

## Code — /nusa-dua pillar + guides
- `lib/nusa-dua.ts` (planning_only — no money loop) + `lib/nusa-dua-guides.ts` +
  `components/NusaDuaGuideView.tsx`.
- `/nusa-dua` pillar + 2 guides: **best-restaurants** (restaurant+warung+beach_club),
  **spas-wellness** (spa+fitness+yoga).
- Registered in `lib/pillars.ts` (sitemap/llms/bali auto-pick-up) + added to
  `HUB_EXCLUDE_DISTRICTS` so `/bali/nusa-dua` no longer competes.
- `/places/[slug]`: Nusa Dua breadcrumbs + category→guide links.

## Guardrails
No review text/ratings (#1); `best_for`/`not_for` WHO/WHEN only (#7); planning_only,
no money loop (#4); existing categories only (#11). Venue detail pages stay `noindex`
until the photo-consent flow.

## Note
Nusa Dua has some obvious inactive duplicate rows in the catalogue (Bejana ×2,
Tetaring ×2, The Beach Grill ×2) — inactive, not shown, left for an optional dedup
pass.
