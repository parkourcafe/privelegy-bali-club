-- Durable private-photo storage reconciliation and exact-byte consent binding.
--
-- 0033 recorded rights evidence but did not durably distinguish a reserved
-- object path from uploaded bytes. It also left direct service-role DML open,
-- so cleanup could race consent and historical rows could be mistaken for
-- verified storage. This additive boundary refuses to infer old object state:
-- every pre-0041 row starts reconcile_required and blocks release readiness.

begin;

do $dependencies$
begin
  if to_regclass('public.venue_photo_submissions') is null
    or to_regclass('public.consent_log') is null
    or to_regprocedure('public.release_readiness_v1()') is null then
    raise exception using
      errcode = '55000',
      message = '0041 requires photo staging and release readiness through migration 0040';
  end if;
end
$dependencies$;

alter table public.venue_photo_submissions
  add column if not exists storage_state text;
alter table public.venue_photo_submissions
  add column if not exists content_sha256 bytea;
alter table public.venue_photo_submissions
  add column if not exists cleanup_reason text;
alter table public.venue_photo_submissions
  add column if not exists cleanup_requested_at timestamptz;
alter table public.venue_photo_submissions
  add column if not exists cleanup_completed_at timestamptz;
alter table public.venue_photo_submissions
  add column if not exists storage_reconciled_at timestamptz;

-- Install the staging-capable check before the historical backfill writes a
-- staging status. NOT VALID skips the old-row scan but still guards the update.
alter table public.venue_photo_submissions
  drop constraint if exists venue_photo_submissions_status_check;
alter table public.venue_photo_submissions
  add constraint venue_photo_submissions_status_check
  check (status in ('staging', 'pending', 'approved', 'rejected')) not valid;

-- Never guess whether historical bytes exist or match the mutable object path.
-- Incomplete historical pending rows are removed from the review queue without
-- deleting or rewriting ambiguous evidence.
update public.venue_photo_submissions submission
set storage_state = 'reconcile_required',
    status = case
      when submission.status = 'pending'
        and not exists (
          select 1
          from public.consent_log consent
          where consent.consent_type = 'venue_photo_rights'
            and consent.granted
            and consent.venue_slug = submission.venue_slug
            and consent.submission_ids @> array[submission.id]
            and consent.id = submission.consent_log_id
        )
      then 'staging'
      else submission.status
    end,
    updated_at = clock_timestamp()
where submission.storage_state is null;

alter table public.venue_photo_submissions
  alter column storage_state set default 'reserved';
alter table public.venue_photo_submissions
  alter column storage_state set not null;

-- A reservation cannot enter the admin queue. Only the consent transaction
-- promotes uploaded staging to pending.
alter table public.venue_photo_submissions
  validate constraint venue_photo_submissions_status_check;

alter table public.venue_photo_submissions
  drop constraint if exists venue_photo_submissions_storage_state_check;
alter table public.venue_photo_submissions
  add constraint venue_photo_submissions_storage_state_check
  check (storage_state in (
    'reserved',
    'uploaded',
    'cleanup_pending',
    'removed',
    'reconcile_required',
    'missing'
  )) not valid;
alter table public.venue_photo_submissions
  validate constraint venue_photo_submissions_storage_state_check;

alter table public.venue_photo_submissions
  drop constraint if exists venue_photo_submissions_content_sha256_check;
alter table public.venue_photo_submissions
  add constraint venue_photo_submissions_content_sha256_check
  check (content_sha256 is null or octet_length(content_sha256) = 32) not valid;
alter table public.venue_photo_submissions
  validate constraint venue_photo_submissions_content_sha256_check;

alter table public.venue_photo_submissions
  drop constraint if exists venue_photo_submissions_cleanup_reason_check;
alter table public.venue_photo_submissions
  add constraint venue_photo_submissions_cleanup_reason_check
  check (cleanup_reason is null or length(cleanup_reason) between 1 and 80) not valid;
alter table public.venue_photo_submissions
  validate constraint venue_photo_submissions_cleanup_reason_check;

-- Reconciled/missing rows are deliberately allowed to preserve ambiguous old
-- evidence. All new normal states have a strict coherent shape.
alter table public.venue_photo_submissions
  drop constraint if exists venue_photo_submissions_storage_lifecycle_check;
