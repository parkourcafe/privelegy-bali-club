-- "My perks" (guest sees their own redemptions) + dish-feedback (§18, Phase 1
-- data-moat: one-tap "what did you order? worth it?" → feeds Guests' favourite).
-- Guest identity is the httpOnly cookie ref, passed server-side only. The ref is
-- an unguessable token, so a per-ref lookup does not leak other guests' data.

-- A guest's own redemptions (newest first), aggregate of their own rows only.
create or replace function public.my_redemptions(p_guest_ref text)
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'venue_name',   v.name,
    'venue_slug',   re.venue_slug,
    'perk_title',   p.title,
    'confirm_code', re.confirm_code,
    'ts',           re.ts
  ) order by re.ts desc), '[]'::jsonb)
  from redemption_events re
  join guest_refs g on g.id = re.guest_ref_id
  left join venues v on v.slug = re.venue_slug
  left join perks p on p.id = re.perk_id
  where g.ref = p_guest_ref;
$$;

-- Dish feedback event. Structured detail lives in events.meta.
alter table events add column if not exists meta jsonb;

create or replace function public.log_dish_feedback(
  p_guest_ref text, p_venue_slug text, p_dish text, p_verdict text
) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare v_id uuid;
begin
  if p_venue_slug is null then return; end if;
  select id into v_id from guest_refs where ref = p_guest_ref;
  insert into events(type, guest_ref_id, venue_slug, meta)
    values ('dish_feedback', v_id, p_venue_slug,
            jsonb_build_object('dish', left(coalesce(p_dish,''), 120), 'verdict', p_verdict));
end; $$;

revoke all on function public.my_redemptions(text) from public;
revoke all on function public.log_dish_feedback(text,text,text,text) from public;
grant execute on function public.my_redemptions(text) to anon, authenticated;
grant execute on function public.log_dish_feedback(text,text,text,text) to anon, authenticated;
