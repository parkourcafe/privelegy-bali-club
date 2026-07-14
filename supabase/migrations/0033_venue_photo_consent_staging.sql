-- Private per-image venue-photo staging and explicit owner consent.
-- Production apply: run after 0032, then deploy server-only upload/review code.

begin;

-- Extend the existing append-only ConsentLog entity so a venue
-- representative can grant rights for a bounded list of image submissions.
alter table public.consent_log alter column guest_ref_id drop not null;
alter table public.consent_log add column if not exists venue_slug text
  references public.venues(slug) on delete cascade;
alter table public.consent_log add column if not exists actor_name text;
alter table public.consent_log add column if not exists actor_contact text;
alter table public.consent_log add column if not exists terms_version text;
alter table public.consent_log add column if not exists scope text;
alter table public.consent_log add column if not exists submission_ids uuid[];
alter table public.consent_log add column if not exists submitted_ip inet;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.consent_log'::regclass
      and conname = 'consent_log_subject_check'
  ) then
    alter table public.consent_log
      add constraint consent_log_subject_check
      check (guest_ref_id is not null or venue_slug is not null) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.consent_log'::regclass
      and conname = 'venue_photo_consent_evidence_check'
  ) then
    alter table public.consent_log
      add constraint venue_photo_consent_evidence_check
      check (
        consent_type <> 'venue_photo_rights'
        or (
          venue_slug is not null
          and granted
          and nullif(btrim(actor_name), '') is not null
          and nullif(btrim(terms_version), '') is not null
          and scope = 'display venue photos on otherbali.com'
          and cardinality(submission_ids) between 1 and 20
        )
      ) not valid;
  end if;
end;
$$;

alter table public.consent_log validate constraint consent_log_subject_check;
-- Recreate this check even when an earlier draft of 0033 was rehearsed: SQL
-- CHECK treats NULL as unknown/pass unless submission_ids is explicit.
alter table public.consent_log
  drop constraint if exists venue_photo_consent_evidence_check;
alter table public.consent_log
  add constraint venue_photo_consent_evidence_check
  check (
    consent_type <> 'venue_photo_rights'
    or (
      venue_slug is not null
      and granted
      and nullif(btrim(actor_name), '') is not null
      and nullif(btrim(terms_version), '') is not null
      and scope = 'display venue photos on otherbali.com'
      and submission_ids is not null
      and cardinality(submission_ids) between 1 and 20
    )
  ) not valid;
alter table public.consent_log validate constraint venue_photo_consent_evidence_check;
create index if not exists consent_log_venue_ts_idx
  on public.consent_log(venue_slug, ts desc)
  where venue_slug is not null;
revoke all on table public.consent_log from public, anon, authenticated;
revoke all on table public.consent_log from service_role;
grant select, insert on table public.consent_log to service_role;

-- Only a hash of the review credential is stored. Raw tokens stay in the
-- server-generated link and are never queryable by public roles.
create table if not exists public.venue_photo_tokens (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  token_hash text not null unique
    check (length(btrim(token_hash)) between 43 and 128),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  check (expires_at is null or expires_at > created_at)
);
create unique index if not exists venue_photo_tokens_active_venue_idx
  on public.venue_photo_tokens(venue_slug)
  where revoked_at is null;
create index if not exists venue_photo_tokens_expiry_idx
  on public.venue_photo_tokens(expires_at)
  where revoked_at is null and expires_at is not null;

