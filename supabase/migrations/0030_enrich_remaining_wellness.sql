-- 0030_enrich_remaining_wellness.sql
-- Closes the last active non-Uluwatu venues without editorial: a padel club, a
-- salon, and an Ubud yoga centre. Verified web-research pass (official sites/IG);
-- guardrails held (no ratings/review counts; downsides only as not_for
-- fit-context; prices as bands; unverified fields blank). Wellness/sport rows
-- carry no what_to_order/jobs — they publish on why_its_here + best_for +
-- price_anchor. After apply, all three clear the decision-ready bar and their
-- /places pages become index,follow.

begin;

update venues set
  why_its_here = $ob$A dedicated padel racket-sport club on the Canggu shortcut with panoramic glass-walled courts set in tropical greenery. Courts are booked by the hour through the Jungle Padel app, with racket hire, coaching, a pro shop, changing rooms and an on-site café.$ob$,
  best_for = $ob$active travellers who want a padel game between beach sessions; groups of four booking a court together; players needing rental rackets or a lesson$ob$,
  not_for = $ob$total downtime or a spa-style wellness stop; anyone without a pre-booked court at peak times$ob$,
  price_anchor = $ob$$$ · court ~350–450K/hr (racket hire ~50K)$ob$,
  area = $ob$Batu Bolong (Canggu shortcut)$ob$
where slug = $ob$jungle-padel-canggu-shortcut$ob$;

update venues set
  why_its_here = $ob$A yoga and meditation centre in Penestanan, Ubud with two bamboo shalas, running daily drop-in classes across Hatha and Tantra vinyasa, Yin, meditation, ecstatic dance and sound-healing ceremonies, plus multi-class passes and Yoga Alliance 200hr and 300hr teacher trainings.$ob$,
  best_for = $ob$drop-in practitioners staying in Ubud or Penestanan; travellers wanting a varied daily class schedule without committing to a retreat; those interested in meditation, sound healing or teacher training$ob$,
  not_for = $ob$anyone after a gym-style or purely fitness workout; visitors wanting a beach or nightlife scene$ob$,
  price_anchor = $ob$$$ · drop-in class ~165K (multi-class passes and unlimited monthly available)$ob$,
  area = $ob$Penestanan Kelod, Ubud$ob$
where slug = $ob$alchemy-yoga-meditation-center$ob$;

update venues set
  why_its_here = $ob$A long-running nail, hair and skin salon offering manicures, pedicures, BIAB and nail art with an extensive polish range, plus hair and skin services. Rooms include a private space for a treatment while watching Netflix.$ob$,
  best_for = $ob$nails, lash and beauty appointments; friends going together for a pampering session; travellers wanting a wide gel/BIAB and nail-art menu$ob$,
  not_for = $ob$walk-ins expecting immediate slots (advance booking is advised); those wanting massage/spa-focused wellness rather than salon services$ob$,
  price_anchor = $ob$$$ · pedicure ~200–360K / manicure & BIAB ~500K+$ob$,
  area = $ob$Batu Belig / Kerobokan Kelod$ob$
where slug = $ob$think-pink-salon-and-nails-bali$ob$;

commit;
