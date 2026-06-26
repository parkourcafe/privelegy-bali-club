-- Operator instrument for the Phase 0 go/no-go (§22). Aggregate-only, read via a
-- single SECURITY DEFINER call so the events/redemption tables stay default-deny.
-- This is the field-test dashboard for the founder, not a partner dashboard.

create or replace function public.phase0_overview()
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'funnel', jsonb_build_object(
      'source_scan',      (select count(*) from events where type = 'source_scan'),
      'landing_open',     (select count(*) from events where type = 'landing_open'),
      'venue_card_open',  (select count(*) from events where type = 'venue_card_open'),
      'perk_open',        (select count(*) from events where type = 'perk_open'),
      'redemption',       (select count(*) from redemption_events)
    ),
    'venues', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'slug', v.slug,
        'name', v.name,
        'perk_opens',            (select count(*) from events e where e.venue_slug = v.slug and e.type = 'perk_open'),
        'redemptions',           (select count(*) from redemption_events r where r.venue_slug = v.slug),
        'externally_attributed', (select count(*) from redemption_events r where r.venue_slug = v.slug and r.externally_attributed),
        'in_venue',              (select count(*) from redemption_events r where r.venue_slug = v.slug and not r.externally_attributed)
      ) order by v.name), '[]'::jsonb)
      from venues v where v.district = 'canggu' and v.status = 'active'
    )
  );
$$;

revoke all on function public.phase0_overview() from public;
grant execute on function public.phase0_overview() to anon, authenticated;
