-- Publish the exact owner-approved primary photo already attached to 14 venues.
-- Founder confirmation: agreements cover every exact photo in this batch
-- (2026-07-24). No other provisional photo is released by this migration.

begin;

create temporary table owner_approved_photos_20260724 (
  venue_slug text primary key
) on commit drop;

insert into owner_approved_photos_20260724 (venue_slug) values
  ('hujan-locale'),
  ('kynd-community'),
  ('locavore-nxt'),
  ('mamasan-bali'),
  ('mauri-restaurant'),
  ('merah-putih-indonesian-restaurant'),
  ('milk-and-madu-ubud'),
  ('mozaic'),
  ('revolver-seminyak'),
  ('room4dessert'),
  ('sangsaka'),
  ('the-avocado-factory'),
  ('watercress-seminyak'),
  ('watercress-ubud');

do $$
declare
  attached_count integer;
begin
  select count(*) into attached_count
  from owner_approved_photos_20260724 approved
  join public.venues venue on venue.slug = approved.venue_slug
  where nullif(btrim(venue.photo_url), '') is not null;

  if attached_count <> 14 then
    raise exception 'Expected 14 exact attached photo URLs, found %', attached_count;
  end if;
end
$$;

-- Preserve a single primary image per venue in the consent ledger.
update public.venue_photo_submissions submission
set
  is_primary = false,
  updated_at = now()
from owner_approved_photos_20260724 approved
where submission.venue_slug = approved.venue_slug;

insert into public.venue_photo_submissions (
  venue_slug,
  image_path,
  source_url,
  submitter_name,
  uploaded_by,
  consent_granted,
  consent_terms_version,
  consent_at,
  status,
  is_primary,
  owner_confirmed_at,
  owner_confirmation_note,
  updated_at
)
select
  venue.slug,
  regexp_replace(
    venue.photo_url,
    '^https?://[^/]+/storage/v1/object/public/[^/]+/',
    ''
  ),
  venue.photo_url,
  'Other Bali founder',
  'admin',
  true,
  'owner-photo-rights-v1',
  now(),
  'approved',
  true,
  now(),
  'Founder confirmed that an owner agreement covers this exact primary image; approved for public venue-card and venue-detail use on 2026-07-24.',
  now()
from owner_approved_photos_20260724 approved
join public.venues venue on venue.slug = approved.venue_slug
on conflict (image_path) do update
set
  venue_slug = excluded.venue_slug,
  source_url = excluded.source_url,
  submitter_name = excluded.submitter_name,
  consent_granted = true,
  consent_terms_version = excluded.consent_terms_version,
  consent_at = excluded.consent_at,
  status = 'approved',
  is_primary = true,
  owner_confirmed_at = excluded.owner_confirmed_at,
  owner_confirmation_note = excluded.owner_confirmation_note,
  updated_at = now();

update public.venues venue
set photo_status = 'published'
from owner_approved_photos_20260724 approved
where venue.slug = approved.venue_slug
  and nullif(btrim(venue.photo_url), '') is not null;

do $$
declare
  public_photo_count integer;
  consent_count integer;
begin
  select count(*) into public_photo_count
  from owner_approved_photos_20260724 approved
  join public.venues venue on venue.slug = approved.venue_slug
  where venue.photo_status = 'published'
    and nullif(btrim(venue.photo_url), '') is not null;

  select count(*) into consent_count
  from owner_approved_photos_20260724 approved
  join public.venue_photo_submissions submission
    on submission.venue_slug = approved.venue_slug
  where submission.status = 'approved'
    and submission.consent_granted is true
    and submission.owner_confirmed_at is not null
    and submission.is_primary is true;

  if public_photo_count <> 14 then
    raise exception 'Expected 14 published venue photos, found %', public_photo_count;
  end if;
  if consent_count <> 14 then
    raise exception 'Expected 14 approved primary consent records, found %', consent_count;
  end if;
end
$$;

commit;
