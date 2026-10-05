// Sanur district product content (pillar + /best-hotels + /things-to-do).
//
// NEW ENTITY NOTE (master §11 amendment pending): Sanur introduces HOTELS and
// ACTIVITIES to Other Bali for the first time — approved by the founder as the
// district-pillar scope (2026-07-12). These are a code registry (like
// lib/uluwatu/venues.ts), NOT rows in the `venues` table, and carry NO money
// surface: Sanur is planning_only, so hotels/activities link only to Google
// Maps / official info, never to perks, QR or booking monetization (guardrail
// #4). Facts are from the verified "Sanur research pack" (12 Jul 2026); any
// field the pack left unverified is omitted rather than estimated (guardrail:
// no invented content). Downsides appear only as fit-context, never as quality
// warnings (guardrail #7).

export const SANUR_REVIEW_DATE = "2026-07-12";

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} Sanur Bali`
  )}`;
}

export type SanurZone = "north" | "central" | "south";

export const SANUR_ZONE_LABEL: Record<SanurZone, string> = {
  north: "North · Matahari Terbit / Sanur Harbour",
  central: "Central · Jl. Danau Tamblingan",
  south: "South · Semawang / Cemara / Mertasari",
};

export interface SanurHotel {
  name: string;
  zone: SanurZone;
  beachfront: boolean;
  // One verified factual line (rooms / facilities) from the pack.
  fact: string;
  bestFor: string;
  mapsUrl: string;
}

// Ordered by editorial priority within the article body (pack §hotels).
export const SANUR_HOTELS: SanurHotel[] = [
  {
    name: "Hyatt Regency Bali",
    zone: "central",
    beachfront: true,
    fact: "Beachfront resort on Jl. Danau Tamblingan; 373 rooms, three pools, kids club and the shared Shankha Spa / 24-hour fitness.",
    bestFor: "The strongest all-round large-resort classic in central Sanur; families.",
    mapsUrl: mapsLink("Hyatt Regency Bali"),
  },
  {
    name: "Andaz Bali",
    zone: "central",
    beachfront: true,
    fact: "Contemporary luxury beachfront resort on Jl. Danau Tamblingan; 149 rooms, 20 suites and 22 villas, plus kids club and fitness.",
    bestFor: "A premium, design-forward central base.",
    mapsUrl: mapsLink("Andaz Bali"),
  },
  {
    name: "Maya Sanur Resort & Spa",
    zone: "central",
    beachfront: true,
    fact: "Direct Sanur Beach access; 103 rooms and suites, spa, yoga studio, family pool and kids club.",
    bestFor: "Design-forward couples and families who still want boardwalk access.",
    mapsUrl: mapsLink("Maya Sanur Resort and Spa"),
  },
  {
    name: "Tandjung Sari",
    zone: "central",
    beachfront: true,
    fact: "Boutique beachfront classic in the centre of Sanur; bungalow rates include daily à la carte breakfast. A July 2026 repair notice was live, so check before booking.",
    bestFor: "Old-Sanur character over resort scale.",
    mapsUrl: mapsLink("Tandjung Sari"),
  },
  {
    name: "Griya Santrian",
    zone: "central",
    beachfront: true,
    fact: "Central white-sand beachfront within walking distance of shops and restaurants; Beach Wing rooms sit near the beach and main pool.",
    bestFor: "A mid-upscale stay in the middle of everything.",
    mapsUrl: mapsLink("Griya Santrian"),
  },
  {
    name: "Segara Village Hotel",
    zone: "north",
    beachfront: true,
    fact: "Direct access to both Sanur Beach and Matahari Terbit; 120 rooms.",
    bestFor: "A classic family beachfront without luxury pricing.",
    mapsUrl: mapsLink("Segara Village Hotel"),
  },
  {
    name: "The Meru Sanur",
    zone: "north",
    beachfront: true,
    fact: "All-suite beachfront resort inside the Sanur Special Economic Zone, Jl. Hang Tuah.",
    bestFor: "High-end, harbour-side wellness positioning.",
    mapsUrl: mapsLink("The Meru Sanur"),
  },
  {
    name: "Bali Beach Hotel",
    zone: "north",
    beachfront: true,
    fact: "Heritage-facing hotel with 273 ocean-facing rooms and suites; Olympic-size beachfront pool, spa, fitness centre and kids club.",
    bestFor: "The 'classic Sanur reborn', near the fast-boat zone.",
    mapsUrl: mapsLink("Bali Beach Hotel"),
  },
  {
    name: "Puri Santrian",
    zone: "south",
    beachfront: true,
    fact: "South-beach classic with family suites and a spa; the Premier Deluxe wing is adults-oriented (no children under 15).",
    bestFor: "A quieter south-end base for repeat Bali travellers.",
    mapsUrl: mapsLink("Puri Santrian"),
  },
  {
    name: "InterContinental Bali Sanur Resort",
    zone: "south",
    beachfront: true,
    fact: "Suite-oriented beach resort with pool, spa, fitness centre and four restaurants (breakfast at Layang-Layang), Jl. Kusuma Sari.",
    bestFor: "South-end luxury.",
    mapsUrl: mapsLink("InterContinental Bali Sanur Resort"),
  },
  {
    name: "Prama Sanur Beach Bali",
    zone: "south",
    beachfront: true,
    fact: "Large classic family resort alongside Mertasari Beach; 428 rooms, lagoon pool, Splash Zone family pool, spa and watersport centre.",
    bestFor: "A big beachfront family resort at the quiet south end.",
    mapsUrl: mapsLink("Prama Sanur Beach Bali"),
  },
  {
    name: "Mercure Resort Sanur",
    zone: "south",
    beachfront: true,
    fact: "Direct beachfront access; 189 rooms in a cottage-style layout with two outdoor pools.",
    bestFor: "Good value when beach access matters more than polish.",
    mapsUrl: mapsLink("Mercure Resort Sanur"),
  },
  {
    name: "Holiday Inn Bali Sanur",
    zone: "south",
    beachfront: false,
    fact: "82 rooms, rooftop pool and 24-hour fitness centre a short walk inland on Jl. Kusuma Sari; kids-eat-free positioning.",
    bestFor: "Best value international-chain pick for families who don't need direct sand.",
    mapsUrl: mapsLink("Holiday Inn Bali Sanur"),
  },
];

