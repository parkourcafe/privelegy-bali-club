-- Ubud brunch venues — editorial import from the verified "Best Brunch in Ubud"
-- research package (Other_Bali_Best_Brunch_Ubud_Verified_Package_20260712).
--
-- Purpose: Ubud has zero jobs-tagged venues, so no intent spoke can publish.
-- This adds the four missing brunch picks and enriches the existing Alchemy row,
-- all tagged brunch_after_surf, which makes /bali/ubud/brunch the first Ubud
-- spoke (SEO Phase 2.5).
--
-- GUARDRAIL FILTERING (deliberate — do not "restore" the dropped fields):
--   * Google ratings / review counts from the research are NOT imported
--     (guardrail #1: no republishing Google review data; the app has no rating
--     field).
--   * The research "Limitations / recurring complaints" are NOT imported as
--     quality warnings (guardrail #7). Only WHO/WHEN fit-context survives, as
--     `not_for`. No "overrated / mixed feedback / avoid" language.
--   * Prices are distilled to a `price_anchor` band (allowed), not a live menu.
--   * All copy is from source-verified research, not invented (guardrail: no
--     invented content).
--
-- Safety: inserts are guarded by NOT EXISTS on slug (idempotent — re-run is a
-- no-op); id uses gen_random_uuid() (PG17 core). The Alchemy enrichment only
-- fills empty fields (coalesce/nullif), never overwrites existing editorial.
-- Data-only; no schema change; no perks/QR/TablePilot/money touched. Ubud is
-- planning_only, so these carry no money surface.

begin;

with incoming(
  slug, name, category, area, address, gmaps_url,
  price_anchor, what_to_order, why_its_here, best_for, not_for, jobs
) as (
  values
  (
    'suka-espresso-ubud', 'Suka Espresso Ubud', 'cafe',
    'Peliatan / Pengosekan',
    'Jl. Raya Pengosekan Ubud No.108, Ubud, Gianyar 80571',
    'https://www.google.com/maps/search/?api=1&query=Suka+Espresso+%5BUbud%5D%2C+Jl.+Raya+Pengosekan+Ubud+No.108%2C+Ubud%2C+Gianyar+Regency%2C+Bali+80571%2C+Indonesia&query_place_id=ChIJzYlF7KY90i0RnPIUn6jueFc',
    '$$ · breakfast ~60–115K, coffee 30–55K (+service +tax)',
    'Truffle scramble; Big Brekky; eggs benedict; chilli tofu scramble; smoothie bowls',
    'The safest all-round brunch in Ubud — Australian-style breakfast and specialty coffee from 7:30, with 60K breakfast specials running until 3pm and clear vegetarian, vegan and gluten-free labels.',
    'A first brunch in Ubud; coffee lovers; solo diners and couples; a short off-peak laptop session',
    'A quiet, half-empty table at peak brunch — it gets busy',
    array['brunch_after_surf','quiet_work_cafe']::text[]
  ),
  (
    'watercress-ubud', 'Watercress Ubud', 'cafe',
    'Monkey Forest / Ubud Centre',
    'Jl. Monkey Forest, Ubud, Gianyar 80571',
    'https://www.google.com/maps/search/?api=1&query=Watercress+Ubud%2C+Jl.+Monkey+Forest%2C+Ubud%2C+Bali%2C+Gianyar+Regency%2C+Bali+80571%2C+Indonesia&query_place_id=ChIJLS7Y2mw90i0R2rbAvAiYWXU',
    '$$ · breakfast ~80–130K, brunch set 170K, coffee 35–40K (+service +tax)',
    'Smashed avocado; truffled mushroom scramble; eggs benny; Turkish eggs; Benny Brunch set',
    'The most polished early breakfast in Ubud — open from 7am with an unusually clear, current menu; breakfast service runs to 11:30.',
    'An early, composed breakfast; couples who want to talk; small early meetings; groups who book ahead',
    'All-afternoon brunch — breakfast stops at 11:30',
    array['brunch_after_surf']::text[]
  ),
  (
    'milk-and-madu-ubud', 'Milk & Madu Ubud', 'cafe',
    'Jl. Suweta / Ubud Centre',
    'Jl. Suweta No.3, Ubud, Gianyar 80571',
    'https://www.google.com/maps/search/?api=1&query=Milk+%26+Madu+Ubud%2C+Jl.+Suweta+No.3%2C+Ubud%2C+Gianyar+Regency%2C+Bali+80571%2C+Indonesia&query_place_id=ChIJSQmJjmo90i0RYAAftLe2Y24',
    '$$ · Brekky Set 110K (breakfast + coffee + juice)',
    'Ricotta cakes; smashed avocado; cinnamon-bun French toast; the 110K breakfast set',
    'The easiest family and group brunch in Ubud — an all-day cafe with a clear 110K breakfast set, a kids menu and group bookings for up to 20.',
    'Families with children; mixed groups; a central meeting point; anyone who wants a fixed breakfast bundle',
    'A quiet weekend brunch — there is live music on Saturday and Sunday, 11:00–14:00',
    array['family_early_dinner','group_dinner_share','brunch_after_surf']::text[]
  ),
  (
    'zest-ubud', 'Zest Ubud', 'restaurant',
    'Sayan / Penestanan',
    'Jl. Penestanan No.7, Sayan, Ubud, Gianyar 80571',
    'https://www.google.com/maps/search/?api=1&query=Zest%2C+Jl.+Penestanan+No.7%2C+Sayan%2C+Ubud%2C+Gianyar+Regency%2C+Bali+80571%2C+Indonesia&query_place_id=ChIJX5cf_T090i0RNTmzcpw74_Y',
    '$$ · breakfast ~72–139K',
    'Chickpea omelet; Royal Breakfast; avocado toast; waffles; smoothie bowls (all vegan, most available gluten-free)',
    'The strongest creative vegan brunch in Ubud — an all-plant-based menu of substantial savoury dishes in a treetop Penestanan setting.',
    'Vegan diners; a social brunch with friends; an atmosphere-led daytime meal; a date that does not need silence',
    'A quiet, low-key table — it leans social, with music',
    array['brunch_after_surf','date_night_special']::text[]
  )
)
insert into public.venues (
  id, slug, name, category, district, area, address, gmaps_url,
  tier, is_sponsored, status,
  price_anchor, what_to_order, why_its_here, best_for, not_for, jobs
)
select
  gen_random_uuid()::text, i.slug, i.name, i.category, 'ubud', i.area, i.address, i.gmaps_url,
  'editorial_seed', false, 'active',
  i.price_anchor, i.what_to_order, i.why_its_here, i.best_for, i.not_for, i.jobs
from incoming i
where not exists (select 1 from public.venues v where v.slug = i.slug);

-- Enrich the existing Alchemy (Ubud) row — fill only what is empty.
update public.venues v
set price_anchor  = coalesce(nullif(v.price_anchor, ''), '$$ · breakfast ~75–139K, coffee 20–50K (+service +tax)'),
    what_to_order = coalesce(nullif(v.what_to_order, ''), 'Breakfast Bar; avocado toast; banana-taro pancakes; Champion Breakfast; açaí bowl'),
    why_its_here  = coalesce(nullif(v.why_its_here, ''), 'Ubud''s clearest dietary-first breakfast — a fully plant-based, gluten-free menu with a customisable raw breakfast bar and transparent pricing.'),
    best_for      = coalesce(nullif(v.best_for, ''), 'Plant-based and gluten-free diners; a post-yoga breakfast; a customisable healthy start; off-peak laptop time'),
    not_for       = coalesce(nullif(v.not_for, ''), 'A conventional sit-down brunch, or families needing kids'' facilities'),
    jobs          = case when v.jobs is null or array_length(v.jobs, 1) is null
                         then array['brunch_after_surf','quiet_work_cafe']::text[]
                         else v.jobs end
where v.slug = 'alchemy';

commit;
