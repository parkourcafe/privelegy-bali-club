-- Canggu tranche-2 follow-up: resolve the two catalogue rows deliberately left
-- untouched by 0022 (dandelion, dicarik-warung).
--
-- 1. Dandelion -> Casa Tua (verified rebrand, same venue/team/menu, est. 2014).
-- Slug intentionally NOT renamed: perks.venue_slug and plan_entries.venue_slug
-- reference it with a non-deferrable FK (confupdtype='a'), and this row isn't
-- publicly indexed yet (no photos -> noindex), so a clean slug migration can wait
-- for a dedicated pass with redirects. name/address/area/gmaps_url are direct
-- overwrites (the old values were placeholder-grade, not real data to preserve).
--
-- 2. dicarik-warung: its stored gmaps_url coordinates (-8.4995, 115.2600) are
-- ~1.2km from Ubud centre (-8.5098, 115.2654) on Jl. Kajeng -- confirmed via web
-- research as the real "Dicarik Warung" cooking-class warung in Ubud, mis-filed
-- under Canggu by an earlier import. Zero references (0 perks, 0 plan_entries) --
-- safe to correct. District/location corrected to reality; editorial deliberately
-- left EMPTY (not invented) for a future dedicated Ubud evidence pass -- it stays
-- unpublished (legacyDecisionReady requires why_its_here) either way.
--
-- GUARDRAILS: no review text/ratings used for Casa Tua's editorial (#1);
-- best_for/not_for are WHO/WHEN fit-context only (#7); jobs use the existing
-- 9-slug vocabulary (#11); district is an existing district (ubud), not a new
-- entity. Applied directly to prod.

begin;

update public.venues set
  name          = 'Casa Tua',
  address       = 'Jl. Pantai Batu Bolong No.10, Canggu',
  area          = 'Batu Bolong',
  gmaps_url     = 'https://www.google.com/maps/search/?api=1&query=Casa+Tua+Canggu+Jl+Pantai+Batu+Bolong+Bali',
  why_its_here  = coalesce(nullif(why_its_here, ''), 'A long-running (est. 2014) Indonesian restaurant on Batu Bolong serving Balinese family-recipe dishes in a romantic, plant-filled setting split between open-air tables and cosy indoor nooks -- known for its free-roaming resident rabbits. Previously traded as Dandelion; same venue, team and menu, now under the Casa Tua name.'),
  best_for      = coalesce(nullif(best_for, ''), 'A romantic dinner with real character; travellers wanting authentic Balinese home cooking; a memorable one-off setting for a couple.'),
  not_for       = coalesce(nullif(not_for, ''), 'A quick lunch or budget bite -- it opens afternoons for dinner only.'),
  what_to_order = coalesce(nullif(what_to_order, ''), 'Chicken wings; rendang chicken; grilled prawns with chili; lumpia; pomelo salad'),
  price_anchor  = coalesce(nullif(price_anchor, ''), '$$'),
  instagram_url = coalesce(nullif(instagram_url, ''), 'https://www.instagram.com/casatua.canggu/'),
  jobs          = case when jobs is null or array_length(jobs,1) is null
                       then array['date_night_special','local_food_calm']::text[] else jobs end
where slug = 'dandelion' and district = 'canggu';

update public.venues set
  district = 'ubud',
  area     = 'Jl. Kajeng (rice-field walk, north of Ubud centre)',
  address  = 'Jl. Kajeng, Subak Juwuk Manis, Ubud 80571'
where slug = 'dicarik-warung' and district = 'canggu';

commit;
