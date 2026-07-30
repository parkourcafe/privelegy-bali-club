-- Cover the v1.2 runtime foreign keys used for guest-scoped retention,
-- reads and cascade deletes. Additive and safe to apply after 0061.
begin;

create index if not exists v12_decision_runs_guest_created
  on public.v12_decision_runs (guest_ref_id, created_at desc);

create index if not exists v12_today_sessions_guest_updated
  on public.v12_today_sessions (guest_ref_id, updated_at desc);

commit;
