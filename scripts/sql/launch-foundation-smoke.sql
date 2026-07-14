\set ON_ERROR_STOP on

-- Transactional smoke test for migrations 0035-0040. Run only against a
-- disposable/staging database after the migrations. Every fixture is rolled
-- back, including the deliberately generated event rows.
begin;

do $assert_schema$
declare
  v_count integer;
  v_blocked boolean := false;
  v_venue_id text;
begin
  select count(*) into v_count
  from pg_constraint
  where conrelid = 'public.venues'::regclass
    and conname in (
      'venues_venue_type_check',
      'venues_coordinates_check',
      'venues_price_range_check',
      'venues_published_requires_verification_check'
    )
    and convalidated;
  if v_count <> 4 then
    raise exception 'normalized venue constraints are missing or unvalidated';
  end if;

  if has_table_privilege('anon', 'public.venue_photos', 'select')
    or has_table_privilege('authenticated', 'public.venue_photos', 'select') then
    raise exception 'venue_photos must remain private';
  end if;
  if has_table_privilege('anon', 'public.guest_ref_tombstones', 'select')
    or has_table_privilege('authenticated', 'public.guest_ref_tombstones', 'select') then
    raise exception 'guest_ref_tombstones must remain private';
  end if;
  if (
    select namespace.nspname
    from pg_extension extension
    join pg_namespace namespace on namespace.oid = extension.extnamespace
    where extension.extname = 'pgcrypto'
  ) is distinct from 'extensions' then
    raise exception 'pgcrypto is not normalized to the extensions schema';
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.route_stops'::regclass
      and conname = 'route_stops_route_rank_key'
      and contype = 'u'
      and convalidated
  ) then
    raise exception 'route-stop rank uniqueness is unavailable';
  end if;
  if not exists (
    select 1 from pg_attribute
    where attrelid = 'public.shared_lists'::regclass
      and attname = 'guest_ref_id'
      and attnotnull
      and not attisdropped
  ) or not exists (
    select 1 from pg_constraint
    where conrelid = 'public.shared_lists'::regclass
      and confrelid = 'public.guest_refs'::regclass
      and contype = 'f'
      and confdeltype = 'c'
  ) then
    raise exception 'shared-list ownership invariant is unavailable';
  end if;
  if has_function_privilege('anon', 'public.record_guest_consent(text,text,text,text)', 'execute')
    or not has_function_privilege('service_role', 'public.record_guest_consent(text,text,text,text)', 'execute') then
    raise exception 'privacy RPC grants do not match the service-only contract';
  end if;
  if has_function_privilege(
      'anon',
      'public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text)',
      'execute'
    )
    or has_function_privilege(
      'authenticated',
      'public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text)',
      'execute'
    )
    or not has_function_privilege(
      'service_role',
      'public.submit_guide_lead(text,text,text,text,text,text[],text,text,jsonb,boolean,text)',
      'execute'
    ) then
    raise exception 'guide-lead RPC grants do not match the service-only contract';
  end if;
  if has_function_privilege('anon', 'public.release_readiness_v1()', 'execute')
    or has_function_privilege('authenticated', 'public.release_readiness_v1()', 'execute')
    or not has_function_privilege('service_role', 'public.release_readiness_v1()', 'execute') then
    raise exception 'release readiness RPC grants do not match the service-only contract';
  end if;
  if has_function_privilege(
      'anon', 'public.confirm_onboarding(text,text,boolean,text)', 'execute'
    )
    or has_function_privilege(
      'authenticated', 'public.confirm_onboarding(text,text,boolean,text)', 'execute'
    )
    or not has_function_privilege(
      'service_role', 'public.confirm_onboarding(text,text,boolean,text)', 'execute'
    )
    or has_function_privilege(
      'anon', 'public.set_venue_jtbd(text,text,text,text[],text[],text)', 'execute'
    )
    or not has_function_privilege(
      'service_role', 'public.set_venue_jtbd(text,text,text,text[],text[],text)', 'execute'
    )
    or has_function_privilege(
      'anon',
      'public.create_partner_menu_draft(text,text,text,text,text,text,bigint,text,timestamptz,timestamptz)',
      'execute'
    )
    or not has_function_privilege(
      'service_role',
      'public.create_partner_menu_draft(text,text,text,text,text,text,bigint,text,timestamptz,timestamptz)',
      'execute'
    )
    or has_function_privilege(
      'anon',
      'public.create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz)',
      'execute'
    )
    or not has_function_privilege(
      'service_role',
      'public.create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz)',
      'execute'
    )
    or has_function_privilege(
      'service_role',
      'public.upsert_partner_menu_item(text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer)',
      'execute'
    ) then
    raise exception 'onboarding token RPC grants do not match the service-only contract';
  end if;
  if to_regprocedure(
    'public.create_partner_menu_draft(text,text,text,text,timestamptz,timestamptz)'
  ) is not null then
    raise exception 'legacy two-step menu draft overload remains installed';
  end if;
  if has_table_privilege('anon', 'public.partner_menu_submission_limits', 'select')
    or has_table_privilege('authenticated', 'public.partner_menu_submission_limits', 'select')
    or has_table_privilege('service_role', 'public.partner_menu_submission_limits', 'select')
    or has_table_privilege('anon', 'public.partner_action_submission_limits', 'select')
    or has_table_privilege('authenticated', 'public.partner_action_submission_limits', 'select')
    or has_table_privilege('service_role', 'public.partner_action_submission_limits', 'select')
    or has_table_privilege('anon', 'public.partner_note_submission_limits', 'select')
    or has_table_privilege('authenticated', 'public.partner_note_submission_limits', 'select')
    or has_table_privilege('service_role', 'public.partner_note_submission_limits', 'select') then
    raise exception 'partner submission limit ledgers must remain private';
  end if;
  if not exists (
    select 1
    from pg_index index_row
    where index_row.indexrelid =
      'public.venue_confirmations_one_agreed_per_venue_idx'::regclass
      and index_row.indisunique
      and index_row.indisvalid
      and index_row.indisready
  ) then
    raise exception 'one-confirmation-per-venue invariant is unavailable';
  end if;

  select id into v_venue_id from public.venues order by id limit 1;
  if v_venue_id is null then
    raise exception 'smoke database needs one venue for the primary-photo constraint';
  end if;
  insert into public.venue_photos(venue_id, source_url, is_primary)
  values (v_venue_id, 'https://example.invalid/one.jpg', true);
  begin
    insert into public.venue_photos(venue_id, source_url, is_primary)
    values (v_venue_id, 'https://example.invalid/two.jpg', true);
  exception when unique_violation then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'venue accepted more than one primary photo';
  end if;
