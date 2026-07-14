-- Bound durable writes reachable through a valid venue onboarding token.
-- Listing consent remains immutable evidence; menu and action proposals remain
-- review-only drafts. Private submission ledgers provide atomic idempotency,
-- fixed pending/rate ceilings and a finite venue-wide lifetime budget.

begin;

do $dependencies$
begin
  if to_regclass('public.venue_onboard_tokens') is null
    or to_regclass('public.venue_confirmations') is null
    or to_regclass('public.menus') is null
    or to_regclass('public.venue_action_capabilities') is null
    or to_regprocedure('public.is_publishable_evidence_url(text)') is null
    or to_regprocedure('extensions.digest(text,text)') is null
    or to_regclass('public.venue_onboard_tokens_one_per_venue_idx') is null then
    raise exception using
      errcode = '55000',
      message = '0040 requires secure onboarding, menu/action foundations and migration 0039';
  end if;
end
$dependencies$;

-- The legacy RPC could append the same listing agreement repeatedly. Consent
-- evidence must never be deleted or guessed at during a migration, so stop and
-- require an explicit operator reconciliation if production already contains
-- more than one agreed listing confirmation for a venue.
lock table public.venue_confirmations in share row exclusive mode;
do $listing_confirmation_preflight$
begin
  if exists (
    select 1
    from public.venue_confirmations confirmation
    where confirmation.agreed
    group by confirmation.venue_slug
    having count(*) > 1
  ) then
    raise exception using
      errcode = '23505',
      message = 'venue_confirmations contains duplicate agreed listing evidence; reconcile before 0040';
  end if;
end
$listing_confirmation_preflight$;

create unique index if not exists venue_confirmations_one_agreed_per_venue_idx
  on public.venue_confirmations(venue_slug)
  where agreed;

-- These ledgers are deliberately separate from publicly readable menu/action
-- rows. Only hashes of high-entropy tokens and normalized factual payloads are
-- retained. Resource links become null when an unverified rejected draft is
-- deleted, while the rate/lifetime ledger row remains durable. Verified
-- evidence remains protected by the 0032 immutability triggers.
create table if not exists public.partner_menu_submission_limits (
  submission_id uuid primary key default extensions.gen_random_uuid(),
  menu_id uuid unique references public.menus(id) on delete set null,
  venue_slug text not null references public.venues(slug) on delete cascade,
  token_hash bytea not null check (octet_length(token_hash) = 32),
  submission_key bytea not null check (octet_length(submission_key) = 32),
  created_at timestamptz not null default clock_timestamp()
);

create index if not exists partner_menu_submission_lookup_idx
  on public.partner_menu_submission_limits(
    venue_slug, submission_key, created_at desc
  );
create index if not exists partner_menu_submission_rate_idx
  on public.partner_menu_submission_limits(venue_slug, created_at desc);

create table if not exists public.partner_action_submission_limits (
  submission_id uuid primary key default extensions.gen_random_uuid(),
  capability_id uuid unique
    references public.venue_action_capabilities(id) on delete set null,
  venue_slug text not null references public.venues(slug) on delete cascade,
  token_hash bytea not null check (octet_length(token_hash) = 32),
  submission_key bytea not null check (octet_length(submission_key) = 32),
  created_at timestamptz not null default clock_timestamp()
);

create index if not exists partner_action_submission_lookup_idx
  on public.partner_action_submission_limits(
    venue_slug, submission_key, created_at desc
  );
create index if not exists partner_action_submission_rate_idx
  on public.partner_action_submission_limits(venue_slug, created_at desc);

-- Owner-note transitions have no durable parent row of their own, so this
-- append-only ledger retains every accepted transition independently. Token
-- rotation and returning A -> B -> A never reset the venue-wide budget.
create table if not exists public.partner_note_submission_limits (
  submission_id uuid primary key default extensions.gen_random_uuid(),
  venue_slug text not null,
  token_hash bytea not null check (octet_length(token_hash) = 32),
  note_hash bytea not null check (octet_length(note_hash) = 32),
  created_at timestamptz not null default clock_timestamp()
);

create index if not exists partner_note_submission_lookup_idx
  on public.partner_note_submission_limits(
    venue_slug, note_hash, created_at desc
  );
create index if not exists partner_note_submission_rate_idx
  on public.partner_note_submission_limits(venue_slug, created_at desc);

