-- <scope>: <what this changes>.
-- Date: <YYYY-MM-DD>. Target: <which public page(s) this affects>.
--
-- PROVENANCE -- the section a reviewer reads first.
-- State which rung of the ladder every value below sits on, and why.
--   rung 1  verified from the venue's own source / owner / recorded visit
--   rung 2  restatement of what this record already says (no new research)
--   rung 3  not publishable -- if anything here is rung 3, delete it
-- Name the source explicitly. "Restates why_its_here" is a valid, checkable
-- provenance; "from research" is not.
--
-- last_verified_at: TOUCHED / NOT TOUCHED -- and why.
-- Only bump it for rung-1 work. Rung-2 copy is better writing over the same
-- evidence, and dating it as fresh corrupts the sitemap lastmod and the public
-- "Last checked" line, with nothing downstream able to detect the error.
--
-- Re-run safety: every statement is guarded on the field still being empty, so
-- running this twice is harmless and a later hand-edit survives.

begin;

update venues set <field> = '<value>'
  where slug = '<venue-slug>' and (<field> is null or length(trim(<field>)) = 0);

-- Repeat per venue. One statement per row, slug-addressed -- never a bulk
-- UPDATE with a WHERE that matches by category, area or name pattern. Those
-- silently catch rows you never reviewed.

commit;

-- ---------------------------------------------------------------------------
-- BEFORE RUNNING: two checks that cost nothing.
-- ---------------------------------------------------------------------------

-- 1. Every slug resolves to exactly one row, and each statement would actually
--    write. rows_matched = 1 and would_update = 1 for every line, or stop.
select s.slug,
       (select count(*) from venues v where v.slug = s.slug) as rows_matched,
       (select count(*) from venues v where v.slug = s.slug
          and (v.<field> is null or length(trim(v.<field>)) = 0)) as would_update
from (values ('<venue-slug>'),('<venue-slug-2>')) as s(slug)
order by s.slug;

-- 2. Syntax and plan, without writing anything. EXPLAIN parses and plans but
--    does not execute -- safe to run against production.
explain update venues set <field> = '<value>'
  where slug = '<venue-slug>' and (<field> is null or length(trim(<field>)) = 0);

-- ---------------------------------------------------------------------------
-- AFTER RUNNING: prove it landed.
-- ---------------------------------------------------------------------------

select slug, <field> from venues
where slug in ('<venue-slug>','<venue-slug-2>')
order by slug;

-- Coverage across the affected page, so the result is a number and not a hope.
select count(*) as total,
       count(*) filter (where <field> is not null and length(trim(<field>)) > 0) as filled
from venues
where district = '<district>' and status = 'active' and publication_status = 'published'
  and jobs @> array['<job_slug>'];
