-- Photo-rights consent, recorded at photo time.
--
-- Before this, set_venue_photo() set venues.photo_url with NO consent record —
-- the upload ran independently of, and before, the listing-policy checkbox, so a
-- photo could become the live card image with no grant of rights on file. Since
-- the whole photo posture is "owners upload their own, they grant the rights"
-- (never scrape — CLAUDE.md guardrail #1), the grant must be explicit and logged.
--
-- This adds a consent log (one row per granted photo) and makes set_venue_photo
-- REQUIRE an explicit consent flag: no consent → no photo set. Same anon-callable
-- / unguessable-token posture as the other onboarding RPCs (auth deferred §19).

create table if not exists venue_photo_consents (
  id          uuid primary key default gen_random_uuid(),
  venue_slug  text not null references venues(slug) on delete cascade,
  token       text not null,
  photo_url   text not null,
  granted_by  text,             -- optional name/role typed by the venue person
  user_agent  text,
  ts          timestamptz not null default now()
);
create index if not exists photo_consents_venue_idx on venue_photo_consents(venue_slug);
alter table venue_photo_consents enable row level security; -- default deny

-- Replace the 2-arg set_venue_photo with a consent-gated version. Positional
-- 2-arg calls (a stale deploy mid-rollout) resolve here with p_consent=false and
-- are rejected — fail safe: an ungranted photo is never set.
drop function if exists public.set_venue_photo(text, text);
create or replace function public.set_venue_photo(
  p_token text,
  p_url text,
  p_consent boolean default false,
  p_granted_by text default null,
  p_user_agent text default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text;
begin
  select venue_slug into v_slug from venue_onboard_tokens where token = p_token;
  if v_slug is null then return jsonb_build_object('ok', false, 'error', 'bad_token'); end if;
  if p_url not like 'https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/venue-photos/%' then
    return jsonb_build_object('ok', false, 'error', 'bad_url');
  end if;
  if not coalesce(p_consent, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;
  insert into venue_photo_consents(venue_slug, token, photo_url, granted_by, user_agent)
    values (v_slug, p_token, p_url, left(p_granted_by, 120), left(coalesce(p_user_agent, ''), 300));
  update venues set photo_url = p_url where slug = v_slug;
  return jsonb_build_object('ok', true);
end; $$;

revoke all on function public.set_venue_photo(text, text, boolean, text, text) from public;
grant execute on function public.set_venue_photo(text, text, boolean, text, text) to anon, authenticated;
