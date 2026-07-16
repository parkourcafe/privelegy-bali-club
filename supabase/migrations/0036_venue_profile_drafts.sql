-- Owner self-fill profile intake (2026-07-16).
--
-- A venue owner opening their tokenized /onboard/<token> link can now submit
-- a FULL profile draft in one go: about text in their own words, signature
-- items, opening hours, price range, canonical links (Google Maps required,
-- Instagram/website), an optional video link, and publish notes. The draft
-- lands in a pending review queue — it NEVER writes to public.venues and
-- never appears on the guide by itself. Editorial reviews each draft, keeps
-- the editorial voice, corrects what's weak, and applies fields by hand.
--
-- Same discipline as guide_leads (0018) / venue_submissions (0035):
-- default-deny RLS, writes only through a SECURITY DEFINER RPC guarded to
-- the service role, token resolved server-side, minimal PII (submitter name
-- + optional role for attribution of owner copy).
--
-- Guardrails: owner copy stays attributed as owner copy (§13) — the about
-- text is stored verbatim and is NOT an editorial field; partner write paths
-- do not touch Other Bali editorial fields (§9). No auto-publish (§10).
-- Idempotent: safe to re-run.

-- ── Table ───────────────────────────────────────────────────────────────
create table if not exists public.venue_profile_drafts (
  id              uuid primary key default gen_random_uuid(),
  venue_slug      text not null,
  about_text      text not null,
  signature_items text,
  opening_hours   text,
  price_range     text
                    check (price_range is null or price_range in ('$', '$$', '$$$', '$$$$')),
  gmaps_url       text not null,
  instagram_url   text,
  website_url     text,
  video_url       text,
  publish_notes   text,
  submitter_name  text not null,
  submitter_role  text,
  status          text not null default 'pending_review'
                    check (status in ('pending_review', 'reviewing', 'applied', 'rejected')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.venue_profile_drafts is
  'Owner-submitted full profile drafts from tokenized /onboard links. Pending queue only — editorial reviews, corrects and applies by hand. Owner copy stays attributed as owner copy; never auto-published.';

-- One pending draft per venue: a resubmission replaces the pending row
-- instead of multiplying the queue. Applied/rejected history is kept.
create unique index if not exists venue_profile_drafts_pending_key
  on public.venue_profile_drafts (venue_slug)
  where status = 'pending_review';

alter table public.venue_profile_drafts enable row level security;
-- Default-deny: no anon/authenticated policies. Owner writes go through the
-- SECURITY DEFINER RPC below; operator reads use the service role.

-- ── Intake RPC ──────────────────────────────────────────────────────────
-- Deep validation (URL shape, host allowlists, lengths) happens at the API
-- layer; this RPC re-checks the invariants that must hold no matter what:
-- service-role caller, valid token, required fields present, https links.
create or replace function public.submit_venue_profile_draft(
  p_token text,
  p_about_text text,
  p_gmaps_url text,
  p_submitter_name text,
  p_signature_items text default null,
  p_opening_hours text default null,
  p_price_range text default null,
  p_instagram_url text default null,
  p_website_url text default null,
  p_video_url text default null,
  p_publish_notes text default null,
  p_submitter_role text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
declare
  v_slug text;
  v_id uuid;
begin
  if auth.role() is distinct from 'service_role' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  select venue_slug into v_slug
  from public.venue_onboard_tokens
  where token = p_token;

  if v_slug is null then
    return jsonb_build_object('ok', false, 'error', 'bad_token');
  end if;

  if length(coalesce(btrim(p_about_text), '')) < 20 then
    return jsonb_build_object('ok', false, 'error', 'about_required');
  end if;
  if length(coalesce(btrim(p_submitter_name), '')) < 2 then
    return jsonb_build_object('ok', false, 'error', 'name_required');
  end if;
  if coalesce(btrim(p_gmaps_url), '') !~* '^https://' then
    return jsonb_build_object('ok', false, 'error', 'gmaps_required');
  end if;
  if coalesce(btrim(p_instagram_url), '') = ''
    and coalesce(btrim(p_website_url), '') = '' then
    return jsonb_build_object('ok', false, 'error', 'social_required');
  end if;
  if p_price_range is not null
    and p_price_range not in ('$', '$$', '$$$', '$$$$') then
    return jsonb_build_object('ok', false, 'error', 'invalid_price_range');
  end if;

  insert into public.venue_profile_drafts (
    venue_slug, about_text, signature_items, opening_hours, price_range,
    gmaps_url, instagram_url, website_url, video_url, publish_notes,
    submitter_name, submitter_role
  )
  values (
    v_slug,
    left(btrim(p_about_text), 2000),
    nullif(left(btrim(coalesce(p_signature_items, '')), 600), ''),
    nullif(left(btrim(coalesce(p_opening_hours, '')), 400), ''),
    p_price_range,
    left(btrim(p_gmaps_url), 2048),
    nullif(left(btrim(coalesce(p_instagram_url, '')), 2048), ''),
    nullif(left(btrim(coalesce(p_website_url, '')), 2048), ''),
    nullif(left(btrim(coalesce(p_video_url, '')), 2048), ''),
    nullif(left(btrim(coalesce(p_publish_notes, '')), 1500), ''),
    left(btrim(p_submitter_name), 160),
    nullif(left(btrim(coalesce(p_submitter_role, '')), 160), '')
  )
  on conflict (venue_slug) where status = 'pending_review'
  do update set
    about_text      = excluded.about_text,
    signature_items = excluded.signature_items,
    opening_hours   = excluded.opening_hours,
    price_range     = excluded.price_range,
    gmaps_url       = excluded.gmaps_url,
    instagram_url   = excluded.instagram_url,
    website_url     = excluded.website_url,
    video_url       = excluded.video_url,
    publish_notes   = excluded.publish_notes,
    submitter_name  = excluded.submitter_name,
    submitter_role  = excluded.submitter_role,
    updated_at      = now()
  returning id into v_id;

  return jsonb_build_object('ok', true, 'draft_id', v_id);
end;
$fn$;

revoke all on function public.submit_venue_profile_draft(
  text, text, text, text, text, text, text, text, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.submit_venue_profile_draft(
  text, text, text, text, text, text, text, text, text, text, text, text
) to service_role;