end;
$assert_schema$;

select set_config('request.jwt.claim.role', 'anon', true);
do $assert_denied$
declare
  v_blocked boolean := false;
begin
  begin
    perform public.record_guest_consent(
      'essential_only', 'launch-smoke-v1', null, null
    );
  exception when insufficient_privilege then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'record_guest_consent accepted a non-service caller';
  end if;

  v_blocked := false;
  begin
    perform public.submit_guide_lead(
      'Launch smoke', 'email', 'launch-smoke-guide@example.invalid', null,
      null, array['food'], 'en', 'web', null, true, 'smoke-agent'
    );
  exception when insufficient_privilege then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'submit_guide_lead accepted a non-service caller';
  end if;

  v_blocked := false;
  begin
    perform public.release_readiness_v1();
  exception when insufficient_privilege then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'release_readiness_v1 accepted a non-service caller';
  end if;
end;
$assert_denied$;

select set_config('request.jwt.claim.role', 'service_role', true);
do $assert_release_readiness$
declare
  v_result jsonb;
begin
  v_result := public.release_readiness_v1();
  if v_result->>'ok' <> 'true'
    or v_result->>'schemaRevision' <> '0040' then
    raise exception 'release readiness probe failed: %', v_result;
  end if;
end;
$assert_release_readiness$;

do $assert_onboarding_token_limits$
declare
  v_slug text;
  v_token text;
  v_result jsonb;
  v_retry jsonb;
  v_menu_id uuid;
  v_retry_menu_id uuid;
  v_capability_id uuid;
  v_retry_capability_id uuid;
  v_deleted_menu_id uuid;
  v_deleted_capability_id uuid;
  v_item_ctid text;
  v_venue_ctid text;
  v_now timestamptz := clock_timestamp();
  v_token_hash bytea;
  v_version integer;
  v_index integer;
  v_count integer;
  v_blocked boolean := false;
