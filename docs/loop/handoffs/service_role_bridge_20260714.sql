-- Zero-downtime compatibility bridge for the Other Bali release.
-- Safe to run before or after 0031_secure_partner_operator_rpcs.sql.
-- It grants only the server-side service_role and does not change anon access.

do $bridge$
declare
  v_signature text;
  v_function regprocedure;
begin
  foreach v_signature in array array[
    'public.get_or_create_onboard_token(text)',
    'public.invite_roster()',
    'public.set_guest_source(text,text)',
    'public.log_event(text,text,text,text)',
    'public.record_redemption(text,text,boolean,text)',
    'public.confirm_onboarding(text,text,boolean,text)',
    'public.log_dish_feedback(text,text,text,text)',
    'public.my_redemptions(text)',
    'public.phase0_overview()',
    'public.onboard_status()',
    'public.toggle_saved_place(text,text)',
    'public.saved_places_for(text)',
    'public.create_shared_list(text,text[])',
    'public.partner_report(text)',
    'public.partner_notes(text)',
    'public.venue_redemption_count(text)',
    'public.set_venue_jtbd(text,text,text,text[],text[],text)'
  ]
  loop
    v_function := to_regprocedure(v_signature);
    if v_function is not null then
      execute format('grant execute on function %s to service_role', v_function);
    end if;
  end loop;

  if to_regprocedure('public.record_redemption(text,text,boolean,text)') is not null
     and not has_function_privilege(
       'service_role',
       'public.record_redemption(text,text,boolean,text)',
       'EXECUTE'
     ) then
    raise exception 'Bridge verification failed: service_role cannot execute record_redemption';
  end if;

  if to_regprocedure('public.confirm_onboarding(text,text,boolean,text)') is not null
     and not has_function_privilege(
       'service_role',
       'public.confirm_onboarding(text,text,boolean,text)',
       'EXECUTE'
     ) then
    raise exception 'Bridge verification failed: service_role cannot execute confirm_onboarding';
  end if;
end;
$bridge$;
