-- Wave 2 T5 pilot analytics. The client and API remain consent-gated; this
-- migration only extends the existing bounded service-role event allowlist.
begin;

create or replace function public.log_event(
  p_type text,
  p_guest_ref text,
  p_venue_slug text,
  p_source text
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if p_type not in (
    'source_scan','landing_open','venue_card_open','perk_open',
    'direction_click','reservation_click','similar_open','district_open',
    'district_page_view','editorial_page_view','venue_detail_view',
    'venue_card_click','booking_click','official_website_click',
    'instagram_click','menu_click','partner_offer_click',
    'guide_form_started','guide_form_submitted','whatsapp_guide_click',
    'internal_guide_click','menu_open','menu_item_open','action_handoff',
    'delivery_click','takeaway_click','preorder_click','save','route_add',
    'shortlist_generated'
  )
    or (p_guest_ref is not null and p_guest_ref !~ '^g_[A-Za-z0-9_-]{16}$')
    or (p_venue_slug is not null and (
      length(p_venue_slug) > 120
      or p_venue_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$'
    )) then
    return;
  end if;
  if p_source is not null and not exists (
    select 1 from public.attribution_sources s where s.id = p_source and s.active
  ) then
    return;
  end if;
  if p_type = 'source_scan' and p_source is null then return; end if;

  select id into v_id from public.guest_refs where ref = p_guest_ref;
  if exists (
    select 1 from public.events e
    where e.type = p_type
      and e.guest_ref_id is not distinct from v_id
      and e.venue_slug is not distinct from p_venue_slug
      and e.source is not distinct from p_source
      and e.ts > clock_timestamp() - interval '5 seconds'
  ) then return; end if;
  insert into public.events(type, guest_ref_id, venue_slug, source)
  values (p_type, v_id, p_venue_slug, p_source);
end;
$$;

revoke all on function public.log_event(text,text,text,text) from public, anon, authenticated;
grant execute on function public.log_event(text,text,text,text) to service_role;

commit;
