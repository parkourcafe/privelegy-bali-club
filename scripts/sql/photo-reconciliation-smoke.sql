-- Transactional PostgreSQL smoke for migration 0041.
-- Requires a clean 0001 -> 0041 replay and rolls all fixture rows back.

begin;

select set_config('request.jwt.claim.role', 'service_role', true);

do $smoke$
declare
  v_result jsonb;
  v_consent_count bigint;
  v_submission public.venue_photo_submissions%rowtype;
  v_primary_id uuid := '00000000-0000-4000-8000-000000004101';
  v_reserved_cleanup_id uuid := '00000000-0000-4000-8000-000000004102';
  v_uploaded_cleanup_id uuid := '00000000-0000-4000-8000-000000004103';
  v_rejected_id uuid := '00000000-0000-4000-8000-000000004104';
  v_digest_a text := repeat('a', 64);
  v_digest_b text := repeat('b', 64);
  v_digest_c text := repeat('c', 64);
  v_cleanup_requested_at timestamptz;
begin
  v_result := public.release_readiness_v2();
  if v_result <> jsonb_build_object(
    'ok', true,
    'version', 2,
    'schemaRevision', '0041'
  ) then
    raise exception 'clean 0041 readiness failed: %', v_result;
  end if;

  if has_table_privilege(
    'service_role', 'public.venue_photo_submissions', 'insert'
  ) or has_table_privilege(
    'service_role', 'public.venue_photo_submissions', 'update'
  ) or has_table_privilege(
    'service_role', 'public.venue_photo_submissions', 'delete'
  ) then
    raise exception 'service role retained direct photo-submission DML';
  end if;

  v_result := public.reserve_venue_photo_submission(
    v_primary_id,
    'home-cafe',
    'home-cafe/0041-primary.webp',
    'Venue Owner',
    'owner@example.invalid'
  );
  if v_result->>'ok' <> 'true' or v_result->>'storage_state' <> 'reserved' then
    raise exception 'reserve failed: %', v_result;
  end if;

  select * into strict v_submission
  from public.venue_photo_submissions
  where id = v_primary_id;
  if v_submission.status <> 'staging'
    or v_submission.storage_state <> 'reserved'
    or v_submission.content_sha256 is not null then
    raise exception 'reserve entered an unsafe state';
  end if;

  v_result := public.mark_venue_photo_uploaded(
    v_primary_id,
    'home-cafe',
    'home-cafe/0041-primary.webp',
    v_digest_a
  );
  if v_result->>'ok' <> 'true' or v_result->>'storage_state' <> 'uploaded' then
    raise exception 'mark uploaded failed: %', v_result;
  end if;

  v_result := public.mark_venue_photo_uploaded(
    v_primary_id,
    'home-cafe',
    'home-cafe/0041-primary.webp',
    v_digest_b
  );
  if v_result->>'error' <> 'state_conflict' then
    raise exception 'replacement digest was not rejected: %', v_result;
  end if;

  v_result := public.record_venue_photo_consent(
    array[v_primary_id],
    'home-cafe',
    'Venue Owner',
    'owner@example.invalid',
    'venue-photo-rights-v1',
    '0041-smoke',
    '127.0.0.1'::inet
  );
  if v_result->>'ok' <> 'true'
    or v_result->>'deduplicated' <> 'false' then
    raise exception 'consent failed: %', v_result;
  end if;

  select count(*) into v_consent_count
  from public.consent_log consent
  where consent.consent_type = 'venue_photo_rights'
    and consent.submission_ids @> array[v_primary_id];

  v_result := public.record_venue_photo_consent(
    array[v_primary_id],
    'home-cafe',
    'Venue Owner',
    'owner@example.invalid',
    'venue-photo-rights-v1',
    '0041-smoke',
    '127.0.0.1'::inet
  );
  if v_result->>'ok' <> 'true'
    or v_result->>'deduplicated' <> 'true' then
    raise exception 'exact consent retry was not idempotent: %', v_result;
  end if;
  if (
    select count(*)
    from public.consent_log consent
    where consent.consent_type = 'venue_photo_rights'
      and consent.submission_ids @> array[v_primary_id]
  ) <> v_consent_count then
    raise exception 'exact consent retry appended evidence';
  end if;

  v_result := public.request_venue_photo_cleanup(
    v_primary_id,
    'home-cafe',
    'home-cafe/0041-primary.webp',
    'smoke_cleanup'
  );
  if v_result->>'error' <> 'consent_recorded' then
    raise exception 'consented cleanup was not rejected: %', v_result;
  end if;

  v_result := public.approve_venue_photo_submission(
    v_primary_id,
    'https://www.otherbali.com/api/venue-photo/' || v_primary_id::text,
    'Release Reviewer'
  );
  if v_result->>'ok' <> 'true' then
    raise exception 'approval failed: %', v_result;
  end if;

  begin
    update public.venue_photo_submissions
    set content_sha256 = decode(v_digest_b, 'hex')
    where id = v_primary_id;
    raise exception 'digest replacement unexpectedly succeeded';
  exception
    when sqlstate '55000' then null;
  end;

  begin
    delete from public.venue_photo_submissions where id = v_primary_id;
    raise exception 'durable photo row delete unexpectedly succeeded';
  exception
    when sqlstate '55000' then null;
  end;

  -- Crash boundary: reserve before upload. Cleanup is idempotent, scrubs PII,
  -- and cannot complete until the caller confirms object absence/removal.
  v_result := public.reserve_venue_photo_submission(
    v_reserved_cleanup_id,
    'home-cafe',
    'home-cafe/0041-reserved-cleanup.webp',
    'Cleanup Person',
    'cleanup@example.invalid'
  );
  v_result := public.request_venue_photo_cleanup(
    v_reserved_cleanup_id,
    'home-cafe',
    'home-cafe/0041-reserved-cleanup.webp',
    'stale_unconsented_storage'
  );
  if v_result->>'storage_state' <> 'cleanup_pending' then
    raise exception 'reserved cleanup request failed: %', v_result;
  end if;

  select * into strict v_submission
  from public.venue_photo_submissions
  where id = v_reserved_cleanup_id;
  if v_submission.submitter_name is not null
    or v_submission.submitter_contact is not null
    or v_submission.submitted_ip is not null
    or v_submission.submitted_ua is not null then
    raise exception 'unconsented cleanup did not scrub PII';
  end if;
  v_cleanup_requested_at := v_submission.cleanup_requested_at;

  v_result := public.complete_venue_photo_cleanup(
    v_reserved_cleanup_id,
    'home-cafe',
    'home-cafe/0041-reserved-cleanup.webp',
    false
  );
  if v_result->>'error' <> 'storage_removal_unconfirmed' then
    raise exception 'unconfirmed cleanup completed: %', v_result;
  end if;

  v_result := public.request_venue_photo_cleanup(
    v_reserved_cleanup_id,
    'home-cafe',
    'home-cafe/0041-reserved-cleanup.webp',
    'stale_unconsented_storage'
  );
  if v_result->>'deduplicated' <> 'true' then
    raise exception 'cleanup request retry was not idempotent: %', v_result;
  end if;
  if (
    select cleanup_requested_at
    from public.venue_photo_submissions
    where id = v_reserved_cleanup_id
  ) is distinct from v_cleanup_requested_at then
    raise exception 'cleanup retry changed the first-write grace timestamp';
  end if;

  v_result := public.complete_venue_photo_cleanup(
    v_reserved_cleanup_id,
    'home-cafe',
    'home-cafe/0041-reserved-cleanup.webp',
    true
  );
  if v_result->>'storage_state' <> 'removed' then
    raise exception 'confirmed cleanup failed: %', v_result;
  end if;

  v_result := public.complete_venue_photo_cleanup(
    v_reserved_cleanup_id,
    'home-cafe',
    'home-cafe/0041-reserved-cleanup.webp',
    true
  );
  if v_result->>'deduplicated' <> 'true' then
    raise exception 'completion retry was not idempotent: %', v_result;
  end if;

  -- Crash boundary: bytes uploaded but mark callback did not complete. The
  -- durable reserved state still uses the same consent-aware cleanup CAS.
  v_result := public.reserve_venue_photo_submission(
    v_uploaded_cleanup_id,
    'home-cafe',
    'home-cafe/0041-uploaded-cleanup.webp',
    'Upload Person',
    ''
  );
  v_result := public.request_venue_photo_cleanup(
    v_uploaded_cleanup_id,
    'home-cafe',
    'home-cafe/0041-uploaded-cleanup.webp',
    'stale_unconsented_storage'
  );
  v_result := public.complete_venue_photo_cleanup(
    v_uploaded_cleanup_id,
    'home-cafe',
    'home-cafe/0041-uploaded-cleanup.webp',
    true
  );
  if v_result->>'storage_state' <> 'removed' then
    raise exception 'upload-before-mark cleanup failed: %', v_result;
  end if;

  -- Guarded rejection sees only a consented uploaded pending row.
  v_result := public.reserve_venue_photo_submission(
    v_rejected_id,
    'home-cafe',
    'home-cafe/0041-rejected.webp',
    'Venue Owner',
    ''
  );
  v_result := public.mark_venue_photo_uploaded(
    v_rejected_id,
    'home-cafe',
    'home-cafe/0041-rejected.webp',
    v_digest_c
  );
  v_result := public.record_venue_photo_consent(
    array[v_rejected_id],
    'home-cafe',
    'Venue Owner',
    '',
    'venue-photo-rights-v1',
    '0041-smoke',
    null
  );
  v_result := public.reject_venue_photo_submission(
    v_rejected_id,
    'Release Reviewer'
  );
  if v_result->>'ok' <> 'true' then
    raise exception 'guarded rejection failed: %', v_result;
  end if;

  v_result := public.release_readiness_v2();
  if v_result <> jsonb_build_object(
    'ok', true,
    'version', 2,
    'schemaRevision', '0041'
  ) then
    raise exception 'post-transition 0041 readiness failed: %', v_result;
  end if;
end
$smoke$;

rollback;
