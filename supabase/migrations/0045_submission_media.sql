-- 0045_submission_media.sql
-- Stage B: partner submission media (photos + optional video) for the
-- /list-your-property intake.
--
-- Deliberately NO new domain entity (guardrail #13): media rows live in an
-- additive `media jsonb` column on the EXISTING venue_submissions intake table,
-- and a PRIVATE Storage bucket holds the bytes. No new tables, no new RPCs — the
-- server writes the column with the service role (which bypasses RLS), and the
-- table stays default-deny for anon/authenticated. Bytes are operator-review
-- only and never rendered publicly; publication still flows through the existing
-- consent-gated venue photo pipeline when editorial promotes a submission.
--
-- Idempotent: add-column-if-not-exists + bucket upsert. Safe to re-run.

-- Media entries: jsonb array of
--   { id, kind, path, mime, size, status, rightsGranted, rightsTermsVersion, createdAt }
alter table public.venue_submissions
  add column if not exists media jsonb not null default '[]'::jsonb;

comment on column public.venue_submissions.media is
  'Partner-uploaded submission media (photos/video) staged for operator review. '
  'Private bucket paths + recorded photo-rights basis. Never published directly; '
  'editorial promotes a chosen image through the consent-gated venue photo pipeline.';

-- Private bucket for submission media. public=false is the whole point: objects
-- are reachable only via short-TTL signed URLs minted server-side for the
-- operator review surface. allowed_mime_types + file_size_limit are the first
-- validation layer; the finalize route re-sniffs magic bytes as the second.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submission-media',
  'submission-media',
  false,
  52428800, -- 50 MiB ceiling (video); per-kind caps enforced in the API/policy
  array['image/jpeg', 'image/png', 'video/mp4']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- NB: intentionally NO storage.objects RLS policy for this bucket — access is
-- service-role only (server routes), mirroring the venue-photos discipline.
