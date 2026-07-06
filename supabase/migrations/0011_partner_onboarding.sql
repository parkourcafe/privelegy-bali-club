-- Partner self-onboarding: a tokenized link per venue. The venue sees its card
-- preview, confirms listing under our policy (recorded like a consent log), and
-- uploads its own photos (which settles photo rights — they upload, they grant).
-- No partner auth yet (deferred §19); the unguessable token IS the credential.

create table if not exists venue_onboard_tokens (
  token       text primary key,
  venue_slug  text not null references venues(slug) on delete cascade,
  created_at  timestamptz not null default now()
);
create index if not exists onboard_tokens_venue_idx on venue_onboard_tokens(venue_slug);
alter table venue_onboard_tokens enable row level security; -- default deny

create table if not exists venue_confirmations (
  id            uuid primary key default gen_random_uuid(),
  venue_slug    text not null references venues(slug) on delete cascade,
  confirmed_by  text,            -- name/role typed by the venue person
  agreed        boolean not null,
  user_agent    text,
  ts            timestamptz not null default now()
);
alter table venue_confirmations enable row level security; -- default deny

-- Storage bucket for venue-uploaded photos (public read).
insert into storage.buckets (id, name, public)
values ('venue-photos', 'venue-photos', true)
on conflict (id) do nothing;

-- Anon may upload ONLY into a folder named by a valid onboarding token.
drop policy if exists "onboard photo upload" on storage.objects;
create policy "onboard photo upload" on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'venue-photos'
  and exists (
    select 1 from public.venue_onboard_tokens t
    where t.token = (storage.foldername(name))[1]
  )
);
drop policy if exists "public read venue photos" on storage.objects;
create policy "public read venue photos" on storage.objects for select
using (bucket_id = 'venue-photos');

-- ---------- RPCs ----------

-- Operator: mint (or fetch) the invite token for a venue.
create or replace function public.get_or_create_onboard_token(p_venue_slug text)
returns text language plpgsql security definer set search_path = public, pg_temp as $$
declare v_token text;
begin
  if not exists (select 1 from venues where slug = p_venue_slug) then return null; end if;
  select token into v_token from venue_onboard_tokens where venue_slug = p_venue_slug limit 1;
  if v_token is null then
    -- md5-based token: pgcrypto's gen_random_bytes lives in the extensions
    -- schema on Supabase and is outside this function's pinned search_path.
    v_token := md5(random()::text || clock_timestamp()::text || p_venue_slug);
    insert into venue_onboard_tokens(token, venue_slug) values (v_token, p_venue_slug);
  end if;
  return v_token;
end; $$;

-- Venue side: everything the onboarding page needs, by token.
create or replace function public.onboard_info(p_token text)
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'venue', (select to_jsonb(v) - 'created_at' from venues v
              join venue_onboard_tokens t on t.venue_slug = v.slug
              where t.token = p_token),
    'perk', (select jsonb_build_object('title', p.title, 'terms', p.terms)
             from perks p join venue_onboard_tokens t on t.venue_slug = p.venue_slug
             where t.token = p_token and p.active limit 1),
    'confirmed', exists (
      select 1 from venue_confirmations c
      join venue_onboard_tokens t on t.venue_slug = c.venue_slug
      where t.token = p_token and c.agreed)
  );
$$;

-- Venue side: record the confirmation.
create or replace function public.confirm_onboarding(
  p_token text, p_name text, p_agreed boolean, p_user_agent text
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text;
begin
  select venue_slug into v_slug from venue_onboard_tokens where token = p_token;
  if v_slug is null then return jsonb_build_object('ok', false, 'error', 'bad_token'); end if;
  if not coalesce(p_agreed, false) then return jsonb_build_object('ok', false, 'error', 'agreement_required'); end if;
  insert into venue_confirmations(venue_slug, confirmed_by, agreed, user_agent)
    values (v_slug, left(coalesce(p_name,''), 120), true, left(coalesce(p_user_agent,''), 300));
  update venues set status = 'active' where slug = v_slug;
  return jsonb_build_object('ok', true, 'venue_slug', v_slug);
end; $$;

-- Venue side: register an uploaded photo as the card photo.
create or replace function public.set_venue_photo(p_token text, p_url text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare v_slug text;
begin
  select venue_slug into v_slug from venue_onboard_tokens where token = p_token;
  if v_slug is null then return jsonb_build_object('ok', false, 'error', 'bad_token'); end if;
  if p_url not like 'https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/venue-photos/%' then
    return jsonb_build_object('ok', false, 'error', 'bad_url');
  end if;
  update venues set photo_url = p_url where slug = v_slug;
  return jsonb_build_object('ok', true);
end; $$;

revoke all on function public.get_or_create_onboard_token(text) from public;
revoke all on function public.onboard_info(text) from public;
revoke all on function public.confirm_onboarding(text,text,boolean,text) from public;
revoke all on function public.set_venue_photo(text,text) from public;
grant execute on function public.get_or_create_onboard_token(text) to anon, authenticated;
grant execute on function public.onboard_info(text) to anon, authenticated;
grant execute on function public.confirm_onboarding(text,text,boolean,text) to anon, authenticated;
grant execute on function public.set_venue_photo(text,text) to anon, authenticated;
