# Backfill `jobs` for Canggu & Ubud — sourcing task, not auto-SQL

**Why this can't be a plain migration I write for you.** Canggu (102 venues)
and Ubud (27) have `jobs` empty — and, checked in prod on 2026-07-12, they also
have `vibe_tags`, `best_for` empty and `what_to_order` nearly empty. The only
populated signal is `category`. Deriving intent from category alone
(`cafe → brunch?`, `restaurant → date-night?`) would mis-tag heavily and put the
wrong venues on our highest-value SEO pages ("Best brunch in Canggu") — that
breaks the "no invented content" guardrail. So the real tags must come from your
source data (the longlist / verify CSVs behind migrations 0015–0016) or on-site
editorial knowledge.

Apply `0017_normalize_jobs_slugs.sql` first, then do this.

## Canonical vocabulary — use ONLY these 9 slugs
```
brunch_after_surf        date_night_special       family_early_dinner
group_dinner_share       just_landed_easy_dinner  local_food_calm
quiet_work_cafe          special_occasion         sunset_drinks_view
```

## Step 1 — export the venues that need tagging
```sql
select slug, name, category, area, address
from public.venues
where district in ('canggu','ubud')
  and (jobs is null or array_length(jobs,1) = 0)
order by district, category, name;
```

## Step 2 — fill the tags (template)
One row per venue; pick 1–4 canonical slugs each. Leave a venue out entirely if
you're not sure — an untagged venue simply won't appear on an intent page,
which is safe. Never guess to fill a gap.

```sql
update public.venues as v
set jobs = d.jobs
from (values
  -- slug,                       jobs (canonical slugs only)
  ('crate-cafe',                 array['brunch_after_surf','quiet_work_cafe']::text[]),
  ('the-slow',                   array['date_night_special','special_occasion']::text[])
  -- … one row per venue from the export above …
) as d(slug, jobs)
where v.slug = d.slug;
```

## Fastest path
Send me the exported list back with your intent tags added (even as a pasted
CSV: `slug,jobs`), and I'll turn it into the ready `UPDATE … FROM (VALUES …)`
migration for you to apply — validated against the 9-slug vocabulary so a typo
can't create a phantom intent page.

## After backfill
- Re-run the density check (`select district, count(*) filter (where jobs …)`)
  to confirm coverage.
- Canggu + Ubud intent spokes (`/bali/canggu/brunch`, `/bali/ubud/date-night`, …)
  become buildable — these are Phase 2.5 in `docs/seo-strategy.md`, the highest
  value because they're our deepest districts.
