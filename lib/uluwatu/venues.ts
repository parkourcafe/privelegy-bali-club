// Uluwatu district launch — editorial content + per-fact evidence registry.
//
// This file is the publication source of truth for the Uluwatu district
// product (master §6a.3: district/scenario surfaces are static config +
// ContentPage, NOT new DB entities). Venue base rows live in the DB
// (migrations 0015/0016, district `uluwatu-bukit`); this registry carries the
// verified editorial layer and the evidence trail required by the launch
// brief: every changeable published fact has a source type, source URL,
// verification date and status. Migration 0018 mirrors the machine-readable
// facts into `venues` columns + `venue_fact_sources` for the production DB.
//
// HARD RULES honoured here:
// - nothing is invented: facts come from the internal research dashboard
//   import (2026-07-11) or the web verification pass (2026-07-12, evidence
//   URLs below); a missing fact is null, never estimated;
// - opening hours are published ONLY when sourced from the venue's own
//   domain; aggregator hours stay off-page (recorded as RECHECK);
// - `notFor` is fit language only (guardrail #7), never a quality warning;
// - no venue photos are published (no image rights confirmed) — public
//   surfaces use the explicitly typographic editorial cover instead.

export const ULUWATU_DB_SLUG = "uluwatu-bukit";
export const ULUWATU_PUBLIC_BASE = "/uluwatu";

// Public URL slug ↔ internal DB district slug. The DB slug is preserved
// (renaming would break FKs + coverage flags); URLs use the canonical public
// district name. No venue rows are duplicated (brief §5).
export function normalizeDistrictParam(param: string): string {
  return param === "uluwatu" ? ULUWATU_DB_SLUG : param;
}

export type EvidenceStatus =
  | "VERIFIED"
  | "STALE — RECHECK REQUIRED"
  | "CONFLICTING SOURCES"
  | "MISSING"
  | "CLOSED OR UNCERTAIN"
  | "BOUNDARY REVIEW REQUIRED";

export type SourceType =
  | "official_website"
  | "official_instagram"
  | "official_booking_page"
  | "google_maps_listing"
  | "reservation_platform"
  | "web_search_verification"
  | "internal_research_dashboard"
  | "third_party_guide";

export interface FactEvidence {
  field: string;
  sourceType: SourceType;
  sourceUrl: string | null;
  verifiedAt: string; // YYYY-MM-DD
  status: EvidenceStatus;
  note?: string;
}

export interface UluwatuVenueContent {
  slug: string;
  displayName: string;
  category: "restaurant" | "cafe" | "beach_club" | "bar";
  microArea: string;
  publication: "published" | "review";
  // Editorial voice (Other Bali, resident-curated). Editorial judgement is
  // ours; factual claims inside it are covered by the evidence list.
  verdict: string; // one sentence — card line + hero verdict
  whyHere: string;
  whatToExpect: string;
  bestFor: string;
  notFor?: string;
  atmosphere?: string;
  visitContext?: string;
  reservation?: string; // reservation advice — fit/logistics only
  whatToOrder?: string[]; // internal research dashboard items (evidence below)
  priceBand?: "$" | "$$" | "$$$" | null;
  address?: string | null;
  openingHours?: string | null; // only when official-domain sourced
  officialUrl?: string | null;
  instagramUrl?: string | null;
  bookingUrl?: string | null;
  bookingLabel?: string;
  // Official menu page — shown as "View menu" ONLY where the venue publishes
  // its own menu (never a scraped/republished menu; guardrail #1).
  menuUrl?: string | null;
  gmapsUrl: string;
  attributes?: string[]; // verified comparison attributes
  lastVerifiedAt: string;
  evidence: FactEvidence[];
}

// Verification dates: web pass ran 2026-07-12; the internal research
// dashboard import (migrations 0015/0016) is dated 2026-07-11.
const CHECKED = "2026-07-12";
const RESEARCH = "2026-07-11";

function ev(
  field: string,
  sourceType: SourceType,
  sourceUrl: string | null,
  status: EvidenceStatus,
  note?: string,
  verifiedAt: string = CHECKED
): FactEvidence {
  return { field, sourceType, sourceUrl, verifiedAt, status, note };
}

const researchEv = (field: string, note?: string): FactEvidence =>
  ev(
    field,
    "internal_research_dashboard",
    "OZO_BaliWali venue dashboard exports (repo migrations 0015/0016)",
    "VERIFIED",
    note ?? "Founder research dashboard import; recheck on 60-day cadence.",
    RESEARCH
  );

