-- Цифры для питча изданиям (план упоминаний, 2026-08-04).
-- Порядок важен: СНАЧАЛА блок 0 — он показывает, на какие темы у нас
-- вообще есть данные. Заявлять цифру, под которой нет заполненных полей,
-- нельзя: именно на этом ловят.

-- ── 0. Заполненность полей: что мы имеем право утверждать ──────────────
select
  count(*)                                              as venues_published,
  count(price_band)                                     as have_price_band,
  count(opening_hours)                                  as have_hours,
  count(*) filter (where practical_tags is not null
                     and cardinality(practical_tags) > 0) as have_practical_tags,
  count(*) filter (where jobs is not null
                     and cardinality(jobs) > 0)           as have_jobs,
  count(why_its_here)                                   as have_editorial,
  count(last_verified_at)                               as have_verified_date
from venues
where status = 'active' and publication_status = 'published';

-- ── 1. Главная цифра: размер проверенной базы ─────────────────────────
-- Это тот самый факт, которого нет у конкурентов (у гидов 20–30 мест в статье).
select count(*) as published_venues,
       count(distinct district) as districts,
       count(distinct category) as categories,
       min(last_verified_at) as earliest_check,
       max(last_verified_at) as latest_check
from venues
where status = 'active' and publication_status = 'published';

-- ── 2. Разрез по районам и категориям — «карта острова» ───────────────
select district,
       count(*) as total,
       count(*) filter (where category in ('restaurant','warung','cafe')) as food,
       count(*) filter (where category = 'warung')     as warungs,
       count(*) filter (where category = 'spa')        as spa,
       count(*) filter (where category in ('fitness','yoga','surf')) as active
from venues
where status = 'active' and publication_status = 'published'
group by district order by total desc;

-- ── 3. Ценовой уровень по районам (только если блок 0 показал наполнение) ──
select district, price_band, count(*)
from venues
where status='active' and publication_status='published' and price_band is not null
group by district, price_band order by district, price_band;

-- ── 4. Кафе, годные для работы (тема «где работать в Чангу») ──────────
-- Проверьте вывод: если счёт близок к нулю, тег просто не проставлен,
-- и заявлять эту цифру нельзя.
select district, count(*) as work_friendly
from venues
where status='active' and publication_status='published'
  and category in ('cafe','restaurant')
  and (practical_tags && array['laptop','wifi','work_friendly']
       or jobs && array['work_session'])
group by district order by 2 desc;

-- ── 5. Варунги на район — «где едят местные» ──────────────────────────
select district, count(*) as warungs
from venues
where status='active' and publication_status='published' and category='warung'
group by district order by 2 desc;
