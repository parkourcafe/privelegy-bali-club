// Lightweight editorial landings for Bali's quiet corners — Sidemen, Amed,
// Munduk, Lovina. These districts are too thin for a programmatic /bali hub
// (docs/seo-strategy.md §1: publishing a thin venue-grid hub drags topical
// authority), but a *hand-crafted editorial* landing is a different thing: its
// value is unique, verifiable copy, not an auto-generated list — the same
// reasoning behind the planning_only pillars (Nusa Dua, Nusa Penida).
//
// Facts here are general-knowledge, verifiable destination facts (geography,
// what an area is known for), written as fit-context — who it suits / who it
// frustrates — not quality grades (guardrail #7). Unknowns (specific prices,
// hours, named venues) are omitted, not invented (§4). Public copy is English
// (§4.15). No perks/QR/booking: these are planning_only districts (§4).

export interface LightThing {
  title: string;
  blurb: string;
  mapsUrl?: string;
}

export interface LightDistrict {
  slug: string; // DB district slug (also the route path: /{slug})
  name: string; // display name
  region: string; // coarse compass area
  title: string; // <title> / H1-adjacent
  tagline: string; // one-line topline
  metaDescription: string;
  intro: string; // answer-first opening paragraph
  suits: string;
  frustrates: string;
  knownFor: LightThing[];
  practical: string[];
  faq: { q: string; a: string }[];
  // Neighbouring areas + the most relevant deep guides, hand-picked for the
  // internal-link mesh. Planning guides are appended separately.
  related: { href: string; title: string; blurb: string }[];
}

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Editorial review date for the light landings (verified-research pass).
export const LIGHT_DISTRICT_REVIEW_DATE = "2026-07-16";

