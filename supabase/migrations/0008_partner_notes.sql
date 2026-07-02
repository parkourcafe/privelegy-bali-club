-- Partner report §11 "Notes": per-source-type breakdown + repeat redemptions.
-- Source type is derived from the source tag prefix (villa_01 -> villa). This is
-- the "we brought you N via villas, M via Reels" line, aggregate-only.

create or replace function public._source_type(p_source text)
returns text language sql immutable as $$
  select case
    when p_source is null or p_source = '' or p_source = 'in_venue' or p_source like 'venue%' then 'in_venue'
    when p_source like 'villa%'    then 'villa'
    when p_source like 'coliving%' then 'coliving'
    when p_source like 'reels%'    then 'reels'
    when p_source like 'creator%'  then 'creator'
    else 'direct'
  end;
$$;

create or replace function public.partner_notes(p_venue_slug text)
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'by_source', coalesce((
      select jsonb_object_agg(t, c) from (
        select public._source_type(source) as t, count(*) as c
        from redemption_events where venue_slug = p_venue_slug
        group by public._source_type(source)
      ) s
    ), '{}'::jsonb),
    'repeat', (
      select count(*)::int from (
        select guest_ref_id from redemption_events
        where venue_slug = p_venue_slug
        group by guest_ref_id having count(*) > 1
      ) r
    )
  );
$$;

revoke all on function public.partner_notes(text) from public;
grant execute on function public.partner_notes(text) to anon, authenticated;
