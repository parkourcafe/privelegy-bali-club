// Nusa Dua district product content (pillar + /things-to-do).
//
// Like lib/sanur/content.ts and lib/uluwatu/venues.ts, this is a code registry
// of ATTRACTIONS / BEACHES for the district pillar — NOT rows in the `venues`
// table. Nusa Dua is planning_only, so items link only to Google Maps / neutral
// info, never to perks, QR or booking monetization (guardrail #4). Facts are
// from a verified web-research pass (14 Jul 2026, first-party + authoritative
// sources); any field the pass could not verify is omitted rather than
// estimated (no invented content). Downsides appear only as fit-context, never
// as quality warnings (guardrail #7).

export const NUSA_DUA_REVIEW_DATE = "2026-07-14";

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} Bali`
  )}`;
}

export type NusaDuaZoneKey = "nusa-dua" | "geger" | "tanjung-benoa";

export interface NusaDuaZone {
  key: NusaDuaZoneKey;
  label: string;
  character: string;
  bestFor: string;
}

// The three distinct beach zones of the enclave (verified character).
export const NUSA_DUA_ZONES: NusaDuaZone[] = [
  {
    key: "nusa-dua",
    label: "Nusa Dua proper · Mengiat / Nusa Dua Beach",
    character:
      "The gated resort strip's main beach: white sand, an offshore reef that breaks the swell, and a paved promenade linking the five-stars. Calm and manicured.",
    bestFor: "First-time and family stays who want safe, swimmable water and easy resort logistics.",
  },
  {
    key: "geger",
    label: "Geger Beach · south, near Mulia",
    character:
      "Quieter and more local, below the clifftop Pura Geger temple. Seaweed plots and rock pools show at low tide; the water is calmest and best for swimming at high tide.",
    bestFor: "A calmer, more natural beach morning away from the resort promenade.",
  },
  {
    key: "tanjung-benoa",
    label: "Tanjung Benoa · north peninsula",
    character:
      "Bali's motorised-watersports hub, on a calm, shallow, reef-sheltered lagoon just north of the enclave. Beginner- and family-friendly water.",
    bestFor: "Parasailing, jet ski, banana boat and glass-bottom boat trips.",
  },
];

export interface NusaDuaThing {
  title: string;
  zone: string;
  blurb: string;
  mapsUrl?: string;
}