-- Every row is one private object. Consent and approval cannot be inferred
-- from the venue as a whole: the evidence is linked to the exact image row.
create table if not exists public.venue_photo_submissions (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  image_path text not null unique
    check (
      length(btrim(image_path)) between 3 and 500
      and image_path !~ '(^/|(^|/)\.\.(/|$))'
    ),
  source_url text
    check (source_url is null or source_url ~ '^https://[^[:space:]]+$'),
  submitter_name text check (submitter_name is null or length(submitter_name) <= 120),
  submitter_contact text
    check (submitter_contact is null or length(submitter_contact) <= 200),
  uploaded_by text not null default 'admin'
    check (uploaded_by in ('admin', 'venue')),
  consent_granted boolean not null default false,
  consent_terms_version text,
  consent_at timestamptz,
  consent_log_id uuid references public.consent_log(id) on delete restrict,
  submitted_ip inet,
  submitted_ua text check (submitted_ua is null or length(submitted_ua) <= 500),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  is_primary boolean not null default false,
  published_url text unique
    check (published_url is null or published_url ~ '^https://[^[:space:]]+$'),
  reviewed_at timestamptz,
  reviewed_by text check (reviewed_by is null or length(reviewed_by) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (
      not consent_granted
      and consent_terms_version is null
      and consent_at is null
      and consent_log_id is null
    )
    or (
      consent_granted
      and nullif(btrim(consent_terms_version), '') is not null
      and consent_at is not null
      and consent_log_id is not null
      and nullif(btrim(submitter_name), '') is not null
    )
  ),
  check (
    status <> 'approved'
    or (
      consent_granted
      and consent_log_id is not null
      and published_url is not null
      and reviewed_at is not null
      and nullif(btrim(reviewed_by), '') is not null
    )
  ),
  check (not is_primary or status = 'approved')
);
create index if not exists venue_photo_submissions_venue_status_idx
  on public.venue_photo_submissions(venue_slug, status, created_at);
create index if not exists venue_photo_submissions_consent_idx
  on public.venue_photo_submissions(consent_log_id)
  where consent_log_id is not null;
create unique index if not exists venue_photo_submissions_primary_idx
  on public.venue_photo_submissions(venue_slug)
  where is_primary;

alter table public.venue_photo_tokens enable row level security;
alter table public.venue_photo_submissions enable row level security;
revoke all on table public.venue_photo_tokens from public, anon, authenticated;
revoke all on table public.venue_photo_submissions from public, anon, authenticated;
grant select, insert, update, delete on table public.venue_photo_tokens
  to service_role;
grant select, insert, update, delete on table public.venue_photo_submissions
  to service_role;

-- Preserve legacy public URLs as operator-only evidence before fail-closed
-- removal. They are not publication authorization and cannot be read by anon.
create table if not exists public.venue_photo_legacy_quarantine (
  venue_slug text primary key references public.venues(slug) on delete cascade,
  photo_url text not null,
  quarantined_at timestamptz not null default now(),
  reason text not null default 'missing exact per-image consent and approval'
);
alter table public.venue_photo_legacy_quarantine enable row level security;
revoke all on table public.venue_photo_legacy_quarantine
  from public, anon, authenticated;
grant select, insert on table public.venue_photo_legacy_quarantine to service_role;

-- Production may already contain the applied 0030 legacy consent table. Keep
-- its rights evidence, but retire it as an authorization source: plaintext
-- onboarding tokens are irreversibly removed, direct access is service-only,
-- and a legacy row is explicitly not treated as per-image staging approval.
do $$
begin
  if to_regclass('public.venue_photo_consents') is not null then
    execute 'alter table public.venue_photo_consents enable row level security';
    execute 'revoke all on table public.venue_photo_consents from public, anon, authenticated';
    execute 'grant select on table public.venue_photo_consents to service_role';

    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'venue_photo_consents'
        and column_name = 'token'
    ) then
      execute 'alter table public.venue_photo_consents drop column token';
    end if;

    execute $legacy_comment$
      comment on table public.venue_photo_consents is
      'Legacy 0030 rights evidence only. Rows do not authorize publication and are not equivalent to per-image consent plus operator approval.'
    $legacy_comment$;
  end if;
end;
$$;

insert into public.venue_photo_legacy_quarantine(venue_slug, photo_url)
select v.slug, v.photo_url
from public.venues v
where v.photo_url is not null
  and not exists (
    select 1
    from public.venue_photo_submissions approved
    join public.consent_log consent on consent.id = approved.consent_log_id
    where approved.venue_slug = v.slug
      and approved.status = 'approved'
      and approved.consent_granted
      and approved.published_url = v.photo_url
      and consent.venue_slug = approved.venue_slug
      and consent.consent_type = 'venue_photo_rights'
      and consent.granted
      and approved.id = any(consent.submission_ids)
  )
on conflict (venue_slug) do update set
  photo_url = excluded.photo_url,
  quarantined_at = clock_timestamp();

