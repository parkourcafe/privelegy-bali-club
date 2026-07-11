-- Planning layer extension beyond Bali proper: the classic fast-boat
-- side-trips (Gili Islands, Lombok) as planning_only districts. Same
-- coverage discipline as 0014 — monetization_enabled/qr_enabled stay false,
-- so no money surface exists there (guardrail #4, enforced in DB).

insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled) values
  ('gili-islands', 'Gili Islands', false, 'planning_only', false, false),
  ('lombok',       'Lombok',       false, 'planning_only', false, false)
on conflict (slug) do nothing;
