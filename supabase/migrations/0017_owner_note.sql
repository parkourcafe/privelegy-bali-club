-- Owner's own words (UGC): a free-text self-description the venue writes
-- during onboarding. Shown on the card clearly attributed as the owner's
-- voice ("From the owner"), never mixed into the editorial why_its_here.
-- Generous cap (2000 chars) is anti-abuse only — owners are encouraged to
-- write at length; the text is indexable venue-authored content (SEO).

alter table venues add column if not exists owner_note text;

-- Replace set_venue_jtbd with the owner_note-aware signature. Drop the old
-- 5-arg version so PostgREST has a single unambiguous function.
drop function if exists public.set_venue_jtbd(text,text,text,text[],text[]);

create or replace function public.set_venue_jtbd(
  p_token text,
  p_best_for text,
  p_not_for text,
  p_jobs text[],
  p_practical_tags text[],
  p_owner_note text default null
) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_slug text;
  v_jobs text[];
  v_tags text[];
  allowed_jobs text[] := array['slow','breakfast','work','lunch','reset','sunset','dinner','date','special','family'];
  allowed_tags text[] := array['fast wifi','power plugs','free to sit','quiet before 9am','good coffee','kids ok','scooter parking','cash ok','opens early','air-con','vegetarian'];
begin
  select venue_slug into v_slug from venue_onboard_tokens where token = p_token;
  if v_slug is null then return jsonb_build_object('ok', false, 'error', 'bad_token'); end if;

  -- keep only whitelisted tags; cap counts; trim free text
  select array(select distinct x from unnest(coalesce(p_jobs, '{}')) x where x = any(allowed_jobs)) into v_jobs;
  select array(select distinct x from unnest(coalesce(p_practical_tags, '{}')) x where x = any(allowed_tags)) into v_tags;

  update venues set
    best_for       = nullif(left(btrim(coalesce(p_best_for, '')), 140), ''),
    not_for        = nullif(left(btrim(coalesce(p_not_for, '')), 140), ''),
    owner_note     = nullif(left(btrim(coalesce(p_owner_note, '')), 2000), ''),
    jobs           = case when array_length(v_jobs,1) is null then null else v_jobs[1:8] end,
    practical_tags = case when array_length(v_tags,1) is null then null else v_tags[1:8] end
  where slug = v_slug;

  return jsonb_build_object('ok', true);
end; $$;

revoke all on function public.set_venue_jtbd(text,text,text,text[],text[],text) from public;
grant execute on function public.set_venue_jtbd(text,text,text,text[],text[],text) to anon, authenticated;
