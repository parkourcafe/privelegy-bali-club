-- Bali-wide planning layer: main tourist areas as planning_only districts.
-- Coverage guardrail #4 holds at the DB level: status defaults to
-- planning_only, monetization_enabled/qr_enabled default to false — QR
-- redemption outside a qr_enabled district is already rejected by
-- record_redemption() (0006). No money surface is added here.
-- canggu (active_deep) and ubud (next_deep) already exist (0001/0006).

insert into districts (slug, name, is_deep, status, monetization_enabled, qr_enabled) values
  ('seminyak',      'Seminyak',                   false, 'planning_only', false, false),
  ('kuta-legian',   'Kuta & Legian',              false, 'planning_only', false, false),
  ('jimbaran',      'Jimbaran',                   false, 'planning_only', false, false),
  ('uluwatu-bukit', 'Uluwatu & the Bukit',        false, 'planning_only', false, false),
  ('nusa-dua',      'Nusa Dua',                   false, 'planning_only', false, false),
  ('sanur',         'Sanur',                      false, 'planning_only', false, false),
  ('sidemen',       'Sidemen',                    false, 'planning_only', false, false),
  ('amed',          'Amed & the east coast',      false, 'planning_only', false, false),
  ('munduk',        'Munduk & the highlands',     false, 'planning_only', false, false),
  ('lovina',        'Lovina',                     false, 'planning_only', false, false),
  ('nusa-islands',  'Nusa Penida & the islands',  false, 'planning_only', false, false)
on conflict (slug) do nothing;
