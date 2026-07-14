// Ubud "things to do" — a small editorial registry of the district's signature
// sights and experiences (not venues in the catalogue), mirroring
// lib/sanur/content.ts. Static config, no DB entity (guardrail #11). Facts are
// well-established and verifiable; descriptions are factual and practical, no
// hype (guardrail #7). Ubud stays planning_only — no money loop.

export const UBUD_REVIEW_DATE = "2026-07-14";

export interface UbudThing {
  title: string;
  area: string;
  blurb: string;
  mapsUrl?: string;
}

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q} Ubud Bali`)}`;

export const UBUD_THINGS_TO_DO: UbudThing[] = [
  {
    title: "Walk the Campuhan Ridge",
    area: "Central Ubud",
    blurb:
      "A free, easy ridge walk on a paved path between two river valleys, with open grass hills on either side. Go at sunrise or late afternoon — there's little shade, so the middle of the day is hot.",
    mapsUrl: maps("Campuhan Ridge Walk"),
  },
  {
    title: "Sacred Monkey Forest Sanctuary",
    area: "Central Ubud (Padangtegal)",
    blurb:
      "A forest temple complex in the middle of town, home to hundreds of long-tailed macaques among ancient banyans and moss-covered shrines. Keep bags zipped and don't carry loose food — the monkeys are bold.",
    mapsUrl: maps("Sacred Monkey Forest Sanctuary"),
  },
  {
    title: "Tegallalang Rice Terraces",
    area: "North of Ubud (~30 min)",
    blurb:
      "The famous stepped rice valley carved along the traditional Balinese subak irrigation system. Go early to beat the crowds and the heat; expect small donation gates and swings on the way down into the terraces.",
    mapsUrl: maps("Tegallalang Rice Terraces"),
  },
  {
    title: "Ubud Palace & a Balinese dance performance",
    area: "Central Ubud",
    blurb:
      "Puri Saren Agung, the royal palace, sits at the town's main crossroads and hosts nightly traditional dance performances (Legong, Barong and others) in its courtyard. Tickets are sold at the gate in the afternoon.",
    mapsUrl: maps("Ubud Palace Puri Saren"),
  },
  {
    title: "Saraswati Temple (Pura Taman Saraswati)",
    area: "Central Ubud",
    blurb:
      "A small, photogenic water temple with a lotus-pond approach, tucked just off the main street behind a café. Free to view from the walkway; dance performances are also held here some evenings.",
    mapsUrl: maps("Pura Taman Saraswati"),
  },
  {
    title: "Browse Ubud Art Market",
    area: "Central Ubud (opposite the palace)",
    blurb:
      "Pasar Seni Ubud sells crafts, textiles, baskets and souvenirs across two floors, busiest in the morning. Prices are negotiable — bargaining is expected.",
    mapsUrl: maps("Ubud Art Market Pasar Seni"),
  },
  {
    title: "Goa Gajah (Elephant Cave)",
    area: "East of Ubud (~15 min)",
    blurb:
      "A 9th–11th-century archaeological site with a carved cave mouth, bathing pools and a temple set in green grounds. A sarong is required and provided at the entrance.",
    mapsUrl: maps("Goa Gajah Elephant Cave"),
  },
  {
    title: "Chase a waterfall — Tegenungan or Tibumana",
    area: "South/east of Ubud (~30–45 min)",
    blurb:
      "Tegenungan is the closest and most accessible falls (busier, with a steep stair down); Tibumana is smaller and calmer. Both are day-trip distance from central Ubud.",
    mapsUrl: maps("Tegenungan Waterfall"),
  },
  {
    title: "See Balinese art at a museum",
    area: "Central Ubud & Peliatan",
    blurb:
      "Ubud is Bali's art heartland. Museum Puri Lukisan (in town), ARMA (Agung Rai Museum of Art, Peliatan) and the Blanco Renaissance Museum each hold strong collections of Balinese and Indonesian painting.",
    mapsUrl: maps("Museum Puri Lukisan"),
  },
  {
    title: "Take a yoga class or a cooking class",
    area: "Central Ubud & Penestanan",
    blurb:
      "Ubud is Bali's wellness capital, with daily drop-in yoga and meditation, plus traditional Balinese cooking classes that usually start with a market visit. See our yoga & wellness guide for the studios.",
  },
];