alter table public.venue_photo_submissions
  add constraint venue_photo_submissions_storage_lifecycle_check
  check (
    storage_state in ('reconcile_required', 'missing')
    or (
      storage_state = 'reserved'
      and status = 'staging'
      and content_sha256 is null
      and not consent_granted
      and consent_terms_version is null
      and consent_at is null
      and consent_log_id is null
      and not is_primary
      and published_url is null
      and cleanup_requested_at is null
      and cleanup_completed_at is null
    )
    or (
      storage_state = 'uploaded'
      and content_sha256 is not null
      and cleanup_requested_at is null
      and cleanup_completed_at is null
    )
    or (
      storage_state = 'cleanup_pending'
      and status = 'rejected'
      and not consent_granted
      and consent_terms_version is null
      and consent_at is null
      and consent_log_id is null
      and not is_primary
      and published_url is null
      and cleanup_requested_at is not null
      and cleanup_completed_at is null
    )
    or (
      storage_state = 'removed'
      and status = 'rejected'
      and not consent_granted
      and consent_terms_version is null
      and consent_at is null
      and consent_log_id is null
      and not is_primary
      and published_url is null
      and cleanup_requested_at is not null
      and cleanup_completed_at is not null
    )
  ) not valid;
alter table public.venue_photo_submissions
  validate constraint venue_photo_submissions_storage_lifecycle_check;

drop index if exists public.venue_photo_submissions_storage_queue_idx;
create index if not exists venue_photo_submissions_cleanup_queue_idx
  on public.venue_photo_submissions(cleanup_requested_at, id)
  where storage_state = 'cleanup_pending';
create index if not exists venue_photo_submissions_stale_upload_queue_idx
  on public.venue_photo_submissions(created_at, id)
  where storage_state in ('reserved', 'uploaded');
create index if not exists consent_log_photo_submission_ids_idx
  on public.consent_log using gin(submission_ids)
  where consent_type = 'venue_photo_rights' and submission_ids is not null;

-- Paths are immutable reservation identifiers. A digest is first-write-wins,
-- and durable attempt/tombstone rows are never deleted. Consent evidence is
-- also immutable once attached to the submission.
create or replace function public.guard_venue_photo_submission_integrity()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    raise exception using
      errcode = '55000',
      message = 'photo submission rows are durable and cannot be deleted';
  end if;

  if new.image_path is distinct from old.image_path then
    raise exception using
      errcode = '55000',
      message = 'photo object path is immutable';
  end if;
  if old.content_sha256 is not null
    and new.content_sha256 is distinct from old.content_sha256 then
    raise exception using
      errcode = '55000',
      message = 'photo content digest is immutable';
  end if;
  if old.cleanup_requested_at is not null
    and new.cleanup_requested_at is distinct from old.cleanup_requested_at then
    raise exception using
      errcode = '55000',
      message = 'photo cleanup request time is immutable';
  end if;

  if old.consent_granted or old.consent_log_id is not null then
    if new.consent_granted is distinct from old.consent_granted
      or new.consent_terms_version is distinct from old.consent_terms_version
      or new.consent_at is distinct from old.consent_at
      or new.consent_log_id is distinct from old.consent_log_id
      or new.submitter_name is distinct from old.submitter_name
      or new.submitter_contact is distinct from old.submitter_contact
      or new.submitted_ip is distinct from old.submitted_ip
      or new.submitted_ua is distinct from old.submitted_ua then
      raise exception using
        errcode = '55000',
        message = 'photo consent evidence is immutable';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists venue_photo_submission_integrity_guard
  on public.venue_photo_submissions;
create trigger venue_photo_submission_integrity_guard
before update or delete on public.venue_photo_submissions
for each row execute function public.guard_venue_photo_submission_integrity();

-- Serialize even privileged ConsentLog inserts with the submission lifecycle.
-- This closes the external-I/O gap after request_cleanup commits: no photo
-- consent row can be appended while the object is cleanup_pending or removed.
create or replace function public.guard_venue_photo_consent_log_write()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_requested integer;
  v_distinct integer;
  v_locked integer;
begin
  if tg_op = 'DELETE' then
    if old.consent_type = 'venue_photo_rights' then
      raise exception using
        errcode = '55000',
        message = 'photo consent evidence cannot be deleted';
    end if;
    return old;
  end if;

  if tg_op = 'UPDATE' then
    if old.consent_type = 'venue_photo_rights'
      or new.consent_type = 'venue_photo_rights' then
      raise exception using
        errcode = '55000',
        message = 'photo consent evidence is append-only';
    end if;
    return new;
  end if;

  if new.consent_type <> 'venue_photo_rights' then
    return new;
  end if;

  select count(*), count(distinct submission_id)
  into v_requested, v_distinct
  from unnest(coalesce(new.submission_ids, '{}')) requested(submission_id);

  if v_requested not between 1 and 20
    or v_distinct <> v_requested
    or new.venue_slug is null
    or not new.granted then
    raise exception using
      errcode = '23514',
      message = 'invalid photo consent evidence';
  end if;

  perform 1
  from public.venue_photo_submissions submission
  where submission.id = any(new.submission_ids)
    and submission.venue_slug = new.venue_slug
  order by submission.id
  for update;
  get diagnostics v_locked = row_count;

  if v_locked <> v_requested
    or exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.id = any(new.submission_ids)
        and (
          submission.status <> 'staging'
          or submission.storage_state <> 'uploaded'
          or submission.content_sha256 is null
          or submission.consent_granted
          or submission.consent_log_id is not null
        )
    )
    or exists (
      select 1
      from public.consent_log consent
      where consent.consent_type = 'venue_photo_rights'
        and consent.submission_ids && new.submission_ids
    ) then
    raise exception using
      errcode = '55000',
      message = 'photo consent state conflict';
  end if;

  return new;
