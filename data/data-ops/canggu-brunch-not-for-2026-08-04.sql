-- Canggu brunch: fill the 7 missing `not_for` values.
-- Date: 2026-08-04. Target: /canggu/best-brunch (43 venues, 36 already had it).
--
-- PROVENANCE -- read before running.
-- Every line below is a RESTATEMENT of what the venue's own record already
-- says in why_its_here / best_for / price_anchor. Nothing new was researched
-- and no venue was re-visited. Example: The Shady Shack's record already reads
-- "all-day vegetarian and vegan cafe", so "not for diners set on meat or
-- seafood" is that same fact stated as fit context, not a new claim.
--
-- This is editorial copy in the Other Bali voice -- review the wording before
-- running. It is fit context (WHO/WHEN a place does not suit), never a quality
-- warning (guardrail #9).
--
-- last_verified_at is deliberately NOT touched: this is derived copy, not a
-- fresh verification, and bumping the date would claim evidence we do not have.
--
-- Safe to re-run: each statement only writes when not_for is still empty, so it
-- will never overwrite a value you edit by hand afterwards.

begin;

update venues set not_for = 'A full beach club rather than a quick, cheap breakfast stop.'
  where slug = 'the-lawn-canggu-beach-club' and (not_for is null or length(trim(not_for)) = 0);

update venues set not_for = 'Anyone after a rich, indulgent fry-up -- the menu is wholefoods-led.'
  where slug = 'bali-buda-canggu' and (not_for is null or length(trim(not_for)) = 0);

update venues set not_for = 'Couples seeking an intimate, quiet dining atmosphere.'
  where slug = 'milk-and-madu-berawa' and (not_for is null or length(trim(not_for)) = 0);

update venues set not_for = 'A budget breakfast -- mains run 100,000-250,000 IDR.'
  where slug = 'milu-by-nook' and (not_for is null or length(trim(not_for)) = 0);

update venues set not_for = 'A quiet, tucked-away table -- it sits on a busy Berawa junction.'
  where slug = 'nude-berawa' and (not_for is null or length(trim(not_for)) = 0);

update venues set not_for = 'A calm evening meal -- it turns bar-ish after dark.'
  where slug = 'revolver-canggu' and (not_for is null or length(trim(not_for)) = 0);

update venues set not_for = 'Diners set on meat or seafood -- the menu is entirely vegetarian and vegan.'
  where slug = 'the-shady-shack' and (not_for is null or length(trim(not_for)) = 0);

commit;

-- Verify: expect 7 rows back, and 43/43 coverage on the second query.
select slug, not_for from venues
where slug in ('the-lawn-canggu-beach-club','bali-buda-canggu','milk-and-madu-berawa',
               'milu-by-nook','nude-berawa','revolver-canggu','the-shady-shack')
order by slug;

select count(*) as total,
       count(*) filter (where not_for is not null and length(trim(not_for)) > 0) as with_not_for
from venues
where district = 'canggu' and status = 'active' and publication_status = 'published'
  and jobs @> array['brunch_after_surf'] and category in ('cafe','restaurant','beach_club');
