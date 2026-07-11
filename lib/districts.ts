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
}

export const DISTRICT_GUIDE: DistrictGuideEntry[] = [
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
