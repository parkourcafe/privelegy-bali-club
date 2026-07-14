// Jimbaran district product content (pillar + /things-to-do).
//
// Like lib/sanur/content.ts and lib/nusa-dua/content.ts, this is a code registry
// of ATTRACTIONS / BEACHES for the district pillar — NOT rows in the `venues`
// table. Jimbaran is planning_only, so items link only to Google Maps / neutral
// info, never to perks, QR or booking monetization (guardrail #4). Facts are
// from a verified web-research pass (14 Jul 2026, first-party + authoritative
// sources); any field the pass could not verify is omitted rather than
// estimated (no invented content). Downsides appear only as fit-context, never
// as quality warnings (guardrail #7). Balangan Beach is deliberately excluded —
// it is Bukit/Uluwatu (Pecatu), not Jimbaran; GWK is annotated as Ungasan, the
// bay's gateway attraction rather than Jimbaran proper.

export const JIMBARAN_REVIEW_DATE = "2026-07-14";

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${query} Bali`
  )}`;
}

export interface JimbaranZone {
  label: string;
  character: string;
  swimming: string;
}

// The two distinct beach characters of the bay (verified).
export const JIMBARAN_ZONES: JimbaranZone[] = [
  {
    label: "Jimbaran Bay · Muaya / Kedonganan / Kelan",
    character:
      "One long west-facing crescent, sheltered by the curve of the bay: white sand, the seafood grills on the sand, and the local sunset spot. Kedonganan (north) has the fishing-village and fish-market character; Muaya (south) is the main dining-and-swimming strip.",
    swimming: "Calm and swimmable — the bay blocks the heavy swell that hits the surf coast, so it's family-safe.",
  },
  {
    label: "Tegal Wangi · cliff cove, south",
    character:
      "A small cliff-backed cove just south of the bay, reached on foot down a steep limestone path by the AYANA entrance. Caves, quieter, and a west-facing sunset.",
    swimming: "Not an open-swim beach — the draw is the natural low-tide rock pools (the 'natural jacuzzi'), best and safest at low tide.",
  },
];

export interface JimbaranThing {
  title: string;
  zone: string;
  blurb: string;
  mapsUrl?: string;
}

