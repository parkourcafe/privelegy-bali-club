-- Venue areas + JTBD content layer (master §6, approved direction).
-- Additive nullable columns only — no new entities (guardrail #11), no new
-- districts (guardrail #4: `area` is a sub-area label INSIDE the canggu
-- district; coverage/monetization still keys off districts).
--
-- JTBD fields are venue "fit context" (WHO/WHEN a place suits — allowed by
-- guardrail #7). They are NOT quality warnings; `not_for` must stay fit
-- language ("big groups", "laptop work") — never "don't order X".

alter table public.venues add column if not exists area text;
alter table public.venues add column if not exists why_its_here text;
alter table public.venues add column if not exists best_for text;
alter table public.venues add column if not exists not_for text;
alter table public.venues add column if not exists practical_tags text[];
alter table public.venues add column if not exists jobs text[];

comment on column public.venues.area is 'Sub-area inside the district (Berawa / Batu Bolong / Echo Beach / Pererenan / Nelayan). Display + filter only.';
comment on column public.venues.jobs is 'Jobs-to-be-done tags (work, date, family, group, rainy, quick). Drives static moment filters — no AI (guardrail #2).';

-- Best-effort factual backfill of area from street addresses (idempotent).
update public.venues set area = 'Berawa'      where area is null and address ilike '%berawa%';
update public.venues set area = 'Batu Bolong' where area is null and (address ilike '%batu bolong%' or address ilike '%padang linjong%');
update public.venues set area = 'Echo Beach'  where area is null and (address ilike '%echo beach%' or address ilike '%batu mejan%');
update public.venues set area = 'Pererenan'   where area is null and address ilike '%pererenan%';
update public.venues set area = 'Nelayan'     where area is null and address ilike '%nelayan%';
