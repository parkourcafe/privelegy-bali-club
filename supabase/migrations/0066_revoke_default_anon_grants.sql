-- Revoke the default PostgREST grants that predate the 0031 hardening pattern.
--
-- Audit 2026-08-08 (docs/audits/AUDIT_2026-08-08_repo.md, P2): ~20 public
-- tables still carried Supabase's default grants for anon/authenticated —
-- up to DELETE and TRUNCATE on guest_refs, events, consent_log,
-- redemption_events and venue_submissions. Not exploitable through PostgREST
-- today: every table has RLS enabled and the only policies that exist are
-- SELECT policies on 11 read tables (verified against production 2026-08-09),
-- so row writes are refused and TRUNCATE is not part of the REST surface.
-- But grants nobody uses are pure attack surface, and migrations 0031+
-- already revoke them for the tables they create. This migration brings the
-- older tables to the same state.
--
-- Writes all flow through the service role and SECURITY DEFINER RPCs; those
-- grants are untouched. Idempotent: REVOKE of an absent privilege is a no-op,
-- and every table is guarded so environments built from a partial migration
-- chain do not fail.
--
-- Production apply is a separate founder step (AGENTS.md §9): record it in
-- the handoff, do not assume it from this file's existence.

do $$
declare
  -- No public read policy exists for these; anon/authenticated get nothing.
  fully_revoked text[] := array[
    'consent_log',
    'data_ops_review_snapshots',
    'data_ops_reviews_raw',
    'events',
    'guest_refs',
    'guide_leads',
    'recommendation_links',
    'redemption_events',
    'referral_attributions',
    'saved_places',
    'shared_lists',
    'venue_fact_sources',
    'venue_photo_consents',
    'venue_profile_drafts',
    'venue_review_synthesis',
    'venue_submissions'
  ];
  -- Public SELECT policies exist (published/fresh gates); reads stay, the
  -- write-class grants go.
  read_only text[] := array[
    'districts',
    'menu_items',
    'menu_sections',
    'menus',
    'perks',
    'plan_entries',
    'route_stops',
    'routes',
    'venue_action_capabilities',
    'venue_photos',
    'venues'
  ];
  t text;
begin
  foreach t in array fully_revoked loop
    if to_regclass('public.' || t) is not null then
      execute format(
        'revoke all on table public.%I from public, anon, authenticated', t);
    end if;
  end loop;

  foreach t in array read_only loop
    if to_regclass('public.' || t) is not null then
      execute format(
        'revoke insert, update, delete, truncate, references, trigger '
        || 'on table public.%I from public, anon, authenticated', t);
      execute format('grant select on table public.%I to anon, authenticated', t);
    end if;
  end loop;
end $$;
