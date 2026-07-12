-- Normalize venues.jobs to snake_case canonical slugs.
--
-- Root cause: the 0015/0016 imports wrote the same JTBD tag in two separator
-- styles (e.g. 'date_night_special' AND 'date-night-special'). That splits the
-- programmatic SEO pages (/bali/<district>/<intent>) and the day-builder
-- filters in two. The ONLY variance is the separator — every raw value maps
-- cleanly by replacing '-' with '_' — so collapse per array element and
-- de-duplicate.
--
-- Canonical vocabulary (9): brunch_after_surf, date_night_special,
-- family_early_dinner, group_dinner_share, just_landed_easy_dinner,
-- local_food_calm, quiet_work_cafe, special_occasion, sunset_drinks_view.
--
-- Verified against prod (dry run, 2026-07-12): 28 rows affected, 0 hyphens
-- remain afterwards, 0 dedup collisions (no venue carried both styles of the
-- same tag, so no data is lost). Idempotent — the WHERE guard makes a re-run a
-- no-op. Data-only: no schema change; no perks/QR/TablePilot/money touched.
--
-- NB: vibe_tags and practical_tags were checked and deliberately NOT touched —
-- 'work-friendly' is a legitimate hyphenated vibe (app filter canon), and
-- practical_tags are already uniformly kebab-case with no snake duplicates.

update public.venues
set jobs = array(
  select distinct replace(j, '-', '_')
  from unnest(jobs) as j
  order by 1
)
where jobs is not null
  and exists (select 1 from unnest(jobs) as j where j like '%-%');
