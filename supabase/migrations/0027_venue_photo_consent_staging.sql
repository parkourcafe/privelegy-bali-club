-- Private venue-photo staging and explicit per-image owner consent.
-- Production apply: Supabase SQL Editor, then deploy the matching app code.

begin;

create table if not exists public.venue_photo_tokens (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz
);
create unique index if not exists venue_photo_tokens_active_venue_idx
  on public.venue_photo_tokens(venue_slug)
  where revoked_at is null;
alter table public.venue_photo_tokens enable row level security;
revoke all on table public.venue_photo_tokens from public, anon, authenticated;
grant select, insert, update, delete on table public.venue_photo_tokens to service_role;

create table if not exists public.venue_photo_submissions (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  image_path text not null unique,
  source_url text,
  submitter_name text,
  submitter_contact text,
  uploaded_by text not null default 'admin'
    check (uploaded_by in ('admin', 'venue')),
  consent_granted boolean not null default false,
  consent_terms_version text,
  consent_at timestamptz,
  submitted_ip inet,
  submitted_ua text,
  status text not null default 'draft'
    check (status in ('draft', 'consented', 'pending', 'approved', 'rejected')),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists venue_photo_submissions_venue_status_idx
  on public.venue_photo_submissions(venue_slug, status, created_at);
alter table public.venue_photo_submissions enable row level security;
revoke all on table public.venue_photo_submissions from public, anon, authenticated;
grant select, insert, update, delete on table public.venue_photo_submissions to service_role;

-- Extend the existing append-only ConsentLog entity for venue representatives.
alter table public.consent_log alter column guest_ref_id drop not null;
alter table public.consent_log add column if not exists venue_slug text
  references public.venues(slug) on delete cascade;
alter table public.consent_log add column if not exists actor_name text;
alter table public.consent_log add column if not exists actor_contact text;
alter table public.consent_log add column if not exists terms_version text;
alter table public.consent_log add column if not exists scope text;
alter table public.consent_log add column if not exists submission_ids uuid[];
alter table public.consent_log add column if not exists submitted_ip inet;
alter table public.consent_log add constraint consent_log_subject_check
  check (guest_ref_id is not null or venue_slug is not null) not valid;
alter table public.consent_log validate constraint consent_log_subject_check;

-- The bucket existed as public in the old onboarding flow. Make every object
-- private; owner previews are served with short-lived signed URLs server-side.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'venue-photos',
  'venue-photos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "onboard photo upload" on storage.objects;
drop policy if exists "public read venue photos" on storage.objects;

-- Retire the legacy public-photo mutation. New uploads and approvals are
-- server-only through the service role and the admin Basic Auth boundary.
revoke all on function public.set_venue_photo(text,text) from public, anon, authenticated;

comment on table public.venue_photo_submissions is
  'Internal infrastructure: private photo candidates, owner consent and admin review; not a tourist-facing entity.';
comment on table public.venue_photo_tokens is
  'Internal infrastructure: hashed, revocable credentials for venue photo review links.';

commit;
