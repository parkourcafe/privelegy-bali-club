-- Non-destructive operational rollback for migration 0040.
--
-- The previous function definitions permit unbounded durable writes, so this
-- rollback disables the affected callable surfaces instead of restoring them.
-- Immutable confirmation evidence, private ledgers, limits and indexes remain.

begin;

revoke all on function public.confirm_onboarding(text,text,boolean,text)
  from public, anon, authenticated, service_role;
revoke all on function public.set_venue_jtbd(text,text,text,text[],text[],text)
  from public, anon, authenticated, service_role;
revoke all on function public.create_partner_menu_draft(
  text,text,text,text,text,text,bigint,text,timestamptz,timestamptz
) from public, anon, authenticated, service_role;
revoke all on function public.upsert_partner_menu_item(
  text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer
) from public, anon, authenticated, service_role;
revoke all on function public.create_partner_action_draft(
  text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz
) from public, anon, authenticated, service_role;
revoke all on function public.release_readiness_v1()
  from public, anon, authenticated, service_role;

-- Keep all data, evidence immutability, private ledgers and the one-confirmation
-- invariant. Reapplying 0040 safely restores only the hardened service grants.

commit;
