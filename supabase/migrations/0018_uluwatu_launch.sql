-- Uluwatu district launch (2026-07-12).
--
-- 1. Additive nullable venue columns for verified commercial links + the
--    publication gate (brief §7/§8; master §6a.4 — price_band satisfies
--    expectedSpend, book_ahead satisfies bookAhead under the launch names).
-- 2. venue_fact_sources — per-fact provenance mirror (source type, URL,
--    verification date, status). The complete evidence ledger lives in code
--    at lib/uluwatu/venues.ts; this table is the DB mirror for ops/QA.
-- 3. guide_leads + submit_guide_lead RPC — persistent storage for the
--    "48 hours in Uluwatu" lead magnet (consent timestamp, source, UTM,
--    duplicate handling). Default-deny RLS; writes only via the RPC.
-- 4. Verified data backfill for the 25 uluwatu-bukit rows: micro-areas,
--    official/Instagram/booking links, official-domain opening hours,
--    price bands, publication status, verification date.
--
-- Guardrails: NO monetization change — uluwatu-bukit stays planning_only,
-- monetization_enabled=false, qr_enabled=false. Booking links are verified
-- official external channels (Book direct), never TablePilot, never a fee
-- loop (guardrails #3/#4/#5). No new tourist-facing entity: fact sources are
-- internal provenance; leads are first-party opt-in contact records.
-- Idempotent: safe to re-run.

-- ── 1. Venue columns ────────────────────────────────────────────────────
alter table public.venues add column if not exists official_url text;
alter table public.venues add column if not exists instagram_url text;
alter table public.venues add column if not exists booking_url text;
alter table public.venues add column if not exists opening_hours text;
alter table public.venues add column if not exists price_band text
  check (price_band is null or price_band in ('$', '$$', '$$$', '$$$$'));
alter table public.venues add column if not exists book_ahead text;
alter table public.venues add column if not exists last_verified_at date;
alter table public.venues add column if not exists publication_status text
  not null default 'review'
  check (publication_status in ('published', 'review'));

comment on column public.venues.booking_url is
  'Verified OFFICIAL external booking channel (venue site / SevenRooms / TableCheck / Chope enrolment). NOT TablePilot, NOT a fee loop.';
comment on column public.venues.publication_status is
  'Explicit publication gate: published = evidence-backed, may appear on indexed pages; review = internal only (noindex).';
comment on column public.venues.opening_hours is
  'Published only when sourced from the venue''s own domain; aggregator hours stay in venue_fact_sources as RECHECK.';

-- Existing venues that already pass the legacy display gate stay published
-- so the Canggu catalogue keeps working; sparse rows stay review.
update public.venues set publication_status = 'published'
where publication_status = 'review'
  and district <> 'uluwatu-bukit'
  and coalesce(btrim(why_its_here), '') <> ''
  and coalesce(btrim(best_for), '') <> ''
  and (coalesce(btrim(price_anchor), '') <> '' or coalesce(btrim(what_to_order), '') <> '');

-- ── 2. venue_fact_sources (internal provenance mirror) ─────────────────
create table if not exists public.venue_fact_sources (
  id          uuid primary key default gen_random_uuid(),
  venue_slug  text not null references public.venues(slug) on delete cascade,
  field_name  text not null,
  source_type text not null,
  source_url  text,
  verified_at date,
  status      text not null check (status in (
    'VERIFIED',
    'STALE — RECHECK REQUIRED',
    'CONFLICTING SOURCES',
    'MISSING',
    'CLOSED OR UNCERTAIN',
    'BOUNDARY REVIEW REQUIRED'
  )),
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (venue_slug, field_name)
);

alter table public.venue_fact_sources enable row level security;
-- No policies on purpose: default-deny for anon/authenticated. Internal
-- research notes never flow to the public app (brief §7).

-- ── 3. guide_leads + RPC ────────────────────────────────────────────────
create table if not exists public.guide_leads (
  id              uuid primary key default gen_random_uuid(),
  guide_slug      text not null default 'uluwatu-48-hours',
  first_name      text not null,
  channel         text not null check (channel in ('email', 'whatsapp')),
  email           text,
  whatsapp        text,
  travel_date     date,
  interests       text[],
  language        text,
  source          text,
  utm             jsonb,
  consent_granted boolean not null,
  consent_ts      timestamptz not null default now(),
  user_agent      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- One lead per contact per guide (duplicate submissions update, not multiply).
create unique index if not exists guide_leads_contact_key
  on public.guide_leads (guide_slug, coalesce(nullif(email, ''), whatsapp));

alter table public.guide_leads enable row level security;
-- Default-deny; writes go through the SECURITY DEFINER RPC below only.

create or replace function public.submit_guide_lead(
  p_first_name text,
  p_channel text,
  p_email text,
  p_whatsapp text,
  p_travel_date text default null,
  p_interests text[] default null,
  p_language text default null,
  p_source text default null,
  p_utm jsonb default null,
  p_consent boolean default false,
  p_user_agent text default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_first text := nullif(left(btrim(coalesce(p_first_name, '')), 80), '');
  v_email text := nullif(left(btrim(lower(coalesce(p_email, ''))), 200), '');
  v_wa    text := nullif(regexp_replace(coalesce(p_whatsapp, ''), '[^0-9]', '', 'g'), '');
  v_dup   boolean := false;
  v_travel date := null;
begin
  -- Consent is required and never preselected client-side (brief §18).
  if not coalesce(p_consent, false) then
    return jsonb_build_object('ok', false, 'error', 'consent_required');
  end if;
  if v_first is null then
    return jsonb_build_object('ok', false, 'error', 'name_required');
  end if;
  if p_channel not in ('email', 'whatsapp') then
    return jsonb_build_object('ok', false, 'error', 'bad_channel');
  end if;
  if p_channel = 'email' and (v_email is null or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    return jsonb_build_object('ok', false, 'error', 'bad_email');
  end if;
  if p_channel = 'whatsapp' and (v_wa is null or length(v_wa) < 7 or length(v_wa) > 16) then
    return jsonb_build_object('ok', false, 'error', 'bad_whatsapp');
  end if;

  begin
    v_travel := nullif(btrim(coalesce(p_travel_date, '')), '')::date;
  exception when others then
    v_travel := null; -- optional field: an unparsable date is dropped, not fatal
  end;

  v_dup := exists (
    select 1 from guide_leads
    where guide_slug = 'uluwatu-48-hours'
      and coalesce(nullif(email, ''), whatsapp) = coalesce(v_email, v_wa)
  );

  insert into guide_leads (
    guide_slug, first_name, channel, email, whatsapp, travel_date,
    interests, language, source, utm, consent_granted, user_agent
  ) values (
    'uluwatu-48-hours', v_first, p_channel,
    case when p_channel = 'email' then v_email else null end,
    case when p_channel = 'whatsapp' then v_wa else null end,
    v_travel,
    (select array(select distinct left(btrim(x), 40) from unnest(coalesce(p_interests, '{}')) x limit 8)),
    nullif(left(btrim(coalesce(p_language, '')), 12), ''),
    nullif(left(btrim(coalesce(p_source, '')), 80), ''),
    p_utm,
    true,
    nullif(left(coalesce(p_user_agent, ''), 400), '')
  )
  on conflict (guide_slug, coalesce(nullif(email, ''), whatsapp)) do update set
    first_name  = excluded.first_name,
    travel_date = coalesce(excluded.travel_date, guide_leads.travel_date),
    interests   = coalesce(excluded.interests, guide_leads.interests),
    language    = coalesce(excluded.language, guide_leads.language),
    updated_at  = now();

  return jsonb_build_object('ok', true, 'duplicate', v_dup);
end; $$;

revoke all on function public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text) from public;
grant execute on function public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text) to anon, authenticated;

-- ── 4. Verified Uluwatu backfill (web verification pass 2026-07-12; the
--       complete per-fact ledger with statuses lives in lib/uluwatu/venues.ts
--       and docs/uluwatu-evidence-ledger.md) ──────────────────────────────
with verified(slug, micro_area, official_url, instagram_url, booking_url, opening_hours, price_band, book_ahead, publication_status) as (
values
  ('single-fin', 'Suluban, Pecatu', 'https://www.singlefinbali.com/', 'https://www.instagram.com/singlefinbali/', 'https://www.sevenrooms.com/reservations/singlefinuluwatu', null, '$$', 'Mostly walk-in; reserve ahead for Wednesday and Sunday nights.', 'published'),
  ('mana-uluwatu', 'Suluban, Pecatu', 'https://uluwatusurfvillas.com/restaurant/', 'https://www.instagram.com/manauluwatu/', 'https://uluwatusurfvillas.com/restaurant/', null, '$$$', 'Book ahead for sunset-hour tables.', 'published'),
  ('sundays-beach-club', 'Ungasan', 'https://www.sundaysbeachclub.com/', 'https://www.instagram.com/sundaysbeachclub/', 'https://www.sundaysbeachclub.com/daily-beach-pass/', null, '$$$', 'Beach passes walk-in; cabanas and VIP pre-booked.', 'published'),
  ('white-rock-beach-club', 'Melasti, Ungasan', 'https://whiterockbali.com/', 'https://www.instagram.com/whiterockbeachclub/', 'https://bookings.whiterockbali.com/', null, null, 'Reserve daybeds and suites online.', 'published'),
  ('tropical-temptation-adult-only-beach-club', 'Melasti, Ungasan', 'https://ttbeach.club/', 'https://www.instagram.com/tropicaltemptation/', 'https://reserve.ttbeach.club/', 'Daily 10:00–21:00', '$$$', 'Book daybeds via the club''s reservation site. 18+ only.', 'published'),
  ('el-kabron-bali', 'Cemongkak, Pecatu', 'https://elkabron.com/', 'https://www.instagram.com/elkabronbali/', 'https://elkabron.com/book-now', null, '$$$', 'Reservation with deposit essential at sunset.', 'published'),
  ('oneeighty', 'Pecatu cliffs', 'https://oneeightybali.com/', 'https://www.instagram.com/oneeightybali/', null, null, null, 'Pre-book a day pass — capacity capped, deposits apply.', 'published'),
  ('the-warung-at-alila-villas-uluwatu', 'Pecatu cliffs', 'https://www.alilahotels.com/uluwatu/dining/the-warung/', null, 'https://www.tablecheck.com/en/alila-villas-uluwatu-the-warung/reserve', null, '$$$', 'Book via TableCheck; groups 8+ through the resort.', 'published'),
  ('gooseberry-french-restaurant-uluwatu', 'Bingin', 'https://www.gooseberry-restaurant.com/', 'https://www.instagram.com/gooseberry_restaurant/', null, null, '$$$', 'Book ahead for dinner; earlier slots suit families.', 'published'),
  ('yuki-uluwatu', 'Labuan Sait, Pecatu', 'https://www.yuki-bali.com/uluwatu', 'https://www.instagram.com/yukibali_/', 'https://www.yuki-bali.com/ulu-reservations', 'Daily from 11:00 until late', '$$$', 'Reserve online or via WhatsApp — weekends fill.', 'published'),
  ('zali-uluwatu', 'Suluban, Pecatu', 'https://www.zalirestaurant.com/', 'https://www.instagram.com/zali.inbali/', null, null, null, 'Contact the restaurant for reservations and groups.', 'published'),
  ('kala-uluwatu', 'Padang Padang', 'https://kalauluwatu.com/', 'https://www.instagram.com/kala.uluwatu/', 'https://www.sevenrooms.com/explore/kalauluwatu/reservations/create/search/', null, '$$$', 'Reserve via SevenRooms for dinner.', 'published'),
  ('papi-sapi', 'Labuan Sait, Pecatu', 'https://papisapi.com/', 'https://www.instagram.com/papisapi_/', 'https://papisapi.com/book-a-table/', 'Daily 16:00–23:30', '$$$', 'Book a table via the official site.', 'published'),
  ('masonry-restaurant', 'Labuan Sait, Pecatu', 'https://masonrybali.com/uluwatu', 'https://www.instagram.com/masonry.bali/', 'https://masonrybali.com/uluwatu/bookings', null, '$$$', 'Book online; 11+ guests via WhatsApp.', 'published'),
  ('ulu-fishmarket', 'Labuan Sait, Pecatu', 'https://ulufishmarket.com/', 'https://www.instagram.com/ulu.fishmarket/', 'https://www.chope.co/bali-restaurants/restaurant/ulu-fish-market-uluwatu', null, '$$', 'Walk-ins most nights; reserve for groups.', 'published'),
  ('ulu-garden', 'Padang Padang', 'https://ulutribe.com/ulu-garden/', 'https://www.instagram.com/ulu.garden/', 'https://www.dishcult.com/restaurant/ulugarden', null, '$$', 'Book online for event nights and Sundays.', 'published'),
  ('waatu', 'Ungasan clifftop', 'https://waatu.com/', 'https://www.instagram.com/waatu.bali/', 'https://waatubali.com/reservations/', null, '$$$', 'Book via the official reservations page.', 'published'),
  ('seed-bingin', 'Bingin', 'https://seedbingin.com/', 'https://www.instagram.com/seed.bingin/', 'https://www.chope.co/bali-restaurants/restaurant/seed-bingin-uluwatu', null, '$$', 'Reserve for dinner; breakfast is walk-in.', 'published'),
  ('laggas-uluwatu', 'Bingin', null, 'https://www.instagram.com/laggasbali/', null, null, '$$', 'Booking ahead helps at dinner; contact via Instagram.', 'published'),
  ('suka-espresso', 'Labuan Sait, Pecatu', 'https://www.bysuka.com/suka-uluwatu', 'https://www.instagram.com/sukaespresso/', null, null, '$$', 'Walk-in.', 'published'),
  ('artisan-uluwatu', 'Suluban, Pecatu', null, 'https://www.instagram.com/artisan.bali/', 'https://www.chope.co/bali-restaurants/restaurant/artisan-uluwatu', null, '$$', 'Dinner bookable online; daytime walk-in.', 'published'),
  ('bgs-uluwatu', 'Suluban, Pecatu', 'https://bgsbali.com/store/bgs-uluwatu/', 'https://www.instagram.com/bgsbali/', null, null, '$', 'Walk-in.', 'published'),
  ('son-of-a-baker', 'Labuan Sait, Pecatu', null, 'https://www.instagram.com/sonofabaker.bali/', null, null, '$$', 'Walk-in. Check Instagram for current days/hours.', 'published'),
  ('alchemy-uluwatu', 'Bingin', 'https://www.alchemybali.com/uluwatu', 'https://www.instagram.com/alchemybali/', null, null, '$$', 'Walk-in.', 'published'),
  ('ulu-artisan-ungasan', 'Ungasan', null, 'https://www.instagram.com/artisan.bali/', null, null, '$$', null, 'review')
)
update public.venues as v set
  area               = verified.micro_area,
  official_url       = verified.official_url,
  instagram_url      = verified.instagram_url,
  booking_url        = verified.booking_url,
  opening_hours      = verified.opening_hours,
  price_band         = verified.price_band,
  book_ahead         = verified.book_ahead,
  publication_status = verified.publication_status,
  last_verified_at   = date '2026-07-12'
from verified
where v.slug = verified.slug and v.district = 'uluwatu-bukit';

-- Provenance mirror for the machine-readable facts above. One current row
-- per (venue, field); the narrative ledger with every status lives in code.
with facts(venue_slug, field_name, source_type, source_url, status, note) as (
values
  ('single-fin', 'operating_status', 'web_search_verification', 'https://www.singlefinbali.com/event/', 'VERIFIED', 'Official site live with events; RA lists upcoming dates.'),
  ('single-fin', 'official_url', 'official_website', 'https://www.singlefinbali.com/', 'VERIFIED', null),
  ('single-fin', 'booking_url', 'reservation_platform', 'https://www.sevenrooms.com/reservations/singlefinuluwatu', 'VERIFIED', null),
  ('single-fin', 'opening_hours', 'third_party_guide', null, 'CONFLICTING SOURCES', 'Closing time conflicts across guides; off-page.'),
  ('mana-uluwatu', 'operating_status', 'web_search_verification', 'https://airial.travel/restaurants/indonesia/pecatu/mana-uluwatu-restaurant-bar-l08jA63r', 'VERIFIED', null),
  ('mana-uluwatu', 'official_url', 'official_website', 'https://uluwatusurfvillas.com/restaurant/', 'VERIFIED', 'Official page on parent resort site.'),
  ('sundays-beach-club', 'operating_status', 'web_search_verification', 'https://www.sundaysbeachclub.com/daily-beach-pass/', 'VERIFIED', null),
  ('sundays-beach-club', 'booking_url', 'official_booking_page', 'https://www.sundaysbeachclub.com/daily-beach-pass/', 'VERIFIED', null),
  ('white-rock-beach-club', 'operating_status', 'web_search_verification', 'https://bookings.whiterockbali.com/', 'VERIFIED', null),
  ('white-rock-beach-club', 'booking_url', 'official_booking_page', 'https://bookings.whiterockbali.com/', 'VERIFIED', 'Own booking subdomain.'),
  ('tropical-temptation-adult-only-beach-club', 'opening_hours', 'official_website', 'https://ttbeach.club/faq', 'VERIFIED', '10:00–21:00 from official FAQ.'),
  ('tropical-temptation-adult-only-beach-club', 'adults_only', 'official_website', 'https://ttbeach.club/blog/tropical-temptation-beach-club-balis-adult-only-escape-with-direct-melasti-beach-access/', 'VERIFIED', '18+ policy on the venue''s own blog.'),
  ('el-kabron-bali', 'booking_url', 'official_booking_page', 'https://elkabron.com/book-now', 'VERIFIED', null),
  ('oneeighty', 'booking_url', 'official_website', null, 'MISSING', 'No official booking URL confirmed; CTA limited to official site.'),
  ('oneeighty', 'adults_only', 'third_party_guide', 'https://cocodevelopmentgroup.com/blog/one-eighty-day-club-bali-is-it-worth-the-hype-a-review/', 'VERIFIED', 'NOT adults-only; under-12 restriction on VIP deck only.'),
  ('the-warung-at-alila-villas-uluwatu', 'booking_url', 'official_booking_page', 'https://www.tablecheck.com/en/alila-villas-uluwatu-the-warung/reserve', 'VERIFIED', null),
  ('gooseberry-french-restaurant-uluwatu', 'micro_area', 'official_website', 'https://www.gooseberry-restaurant.com/', 'VERIFIED', 'Official site: Bingin Beach Restaurant.'),
  ('gooseberry-french-restaurant-uluwatu', 'booking_url', 'reservation_platform', null, 'CONFLICTING SOURCES', 'Dish Cult vs Chope; neither confirmed venue-endorsed.'),
  ('yuki-uluwatu', 'opening_hours', 'official_website', 'https://www.yuki-bali.com/uluwatu', 'VERIFIED', 'Open 11AM until late, 7 days.'),
  ('yuki-uluwatu', 'booking_url', 'official_booking_page', 'https://www.yuki-bali.com/ulu-reservations', 'VERIFIED', null),
  ('zali-uluwatu', 'booking_url', 'reservation_platform', null, 'CONFLICTING SOURCES', 'Chope listing unconfirmed as venue-endorsed.'),
  ('kala-uluwatu', 'booking_url', 'reservation_platform', 'https://www.sevenrooms.com/explore/kalauluwatu/reservations/create/search/', 'VERIFIED', null),
  ('papi-sapi', 'opening_hours', 'official_website', 'https://papisapi.com/contact/', 'VERIFIED', 'Everyday 16:00–23:30.'),
  ('papi-sapi', 'booking_url', 'official_booking_page', 'https://papisapi.com/book-a-table/', 'VERIFIED', null),
  ('masonry-restaurant', 'identity', 'official_website', 'https://masonrybali.com/uluwatu/about-us', 'VERIFIED', 'Real second location — NOT a duplicate of the Canggu row.'),
  ('masonry-restaurant', 'address', 'web_search_verification', null, 'CONFLICTING SOURCES', 'No.10 identical to Ulu Fishmarket listing; verify on field visit.'),
  ('ulu-fishmarket', 'booking_url', 'reservation_platform', 'https://www.chope.co/bali-restaurants/restaurant/ulu-fish-market-uluwatu', 'VERIFIED', 'Venue-enrolled Chope listing.'),
  ('ulu-garden', 'micro_area', 'web_search_verification', 'https://www.tripadvisor.com/Restaurant_Review-g1380108-d24000167-Reviews-Ulu_Garden-Pecatu_Bukit_Peninsula_Bali.html', 'VERIFIED', 'Jl. Pantai Padang-Padang, Pecatu.'),
  ('waatu', 'booking_url', 'official_booking_page', 'https://waatubali.com/reservations/', 'VERIFIED', 'SevenRooms-backed official reservations page.'),
  ('seed-bingin', 'micro_area', 'web_search_verification', 'https://thehoneycombers.com/bali/seed-restaurant-bingin/', 'VERIFIED', 'Two minutes from the Bingin Beach steps.'),
  ('laggas-uluwatu', 'official_url', 'official_website', null, 'MISSING', 'No first-party site; laggasuluwatu.shop matches SEO-clone patterns — rejected.'),
  ('suka-espresso', 'official_url', 'official_website', 'https://www.bysuka.com/suka-uluwatu', 'VERIFIED', 'Uluwatu page on the By/Suka group site.'),
  ('artisan-uluwatu', 'micro_area', 'web_search_verification', 'https://www.tripadvisor.com/Restaurant_Review-g1380108-d25358215-Reviews-Artisan_Uluwatu-Pecatu_Bukit_Peninsula_Bali.html', 'VERIFIED', 'Street number low-confidence; omitted from public page.'),
  ('bgs-uluwatu', 'official_url', 'official_website', 'https://bgsbali.com/store/bgs-uluwatu/', 'VERIFIED', null),
  ('son-of-a-baker', 'official_url', 'official_website', null, 'MISSING', 'No official website; Instagram is the primary channel.'),
  ('son-of-a-baker', 'opening_hours', 'third_party_guide', null, 'CONFLICTING SOURCES', 'Tue–Sun from 06:00, Monday closed; Sunday close conflicts.'),
  ('alchemy-uluwatu', 'micro_area', 'web_search_verification', 'https://wanderlog.com/place/details/5063450/alchemy-uluwatu', 'VERIFIED', 'Jl. Pantai Bingin No.8, Pecatu.'),
  ('ulu-artisan-ungasan', 'identity', 'web_search_verification', 'https://www.chope.co/bali-restaurants/restaurant/ulu-artisan-ungasan-uluwatu', 'CONFLICTING SOURCES', 'Brand naming conflicts across platforms — HELD IN REVIEW.')
)
insert into public.venue_fact_sources (venue_slug, field_name, source_type, source_url, verified_at, status, note)
select f.venue_slug, f.field_name, f.source_type, f.source_url, date '2026-07-12', f.status, f.note
from facts f
where exists (select 1 from public.venues v where v.slug = f.venue_slug)
on conflict (venue_slug, field_name) do update set
  source_type = excluded.source_type,
  source_url  = excluded.source_url,
  verified_at = excluded.verified_at,
  status      = excluded.status,
  note        = excluded.note,
  updated_at  = now();