end;
$$;

drop trigger if exists venue_photo_consent_log_integrity_guard
  on public.consent_log;
create trigger venue_photo_consent_log_integrity_guard
before insert or update or delete on public.consent_log
for each row execute function public.guard_venue_photo_consent_log_write();

-- Reserve a durable attempt before writing Storage. Removed tombstones remain
-- in the rolling 24-hour count, so cleanup cannot reset the leaked-token quota.
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
  v_active integer;
  v_recent integer;
  v_total integer;
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

  select count(*) into v_active
  from public.venue_photo_submissions
  where venue_slug = p_venue_slug
    and (
      status in ('staging', 'pending')
      or storage_state = 'cleanup_pending'
    );

  select count(*) into v_recent
  from public.venue_photo_submissions
  where venue_slug = p_venue_slug
    and created_at >= clock_timestamp() - interval '24 hours';

  select count(*) into v_total
  from public.venue_photo_submissions
  where venue_slug = p_venue_slug;

  if v_active >= 5 or v_recent >= 10 or v_total >= 50 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  insert into public.venue_photo_submissions(
    id, venue_slug, image_path, source_url, submitter_name,
    submitter_contact, uploaded_by, consent_granted, status, is_primary,
    storage_state
  ) values (
    p_submission_id,
    p_venue_slug,
    p_image_path,
    null,
    left(btrim(p_submitter_name), 120),
    nullif(left(btrim(coalesce(p_submitter_contact, '')), 200), ''),
    'venue',
    false,
    'staging',
    false,
    'reserved'
  );

  return jsonb_build_object(
    'ok', true,
    'submission_id', p_submission_id,
    'storage_state', 'reserved'
  );
exception
  when unique_violation or foreign_key_violation or check_violation then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
end;
$$;

-- Bind the exact uploaded bytes once. A repeated identical callback is a
-- no-write success; replacement bytes under the same path are rejected.
create or replace function public.mark_venue_photo_uploaded(
  p_submission_id uuid,
  p_venue_slug text,
  p_image_path text,
  p_content_sha256 text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_submission public.venue_photo_submissions%rowtype;
  v_digest bytea;
  v_now timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_submission_id is null
    or nullif(btrim(p_venue_slug), '') is null
    or nullif(btrim(p_image_path), '') is null
    or p_content_sha256 !~ '^[0-9A-Fa-f]{64}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_upload');
  end if;
  v_digest := decode(lower(p_content_sha256), 'hex');

  select * into v_submission
  from public.venue_photo_submissions
  where id = p_submission_id
    and venue_slug = p_venue_slug
    and image_path = p_image_path
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
  end if;
  if v_submission.storage_state = 'uploaded'
    and v_submission.content_sha256 = v_digest
    and v_submission.status = 'staging' then
    return jsonb_build_object(
      'ok', true,
      'storage_state', 'uploaded',
      'deduplicated', true
    );
  end if;
  if v_submission.storage_state <> 'reserved'
    or v_submission.status <> 'staging'
    or v_submission.content_sha256 is not null
    or v_submission.consent_granted
    or v_submission.consent_log_id is not null
    or exists (
      select 1
      from public.consent_log consent
      where consent.consent_type = 'venue_photo_rights'
        and consent.submission_ids @> array[p_submission_id]
    ) then
    return jsonb_build_object('ok', false, 'error', 'state_conflict');
  end if;

  update public.venue_photo_submissions
  set storage_state = 'uploaded',
      content_sha256 = v_digest,
      updated_at = v_now
  where id = p_submission_id;

  return jsonb_build_object(
    'ok', true,
    'storage_state', 'uploaded',
    'deduplicated', false
  );
end;
$$;

