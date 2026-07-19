-- 0040_publish_kora_venues.sql
-- Flip the 24 KORA venues inserted by 0039 from publication_status 'review' -> 'published',
-- making them publicly visible (public reads require status='active' AND
-- publication_status='published'). They are decision-ready (address + Google Maps + editorial).
--
-- Must run AFTER 0039. Idempotent and scoped strictly to these 24 slugs.
-- Note: 10 of these carry a 'medium'-confidence address (directory-sourced, venue existence
--   certain): alma-tapas-bar, ayam-betutu-khas-gilimanuk, drifter-surf-cafe, hungry-bird-coffee, kilig-bali, menega-cafe, nalu-bowls, secret-spot-bali, sushimi-bali, warung-wardani.
-- Held back on purpose (still not published): kurasu-bali, dapur-bali-mula.
-- Production apply is a separate founder step.

begin;

update venues set publication_status = 'published'
where publication_status = 'review'
  and slug in (
    $ob$alma-tapas-bar$ob$,
    $ob$ayam-betutu-khas-gilimanuk$ob$,
    $ob$bebek-bengil$ob$,
    $ob$bossman-burgers$ob$,
    $ob$drifter-surf-cafe$ob$,
    $ob$expat-roasters$ob$,
    $ob$gusto-gelato$ob$,
    $ob$home-by-chef-wayan$ob$,
    $ob$hungry-bird-coffee$ob$,
    $ob$kilig-bali$ob$,
    $ob$melting-wok-warung$ob$,
    $ob$menega-cafe$ob$,
    $ob$motel-mexicola$ob$,
    $ob$nalu-bowls$ob$,
    $ob$saigon-street$ob$,
    $ob$sayuri-healing-food$ob$,
    $ob$secret-spot-bali$ob$,
    $ob$sushimi-bali$ob$,
    $ob$the-cashew-tree$ob$,
    $ob$the-loft-bali$ob$,
    $ob$tukies-coconut-shop$ob$,
    $ob$vincent-nigita$ob$,
    $ob$warung-biah-biah$ob$,
    $ob$warung-wardani$ob$
  );

commit;
