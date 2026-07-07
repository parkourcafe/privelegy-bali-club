-- Operator view: onboarding progress per active Canggu venue — invited (has a
-- token), confirmed (agreed at least once), and has a photo. Aggregate, used on
-- the /admin Field Kit list.
create or replace function public.onboard_status()
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'slug', v.slug,
    'invited', exists (select 1 from venue_onboard_tokens t where t.venue_slug = v.slug),
    'confirmed', exists (select 1 from venue_confirmations c where c.venue_slug = v.slug and c.agreed),
    'has_photo', v.photo_url is not null
  ) order by v.name), '[]'::jsonb)
  from venues v where v.district = 'canggu' and v.status = 'active';
$$;
revoke all on function public.onboard_status() from public;
grant execute on function public.onboard_status() to anon, authenticated;
