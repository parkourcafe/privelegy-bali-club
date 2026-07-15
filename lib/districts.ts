// Bali-wide planning layer (master: District entity, coverage flags).
// Editorial fit-context per area — WHO it suits and WHEN to go (allowed by
// guardrail #7); никаких перков/QR/брони вне active_deep (guardrail #4 —
// enforced at DB level, these entries carry no money surface at all).
//
// Coverage truth lives in the districts table (status / monetization_enabled /
// qr_enabled); this file carries only the planning copy. The master doc names
// Canggu (active_deep), Ubud (next_deep), Seminyak/Sanur/Uluwatu as candidates;
// the remaining areas below extend the planning layer island-wide per founder
// request (2026-07-11) — planning_only, no money features.

export type DistrictStatus = "planning_only" | "active_deep" | "next_deep";

export interface DistrictGuideEntry {
  slug: string;
  name: string;
  status: DistrictStatus;
  region: string; // coarse compass area, for scanning
  moment: string; // the day-moment this area is best at
  bestFor: string[]; // fit context — who/when, not quality grades
  mapsUrl: string;
  // true once the public catalogue (0015 import) actually has venues for the
  // district — those cards lead into /places?district=… (on-site, where
  // booking lives) instead of dumping the traveller to Google Maps.
  catalogued?: boolean;
  // Published district_guide ContentPage (master §6a.3) — when set, the
  // landing card's primary CTA leads to the editorial guide.
  guidePath?: string;
}

// Districts with venues in the published catalogue (0015 import counts):
// canggu · seminyak · ubud · uluwatu-bukit · sanur · jimbaran · nusa-dua.
const CATALOGUED = new Set([
  "canggu",
  "ubud",
  "seminyak",
  "uluwatu-bukit",
  "sanur",
  "jimbaran",
  "nusa-dua",
]);

const GUIDE: DistrictGuideEntry[] = [
  {
    slug: "canggu",
    name: "Canggu",
    status: "active_deep",
    region: "South-west coast",
    moment: "Surf mornings, café work, sunset beach clubs.",
    bestFor: ["surfers", "remote work", "nightlife"],
    mapsUrl: "https://maps.google.com/?q=Canggu,+Bali",
  },
  {
    slug: "ubud",
    name: "Ubud",
    status: "next_deep",
    region: "Central highlands",
    moment: "Jungle mornings, rice-terrace walks, long slow dinners.",
    bestFor: ["culture", "yoga & retreats", "green scenery"],
    mapsUrl: "https://maps.google.com/?q=Ubud,+Bali",
  },
  {
    slug: "seminyak",
    name: "Seminyak",
    status: "planning_only",
    region: "South-west coast",
    moment: "Polished beach days, boutique shopping, cocktail sunsets.",
    bestFor: ["couples", "shopping", "beach clubs"],
    mapsUrl: "https://maps.google.com/?q=Seminyak,+Bali",
  },
  {
    slug: "kuta-legian",
    name: "Kuta & Legian",
    status: "planning_only",
    region: "South coast",
    moment: "First or last night near the airport, long sand, easy budgets.",
    bestFor: ["short stopovers", "budget stays", "beginner surf"],
    mapsUrl: "https://maps.google.com/?q=Kuta,+Bali",
  },
  {
    slug: "jimbaran",
    name: "Jimbaran",
    status: "planning_only",
    region: "South coast",
    moment: "Calm bay mornings, seafood dinners on the sand.",
    bestFor: ["families", "seafood dinners", "quiet beaches"],
    mapsUrl: "https://maps.google.com/?q=Jimbaran,+Bali",
  },
  {
    slug: "uluwatu-bukit",
    name: "Uluwatu & the Bukit",
    status: "planning_only",
    region: "Southern peninsula",
    moment: "Cliff surf, temple at golden hour, dramatic sunsets.",
    bestFor: ["experienced surfers", "sunset views", "cliff beaches"],
    mapsUrl: "https://maps.google.com/?q=Uluwatu,+Bali",
    guidePath: "/uluwatu",
  },
  {
    slug: "nusa-dua",
    name: "Nusa Dua",
    status: "planning_only",
    region: "South-east peninsula",
    moment: "Resort days, calm swimmable water.",
    bestFor: ["families with kids", "resort stays", "calm sea"],
    mapsUrl: "https://maps.google.com/?q=Nusa+Dua,+Bali",
  },
  {
    slug: "sanur",
    name: "Sanur",
    status: "planning_only",
    region: "South-east coast",
    moment: "Easy-pace mornings on the old promenade, ferries to the islands.",
    bestFor: ["slower pace", "cycling", "island ferries"],
    mapsUrl: "https://maps.google.com/?q=Sanur,+Bali",
  },
  {
    slug: "sidemen",
    name: "Sidemen",
    status: "planning_only",
    region: "East valleys",
    moment: "Green valley views, quiet guesthouses, slow village days.",
    bestFor: ["quiet escapes", "rice-field walks", "photographers"],
    mapsUrl: "https://maps.google.com/?q=Sidemen,+Bali",
  },
  {
    slug: "amed",
    name: "Amed & the east coast",
    status: "planning_only",
    region: "East coast",
    moment: "Sunrise snorkelling, black-sand fishing villages.",
    bestFor: ["divers & snorkellers", "wreck dives", "low-key evenings"],
    mapsUrl: "https://maps.google.com/?q=Amed,+Bali",
  },
  {
    slug: "munduk",
    name: "Munduk & the highlands",
    status: "planning_only",
    region: "North mountains",
    moment: "Waterfalls, cool air, coffee country.",
    bestFor: ["hikers", "waterfalls", "cool climate"],
    mapsUrl: "https://maps.google.com/?q=Munduk,+Bali",
  },
  {
    slug: "lovina",
    name: "Lovina",
    status: "planning_only",
    region: "North coast",
    moment: "Calm black-sand mornings, early boats on a quiet sea.",
    bestFor: ["off-the-loop travel", "calm water", "long stays"],
    mapsUrl: "https://maps.google.com/?q=Lovina,+Bali",
  },
  {
    slug: "nusa-islands",
    name: "Nusa Penida & the islands",
    status: "planning_only",
    region: "Off the south-east coast",
    moment: "Day-trip cliffs, manta points, rough-road adventures.",
    bestFor: ["day trips", "divers", "viewpoint chasers"],
    mapsUrl: "https://maps.google.com/?q=Nusa+Penida",
  },
  // Beyond Bali proper — the classic fast-boat side-trips east. Labeled by
  // region so the "Bali guide" framing stays honest.
  {
    slug: "gili-islands",
    name: "Gili Islands",
    status: "planning_only",
    region: "Beyond Bali · fast boat",
    moment: "Car-free island days, snorkelling with turtles, barefoot evenings.",
    bestFor: ["snorkellers", "car-free islands", "multi-day side trips"],
    mapsUrl: "https://maps.google.com/?q=Gili+Trawangan",
  },
  {
    slug: "lombok",
    name: "Lombok",
    status: "planning_only",
    region: "Beyond Bali · fast boat",
    moment: "South-coast surf, empty beaches, Rinjani treks.",
    bestFor: ["surfers", "trekkers", "quieter beaches"],
    mapsUrl: "https://maps.google.com/?q=Kuta,+Lombok",
  },
];