update public.venues v
set photo_url = null
where v.photo_url is not null
  and not exists (
    select 1
    from public.venue_photo_submissions approved
    join public.consent_log consent on consent.id = approved.consent_log_id
    where approved.venue_slug = v.slug
      and approved.status = 'approved'
      and approved.consent_granted
      and approved.published_url = v.photo_url
      and consent.venue_slug = approved.venue_slug
      and consent.consent_type = 'venue_photo_rights'
      and consent.granted
      and approved.id = any(consent.submission_ids)
  );

-- The legacy bucket was public. It is now private staging; approved images are
-- delivered only through an application-controlled HTTPS URL or an approved
-- CDN copy, never by restoring public bucket access.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
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

-- Reserve a submission before any bytes are stored. The per-venue advisory
-- lock makes the quota concurrency-safe, including for a leaked valid token.
create or replace function public.reserve_venue_photo_submission(
  p_submission_id uuid,
  p_venue_slug text,
  p_image_path text,
  p_submitter_name text,
  p_submitter_contact text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_pending integer;
  v_recent integer;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_submission_id is null
    or nullif(btrim(p_venue_slug), '') is null
    or nullif(btrim(p_submitter_name), '') is null
    or length(btrim(p_submitter_name)) > 120
    or length(coalesce(p_submitter_contact, '')) > 200
    or p_image_path is null
    or length(btrim(p_image_path)) not between 3 and 500
    or p_image_path ~ '(^/|(^|/)\.\.(/|$))' then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('venue-photo-reserve:' || p_venue_slug, 0)
  );
  select count(*) into v_pending
  from public.venue_photo_submissions
  where venue_slug = p_venue_slug and status = 'pending';
  select count(*) into v_recent
  from public.venue_photo_submissions
  where venue_slug = p_venue_slug
    and created_at >= clock_timestamp() - interval '24 hours';
  if v_pending >= 5 or v_recent >= 10 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  insert into public.venue_photo_submissions(
    id, venue_slug, image_path, source_url, submitter_name,
    submitter_contact, uploaded_by, consent_granted, status, is_primary
  ) values (
    p_submission_id, p_venue_slug, p_image_path, null,
    left(btrim(p_submitter_name), 120),
    nullif(left(btrim(coalesce(p_submitter_contact, '')), 200), ''),
    'venue', false, 'pending', false
  );
  return jsonb_build_object('ok', true, 'submission_id', p_submission_id);
exception
  when unique_violation or foreign_key_violation or check_violation then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
end;
$$;