-- Consent and cleanup serialize on the same submission rows. Exact repeats
-- return the existing consent without appending evidence; any partial or
-- ambiguous pre-existing evidence fails closed.
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
  v_ids uuid[];
  v_requested integer;
  v_distinct integer;
  v_locked integer;
  v_consent_id uuid;
  v_consent_at timestamptz := clock_timestamp();
  v_actor_name text := left(btrim(coalesce(p_actor_name, '')), 120);
  v_actor_contact text := nullif(left(btrim(coalesce(p_actor_contact, '')), 200), '');
  v_terms_version text := left(btrim(coalesce(p_terms_version, '')), 80);
  v_user_agent text := left(coalesce(p_user_agent, ''), 500);
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select count(*), count(distinct requested_id), array_agg(requested_id order by requested_id)
  into v_requested, v_distinct, v_ids
  from unnest(coalesce(p_submission_ids, '{}')) as requested(requested_id);

  if v_requested not between 1 and 20
    or v_distinct <> v_requested
    or v_actor_name = ''
    or v_terms_version = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_consent');
  end if;

  perform 1
  from public.venue_photo_submissions submission
  where submission.id = any(v_ids)
    and submission.venue_slug = p_venue_slug
  order by submission.id
  for update;
  get diagnostics v_locked = row_count;

  if v_locked <> v_requested then
    return jsonb_build_object('ok', false, 'error', 'invalid_submissions');
  end if;

  select submission.consent_log_id into v_consent_id
  from public.venue_photo_submissions submission
  where submission.id = v_ids[1];

  if v_consent_id is not null
    and not exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.id = any(v_ids)
        and (
          submission.status <> 'pending'
          or submission.storage_state <> 'uploaded'
          or submission.content_sha256 is null
          or not submission.consent_granted
          or submission.consent_log_id is distinct from v_consent_id
        )
    )
    and exists (
      select 1
      from public.consent_log consent
      where consent.id = v_consent_id
        and consent.venue_slug = p_venue_slug
        and consent.consent_type = 'venue_photo_rights'
        and consent.granted
        and consent.actor_name = v_actor_name
        and consent.actor_contact is not distinct from v_actor_contact
        and consent.terms_version = v_terms_version
        and consent.user_agent = v_user_agent
        and consent.submitted_ip is not distinct from p_submitted_ip
        and array(
          select consent_submission_id
          from unnest(consent.submission_ids) consent_submission(consent_submission_id)
          order by consent_submission_id
        ) = v_ids
    ) then
    return jsonb_build_object(
      'ok', true,
      'consent_id', v_consent_id,
      'submission_count', v_requested,
      'deduplicated', true
    );
  end if;

  if exists (
    select 1
    from public.venue_photo_submissions submission
    where submission.id = any(v_ids)
      and (
        submission.status <> 'staging'
        or submission.storage_state <> 'uploaded'
        or submission.content_sha256 is null
        or submission.consent_granted
        or submission.consent_log_id is not null
      )
  ) or exists (
    select 1
    from public.consent_log consent
    where consent.consent_type = 'venue_photo_rights'
      and consent.submission_ids && v_ids
  ) then
    return jsonb_build_object('ok', false, 'error', 'consent_conflict');
  end if;

  insert into public.consent_log(
    guest_ref_id, venue_slug, consent_type, granted, user_agent, ts,
    actor_name, actor_contact, terms_version, scope, submission_ids,
    submitted_ip
  ) values (
    null,
    p_venue_slug,
    'venue_photo_rights',
    true,
    v_user_agent,
    v_consent_at,
    v_actor_name,
    v_actor_contact,
    v_terms_version,
    'display venue photos on otherbali.com',
    v_ids,
    p_submitted_ip
  )
  returning id into v_consent_id;

  update public.venue_photo_submissions
  set submitter_name = v_actor_name,
      submitter_contact = v_actor_contact,
      consent_granted = true,
      consent_terms_version = v_terms_version,
      consent_at = v_consent_at,
      consent_log_id = v_consent_id,
      submitted_ip = p_submitted_ip,
      submitted_ua = v_user_agent,
      status = 'pending',
      updated_at = v_consent_at
  where id = any(v_ids)
    and status = 'staging'
    and storage_state = 'uploaded'
    and content_sha256 is not null
    and not consent_granted
    and consent_log_id is null;
  get diagnostics v_locked = row_count;

  if v_locked <> v_requested then
    raise exception using
      errcode = '40001',
      message = 'photo consent state changed during transaction';
  end if;

  return jsonb_build_object(
    'ok', true,
    'consent_id', v_consent_id,
    'submission_count', v_requested,
    'deduplicated', false
  );
end;
$$;

