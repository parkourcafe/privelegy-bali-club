-- Seminyak brunch enrichment — from the verified "Best brunch in Seminyak"
-- research (deepresearchreport_4). The Seminyak brunch spoke already publishes
-- (Sisterfields, Biku, Pison Petitenget, Sea Circus + one more), so this only
-- adds the two missing picks and cleans one stray duplicate.
--
-- 1. KYND Community (kynd-community): exists but inactive and empty. Activate,
--    enrich, and tag brunch — the district's strongest plant-forward brunch.
-- 2. Watercress Seminyak: not in the catalogue — add it (north Batu-Belig edge).
-- 3. pison-seminyak: a stray INACTIVE duplicate of the active pison-petitenget
--    that 0018's detector missed (the area suffix differs, so the normalized
--    keys didn't collapse). Empty, no perks/plan_entries — delete it, guarded to
--    inactive only.
--
-- GUARDRAIL FILTERING (same as 0019): no Google ratings/review counts (#1);
-- research "Limitations/complaints" survive only as WHO/WHEN fit-context in
-- not_for, never as quality warnings (#7); prices as bands. Copy is
-- source-verified. KYND is described as "plant-forward", matching the source
-- (the research flags it is not explicitly fully vegan). Seminyak is
-- planning_only — no money surface. Idempotent: enrich fills empties only,
-- insert is NOT EXISTS-guarded, delete is a no-op once the row is gone.

begin;

-- 1. Activate + enrich KYND Community.
update public.venues v
set status        = 'active',
    area          = coalesce(nullif(v.area, ''), 'Petitenget'),
    gmaps_url     = coalesce(nullif(v.gmaps_url, ''), 'https://www.google.com/maps/search/?api=1&query=Kynd+Community+Petitenget+Seminyak+Bali'),
    price_anchor  = coalesce(nullif(v.price_anchor, ''), '$$'),
    what_to_order = coalesce(nullif(v.what_to_order, ''), 'Smoothie bowls; pancakes; burger; berry smoothies'),
    why_its_here  = coalesce(nullif(v.why_its_here, ''), 'Seminyak''s strongest plant-forward brunch — a big, walk-in cafe known for smoothie bowls and colourful comfort food.'),
    best_for      = coalesce(nullif(v.best_for, ''), 'Vegan and vegetarian brunch; an iconic smoothie-bowl stop; a lighter reset day'),
    not_for       = coalesce(nullif(v.not_for, ''), 'A quiet, low-key table — it runs busy and social'),
    jobs          = case when v.jobs is null or array_length(v.jobs, 1) is null
                         then array['brunch_after_surf']::text[] else v.jobs end
where v.slug = 'kynd-community';

-- 2. Add Watercress Seminyak.
insert into public.venues (
  id, slug, name, category, district, area, address, gmaps_url,
  tier, is_sponsored, status,
  price_anchor, what_to_order, why_its_here, best_for, not_for, jobs
)
select
  gen_random_uuid()::text, 'watercress-seminyak', 'Watercress Seminyak', 'cafe', 'seminyak',
  'Batu Belig / North Seminyak', 'Jl. Batu Belig, Seminyak',
  'https://www.google.com/maps/search/?api=1&query=Watercress+Batu+Belig+Seminyak+Bali',
  'editorial_seed', false, 'active',
  '$$',
  'Salmon benedict; eggs benedict; salads; flatbread',
  'A spacious, work-friendly brunch on Seminyak''s northern Batu Belig edge — easy for a longer catch-up or a laptop morning.',
  'A longer, spacious brunch; a work-friendly morning; groups; a north-Seminyak stay',
  'A five-minute walk from Eat Street — it sits on the northern edge of the cluster',
  array['brunch_after_surf','quiet_work_cafe']::text[]
where not exists (select 1 from public.venues v where v.slug = 'watercress-seminyak');

-- 3. Remove the stray inactive Pison duplicate (canonical is pison-petitenget).
delete from public.venues
where slug = 'pison-seminyak' and status <> 'active';

commit;
