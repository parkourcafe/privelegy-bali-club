-- Dedupe duplicate venue rows ("twins").
--
-- Root cause: the 0015/0016 imports created two rows for the same physical
-- venue under two slug spellings — one made `active` and enriched (area,
-- price, jobs, etc.), its twin left `inactive`/`archived`, empty, richness ~1.
-- Listing queries filter status='active' so only the canonical row shows in the
-- day-builder, BUT getVenueBySlug() has no status filter, so a stale twin slug
-- can still render a thin detail page if hit directly / indexed. This collapses
-- each pair to the single canonical (active) row.
--
-- Detection: normalize name (lowercase, strip punctuation + generic noise
-- words like restaurant/cafe/bali/canggu — NOT area words, so genuine branches
-- such as "Neighbourhood Food Berawa" vs "…Seseh" are preserved) and group
-- within district. 32 pairs found; verified against prod 2026-07-12.
--
-- Safety: every DELETE is double-guarded — slug must be in the explicit loser
-- list AND status <> 'active', so an active/canonical row can never be removed
-- even by a typo. Of the 31 losers, 30 have NO perks and NO plan_entries
-- (checked) and are deleted outright. The 1 exception, 'la-brisa', is inverted
-- (the archived twin is the richer one and carries a live perk + a plan_entry),
-- so it is MERGED into its active twin 'la-brisa-bali' first, then deleted.
--
-- Data-only. No schema change. No money model / QR / TablePilot logic touched;
-- the la-brisa perk is repointed (preserved), not created or billed.

begin;

-- ── 1. la-brisa special case: merge archived-but-rich twin into active twin ──
-- 1a. Backfill only the fields the active survivor is missing (never overwrite).
update public.venues as survivor
set price_anchor = coalesce(nullif(survivor.price_anchor, ''), src.price_anchor),
    jobs         = case
                     when survivor.jobs is null or array_length(survivor.jobs, 1) is null
                     then src.jobs else survivor.jobs
                   end
from public.venues as src
where survivor.slug = 'la-brisa-bali'
  and src.slug = 'la-brisa';

-- 1b. Repoint the live perk + the plan_entry onto the surviving slug so they
--     are not orphaned by the delete. (Makes the "Sunset drink upgrade" perk
--     live on the active La Brisa — intended.)
update public.perks        set venue_slug = 'la-brisa-bali' where venue_slug = 'la-brisa';
update public.plan_entries set venue_slug = 'la-brisa-bali' where venue_slug = 'la-brisa';

-- ── 2. Delete all 31 stale twins (guarded: never an active row) ──
delete from public.venues
where status <> 'active'
  and slug in (
    -- canggu
    '12-kitchen-wine','warung-dandelion','la-brisa','luigi-s-hot-pizza','luma-bali',
    'sa-mesa-canggu','bar-vera-bistro-wine-bar','cafe-vida-healthy-organic-restaurant-can',
    -- jimbaran
    'akua-mediterranean-restaurant','bawang-merah-beachfront-restaurant','dava-steak-seafood',
    'ko-japanese-teppanyaki-sushi','nelayan-restaurant-puri-bar','nyoman-caf',
    'sunset-beach-bar-grill','unique-rooftop-bar-restaurant',
    -- sanur
    'jalapeo','segara-the-seaside-bar-restaurant',
    -- seminyak
    'bambu-restaurant','ling-ling-s-bali','mama-san','sangsaka-restaurant',
    -- ubud
    'alchemy-bali','casa-luna-restaurant','cascades-restaurant','the-elephant-restaurant-and-bar',
    'ibu-rai-restaurant','laka-leke-restaurant','the-seeds-of-life-cafe',
    -- uluwatu-bukit
    'el-kabron','single-fin-bali'
  );

commit;
