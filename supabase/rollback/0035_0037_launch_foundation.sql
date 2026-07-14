-- Non-destructive operational rollback for migrations 0035-0037.
--
-- Run only if the application has already been switched back to legacy venue
-- reads/event logging and privacy routes are disabled. Venue columns and photo
-- evidence are intentionally retained: dropping them would destroy data and is
-- not an acceptable release rollback.

begin;

drop function if exists public.log_event_v3(text,text,text,text,jsonb);

drop function if exists public.record_guest_consent(text,text,text,text);
drop function if exists public.export_guest_data(text);
drop function if exists public.delete_guest_data(text);

-- Keep the C-04 schema, constraints, review report and venue_photos rows. The
-- legacy columns remain untouched, so reverting application reads is enough.

commit;