begin
  select venue.slug into v_slug
  from public.venues venue
  where venue.owner_note is distinct from 'Smoke owner note A'
    and not exists (
      select 1
      from public.venue_confirmations confirmation
      where confirmation.venue_slug = venue.slug
        and confirmation.agreed
    )
    and not exists (
      select 1
      from public.menus menu
      where menu.venue_slug = venue.slug
        and menu.status in ('draft', 'review')
    )
    and not exists (
      select 1
      from public.venue_action_capabilities capability
      where capability.venue_slug = venue.slug
        and capability.status in ('draft', 'review')
    )
  order by venue.slug
  limit 1;
  if v_slug is null then
    raise exception 'smoke database needs one venue without pending onboarding evidence';
  end if;

  v_token := public.get_or_create_onboard_token(v_slug);
  if v_token is null then
    raise exception 'onboarding token fixture was not available';
  end if;
  v_token_hash := extensions.digest(v_token, 'sha256');

  v_result := public.confirm_onboarding(
    v_token, 'First confirmer', true, 'smoke-agent-first'
  );
  v_retry := public.confirm_onboarding(
    v_token, 'Second confirmer', true, 'smoke-agent-second'
  );
  select count(*) into v_count
  from public.venue_confirmations confirmation
  where confirmation.venue_slug = v_slug
    and confirmation.agreed;
  if v_result->>'ok' <> 'true'
    or v_result->>'deduplicated' <> 'false'
    or v_retry->>'ok' <> 'true'
    or v_retry->>'deduplicated' <> 'true'
    or v_count <> 1
    or (select confirmed_by from public.venue_confirmations
        where venue_slug = v_slug and agreed) <> 'First confirmer' then
    raise exception 'listing confirmation was not immutable/idempotent: %, %, %',
      v_result, v_retry, v_count;
  end if;
  begin
    insert into public.venue_confirmations(
      venue_slug, confirmed_by, agreed, user_agent
    ) values (v_slug, 'Direct duplicate', true, 'smoke-agent');
  exception when unique_violation then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'direct write bypassed one listing confirmation per venue';
  end if;

  v_result := public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[],
    '  Smoke owner note A  '
  );
  select venue.ctid::text into v_venue_ctid
  from public.venues venue where venue.slug = v_slug;
  v_retry := public.set_venue_jtbd(
    v_token, 'ignored', 'ignored', array['ignored'], array['ignored'],
    'Smoke owner note A'
  );
  select count(*) into v_count
  from public.partner_note_submission_limits
  where venue_slug = v_slug;
  if v_result->>'ok' <> 'true'
    or v_result->>'deduplicated' <> 'false'
    or v_retry->>'deduplicated' <> 'true'
    or v_count <> 1
    or (select owner_note from public.venues where slug = v_slug)
      is distinct from 'Smoke owner note A'
    or (select ctid::text from public.venues where slug = v_slug)
      is distinct from v_venue_ctid then
    raise exception 'normalized owner-note retry was not no-write: %, %, %',
      v_result, v_retry, v_count;
  end if;

  perform public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[], 'Smoke owner note B'
  );
  perform public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[], 'Smoke owner note A'
  );
  select count(*) into v_count
  from public.partner_note_submission_limits
  where venue_slug = v_slug
    and note_hash = extensions.digest(
      jsonb_build_object('ownerNote', 'Smoke owner note A')::text,
      'sha256'
    );
  if v_count <> 2 then
    raise exception 'A -> B -> A did not consume both A transitions: %', v_count;
  end if;

  update public.venue_onboard_tokens
  set token = repeat('f', 64), created_at = clock_timestamp()
  where token = v_token;
  v_token := repeat('f', 64);
  select venue.ctid::text into v_venue_ctid
  from public.venues venue where venue.slug = v_slug;
  v_retry := public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[], 'Smoke owner note A'
  );
  select count(*) into v_count
  from public.partner_note_submission_limits where venue_slug = v_slug;
  if v_retry->>'deduplicated' <> 'true'
    or v_count <> 3
    or (select ctid::text from public.venues where slug = v_slug)
      is distinct from v_venue_ctid then
    raise exception 'token rotation bypassed owner-note idempotency: %, %',
      v_retry, v_count;
  end if;

  for v_index in 3..9 loop
    v_result := public.set_venue_jtbd(
      v_token, null, null, array[]::text[], array[]::text[],
      'Smoke owner note ' || v_index
    );
    if v_result->>'ok' <> 'true' then
      raise exception 'owner-note daily fixture % failed: %', v_index, v_result;
    end if;
  end loop;
  v_result := public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[],
    'Smoke owner note over daily'
  );
  if v_result->>'error' <> 'rate_limited'
    or coalesce((v_result->>'retry_after_seconds')::integer, 0) < 1 then
    raise exception 'rotated token bypassed owner-note daily limit: %', v_result;
  end if;

  for v_index in 1..40 loop
    insert into public.partner_note_submission_limits(
      venue_slug, token_hash, note_hash, created_at
    ) values (
      v_slug,
      extensions.digest(v_token, 'sha256'),
      extensions.digest(
        jsonb_build_object('ownerNote', 'Historical owner note ' || v_index)::text,
        'sha256'
      ),
      v_now - interval '2 days'
    );
  end loop;
  select venue.ctid::text into v_venue_ctid
  from public.venues venue where venue.slug = v_slug;
  v_retry := public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[], 'Smoke owner note 9'
  );
  v_result := public.set_venue_jtbd(
    v_token, null, null, array[]::text[], array[]::text[],
    'Smoke owner note over lifetime'
  );
  select count(*) into v_count
  from public.partner_note_submission_limits where venue_slug = v_slug;
  if v_retry->>'deduplicated' <> 'true'
    or v_result->>'error' <> 'submission_limit_reached'
    or v_count <> 50
    or (select ctid::text from public.venues where slug = v_slug)
      is distinct from v_venue_ctid then
    raise exception 'owner-note lifetime/no-write boundary failed: %, %, %',
      v_retry, v_result, v_count;
  end if;

  v_blocked := false;
  begin
    delete from public.partner_note_submission_limits
    where submission_id = (
      select submission_id
      from public.partner_note_submission_limits
      where venue_slug = v_slug
      order by created_at, submission_id
      limit 1
    );
  exception when sqlstate '55000' then
    v_blocked := true;
  end;
  select count(*) into v_count
  from public.partner_note_submission_limits where venue_slug = v_slug;
  if not v_blocked or v_count <> 50 then
    raise exception 'owner-note durable ledger was deletable/reset: %, %',
      v_blocked, v_count;
  end if;

  -- A pre-0040/operator draft has no ledger row but must still consume one of
  -- the five venue-wide pending slots.
  select coalesce(max(menu.version), 0) + 1 into v_version
  from public.menus menu where menu.venue_slug = v_slug;
  insert into public.menus(
    venue_slug, title, version, status, completeness, source_url, source_label,
    captured_at, expires_at
  ) values (
    v_slug, 'Unledgered pending menu', v_version, 'draft', 'partial',
    'https://otherbali.com/guard-smoke-menu-legacy', 'Legacy pending fixture',
    v_now, v_now + interval '60 days'
  );

  v_result := public.create_partner_menu_draft(
    v_token, 'Guard smoke menu 0',
    'https://otherbali.com/guard-smoke-menu-0', 'Venue-provided menu',
    'Smoke section', 'Smoke item', 125000, 'IDR',
    v_now, v_now + interval '60 days'
  );
  v_menu_id := nullif(v_result->>'menu_id', '')::uuid;
  select item.ctid::text into v_item_ctid
  from public.menu_items item
  where item.menu_id = v_menu_id;
  v_retry := public.create_partner_menu_draft(
    v_token, 'Guard smoke menu 0',
    'https://otherbali.com/guard-smoke-menu-0', 'Venue-provided menu',
    'Smoke section', 'Smoke item', 125000, 'IDR',
    v_now + interval '1 second', v_now + interval '60 days 1 second'
  );
  v_retry_menu_id := nullif(v_retry->>'menu_id', '')::uuid;
  select count(*) into v_count
  from public.menu_sections section
  join public.menu_items item
    on item.section_id = section.id and item.menu_id = section.menu_id
  where section.menu_id = v_menu_id;
  if v_menu_id is null
    or v_retry_menu_id is distinct from v_menu_id
    or v_retry->>'deduplicated' <> 'true'
    or v_count <> 1
    or not exists (
      select 1
      from public.menu_sections section
      join public.menu_items item
        on item.section_id = section.id and item.menu_id = section.menu_id
      where section.menu_id = v_menu_id
        and section.name = 'Smoke section'
        and item.name = 'Smoke item'
        and item.price_minor = 125000
        and item.currency = 'IDR'
        and item.ctid::text = v_item_ctid
    ) then
    raise exception 'atomic menu retry was not same-ID/no-write: %, %, %',
      v_result, v_retry, v_count;
  end if;

  for v_index in 1..3 loop
    v_result := public.create_partner_menu_draft(
      v_token, 'Guard smoke menu ' || v_index,
      'https://otherbali.com/guard-smoke-menu-' || v_index,
      'Venue-provided menu', 'Smoke section', 'Smoke item ' || v_index,
      null, null, v_now, v_now + interval '60 days'
    );
    if v_result->>'ok' <> 'true' then
      raise exception 'menu pending fixture % failed: %', v_index, v_result;
    end if;
  end loop;
  v_result := public.create_partner_menu_draft(
    v_token, 'Guard smoke menu 4',
    'https://otherbali.com/guard-smoke-menu-4', 'Venue-provided menu',
    'Smoke section', 'Smoke item 4', null, null,
    v_now, v_now + interval '60 days'
  );
  if v_result->>'error' <> 'pending_limit_reached' then
    raise exception 'unledgered menu did not consume a pending slot: %', v_result;
  end if;

  update public.menus
  set status = 'archived', updated_at = clock_timestamp()
  where venue_slug = v_slug and status in ('draft', 'review');
  for v_index in 4..9 loop
    v_result := public.create_partner_menu_draft(
      v_token, 'Guard smoke menu ' || v_index,
      'https://otherbali.com/guard-smoke-menu-' || v_index,
      'Venue-provided menu', 'Smoke section', 'Smoke item ' || v_index,
      null, null, v_now, v_now + interval '60 days'
    );
    if v_result->>'ok' <> 'true' then
      raise exception 'menu rate fixture % failed: %', v_index, v_result;
    end if;
    update public.menus
    set status = 'archived', updated_at = clock_timestamp()
    where id = nullif(v_result->>'menu_id', '')::uuid;
  end loop;
  v_result := public.create_partner_menu_draft(
    v_token, 'Guard smoke menu 10',
    'https://otherbali.com/guard-smoke-menu-10', 'Venue-provided menu',
    'Smoke section', 'Smoke item 10', null, null,
    v_now, v_now + interval '60 days'
  );
  if v_result->>'error' <> 'rate_limited'
    or coalesce((v_result->>'retry_after_seconds')::integer, 0) < 1 then
    raise exception 'venue-wide menu daily rate was bypassed: %', v_result;
  end if;

  -- Backdate the ten real RPC rows, then add forty historical technical rows
  -- to exercise the durable 50-per-venue boundary independently of the daily
  -- rate. All fixtures roll back with this smoke transaction.
  update public.partner_menu_submission_limits
  set created_at = v_now - interval '2 days'
  where venue_slug = v_slug;
  select coalesce(max(menu.version), 0) into v_version
  from public.menus menu where menu.venue_slug = v_slug;
  for v_index in 1..40 loop
    insert into public.menus(
      venue_slug, title, version, status, completeness, source_url, source_label,
      captured_at, expires_at
    ) values (
      v_slug, 'Guard lifetime menu ' || v_index, v_version + v_index,
      'archived', 'partial',
      'https://otherbali.com/guard-lifetime-menu-' || v_index,
      'Historical partner fixture', v_now - interval '3 days',
      v_now + interval '30 days'
    ) returning id into v_menu_id;
    insert into public.partner_menu_submission_limits(
      menu_id, venue_slug, token_hash, submission_key, created_at
    ) values (
      v_menu_id, v_slug, v_token_hash,
      extensions.digest('guard-menu-lifetime-' || v_index, 'sha256'),
      v_now - interval '2 days'
    );
  end loop;
  v_result := public.create_partner_menu_draft(
    v_token, 'Guard menu over lifetime',
    'https://otherbali.com/guard-menu-over-lifetime', 'Venue-provided menu',
    'Smoke section', 'Smoke over lifetime', null, null,
    v_now, v_now + interval '60 days'
  );
  if v_result->>'error' <> 'submission_limit_reached' then
    raise exception 'venue-wide menu lifetime limit was bypassed: %', v_result;
  end if;
  select menu.id into v_deleted_menu_id
  from public.menus menu
  where menu.venue_slug = v_slug
    and menu.title like 'Guard lifetime menu %'
  order by menu.title
  limit 1;
  delete from public.menus where id = v_deleted_menu_id;
  select count(*) into v_count
  from public.partner_menu_submission_limits where venue_slug = v_slug;
  if v_count <> 50 or not exists (
    select 1 from public.partner_menu_submission_limits
    where venue_slug = v_slug and menu_id is null
  ) then
    raise exception 'deleted menu reset its durable budget row: %', v_count;
  end if;

  -- Action pending/rate/lifetime counters are venue-wide across every kind and
  -- provider and include unledgered pre-0040 pending rows.
  insert into public.venue_action_capabilities(
    venue_slug, kind, provider, version, url, label, status, priority,
    confirmation_required, source_url, source_label, captured_at, expires_at
  ) values (
    v_slug, 'website', 'guard-legacy', 1,
    'https://otherbali.com/guard-action-legacy', null, 'draft', 100, true,
    'https://otherbali.com/guard-action-legacy', 'Legacy pending fixture',
    v_now, v_now + interval '30 days'
  );

  v_result := public.create_partner_action_draft(
    v_token, 'website', 'guard0',
    'https://otherbali.com/guard-action-0', null, 100, true,
    'https://otherbali.com/guard-action-0', 'Venue-provided official link',
    v_now, v_now + interval '30 days'
  );
  v_retry := public.create_partner_action_draft(
    v_token, 'website', 'guard0',
    'https://otherbali.com/guard-action-0', null, 100, true,
    'https://otherbali.com/guard-action-0', 'Venue-provided official link',
    v_now + interval '1 second', v_now + interval '30 days 1 second'
  );
  v_capability_id := nullif(v_result->>'capability_id', '')::uuid;
  v_retry_capability_id := nullif(v_retry->>'capability_id', '')::uuid;
  if v_capability_id is null
    or v_retry_capability_id is distinct from v_capability_id
    or v_retry->>'deduplicated' <> 'true' then
    raise exception 'identical pending action did not return the same ID: %, %',
      v_result, v_retry;
  end if;

  for v_index in 1..3 loop
    v_result := public.create_partner_action_draft(
      v_token, 'website', 'guard' || v_index,
      'https://otherbali.com/guard-action-' || v_index, null, 100, true,
      'https://otherbali.com/guard-action-' || v_index,
      'Venue-provided official link', v_now, v_now + interval '30 days'
    );
    if v_result->>'ok' <> 'true' then
      raise exception 'action pending fixture % failed: %', v_index, v_result;
    end if;
  end loop;
  v_result := public.create_partner_action_draft(
    v_token, 'delivery', 'guard4',
    'https://otherbali.com/guard-action-4', null, 100, true,
    'https://otherbali.com/guard-action-4', 'Venue-provided official link',
    v_now, v_now + interval '30 days'
  );
  if v_result->>'error' <> 'pending_limit_reached' then
    raise exception 'action kind/provider variation bypassed pending limit: %', v_result;
  end if;

  update public.venue_action_capabilities
  set status = 'archived', updated_at = clock_timestamp()
  where venue_slug = v_slug and status in ('draft', 'review');
  for v_index in 4..9 loop
    v_result := public.create_partner_action_draft(
      v_token,
      case when v_index % 2 = 0 then 'delivery' else 'website' end,
      'guard' || v_index,
      'https://otherbali.com/guard-action-' || v_index, null, 100, true,
      'https://otherbali.com/guard-action-' || v_index,
      'Venue-provided official link', v_now, v_now + interval '30 days'
    );
    if v_result->>'ok' <> 'true' then
      raise exception 'action rate fixture % failed: %', v_index, v_result;
    end if;
    update public.venue_action_capabilities
    set status = 'archived', updated_at = clock_timestamp()
    where id = nullif(v_result->>'capability_id', '')::uuid;
  end loop;
  v_result := public.create_partner_action_draft(
    v_token, 'whatsapp', 'guard10',
    'https://otherbali.com/guard-action-10', null, 100, true,
    'https://otherbali.com/guard-action-10', 'Venue-provided official link',
    v_now, v_now + interval '30 days'
  );
  if v_result->>'error' <> 'rate_limited'
    or coalesce((v_result->>'retry_after_seconds')::integer, 0) < 1 then
    raise exception 'venue-wide action daily rate was bypassed: %', v_result;
  end if;

  update public.partner_action_submission_limits
  set created_at = v_now - interval '2 days'
  where venue_slug = v_slug;
  for v_index in 1..40 loop
    insert into public.venue_action_capabilities(
      venue_slug, kind, provider, version, url, label, status, priority,
      confirmation_required, source_url, source_label, captured_at, expires_at
    ) values (
      v_slug, 'website', 'guard-total-' || v_index, 1,
      'https://otherbali.com/guard-lifetime-action-' || v_index, null,
      'archived', 100, true,
      'https://otherbali.com/guard-lifetime-action-' || v_index,
      'Historical partner fixture', v_now - interval '3 days',
      v_now + interval '30 days'
    ) returning id into v_capability_id;
    insert into public.partner_action_submission_limits(
      capability_id, venue_slug, token_hash, submission_key, created_at
    ) values (
      v_capability_id, v_slug, v_token_hash,
      extensions.digest('guard-action-lifetime-' || v_index, 'sha256'),
      v_now - interval '2 days'
    );
  end loop;
  v_result := public.create_partner_action_draft(
    v_token, 'website', 'guard-over-lifetime',
    'https://otherbali.com/guard-action-over-lifetime', null, 100, true,
    'https://otherbali.com/guard-action-over-lifetime',
    'Venue-provided official link', v_now, v_now + interval '30 days'
  );
  if v_result->>'error' <> 'submission_limit_reached' then
    raise exception 'venue-wide action lifetime limit was bypassed: %', v_result;
  end if;
  select capability.id into v_deleted_capability_id
  from public.venue_action_capabilities capability
  where capability.venue_slug = v_slug
    and capability.provider like 'guard-total-%'
  order by capability.provider
  limit 1;
  delete from public.venue_action_capabilities
  where id = v_deleted_capability_id;
  select count(*) into v_count
  from public.partner_action_submission_limits where venue_slug = v_slug;
  if v_count <> 50 or not exists (
    select 1 from public.partner_action_submission_limits
    where venue_slug = v_slug and capability_id is null
  ) then
    raise exception 'deleted action reset its durable budget row: %', v_count;
  end if;