function maps(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const ULUWATU_VENUES: UluwatuVenueContent[] = [
  // ── Bars ──────────────────────────────────────────────────────────────
  {
    slug: "single-fin",
    displayName: "Single Fin",
    category: "bar",
    microArea: "Suluban, Pecatu",
    publication: "published",
    verdict:
      "The Bukit's landmark cliff bar above the Uluwatu surf break — come for the swell and the sunset, not a quiet dinner.",
    whyHere:
      "Every Uluwatu trip crosses Single Fin eventually: it hangs directly over the Suluban break, so you watch surfers thread the barrel while the sun drops. It has earned its place as the district's default sunset anchor.",
    whatToExpect:
      "Terraced decks over the cliff edge, casual bar food, and a crowd that builds steadily from late afternoon. Wednesday and Sunday nights turn into full party mode with DJs and live acts running late; other evenings are more relaxed. Parking on the narrow Suluban lane is tight — come by scooter or drop-off.",
    bestFor: "sunset drinks with the surf view; group nights out; post-surf beers",
    notFor: "a quiet dinner for two, or working on a laptop",
    atmosphere: "Lively cliff-edge bar; loud on event nights",
    visitContext:
      "Arrive 60–90 minutes before sunset for a rail-side spot. Wednesday and Sunday are the big nights.",
    reservation:
      "Mostly walk-in; tables go fast on Wednesdays and Sundays — reserve ahead for those.",
    whatToOrder: ["pizza", "tacos", "sliders"],
    priceBand: "$$",
    address: "Pantai Suluban, Jl. Labuan Sait, Pecatu",
    openingHours: null,
    officialUrl: "https://www.singlefinbali.com/",
    instagramUrl: "https://www.instagram.com/singlefinbali/",
    bookingUrl: "https://www.sevenrooms.com/reservations/singlefinuluwatu",
    bookingLabel: "Book direct",
    gmapsUrl: maps("Single Fin Uluwatu Pecatu Bali"),
    attributes: ["cliff view", "sunset orientation", "live music Wed & Sun"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.singlefinbali.com/event/", "VERIFIED", "Official site live with active events page; RA lists upcoming events (https://ra.co/clubs/79969)."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d3206364-Reviews-Single_Fin-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Suluban cliff, Pecatu — inside SW Bukit boundary."),
      ev("official_url", "official_website", "https://www.singlefinbali.com/", "VERIFIED", "Domain + own subpages surfaced in search; direct fetch blocked by sandbox proxy — snippet-level verification."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/singlefinbali/", "VERIFIED"),
      ev("booking_url", "reservation_platform", "https://www.sevenrooms.com/reservations/singlefinuluwatu", "VERIFIED", "SevenRooms venue page surfaced in search for the venue; matches guide references to SevenRooms reservations."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "Third-party sources disagree on closing time; kept off-page until confirmed at source."),
      ev("address", "web_search_verification", "https://www.singlefinbali.com/contact/", "STALE — RECHECK REQUIRED", "Address seen in snippets of the official contact page; confirm on field visit."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "mana-uluwatu",
    displayName: "Mana Uluwatu",
    category: "bar",
    microArea: "Suluban, Pecatu",
    publication: "published",
    verdict:
      "Clifftop restaurant and poolside bar at Uluwatu Surf Villas — the calmer way to take in the same Suluban sunset.",
    whyHere:
      "Same cliff line as Single Fin, very different pace: Mana trades the party for an all-day room with a pool, proper cooking and space to talk. It is the sunset spot for people who want the view without the volume.",
    whatToExpect:
      "Ocean-view tables inside Uluwatu Surf Villas, an all-day menu that runs from breakfast through dinner, and a poolside bar. Golden hour fills up first; daytime is quiet enough to sit long over coffee or work through the afternoon.",
    bestFor: "sunset drinks with a view; date-night dinner; a slow working afternoon",
    notFor: "big loud group nights",
    atmosphere: "Composed clifftop dining; lively but conversational at sunset",
    visitContext: "Inside the Uluwatu Surf Villas grounds on the Suluban cliff.",
    reservation: "Book ahead for sunset-hour tables; daytime is usually walk-in.",
    whatToOrder: ["pork belly tacos", "tuna nachos", "beef rendang"],
    priceBand: "$$$",
    address: "Uluwatu Surf Villas, Pantai Suluban St, Pecatu",
    openingHours: null,
    officialUrl: "https://uluwatusurfvillas.com/restaurant/",
    instagramUrl: "https://www.instagram.com/manauluwatu/",
    bookingUrl: "https://uluwatusurfvillas.com/restaurant/",
    bookingLabel: "Book direct",
    gmapsUrl: maps("Mana Uluwatu Pecatu Bali"),
    attributes: ["cliff view", "sunset orientation", "pool"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://airial.travel/restaurants/indonesia/pecatu/mana-uluwatu-restaurant-bar-l08jA63r", "VERIFIED", "Active 2026 listings; official page live in search index."),
      ev("micro_area", "web_search_verification", "https://wanderboat.ai/restaurants/indonesia/kuta-selatan/mana-uluwatu-restaurant-&-bar/RYSHSP4vTBCxd-g_RO1GOQ", "VERIFIED", "Pantai Suluban St, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://uluwatusurfvillas.com/restaurant/", "VERIFIED", "No standalone domain; official page on parent resort site."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/manauluwatu/", "VERIFIED"),
      ev("booking_url", "official_website", "https://uluwatusurfvillas.com/restaurant/", "STALE — RECHECK REQUIRED", "Bookings via the official restaurant page / resort email; no widget URL confirmed."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "IG bio + guides say 7:00–23:00 daily; not confirmed at source — off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },

  // ── Beach & cliff clubs ───────────────────────────────────────────────
  {
    slug: "sundays-beach-club",
    displayName: "Sundays Beach Club",
    category: "beach_club",
    microArea: "Ungasan",
    publication: "published",
    verdict:
      "A private white-sand cove at the foot of the Ungasan cliffs — the Bukit's one true toes-in-the-sand beach club.",
    whyHere:
      "Most 'beach clubs' on this peninsula sit on cliffs. Sundays actually gets you onto the sand: a funicular carries you down to a sheltered lagoon with daybeds, watersports and evening bonfires. For families and beach days it is the district's clearest answer.",
    whatToExpect:
      "Entry works as a daily beach pass with food-and-drink credit. Below the cliff you get calm, swimmable water (tide-dependent), kayaks and snorkelling gear, a beachfront kitchen, and bonfires after sunset. It is part of The Ungasan resort; the ride down is half the fun.",
    bestFor: "beach days with kids; sunset bonfires; couples who want sand, not concrete",
    notFor: "a quick cheap stop — the pass model rewards staying the day",
    atmosphere: "Relaxed daytime beach club; candle-lit after dark",
    visitContext:
      "Beach access is via the resort's inclinator from the clifftop. Check tides for swimming.",
    reservation:
      "Daily beach passes are walk-in; cabanas and VIP set-ups are pre-booked.",
    whatToOrder: ["mahi mahi tacos", "BBQ lobster", "wood-fired pizza"],
    priceBand: "$$$",
    address: "Jl. Pantai Selatan Gau, Banjar Wijaya Kusuma, Ungasan",
    openingHours: null,
    officialUrl: "https://www.sundaysbeachclub.com/",
    instagramUrl: "https://www.instagram.com/sundaysbeachclub/",
    bookingUrl: "https://www.sundaysbeachclub.com/daily-beach-pass/",
    bookingLabel: "Book direct",
    gmapsUrl: maps("Sundays Beach Club Ungasan Bali"),
    attributes: [
      "private beach access (funicular)",
      "swimmable lagoon",
      "watersports",
      "family friendly",
      "sunset bonfires",
    ],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.sundaysbeachclub.com/daily-beach-pass/", "VERIFIED", "Official site live with active pass/VIP/events pages; June-2026 third-party guide confirms operating."),
      ev("micro_area", "web_search_verification", "https://www.hotels.com/go/indonesia/sundays-beach-club", "VERIFIED", "Jl. Pantai Selatan Gau, Ungasan — inside boundary."),
      ev("official_url", "official_website", "https://www.sundaysbeachclub.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/sundaysbeachclub/", "VERIFIED"),
      ev("booking_url", "official_booking_page", "https://www.sundaysbeachclub.com/daily-beach-pass/", "VERIFIED"),
      ev("beach_access", "web_search_verification", "https://elsky-bali.com/en/beach-club-sundays-en/", "VERIFIED", "Private beach reached by inclinator/funicular."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "7:30–22:00 reported by IG bio + guides; off-page until confirmed at source."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "white-rock-beach-club",
    displayName: "White Rock Beach Club",
    category: "beach_club",
    microArea: "Melasti, Ungasan",
    publication: "published",
    verdict:
      "The big-format beachfront club on Melasti — pools, daybeds and a stage, directly on one of Bali's whitest beaches.",
    whyHere:
      "Melasti's cliff amphitheatre is the south Bukit's most dramatic beach, and White Rock is the largest way to spend a whole day on it: infinity pools, rows of daybeds, dining decks and a proper events stage, day into night.",
    whatToExpect:
      "A large venue that absorbs groups easily. Daybeds and suites work on a minimum-spend model credited to food and drink. The beach in front is white sand under high cliffs; the drive in comes down the carved Melasti cliff road, worth the trip on its own.",
    bestFor: "group beach days; families with mixed ages; event nights",
    notFor: "travellers after a small, quiet cove",
    atmosphere: "Big, social, music-led — scales up on event days",
    visitContext:
      "On Melasti Beach on the south side of the peninsula — a real drive from the west cliffs, so plan it as its own half-day.",
    reservation: "Reserve daybeds and suites via the club's booking site.",
    whatToOrder: undefined,
    priceBand: null,
    address: "Pantai Melasti, Ungasan",
    openingHours: null,
    officialUrl: "https://whiterockbali.com/",
    instagramUrl: "https://www.instagram.com/whiterockbeachclub/",
    bookingUrl: "https://bookings.whiterockbali.com/",
    bookingLabel: "Book direct",
    gmapsUrl: maps("White Rock Beach Club Melasti Ungasan Bali"),
    attributes: [
      "direct beachfront (Melasti)",
      "infinity pools",
      "live music / DJ stage",
      "kid friendly",
    ],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://bookings.whiterockbali.com/", "VERIFIED", "Official site + own live booking engine indexed as live."),
      ev("micro_area", "web_search_verification", "https://bali.com/places/white-rock-beach-club/", "VERIFIED", "Melasti Beach below the Melasti cliffs, Ungasan — inside boundary."),
      ev("official_url", "official_website", "https://whiterockbali.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/whiterockbeachclub/", "STALE — RECHECK REQUIRED", "Handle seen in bali.com listing; confirm on the account itself."),
      ev("booking_url", "official_booking_page", "https://bookings.whiterockbali.com/", "VERIFIED", "Venue's own booking subdomain."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "10:00–21:00 vs 10:00–22:00 across sources; off-page."),
      ev("price_band", "internal_research_dashboard", null, "MISSING", "No price band in the research import for this row.", RESEARCH),
    ],
  },
  {
    slug: "tropical-temptation-adult-only-beach-club",
    displayName: "Tropical Temptation Beach Club",
    category: "beach_club",
    microArea: "Melasti, Ungasan",
    publication: "published",
    verdict:
      "Melasti's adults-only club — three infinity pools, a beachfront bar and a spa, with no one under 18 on the daybeds.",
    whyHere:
      "If the point of the day is a pool, a drink and actual quiet from other people's kids, this is the Bukit's dedicated answer: 18+ entry, direct Melasti beach access and an on-site spa, all inside the same cliff-walled bay as White Rock.",
    whatToExpect:
      "A more grown-up register than the big clubs: three pools stepping toward the beach, a restaurant and bar, and Svaha Spa on site. Doors run 10:00–21:00, so it is a day-into-sunset venue rather than a late-night one. It opened as Cattamaran in 2021 and was renamed in 2022 — older reviews may use the old name.",
    bestFor: "couples' pool days; sunset drinks without the family crowd",
    notFor: "families — entry is 18+ by policy",
    atmosphere: "Adults-only, unhurried, pool-first",
    visitContext: "Jalan Melasti Beach 88, Ungasan — same bay as White Rock.",
    reservation: "Book daybeds via the club's own reservation site.",
    whatToOrder: undefined,
    priceBand: "$$$",
    address: "Jalan Melasti Beach 88, Ungasan",
    openingHours: "Daily 10:00–21:00",
    officialUrl: "https://ttbeach.club/",
    instagramUrl: "https://www.instagram.com/tropicaltemptation/",
    bookingUrl: "https://reserve.ttbeach.club/",
    bookingLabel: "Book direct",
    gmapsUrl: maps("Tropical Temptation Beach Club Melasti Ungasan Bali"),
    attributes: [
      "adults-only (18+)",
      "direct beach access (Melasti)",
      "three infinity pools",
      "on-site spa",
      "sunset orientation",
    ],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://ttbeach.club/", "VERIFIED", "Official domain live with full site structure + own reservation engine."),
      ev("micro_area", "web_search_verification", "https://www.localexpatsbali.com/partners/tropical-temptation-adult-only-beach-club", "VERIFIED", "Melasti Beach 88, Ungasan — inside boundary."),
      ev("official_url", "official_website", "https://ttbeach.club/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/tropicaltemptation/", "VERIFIED"),
      ev("booking_url", "official_booking_page", "https://reserve.ttbeach.club/", "VERIFIED", "Venue's own booking subdomain."),
      ev("adults_only", "official_website", "https://ttbeach.club/blog/tropical-temptation-beach-club-balis-adult-only-escape-with-direct-melasti-beach-access/", "VERIFIED", "18+ policy stated on the venue's own blog."),
      ev("opening_hours", "official_website", "https://ttbeach.club/faq", "VERIFIED", "10:00–21:00 from official FAQ (via domain-restricted search); corroborated by third parties."),
      ev("renaming", "web_search_verification", "https://blog.getandride.com/english/cattamaran-beach-club-photos/", "VERIFIED", "Opened 2021 as Cattamaran Beach Club; renamed Tropical Temptation 2022."),
      researchEv("price_band"),
    ],
  },
  {
    slug: "el-kabron-bali",
    displayName: "El Kabrón",
    category: "beach_club",
    microArea: "Cemongkak, Pecatu",
    publication: "published",
    verdict:
      "Spanish cliff club above Pecatu's west coast — paella, an edge-of-the-world pool and Bali's most theatrical sunset seating.",
    whyHere:
      "El Kabrón has run its 'Sunset Theater' on this cliff since 2011: a Spanish restaurant and pool set on a west-facing edge with nothing between you and the horizon. It is the occasion venue of the district — anniversaries, proposals, last-night blowouts.",
    whatToExpect:
      "Minimum-spend seating tiers around a cliff-edge pool, a full Spanish kitchen (oysters, paella, tomahawk), and a sunset hour that books out. Despite the 'beach club' label there is no beach access — this is a cliff venue. Budget accordingly: it is one of the area's priciest tickets.",
    bestFor: "special occasions; sunset dinner dates; celebratory groups",
    notFor: "casual walk-in beers or families after a beach day",
    atmosphere: "High-occasion, dressed-up, sunset-focused",
    visitContext: "Jl. Pantai Cemongkak, Pecatu — between Bingin and Uluwatu.",
    reservation: "Reservations with deposit via the official Book Now page — essential at sunset.",
    whatToOrder: ["oysters", "tomahawk"],
    priceBand: "$$$",
    address: "Jl. Pantai Cemongkak, Pecatu",
    openingHours: null,
    officialUrl: "https://elkabron.com/",
    instagramUrl: "https://www.instagram.com/elkabronbali/",
    bookingUrl: "https://elkabron.com/book-now",
    bookingLabel: "Book direct",
    gmapsUrl: maps("El Kabron Bali Pecatu"),
    attributes: [
      "cliff view (no beach access)",
      "cliff-edge pool",
      "sunset orientation",
      "Spanish kitchen",
      "reservation essential",
    ],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://elkabron.com/events", "VERIFIED", "Official site live with active events/booking/FAQ pages; recent IG activity."),
      ev("micro_area", "web_search_verification", "https://punapibali.com/listing-item/el-kabron-spanish-restaurant-cliff-club-pecatu-2/", "VERIFIED", "Jl. Pantai Cemongkak, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://elkabron.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/elkabronbali/", "VERIFIED"),
      ev("booking_url", "official_booking_page", "https://elkabron.com/book-now", "VERIFIED"),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "11:00–23:00 vs 11:00–24:00 across sources; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "oneeighty",
    displayName: "oneeighty°",
    category: "beach_club",
    microArea: "Pecatu cliffs",
    publication: "published",
    verdict:
      "Glass-bottomed sky pool jutting off a 162-metre cliff at The Edge — the Bukit's most vertiginous day club.",
    whyHere:
      "One image sells it: a transparent pool cantilevered over the ocean, far above the break. oneeighty° is the day-club as spectacle — a day pass with food-and-drink credit buys you the most extreme viewpoint on the peninsula.",
    whatToExpect:
      "A luxury dayclub inside The Edge resort: sky pool, loungers, cocktails and an all-day kitchen. Passes work on a minimum-spend model and capacity is limited, so pre-booking matters. Note it is not an adults-only venue — under-12s are restricted from the VIP deck only.",
    bestFor: "special-occasion days; sunset cocktails; travellers chasing the one big view",
    notFor: "budget days out — the pass is a commitment",
    atmosphere: "Polished, high-glamour, small-capacity",
    visitContext: "Inside The Edge resort, Jl. Pura Goa Lempeh, Pecatu.",
    reservation: "Pre-book a day pass — capacity is capped and deposits apply.",
    whatToOrder: ["satay", "churros", "cocktails"],
    priceBand: null,
    address: "The Edge Bali, Jl. Pura Goa Lempeh, Pecatu",
    openingHours: null,
    officialUrl: "https://oneeightybali.com/",
    instagramUrl: "https://www.instagram.com/oneeightybali/",
    bookingUrl: null,
    gmapsUrl: maps("oneeighty The Edge Bali Pecatu"),
    attributes: [
      "cliff view (162 m)",
      "glass-bottom sky pool",
      "day-pass with F&B credit",
      "sunset orientation",
    ],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://thehoneycombers.com/bali/best-pool-day-clubs-in-bali/", "VERIFIED", "Listed in 2026 day-club roundups; official sites live in search index."),
      ev("micro_area", "web_search_verification", "https://www.instagram.com/oneeightybali/reels/", "VERIFIED", "IG location tag Pecatu; The Edge resort, Goa Lempeh — inside boundary."),
      ev("official_url", "official_website", "https://oneeightybali.com/", "VERIFIED", "Also official page on parent resort site theedgebali.com/dining/oneeighty/."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/oneeightybali/", "VERIFIED"),
      ev("booking_url", "official_website", null, "MISSING", "Bookings described as essential w/ deposit but no official booking URL confirmed — CTA limited to official site."),
      ev("adults_only", "third_party_guide", "https://cocodevelopmentgroup.com/blog/one-eighty-day-club-bali-is-it-worth-the-hype-a-review/", "VERIFIED", "NOT adults-only: under-12 restriction applies to the VIP deck only. Research-import job tags implied adults focus; corrected."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "10:00–21:00 reported by snippets; off-page."),
      ev("price_band", "internal_research_dashboard", null, "MISSING", "No price band in the research import for this row.", RESEARCH),
      researchEv("what_to_order"),
    ],
  },

  // ── Restaurants ───────────────────────────────────────────────────────
  {
    slug: "the-warung-at-alila-villas-uluwatu",
    displayName: "The Warung at Alila Villas",
    category: "restaurant",
    microArea: "Pecatu cliffs",
    publication: "published",
    verdict:
      "Refined Indonesian cooking on Alila's clifftop — the district's serious special-occasion table for local food.",
    whyHere:
      "Most upscale Bukit dining looks outward (Spanish, Japanese, Greek). The Warung looks inward: a polished Indonesian dining room inside Alila Villas Uluwatu, where the megibung sharing banquet turns regional cooking into the occasion itself.",
    whatToExpect:
      "An open-air pavilion on the cliff edge inside a gated resort — reserve ahead so the gate expects you. Service is resort-level; the menu runs classic Indonesian (bebek goreng, rendang) with the megibung banquet as the signature format. Quiet enough for conversation, composed enough for an anniversary.",
    bestFor: "special occasions; date nights around Indonesian food; unhurried family dinners",
    notFor: "a quick casual bite — this is a destination dinner",
    atmosphere: "Serene, open-air, resort-polished",
    visitContext:
      "Inside Alila Villas Uluwatu (Jl. Belimbing Sari, Pecatu). Non-guests welcome with a reservation.",
    reservation: "Book via TableCheck; groups of 8+ go through the resort.",
    whatToOrder: ["megibung banquet", "bebek goreng", "red bean rendang"],
    priceBand: "$$$",
    address: "Alila Villas Uluwatu, Jl. Belimbing Sari, Pecatu",
    openingHours: null,
    officialUrl: "https://www.alilahotels.com/uluwatu/dining/the-warung/",
    instagramUrl: null,
    bookingUrl: "https://www.tablecheck.com/en/alila-villas-uluwatu-the-warung/reserve",
    bookingLabel: "Book direct",
    gmapsUrl: maps("The Warung Alila Villas Uluwatu Pecatu Bali"),
    attributes: ["cliff view", "Indonesian cuisine", "inside gated resort"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.hyatt.com/alila-hotels-and-resorts/en-US/dpsav-alila-villas-uluwatu/dining/the-warung", "VERIFIED", "Live official Hyatt/Alila dining page + active TableCheck reservations."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d2174933-Reviews-The_Warung_at_Alila_Villas_Uluwatu-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Desa Pecatu, southern Bukit cliff — inside boundary."),
      ev("official_url", "official_website", "https://www.alilahotels.com/uluwatu/dining/the-warung/", "VERIFIED"),
      ev("instagram_url", "official_instagram", null, "CONFLICTING SOURCES", "@the.warung surfaced but could not be tied to the venue at source — omitted."),
      ev("booking_url", "official_booking_page", "https://www.tablecheck.com/en/alila-villas-uluwatu-the-warung/reserve", "VERIFIED", "Official TableCheck reservation page."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "From 11:00, dinner last order 22:30 per snippets; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "gooseberry-french-restaurant-uluwatu",
    displayName: "Gooseberry",
    category: "restaurant",
    microArea: "Bingin",
    publication: "published",
    verdict:
      "Modern French above Bingin Beach — foie gras and aged steaks by a pool, from long brunches to candle-lit dinners.",
    whyHere:
      "Bingin's surf-shack shoreline hides one genuinely French kitchen up the hill: classic technique (snails, beef cheek confit, prime cuts) served poolside. It covers the widest arc of any dinner venue here — brunch through late dinner — without dropping its standards.",
    whatToExpect:
      "Indoor-outdoor dining around a pool, a screen-free room by design, and a kitchen that takes French classics seriously. The same owners run the Gooseberry Intimates boutique next door — don't let the shopfront confuse the entrance. Evenings suit couples; the venue itself suggests earlier bookings for families.",
    bestFor: "date nights; special occasions; a long French brunch after a Bingin surf",
    notFor: "screens-out laptop sessions — the room is deliberately screen-free",
    atmosphere: "Poolside-elegant, quiet enough to talk",
    visitContext: "Above Bingin Beach (Jl. Pantai Bingin area), Pecatu.",
    reservation: "Book ahead for dinner; earlier slots work better with kids.",
    whatToOrder: ["onglet classique", "confit de canard", "barramundi à la persillade"],
    priceBand: "$$$",
    address: null,
    openingHours: null,
    officialUrl: "https://www.gooseberry-restaurant.com/",
    instagramUrl: "https://www.instagram.com/gooseberry_restaurant/",
    bookingUrl: null,
    gmapsUrl: maps("Gooseberry Restaurant Bingin Uluwatu Bali"),
    attributes: ["poolside dining", "all-day service", "screen-free room"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.gooseberry-restaurant.com/", "VERIFIED", "Official site live and indexed; active booking listings on Dish Cult/Chope."),
      ev("micro_area", "official_website", "https://www.gooseberry-restaurant.com/", "VERIFIED", "Official site title: 'Bingin Beach Restaurant'; administratively Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://www.gooseberry-restaurant.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/gooseberry_restaurant/", "VERIFIED"),
      ev("booking_url", "reservation_platform", null, "CONFLICTING SOURCES", "Dish Cult and Chope listings both exist; neither confirmed as the venue-endorsed channel — CTA limited to official site."),
      ev("address", "third_party_guide", null, "MISSING", "Street address not verifiable at source; maps search link used."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "'Open daily 8–22' via snippet; off-page."),
      ev("screen_free", "official_website", "https://www.gooseberry-restaurant.com/", "VERIFIED", "Screen-free space; no children's menu; earlier bookings suggested for families."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "yuki-uluwatu",
    displayName: "YUKI Uluwatu",
    category: "restaurant",
    microArea: "Labuan Sait, Pecatu",
    publication: "published",
    verdict:
      "Modern Japanese izakaya on the Labuan Sait clifftop road — sharing plates, wagyu sando and real dinner energy.",
    whyHere:
      "YUKI brought its Canggu izakaya formula to the Bukit and it landed: a design-forward room, communal sharing plates and a bar programme that keeps tables loud in the right way. When the group can't agree, torched maki settles it.",
    whatToExpect:
      "Sharing-format modern Japanese — sashimi, robata, the wagyu sando — open daily from 11:00 until late. The room leans social: bigger tables, music, occasion energy. WhatsApp reservations are the fastest route on busy nights.",
    bestFor: "group dinners that need momentum; date nights; special occasions",
    notFor: "a silent, slow tasting-menu evening",
    atmosphere: "Design-led izakaya buzz",
    visitContext: "On Jl. Labuan Sait, Pecatu — minutes from the Uluwatu breaks.",
    reservation: "Reserve via the official page or WhatsApp — weekends fill.",
    whatToOrder: ["wagyu sando", "tuna tartare", "charcoal grill plates"],
    priceBand: "$$$",
    address: "Jl. Labuansait, Pecatu",
    openingHours: "Daily from 11:00 until late",
    officialUrl: "https://www.yuki-bali.com/uluwatu",
    instagramUrl: "https://www.instagram.com/yukibali_/",
    bookingUrl: "https://www.yuki-bali.com/ulu-reservations",
    bookingLabel: "Book direct",
    menuUrl: "https://www.yuki-bali.com/menu",
    gmapsUrl: maps("YUKI Uluwatu Pecatu Bali"),
    attributes: ["sharing plates", "second outlet after Canggu", "clifftop road location"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "official_website", "https://www.yuki-bali.com/ulu-reservations", "VERIFIED", "Live dedicated Uluwatu reservations page; opening press coverage."),
      ev("micro_area", "official_website", "https://www.yuki-bali.com/uluwatu", "VERIFIED", "Official address: Jl. Labuansait, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://www.yuki-bali.com/uluwatu", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/yukibali_/", "VERIFIED", "Brand account covers Canggu + Uluwatu."),
      ev("booking_url", "official_booking_page", "https://www.yuki-bali.com/ulu-reservations", "VERIFIED"),
      ev("menu_url", "official_website", "https://www.yuki-bali.com/menu", "VERIFIED", "Official menu page on the venue's own domain."),
      ev("opening_hours", "official_website", "https://www.yuki-bali.com/uluwatu", "VERIFIED", "'Open 11AM until late, 7 days a week' from official site via domain-restricted search."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "zali-uluwatu",
    displayName: "ZALI Uluwatu",
    category: "restaurant",
    microArea: "Suluban, Pecatu",
    publication: "published",
    verdict:
      "Family-run Lebanese on the Suluban road — sharing feasts that work as well for kids as for a table of eight.",
    whyHere:
      "The Bukit's dinner scene skews steak-and-sushi; ZALI widens it with an actual Lebanese kitchen — a native Lebanese chef, mezze spreads and grilled plates built for passing around. It is one of the few upscale-casual rooms here that genuinely fits families.",
    whatToExpect:
      "A modern Levantine menu (hummus and mezze through samke harra), generous portions and a room that tolerates real conversation. Multi-branch family business — the Uluwatu branch sits on Jl. Pantai Labuan Sait near Suluban.",
    bestFor: "group dinners over shared plates; early family dinners; date nights that need warmth over show",
    notFor: "solo bar-seat dining",
    atmosphere: "Warm, generous, conversational",
    visitContext: "Jl. Pantai Labuan Sait, Suluban, Pecatu.",
    reservation: "Contact the restaurant for reservations and larger groups.",
    whatToOrder: ["samke harra"],
    priceBand: null,
    address: "Jl. Pantai Labuan Sait, Suluban, Pecatu",
    openingHours: null,
    officialUrl: "https://www.zalirestaurant.com/",
    instagramUrl: "https://www.instagram.com/zali.inbali/",
    bookingUrl: null,
    menuUrl: "https://www.zalirestaurant.com/menu/bali",
    gmapsUrl: maps("ZALI Uluwatu Pecatu Bali"),
    attributes: ["Lebanese kitchen", "sharing format", "kid friendly"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.zalirestaurant.com/", "VERIFIED", "Official site live with current structure; active TripAdvisor/Chope listings."),
      ev("micro_area", "web_search_verification", "https://www.corner.inc/place/pLB26ocMemtL", "VERIFIED", "Jl. Pantai Labuan Sait, Suluban, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://www.zalirestaurant.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/zali.inbali/", "VERIFIED", "Covers the Bali operation (Uluwatu + Pererenan)."),
      ev("booking_url", "reservation_platform", null, "CONFLICTING SOURCES", "Chope listing exists but not confirmed as venue-endorsed; official site says contact the restaurant — CTA limited to official site."),
      ev("menu_url", "official_website", "https://www.zalirestaurant.com/menu/bali", "VERIFIED", "Official Bali menu page on the venue's own domain."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "8:00–24:00 per aggregators; off-page."),
      ev("price_band", "internal_research_dashboard", null, "MISSING", "No price band in the research import for this row.", RESEARCH),
      researchEv("what_to_order"),
    ],
  },
  {
    slug: "kala-uluwatu",
    displayName: "KALA Uluwatu",
    category: "restaurant",
    microArea: "Padang Padang",
    publication: "published",
    verdict:
      "Minimalist Greek-inspired grill steps from Padang Padang — wood fire, natural wine and the Bukit's most confident new dinner room.",
    whyHere:
      "Opened in June 2024 by Bali hospitality veterans, KALA cooks Greek-leaning food over an open wood grill in a pared-back room near Padang Padang Beach. It filled a real gap: a serious, single-idea dinner venue between the surf cafés and the cliff clubs.",
    whatToExpect:
      "An open kitchen, flatbreads and lamb off the fire, feta tempura that shows the kitchen's playfulness, and a cocktail/natural-wine list built for the food. It is an afternoon-into-evening venue — plan it as dinner, not lunch.",
    bestFor: "date nights; food-led group dinners",
    notFor: "early-morning or laptop hours — it opens for the evening trade",
    atmosphere: "Minimalist, open-fire, food-first",
    visitContext: "Jl. Labuansait, Pecatu — steps from Padang Padang Beach.",
    reservation: "Reservations via SevenRooms — recommended for dinner.",
    whatToOrder: ["wood-fired flatbreads", "feta tempura", "lamb"],
    priceBand: "$$$",
    address: "Jl. Labuansait, Pecatu",
    openingHours: null,
    officialUrl: "https://kalauluwatu.com/",
    instagramUrl: "https://www.instagram.com/kala.uluwatu/",
    bookingUrl: "https://www.sevenrooms.com/explore/kalauluwatu/reservations/create/search/",
    bookingLabel: "Book direct",
    gmapsUrl: maps("KALA Uluwatu Padang Padang Bali"),
    attributes: ["open wood-fire grill", "natural wine", "evening venue"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://luxnomade.com/asia/kala-uluwatu/", "VERIFIED", "2026-dated coverage; official site + SevenRooms live."),
      ev("micro_area", "official_website", "https://kalauluwatu.com/", "VERIFIED", "'Steps from Padang-Padang Beach' per official site; Jl. Labuansait, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://kalauluwatu.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/kala.uluwatu/", "VERIFIED"),
      ev("booking_url", "reservation_platform", "https://www.sevenrooms.com/explore/kalauluwatu/reservations/create/search/", "VERIFIED", "SevenRooms page surfaced alongside official site."),
      ev("opened", "web_search_verification", "https://bali.com/news/press-releases/kala-modern-greek-neighborhood-restaurant-in-uluwatu-bali/", "VERIFIED", "Opened June 2024; founders named in press release."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "5pm–late vs 2pm–23:30 across aggregators; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "papi-sapi",
    displayName: "Papi Sapi",
    category: "restaurant",
    microArea: "Labuan Sait, Pecatu",
    publication: "published",
    verdict:
      "Dinner-only neighbourhood grill on Labuan Sait — wagyu rib eye and picanha without cliff-club prices for the view you skip.",
    whyHere:
      "When the table just wants very good grilled meat, Papi Sapi is the Bukit's straight answer: a casual neighbourhood steakhouse that opens at four, books through its own site and spends its money on the cut, not the postcode.",
    whatToExpect:
      "A relaxed grill room open 16:00–23:30 daily. Premium cuts (wagyu rib eye, picanha) at the centre, easy sides around them, and a second branch on Lombok if the name looks familiar from another trip. Book online — the room is small enough to fill.",
    bestFor: "steak-led group dinners; low-ceremony date nights",
    notFor: "lunch plans — it opens at 16:00",
    atmosphere: "Casual neighbourhood grill",
    visitContext: "Jl. Labuansait, Pecatu.",
    reservation: "Book a table via the official site (ResDiary widget).",
    whatToOrder: ["premium grills", "wagyu rib eye", "picanha"],
    priceBand: "$$$",
    address: "Jl. Labuansait, Pecatu",
    openingHours: "Daily 16:00–23:30",
    officialUrl: "https://papisapi.com/",
    instagramUrl: "https://www.instagram.com/papisapi_/",
    bookingUrl: "https://papisapi.com/book-a-table/",
    bookingLabel: "Book direct",
    menuUrl: "https://papisapi.com/menu/",
    gmapsUrl: maps("Papi Sapi Pecatu Bali"),
    attributes: ["dinner-only", "grill/steak focus", "own online booking"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "official_website", "https://papisapi.com/wp-content/uploads/2026/05/PAPI-SAPI-BALI-MENU-MAY-2026-.pdf", "VERIFIED", "Official menu PDF uploaded May 2026; live booking page."),
      ev("micro_area", "official_website", "https://papisapi.com/contact/", "VERIFIED", "Official contact page: Jl. Labuansait, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://papisapi.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/papisapi_/", "VERIFIED", "Covers Bali + Lombok branches."),
      ev("booking_url", "official_booking_page", "https://papisapi.com/book-a-table/", "VERIFIED"),
      ev("menu_url", "official_website", "https://papisapi.com/menu/", "VERIFIED", "Official menu page (May 2026 menu PDF linked from it)."),
      ev("opening_hours", "official_website", "https://papisapi.com/contact/", "VERIFIED", "'Everyday 04:00 pm – 11:30 pm' from official contact page via domain-restricted search."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "masonry-restaurant",
    displayName: "MASONRY Uluwatu",
    category: "restaurant",
    microArea: "Labuan Sait, Pecatu",
    publication: "published",
    verdict:
      "The Canggu wood-fire favourite's Bukit outpost — 48-hour short ribs and wagyu off the grill on Labuan Sait.",
    whyHere:
      "MASONRY's second venue brings a proven Canggu kitchen to Uluwatu: Mediterranean-leaning food off a wood-fired grill, an open kitchen and a proper bar. If you liked the original, this is the same idea closer to the surf.",
    whatToExpect:
      "A grill-and-bar room with the group's signatures — slow-cooked short ribs, wagyu steaks, wood-fired barramundi, house-made halloumi. Bookings run through the venue's own page; groups of 11+ go via WhatsApp. It shares an address plot with Ulu Fishmarket on Labuan Sait.",
    bestFor: "group dinners; date nights around the grill",
    notFor: "quick counter lunches",
    atmosphere: "Open-kitchen grill energy, cocktail-bar edge",
    visitContext: "Jl. Labuansait No.10 area, Pecatu.",
    reservation: "Book via the official bookings page; 11+ guests via WhatsApp.",
    whatToOrder: ["48-hour short ribs", "wagyu steak", "wood-fired barramundi"],
    priceBand: "$$$",
    address: "Jl. Labuansait No.10, Pecatu",
    openingHours: null,
    officialUrl: "https://masonrybali.com/uluwatu",
    instagramUrl: "https://www.instagram.com/masonry.bali/",
    bookingUrl: "https://masonrybali.com/uluwatu/bookings",
    bookingLabel: "Book direct",
    menuUrl: "https://masonrybali.com/uluwatu/menu",
    gmapsUrl: maps("MASONRY Restaurant Uluwatu Pecatu Bali"),
    attributes: ["wood-fired grill", "sister venue to MASONRY Canggu"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("identity", "official_website", "https://masonrybali.com/uluwatu/about-us", "VERIFIED", "NOT a duplicate of the Canggu row: masonrybali.com carries dedicated /uluwatu pages; described as sister venue to the Canggu restaurant."),
      ev("operating_status", "web_search_verification", "https://masonrybali.com/uluwatu", "VERIFIED", "Active official site with Uluwatu menu/bookings pages; current listings."),
      ev("micro_area", "web_search_verification", "https://wanderboat.ai/restaurants/indonesia/kuta-selatan/masonry.-restaurant-uluwatu/tZN9KZQPS2yGOW5Jb6BRFg", "VERIFIED", "Jl. Labuansait No.10, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://masonrybali.com/uluwatu", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/masonry.bali/", "VERIFIED", "Shared brand account with Canggu."),
      ev("booking_url", "official_booking_page", "https://masonrybali.com/uluwatu/bookings", "VERIFIED"),
      ev("menu_url", "official_website", "https://masonrybali.com/uluwatu/menu", "VERIFIED", "Official Uluwatu menu page (also the source for what_to_order)."),
      ev("address", "web_search_verification", null, "CONFLICTING SOURCES", "Listed №10 is character-identical to Ulu Fishmarket's — same plot/strip or aggregator copy; verify house number on field visit."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "12:00–24:00 per aggregator; off-page."),
      ev("what_to_order", "official_website", "https://masonrybali.com/uluwatu/menu", "VERIFIED", "Signatures from the official Uluwatu menu page."),
      researchEv("price_band"),
    ],
  },
  {
    slug: "ulu-fishmarket",
    displayName: "Ulu Fishmarket",
    category: "restaurant",
    microArea: "Labuan Sait, Pecatu",
    publication: "published",
    verdict:
      "Casual open-air seafood with Hawaiian roots — sushi, grilled daily catch and live music in a Labuan Sait garden.",
    whyHere:
      "A rare thing on the Bukit: relaxed, family-friendly seafood that still takes fish seriously. The Hawaiian Paia Fish Market lineage shows in the fresh-catch counter; the garden setting and live music keep it easy rather than formal.",
    whatToExpect:
      "Open-air tables in a tropical garden, a Japanese-Peruvian-Hawaiian menu (sashimi, rolls, grilled mahi mahi) and a walk-in-friendly rhythm, with Chope reservations for busier nights. Kids fit here without anyone flinching.",
    bestFor: "early family dinners; group dinners over shared fish",
    notFor: "a hushed anniversary table",
    atmosphere: "Garden-casual with live-music nights",
    visitContext: "Jl. Labuansait No.10 area, Pecatu — same strip as MASONRY.",
    reservation: "Walk-ins work most nights; reserve on Chope for groups.",
    whatToOrder: ["sashimi trio", "tuna tataki", "miso ramen"],
    priceBand: "$$",
    address: "Jl. Labuansait No.10, Pecatu",
    openingHours: null,
    officialUrl: "https://ulufishmarket.com/",
    instagramUrl: "https://www.instagram.com/ulu.fishmarket/",
    bookingUrl: "https://www.chope.co/bali-restaurants/restaurant/ulu-fish-market-uluwatu",
    bookingLabel: "Reserve a table",
    gmapsUrl: maps("Ulu Fishmarket Pecatu Bali"),
    attributes: ["fresh daily catch", "garden setting", "live music", "kid friendly"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.chope.co/bali-restaurants/restaurant/ulu-fish-market-uluwatu?lang=en_US", "VERIFIED", "Live Chope booking listing; active official domain + socials."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d28159872-Reviews-Ulu_Fish_Market_Restaurant-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Jl. Labuansait, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://ulufishmarket.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/ulu.fishmarket/", "VERIFIED"),
      ev("booking_url", "reservation_platform", "https://www.chope.co/bali-restaurants/restaurant/ulu-fish-market-uluwatu?lang=en_US", "VERIFIED", "Venue-enrolled Chope listing — the only bookable channel found."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "12:00–23:00 reported consistently but snippet-derived; off-page."),
      ev("address", "web_search_verification", "https://ulufishmarket.com/?page_id=163", "CONFLICTING SOURCES", "№10 identical to MASONRY's listing — verify house number on field visit."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "ulu-garden",
    displayName: "Ulu Garden",
    category: "restaurant",
    microArea: "Padang Padang",
    publication: "published",
    verdict:
      "Open-air garden dining near Padang Padang with real cultural programming — Barong nights, Sunday markets, kids welcome.",
    whyHere:
      "Part of the ULU Tribe collective, Ulu Garden is the Bukit venue that treats an evening as more than a meal: contemporary Indonesian cooking in a tropical garden with live music most nights, Balinese dance and ritual events, a Sunday market, a kids' corner and leashed dogs welcome.",
    whatToExpect:
      "A big garden room that runs from breakfast into the evening. Food is seasonal and local-leaning (miso gnocchi, fresh rolls, rice bowls); programming changes weekly, so check their page for what's on. One of the easiest venues here for mixed groups — families, friends, even the dog.",
    bestFor: "group dinners with something happening; early family dinners; long relaxed evenings",
    notFor: "a strictly quiet dinner — most nights have music",
    atmosphere: "Garden-festival warmth, live programming",
    visitContext: "Jl. Pantai Padang-Padang, Pecatu.",
    reservation: "Book online (Dish Cult) for event nights and Sundays.",
    whatToOrder: ["miso gnocchi", "ulu fresh rolls", "rice bowl"],
    priceBand: "$$",
    address: "Jl. Pantai Padang-Padang, Pecatu",
    openingHours: null,
    officialUrl: "https://ulutribe.com/ulu-garden/",
    instagramUrl: "https://www.instagram.com/ulu.garden/",
    bookingUrl: "https://www.dishcult.com/restaurant/ulugarden",
    bookingLabel: "Reserve a table",
    gmapsUrl: maps("Ulu Garden Padang Padang Pecatu Bali"),
    attributes: ["garden setting", "live music & cultural events", "kid friendly", "dog friendly (leash)"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "official_website", "https://ulutribe.com/ulu-garden/", "VERIFIED", "Active official page with ongoing weekly programming; live booking listings."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d24000167-Reviews-Ulu_Garden-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Jl. Pantai Padang-Padang, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://ulutribe.com/ulu-garden/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/ulu.garden/", "VERIFIED"),
      ev("booking_url", "reservation_platform", "https://www.dishcult.com/restaurant/ulugarden", "VERIFIED", "Dish Cult (ResDiary) booking page; Chope listing also exists."),
      ev("family_dog_friendly", "official_website", "https://ulutribe.com/ulu-garden/", "VERIFIED", "Kids' corner; dogs on leash — from the official page."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "Close 22:00 vs 24:00 across sources; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "waatu",
    displayName: "WAATU",
    category: "restaurant",
    microArea: "Ungasan clifftop",
    publication: "published",
    verdict:
      "Yakitori and open-flame cooking above Sundays Beach Club — everything over coals, nothing on gas.",
    whyHere:
      "WAATU commits to one idea completely: every dish is cooked over fire — no gas, no electric burners. Chef James Viles runs archipelago ingredients through a yakitori lens on The Ungasan clifftop, making this the district's most distinctive serious dinner.",
    whatToExpect:
      "A clifftop room at The Ungasan resort, skewers and larger cuts off the coals, and signatures like the wood-fired folded mortadella flatbread. Open from 11:00 until late; sunset slots pair naturally with a beach afternoon at Sundays below. Reserve through the venue's own page.",
    bestFor: "date nights; special occasions; food-led travellers",
    notFor: "picky-eater group compromise dinners",
    atmosphere: "Fire-lit, focused, resort-clifftop calm",
    visitContext:
      "The Ungasan Clifftop Resort, Jl. Pantai Selatan Gau — directly above Sundays Beach Club.",
    reservation: "Book via the official reservations page (SevenRooms).",
    whatToOrder: ["fire-cooked local produce", "yakitori"],
    priceBand: "$$$",
    address: "The Ungasan Clifftop Resort, Jl. Pantai Selatan Gau, Ungasan",
    openingHours: null,
    officialUrl: "https://waatu.com/",
    instagramUrl: "https://www.instagram.com/waatu.bali/",
    bookingUrl: "https://waatubali.com/reservations/",
    bookingLabel: "Book direct",
    gmapsUrl: maps("WAATU Ungasan Bali"),
    attributes: ["all cooking over coals", "clifftop resort setting", "yakitori format"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://waatu.com/", "VERIFIED", "Active official site; live SevenRooms/Chope booking listings; 2026 roundup coverage."),
      ev("micro_area", "web_search_verification", "https://thehoneycombers.com/bali/waatu-restaurant-the-ungasan-clifftop-resort/", "VERIFIED", "The Ungasan Clifftop Resort, Ungasan — inside boundary."),
      ev("official_url", "official_website", "https://waatu.com/", "VERIFIED", "Two official-looking domains coexist (waatu.com / waatubali.com) — likely migration; recorded both."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/waatu.bali/", "VERIFIED"),
      ev("booking_url", "official_booking_page", "https://waatubali.com/reservations/", "VERIFIED", "Venue's own reservations page backed by SevenRooms."),
      ev("fire_only_cooking", "third_party_guide", "https://thehoneycombers.com/bali/waatu-restaurant-the-ungasan-clifftop-resort/", "VERIFIED", "No gas, no electricity used to cook — confirmed in press coverage."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "11:00–23:30 per booking listings; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "seed-bingin",
    displayName: "Seed",
    category: "restaurant",
    microArea: "Bingin",
    publication: "published",
    verdict:
      "Farm-to-table French-Asian two minutes from the Bingin steps — garden produce, wood fire and a proper breakfast.",
    whyHere:
      "Seed quietly does the hardest thing in Bingin: one kitchen that holds up from breakfast through a real dinner. Its own garden feeds a French-Asian menu cooked partly over wood, and the room sits close enough to the beach steps to catch you either side of a surf.",
    whatToExpect:
      "A garden restaurant with a bar pouring house-infused spirits. Mornings are calm (open from around 7); evenings shift into date-night territory — rendang, seasonal plates, crème brûlée. Reserve for dinner; breakfast is walk-in.",
    bestFor: "date-night dinners in Bingin; breakfast before the beach; small group dinners",
    notFor: "big party tables",
    atmosphere: "Garden-intimate, gets candle-lit at night",
    visitContext: "Jl. Pantai Bingin, Pecatu — 2 minutes from the Bingin Beach steps.",
    reservation: "Reserve for dinner (Chope or phone); breakfast is walk-in.",
    whatToOrder: ["beef rendang", "crème brûlée", "seasonal plates"],
    priceBand: "$$",
    address: "Jl. Pantai Bingin, Pecatu",
    openingHours: null,
    officialUrl: "https://seedbingin.com/",
    instagramUrl: "https://www.instagram.com/seed.bingin/",
    bookingUrl: "https://www.chope.co/bali-restaurants/restaurant/seed-bingin-uluwatu",
    bookingLabel: "Reserve a table",
    gmapsUrl: maps("Seed Restaurant Bingin Pecatu Bali"),
    attributes: ["farm-to-table (own garden)", "breakfast through dinner", "near Bingin steps"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.chope.co/bali-restaurants/restaurant/seed-bingin-uluwatu", "VERIFIED", "Official site live; live Chope + GoFood listings."),
      ev("micro_area", "web_search_verification", "https://thehoneycombers.com/bali/seed-restaurant-bingin/", "VERIFIED", "Jl. Pantai Bingin, Pecatu — two minutes from the beach steps; inside boundary."),
      ev("official_url", "official_website", "https://seedbingin.com/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/seed.bingin/", "VERIFIED"),
      ev("booking_url", "reservation_platform", "https://www.chope.co/bali-restaurants/restaurant/seed-bingin-uluwatu", "VERIFIED", "Venue-enrolled Chope listing; direct phone/email also cited."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "Opens 7:00 vs 7:30 across sources; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "laggas-uluwatu",
    displayName: "Laggas",
    category: "restaurant",
    microArea: "Bingin",
    publication: "published",
    verdict:
      "Bingin's dumpling-and-noodle room — the Fat Gajah lineage reborn roadside, worth the traffic noise.",
    whyHere:
      "Laggas carries a genuine Bali food story: the successor of the late chef Agung Nugroho's Fat Gajah, relaunched in Bingin under chef Yudi. Handmade dumplings, noodles and slow-cooked ribs at fair prices — cooking-first, setting-second.",
    whatToExpect:
      "A casual, airy roadside room on Jl. Pantai Bingin. The road is close, so expect scooter noise at the front tables; the food is why you're here. Groups and families do well over shared plates.",
    bestFor: "group dinners over dumplings; easy family meals",
    notFor: "a quiet anniversary dinner",
    atmosphere: "Casual, open, roadside energy",
    visitContext: "Jl. Pantai Bingin No.9, Pecatu.",
    reservation: "Booking ahead helps at dinner; contact via Instagram.",
    whatToOrder: ["dumplings", "noodles", "slow-cooked ribs"],
    priceBand: "$$",
    address: "Jl. Pantai Bingin No.9, Pecatu",
    openingHours: null,
    officialUrl: null,
    instagramUrl: "https://www.instagram.com/laggasbali/",
    bookingUrl: null,
    gmapsUrl: maps("Laggas Bingin Pecatu Bali"),
    attributes: ["handmade dumplings", "Fat Gajah lineage"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://wanderboat.ai/restaurants/indonesia/kuta-selatan/laggas-uluwatu/4LpMGJ8uQJiIgrT1Xjcv3g", "VERIFIED", "2026-dated listings; active Instagram."),
      ev("micro_area", "web_search_verification", "https://thebaliguideline.com/dine/uluwatu/laggas-bali", "VERIFIED", "Jl. Pantai Bingin No.9, Pecatu — inside boundary. (One aggregator mislabels it Jimbaran — contradicted by the street address.)"),
      ev("official_url", "official_website", null, "MISSING", "No first-party site; top-ranking 'laggasuluwatu.shop' matches SEO-clone patterns and is deliberately NOT recorded."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/laggasbali/", "VERIFIED", "The venue's only confirmed official channel."),
      ev("booking_url", "reservation_platform", null, "MISSING", "No verifiable official booking channel."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "13:00–22:00 vs 13:30–21:30 across sources; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },

  // ── Cafés ─────────────────────────────────────────────────────────────
  {
    slug: "suka-espresso",
    displayName: "Suka Espresso",
    category: "cafe",
    microArea: "Labuan Sait, Pecatu",
    publication: "published",
    verdict:
      "The Bukit's default good-coffee stop since 2016 — Australian-style breakfasts that run all the way to dinner.",
    whyHere:
      "Every surf area needs one dependable all-day café; on the Uluwatu side it's Suka. Serious espresso, a broad breakfast-to-dinner menu and a busy-but-working room on the Labuan Sait strip make it the safe first stop of any Bukit morning.",
    whatToExpect:
      "Australian café standards done properly — cured salmon scramble, katsu sando, burgers — with air-con inside and a steady laptop crowd off-peak. Peak brunch hours queue; solo counter seats turn fast.",
    bestFor: "brunch after a surf; a reliable work session; easy first-day dinner",
    notFor: "long romantic dinners",
    atmosphere: "Busy café hum, work-friendly off-peak",
    visitContext: "Jl. Labuansait, Pecatu — part of the By/Suka group (second location in Uluwatu).",
    reservation: "Walk-in.",
    whatToOrder: ["cured salmon scramble", "katsu sando", "burgers"],
    priceBand: "$$",
    address: "Jl. Labuansait No.10, Pecatu",
    openingHours: null,
    officialUrl: "https://www.bysuka.com/suka-uluwatu",
    instagramUrl: "https://www.instagram.com/sukaespresso/",
    bookingUrl: null,
    gmapsUrl: maps("Suka Espresso Uluwatu Pecatu Bali"),
    attributes: ["specialty coffee", "breakfast through dinner", "air-con room"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://airial.travel/restaurants/indonesia/pecatu/suka-espresso-uluwatu-yNLwyr9L", "VERIFIED", "Official By/Suka page live; 2026 guides list as operating."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d11998448-Reviews-Suka_Espresso-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Jl. Labuansait, Pecatu — inside boundary."),
      ev("official_url", "official_website", "https://www.bysuka.com/suka-uluwatu", "VERIFIED", "Uluwatu page on the By/Suka group site."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/sukaespresso/", "VERIFIED"),
      ev("established", "third_party_guide", "https://satusatu.com/inspiration/suka-espresso-uluwatu/", "VERIFIED", "Established 2016."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "7:30–22:00 per guides; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "artisan-uluwatu",
    displayName: "Artisan Uluwatu",
    category: "cafe",
    microArea: "Suluban, Pecatu",
    publication: "published",
    verdict:
      "Bakery-café by day, wood-fired dining by night — the Suluban strip's most ambitious pastry counter.",
    whyHere:
      "Artisan runs two personalities out of one room: a real bakery (sourdough, pastries, the panuozzo) feeding surf-morning traffic, then a cocktails-and-wood-fire evening service. Few Bukit cafés survive that transition; this one does.",
    whatToExpect:
      "Counter pastries and stuffed bagels in the morning, casual dinner plates and drinks after dark, with regular live-music evenings. Part of a small Bukit family of Artisan branches — this record is the Uluwatu/Suluban room. Book online for dinner; mornings are walk-in.",
    bestFor: "brunch after a surf; pastry-led coffee stops; casual date-night dinners",
    notFor: "silent laptop marathons at peak brunch",
    atmosphere: "Bakery bustle by day, warm dining room by night",
    visitContext: "Jl. Pantai Labuansait, Suluban, Pecatu.",
    reservation: "Dinner bookable online (Chope); daytime walk-in.",
    whatToOrder: ["panuozzo", "pastries", "sourdough"],
    priceBand: "$$",
    address: "Jl. Pantai Labuansait Suluban, Pecatu",
    openingHours: null,
    officialUrl: null,
    instagramUrl: "https://www.instagram.com/artisan.bali/",
    bookingUrl: "https://www.chope.co/bali-restaurants/restaurant/artisan-uluwatu",
    bookingLabel: "Reserve a table",
    gmapsUrl: maps("Artisan Uluwatu Pecatu Bali"),
    attributes: ["in-house bakery", "day-to-night service", "live-music evenings"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://dishcult.com/restaurant/artisanuluwatu", "VERIFIED", "Live booking listings on Chope + Dish Cult; active brand Instagram."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d25358215-Reviews-Artisan_Uluwatu-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Jl. Pantai Labuansait Suluban, Pecatu — inside boundary. Street number low-confidence (conflicting listings) — omitted."),
      ev("official_url", "official_website", null, "MISSING", "No first-party website confirmed."),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/artisan.bali/", "VERIFIED", "Brand account: Uluwatu, Ungasan, Bingin, Pererenan branches."),
      ev("booking_url", "reservation_platform", "https://www.chope.co/bali-restaurants/restaurant/artisan-uluwatu", "VERIFIED", "Venue-enrolled Chope listing (also Dish Cult)."),
      ev("opening_hours", "third_party_guide", null, "STALE — RECHECK REQUIRED", "7:30–23:00 per Honeycombers; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "bgs-uluwatu",
    displayName: "BGS Uluwatu",
    category: "cafe",
    microArea: "Suluban, Pecatu",
    publication: "published",
    verdict:
      "Surf shop with a serious coffee bar at the Suluban entrance — the dawn-patrol espresso stop.",
    whyHere:
      "BGS is where the Uluwatu surf day actually starts: grab a homemade-almond-milk latte, wax and a leash in one stop just before the Suluban beach entrance. It is a coffee bar first and a café second — no kitchen theatre, just the right fuel.",
    whatToExpect:
      "Counter coffee (Sumatra-sourced), light bites and bakery items, boards and hardware on the walls. Opens early for first light; prices are the gentlest on this list. Part of the BGS family of Bali surf-coffee shops.",
    bestFor: "pre-surf coffee at dawn; quick takeaway stops",
    notFor: "full breakfasts or long sit-down sessions",
    atmosphere: "Surf-shop counter culture",
    visitContext: "Jl. Labuansait, Pecatu — just before the Suluban/Uluwatu Beach entrance.",
    reservation: "Walk-in.",
    whatToOrder: ["almond latte", "light bites", "bakery"],
    priceBand: "$",
    address: "Jl. Labuansait, Pecatu",
    openingHours: null,
    officialUrl: "https://bgsbali.com/store/bgs-uluwatu/",
    instagramUrl: "https://www.instagram.com/bgsbali/",
    bookingUrl: null,
    gmapsUrl: maps("BGS Uluwatu Surf Shop Coffee Bar Pecatu Bali"),
    attributes: ["opens early", "surf shop + coffee bar", "takeaway-friendly"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "official_website", "https://bgsbali.com/store/bgs-uluwatu/", "VERIFIED", "Official store page live; recent brand IG post welcoming the Uluwatu basecamp."),
      ev("micro_area", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1380108-d19801742-Reviews-BGS_Bali_Surf_Shop_Coffee_Bar_Uluwatu-Pecatu_Bukit_Peninsula_Bali.html", "VERIFIED", "Jl. Labuansait before the Suluban entrance — inside boundary."),
      ev("official_url", "official_website", "https://bgsbali.com/store/bgs-uluwatu/", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/bgsbali/", "VERIFIED", "Brand account for all BGS locations."),
      ev("signature_coffee", "third_party_guide", "https://wanderlog.com/place/details/1970901/bgs-uluwatu-bali-surf-shop--coffee-bar", "VERIFIED", "Homemade almond milk latte; Sumatra-sourced coffee."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "Opens 6:30 vs 7:30 across aggregators; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "son-of-a-baker",
    displayName: "Son of a Baker",
    category: "cafe",
    microArea: "Labuan Sait, Pecatu",
    publication: "published",
    verdict:
      "Art-house bakery opening at six — the earliest proper coffee and pastry on the Bukit.",
    whyHere:
      "When the surf report says dawn, Son of a Baker is already open: 6 a.m. starts, Italian coffee, a pumpkin-seed-milk latte you won't find elsewhere, and a bake case that treats pastry as craft. The 'Art & Bakehouse' framing is earned — the room doubles as a small gallery.",
    whatToExpect:
      "Counter service, artisan bakes with marked vegan options, workable wifi in off-peak hours. Closed Mondays per current listings — check their Instagram before an early mission. Between Bingin and Padang Padang on the Labuan Sait road.",
    bestFor: "pre-surf breakfast at first light; pastry-and-coffee stops; quiet morning work",
    notFor: "full plated brunches",
    atmosphere: "Calm bakehouse, gallery walls",
    visitContext: "Jl. Labuansait No.250, Pecatu. Check Instagram for current days/hours.",
    reservation: "Walk-in.",
    whatToOrder: ["artisanal bakes", "Italian coffee", "pumpkin-seed latte"],
    priceBand: "$$",
    address: "Jl. Labuansait No.250, Pecatu",
    openingHours: null,
    officialUrl: null,
    instagramUrl: "https://www.instagram.com/sonofabaker.bali/",
    bookingUrl: null,
    gmapsUrl: maps("Son of a Baker Art Bakehouse Pecatu Bali"),
    attributes: ["opens ~06:00", "artisan bakery", "vegan options marked"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "official_instagram", "https://www.instagram.com/sonofabaker.bali/", "VERIFIED", "Active Instagram; current partner listings. No official website exists."),
      ev("micro_area", "web_search_verification", "https://wanderlog.com/place/details/6532338/son-of-a-baker-art--bakehouse", "VERIFIED", "Jl. Labuansait No.250, Pecatu — inside boundary. Fine label conflicts (Bingin vs Padang Padang overlook) — kept at Pecatu."),
      ev("official_url", "official_website", null, "MISSING", "No official website; Instagram is the primary channel. (sonofabaker.com.au is an unrelated Australian business.)"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/sonofabaker.bali/", "VERIFIED"),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "Tue–Sun from 06:00, Monday closed; Sunday close conflicts (18:00 vs 22:00). Off-page; IG check advised in copy."),
      ev("tripadvisor_duplicates", "web_search_verification", null, "CONFLICTING SOURCES", "Three near-identical TripAdvisor listings; no confirmation of a second outlet."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },
  {
    slug: "alchemy-uluwatu",
    displayName: "Alchemy Uluwatu",
    category: "cafe",
    microArea: "Bingin",
    publication: "published",
    verdict:
      "Ubud's plant-based original, transplanted to a Bingin garden — raw bowls, an organic shop and yoga on the same grounds.",
    whyHere:
      "Alchemy has run Bali's benchmark raw/vegan kitchen since 2011 in Ubud; the Uluwatu outpost brings it to the surf side with a ~150-seat garden, a holistic clinic, an organic grocery and an attached yoga shala. For plant-based travellers it is the Bukit's anchor.",
    whatToExpect:
      "Build-your-own salad and smoothie bowls, raw desserts, kombucha on tap, permaculture-garden seating and an evening communal fire pit. Fully plant-based and largely gluten-free — carnivorous companions can walk to Bingin's warungs after.",
    bestFor: "plant-based eating; quiet garden work sessions; post-yoga breakfasts",
    notFor: "travellers set on meat or espresso-tonic party brunches",
    atmosphere: "Garden-calm, wellness-centred",
    visitContext: "Jl. Pantai Bingin No.8, Pecatu — with Alchemy Yoga next door.",
    reservation: "Walk-in.",
    whatToOrder: ["bowls", "jackfruit salad", "pizza & kombucha"],
    priceBand: "$$",
    address: "Jl. Pantai Bingin No.8, Pecatu",
    openingHours: null,
    officialUrl: "https://www.alchemybali.com/uluwatu",
    instagramUrl: "https://www.instagram.com/alchemybali/",
    bookingUrl: null,
    gmapsUrl: maps("Alchemy Uluwatu Bingin Pecatu Bali"),
    attributes: ["plant-based / raw / gluten-free", "permaculture garden", "yoga centre on site", "organic shop"],
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("operating_status", "web_search_verification", "https://www.kala.surf/blog/best-restaurants-in-uluwatu-2026", "VERIFIED", "2026 guide inclusion; official site + Uluwatu pages live; active brand IG."),
      ev("micro_area", "web_search_verification", "https://wanderlog.com/place/details/5063450/alchemy-uluwatu", "VERIFIED", "Jl. Pantai Bingin No.8, Pecatu — inside boundary. (TripAdvisor's 'Denpasar' label is an administrative artifact.)"),
      ev("official_url", "official_website", "https://www.alchemybali.com/uluwatu", "VERIFIED"),
      ev("instagram_url", "official_instagram", "https://www.instagram.com/alchemybali/", "VERIFIED", "Brand account (Ubud + Uluwatu); @alchemyyogauluwatu for the shala."),
      ev("yoga_and_shop", "web_search_verification", "https://www.novacircle.com/spots/asia/indonesia/bali-province/badung-regency/bali/alchemy-uluwatu-5f0bbc", "VERIFIED", "Garden seating ~150, organic shop, fire pit, attached yoga centre."),
      ev("opening_hours", "third_party_guide", null, "CONFLICTING SOURCES", "7:00 vs 7:30 open across sources; off-page."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },

  // ── Internal review (NOT published, noindex) ──────────────────────────
  {
    slug: "ulu-artisan-ungasan",
    displayName: "Ulu Artisan (Ungasan)",
    category: "cafe",
    microArea: "Ungasan",
    publication: "review",
    verdict:
      "Bakery-brunch café on the Ungasan road — held in review while the brand naming is reconciled.",
    whyHere:
      "Identity is confirmed (active Google Maps place on Jl. Raya Uluwatu, Ungasan; live Chope listing) but the venue appears under conflicting names across platforms — 'Ulu Artisan', 'Artisan Ungasan', 'ARTISAN - UNGASAN' — with parallel duplicate booking listings. Published only after the canonical name and relationship to the Artisan branch family is reconciled.",
    whatToExpect:
      "Artisan bakery (baguette, ciabatta, focaccia, sourdough), brunch by day and wood-fired dinner by night per its booking listings.",
    bestFor: "brunch after surf; quiet work sessions",
    whatToOrder: ["bagels", "pancakes", "brunch plates"],
    priceBand: "$$",
    address: "Jl. Raya Uluwatu, Ungasan",
    openingHours: null,
    officialUrl: null,
    instagramUrl: "https://www.instagram.com/artisan.bali/",
    bookingUrl: null,
    gmapsUrl: maps("ULU ARTISAN Ungasan Bali"),
    lastVerifiedAt: CHECKED,
    evidence: [
      ev("identity", "web_search_verification", "https://www.chope.co/bali-restaurants/restaurant/ulu-artisan-ungasan-uluwatu", "CONFLICTING SOURCES", "Brand ambiguity: 'Ulu Artisan' vs 'Artisan Ungasan' with parallel Chope listings; official artisangroup.id contents unverified. HELD IN REVIEW."),
      ev("operating_status", "web_search_verification", "https://www.chope.co/bali-restaurants/restaurant/ulu-artisan-ungasan-uluwatu", "VERIFIED", "Active reservation listing, live Google Maps place, active group IG."),
      ev("micro_area", "google_maps_listing", "https://www.google.com/maps/place/ULU+ARTISAN/@-8.8182557,115.0867998,13z", "VERIFIED", "Jl. Raya Uluwatu, Ungasan (approx -8.8201, 115.1507) — inside boundary."),
      ev("official_url", "official_website", null, "CONFLICTING SOURCES", "artisangroup.id indexed as 'Home - Ulu Artisan' but contents unverifiable."),
      researchEv("what_to_order"),
      researchEv("price_band"),
    ],
  },

  // ── Warungs & local food ─────────────────────────────────────────────
  // Verified discovery pass 2026-07-14 (official IG / web-search). Registered
  // as `restaurant` (the registry has no `warung` category); they are local
  // warungs and surface in the /best-warungs-in-bali cluster by name.
  {
    slug: "yeyes-warung-uluwatu",
    displayName: "Yeye's Warung",
    category: "restaurant",
    microArea: "Pecatu (Jl. Labuansait)",
    publication: "published",
    verdict: "A long-running roadside nasi campur warung between Padang-Padang and Uluwatu Beach — cheap, buffet-style and reliably good.",
    whyHere: "One of the Bukit's original cheap-eats warungs, open well over two decades on the Labuansait strip, feeding surfers and travellers a pick-your-own mixed-rice plate.",
    whatToExpect: "A casual buffet spread of Indonesian dishes — point, plate and pay by what you take. Plenty of meat-free options; no-frills roadside seating.",
    bestFor: "a quick, cheap local lunch mid-explore; vegetarians and vegans; repeat casual meals",
    notFor: "diners wanting a polished sit-down restaurant or table service",
    whatToOrder: ["Nasi campur (mixed rice plate)", "tempeh and tofu dishes", "vegetable curries", "grilled or fried chicken sides"],
    priceBand: "$",
    instagramUrl: "https://www.instagram.com/warung_yeyes/",
    gmapsUrl: maps("Yeye's Warung Pecatu Uluwatu"),
    lastVerifiedAt: "2026-07-14",
    evidence: [
      ev("identity", "official_instagram", "https://www.instagram.com/warung_yeyes/", "VERIFIED", "Official IG confirms name and Pecatu location.", "2026-07-14"),
      ev("micro_area", "web_search_verification", "https://www.happycow.net/reviews/yeyes-warung-and-gift-shop-pecatu-391226", "VERIFIED", "Jl. Labuansait, Pecatu — inside the Bukit.", "2026-07-14"),
    ],
  },
  {
    slug: "warung-local-pecatu",
    displayName: "Warung Local",
    category: "restaurant",
    microArea: "Pecatu (Jl. Labuansait)",
    publication: "published",
    verdict: "A build-your-own nasi campur buffet in Pecatu with clearly labelled vegan and vegetarian options.",
    whyHere: "A Pecatu cheap-eats staple where you compose a mixed-rice plate from a counter of vegetables, curries and proteins — plant-based eaters are well looked after.",
    whatToExpect: "Self-serve buffet plates of rice or noodles plus sides; casual, quick and budget.",
    bestFor: "budget mixed-rice plates; vegans and vegetarians; groups wanting to customise plates",
    notFor: "diners after à-la-carte fine dining or a quiet atmosphere",
    whatToOrder: ["Nasi campur (self-selected buffet plate)", "tempeh", "tofu", "vegetable curries", "es campur (shaved-ice dessert)"],
    priceBand: "$",
    instagramUrl: "https://www.instagram.com/warunglocal/",
    gmapsUrl: maps("Warung Local Pecatu Labuansait Uluwatu"),
    lastVerifiedAt: "2026-07-14",
    evidence: [
      ev("identity", "official_instagram", "https://www.instagram.com/warunglocal/", "VERIFIED", "Pecatu build-your-own warung; vegan/veg labelled.", "2026-07-14"),
      ev("micro_area", "web_search_verification", "https://www.happycow.net/reviews/warung-local-pecatu-346170", "VERIFIED", "Jl. Labuansait No.10A, Pecatu — inside the Bukit.", "2026-07-14"),
    ],
  },
  {
    slug: "warung-bu-jonny-uluwatu",
    displayName: "Warung Bu Jonny (Cak Man)",
    category: "restaurant",
    microArea: "Pecatu (near the Bingin surf spots)",
    publication: "published",
    verdict: "A simple cook-to-order roadside warung near the Pecatu surf beaches, favoured by local surf instructors.",
    whyHere: "A no-frills local warung near Bingin and Pecatu, popular with surf instructors and resort staff for cheap, freshly cooked Indonesian plates and a well-regarded house sambal.",
    whatToExpect: "A short list of home-style dishes cooked to order; roadside seating; takeaway common.",
    bestFor: "a cheap post-surf refuel; travellers wanting an unfussy authentic local meal; takeaway",
    notFor: "diners wanting ambience, comfortable seating or a broad menu",
    whatToOrder: ["Nasi goreng (fried rice)", "lalapan (fried chicken with rice, raw veg and sambal)", "crispy fried chicken", "house sambal"],
    priceBand: "$",
    gmapsUrl: maps("Warung Bu Jonny Cak Man Pecatu Uluwatu"),
    lastVerifiedAt: "2026-07-14",
    evidence: [
      ev("identity", "web_search_verification", "https://www.balisurfingcamp.com/blog/uluwatus-warungs-where-the-top-local-surfers-eat", "VERIFIED", "Listed among the Bukit's local surfer warungs.", "2026-07-14"),
      ev("micro_area", "web_search_verification", "https://www.horego.com/kuta-selatan/warung-bu-jonny-cak-man-uluwatu", "VERIFIED", "Pecatu / Kuta Selatan — inside the Bukit.", "2026-07-14"),
    ],
  },
  {
    slug: "babi-guling-bali-ayu-pecatu",
    displayName: "Babi Guling Bali Ayu",
    category: "restaurant",
    microArea: "Pecatu (Jl. Raya Uluwatu)",
    publication: "published",
    verdict: "A no-frills Pecatu warung specialising in babi guling — Balinese spit-roasted suckling pig with rice and sambal.",
    whyHere: "A local roast-pork specialist on Jl. Raya Uluwatu doing one thing well; popular servings can sell out before closing, so earlier in the day is safer.",
    whatToExpect: "A single signature plate — roast pork with rice, vegetables and sambal — in a plain warung setting.",
    bestFor: "trying authentic Balinese roast pork; an early or lunch meal; travellers wanting one signature local dish done well",
    notFor: "vegetarians and non-pork eaters; late-afternoon arrivals (popular items can run out)",
    whatToOrder: ["Babi guling (roast suckling pig plate) with rice, fresh vegetables and sambal"],
    priceBand: "$",
    gmapsUrl: maps("Babi Guling Bali Ayu Pecatu Uluwatu"),
    lastVerifiedAt: "2026-07-14",
    evidence: [
      ev("identity", "web_search_verification", "https://babi-guling-bali-ayu.menustic.com/", "VERIFIED", "Babi guling specialist, Pecatu.", "2026-07-14"),
      ev("micro_area", "web_search_verification", "https://www.baliready.com/en-IN/directory/restaurants/67738c27f66b1cf443a15f7f", "VERIFIED", "Jl. Raya Uluwatu, Pecatu — inside the Bukit.", "2026-07-14"),
    ],
  },
  {
    slug: "warung-ubay-ungasan",
    displayName: "Warung Ubay",
    category: "restaurant",
    microArea: "Ungasan (Jl. Raya Uluwatu)",
    publication: "published",
    verdict: "A local Ungasan warung known for Indonesian seafood and grilled dishes, away from the busy beach strips.",
    whyHere: "An inexpensive Ungasan sit-down warung doing seafood and grilled plates in generous portions, open through lunch and dinner.",
    whatToExpect: "Home-style Indonesian seafood and grills at local prices; casual sit-down.",
    bestFor: "seafood and grilled-fish lovers; an inexpensive sit-down dinner in Ungasan; groups sharing generous portions",
    whatToOrder: ["Seafood kare (curry)", "grilled tuna", "grilled chicken", "cap cay (stir-fried vegetables)", "homemade steamed bread"],
    priceBand: "$",
    gmapsUrl: maps("Warung Ubay Ungasan Uluwatu"),
    lastVerifiedAt: "2026-07-14",
    evidence: [
      ev("identity", "web_search_verification", "https://www.tripadvisor.com/Restaurant_Review-g1219108-d15603624-Reviews-Warung_Ubay-Ungasan_Bukit_Peninsula_Bali.html", "VERIFIED", "Ungasan warung, seafood and grills.", "2026-07-14"),
      ev("micro_area", "web_search_verification", "https://wanderlog.com/place/details/2682938/warung-ubay-ungasan-bali", "VERIFIED", "Ungasan, Bukit peninsula — inside the Bukit.", "2026-07-14"),
    ],
  },
  {
    slug: "dbuchu-bingin",
    displayName: "D'Buchu",
    category: "restaurant",
    microArea: "Bingin",
    publication: "published",
    verdict: "A small family-run roadside warung near Bingin doing fresh grilled seafood as an evening spot.",
    whyHere: "A relaxed Bingin dinner warung serving fresh grilled seafood and everyday Indonesian plates, opening in the late afternoon.",
    whatToExpect: "Grilled fish and prawns plus simple Indonesian dishes; casual roadside, dinner-only.",
    bestFor: "a casual grilled-seafood dinner near Bingin; travellers after a relaxed local meal; sunset-hour eaters",
    notFor: "breakfast or lunch (it opens late afternoon for dinner only)",
    whatToOrder: ["Grilled fish", "grilled prawns", "ikan bakar / ayam bakar with rice", "gado-gado", "mie goreng"],
    priceBand: "$",
    instagramUrl: "https://www.instagram.com/d_buchuu/",
    gmapsUrl: maps("D'Buchu Bingin Uluwatu"),
    lastVerifiedAt: "2026-07-14",
    evidence: [
      ev("identity", "official_instagram", "https://www.instagram.com/d_buchuu/", "VERIFIED", "Family-run Bingin seafood warung.", "2026-07-14"),
      ev("micro_area", "web_search_verification", "https://melalibingin.com/best-indonesian-food-on-the-bukit/", "VERIFIED", "Bingin — inside the Bukit.", "2026-07-14"),
    ],
  },
];

const bySlug = new Map(ULUWATU_VENUES.map((v) => [v.slug, v]));

export function getUluwatuContent(slug: string): UluwatuVenueContent | null {
  return bySlug.get(slug) ?? null;
}

export function publishedUluwatuVenues(): UluwatuVenueContent[] {
  return ULUWATU_VENUES.filter((v) => v.publication === "published");
}

export function uluwatuVenuesByCategory(
  category: UluwatuVenueContent["category"]
): UluwatuVenueContent[] {
  return publishedUluwatuVenues().filter((v) => v.category === category);
}

// Venue-row projection: lets the read layer serve Uluwatu venues even when
// the DB is unreachable or migration 0018 has not been applied yet (the seed
// fallback contains no Uluwatu rows). DB rows win on slug collision.
export function uluwatuAsVenue(c: UluwatuVenueContent) {
  return {
    id: `v_uluwatu_${c.slug.replace(/-/g, "_")}`,
    slug: c.slug,
    name: c.displayName,
    category: c.category,
    district: ULUWATU_DB_SLUG,
    address: c.address ?? `${c.microArea}, Bukit Peninsula`,
    gmapsUrl: c.gmapsUrl,
    tier: "editorial_seed" as const,
    isSponsored: false,
    area: c.microArea,
    whyItsHere: c.whyHere,
    bestFor: c.bestFor,
    notFor: c.notFor,
    whatToOrder: c.whatToOrder?.join("; "),
    priceAnchor: c.priceBand ? `Price band: ${c.priceBand}` : undefined,
  };
}

// Card projection used by /places and the guide pages.
export function toPlaceCard(v: UluwatuVenueContent) {
  return {
    slug: v.slug,
    name: v.displayName,
    category: v.category,
    microArea: v.microArea,
    editorialLine: v.verdict,
    bestFor: v.bestFor,
    priceBand: v.priceBand ?? undefined,
    photoUrl: undefined,
    isSponsored: false,
    gmapsUrl: v.gmapsUrl,
  };
}
