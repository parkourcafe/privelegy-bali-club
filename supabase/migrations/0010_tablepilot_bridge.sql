-- Money model v0.3: bookable venues reserve through TablePilot. A venue with a
-- tablepilot_slug is bookable; the BP "Reserve" button hands off to
-- tablepilot-id.vercel.app/book/<slug>?source=bali_privilege.
alter table venues add column if not exists tablepilot_slug text;