end;
$assert_onboarding_token_limits$;

do $assert_guide_lead$
declare
  v_result jsonb;
  v_index integer;
  v_count integer;
begin
  for v_index in 1..5 loop
    v_result := public.submit_guide_lead(
      'Launch smoke', 'email', 'launch-smoke-guide@example.invalid', null,
      null, array['food'], 'en', 'web', null, true, 'smoke-agent'
    );
    if v_result->>'ok' <> 'true' then
      raise exception 'guide lead submission % failed: %', v_index, v_result;
    end if;
  end loop;

  select count(*) into v_count
  from public.guide_leads
  where guide_slug = 'uluwatu-48-hours'
    and email = 'launch-smoke-guide@example.invalid'
    and submission_window_count = 5;
  if v_count <> 1 then
    raise exception 'guide lead dedupe/window counter mismatch: %', v_count;
  end if;

  v_result := public.submit_guide_lead(
    'Launch smoke', 'email', 'launch-smoke-guide@example.invalid', null,
    null, array['food'], 'en', 'web', null, true, 'smoke-agent'
  );
  if v_result->>'error' <> 'rate_limited'
    or coalesce((v_result->>'retry_after_seconds')::integer, 0) < 1 then
    raise exception 'sixth guide lead was not rate limited: %', v_result;
  end if;
