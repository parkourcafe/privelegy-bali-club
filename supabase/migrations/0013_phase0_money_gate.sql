-- Re-cut Phase 0 around money model v0.3:
-- intent -> TablePilot reservation -> seated. QR redemption remains a separate
-- arrival-proof signal and is not the billable event.

create or replace function public.phase0_overview()
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object(
    'funnel', jsonb_build_object(
      'source_scan',       (select count(*) from events where type = 'source_scan'),
      'landing_open',      (select count(*) from events where type = 'landing_open'),
      'venue_card_open',   (select count(*) from events where type = 'venue_card_open'),
      'perk_open',         (select count(*) from events where type = 'perk_open'),
      'direction_click',   (select count(*) from events where type = 'direction_click'),
      'reservation_click', (select count(*) from events where type = 'reservation_click'),
      'similar_open',      (select count(*) from events where type = 'similar_open'),
      'redemption',        (select count(*) from redemption_events)
    ),
    'venues', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'slug', v.slug,
        'name', v.name,
        'direction_clicks',    (select count(*) from events e where e.venue_slug = v.slug and e.type = 'direction_click'),
        'reservation_clicks',  (select count(*) from events e where e.venue_slug = v.slug and e.type = 'reservation_click'),
        'perk_opens',          (select count(*) from events e where e.venue_slug = v.slug and e.type = 'perk_open'),
        'redemptions',         (select count(*) from redemption_events r where r.venue_slug = v.slug),
        'externally_attributed', (select count(*) from redemption_events r where r.venue_slug = v.slug and r.source_class = 'external'),
        'in_venue',            (select count(*) from redemption_events r where r.venue_slug = v.slug and r.source_class = 'in_venue'),
        'creator',             (select count(*) from redemption_events r where r.venue_slug = v.slug and r.source_class = 'creator')
      ) order by v.name), '[]'::jsonb)
      from venues v where v.district = 'canggu' and v.status = 'active'
    )
  );
$$;

revoke all on function public.phase0_overview() from public;
grant execute on function public.phase0_overview() to anon, authenticated;
