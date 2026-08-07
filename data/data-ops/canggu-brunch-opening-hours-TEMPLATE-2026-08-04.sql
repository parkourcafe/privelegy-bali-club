-- Canggu brunch: opening hours -- TEMPLATE, NOT DATA.
-- Date: 2026-08-04. Target: /canggu/best-brunch.
--
-- NO SCHEMA CHANGE IS NEEDED. venues.opening_hours (text) and
-- venues.opening_hours_json (jsonb) already exist. Across all published
-- venues, 501 of 1185 carry opening_hours_json -- but only 3 of the 43 brunch
-- venues on this page do (Boheme, Bokashi Bali, Roots).
--
-- I did not fill these in. I do not hold the hours, and a wrong opening time
-- is the single most damaging fact a travel page can publish. Every value
-- below is a blank for you or an owner to fill from the venue's own source.
--
-- Shape copied verbatim from rows that already carry hours, so it stays
-- consistent with the existing importer:
--   {"Monday":["7.00am-10.00pm"], ... , "Sunday":["7.00am-10.00pm"]}
-- Closed day -> empty array: "Monday": []
-- Split service -> two entries: "Monday": ["8.00am-2.00pm","6.00pm-10.00pm"]
--
-- Fill only the rows you actually know. Delete the rest -- a missing row
-- renders no hours at all, which is correct. Do NOT guess a time to make the
-- page look complete.
--
-- Bump last_verified_at ONLY where you genuinely checked the venue's own
-- source on that date; otherwise drop that part of the statement.

/*
begin;

update venues set
  opening_hours_json = '{"Monday":["__:__am-__:__pm"],"Tuesday":["__:__am-__:__pm"],"Wednesday":["__:__am-__:__pm"],"Thursday":["__:__am-__:__pm"],"Friday":["__:__am-__:__pm"],"Saturday":["__:__am-__:__pm"],"Sunday":["__:__am-__:__pm"]}'::jsonb,
  last_verified_at = '2026-08-__'
  where slug = '7am-bakers-umalas';

update venues set
  opening_hours_json = '{"Monday":["8.00am-11.00pm"],"Tuesday":["8.00am-11.00pm"],"Wednesday":["8.00am-11.00pm"],"Thursday":["8.00am-11.00pm"],"Friday":["8.00am-11.00pm"],"Saturday":["8.00am-11.00pm"],"Sunday":["8.00am-11.00pm"]}'::jsonb,
  last_verified_at = '2026-08-__'
  where slug = 'nook-umalas';

commit;
*/

-- Which of the 43 already have hours, and which are still blank:
select name, slug,
       opening_hours_json is not null as has_json,
       opening_hours
from venues
where district = 'canggu' and status = 'active' and publication_status = 'published'
  and jobs @> array['brunch_after_surf'] and category in ('cafe','restaurant','beach_club')
order by (opening_hours_json is not null) desc, name;

-- price_anchor is stored in three incompatible formats on this page
-- ("$$", "35k-70k IDR", "Rp 100.000 - 250.000"). Review before any
-- normalisation -- deciding the canonical format is a content call, so no
-- UPDATE is proposed here.
select price_anchor, count(*), string_agg(name, ' | ' order by name) as venues
from venues
where district = 'canggu' and status = 'active' and publication_status = 'published'
  and jobs @> array['brunch_after_surf'] and category in ('cafe','restaurant','beach_club')
group by price_anchor
order by count(*) desc;
