-- 0042_publish_kora_chain_venues.sql
-- Flip the 5 KORA chain venues inserted by 0041 from publication_status 'review' ->
-- 'published', making them publicly visible (public reads require status='active' AND
-- publication_status='published'). They are decision-ready (address + Google Maps +
-- editorial) and all carry a 'high'-confidence, web-verified currently-operating Bali outlet.
--
-- Must run AFTER 0041. Idempotent and scoped strictly to these 5 slugs.
-- Production apply is a separate founder step.

begin;

update venues set publication_status = 'published'
where publication_status = 'review'
  and slug in (
    $ob$toko-kopi-tuku$ob$,
    $ob$gildak-renon$ob$,
    $ob$sate-khas-senayan-beachwalk$ob$,
    $ob$bakso-boedjangan-jimbaran$ob$,
    $ob$fore-coffee-jimbaran$ob$
  );

commit;