-- First phase of storage deletion. It can run only after a row lock proves no
-- denormalized or independent ConsentLog reference exists. PII is scrubbed at
-- this point, before the external storage operation.
create or replace function public.request_venue_photo_cleanup(
  p_submission_id uuid,
  p_venue_slug text,
  p_image_path text,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_submission public.venue_photo_submissions%rowtype;
  v_reason text := left(btrim(coalesce(p_reason, '')), 80);
  v_now timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_submission_id is null
    or nullif(btrim(p_venue_slug), '') is null
    or nullif(btrim(p_image_path), '') is null
    or v_reason = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_cleanup');
  end if;

  select * into v_submission
  from public.venue_photo_submissions
  where id = p_submission_id
    and venue_slug = p_venue_slug
    and image_path = p_image_path
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
  end if;
  if v_submission.storage_state = 'removed' then
    return jsonb_build_object('ok', true, 'storage_state', 'removed', 'deduplicated', true);
  end if;

  if v_submission.consent_granted
    or v_submission.consent_log_id is not null
    or v_submission.consent_terms_version is not null
    or v_submission.consent_at is not null
    or exists (
      select 1
      from public.consent_log consent
      where consent.consent_type = 'venue_photo_rights'
        and consent.submission_ids @> array[p_submission_id]
    ) then
    return jsonb_build_object('ok', false, 'error', 'consent_recorded');
  end if;

  if v_submission.storage_state = 'cleanup_pending' then
    return jsonb_build_object(
      'ok', true,
      'storage_state', 'cleanup_pending',
      'deduplicated', true
    );
  end if;
  if v_submission.storage_state not in ('reserved', 'uploaded', 'missing')
    or v_submission.status not in ('staging', 'rejected') then
    return jsonb_build_object('ok', false, 'error', 'state_conflict');
  end if;

  update public.venue_photo_submissions
  set storage_state = 'cleanup_pending',
      status = 'rejected',
      is_primary = false,
      published_url = null,
      submitter_name = null,
      submitter_contact = null,
      submitted_ip = null,
      submitted_ua = null,
      cleanup_reason = v_reason,
      cleanup_requested_at = v_now,
      cleanup_completed_at = null,
      updated_at = v_now
  where id = p_submission_id;

  return jsonb_build_object(
    'ok', true,
    'storage_state', 'cleanup_pending',
    'deduplicated', false
  );
end;
$$;

-- Finalize only after the caller has checked Storage removal (or confirmed the
-- object was already absent). The durable row and 24-hour quota evidence stay.
create or replace function public.complete_venue_photo_cleanup(
  p_submission_id uuid,
  p_venue_slug text,
  p_image_path text,
  p_storage_removal_confirmed boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_submission public.venue_photo_submissions%rowtype;
  v_now timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if not coalesce(p_storage_removal_confirmed, false) then
    return jsonb_build_object('ok', false, 'error', 'storage_removal_unconfirmed');
  end if;

  select * into v_submission
  from public.venue_photo_submissions
  where id = p_submission_id
    and venue_slug = p_venue_slug
    and image_path = p_image_path
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
  end if;
  if v_submission.storage_state = 'removed' then
    return jsonb_build_object('ok', true, 'storage_state', 'removed', 'deduplicated', true);
  end if;
  if v_submission.storage_state <> 'cleanup_pending'
    or v_submission.consent_granted
    or v_submission.consent_log_id is not null
    or exists (
      select 1
      from public.consent_log consent
      where consent.consent_type = 'venue_photo_rights'
        and consent.submission_ids @> array[p_submission_id]
    ) then
    return jsonb_build_object('ok', false, 'error', 'state_conflict');
  end if;

  update public.venue_photo_submissions
  set storage_state = 'removed',
      status = 'rejected',
      is_primary = false,
      published_url = null,
      submitter_name = null,
      submitter_contact = null,
      submitted_ip = null,
      submitted_ua = null,
      cleanup_completed_at = v_now,
      updated_at = v_now
  where id = p_submission_id;

  return jsonb_build_object(
    'ok', true,
    'storage_state', 'removed',
    'deduplicated', false
  );
end;
$$;

-- Operator-only reconciliation records an actual private Storage observation.
-- A present object requires a SHA-256 computed from downloaded bytes; absence
-- never deletes or scrubs ambiguous/consented evidence.
create or replace function public.reconcile_venue_photo_storage(
  p_submission_id uuid,
  p_venue_slug text,
  p_image_path text,
  p_storage_present boolean,
  p_content_sha256 text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_submission public.venue_photo_submissions%rowtype;
  v_digest bytea;
  v_now timestamptz := clock_timestamp();
  v_exact_consent boolean;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_submission_id is null
    or nullif(btrim(p_venue_slug), '') is null
    or nullif(btrim(p_image_path), '') is null
    or p_storage_present is null
    or (p_storage_present and p_content_sha256 !~ '^[0-9A-Fa-f]{64}$')
    or (not p_storage_present and p_content_sha256 is not null) then
    return jsonb_build_object('ok', false, 'error', 'invalid_reconciliation');
  end if;
  if p_storage_present then
    v_digest := decode(lower(p_content_sha256), 'hex');
  end if;

  select * into v_submission
  from public.venue_photo_submissions
  where id = p_submission_id
    and venue_slug = p_venue_slug
    and image_path = p_image_path
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'invalid_submission');
  end if;
  if v_submission.storage_state in ('cleanup_pending', 'removed') then
    return jsonb_build_object('ok', false, 'error', 'state_conflict');
  end if;

  select exists (
    select 1
    from public.consent_log consent
    where consent.id = v_submission.consent_log_id
      and consent.venue_slug = v_submission.venue_slug
      and consent.consent_type = 'venue_photo_rights'
      and consent.granted
      and consent.submission_ids @> array[p_submission_id]
  ) into v_exact_consent;

  if v_submission.consent_granted is distinct from v_exact_consent
    or (v_submission.consent_log_id is not null and not v_exact_consent)
    or exists (
      select 1
      from public.consent_log consent
      where consent.consent_type = 'venue_photo_rights'
        and consent.submission_ids @> array[p_submission_id]
        and consent.id is distinct from v_submission.consent_log_id
    ) then
    return jsonb_build_object('ok', false, 'error', 'consent_reconciliation_required');
  end if;

  if p_storage_present then
    if v_submission.content_sha256 is not null
      and v_submission.content_sha256 <> v_digest then
      return jsonb_build_object('ok', false, 'error', 'digest_conflict');
    end if;

    update public.venue_photo_submissions
    set storage_state = 'uploaded',
        content_sha256 = v_digest,
        status = case
          when not v_exact_consent and status = 'pending' then 'staging'
          else status
        end,
        storage_reconciled_at = v_now,
        updated_at = v_now
    where id = p_submission_id;

    return jsonb_build_object(
      'ok', true,
      'storage_state', 'uploaded',
      'consent_verified', v_exact_consent
    );
  end if;

  update public.venue_photo_submissions
  set storage_state = 'missing',
      storage_reconciled_at = v_now,
      updated_at = v_now
  where id = p_submission_id;

  return jsonb_build_object(
    'ok', true,
    'storage_state', 'missing',
    'consent_verified', v_exact_consent
  );
end;
$$;

-- Rejection remains a guarded transition, not direct table DML. Consented
-- evidence stays immutable; rejected uploaded bytes require a separate policy
-- decision and are never fed to the unconsented cleanup RPC.
create or replace function public.reject_venue_photo_submission(
  p_submission_id uuid,
  p_reviewed_by text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_submission public.venue_photo_submissions%rowtype;
  v_now timestamptz := clock_timestamp();
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  if p_submission_id is null
    or nullif(btrim(p_reviewed_by), '') is null
    or length(btrim(p_reviewed_by)) > 120 then
    return jsonb_build_object('ok', false, 'error', 'invalid_rejection');
  end if;

  select * into v_submission
  from public.venue_photo_submissions
  where id = p_submission_id
  for update;

  if not found
    or v_submission.status <> 'pending'
    or v_submission.storage_state <> 'uploaded'
    or v_submission.content_sha256 is null
    or not v_submission.consent_granted
    or v_submission.consent_log_id is null
    or not exists (
      select 1
      from public.consent_log consent
      where consent.id = v_submission.consent_log_id
        and consent.venue_slug = v_submission.venue_slug
        and consent.consent_type = 'venue_photo_rights'
        and consent.granted
        and consent.submission_ids @> array[p_submission_id]
    ) then
    return jsonb_build_object('ok', false, 'error', 'state_conflict');
  end if;

  update public.venue_photo_submissions
  set status = 'rejected',
      is_primary = false,
      published_url = null,
      reviewed_at = v_now,
      reviewed_by = left(btrim(p_reviewed_by), 120),
      updated_at = v_now
  where id = p_submission_id;

  return jsonb_build_object('ok', true, 'submission_id', p_submission_id);
end;
$$;

-- Approval now requires verified uploaded bytes and exact per-image consent.
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
    or v_submission.storage_state <> 'uploaded'
    or v_submission.content_sha256 is null
    or not v_submission.consent_granted
    or v_submission.consent_log_id is null
    or not exists (
      select 1
      from public.consent_log consent
      where consent.id = v_submission.consent_log_id
        and consent.venue_slug = v_submission.venue_slug
        and consent.consent_type = 'venue_photo_rights'
        and consent.granted
        and consent.submission_ids @> array[p_submission_id]
    ) then
    return jsonb_build_object('ok', false, 'error', 'consent_or_storage_required');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('venue-photo-publish:' || v_submission.venue_slug, 0)
  );

  update public.venue_photo_submissions
  set is_primary = false,
      updated_at = v_reviewed_at
  where venue_slug = v_submission.venue_slug
    and is_primary;

  update public.venue_photo_submissions
  set status = 'approved',
      is_primary = true,
      published_url = p_delivery_url,
      reviewed_at = v_reviewed_at,
      reviewed_by = left(btrim(p_reviewed_by), 120),
      updated_at = v_reviewed_at
  where id = p_submission_id
    and status = 'pending'
    and storage_state = 'uploaded'
    and content_sha256 = v_submission.content_sha256;

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

-- Exact 0041 readiness: first verify the complete 0040 contract, then the
-- photo lifecycle schema and data. No tenant identifiers are returned.
create or replace function public.release_readiness_v2()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_v1 jsonb;
  v_schema_ok boolean;
  v_data_ok boolean;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;

  v_v1 := public.release_readiness_v1();

  select
    v_v1->>'ok' = 'true'
    and v_v1->>'version' = '1'
    and v_v1->>'schemaRevision' = '0040'
    and to_regprocedure(
      'public.reserve_venue_photo_submission(uuid,text,text,text,text)'
    ) is not null
    and to_regprocedure(
      'public.mark_venue_photo_uploaded(uuid,text,text,text)'
    ) is not null
    and to_regprocedure(
      'public.record_venue_photo_consent(uuid[],text,text,text,text,text,inet)'
    ) is not null
    and to_regprocedure(
      'public.request_venue_photo_cleanup(uuid,text,text,text)'
    ) is not null
    and to_regprocedure(
      'public.complete_venue_photo_cleanup(uuid,text,text,boolean)'
    ) is not null
    and to_regprocedure(
      'public.reconcile_venue_photo_storage(uuid,text,text,boolean,text)'
    ) is not null
    and to_regprocedure(
      'public.reject_venue_photo_submission(uuid,text)'
    ) is not null
    and to_regprocedure(
      'public.approve_venue_photo_submission(uuid,text,text)'
    ) is not null
    and to_regprocedure('public.release_readiness_v2()') is not null
    and (
      select count(*)
      from pg_trigger trigger_row
      where (trigger_row.tgrelid, trigger_row.tgname) in (
        (
          'public.venue_photo_submissions'::regclass,
          'venue_photo_submission_integrity_guard'
        ),
        (
          'public.consent_log'::regclass,
          'venue_photo_consent_log_integrity_guard'
        )
      )
        and not trigger_row.tgisinternal
        and trigger_row.tgenabled <> 'D'
    ) = 2
    and (
      select count(*)
      from pg_constraint constraint_row
      where constraint_row.conrelid = 'public.venue_photo_submissions'::regclass
        and constraint_row.conname in (
          'venue_photo_submissions_status_check',
          'venue_photo_submissions_storage_state_check',
          'venue_photo_submissions_content_sha256_check',
          'venue_photo_submissions_storage_lifecycle_check'
        )
        and constraint_row.convalidated
    ) = 4
    and has_table_privilege('service_role', 'public.venue_photo_submissions', 'select')
    and not has_table_privilege('service_role', 'public.venue_photo_submissions', 'insert')
    and not has_table_privilege('service_role', 'public.venue_photo_submissions', 'update')
    and not has_table_privilege('service_role', 'public.venue_photo_submissions', 'delete')
    and not has_table_privilege('service_role', 'public.consent_log', 'insert')
    and not has_table_privilege('service_role', 'public.consent_log', 'update')
    and not has_table_privilege('service_role', 'public.consent_log', 'delete')
    and (
      select count(*)
      from (
        values
          (to_regprocedure('public.reserve_venue_photo_submission(uuid,text,text,text,text)')),
          (to_regprocedure('public.mark_venue_photo_uploaded(uuid,text,text,text)')),
          (to_regprocedure('public.record_venue_photo_consent(uuid[],text,text,text,text,text,inet)')),
          (to_regprocedure('public.request_venue_photo_cleanup(uuid,text,text,text)')),
          (to_regprocedure('public.complete_venue_photo_cleanup(uuid,text,text,boolean)')),
          (to_regprocedure('public.reconcile_venue_photo_storage(uuid,text,text,boolean,text)')),
          (to_regprocedure('public.reject_venue_photo_submission(uuid,text)')),
          (to_regprocedure('public.approve_venue_photo_submission(uuid,text,text)')),
          (to_regprocedure('public.release_readiness_v2()'))
      ) required_function(function_oid)
      where required_function.function_oid is not null
        and has_function_privilege(
          'service_role', required_function.function_oid, 'execute'
        )
        and not has_function_privilege(
          'anon', required_function.function_oid, 'execute'
        )
        and not has_function_privilege(
          'authenticated', required_function.function_oid, 'execute'
        )
    ) = 9
  into v_schema_ok;

  select
    not exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.storage_state in (
        'reconcile_required', 'missing', 'cleanup_pending'
      )
    )
    and not exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.storage_state in ('reserved', 'uploaded')
        and submission.created_at < current_timestamp - interval '1 hour'
        and not submission.consent_granted
        and submission.consent_log_id is null
        and not exists (
          select 1
          from public.consent_log consent
          where consent.consent_type = 'venue_photo_rights'
            and consent.submission_ids @> array[submission.id]
        )
    )
    and not exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.storage_state = 'uploaded'
        and submission.content_sha256 is null
    )
    and not exists (
      select 1
      from public.venue_photo_submissions submission
      where (
        submission.consent_granted
        and (
          submission.consent_log_id is null
          or not exists (
            select 1
            from public.consent_log consent
            where consent.id = submission.consent_log_id
              and consent.venue_slug = submission.venue_slug
              and consent.consent_type = 'venue_photo_rights'
              and consent.granted
              and consent.submission_ids @> array[submission.id]
          )
        )
      ) or (
        not submission.consent_granted
        and (
          submission.consent_log_id is not null
          or exists (
            select 1
            from public.consent_log consent
            where consent.consent_type = 'venue_photo_rights'
              and consent.submission_ids @> array[submission.id]
          )
        )
      ) or exists (
        select 1
        from public.consent_log consent
        where consent.consent_type = 'venue_photo_rights'
          and consent.submission_ids @> array[submission.id]
          and consent.id is distinct from submission.consent_log_id
      )
    )
    and not exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.status in ('pending', 'approved')
        and (
          submission.storage_state <> 'uploaded'
          or submission.content_sha256 is null
          or not submission.consent_granted
          or submission.consent_log_id is null
          or not exists (
            select 1
            from public.consent_log consent
            where consent.id = submission.consent_log_id
              and consent.venue_slug = submission.venue_slug
              and consent.consent_type = 'venue_photo_rights'
              and consent.granted
              and consent.submission_ids @> array[submission.id]
          )
        )
    )
    and not exists (
      select 1
      from public.venue_photo_submissions submission
      where submission.status = 'staging'
        and (
          submission.storage_state not in ('reserved', 'uploaded')
          or submission.consent_granted
          or submission.consent_log_id is not null
        )
    )
  into v_data_ok;

  return jsonb_build_object(
    'ok', coalesce(v_schema_ok, false) and coalesce(v_data_ok, false),
    'version', 2,
    'schemaRevision', '0041'
  );
