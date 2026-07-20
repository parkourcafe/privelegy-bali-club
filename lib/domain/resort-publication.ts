// Operator publish whitelist for the resort vertical (IA spec v1 §10.3:
// "публиковать только вручную whitelisted category × district combinations";
// Phase 3: "import verified Nusa Dua data только после operator review").
//
// An imported property/venue/offer becomes PUBLIC (indexable, in the sitemap,
// linked from the menu) only when its slug is listed here AND it passes the
// §13 publication gate. This set is the single manual gate the founder/operator
// controls — nothing the deterministic importer produces is ever auto-public.
//
// First operator review pass (2026-07-20): 15 of the 20 imported Nusa Dua /
// Tanjung Benoa offers had a verified price, a real booking channel and an
// editorialNote translated into English (data/resort-import/offers.json) --
// whitelisted below. The other 5 are deliberately held back, each for a
// reason recorded in its own (Russian, operator-only) editorialNote:
//   - sofitel-bali-nusa-dua-beach-resort--daypass-experience: source listing
//     currently shows Unavailable, no price to publish.
//   - the-laguna-a-luxury-collection-resort-and-spa-nusa-dua--arwana-sunday-brunch:
//     official sources conflict on price (650k vs 788k), unresolved.
//   - the-mulia-bali--soleil-sunday-brunch: price only from a secondary
//     (non-official) 2026 source, needs confirmation before publishing.
//   - the-westin-resort-nusa-dua-bali--ultimate-dine-and-dive-indulgence:
//     unclear which amenities apply to this specific rate.
//   - nusa-dua-beach-hotel-and-spa-handwritten-collection--joyful-serenity-beach-and-pool-day-pass:
//     research says this is domestic-resident/KITAS-only, but the offer
//     schema's openToNonGuests is hardcoded true for every day_pass/brunch
//     row (see resort-import.ts) -- publishing would show "open to
//     non-guests", contradicting the sourced access restriction. Needs a
//     per-offer access override before this one can go out; flagged, not
//     silently shipped with a wrong claim.
export const RESORT_PUBLISH_WHITELIST = new Set<string>([
  "holiday-inn-resort-bali-nusa-dua--fun-day-pass",
  "hotel-nikko-bali-benoa-beach--nikko-day-pass",
  "novotel-bali-benoa--day-pass",
  "samabe-bali-suites-and-villas--a-day-at-beach-cabanas",
  "sofitel-bali-nusa-dua-beach-resort--cucina-sunday-brunch",
  "the-apurva-kempinski-bali--brunchcation-at-pala",
  "the-apurva-kempinski-bali--dim-sum-brunch-at-bai-yun",
  "the-apurva-kempinski-bali--izakaya-journey",
  "the-royal-santrian--day-dream-experience",
  "the-royal-santrian--dip-and-dine",
  "the-sakala-resort-bali--sakala-beach-club-day-pass",
  "the-st-regis-bali-resort--astor-brunch-at-kayuputi",
  "the-st-regis-bali-resort--boneka-sunday-brunch",
  "the-st-regis-bali-resort--the-st-regis-bali-brunch-at-kayuputi",
  "the-westin-resort-nusa-dua-bali--prego-monthly-brunch",
]);