-- Server code calls this only after verifying the hashed per-venue token and
-- receiving an unticked-by-default rights checkbox. It links one immutable
-- ConsentLog entry to every exact image in the submitted batch.
create or replace function public.record_venue_photo_consent(
  p_submission_ids uuid[],
  p_venue_slug text,
  p_actor_name text,
  p_actor_contact text,
  p_terms_version text,
  p_user_agent text,
  p_submitted_ip inet
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_requested integer;
  v_distinct integer;
  v_locked integer;
  v_consent_id uuid;
  v_consent_at timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select count(*), count(distinct submission_id)
  into v_requested, v_distinct
  from unnest(coalesce(p_submission_ids, '{}')) as requested(submission_id);

  if v_requested not between 1 and 20
    or v_distinct <> v_requested
    or nullif(btrim(p_actor_name), '') is null
    or nullif(btrim(p_terms_version), '') is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_consent');
  end if;

  select count(*) into v_locked
  from (
    select id
    from public.venue_photo_submissions
    where id = any(p_submission_ids)
      and venue_slug = p_venue_slug
      and status = 'pending'
      and not consent_granted
    for update
  ) as locked_submissions;

  if v_locked <> v_requested then
    return jsonb_build_object('ok', false, 'error', 'invalid_submissions');
  end if;

  insert into public.consent_log(
    guest_ref_id, venue_slug, consent_type, granted, user_agent, ts,
    actor_name, actor_contact, terms_version, scope, submission_ids,
    submitted_ip
  )
  values (
    null,
    p_venue_slug,
    'venue_photo_rights',
    true,
    left(coalesce(p_user_agent, ''), 500),
    v_consent_at,
    left(btrim(p_actor_name), 120),
    nullif(left(btrim(coalesce(p_actor_contact, '')), 200), ''),
    left(btrim(p_terms_version), 80),
    'display venue photos on otherbali.com',
    p_submission_ids,
    p_submitted_ip
  )
  returning id into v_consent_id;

  update public.venue_photo_submissions
  set submitter_name = left(btrim(p_actor_name), 120),
      submitter_contact = nullif(
        left(btrim(coalesce(p_actor_contact, '')), 200),
        ''
      ),
      consent_granted = true,
      consent_terms_version = left(btrim(p_terms_version), 80),
      consent_at = v_consent_at,
      consent_log_id = v_consent_id,
      submitted_ip = p_submitted_ip,
      submitted_ua = left(coalesce(p_user_agent, ''), 500),
      updated_at = v_consent_at
  where id = any(p_submission_ids);

  return jsonb_build_object(
    'ok', true,
    'consent_id', v_consent_id,
    'submission_count', v_requested
  );
end;
$$;

-- Publication is service-only and transactional. It verifies the exact image
-- appears in its granted ConsentLog before changing the venue's public URL.
create or replace function public.approve_venue_photo_submission(
  p_submission_id uuid,
  p_delivery_url text,
  p_reviewed_by text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_submission public.venue_photo_submissions%rowtype;
  v_reviewed_at timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_delivery_url is null
    or p_delivery_url !~ '^https://[^[:space:]]+$'
    or p_delivery_url ~ '/storage/v1/object/public/venue-photos/'
    or nullif(btrim(p_reviewed_by), '') is null then
    return jsonb_build_object('ok', false, 'error', 'invalid_publication');
  end if;

  select * into v_submission
  from public.venue_photo_submissions
  where id = p_submission_id
  for update;

  if not found
    or v_submission.status <> 'pending'
    or not v_submission.consent_granted
    or v_submission.consent_log_id is null
    or not exists (
      select 1
      from public.consent_log c
      where c.id = v_submission.consent_log_id
        and c.venue_slug = v_submission.venue_slug
        and c.consent_type = 'venue_photo_rights'
        and c.granted
        and p_submission_id = any(c.submission_ids)
    ) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('venue-photo-publish:' || v_submission.venue_slug, 0)
  );

  update public.venue_photo_submissions
  set is_primary = false, updated_at = v_reviewed_at
  where venue_slug = v_submission.venue_slug and is_primary;

  update public.venue_photo_submissions
  set status = 'approved',
      is_primary = true,
      published_url = p_delivery_url,
      reviewed_at = v_reviewed_at,
      reviewed_by = left(btrim(p_reviewed_by), 120),
      updated_at = v_reviewed_at
  where id = p_submission_id;

  update public.venues
  set photo_url = p_delivery_url
  where slug = v_submission.venue_slug;

  return jsonb_build_object(
    'ok', true,
    'submission_id', p_submission_id,
    'venue_slug', v_submission.venue_slug
  );
end;
$$;

-- Retire both known legacy token-to-public-URL mutations. Production can have
-- either the original two-argument RPC or the applied 0030 five-argument RPC;
-- DROP IF EXISTS makes this forward repair safe for both pre-states.
drop function if exists public.set_venue_photo(text, text);
drop function if exists public.set_venue_photo(text, text, boolean, text, text);

revoke all on function public.record_venue_photo_consent(
  uuid[],text,text,text,text,text,inet
) from public, anon, authenticated;
revoke all on function public.reserve_venue_photo_submission(uuid,text,text,text,text)
  from public, anon, authenticated;
revoke all on function public.approve_venue_photo_submission(uuid,text,text)
  from public, anon, authenticated;
grant execute on function public.reserve_venue_photo_submission(uuid,text,text,text,text)
  to service_role;
grant execute on function public.record_venue_photo_consent(
  uuid[],text,text,text,text,text,inet
) to service_role;
grant execute on function public.approve_venue_photo_submission(uuid,text,text)
  to service_role;

comment on table public.venue_photo_submissions is
  'Private per-image staging with explicit ConsentLog evidence and operator review.';
comment on table public.venue_photo_tokens is
  'Hashed, revocable server-verified credentials for venue photo review links.';

commit;