export const LIGHT_DISTRICTS: LightDistrict[] = [
  {
    slug: "sidemen",
    name: "Sidemen",
    region: "East Bali valleys",
    title: "Sidemen guide — Bali's quiet green valley",
    tagline: "Sidemen · East Bali valleys",
    metaDescription:
      "A resident-curated Sidemen guide: the terraced rice-field valley under Mount Agung, who it suits, its slow village days, weaving heritage and the walks — often called the Ubud of a generation ago.",
    intro:
      "Sidemen is a quiet river valley in east Bali, an hour or so beyond Ubud, where terraced rice fields climb toward Mount Agung and the pace drops to almost nothing. It's often described as the Ubud of a generation ago — the same emerald terraces and village calm, without the traffic or the crowds. Come for the view, the walks and the quiet; not for beaches, nightlife or a dense café strip.",
    suits:
      "Slow travellers, couples and photographers who want rice-terrace scenery, gentle valley walks and a genuinely quiet base — and anyone curious about traditional Balinese weaving, which the valley has long been known for.",
    frustrates:
      "Anyone after beaches, nightlife, a walkable centre or lots to “do”. Sidemen is about landscape and stillness, and everything is spread out along winding valley roads.",
    knownFor: [
      {
        title: "Rice-terrace valley walks",
        blurb:
          "The reason to come: green terraces stepping up the valley, with Mount Agung at the head on a clear morning. Gentle, unhurried walks rather than serious hikes.",
        mapsUrl: mapsLink("Sidemen rice terraces Bali"),
      },
      {
        title: "Traditional weaving",
        blurb:
          "The valley is a long-standing weaving area, known for songket and ikat cloth; some family workshops welcome visitors to watch the looms.",
        mapsUrl: mapsLink("Sidemen weaving Bali"),
      },
      {
        title: "Mount Agung views",
        blurb:
          "Bali's highest and holiest volcano rises at the valley head. It's clearest in the early morning, before valley cloud builds through the day.",
        mapsUrl: mapsLink("Mount Agung viewpoint Sidemen"),
      },
      {
        title: "A base for east Bali",
        blurb:
          "The Besakih “Mother Temple” and the Tirta Gangga water palace are both within reach, and the road east to the Amed coast connects from here.",
        mapsUrl: mapsLink("Tirta Gangga water palace Bali"),
      },
    ],
    practical: [
      "It's spread out — you'll want a scooter or a hired driver; there's no walkable centre.",
      "Come for a clear morning — Agung and the terraces show best early, before the valley clouds over.",
      "Pair it with the east — Besakih, Tirta Gangga and the road to Amed all link from here.",
      "It's rural — ATMs, shops and dining are limited and mostly at guesthouses, so bring what you need.",
    ],
    faq: [
      {
        q: "What is Sidemen best for?",
        a: "Quiet rice-terrace scenery and slow village days in east Bali — often called the Ubud of a generation ago. It suits couples, photographers and anyone who wants stillness and green valley views over sights and nightlife.",
      },
      {
        q: "Is Sidemen worth visiting?",
        a: "If you want landscape and calm, yes — the terraced valley under Mount Agung is among Bali's prettiest and far quieter than Ubud. If you want beaches, nightlife or lots to do, it isn't the base for you.",
      },
      {
        q: "How many days do you need in Sidemen?",
        a: "A night or two is plenty for most: enough for a valley walk, a clear-morning Agung view and a slow day. It works well as a quiet stop between Ubud and the east coast or the islands.",
      },
      {
        q: "How do you get around Sidemen?",
        a: "By scooter or hired driver. The valley is spread along winding roads with no walkable centre and little public transport, so plan your transport before you arrive.",
      },
    ],
    related: [
      { href: "/ubud", title: "The Ubud guide", blurb: "The busier, greener culture hub an hour west — jungle, terraces and long dinners." },
      { href: "/amed", title: "The Amed guide", blurb: "The calm black-sand dive coast the valley road runs down to." },
    ],
  },
  {
    slug: "amed",
    name: "Amed",
    region: "East coast",
    title: "Amed guide — Bali's calm dive-and-snorkel coast",
    tagline: "Amed & the east coast · East Bali",
    metaDescription:
      "A resident-curated Amed guide: the black-sand fishing villages of Bali's far-east coast, easy shore snorkelling, the Tulamben Liberty wreck, freediving and a slow, low-key pace.",
    intro:
      "Amed is a string of black-sand fishing villages along Bali's dry, quiet far-east coast, where traditional jukung outriggers still line the beach and the sea is calm and clear. It's the island's easy underwater base — snorkelling straight off the beach, coral gardens, and, just up the coast at Tulamben, the USAT Liberty shipwreck, one of the world's most accessible wreck dives. Come for the water, the sunrises and the low-key pace.",
    suits:
      "Snorkellers, freedivers and divers, and travellers who want a calm sea and a slow, unpolished coast — sunrise over the water with Mount Agung rising behind.",
    frustrates:
      "Anyone after surf, nightlife or a resort scene. Amed is spread out and rustic, and its beaches are black volcanic sand and pebble rather than white.",
    knownFor: [
      {
        title: "Snorkelling off the beach",
        blurb:
          "Jemeluk Bay's coral garden and a small sunken Japanese wreck are reachable straight from shore — some of Bali's easiest, most rewarding snorkelling.",
        mapsUrl: mapsLink("Jemeluk Bay Amed snorkelling"),
      },
      {
        title: "The USAT Liberty wreck at Tulamben",
        blurb:
          "A large WWII-era shipwreck lying in shallow water just up the coast, dived and even snorkelled from the beach. One of Bali's signature dive sites.",
        mapsUrl: mapsLink("USAT Liberty wreck Tulamben"),
      },
      {
        title: "Freediving",
        blurb:
          "Amed is one of Asia's freediving hubs, with schools along the coast drawn by the calm, clear, easily accessible water.",
        mapsUrl: mapsLink("Amed freediving Bali"),
      },
      {
        title: "Jukung boats & sunrise",
        blurb:
          "The traditional fishing coast: colourful outrigger canoes on the sand at dawn, an east-facing sunrise over the sea, and Mount Agung as the backdrop.",
        mapsUrl: mapsLink("Amed beach jukung Bali"),
      },
    ],
    practical: [
      "It's a long, spread-out coast — “Amed” covers several villages over roughly 10 km, so pick your bay and expect to scooter between them.",
      "The sea is generally calm and beginner-friendly, but always check local conditions before you get in.",
      "Bring cash — ATMs are limited along the coast.",
      "Pair it with the east — Sidemen, Tirta Gangga and the round-the-east road all connect from here.",
    ],
    faq: [
      {
        q: "What is Amed best for?",
        a: "Snorkelling and diving. It's a calm, quiet stretch of black-sand fishing villages on Bali's far-east coast, with coral gardens off the beach and the famous USAT Liberty wreck nearby at Tulamben.",
      },
      {
        q: "Is Amed good for snorkelling?",
        a: "Yes — it's among Bali's best and easiest. Jemeluk Bay has coral and a small wreck reachable straight from the beach, and the Tulamben Liberty wreck is a short drive up the coast.",
      },
      {
        q: "Is Amed worth visiting?",
        a: "For divers, snorkellers and travellers who want a slow, low-key coast, very much so. It's quiet and spread out with black-sand beaches rather than white — not a resort or party base.",
      },
      {
        q: "How do you get to Amed?",
        a: "It's on the far east coast, roughly two to three hours by car from south Bali's airport and beaches. There's no fast option; most visitors come by private driver.",
      },
    ],
    related: [
      { href: "/sidemen", title: "The Sidemen guide", blurb: "The quiet green rice-terrace valley just inland, under Mount Agung." },
      { href: "/ubud", title: "The Ubud guide", blurb: "The central culture hub, a natural pairing on the way east." },
    ],
  },
  {
    slug: "munduk",
    name: "Munduk",
    region: "North-central highlands",
    title: "Munduk guide — Bali's waterfall highlands",
    tagline: "Munduk & the highlands · North-central Bali",
    metaDescription:
      "A resident-curated Munduk guide: the cool mountain village above Bali's twin northern lakes, its cluster of waterfalls, coffee country and cool-climate hiking.",
    intro:
      "Munduk is a mountain village in Bali's cool northern highlands, set among coffee and clove plantations above the twin crater lakes of Buyan and Tamblingan. It's waterfall-and-hiking country — misty mornings, forest trails and a string of falls within a short drive — at an altitude where you'll actually want a jumper at night. Come for the green, the cool and the walks.",
    suits:
      "Hikers, nature lovers and travellers who want cool air, waterfalls and lake scenery — a complete change of climate from the hot coast.",
    frustrates:
      "Beach and nightlife travellers. It's remote and quiet, often misty or wet, and the highlands are for slow days outdoors rather than dining or shopping.",
    knownFor: [
      {
        title: "Waterfalls",
        blurb:
          "Munduk is ringed by falls — the Munduk and Melanting falls and the Banyumala twin waterfalls among them — several linked by short forest walks.",
        mapsUrl: mapsLink("Munduk waterfall Bali"),
      },
      {
        title: "The twin lakes",
        blurb:
          "Lakes Buyan and Tamblingan sit side by side in an old crater, with a forested ridge walk and viewpoints between them.",
        mapsUrl: mapsLink("Lake Buyan Tamblingan Bali"),
      },
      {
        title: "Coffee & clove country",
        blurb:
          "The surrounding hills are working plantations; small roadside coffee stops and plantation walks are part of the appeal.",
        mapsUrl: mapsLink("Munduk coffee plantation Bali"),
      },
      {
        title: "The Bedugul lakes nearby",
        blurb:
          "The Bedugul highlands, including the much-photographed Ulun Danu Beratan lake temple, are within reach on the main north road.",
        mapsUrl: mapsLink("Ulun Danu Beratan temple Bali"),
      },
    ],
    practical: [
      "Bring a layer — it's high and cool, especially mornings and evenings, and rain is common.",
      "Roads are winding mountain switchbacks; allow more time than the distance suggests.",
      "Waterfall trails can be steep and slippery — wear shoes with grip.",
      "Pair it with Bedugul — the lake temple and the highlands sit on the same north road.",
    ],
    faq: [
      {
        q: "What is Munduk best for?",
        a: "Waterfalls, hiking and cool mountain air. It's a highland village above Bali's twin northern lakes, surrounded by coffee plantations and a cluster of accessible waterfalls.",
      },
      {
        q: "Is Munduk worth visiting?",
        a: "If you like nature, walks and a cool change from the coast, yes — it's one of Bali's prettiest highland areas. It's remote and quiet, so it suits beach and nightlife travellers less.",
      },
      {
        q: "What is there to do in Munduk?",
        a: "Walk to the waterfalls, hike the ridge between Lakes Buyan and Tamblingan, visit a coffee plantation, and reach the Bedugul lake temple nearby.",
      },
      {
        q: "How cold does Munduk get?",
        a: "Cool by Bali standards — the altitude means comfortable days and genuinely chilly, often misty mornings and evenings. Bring a warm layer and a rain jacket.",
      },
    ],
    related: [
      { href: "/lovina", title: "The Lovina guide", blurb: "The calm north coast the mountain road drops down to." },
      { href: "/ubud", title: "The Ubud guide", blurb: "The greener central hub, a common base before heading up into the hills." },
    ],
  },
  {
    slug: "lovina",
    name: "Lovina",
    region: "North coast",
    title: "Lovina guide — Bali's quiet north coast",
    tagline: "Lovina · North coast",
    metaDescription:
      "A resident-curated Lovina guide: the calm black-sand beaches of Bali's quiet north coast, who it suits, the dawn dolphin trips (and their welfare caveat), hot springs and nearby temples.",
    intro:
      "Lovina is a stretch of calm, black-sand beach on Bali's quiet north coast, centred on the village of Kalibukbuk. It's a slower, cheaper, far less crowded side of the island — flat, gentle sea, low-key evenings, and a handful of hot springs and temples nearby. It's best known for its dawn dolphin boat trips, though those come with a welfare caveat worth reading before you book. Come for calm and quiet, not for surf or a scene.",
    suits:
      "Budget and long-stay travellers, and anyone wanting a genuinely quiet, low-key base far from the southern crowds, with calm water and easy mornings.",
    frustrates:
      "Travellers after white-sand beaches, surf or nightlife. The sea is calm and the sand is black volcanic, and the north is a long way from the south's sights.",
    knownFor: [
      {
        title: "The quiet north-coast beach",
        blurb:
          "Calm, flat black-sand shoreline — good for easy swims, long stays and slow mornings well away from the southern crowds.",
        mapsUrl: mapsLink("Lovina Beach Kalibukbuk Bali"),
      },
      {
        title: "Dawn dolphin trips — know before you book",
        blurb:
          "The local signature: small boats head out at sunrise to see wild dolphins. They're popular but have drawn criticism for crowding and pressuring the animals — if you go, choose an operator that keeps a respectful distance, and many travellers now skip it on welfare grounds.",
        mapsUrl: mapsLink("Lovina dolphin tour Bali"),
      },
      {
        title: "Banjar hot springs",
        blurb:
          "Natural sulphur hot-spring pools in a garden setting, a short drive west — an easy, relaxed half-day from the beach.",
        mapsUrl: mapsLink("Banjar hot springs Bali"),
      },
      {
        title: "Brahmavihara-Arama",
        blurb:
          "Bali's largest Buddhist monastery, set in the hills nearby with valley views — a quiet, contemplative stop.",
        mapsUrl: mapsLink("Brahmavihara Arama monastery Bali"),
      },
    ],
    practical: [
      "It's a long way from the south — roughly three hours by car over the central mountains; plan it as its own leg, not a day trip.",
      "Black sand and calm sea — gentle for swimming, but not a surf or white-sand beach.",
      "Choose dolphin trips carefully — if you go, pick a responsible operator; many travellers now skip the trip on welfare grounds.",
      "Pair it with the highlands — Munduk, the lakes and the hot springs make a natural north-Bali loop.",
    ],
    faq: [
      {
        q: "What is Lovina best for?",
        a: "A quiet, cheap, low-key beach base on Bali's north coast, with calm black-sand shores and a far slower pace than the south. It suits budget and long-stay travellers.",
      },
      {
        q: "Is Lovina worth visiting?",
        a: "If you want quiet and calm water far from the crowds — and you're happy with black sand over white — yes. It's remote from the south's sights, so it works best as part of a north-Bali loop.",
      },
      {
        q: "Are the Lovina dolphin tours ethical?",
        a: "They're the area's signature trip but controversial: boats can crowd and pressure the wild dolphins. If you go, choose an operator that keeps a respectful distance — and be aware many travellers now skip it on welfare grounds.",
      },
      {
        q: "How do you get to Lovina?",
        a: "By car over the central mountains from the south, roughly three hours, often combined with Munduk and the lakes. There's no fast route — it's the far north coast.",
      },
    ],
    related: [
      { href: "/munduk", title: "The Munduk guide", blurb: "The waterfall highlands just up the mountain road — a natural north-Bali pairing." },
      { href: "/ubud", title: "The Ubud guide", blurb: "The central hub most travellers pass through on the way north." },
    ],
  },
];

export const LIGHT_DISTRICT_SLUGS = LIGHT_DISTRICTS.map((d) => d.slug);

export function getLightDistrict(slug: string): LightDistrict | undefined {
  return LIGHT_DISTRICTS.find((d) => d.slug === slug);
}
