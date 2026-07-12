-- Island-wide invite roster: one round-trip that ensures every venue has an
-- onboarding token and returns the full list for the operator /admin/invites
-- export. Batches what get_or_create_onboard_token does per-venue, so the page
-- doesn't fire hundreds of RPCs. Same anon-callable / unguessable-token posture
-- as the existing onboarding RPCs (auth deferred, master §19).

create or replace function public.invite_roster()
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
  -- mint a token for any venue that doesn't have one yet (idempotent)
  insert into venue_onboard_tokens(token, venue_slug)
  select md5(random()::text || clock_timestamp()::text || v.slug), v.slug
  from venues v
  where not exists (select 1 from venue_onboard_tokens t where t.venue_slug = v.slug);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'slug', v.slug,
      'name', v.name,
      'district', v.district,
      'status', v.status,
      'whatsapp', v.whatsapp,
      'token', tk.token,
      'confirmed', exists (select 1 from venue_confirmations c where c.venue_slug = v.slug and c.agreed),
      'has_photo', v.photo_url is not null
    ) order by v.district, v.name)
    from venues v
    join lateral (
      select token from venue_onboard_tokens t where t.venue_slug = v.slug order by token limit 1
    ) tk on true
  ), '[]'::jsonb);
end; $$;

revoke all on function public.invite_roster() from public;
grant execute on function public.invite_roster() to anon, authenticated;