end;
$$;

-- All photo writes now go through row-locking definer functions. Direct DML
-- remains unavailable even to the application service role.
revoke all on table public.venue_photo_submissions
  from public, anon, authenticated, service_role;
grant select on table public.venue_photo_submissions to service_role;
revoke insert, update, delete on table public.consent_log from service_role;
grant select on table public.consent_log to service_role;

revoke all on function public.reserve_venue_photo_submission(uuid,text,text,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.mark_venue_photo_uploaded(uuid,text,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.record_venue_photo_consent(
  uuid[],text,text,text,text,text,inet
) from public, anon, authenticated, service_role;
revoke all on function public.request_venue_photo_cleanup(uuid,text,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.complete_venue_photo_cleanup(uuid,text,text,boolean)
  from public, anon, authenticated, service_role;
revoke all on function public.reconcile_venue_photo_storage(
  uuid,text,text,boolean,text
) from public, anon, authenticated, service_role;
revoke all on function public.reject_venue_photo_submission(uuid,text)
  from public, anon, authenticated, service_role;
revoke all on function public.approve_venue_photo_submission(uuid,text,text)
  from public, anon, authenticated, service_role;
revoke all on function public.release_readiness_v2()
  from public, anon, authenticated, service_role;

grant execute on function public.reserve_venue_photo_submission(uuid,text,text,text,text)
  to service_role;
grant execute on function public.mark_venue_photo_uploaded(uuid,text,text,text)
  to service_role;
grant execute on function public.record_venue_photo_consent(
  uuid[],text,text,text,text,text,inet
) to service_role;
grant execute on function public.request_venue_photo_cleanup(uuid,text,text,text)
  to service_role;
grant execute on function public.complete_venue_photo_cleanup(uuid,text,text,boolean)
  to service_role;
grant execute on function public.reconcile_venue_photo_storage(
  uuid,text,text,boolean,text
) to service_role;
grant execute on function public.reject_venue_photo_submission(uuid,text)
  to service_role;
grant execute on function public.approve_venue_photo_submission(uuid,text,text)
  to service_role;
grant execute on function public.release_readiness_v2() to service_role;

comment on column public.venue_photo_submissions.content_sha256 is
  'Immutable SHA-256 of the exact uploaded bytes; first written only after a checked private upload/download.';
comment on column public.venue_photo_submissions.storage_state is
  'Durable private-object lifecycle. Historical rows remain reconcile_required until an explicit checked Storage observation.';
comment on function public.release_readiness_v2() is
  'Service-only exact readiness contract through 0041; verifies 0040 first and returns no tenant data.';

commit;