// Districts that shipped a hand-crafted pillar page — the homepage card links
// there (a real route) instead of the programmatic /bali/[district] hub, which
// deliberately excludes these slugs (HUB_EXCLUDE_DISTRICTS) and would 404.
const PILLAR_PATH: Record<string, string> = {
  "uluwatu-bukit": "/uluwatu",
  ubud: "/ubud",
  seminyak: "/seminyak",
  sanur: "/sanur",
  "nusa-dua": "/nusa-dua",
  jimbaran: "/jimbaran",
};

export const DISTRICT_GUIDE: DistrictGuideEntry[] = GUIDE.map((d) => ({
  ...d,
  catalogued: CATALOGUED.has(d.slug),
  guidePath: d.guidePath ?? PILLAR_PATH[d.slug],
}));

// Distinct, light-leaning colour wash per district — shared by the homepage
// "Around Bali" cards and the /places catalogue district dividers, so a
// district looks the same everywhere. Each hue is its own so Canggu, Ubud and
// Lombok never read alike; warm-cohesive but never identical. Keys are DB
// district slugs (same as DISTRICT_GUIDE).
export const DISTRICT_GRADIENT: Record<string, string> = {
  canggu: "linear-gradient(150deg,#2f7f88 0%,#c69a5c 55%,#2a1c12 100%)",
  ubud: "linear-gradient(150deg,#4a7a52 0%,#cba35e 55%,#221a10 100%)",
  seminyak: "linear-gradient(150deg,#c07184 0%,#e6bd7d 52%,#2a1a14 100%)",
  "kuta-legian": "linear-gradient(150deg,#e6a851 0%,#f2cd8b 48%,#3a2614 100%)",
  jimbaran: "linear-gradient(150deg,#b85a30 0%,#e6bd7d 52%,#20140f 100%)",
  "uluwatu-bukit": "linear-gradient(150deg,#3d78b0 0%,#cba35e 55%,#20180f 100%)",
  "nusa-dua": "linear-gradient(150deg,#2fa9a2 0%,#cbe3d2 48%,#213230 100%)",
  sanur: "linear-gradient(150deg,#df9aa8 0%,#f2d7ac 50%,#2a2016 100%)",
  sidemen: "linear-gradient(150deg,#63863f 0%,#cba35e 55%,#20180d 100%)",
  amed: "linear-gradient(150deg,#2f6296 0%,#d6aa60 55%,#161b24 100%)",
  munduk: "linear-gradient(150deg,#3f857b 0%,#b3cd92 50%,#182420 100%)",
  lovina: "linear-gradient(150deg,#4f88a4 0%,#d0bb8c 52%,#182028 100%)",
  "nusa-islands": "linear-gradient(150deg,#1fa6bd 0%,#9ee6dc 48%,#213238 100%)",
  "gili-islands": "linear-gradient(150deg,#2bb8ae 0%,#cbe9d7 48%,#203030 100%)",
  lombok: "linear-gradient(150deg,#93a447 0%,#e6bd7d 52%,#2a2415 100%)",
};
