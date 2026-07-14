-- Right-to-be-forgotten support for the anonymous device reference
-- (audit 2026-07, privacy). A SECURITY DEFINER RPC that erases a device's
-- behavioural + preference data by its anonymous guest ref, callable from the
-- app's anon key (like the other guest RPCs).
--
-- RETENTION DECISION — flagged for legal review, not decided unilaterally:
--   redemption_events are the partner-proof / attribution record (guardrail #8)
--   and are treated as retained financial/attribution proof, so they are NOT
--   deleted here. The guest_refs row and its consent_log are kept so those
--   retained redemptions stay referentially valid and the consent record
--   survives. Everything else tied to the device (behavioural events, saved
--   places, shared lists, the attribution source tag) is removed.
--   If legal review concludes redemptions/consent must also be erased, extend
--   this function then — do not widen it silently.
--
-- Prod apply = founder step (same as prior migrations).

create or replace function public.forget_guest(p_guest_ref text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if p_guest_ref is null or length(p_guest_ref) < 4 then
    return;
  end if;
  select id into v_id from guest_refs where ref = p_guest_ref;
  if v_id is null then
    return;
  end if;

  -- Behavioural analytics + traveller preferences (not billing proof).
  delete from events       where guest_ref_id = v_id;
  delete from saved_places where guest_ref_id = v_id;
  delete from shared_lists where guest_ref_id = v_id;

  -- Drop the attribution source but keep the ref row so retained
  -- redemption_events (partner proof) stay referentially valid.
  update guest_refs set source = null where id = v_id;
end;
$$;

revoke all on function public.forget_guest(text) from public;
grant execute on function public.forget_guest(text) to anon, authenticated;
