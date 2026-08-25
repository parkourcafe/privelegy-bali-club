-- Other Bali — unpublish 13 verified-bad spa/wellness rows (2026-08-25).
--
-- Background: while backfilling gmaps_url for today's 407 new venues, 30
-- pre-existing published spa venues were flagged by name/domain pattern as
-- possibly wrong (e.g. "Banyan Tree Spa Macau"). The founder correctly
-- rejected that method outright ("проверь сначала") -- name/domain matching
-- alone is not evidence. All 30 were re-checked against their actual
-- full_address and verification_source columns instead. Only 13 held up as
-- genuinely wrong; the other 17 (including Banyan Tree Spa Macau, which the
-- founder specifically vouched for) are real Bali venues and are untouched.
--
-- 8 rows are a real business, but not in Bali -- full_address or
-- verification_source names another country/city outright:
--   the-westin-san-diego-gaslamp-quarter-jimbaran      -> San Diego, CA, USA
--   kims-massage-spa-phuket-thai-massage-wellness-an-sidemen -> Phuket Old Town
--   orientala-wellness-spa-karangasem                  -> Deevana Plaza Hotel, Phuket, Thailand
--   lohkah-hotel-spa-xiamen-lovina                      -> source spahotelsguide.com/xiamen
--   civitatis-ubud-ubud                                 -> address "Marrakech old town"
--   holis-spa-and-wellness-center-uluwatu-bukit         -> Manuel Antonio, Costa Rica
--   pendray-inn-and-teahouse-ubud                       -> 309 Belleville St (Victoria, BC, Canada)
--   the-merrion-spa-and-health-club-seminyak            -> source lhw.com/The-Merrion-Dublin-Ireland
--
-- 5 rows are not a single real venue -- the source is a directory/listicle
-- page, not the business's own site, so the "venue" is actually an article:
--   my-guide-bali-munduk    -> myguidebali.com/transport (tour aggregator's transport page)
--   wandernesia-munduk      -> wandernesia.com/bali-spa-massage ("spas in Bali" roundup article)
--   pilates-in-bali-canggu  -> balidaylight.com "Pilates in Bali -- studios to know" listicle
--   location-1-sanur        -> name is literally "Location 1"; source is another venue's own page
--   ubud-spa-ubud           -> ubudguide.com/post/ubud-spas (roundup article)
--
-- Founder approved unpublishing exactly these 13 ("Снять с публикации").
--
-- Mechanism: venues_publication_status_check allows only 'published' or
-- 'review' -- there is no separate "unpublished" value. Production
-- convention for a pulled-back row (confirmed by querying existing
-- non-published rows) is publication_status='review' + status='inactive'
-- (100 of 169 non-published rows use this exact pair). This keeps the row
-- for audit instead of deleting it.
--
-- Already dry-run (single row, begin/rollback) on civitatis-ubud-ubud before
-- this file was written, then applied for real to all 13 and committed
-- against production -- re-verified afterward with a read-only select that
-- all 13 slugs show publication_status='review', status='inactive'.
-- This file exists for the record/audit trail; re-running it is a no-op for
-- rows already in this state.

begin;

update venues
set publication_status = 'review', status = 'inactive'
where slug in (
  'the-westin-san-diego-gaslamp-quarter-jimbaran',
  'kims-massage-spa-phuket-thai-massage-wellness-an-sidemen',
  'orientala-wellness-spa-karangasem',
  'lohkah-hotel-spa-xiamen-lovina',
  'civitatis-ubud-ubud',
  'holis-spa-and-wellness-center-uluwatu-bukit',
  'pendray-inn-and-teahouse-ubud',
  'the-merrion-spa-and-health-club-seminyak',
  'my-guide-bali-munduk',
  'wandernesia-munduk',
  'pilates-in-bali-canggu',
  'location-1-sanur',
  'ubud-spa-ubud'
);

commit;