export const NUSA_DUA_THINGS_TO_DO: NusaDuaThing[] = [
  {
    title: "Walk the beachfront promenade",
    zone: "Central · Nusa Dua Beach",
    blurb:
      "A paved coastal path (commonly cited at around 5 km) runs behind the beachfront and links the resorts and beaches with the public access points. It's the low-effort Nusa Dua ritual: flat, shaded in parts and walkable, which is rare in south Bali.",
    mapsUrl: mapsLink("Nusa Dua Beach promenade"),
  },
  {
    title: "Watch the Water Blow",
    zone: "Peninsula Island · near The St. Regis",
    blurb:
      "A natural attraction on the enclave's eastern tip where Indian Ocean swells surge into a gap in the limestone cliffs and spray upward. There's a wooden viewing deck; open daily roughly 9am–5pm with a nominal entrance fee.",
    mapsUrl: mapsLink("Water Blow Nusa Dua Peninsula Island"),
  },
  {
    title: "Geger Beach & Pura Geger",
    zone: "South · near Mulia",
    blurb:
      "The quieter, more local beach at the south end, with the clifftop Pura Geger temple above it. It's one of the few South Bali spots where traditional seaweed farming still shows at low tide. Swim at high tide, and wander the temple (sarong etiquette) outside ceremony days.",
    mapsUrl: mapsLink("Geger Beach Nusa Dua"),
  },
  {
    title: "Museum Pasifika",
    zone: "Central · Bali Collection (Block P)",
    blurb:
      "An art museum holding a large Asia–Pacific collection: paintings and sculpture from Indonesia, the Pacific, Polynesia and Indochina. The collection also covers European artists who worked in the region (Le Mayeur, Theo Meier). Themed rooms; open daily, roughly 10am–6pm.",
    mapsUrl: mapsLink("Museum Pasifika Nusa Dua"),
  },
  {
    title: "Tanjung Benoa watersports",
    zone: "North peninsula · Tanjung Benoa",
    blurb:
      "The peninsula just north is Bali's motorised-watersports hub, working from a calm reef-sheltered lagoon: parasailing, jet ski, banana boat, flyboard, sea walker and more. The shallow water keeps it beginner- and family-friendly.",
    mapsUrl: mapsLink("Tanjung Benoa Watersports"),
  },
  {
    title: "Glass-bottom boat to Turtle Island (Pulau Penyu)",
    zone: "North · departs Tanjung Benoa",
    blurb:
      "A standard Tanjung Benoa half-day trip: a glass-bottom boat over the shallows to a turtle conservation island in Benoa harbour. You can see sea turtles and other animals there. It's an easy add-on to a watersports morning.",
    mapsUrl: mapsLink("Turtle Island Pulau Penyu Tanjung Benoa"),
  },
  {
    title: "Devdan Show",
    zone: "Central · Bali Nusa Dua Theatre",
    blurb:
      "A theatrical stage production of traditional and contemporary Indonesian dance, aerial acrobatics, costume and illusion, themed around the archipelago (Bali, Java, Sumatra, Borneo, Papua). Runs Mon/Wed/Fri/Sat at 7.30pm; book ahead.",
    mapsUrl: mapsLink("Bali Nusa Dua Theatre Devdan Show"),
  },
  {
    title: "Bali Collection",
    zone: "Central · ITDC complex",
    blurb:
      "The enclave's open-air shopping-and-dining complex: fashion outlets, restaurants, spas and services. There are occasional cultural performances, and a free shuttle loop serves the Nusa Dua and Tanjung Benoa resorts.",
    mapsUrl: mapsLink("Bali Collection Nusa Dua"),
  },
  {
    title: "Puja Mandala",
    zone: "Inland · Bualu / Kampial",
    blurb:
      "A single compound of five side-by-side places of worship, built as a symbol of religious harmony. There's a mosque, a Catholic church, a Protestant church, a Buddhist vihara and a Hindu temple. It's a short stop just inland from the resorts.",
    mapsUrl: mapsLink("Puja Mandala Bualu Nusa Dua"),
  },
];

export const NUSA_DUA_FAQ = [
  {
    q: "What is Nusa Dua best for?",
    a: "Calm, polished, low-friction Bali: a gated enclave of beachfront five-star resorts, manicured grounds, safe swimmable beaches and resort fine dining. It suits families, couples on a relaxed break and travellers who want easy, secure logistics over an independent café-and-nightlife scene.",
  },
  {
    q: "Are Nusa Dua's beaches good for swimming?",
    a: "Yes. The enclave sits inside a reef-protected bay, so the water is calm and family-safe for much of the year. That's unlike Bali's exposed west and south surf coasts. Mengiat (Nusa Dua Beach) is the main resort strip. Geger to the south is quieter and more natural, best swum at high tide when the seaweed flats are covered.",
  },
  {
    q: "Is Nusa Dua walkable or lively?",
    a: "It's manicured and quiet rather than lively. It's great for a stroll along the ~5 km beach promenade or the Bali Collection shops, but independent nightlife and cafés live elsewhere. Tanjung Benoa, just north, is the watersports hub.",
  },
  {
    q: "What is there to do in Nusa Dua besides the resort?",
    a: "More than it looks: the beach promenade, the Water Blow, Geger Beach and its clifftop temple, and Museum Pasifika at the Bali Collection. Tanjung Benoa has watersports and a glass-bottom boat to Turtle Island. There's also the Devdan Show and, inland, the five-faith Puja Mandala.",
  },
  {
    q: "Where do you go for watersports in Nusa Dua?",
    a: "Tanjung Benoa, the peninsula immediately north. Its calm, shallow, reef-sheltered lagoon is Bali's main motorised-watersports zone. Expect parasailing, jet ski, banana boat, flyboard, sea walker and glass-bottom-boat trips, mostly beginner-friendly.",
  },
];
