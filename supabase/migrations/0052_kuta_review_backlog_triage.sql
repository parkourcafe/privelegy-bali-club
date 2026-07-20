-- 0052_kuta_review_backlog_triage.sql
-- Triage of the 18 Kuta/Legian venues stuck in publication_status='review'.
-- All 18 came in as a bulk import (name + category + district only, no
-- editorial), so none could pass the publication gate (which requires
-- why_its_here + best_for). Publishing them wholesale would fill a major
-- tourist hub with futsal courts, a badminton hall, tennis and gym listings
-- -- functional-local venues nobody comes to Other Bali to choose. So this is
-- a triage, not a bulk publish.
--
-- KEEP (tourist-relevant -> given editorial copy + published here): the two
-- Kuta-beach surf schools and two drop-in wellness studios below. Copy is
-- Other Bali editorial voice: why_its_here describes what the place is from
-- its category + location (Kuta's beginner beach break; a Legian drop-in
-- studio) and best_for is fit-context judgement -- NO invented operational
-- fact (hours, price, ratings, claims), matching guardrail #10 and the style
-- of the 0047 editorial pass. It is a draft to be reviewed before this runs.
--
-- LEFT HIDDEN (intentionally NOT touched -- stay in 'review'): the 12
-- functional-local fitness venues (Anika Gym, Arjuna Futsal, Bali Asri Gym,
-- Celebrity Fitness, Crossfit Seminyak, D'Gol Futsal, Dojo Aora, Gelogor
-- Carik Badminton, Hammerhead Fitness, Kros Tennis Bali, Rai Fitness Sunset
-- Bali) and Drifter Kayu Aya (a retail surf/lifestyle shop, and Kayu Aya is
-- Seminyak, not Kuta). Two borderline studios (Pole Studio Bali, Motion
-- Skatepark) are also left for a founder call, not silently published.
--
-- NOTE on the two mis-districted rows: Crossfit Seminyak and Drifter Kayu Aya
-- sit in district='kuta-legian' but read as Seminyak. They are dropped by this
-- triage anyway, so no district move is made here; flagged to data-ops.
--
-- Matched by name + district (no slugs were captured for the import). Scoped
-- to status='active' and district='kuta-legian'; the publish flip is guarded
-- by publication_status='review' so the migration is idempotent.
-- Production apply is a founder/operator step.

begin;

update venues
set why_its_here = $ob$Kuta's long, gentle beach break is one of the classic places to learn to surf in Bali, and this school runs guided lessons with boards and instructors right off the sand in central Kuta.$ob$,
    best_for = $ob$a first, beginner-friendly surf lesson$ob$
where status = 'active' and district = 'kuta-legian' and name = $ob$Rip Curl Surf School$ob$;

update venues
set why_its_here = $ob$A Kuta beach surf school offering instructor-led lessons and board rental on the same beginner-friendly break -- a straightforward way to get in the water with guidance.$ob$,
    best_for = $ob$guided beginner surf sessions and board rental$ob$
where status = 'active' and district = 'kuta-legian' and name = $ob$Bali Green Surf$ob$;

update venues
set why_its_here = $ob$A drop-in yoga studio in the Kuta-Legian area -- useful when you want a single class without committing to a multi-day retreat.$ob$,
    best_for = $ob$a drop-in yoga class between beach days$ob$
where status = 'active' and district = 'kuta-legian' and name = $ob$Yoga 108 Bali$ob$;

update venues
set why_its_here = $ob$A Legian pilates studio with scheduled classes you can drop into -- a lower-impact alternative to yoga for a morning session near the beach.$ob$,
    best_for = $ob$a drop-in pilates class in Legian$ob$
where status = 'active' and district = 'kuta-legian' and name = $ob$Sunset Pilates Legian$ob$;

-- Publish exactly the four triaged keepers. The 12 functional-local venues and
-- the two borderline studios are intentionally NOT in this list and stay hidden.
update venues set publication_status = 'published'
where status = 'active'
  and district = 'kuta-legian'
  and publication_status = 'review'
  and name in (
    $ob$Rip Curl Surf School$ob$,
    $ob$Bali Green Surf$ob$,
    $ob$Yoga 108 Bali$ob$,
    $ob$Sunset Pilates Legian$ob$
  );

commit;
