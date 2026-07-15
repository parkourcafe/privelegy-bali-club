-- Public venue self-submission intake (2026-07-15).
--
-- A net-new venue that is NOT yet in the catalogue can request a listing
-- from a public page (/for-venues). The submission lands in a pending
-- queue — it NEVER creates a published venue and never appears on the
-- public guide by itself. Editorial reviews each row by hand, writes the
-- fit/why-it's-here fields, and only then promotes it to a real venue.
--
-- This is the intake sibling of the tokenized /onboard flow: onboard =
-- "claim your EXISTING listing"; this = "ask to be ADDED". Same discipline
-- as guide_leads (migration 0018): default-deny RLS, writes only through a
-- SECURITY DEFINER RPC, honeypot handled at the API layer, consent required.
--
-- Guardrails: no auto-publish (§10 — unknown/unverified stays out of the
-- public app; editorial owns the decision). No new PUBLIC domain entity —
-- this is a first-party, opt-in intake record, mirror of guide_leads, not a
-- venue. No photos here (photo rights live on the tokenized onboard side,
-- Content publication rule v2). Minimal PII, only contact + what's needed to
-- verify. Idempotent: safe to re-run.

-- ── Table ───────────────────────────────────────────────────────────────
create table if not exists public.venue_submissions (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  category        text,
  district        text,
  whatsapp        text,
  email           text,
  instagram_url   text,
  website_url     text,
  note            text,
  status          text not null default 'needs_verification'
                    check (status in ('needs_verification', 'reviewing', 'accepted', 'rejected')),
  consent_granted boolean not null,
  consent_ts      timestamptz not null default now(),
  source          text,
  utm             jsonb,
  user_agent      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.venue_submissions is
  'Public self-submission intake queue for venues NOT yet in the catalogue. Pending only — editorial promotes to venues by hand. Never auto-published.';

-- One pending submission per (name, district): a repeat submission updates
-- the same row instead of multiplying the queue.
create unique index if not exists venue_submissions_identity_key
  on public.venue_submissions (lower(btrim(name)), coalesce(lower(btrim(district)), ''));

alter table public.venue_submissions enable row level security;
-- Default-deny: no anon/authenticated policies. Public writes go through the
-- SECURITY DEFINER RPC below; operator reads use the service role.

-- ── Intake RPC ──────────────────────────────────────────────────────────
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
    updated_at    = now();

  return jsonb_build_object('ok', true, 'duplicate', v_dup);
end; $$;

revoke all on function public.submit_venue_application(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) from public;
grant execute on function public.submit_venue_application(text,text,text,text,text,text,text,text,boolean,text,jsonb,text) to anon, authenticated;