end;
$assert_guide_lead$;

do $assert_consent_transition_limit$
declare
  v_grant_guest_id uuid;
  v_withdraw_guest_id uuid;
  v_result jsonb;
  v_count integer;
  v_now timestamptz := clock_timestamp();
begin
  insert into public.guest_refs(ref)
  values ('g_consentlimita001')
  returning id into v_grant_guest_id;
  insert into public.guest_refs(ref)
  values ('g_consentlimitb001')
  returning id into v_withdraw_guest_id;

  insert into public.consent_log(
    guest_ref_id, consent_type, granted, terms_version, scope, ts
  )
  select
    v_grant_guest_id,
    'analytics',
    value % 2 = 1,
    'limit-fixture-' || value,
    'first_party_usage_analytics',
    v_now - interval '2 minutes' + value * interval '1 second'
  from generate_series(1, 20) value;
  v_result := public.record_guest_consent(
    'analytics_allowed', 'limit-next', 'g_consentlimita001', 'smoke-agent'
  );
  if v_result->>'error' <> 'rate_limited' then
    raise exception '21st consent grant transition was not blocked: %', v_result;
  end if;

  insert into public.consent_log(
    guest_ref_id, consent_type, granted, terms_version, scope, ts
  )
  select
    v_withdraw_guest_id,
    'analytics',
    value % 2 = 0,
    'limit-fixture-' || value,
    'first_party_usage_analytics',
    v_now - interval '2 minutes' + value * interval '1 second'
  from generate_series(1, 20) value;
  v_result := public.record_guest_consent(
    'essential_only', 'limit-next', 'g_consentlimitb001', 'smoke-agent'
  );
  if v_result->>'ok' <> 'true'
    or v_result->>'state' <> 'essential_only'
    or v_result->>'recorded' <> 'true'
    or v_result->>'limit_reached' <> 'true' then
    raise exception 'limited withdrawal was not durably recorded: %', v_result;
  end if;
  select count(*) into v_count
  from public.consent_log
  where guest_ref_id = v_withdraw_guest_id
    and consent_type = 'analytics'
    and ts > v_now - interval '24 hours';
  if v_count <> 21 then
    raise exception 'emergency withdrawal did not use exactly one extra row: %', v_count;
  end if;

  v_result := public.record_guest_consent(
    'analytics_allowed', 'limit-opt-in-after-withdrawal',
    'g_consentlimitb001', 'smoke-agent'
  );
  if v_result->>'error' <> 'rate_limited' then
    raise exception 'grant bypassed the cap after emergency withdrawal: %', v_result;
  end if;

  v_result := public.record_guest_consent(
    'essential_only', 'limit-withdrawal-version-2',
    'g_consentlimitb001', 'smoke-agent'
  );
  select count(*) into v_count
  from public.consent_log
  where guest_ref_id = v_withdraw_guest_id
    and consent_type = 'analytics'
    and ts > v_now - interval '24 hours';
  if v_result->>'recorded' <> 'false' or v_count <> 21 then
    raise exception 'repeated limited withdrawal appended another row: %, %',
      v_result, v_count;
  end if;
