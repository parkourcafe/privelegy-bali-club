-- <FIELD>, batch <N> — <COUNT> rows that passed acceptance.
--
-- Source: <collection run, file, date>.
-- The collector marked <M> rows ready; <M - COUNT> did not survive row-by-row
-- checking and are listed at the end of this file with the reason.
--
-- Before running: read `otherbali-supabase-write`. Production carries at
-- least one constraint that exists in no migration in this repository, so
-- dry-run one row first.

-- ── DRY RUN — one row, rolled back ────────────────────────────────────
-- Run this block on its own first. It proves the column, the constraints
-- and the row filter all accept the shape of the write.
begin;
update venues
set <column> = '<one real value>', last_verified_at = '<YYYY-MM-DD>'
where slug = '<one real slug>'
  and status = 'active'
  and publication_status = 'published';
-- expect: UPDATE 1
rollback;


-- ── APPLY ─────────────────────────────────────────────────────────────
-- expect: UPDATE <COUNT>
update venues as v
set <column> = d.value,
    last_verified_at = '<YYYY-MM-DD>'
from (values
  ('<slug-1>','<value-1>'),
  ('<slug-2>','<value-2>')
  -- …
) as d(slug, value)
where v.slug = d.slug
  -- Never touch drafts or de-published rows. A batch import is not the
  -- place to change a venue's publication state.
  and v.status = 'active'
  and v.publication_status = 'published';


-- ── VERIFY ────────────────────────────────────────────────────────────
-- expect: <COUNT>. A smaller number means slugs did not match — do not
-- assume it means "some were already correct".
select count(*) from venues
where last_verified_at = '<YYYY-MM-DD>'
  and <column> is not null;

-- Which slugs failed to match, if the count is short:
select d.slug
from (values ('<slug-1>'),('<slug-2>')) as d(slug)
left join venues v on v.slug = d.slug
where v.slug is null;


-- ── REJECTED, although the collector marked them ready ────────────────
--
-- Each entry states the value, the source and why it was refused. This
-- block is not commentary — it is what stops the same bad row being
-- re-imported by the next run.
--
-- <slug>    «<value>»
--   <the source URL, and the specific reason: wrong kind of source /
--    implausible for the category / outside the plausibility bound>
--
-- ── ACCEPTED WITH A RESERVATION ───────────────────────────────────────
--
-- <slug>: <what is weak about the source, and what to re-check later>
