-- Venue inventory audit: how many venues, by district and category, and
-- whether they're actually live (published) or still pending (review).
-- Run all three in Supabase SQL Editor and paste results back.

-- ============================================================
-- 1. TOTALS: district x publication_status (top-level headcount)
-- ============================================================
select
  district,
  publication_status,
  count(*) as venue_count
from venues
group by district, publication_status
order by district, publication_status;

-- ============================================================
-- 2. FULL BREAKDOWN: district x category x publication_status
--    (this is the "20 restaurants in Ubud, 10 gyms in Canggu" table)
-- ============================================================
select
  district,
  category,
  publication_status,
  count(*) as venue_count
from venues
group by district, category, publication_status
order by district, category, publication_status;

-- ============================================================
-- 3. PUBLISHED-ONLY view (what travellers actually see today,
--    excludes the 189 sport/active rows just staged as 'review')
-- ============================================================
select
  district,
  category,
  count(*) as venue_count
from venues
where publication_status = 'published'
group by district, category
order by district, category;

-- ============================================================
-- 4. Grand totals, for a sanity-check top line
-- ============================================================
select
  publication_status,
  count(*) as total_venues,
  count(distinct district) as districts_covered,
  count(distinct category) as categories_covered
from venues
group by publication_status;