export const JIMBARAN_THINGS_TO_DO: JimbaranThing[] = [
  {
    title: "Seafood on the sand at sunset",
    zone: "Jimbaran Bay · three grill clusters",
    blurb:
      "Jimbaran's signature: rows of open-air grills set tables directly on the sand. You pick fish, prawns, squid or clams from the chilled display, it's weighed and grilled over coconut-husk coals, and served at candlelit beachside tables as the bay faces the sunset. Three clusters run north to south — Kelan, Kedonganan (by the fish market) and Muaya. Agree the price by weight before ordering.",
    mapsUrl: mapsLink("Muaya Beach Jimbaran seafood"),
  },
  {
    title: "Kedonganan Fish Market",
    zone: "North-central bay · Jl. Pantai Kedonganan",
    blurb:
      "Bali's big fresh-catch market, where the fishermen land the daily haul and sell by the kilo — snapper, tuna, lobster, crab, prawns, squid. Come early (around 6–7am) for the landings; nearby warungs will grill what you buy for a per-kilo fee.",
    mapsUrl: mapsLink("Kedonganan Fish Market Jimbaran"),
  },
  {
    title: "Tegal Wangi Beach & its tide pools",
    zone: "South · cliff path by AYANA",
    blurb:
      "A hidden cliff cove reached down a steep limestone path just south of the bay. At low tide, natural rock pools fill with seawater — the 'natural jacuzzi' — and it's a quiet, west-facing sunset spot. Wear proper shoes for the descent; it's a wild beach, not a serviced one.",
    mapsUrl: mapsLink("Tegal Wangi Beach Jimbaran"),
  },
  {
    title: "Swim & sunset at Muaya Beach",
    zone: "South bay · Pantai Muaya",
    blurb:
      "The main swimming beach: white sand, calm water with no heavy surf, and the local sunset gathering spot from around 5.30pm. Family-safe bathing by day, seafood grills by evening — the two-in-one that defines a Jimbaran stay.",
    mapsUrl: mapsLink("Pantai Muaya Jimbaran"),
  },
  {
    title: "Sunset at the Rock Bar (AYANA)",
    zone: "South headland · AYANA Bali",
    blurb:
      "Bali's best-known cliff-base sunset bar, set on natural rocks low to the sea and reached by the resort's cliff-side inclinator. Open from late afternoon; sunset seats are reservation-prioritised and it's cashless. Come for the setting and the light on the water.",
    mapsUrl: mapsLink("Rock Bar AYANA Jimbaran"),
  },
  {
    title: "GWK Cultural Park",
    zone: "Ungasan · ~20 min south (gateway attraction)",
    blurb:
      "The 121-metre Garuda Wisnu Kencana statue and its cliff-cut cultural park — hourly Balinese dance, a Barong show mid-afternoon and the big Kecak fire dance around 6pm at Lotus Pond. It sits up in Ungasan on the Bukit rather than Jimbaran proper, but it's the bay's standard half-day pairing. Open daily ~8am–10pm.",
    mapsUrl: mapsLink("GWK Cultural Park Garuda Wisnu Kencana Ungasan"),
  },
  {
    title: "Samasta Lifestyle Village",
    zone: "South · by Mövenpick Resort",
    blurb:
      "An open-air 'cultural mall' of dining, shops and services with regular Balinese cultural performances — the easy evening option if you want something beyond the beach without leaving Jimbaran.",
    mapsUrl: mapsLink("Samasta Lifestyle Village Jimbaran"),
  },
  {
    title: "Pura Ulun Siwi",
    zone: "Jimbaran village centre",
    blurb:
      "Jimbaran's own historic temple (believed 18th-century), on the village crossroads facing the traditional market — dedicated to the prosperity of the rice fields, with tiered meru shrines. An active temple: sarong required, no fee, visit outside ceremony days.",
    mapsUrl: mapsLink("Pura Ulun Siwi Jimbaran"),
  },
];

export const JIMBARAN_FAQ = [
  {
    q: "What is Jimbaran best for?",
    a: "Seafood at sunset and a calmer, resort-leaning base close to the airport. It suits couples and families who want swimmable bay beaches, a famous grilled-seafood dinner on the sand, and cliff-top resort dining — over an independent café or nightlife scene, which lives up in Canggu and Seminyak.",
  },
  {
    q: "Is the Jimbaran seafood on the beach worth it?",
    a: "Yes, if you time it right. The bay grills serve fresh seafood cooked over coconut husk at tables near the sand — go for sunset, agree the price by weight before ordering, and treat it as the experience it is. Three grill clusters run along the bay: Kelan, Kedonganan (by the fish market) and Muaya.",
  },
  {
    q: "Can you swim at Jimbaran Beach?",
    a: "Yes — Jimbaran Bay is calm and swimmable because the bay's shape blocks the heavy swell that hits Bali's exposed surf coast, which makes it one of the more family-safe beaches in the south. Tegal Wangi, just south, is a cliff cove for low-tide rock pools rather than an open swim.",
  },
  {
    q: "Is Jimbaran a good base near the airport?",
    a: "It's one of the closest calm areas to the airport (roughly 15–30 minutes depending on which end), which makes it an easy first or last night. The bay is swimmable and family-friendly; the headland resorts are quiet and polished.",
  },
  {
    q: "What is there to do in Jimbaran besides eat?",
    a: "The Kedonganan fish market in the morning, Tegal Wangi's hidden tide pools, a swim and sunset at Muaya, the Rock Bar for cliff-base sundowners, Samasta lifestyle village, and the village temple Pura Ulun Siwi — plus the GWK Cultural Park a short drive up in Ungasan.",
  },
];
