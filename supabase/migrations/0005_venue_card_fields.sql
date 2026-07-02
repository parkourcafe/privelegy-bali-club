-- Richer venue cards to match the Field Kit §2/§3 spec: vibe tags, price anchor,
-- "what to order" (consensus-checked bestseller), a photo, and a WhatsApp number
-- for pre-filled reservations. All nullable/additive — nothing breaks if empty.

alter table venues add column if not exists vibe_tags    text[];
alter table venues add column if not exists price_anchor text;
alter table venues add column if not exists what_to_order text;
alter table venues add column if not exists photo_url    text;
alter table venues add column if not exists whatsapp     text; -- digits only, intl (e.g. 6281...)