export interface SanurThing {
  title: string;
  zone: string;
  blurb: string;
  mapsUrl?: string;
}

export const SANUR_THINGS_TO_DO: SanurThing[] = [
  {
    title: "Walk the beachfront path at sunrise",
    zone: "Whole beachfront",
    blurb:
      "Sanur is Bali's east-facing sunrise coast, with roughly 5 km of flat paved promenade from the harbour side down to Mertasari. The morning walk is the local ritual: coffee, sea air and no haggling.",
  },
  {
    title: "Cycle the promenade",
    zone: "Whole beachfront",
    blurb:
      "The same ~5 km path is cycle-friendly and continuous, which is rare in Bali. Rent a bike along Jl. Danau Tamblingan and ride the coast rather than fighting traffic.",
  },
  {
    title: "Swim — but time the tide",
    zone: "Calmer central & south sections",
    blurb:
      "The offshore reef makes Sanur calmer and shallower than south Bali's surf beaches, which suits gentle bathing and family play. At low tide the lagoon can get too shallow for a satisfying swim, so go when the tide is in.",
  },
  {
    title: "Le Mayeur Museum",
    zone: "North · near Bali Beach Hotel",
    blurb:
      "Sanur's most distinctive cultural stop: the seaside home of Adrien-Jean Le Mayeur, with a collection of 88 paintings. The best way to add texture to a stay without leaving the district.",
    mapsUrl: mapsLink("Museum Le Mayeur"),
  },
  {
    title: "Mertasari Beach",
    zone: "South end",
    blurb:
      "The quieter, family-friendlier southern end of the promenade, and a good place to reset when central Sanur feels too built-up.",
    mapsUrl: mapsLink("Mertasari Beach"),
  },
  {
    title: "Sindhu Night Market",
    zone: "Central-north, inland",
    blurb:
      "A low-key local-food option for the evening. Sanur nights are mild rather than wild. A food stop and a promenade walk suit the town better than manufactured nightlife.",
    mapsUrl: mapsLink("Sindhu Night Market"),
  },
  {
    title: "Paddleboard or aqua yoga",
    zone: "Sanur beachfront waters",
    blurb:
      "The calm reef-protected water makes Sanur one of the more reasonable places in Bali to try SUP or aqua yoga. Both are about balance rather than adrenaline.",
  },
  {
    title: "Fast boat to Nusa Penida or Lembongan",
    zone: "North · Sanur Harbour / Matahari Terbit",
    blurb:
      "From Sanur's modern harbour terminal (operational since 2022), daily fast boats run to the Nusa islands, typically a 30–60 minute crossing. You can sleep somewhere calm and still make the islands work. Check your operator's exact departure point, luggage and weather rules before booking.",
    mapsUrl: mapsLink("Sanur Harbour"),
  },
];

export const SANUR_FAQ = [
  {
    q: "Is Sanur worth staying in, or is it too quiet?",
    a: "It depends on what you want. Sanur is the calm, walkable, family-friendly base: a flat promenade, a gentle sea and easy mornings. It's also one of Bali's cleanest fast-boat gateways to the Nusa islands. If your trip is built around nightlife, beach clubs or dense café-hopping, it will feel too gentle; choose Canggu, Seminyak or Uluwatu instead.",
  },
  {
    q: "Which part of Sanur should I stay in?",
    a: "North (Matahari Terbit / Sanur Harbour) is best if you're building the trip around boat departures. Central (Jl. Danau Tamblingan) is the classic all-round zone with the best mix of beach, dining and walkable access. South (Semawang / Cemara / Mertasari) is quieter and more family-beach in mood.",
  },
  {
    q: "Can you swim in Sanur?",
    a: "Yes, gently. The reef makes the water calm and shallow, which suits family play and relaxed bathing. Low tide can leave the lagoon too shallow for a real swim, so it's best when the tide is in. Sanur isn't an all-day surf coast.",
  },
  {
    q: "Sunrise or sunset in Sanur?",
    a: "Sunrise. Sanur faces east and is known as Bali's 'Sunrise Beach'. The morning on the promenade is the centre of a stay here. For sunset, head to the west coast: Canggu, Seminyak or Uluwatu.",
  },
  {
    q: "Is Sanur good for families?",
    a: "Unusually so. The promenade is flat and stroller-friendly, and the water is calmer. Moving around is less tiring than in busier parts of south Bali. That's why it suits families, long-stay travellers and retirees.",
  },
];