create or replace function public.prevent_partner_note_limit_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  raise exception using
    errcode = '55000',
    message = 'partner owner-note submission limits are append-only';
end;
$$;

drop trigger if exists partner_note_submission_limits_immutable
  on public.partner_note_submission_limits;
create trigger partner_note_submission_limits_immutable
before update or delete on public.partner_note_submission_limits
for each row execute function public.prevent_partner_note_limit_mutation();

alter table public.partner_menu_submission_limits enable row level security;
alter table public.partner_menu_submission_limits force row level security;
alter table public.partner_action_submission_limits enable row level security;
alter table public.partner_action_submission_limits force row level security;
alter table public.partner_note_submission_limits enable row level security;
alter table public.partner_note_submission_limits force row level security;

revoke all on table public.partner_menu_submission_limits
  from public, anon, authenticated, service_role;
revoke all on table public.partner_action_submission_limits
  from public, anon, authenticated, service_role;
revoke all on table public.partner_note_submission_limits
  from public, anon, authenticated, service_role;
revoke all on function public.prevent_partner_note_limit_mutation()
  from public, anon, authenticated, service_role;

-- Listing agreement is first-write-wins. A retry returns the same generic
-- success shape plus an informational deduplication flag; it can never replace
-- the original name, user agent or timestamp.
create or replace function public.confirm_onboarding(
  p_token text,
  p_name text,
  p_agreed boolean,
  p_user_agent text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select token_row.venue_slug into v_slug
  from public.venue_onboard_tokens token_row
  where token_row.token = p_token;

  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;
  if not coalesce(p_agreed, false)
    or length(btrim(coalesce(p_name, ''))) < 2 then
    return jsonb_build_object('ok', false, 'error', 'agreement_required');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('partner-onboard:' || v_slug, 0)
  );

  if exists (
    select 1
    from public.venue_confirmations confirmation
    where confirmation.venue_slug = v_slug
      and confirmation.agreed
  ) then
    return jsonb_build_object(
      'ok', true,
      'venue_slug', v_slug,
      'deduplicated', true
    );
  end if;

  insert into public.venue_confirmations(
    venue_slug, confirmed_by, agreed, user_agent
  ) values (
    v_slug,
    left(btrim(p_name), 120),
    true,
    left(coalesce(p_user_agent, ''), 300)
  );

  return jsonb_build_object(
    'ok', true,
    'venue_slug', v_slug,
    'deduplicated', false
  );
end;
$$;

-- Owner-authored free text is the only venue field this token RPC may mutate.
-- The current normalized value is checked before any counter, so an exact
-- retry is a true no-write even after credential rotation.
create or replace function public.set_venue_jtbd(
  p_token text,
  p_best_for text,
  p_not_for text,
  p_jobs text[],
  p_practical_tags text[],
  p_owner_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
  v_owner_note text := nullif(left(btrim(coalesce(p_owner_note, '')), 2000), '');
  v_current_owner_note text;
  v_token_hash bytea;
  v_note_hash bytea;
  v_total_count integer;
  v_recent_count integer;
  v_oldest_recent timestamptz;
  v_now timestamptz;
  v_retry_after integer;
  v_max_per_24_hours constant integer := 10;
  v_max_per_venue constant integer := 50;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select token_row.venue_slug into v_slug
  from public.venue_onboard_tokens token_row
  where token_row.token = p_token;
  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended('partner-onboard:' || v_slug, 0)
  );

  select venue.owner_note into v_current_owner_note
  from public.venues venue
  where venue.slug = v_slug
  for update;

  if v_current_owner_note is not distinct from v_owner_note then
    return jsonb_build_object('ok', true, 'deduplicated', true);
  end if;

  v_now := clock_timestamp();
  v_token_hash := extensions.digest(p_token, 'sha256');
  v_note_hash := extensions.digest(
    jsonb_build_object('ownerNote', v_owner_note)::text,
    'sha256'
  );

  select count(*)::integer into v_total_count
  from public.partner_note_submission_limits submission
  where submission.venue_slug = v_slug;
  if v_total_count >= v_max_per_venue then
    return jsonb_build_object('ok', false, 'error', 'submission_limit_reached');
  end if;

  select count(*)::integer, min(submission.created_at)
    into v_recent_count, v_oldest_recent
  from public.partner_note_submission_limits submission
  where submission.venue_slug = v_slug
    and submission.created_at > v_now - interval '24 hours';
  if v_recent_count >= v_max_per_24_hours then
    v_retry_after := greatest(
      1,
      ceil(extract(epoch from (
        v_oldest_recent + interval '24 hours' - v_now
      )))::integer
    );
    return jsonb_build_object(
      'ok', false,
      'error', 'rate_limited',
      'retry_after_seconds', v_retry_after
    );
  end if;

  update public.venues
  set owner_note = v_owner_note
  where slug = v_slug;

  insert into public.partner_note_submission_limits(
    venue_slug, token_hash, note_hash, created_at
  ) values (
    v_slug, v_token_hash, v_note_hash, v_now
  );

  return jsonb_build_object('ok', true, 'deduplicated', false);
