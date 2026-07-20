-- 0054_uluwatu_wellness_triage.sql
-- Triage of the Uluwatu/Bukit wellness venues stuck in publication_status
-- 'review'. Unlike the Nusa-Dua backlog (which is entirely in-resort,
-- guest-only hotel gym/yoga amenities and stays hidden), Uluwatu has a real
-- independent wellness scene that travellers do book single classes into.
--
-- KEEP (published here): six unambiguously INDEPENDENT studios. A public,
-- scheduled class list is inherent to what an independent yoga/pilates studio
-- is, so the copy asserts no unverified access fact (no "open to non-guests",
-- no hours, price, rating). why_its_here describes the venue from its category
-- + area (Uluwatu / Bingin, the Bukit); best_for is fit-context judgement.
-- Editorial voice only, matching guardrail #10 and the 0047/0052 passes. Draft
-- to be reviewed before this runs.
--
-- LEFT HIDDEN (NOT touched -- stay 'review'):
--   * resort/hotel amenities: Six Senses Uluwatu (Fitness/Pilates/Yoga
--     Pavilion), Hotel Together Bali, The Asa Maia (Fitness/Pilates/Yoga),
--     The Istana (Wellness Club/Yoga) -- guest-oriented, not standalone.
--   * founder-call borderlines: La Tribu (cafe/community hybrid), NAYA
--     Uluwatu (day-club/rooftop), Mantra Wellness, Zando Fight Camp,
--     Uluwatu Collective -- nature/access unclear, not guessed.
--   * all 19 Nusa-Dua review rows (separate district, all resort amenities).
--
-- Matched by name prefix (ilike) so an em-dash / suffix mismatch can't silently
-- no-op; scoped to district='uluwatu-bukit', category='yoga', status='active',
-- and guarded by publication_status='review' for idempotency. Each statement
-- sets copy and publishes in one atomic, re-runnable step. Production apply is
-- a founder/operator step.

begin;

update venues
set why_its_here = $ob$An independent yoga and meditation studio in the Uluwatu area with a public class schedule -- for a single session when you don't want to commit to a multi-day retreat.$ob$,
    best_for = $ob$a yoga or meditation class in Uluwatu$ob$,
    publication_status = 'published'
where status = 'active' and district = 'uluwatu-bukit' and category = 'yoga'
  and publication_status = 'review' and name ilike 'Alchemy Yoga%';

update venues
set why_its_here = $ob$A small independent yoga studio on the Bukit running scheduled classes -- a low-key alternative to Uluwatu's larger retreat centres.$ob$,
    best_for = $ob$an early yoga class on the Bukit$ob$,
    publication_status = 'published'
where status = 'active' and district = 'uluwatu-bukit' and category = 'yoga'
  and publication_status = 'review' and name ilike 'Morning Light Yoga%';

update venues
set why_its_here = $ob$An independent pilates studio in the Uluwatu area with scheduled classes -- a focused, lower-impact session between surf and beach days.$ob$,
    best_for = $ob$a pilates class near Uluwatu$ob$,
    publication_status = 'published'
where status = 'active' and district = 'uluwatu-bukit' and category = 'yoga'
  and publication_status = 'review' and name ilike 'Bambu Pilates%';

update venues
set why_its_here = $ob$A reformer pilates studio in the Uluwatu area with scheduled classes -- a stronger, equipment-based session than a mat class.$ob$,
    best_for = $ob$a reformer pilates class in Uluwatu$ob$,
    publication_status = 'published'
where status = 'active' and district = 'uluwatu-bukit' and category = 'yoga'
  and publication_status = 'review' and name ilike 'Bluvana%';

update venues
set why_its_here = $ob$A reformer pilates studio near Bingin on the Bukit's west coast, with scheduled classes -- handy if you're staying around Bingin or Padang Padang.$ob$,
    best_for = $ob$a reformer pilates class near Bingin$ob$,
    publication_status = 'published'
where status = 'active' and district = 'uluwatu-bukit' and category = 'yoga'
  and publication_status = 'review' and name ilike 'Reform Pilates Bingin%';

update venues
set why_its_here = $ob$A reformer pilates studio in the Uluwatu area with scheduled classes -- a stronger, equipment-based session close to the Bukit's surf beaches.$ob$,
    best_for = $ob$a reformer pilates class in Uluwatu$ob$,
    publication_status = 'published'
where status = 'active' and district = 'uluwatu-bukit' and category = 'yoga'
  and publication_status = 'review' and name ilike 'Reform+ Uluwatu%';

commit;
