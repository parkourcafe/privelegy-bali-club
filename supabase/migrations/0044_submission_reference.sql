-- 0044_submission_reference.sql
-- Stage A: return a stable reference + status from the submission intake, so
-- the /list-your-property confirmation screen can show "OB-XXXXXX · In review"
-- instead of a fabricated number.
--
-- Additive + backward compatible: the RPC keeps the same signature and its
-- existing keys (ok/error/duplicate); it only ADDS id/reference/status. The
-- existing /for-venues form ignores the extra keys. No table change, no new
-- column, no PII — the reference is derived deterministically from the row id.
--
-- Idempotent: create-or-replace only. Safe to run on an already-migrated DB.

create or replace function public.submit_venue_application(
  p_name text,
  p_category text default null,
  p_district text default null,
  p_whatsapp text default null,
  p_email text default null,
  p_instagram_url text default null,
  p_website_url text default null,
  p_note text default null,
  p_consent boolean default false,
  p_source text default null,
  p_utm jsonb default null,
  p_user_agent text default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_name  text := nullif(left(btrim(coalesce(p_name, '')), 160), '');
  v_cat   text := nullif(left(btrim(lower(coalesce(p_category, ''))), 40), '');
  v_dist  text := nullif(left(btrim(lower(coalesce(p_district, ''))), 60), '');
  v_wa    text := nullif(regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g'), '');
  v_email text := nullif(left(btrim(lower(coalesce(p_email, ''))), 200), '');
  v_ig    text := nullif(left(btrim(coalesce(p_instagram_url, '')), 300), '');
  v_web   text := nullif(left(btrim(coalesce(p_website_url, '')), 300), '');
  v_note  text := nullif(left(btrim(coalesce(p_note, '')), 1000), '');
  v_dup   boolean := false;
  v_id    uuid;
  v_status text;
  v_ref   text;
begin
  -- Consent is required and never preselected client-side.
  if not coalesce(p_consent, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;
  if v_name is null then
    return jsonb_build_object('ok', false, 'error', 'name_required');
  end if;
  -- A submission is useless without at least one way to reach the venue.
  if v_wa is null and v_email is null and v_ig is null and v_web is null then
    return jsonb_build_object('ok', false, 'error', 'contact_required');
  end if;
  if v_wa is not null and (length(v_wa) < 7 or length(v_wa) > 16) then
    return jsonb_build_object('ok', false, 'error', 'bad_whatsapp');
  end if;
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('ok', false, 'error', 'bad_email');
  end if;

  v_dup := exists (
    select 1 from venue_submissions
    where lower(btrim(name)) = lower(v_name)
      and coalesce(lower(btrim(district)), '') = coalesce(v_dist, '')
  );

  insert into venue_submissions (
    name, category, district, whatsapp, email, instagram_url, website_url,
    note, consent_granted, source, utm, user_agent
  ) values (
    v_name, v_cat, v_dist, v_wa, v_email, v_ig, v_web,
    v_note, true,
    nullif(left(btrim(coalesce(p_source, '')), 80), ''),
    p_utm,
    nullif(left(coalesce(p_user_agent, ''), 400), '')
  )
  on conflict (lower(btrim(name)), coalesce(lower(btrim(district)), '')) do update set
    category      = coalesce(excluded.category, venue_submissions.category),
    whatsapp      = coalesce(excluded.whatsapp, venue_submissions.whatsapp),
    email         = coalesce(excluded.email, venue_submissions.email),
    instagram_url = coalesce(excluded.instagram_url, venue_submissions.instagram_url),
    website_url   = coalesce(excluded.website_url, venue_submissions.website_url),
    note          = coalesce(excluded.note, venue_submissions.note),
    updated_at    = now()
  returning id, status into v_id, v_status;

  -- Human-friendly reference, derived deterministically from the row id (no new
  -- column, no sequence, no PII). Same submission -> same reference.
  v_ref := 'OB-' || upper(substr(replace(v_id::text, '-', ''), 1, 6));

  return jsonb_build_object(
    'ok', true,
    'duplicate', v_dup,
    'id', v_id,
    'reference', v_ref,
    'status', v_status
  );
end; $$;

revoke all on function public.submit_venue_application(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) from public;
grant execute on function public.submit_venue_application(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) to anon, authenticated;