end;
$assert_consent_transition_limit$;

do $assert_privacy_and_events$
declare
  v_result jsonb;
  v_guest_id uuid;
  v_index integer;
  v_count integer;
  v_shared_slug text;
  v_list_id text;
  v_blocked boolean := false;
begin
  select count(*) into v_count from public.guest_refs;
  v_result := public.record_guest_consent(
    'essential_only', 'launch-smoke-v1', null, null
  );
  if v_result is distinct from jsonb_build_object(
    'ok', true, 'state', 'essential_only', 'recorded', false
  ) then
    raise exception 'fresh essential-only result mismatch: %', v_result;
  end if;
  if (select count(*) from public.guest_refs) <> v_count then
    raise exception 'essential-only unexpectedly created identity';
  end if;

  v_result := public.record_guest_consent(
    'analytics_allowed', 'launch-smoke-v1', 'g_launchsmoke00001', 'smoke-agent'
  );
  if v_result->>'recorded' <> 'true' then
    raise exception 'analytics consent was not recorded: %', v_result;
  end if;
  select id into v_guest_id
  from public.guest_refs where ref = 'g_launchsmoke00001';
  if v_guest_id is null then
    raise exception 'analytics opt-in did not create its GuestRef';
  end if;
  select slug into v_shared_slug
  from public.venues
  where status = 'active'
    and publication_status = 'published'
  order by slug
  limit 1;
  if v_shared_slug is null then
    raise exception 'smoke database needs one active published venue';
  end if;

  v_result := public.record_guest_consent(
    'analytics_allowed', 'launch-smoke-v1', 'g_launchsmoke00001', 'smoke-agent'
  );
  if v_result->>'recorded' <> 'false' then
    raise exception 'identical consent was not deduplicated: %', v_result;
  end if;

  v_result := public.set_saved_place(
    'g_launchsmoke00001', v_shared_slug, true
  );
  if v_result->>'saved' <> 'true' then
    raise exception 'published venue was not saved: %', v_result;
  end if;
  v_result := public.set_saved_place(
    'g_launchsmoke00001', v_shared_slug, true
  );
  select count(*) into v_count
  from public.saved_places
  where guest_ref_id = v_guest_id and venue_slug = v_shared_slug;
  if v_result->>'saved' <> 'true' or v_count <> 1 then
    raise exception 'repeated save was not idempotent: %, %', v_result, v_count;
  end if;
  v_result := public.set_saved_place(
    'g_launchsmoke00001', 'not-a-published-venue', true
  );
  if v_result->>'error' <> 'venue_unavailable' then
    raise exception 'save admitted an unavailable venue: %', v_result;
  end if;
  perform public.set_saved_place('g_launchsmoke00001', v_shared_slug, false);
  perform public.set_saved_place('g_launchsmoke00001', v_shared_slug, false);
  if exists (
    select 1 from public.saved_places
    where guest_ref_id = v_guest_id and venue_slug = v_shared_slug
  ) then
    raise exception 'repeated unsave did not converge to absent';
  end if;

  insert into public.saved_places(guest_ref_id, venue_slug)
  select v_guest_id, 'save-limit-' || lpad(value::text, 3, '0')
  from generate_series(1, 500) value;
  v_result := public.set_saved_place(
    'g_launchsmoke00001', v_shared_slug, true
  );
  if v_result->>'error' <> 'save_limit_reached' then
    raise exception '501st saved row was not blocked: %', v_result;
  end if;
  delete from public.saved_places where guest_ref_id = v_guest_id;

  if public.create_shared_list(
      'g_launchsmoke00001', array[v_shared_slug, null]::text[]
    ) is not null
    or public.create_shared_list(
      'g_launchsmoke00001', array['not-a-published-venue']
    ) is not null then
    raise exception 'shared-list admission accepted invalid or unavailable slugs';
  end if;
  for v_index in 1..20 loop
    v_list_id := public.create_shared_list(
      'g_launchsmoke00001', array[v_shared_slug]
    );
    if v_list_id !~ '^l_[0-9a-f]{24}$' then
      raise exception 'owned shared-list ID % is invalid', v_list_id;
    end if;
  end loop;
  if public.create_shared_list(
      'g_launchsmoke00001', array[v_shared_slug]
    ) is not null then
    raise exception '21st active shared list was not blocked';
  end if;

  insert into public.attribution_sources(id, label, source_class, active)
  values
    ('launch_smoke', 'Launch smoke', 'external', true),
    ('launch_inactive', 'Launch inactive', 'external', false);
  v_result := public.log_event_v3(
    'source_scan', 'g_launchsmoke00001', null, null, null
  );
  if v_result->>'error' <> 'bad_request' then
    raise exception 'source_scan accepted a missing source: %', v_result;
  end if;
  v_result := public.log_event_v3(
    'source_scan', 'g_launchsmoke00001', null, 'launch_inactive', null
  );
  if v_result->>'error' <> 'bad_request' then
    raise exception 'source_scan accepted an inactive registry source: %', v_result;
  end if;
  v_result := public.capture_source_scan(
    'g_launchsmoke00001', 'launch_smoke'
  );
  if v_result->>'stored' <> 'true' then
    raise exception 'valid source_scan was not stored: %', v_result;
  end if;
  if (select source from public.guest_refs where id = v_guest_id) <> 'launch_smoke' then
    raise exception 'valid source_scan did not assign first-touch source';
  end if;
  v_result := public.capture_source_scan(
    'g_launchsmoke00001', 'launch_smoke'
  );
  if v_result->>'deduplicated' <> 'true' then
    raise exception 'duplicate source_scan was not suppressed: %', v_result;
  end if;

  v_result := public.log_event_v3(
    'landing_open', 'g_launchsmoke00001', 'smoke-00', null, null
  );
  if v_result->>'stored' <> 'true' then
    raise exception 'first event was not stored: %', v_result;
  end if;
  v_result := public.log_event_v3(
    'landing_open', 'g_launchsmoke00001', 'smoke-00', null, null
  );
  if v_result->>'deduplicated' <> 'true' then
    raise exception 'exact duplicate was not suppressed: %', v_result;
  end if;

  for v_index in 1..28 loop
    v_result := public.log_event_v3(
      'landing_open',
      'g_launchsmoke00001',
      'smoke-' || lpad(v_index::text, 2, '0'),
      null,
      null
    );
    if v_result->>'stored' <> 'true' then
      raise exception 'event % was not stored: %', v_index, v_result;
    end if;
  end loop;

  v_result := public.log_event_v3(
    'landing_open', 'g_launchsmoke00001', 'smoke-29', null, null
  );
  if v_result->>'error' <> 'rate_limited'
    or coalesce((v_result->>'retry_after_seconds')::integer, 0) < 1 then
    raise exception '31st event was not rate limited: %', v_result;
  end if;

  v_result := public.export_guest_data('g_launchsmoke00001');
  if v_result->>'ok' <> 'true'
    or v_result->>'version' <> '1'
    or v_result #>> '{data,identity,guestRef}' <> 'g_launchsmoke00001'
    or jsonb_array_length(v_result #> '{data,events}') <> 30
    or jsonb_array_length(v_result #> '{data,sharedLists}') <> 20 then
    raise exception 'versioned export mismatch: %', v_result;
  end if;

  v_result := public.record_guest_consent(
    'essential_only', 'launch-smoke-v1', 'g_launchsmoke00001', 'smoke-agent'
  );
  if v_result->>'recorded' <> 'true' then
    raise exception 'withdrawal was not recorded: %', v_result;
  end if;
  v_result := public.log_event_v3(
    'landing_open', 'g_launchsmoke00001', 'after-withdraw', null, null
  );
  if v_result->>'error' <> 'analytics_consent_required' then
    raise exception 'withdrawal did not stop events: %', v_result;
  end if;

  perform public.record_guest_consent(
    'analytics_allowed', 'launch-smoke-v1', 'g_launchsmoke00001', 'smoke-agent'
  );
  insert into public.redemption_events(
    guest_ref_id, venue_slug, confirm_code, source, source_class,
    externally_attributed
  ) values (
    v_guest_id, v_shared_slug, 'SMOKE1', 'in_venue', 'in_venue', false
  );
  perform public.log_dish_feedback(
    'g_launchsmoke00001', v_shared_slug, 'first bounded dish', 'worth_it'
  );
  perform public.log_dish_feedback(
    'g_launchsmoke00001', v_shared_slug, 'retry must not overwrite', 'meh'
  );
  select count(*) into v_count
  from public.events
  where guest_ref_id = v_guest_id
    and venue_slug = v_shared_slug
    and type = 'dish_feedback'
    and meta->>'dish' = 'first bounded dish';
  if v_count <> 1 then
    raise exception 'dish feedback retry was not first-write-wins: %', v_count;
  end if;
  insert into public.shared_lists(id, guest_ref_id, venue_slugs)
  values ('launch-smoke-list', v_guest_id, array[]::text[]);
  insert into public.events(type, guest_ref_id, venue_slug, meta)
  values (
    'dish_feedback',
    v_guest_id,
    'dish-feedback-fixture',
    jsonb_build_object('dish', 'free text that must be erased', 'verdict', 'worth_it')
  );

  v_result := public.delete_guest_data('g_launchsmoke00001');
  if v_result is distinct from jsonb_build_object('ok', true, 'status', 'completed') then
    raise exception 'deletion result is not generic: %', v_result;
  end if;
  if exists (select 1 from public.guest_refs where id = v_guest_id)
    or exists (select 1 from public.consent_log where guest_ref_id = v_guest_id)
    or exists (select 1 from public.shared_lists where guest_ref_id = v_guest_id) then
    raise exception 'linked guest data survived deletion';
  end if;
  if not exists (
    select 1 from public.guest_ref_tombstones
    where ref_hash = extensions.digest('g_launchsmoke00001', 'sha256')
  ) then
    raise exception 'deletion did not retain its hash-only tombstone';
  end if;
  select count(*) into v_count
  from public.events
  where (venue_slug like 'smoke-%' or source = 'launch_smoke')
    and guest_ref_id is null;
  if v_count <> 30 then
    raise exception 'events were not irreversibly anonymized: %', v_count;
  end if;
  if exists (
    select 1 from public.events
    where type = 'dish_feedback'
      and meta->>'dish' = 'free text that must be erased'
  ) then
    raise exception 'user-authored dish feedback survived deletion';
  end if;
  v_result := public.export_guest_data('g_launchsmoke00001');
  if v_result #> '{data,identity}' <> 'null'::jsonb
    or jsonb_array_length(v_result #> '{data,events}') <> 0
    or jsonb_array_length(v_result #> '{data,sharedLists}') <> 0 then
    raise exception 'revoked identity export was not empty: %', v_result;
  end if;
  v_result := public.set_saved_place(
    'g_launchsmoke00001', v_shared_slug, true
  );
  if v_result->>'error' <> 'identity_revoked'
    or public.create_shared_list(
      'g_launchsmoke00001', array[v_shared_slug]
    ) is not null then
    raise exception 'tombstoned GuestRef admitted a delayed write: %', v_result;
  end if;
  begin
    insert into public.guest_refs(ref) values ('g_launchsmoke00001');
  exception when sqlstate '55000' then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'direct insert resurrected a tombstoned GuestRef';
  end if;
  insert into public.guest_refs(ref) values ('g_guardsmoke000000');
  v_blocked := false;
  begin
    update public.guest_refs
    set ref = 'g_launchsmoke00001'
    where ref = 'g_guardsmoke000000';
  exception when sqlstate '55000' then
    v_blocked := true;
  end;
  if not v_blocked then
    raise exception 'GuestRef update bypassed the tombstone guard';
  end if;

  v_result := public.delete_guest_data('g_absentsmoke00000');
  if v_result->>'status' <> 'completed' then
    raise exception 'absent identity deletion was not generic: %', v_result;
  end if;
  v_result := public.set_saved_place(
    'g_absentsmoke00000', v_shared_slug, true
  );
  if v_result->>'error' <> 'identity_revoked'
    or exists (
      select 1 from public.guest_refs where ref = 'g_absentsmoke00000'
    ) then
    raise exception 'absent-ref tombstone lost the delayed-first-write race: %', v_result;
  end if;
  if public.delete_guest_data('g_launchsmoke00001') is distinct from
    jsonb_build_object('ok', true, 'status', 'completed') then
    raise exception 'repeat deletion leaked identifier existence';
  end if;
end;
$assert_privacy_and_events$;

rollback;
