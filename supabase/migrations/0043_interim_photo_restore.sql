-- 0043_interim_photo_restore.sql
-- INTERIM PRE-LAUNCH PHOTO POLICY (publication rule v3) — founder decision,
-- 2026-07-19, recorded in AGENTS.md ("Content publication rule v3").
--
-- Context: 0033 quarantined every venues.photo_url lacking a logged owner
-- consent (rule v2) and nulled the column, leaving the catalogue on fallback
-- art. The founder has explicitly amended the rule for the pre-launch window:
-- the site is currently shown to venue OWNERS during outreach (not promoted to
-- tourists), and listings must demonstrate how good a finished card looks. A
-- venue's own public marketing photo may therefore be displayed on its OWN
-- listing before consent is logged, with immediate takedown on request.
--
-- Mechanics:
--   - Restore photo_url from venue_photo_legacy_quarantine (the URLs 0033
--     removed), but NEVER overwrite a photo that is already set (a consented,
--     approved photo always wins) — coalesce semantics.
--   - Quarantine rows are KEPT, so this is fully reversible: re-running the
--     0033 quarantine block re-nulls anything still unconsented.
--   - The consent pipeline stays the law for the long term: an approved
--     owner submission replaces the interim photo, and rule v2 strictness
--     returns at the public-launch gate.
--
-- Idempotent; safe to re-run. Production apply is a founder step.

begin;

update public.venues v
set photo_url = q.photo_url
from public.venue_photo_legacy_quarantine q
where q.venue_slug = v.slug
  and v.photo_url is null
  and q.photo_url is not null
  and q.photo_url ~ '^https://[^[:space:]]+$';

commit;

-- Post-apply check (run manually):
--   select count(*) filter (where photo_url is not null) as with_photo,
--          count(*) as total
--   from venues where status = 'active' and publication_status = 'published';
-- Then open a few /places/<slug> pages: legacy Supabase-bucket URLs may 404
-- (0033 made that bucket private) — external CDN links will render. Report
-- broken ones and we либо re-host, либо re-null точечно.
