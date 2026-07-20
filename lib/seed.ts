import type { Venue, Perk, PlanEntry, RouteDef } from "./types";

// Canggu seed — the single active deep district for G0→G1.
// Venue/perk details are PLACEHOLDER curation: real venues + real perks come
// only from warm-network Editorial Seed partners confirmed on the ground.
// [ПРОВЕРИМ] Every name/perk below must be replaced with a signed Editorial
// Seed partner before any tourist sees it.

export const CANGGU_DISTRICT = {
  slug: "canggu",
  name: "Canggu",
  isDeep: true,
};

export const VENUES: Venue[] = [
  {
    id: "v_home",
    slug: "home-cafe",
    name: "Home Cafe",
    category: "cafe",
    district: "canggu",
    address: "Canggu (see map)",
    gmapsUrl: "https://maps.app.goo.gl/v5HGaAzKoXdvQh6i9",
    tier: "editorial_seed",
    isSponsored: false,
    area: "Berawa",
    whyItsHere: "The kind of local room you'd walk past — and shouldn't.",
    bestFor: "slow mornings, solo coffee, a quiet catch-up",
    notFor: "big groups, laptop marathons",
    practicalTags: ["opens early", "cash ok"],
    jobs: ["slow", "breakfast"],
  },
  {
    id: "v_amber",
    slug: "amber-cafe",
    name: "Amber Specialty Coffee",
    category: "cafe",
    district: "canggu",
    address: "Jl. Pantai Berawa, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Canggu+coffee",
    tier: "editorial_seed",
    isSponsored: false,
    area: "Berawa",
    bestFor: "laptop work before noon, proper filter coffee",
    notFor: "lively group brunch",
    practicalTags: ["fast wifi", "sockets"],
    jobs: ["work", "breakfast"],
  },
  {
    id: "v_loka",
    slug: "loka-brunch",
    name: "Loka Brunch House",
    category: "restaurant",
    district: "canggu",
    address: "Jl. Batu Bolong, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Canggu+brunch",
    tier: "editorial_seed",
    isSponsored: false,
  },
  {
    id: "v_tide",
    slug: "tide-surf",
    name: "Tide Surf Co.",
    category: "surf",
    district: "canggu",
    address: "Echo Beach, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Echo+Beach+surf",
    tier: "launch",
    isSponsored: false,
  },
  {
    id: "v_root",
    slug: "root-warung",
    name: "Root Warung",
    category: "warung",
    district: "canggu",
    address: "Jl. Pererenan, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Pererenan+warung",
    tier: "editorial_seed",
    isSponsored: false,
  },
  {
    id: "v_lull",
    slug: "lull-spa",
    name: "Lull Spa & Sauna",
    category: "spa",
    district: "canggu",
    address: "Jl. Nelayan, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Canggu+spa",
    tier: "founding",
    isSponsored: true,
  },
  {
    id: "v_dusk",
    slug: "dusk-beach-club",
    name: "Dusk Beach Club",
    category: "beach_club",
    district: "canggu",
    address: "Pantai Berawa, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Berawa+beach+club",
    tier: "founding",
    isSponsored: false,
  },
  {
    id: "v_ember",
    slug: "ember-dinner",
    name: "Ember Woodfire",
    category: "restaurant",
    district: "canggu",
    address: "Jl. Batu Mejan, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Canggu+dinner",
    tier: "launch",
    isSponsored: false,
  },
  {
    id: "v_neon",
    slug: "neon-bar",
    name: "Neon Listening Bar",
    category: "bar",
    district: "canggu",
    address: "Jl. Pantai Berawa, Canggu",
    gmapsUrl: "https://maps.google.com/?q=Canggu+bar",
    tier: "editorial_seed",
    isSponsored: false,
  },
];

