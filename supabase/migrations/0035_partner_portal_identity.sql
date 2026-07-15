-- Other Bali partner identity and approval boundary.
--
-- This migration is intentionally forward-only and service-role mediated. It
-- creates the durable identity/membership model needed by the future partner
-- workspace, but does not grant direct browser writes to menu/action/photo
-- tables. Production application requires a fresh read-only migration
-- snapshot and an approved forward-repair plan first.

begin;

create table if not exists public.venue_memberships (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner'
    check (role in ('owner', 'manager', 'staff')),
  status text not null default 'active'
    check (status in ('invited', 'active', 'suspended', 'revoked')),
  invited_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (venue_slug, user_id)
);

create index if not exists venue_memberships_user_idx
  on public.venue_memberships(user_id, status, venue_slug);
create index if not exists venue_memberships_venue_idx
  on public.venue_memberships(venue_slug, status, role);

alter table public.venue_memberships enable row level security;
revoke all on table public.venue_memberships from public, anon, authenticated;
grant select, insert, update, delete on table public.venue_memberships to service_role;

-- The raw onboarding URL token is never stored in this table. The claim route
-- verifies the existing token through the server boundary, then records only
-- a one-way digest and the authenticated user who claimed it.
create table if not exists public.venue_onboarding_claims (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null references public.venues(slug) on delete cascade,
  token_hash text not null unique
    check (length(btrim(token_hash)) between 43 and 128),
  claimed_by uuid not null references auth.users(id) on delete restrict,
  claimed_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (venue_slug, claimed_by)
);

create index if not exists venue_onboarding_claims_venue_idx
  on public.venue_onboarding_claims(venue_slug, claimed_at desc);
alter table public.venue_onboarding_claims enable row level security;
revoke all on table public.venue_onboarding_claims from public, anon, authenticated;
grant select, insert, update, delete on table public.venue_onboarding_claims to service_role;

-- Approval facts are intentionally independent from source verification. A
-- source can be operator-reviewed and published while the venue's owner
-- confirmation remains outstanding; that state is visible in the partner UI.
alter table if exists public.menus
  add column if not exists operator_reviewed_at timestamptz,
  add column if not exists operator_reviewed_by text
    check (operator_reviewed_by is null or length(btrim(operator_reviewed_by)) between 1 and 160),
  add column if not exists owner_confirmed_at timestamptz,
  add column if not exists owner_confirmed_by uuid references auth.users(id) on delete set null,
  add column if not exists owner_confirmation_note text
    check (owner_confirmation_note is null or length(owner_confirmation_note) <= 2000);

alter table if exists public.venue_action_capabilities
  add column if not exists operator_reviewed_at timestamptz,
  add column if not exists operator_reviewed_by text
    check (operator_reviewed_by is null or length(btrim(operator_reviewed_by)) between 1 and 160),
  add column if not exists owner_confirmed_at timestamptz,
  add column if not exists owner_confirmed_by uuid references auth.users(id) on delete set null,
  add column if not exists owner_confirmation_note text
    check (owner_confirmation_note is null or length(owner_confirmation_note) <= 2000);

alter table if exists public.venue_photo_submissions
  add column if not exists owner_confirmed_at timestamptz,
  add column if not exists owner_confirmed_by uuid references auth.users(id) on delete set null,
  add column if not exists owner_confirmation_note text
    check (owner_confirmation_note is null or length(owner_confirmation_note) <= 2000);

create index if not exists menus_owner_confirmation_idx
  on public.menus(venue_slug, owner_confirmed_at, status);
create index if not exists venue_actions_owner_confirmation_idx
  on public.venue_action_capabilities(venue_slug, owner_confirmed_at, status);
create index if not exists venue_photos_owner_confirmation_idx
  on public.venue_photo_submissions(venue_slug, owner_confirmed_at, status);

comment on table public.venue_memberships is
  'Durable authenticated owner/manager/staff membership; service-role writes only until partner RLS is enabled.';
comment on table public.venue_onboarding_claims is
  'One-time onboarding claim evidence; stores a digest, never the raw bearer token.';
comment on column public.menus.operator_reviewed_at is
  'Human operator review timestamp; intentionally distinct from source verified_at and owner confirmation.';
comment on column public.menus.owner_confirmed_at is
  'Venue owner confirmation timestamp; does not itself authorize public publication.';

commit;