end;
$$;

-- Retire the two-step menu draft API. Its retry path returned an existing menu
-- and then called a separate mutating item RPC, allowing unlimited rewrites
-- without advancing any durable budget.
drop function if exists public.create_partner_menu_draft(
  text,text,text,text,timestamptz,timestamptz
);

create or replace function public.create_partner_menu_draft(
  p_token text,
  p_title text,
  p_source_url text,
  p_source_label text,
  p_section_name text,
  p_item_name text,
  p_price_minor bigint,
  p_currency text,
  p_captured_at timestamptz,
  p_expires_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
  v_id uuid;
  v_version integer;
  v_title text := left(btrim(coalesce(p_title, '')), 160);
  v_source_url text := btrim(coalesce(p_source_url, ''));
  v_source_label text := left(btrim(coalesce(p_source_label, '')), 160);
  v_section_name text := left(btrim(coalesce(p_section_name, '')), 160);
  v_item_name text := left(btrim(coalesce(p_item_name, '')), 200);
  v_currency text := case
    when p_price_minor is null then null
    else btrim(coalesce(p_currency, ''))
  end;
  v_section_id uuid;
  v_token_hash bytea;
  v_submission_key bytea;
  v_total_count integer;
  v_recent_count integer;
  v_pending_count integer;
  v_oldest_recent timestamptz;
  v_now timestamptz;
  v_retry_after integer;
  v_max_pending constant integer := 5;
  v_max_per_24_hours constant integer := 10;
  v_max_per_venue constant integer := 50;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select token_row.venue_slug into v_slug
  from public.venue_onboard_tokens token_row
  where token_row.token = p_token;

  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;
  if v_source_url = ''
    or not public.is_publishable_evidence_url(v_source_url)
    or p_captured_at is null
    or v_title = ''
    or v_source_label = ''
    or v_section_name = ''
    or v_item_name = ''
    or (p_price_minor is not null and (
      p_price_minor < 0 or v_currency !~ '^[A-Z]{3}$'
    ))
    or (p_price_minor is null and p_currency is not null)
    or (p_expires_at is not null and p_expires_at <= p_captured_at) then
    return jsonb_build_object('ok', false, 'error', 'invalid_evidence');
  end if;

  -- The same venue-wide lock is shared with confirmation and action drafts;
  -- varying provider/kind cannot bypass any counter concurrently.
  perform pg_advisory_xact_lock(
    hashtextextended('partner-onboard:' || v_slug, 0)
  );
  v_now := clock_timestamp();
  v_token_hash := extensions.digest(p_token, 'sha256');
  v_submission_key := extensions.digest(
    jsonb_build_object(
      'currency', v_currency,
      'itemName', v_item_name,
      'priceMinor', p_price_minor,
      'sectionName', v_section_name,
      'sourceLabel', v_source_label,
      'sourceUrl', v_source_url,
      'title', v_title
    )::text,
    'sha256'
  );

  select menu.id, menu.version
    into v_id, v_version
  from public.partner_menu_submission_limits submission
  join public.menus menu on menu.id = submission.menu_id
  where submission.venue_slug = v_slug
    and submission.submission_key = v_submission_key
    and menu.status in ('draft', 'review')
  order by submission.created_at desc, submission.submission_id
  limit 1;

  if v_id is not null then
    return jsonb_build_object(
      'ok', true,
      'menu_id', v_id,
      'version', v_version,
      'deduplicated', true
    );
  end if;

  select count(*)::integer into v_total_count
  from public.partner_menu_submission_limits submission
  where submission.venue_slug = v_slug;
  if v_total_count >= v_max_per_venue then
    return jsonb_build_object('ok', false, 'error', 'submission_limit_reached');
  end if;

  select count(*)::integer, min(submission.created_at)
    into v_recent_count, v_oldest_recent
  from public.partner_menu_submission_limits submission
  where submission.venue_slug = v_slug
    and submission.created_at > v_now - interval '24 hours';
  if v_recent_count >= v_max_per_24_hours then
    v_retry_after := greatest(
      1,
      ceil(extract(epoch from (
        v_oldest_recent + interval '24 hours' - v_now
      )))::integer
    );
    return jsonb_build_object(
      'ok', false,
      'error', 'rate_limited',
      'retry_after_seconds', v_retry_after
    );
  end if;

  select count(*)::integer into v_pending_count
  from public.menus menu
  where menu.venue_slug = v_slug
    and menu.status in ('draft', 'review');
  if v_pending_count >= v_max_pending then
    return jsonb_build_object('ok', false, 'error', 'pending_limit_reached');
  end if;

  select coalesce(max(menu.version), 0) + 1 into v_version
  from public.menus menu
  where menu.venue_slug = v_slug;

  insert into public.menus(
    venue_slug, title, version, status, completeness, source_url, source_label,
    captured_at, expires_at
  ) values (
    v_slug,
    v_title,
    v_version,
    'draft',
    'partial',
    v_source_url,
    v_source_label,
    p_captured_at,
    coalesce(p_expires_at, p_captured_at + interval '60 days')
  )
  returning id into v_id;

  insert into public.menu_sections(menu_id, name, position)
  values (v_id, v_section_name, 0)
  returning id into v_section_id;

  insert into public.menu_items(
    menu_id, section_id, name, price_minor, currency, position
  ) values (
    v_id, v_section_id, v_item_name, p_price_minor, v_currency, 0
  );

  insert into public.partner_menu_submission_limits(
    menu_id, venue_slug, token_hash, submission_key, created_at
  ) values (
    v_id, v_slug, v_token_hash, v_submission_key, v_now
  );

  return jsonb_build_object(
    'ok', true,
    'menu_id', v_id,
    'version', v_version,
    'deduplicated', false
  );
end;
$$;

create or replace function public.create_partner_action_draft(
  p_token text,
  p_kind text,
  p_provider text,
  p_url text,
  p_label text,
  p_priority integer,
  p_confirmation_required boolean,
  p_source_url text,
  p_source_label text,
  p_captured_at timestamptz,
  p_expires_at timestamptz default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_slug text;
  v_id uuid;
  v_provider text := lower(btrim(coalesce(p_provider, '')));
  v_url text := btrim(coalesce(p_url, ''));
  v_label text := nullif(left(btrim(coalesce(p_label, '')), 160), '');
  v_priority integer := greatest(coalesce(p_priority, 100), 0);
  v_confirmation_required boolean;
  v_source_url text := btrim(coalesce(p_source_url, ''));
  v_source_label text := left(btrim(coalesce(p_source_label, '')), 160);
  v_version integer;
  v_live_id uuid;
  v_token_hash bytea;
  v_submission_key bytea;
  v_total_count integer;
  v_recent_count integer;
  v_pending_count integer;
  v_oldest_recent timestamptz;
  v_now timestamptz;
  v_retry_after integer;
  v_max_pending constant integer := 5;
  v_max_per_24_hours constant integer := 10;
  v_max_per_venue constant integer := 50;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select token_row.venue_slug into v_slug
  from public.venue_onboard_tokens token_row
  where token_row.token = p_token;

  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;
  if p_kind is null
    or p_kind not in ('reserve','delivery','takeaway','preorder','website','whatsapp')
    or length(v_provider) not between 1 and 80
    or v_url !~ '^https://[^[:space:]]+$'
    or v_source_url !~ '^https://[^[:space:]]+$'
    or v_source_label = ''
    or p_captured_at is null
    or (p_expires_at is not null and p_expires_at <= p_captured_at) then
    return jsonb_build_object('ok', false, 'error', 'invalid_input');
  end if;

  v_confirmation_required := case
    when p_kind = 'preorder' then true
    else coalesce(p_confirmation_required, true)
  end;

  perform pg_advisory_xact_lock(
    hashtextextended('partner-onboard:' || v_slug, 0)
  );
  v_now := clock_timestamp();
  v_token_hash := extensions.digest(p_token, 'sha256');
  v_submission_key := extensions.digest(
    jsonb_build_object(
      'confirmationRequired', v_confirmation_required,
      'kind', p_kind,
      'label', v_label,
      'priority', v_priority,
      'provider', v_provider,
      'sourceLabel', v_source_label,
      'sourceUrl', v_source_url,
      'url', v_url
    )::text,
    'sha256'
  );

  select capability.id, capability.version, capability.replaces_capability_id
    into v_id, v_version, v_live_id
  from public.partner_action_submission_limits submission
  join public.venue_action_capabilities capability
    on capability.id = submission.capability_id
  where submission.venue_slug = v_slug
    and submission.submission_key = v_submission_key
    and capability.status in ('draft', 'review')
  order by submission.created_at desc, submission.submission_id
  limit 1;

  if v_id is not null then
    return jsonb_build_object(
      'ok', true,
      'capability_id', v_id,
      'version', v_version,
      'replaces_capability_id', v_live_id,
      'deduplicated', true
    );
  end if;

  select count(*)::integer into v_total_count
  from public.partner_action_submission_limits submission
  where submission.venue_slug = v_slug;
  if v_total_count >= v_max_per_venue then
    return jsonb_build_object('ok', false, 'error', 'submission_limit_reached');
  end if;

  select count(*)::integer, min(submission.created_at)
    into v_recent_count, v_oldest_recent
  from public.partner_action_submission_limits submission
  where submission.venue_slug = v_slug
    and submission.created_at > v_now - interval '24 hours';
  if v_recent_count >= v_max_per_24_hours then
    v_retry_after := greatest(
      1,
      ceil(extract(epoch from (
        v_oldest_recent + interval '24 hours' - v_now
      )))::integer
    );
    return jsonb_build_object(
      'ok', false,
      'error', 'rate_limited',
      'retry_after_seconds', v_retry_after
    );
  end if;

  select count(*)::integer into v_pending_count
  from public.venue_action_capabilities capability
  where capability.venue_slug = v_slug
    and capability.status in ('draft', 'review');
  if v_pending_count >= v_max_pending then
    return jsonb_build_object('ok', false, 'error', 'pending_limit_reached');
  end if;

  select capability.id into v_live_id
  from public.venue_action_capabilities capability
  where capability.venue_slug = v_slug
    and capability.kind = p_kind
    and capability.provider = v_provider
    and capability.status = 'confirmed'
  order by capability.version desc
  limit 1;

  select coalesce(max(capability.version), 0) + 1 into v_version
  from public.venue_action_capabilities capability
  where capability.venue_slug = v_slug
    and capability.kind = p_kind
    and capability.provider = v_provider;

  insert into public.venue_action_capabilities(
    venue_slug, kind, provider, version, replaces_capability_id, url, label,
    status, priority, confirmation_required, source_url, source_label,
    captured_at, expires_at
  ) values (
    v_slug,
    p_kind,
    v_provider,
    v_version,
    v_live_id,
    v_url,
    v_label,
    'draft',
    v_priority,
    v_confirmation_required,
    v_source_url,
    v_source_label,
    p_captured_at,
    coalesce(p_expires_at, p_captured_at + interval '30 days')
  )
  returning id into v_id;

  insert into public.partner_action_submission_limits(
    capability_id, venue_slug, token_hash, submission_key, created_at
  ) values (
    v_id, v_slug, v_token_hash, v_submission_key, v_now
  );

  return jsonb_build_object(
    'ok', true,
    'capability_id', v_id,
    'version', v_version,
    'replaces_capability_id', v_live_id,
    'deduplicated', false
  );
end;
$$;

-- Extend the release probe through the token-amplification boundary. This
-- remains a read-only, service-only check and returns no tenant data.
create or replace function public.release_readiness_v1()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  v_ok boolean;
begin
  if auth.role() is distinct from 'service_role' then
    raise exception using errcode = '42501', message = 'server role required';
  end if;

  select
    to_regclass('public.venues') is not null
    and to_regclass('public.venue_photos') is not null
    and to_regclass('public.guest_refs') is not null
    and to_regclass('public.consent_log') is not null
    and to_regclass('public.events') is not null
    and to_regclass('public.attribution_sources') is not null
    and to_regclass('public.redemption_events') is not null
    and to_regclass('public.saved_places') is not null
    and to_regclass('public.shared_lists') is not null
    and to_regclass('public.route_stops') is not null
    and to_regclass('public.guide_leads') is not null
    and to_regclass('public.guest_ref_tombstones') is not null
    and to_regclass('public.partner_menu_submission_limits') is not null
    and to_regclass('public.partner_action_submission_limits') is not null
    and to_regclass('public.partner_note_submission_limits') is not null
    and to_regprocedure('public.venue_model_backfill_review()') is not null
    and to_regprocedure('public.record_guest_consent(text,text,text,text)') is not null
    and to_regprocedure('public.export_guest_data(text)') is not null
    and to_regprocedure('public.delete_guest_data(text)') is not null
    and to_regprocedure('public.log_event_v3(text,text,text,text,jsonb)') is not null
    and to_regprocedure('public.record_redemption(text,text,boolean,text)') is not null
    and to_regprocedure(
      'public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text)'
    ) is not null
    and to_regprocedure('public.set_saved_place(text,text,boolean)') is not null
    and to_regprocedure('public.create_shared_list(text,text[])') is not null
    and to_regprocedure('public.capture_source_scan(text,text)') is not null
    and to_regprocedure('public.log_dish_feedback(text,text,text,text)') is not null
    and to_regprocedure('public.saved_places_for(text)') is not null
    and to_regprocedure('public.shared_list_slugs(text)') is not null
    and to_regprocedure('public.confirm_onboarding(text,text,boolean,text)') is not null
    and to_regprocedure(
      'public.set_venue_jtbd(text,text,text,text[],text[],text)'
    ) is not null
    and to_regprocedure('public.prevent_partner_note_limit_mutation()') is not null
    and to_regprocedure(
      'public.create_partner_menu_draft(text,text,text,text,text,text,bigint,text,timestamptz,timestamptz)'
    ) is not null
    and to_regprocedure(
      'public.create_partner_menu_draft(text,text,text,text,timestamptz,timestamptz)'
    ) is null
    and to_regprocedure(
      'public.create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz)'
    ) is not null
    and to_regprocedure('extensions.digest(text,text)') is not null
    and exists (
      select 1
      from pg_constraint constraint_row
      where constraint_row.conrelid = to_regclass('public.route_stops')
        and constraint_row.conname = 'route_stops_route_rank_key'
        and constraint_row.contype = 'u'
        and constraint_row.convalidated
    )
    and exists (
      select 1
      from pg_attribute attribute
      where attribute.attrelid = to_regclass('public.shared_lists')
        and attribute.attname = 'guest_ref_id'
        and attribute.attnotnull
        and not attribute.attisdropped
    )
    and exists (
      select 1
      from pg_constraint constraint_row
      where constraint_row.conrelid = to_regclass('public.shared_lists')
        and constraint_row.confrelid = to_regclass('public.guest_refs')
        and constraint_row.contype = 'f'
        and constraint_row.confdeltype = 'c'
    )
    and (
      select count(*)
      from pg_class table_row
      where table_row.oid in (
        to_regclass('public.guest_ref_tombstones'),
        to_regclass('public.partner_menu_submission_limits'),
        to_regclass('public.partner_action_submission_limits'),
        to_regclass('public.partner_note_submission_limits')
      )
        and table_row.relrowsecurity
        and table_row.relforcerowsecurity
    ) = 4
    and (
      select count(*)
      from pg_constraint constraint_row
      where (
        constraint_row.conrelid,
        constraint_row.confrelid,
        constraint_row.confdeltype
      ) in (
        (
          to_regclass('public.partner_menu_submission_limits'),
          to_regclass('public.menus'),
          'n'
        ),
        (
          to_regclass('public.partner_action_submission_limits'),
          to_regclass('public.venue_action_capabilities'),
          'n'
        )
      )
    ) = 2
    and (
      select count(*)
      from pg_trigger trigger_row
      where not trigger_row.tgisinternal
        and trigger_row.tgenabled <> 'D'
        and (trigger_row.tgrelid, trigger_row.tgname) in (
          (to_regclass('public.guest_refs'), 'guest_refs_erasure_guard'),
          (to_regclass('public.consent_log'), 'consent_log_erasure_guard'),
          (to_regclass('public.redemption_events'), 'redemption_events_erasure_guard'),
          (to_regclass('public.events'), 'events_erasure_guard'),
          (to_regclass('public.saved_places'), 'saved_places_erasure_guard'),
          (to_regclass('public.shared_lists'), 'shared_lists_erasure_guard'),
          (
            to_regclass('public.partner_note_submission_limits'),
            'partner_note_submission_limits_immutable'
          )
        )
    ) = 7
    and (
      select count(*)
      from pg_index index_row
      where index_row.indexrelid in (
        to_regclass('public.events_one_dish_feedback_per_guest_venue_idx'),
        to_regclass('public.venue_confirmations_one_agreed_per_venue_idx'),
        to_regclass('public.partner_menu_submission_lookup_idx'),
        to_regclass('public.partner_menu_submission_rate_idx'),
        to_regclass('public.partner_action_submission_lookup_idx'),
        to_regclass('public.partner_action_submission_rate_idx'),
        to_regclass('public.partner_note_submission_lookup_idx'),
        to_regclass('public.partner_note_submission_rate_idx')
      )
        and index_row.indisvalid
        and index_row.indisready
    ) = 8
    and exists (
      select 1
      from pg_index index_row
      where index_row.indexrelid = to_regclass(
        'public.venue_confirmations_one_agreed_per_venue_idx'
      )
        and index_row.indisunique
    )
    into v_ok;

  return jsonb_build_object(
    'ok', coalesce(v_ok, false),
    'version', 1,
    'schemaRevision', '0040'
  );
end;
$$;

revoke all on function public.confirm_onboarding(text,text,boolean,text)
  from public, anon, authenticated, service_role;
grant execute on function public.confirm_onboarding(text,text,boolean,text)
  to service_role;

revoke all on function public.set_venue_jtbd(text,text,text,text[],text[],text)
  from public, anon, authenticated, service_role;
grant execute on function public.set_venue_jtbd(text,text,text,text[],text[],text)
  to service_role;

revoke all on function public.create_partner_menu_draft(
  text,text,text,text,text,text,bigint,text,timestamptz,timestamptz
) from public, anon, authenticated, service_role;
grant execute on function public.create_partner_menu_draft(
  text,text,text,text,text,text,bigint,text,timestamptz,timestamptz
) to service_role;

-- No callable token-scoped follow-up may mutate a deduplicated menu. Operators
-- can review through their trusted data workflow; the public route is atomic.
revoke all on function public.upsert_partner_menu_item(
  text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer
) from public, anon, authenticated, service_role;

revoke all on function public.create_partner_action_draft(
  text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz
) from public, anon, authenticated, service_role;
grant execute on function public.create_partner_action_draft(
  text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz
) to service_role;

revoke all on function public.release_readiness_v1()
  from public, anon, authenticated, service_role;
grant execute on function public.release_readiness_v1()
  to service_role;

comment on table public.partner_menu_submission_limits is
  'Private durable hash-only idempotency and venue-budget ledger for token-authenticated menu drafts; draft deletion never resets counters.';
comment on table public.partner_action_submission_limits is
  'Private durable hash-only idempotency and venue-budget ledger for token-authenticated action drafts; draft deletion never resets counters.';
comment on table public.partner_note_submission_limits is
  'Private append-only venue-wide owner-note transition budget; token rotation and repeated values never reset retained counters.';
comment on function public.confirm_onboarding(text,text,boolean,text) is
  'Service-only token confirmation; serial, immutable and first-write-wins per venue.';
comment on function public.set_venue_jtbd(text,text,text,text[],text[],text) is
  'Service-only owner-note setter; exact normalized retries are no-write and changed values have fixed venue-wide 10 daily / 50 lifetime ceilings.';
comment on function public.create_partner_menu_draft(
  text,text,text,text,text,text,bigint,text,timestamptz,timestamptz
) is
  'Service-only atomic menu/section/item proposal; exact pending retries are no-write and venue-wide ceilings are 5 pending / 10 daily / 50 lifetime.';
comment on function public.create_partner_action_draft(
  text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz
) is
  'Service-only token action proposal with venue-wide serialization, pending idempotency and fixed venue-wide 5 pending / 10 daily / 50 lifetime ceilings across all kinds and providers.';
comment on function public.release_readiness_v1() is
  'Service-only read-only credential and schema readiness probe through migration 0040; returns no tenant data.';

commit;
