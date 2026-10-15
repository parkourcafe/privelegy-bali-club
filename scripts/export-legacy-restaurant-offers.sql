-- Read-only inventory for the legacy Bali Privilege restaurant/card offers.
-- Run against production with a privileged, read-only SQL connection and export
-- the final result as CSV. This script does not publish or change any offer.

with latest_matching_confirmation as (
  select distinct on (c.perk_id)
    c.perk_id,
    c.confirmed_by,
    c.ts as confirmed_at
  from public.perk_offer_confirmations c
  join public.perks p
    on p.id = c.perk_id
   and p.venue_slug = c.venue_slug
   and c.agreed
   and c.perk_title = p.title
   and coalesce(c.perk_terms, '') = coalesce(p.terms, '')
   and c.ts >= p.verified_at
  order by c.perk_id, c.ts desc
)
select
  v.name as venue_name,
  v.slug as venue_slug,
  v.category,
  v.district,
  p.title as card_benefit,
  p.terms,
  p.active,
  p.publication_status,
  p.verified_at,
  p.expires_at,
  c.confirmed_at,
  c.confirmed_by,
  case
    when v.status <> 'active' then 'venue_inactive'
    when coalesce(v.publication_status, 'review') <> 'published' then 'venue_not_published'
    when not p.active then 'offer_inactive'
    when p.publication_status <> 'confirmed' then 'offer_not_confirmed'
    when p.verified_at is null then 'missing_verification_date'
    when p.expires_at is null then 'missing_expiry_date'
    when p.expires_at <= now() then 'offer_expired'
    when c.perk_id is null then 'missing_matching_owner_confirmation'
    else 'currently_eligible'
  end as evidence_status
from public.perks p
join public.venues v on v.slug = p.venue_slug
left join latest_matching_confirmation c on c.perk_id = p.id
where v.category in ('restaurant', 'cafe', 'warung', 'bar', 'beach_club')
order by v.district, v.name, p.created_at, p.id;