export const PERKS: Perk[] = [
  { id: "p_home", venueSlug: "home-cafe", title: "Free dessert with any main", terms: "One per guest. Dine-in only." },
  { id: "p_amber", venueSlug: "amber-cafe", title: "Free filter coffee with any breakfast", terms: "One per guest. Dine-in only." },
  { id: "p_loka", venueSlug: "loka-brunch", title: "15% off the full bill before 11:00", terms: "One per guest, per day." },
  { id: "p_tide", venueSlug: "tide-surf", title: "Free board upgrade on a 2h rental", terms: "Subject to availability." },
  { id: "p_root", venueSlug: "root-warung", title: "Free es kelapa with any main", terms: "One per guest. Dine-in only." },
  { id: "p_lull", venueSlug: "lull-spa", title: "20% off any 60-min treatment", terms: "Booking recommended. One per guest." },
  { id: "p_dusk", venueSlug: "dusk-beach-club", title: "Welcome drink + no minimum spend daybed", terms: "Before 16:00. Subject to availability." },
  { id: "p_ember", venueSlug: "ember-dinner", title: "Free starter with two mains", terms: "Dine-in, evenings only." },
  { id: "p_neon", venueSlug: "neon-bar", title: "2-for-1 on the first round", terms: "Before 20:00. One per guest." },
];

export const PLAN_ENTRIES: PlanEntry[] = [
  { venueSlug: "home-cafe", slot: "morning", rank: 5, blurb: "Cozy local cafe — order a main, dessert is on the house." },
  { venueSlug: "amber-cafe", slot: "morning", rank: 10, blurb: "Start slow. Best filter in Berawa, opens 7:00." },
  { venueSlug: "loka-brunch", slot: "morning", rank: 20, blurb: "Long brunch if you skipped the early coffee." },
  { venueSlug: "tide-surf", slot: "day", rank: 10, blurb: "Beginner-friendly break, boards on the sand." },
  { venueSlug: "root-warung", slot: "day", rank: 20, blurb: "Cheap, fast, local lunch between sessions." },
  { venueSlug: "lull-spa", slot: "day", rank: 30, blurb: "Reset after surf — sauna then cold plunge." },
  { venueSlug: "dusk-beach-club", slot: "sunset", rank: 10, blurb: "The golden-hour anchor. Get there by 17:00." },
  { venueSlug: "ember-dinner", slot: "evening", rank: 10, blurb: "Woodfire, no-fuss, walk-in friendly." },
  { venueSlug: "neon-bar", slot: "evening", rank: 20, blurb: "Last stop. Records, low lights, real cocktails." },
];

export const ROUTES: RouteDef[] = [
  {
    slug: "first-day",
    district: "canggu",
    title: "First day in Canggu",
    subtitle: "Land, settle, eat well",
    rank: 10,
    stops: [
      { venueSlug: "amber-cafe", note: "Coffee to shake off the flight." },
      { venueSlug: "tide-surf", note: "Easy first surf, boards on the sand." },
      { venueSlug: "dusk-beach-club", note: "Sunset — you earned it." },
      { venueSlug: "ember-dinner", note: "Woodfire dinner, walk-in friendly." },
    ],
  },
  {
    slug: "cafe-work",
    district: "canggu",
    title: "Café & work day",
    subtitle: "Good wifi, good coffee",
    rank: 20,
    stops: [
      { venueSlug: "home-cafe", note: "Quiet start, dessert on the house." },
      { venueSlug: "amber-cafe", note: "Switch desks, best filter in Berawa." },
      { venueSlug: "root-warung", note: "Cheap fast lunch between calls." },
    ],
  },
  {
    slug: "sunset-run",
    district: "canggu",
    title: "Sunset run",
    subtitle: "Golden hour to nightcap",
    rank: 30,
    stops: [
      { venueSlug: "dusk-beach-club", note: "Get there by 17:00." },
      { venueSlug: "ember-dinner", note: "Dinner as the light goes." },
      { venueSlug: "neon-bar", note: "Records and cocktails to close." },
    ],
  },
  // First "excursion" example (cf. supabase/migrations/0048): a non-Canggu,
  // multi-district route, mirrored here so offline/Supabase-unconfigured
  // environments (local dev, previews) can still render it.
  {
    slug: "ubud-culture-day",
    district: "ubud",
    title: "An Ubud culture day",
    subtitle: "Holy spring, waterfall, crispy duck",
    rank: 10,
    stops: [
      { venueSlug: "tirta-empul", note: "Start at the holy spring for melukat — go early, before the tour buses." },
      { venueSlug: "air-terjun-tegenungan", note: "An easy waterfall stop on the way into Ubud — no trek required." },
      { venueSlug: "bebek-bengil", note: "Lunch: the Ubud restaurant that popularised Balinese crispy duck." },
    ],
  },
];
