-- 0053_publish_ulu_artisan.sql
-- ULU ARTISAN (Ungasan) is a cafe in the Uluwatu/Bukit review backlog that,
-- unlike the rest of that backlog, already has full editorial copy
-- (why_its_here + best_for both present) -- so it clears the publication gate
-- as-is and was only ever held back because it sat in publication_status
-- 'review'. It is a genuine tourist-facing cafe, so publish it.
--
-- The remaining Uluwatu wellness backlog (independent pilates/yoga studios)
-- needs editorial copy and a founder keep-list decision, handled separately.
-- The 19 Nusa-Dua review rows are all in-resort guest-only hotel gym/yoga
-- amenities and are intentionally left hidden (flagged to data-ops for a
-- possible archive), not published.
--
-- Idempotent: guarded by publication_status='review'. Production apply is a
-- founder/operator step.

update venues set publication_status = 'published'
where status = 'active'
  and district = 'uluwatu-bukit'
  and publication_status = 'review'
  and category = 'cafe'
  and name = $ob$ULU ARTISAN — Ungasan$ob$
  and coalesce(trim(why_its_here), '') <> ''
  and coalesce(trim(best_for), '') <> '';
