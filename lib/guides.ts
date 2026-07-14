// Registry of long-form editorial guides (the top-of-funnel SEO/AEO articles,
// e.g. "Where to stay in Bali for the first time"). Static config — no DB
// entity (guardrail #11), same pattern as lib/scenarios.ts and lib/pillars.ts.
// Single source of truth so the sitemap and llms.txt can enumerate guides
// without drifting.
//
// Two shapes render from this file:
//  - Guides with only slug/title/description have a BESPOKE route (e.g.
//    /where-to-stay-in-bali) with a hand-built layout.
//  - Guides that also carry `lede`/`sections`/`faq`/`related` render through the
//    generic <GuideArticle> component from a thin route file.
// All guardrails apply: no invented facts, fit-context only (never a quality
// warning, #7), prices/figures as ranges, English-only.

import type { Metadata } from "next";

export interface GuideSection {
  heading: string;
  paras: string[];
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface GuideRelated {
  href: string;
  title: string;
  blurb: string;
}

export interface Guide {
  slug: string; // URL segment at the site root
  title: string; // H1 / sitemap label
  description: string; // meta description (~150 chars, human-written)
  eyebrow?: string; // short breadcrumb/label
  lede?: string; // answer-first opening paragraph
  sections?: GuideSection[];
  faq?: GuideFaq[];
  related?: GuideRelated[];
}

const PILLAR_LINKS: GuideRelated[] = [
  { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "Which of the five first-timer areas fits your trip." },
  { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
  { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
  { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
];

export const GUIDES: Guide[] = [
  {
    slug: "where-to-stay-in-bali",
    title: "Where to stay in Bali for the first time",
    description:
      "Canggu, Seminyak, Uluwatu, Ubud or Sanur? How Bali's five first-timer areas actually differ — and how to pick the right base for your first trip.",
  },

  {
    // Bespoke, data-driven route (app/best-beach-clubs-in-bali) — registry
    // entry is metadata-only so the sitemap enumerates it.
    slug: "best-beach-clubs-in-bali",
    title: "The best beach clubs in Bali",
    description:
      "Bali's best beach clubs by area — clifftop sunsets in Uluwatu, the Seminyak classics, Canggu's Echo Beach line-up, and calm family options in the south.",
  },

  {
    // Bespoke, data-driven route (app/best-coffee-in-bali) — curated specialty
    // roasters/cafés; registry entry is metadata-only for the sitemap.
    slug: "best-coffee-in-bali",
    title: "The best specialty coffee in Bali",
    description:
      "Where to find serious coffee in Bali — the roasters and specialty cafés across Canggu, Seminyak, Ubud and Uluwatu that treat coffee as the craft.",
  },

  {
    // Bespoke, data-driven route (app/best-spas-in-bali) — metadata only.
    slug: "best-spas-in-bali",
    title: "The best spas & wellness in Bali",
    description:
      "Bali's best spas and wellness by area — Ubud's healing centres, the Seminyak spa strip, Canggu recovery, and calm coastal treatments. Sorted by district.",
  },
  {
    // Bespoke, data-driven route (app/where-to-watch-sunset-in-bali) — metadata only.
    slug: "where-to-watch-sunset-in-bali",
    title: "Where to watch the sunset in Bali",
    description:
      "The best sunset spots in Bali by area — Uluwatu's clifftop bars, the Seminyak and Canggu beach clubs, and calm-bay options in the south. Where to be at golden hour.",
  },
  {
    // Bespoke, data-driven route (app/best-warungs-in-bali) — metadata only.
    slug: "best-warungs-in-bali",
    title: "The best warungs & local food in Bali",
    description:
      "Where to eat cheap, authentic local food in Bali — the warungs and babi guling stalls we rate, district by district, from Canggu and Ubud to the south.",
  },

  {
    slug: "how-many-days-in-bali",
    eyebrow: "How many days in Bali",
    title: "How many days do you need in Bali?",
    description:
      "For a first trip, plan 7–10 days in Bali: a few inland in Ubud and a few by the sea. Here's what fits in 5, 7, 10 and 14 days.",
    lede: "For a first trip, plan on 7 to 10 days in Bali — enough to split your time between one inland base and one by the sea without living in traffic. Five days works if you stay in a single area; two weeks lets you add the islands or the east without rushing.",
    sections: [
      {
        heading: "5 days: pick one base",
        paras: [
          "Five days is a single-area trip. Choose one place — Canggu or Seminyak for beach-and-café energy, Ubud for jungle and culture — and go deep rather than wide.",
          "You'll lose most of a day each to arrival and departure, so you really have three full days. Spend them settling in, not scootering across the island for a photo.",
        ],
      },
      {
        heading: "7 days: one inland + one coastal base",
        paras: [
          "A week is the sweet spot for a first trip. The classic split is three or four nights in Ubud for temples, rice terraces and yoga, then three or four by the sea in Canggu, Seminyak or Uluwatu.",
          "Two bases, one move. That single transfer costs you a half-day; anything more and the trip becomes about logistics.",
        ],
      },
      {
        heading: "10 days: add a third pace",
        paras: [
          "Ten days lets you add a slower coastal stretch — Sanur as a calm family base and launchpad to the Nusa islands, or Uluwatu for clifftop sunsets — on top of the Ubud-plus-beach core.",
          "This is the most comfortable length for a first visit: room for a rest day, a day trip, and a spontaneous afternoon.",
        ],
      },
      {
        heading: "14 days: go wider",
        paras: [
          "Two weeks opens up the quieter side of Bali — the east (Amed, Sidemen), the Nusa islands, or a few nights on Gili or Lombok — without cutting the first-timer highlights.",
          "Even here, keep bases to three or four. Distance in Bali is measured in traffic, not kilometres.",
        ],
      },
    ],
    faq: [
      { q: "Is 5 days enough for Bali?", a: "Enough for one area done well — pick a single base and don't try to see the whole island. For Ubud plus a beach area, you want at least 7 days." },
      { q: "Is a week enough for Bali?", a: "Yes. Seven days is the sweet spot for a first trip: a few nights inland in Ubud and a few by the sea, with one transfer between them." },
      { q: "How long to see Bali and the islands?", a: "Plan 10–14 days if you want to add the Nusa islands, the east coast, or Gili/Lombok on top of the mainland first-timer route." },
      { q: "How many places should I stay in?", a: "One or two on a short trip, three or four on two weeks. Each move costs the better part of a day in traffic, so fewer bases means more Bali." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "bali-itinerary-7-days",
    eyebrow: "7-day Bali itinerary",
    title: "Bali itinerary: 7 days for first-timers",
    description:
      "A relaxed 7-day Bali itinerary for a first trip: a few nights in Ubud for jungle and culture, then the coast for surf, cafés and sunsets — with minimal driving.",
    lede: "This is a calm, first-timer 7-day Bali itinerary built around two bases and one transfer: three nights in Ubud for jungle, temples and slow mornings, then four on the coast for surf, cafés and sunsets. It keeps driving to a minimum so the week feels like a holiday, not a road trip.",
    sections: [
      {
        heading: "Days 1–3: Ubud (jungle and culture)",
        paras: [
          "Land, settle, and let the first evening be an easy dinner near your stay — don't schedule anything after a long flight.",
          "Give the next two days to the inland highlights: rice terraces, a temple or two, a waterfall, a morning of yoga, and long slow dinners. Ubud is where Bali is green and cool, so front-load the culture before the beach.",
          "Keep the pace gentle. Ubud rewards mornings — go early to the terraces and temples before the tour buses, then rest through the heat.",
        ],
      },
      {
        heading: "Day 4: transfer to the coast",
        paras: [
          "Move to your beach base — Canggu for surf-and-café energy, Seminyak for polished dining, or Uluwatu for clifftop drama. The drive from Ubud is roughly 1.5–2 hours depending on traffic and where you land.",
          "Arrive with the afternoon free for a first swim, a sunset, and an easy dinner. Don't over-plan a transfer day.",
        ],
      },
      {
        heading: "Days 5–7: the coast (surf, cafés, sunsets)",
        paras: [
          "Fall into the coastal rhythm: a work-friendly café or surf in the morning, a long lunch, a spa or a pool through the heat, then a sunset spot and dinner near where you sleep.",
          "Book the few things worth booking — a sunset table, a proper dinner — before you land, so you're never deciding at 7pm with a hungry group.",
          "Leave the last morning loose. Traffic to the airport is unpredictable, so build in a real buffer for your flight out.",
        ],
      },
    ],
    faq: [
      { q: "Is 7 days enough for a first trip to Bali?", a: "Yes — a week is the sweet spot. Split it between one inland base (Ubud) and one coastal base, with a single transfer, and you'll see the highlights without living in traffic." },
      { q: "Should I start in Ubud or the beach?", a: "Either works, but many first-timers start in Ubud for culture and nature while fresh, then finish by the sea to wind down before flying home." },
      { q: "How much time do I lose to travel?", a: "Count on losing part of day one to arrival, part of the last day to departure, and a half-day for the Ubud-to-coast transfer. Plan around it rather than fighting it." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "bali-itinerary-10-days",
    eyebrow: "10-day Bali itinerary",
    title: "Bali itinerary: 10 to 14 days",
    description:
      "A 10–14 day Bali itinerary that adds a third pace to the first-timer route: Ubud, the coast, and the quieter islands or east — without rushing.",
    lede: "With 10 to 14 days you can keep the relaxed first-timer core — Ubud plus a beach base — and add a third pace: the Nusa islands, the quieter east, or clifftop Uluwatu. The trick is still restraint: three or four bases at most, so the trip stays a holiday rather than a logistics exercise.",
    sections: [
      {
        heading: "Days 1–3: Ubud",
        paras: [
          "Start inland while you're fresh: rice terraces, temples, a waterfall, yoga and slow dinners. Go early to the highlights and rest through the heat.",
        ],
      },
      {
        heading: "Days 4–7: the west coast",
        paras: [
          "Move to Canggu or Seminyak for surf, cafés, beach clubs and the island's densest dinner scene. This is the social, energetic stretch of the trip.",
          "Book sunset tables and popular dinners ahead — these fill up, especially in July and August.",
        ],
      },
      {
        heading: "Days 8–10: add the islands or the Bukit",
        paras: [
          "For turquoise water and a change of scene, take the fast boat from Sanur to Nusa Penida or Nusa Lembongan for two or three nights.",
          "Prefer to stay on the mainland? Base in Uluwatu on the southern Bukit for clifftop sunsets and world-class surf beaches.",
        ],
      },
      {
        heading: "Days 11–14 (if you have them): the quiet side",
        paras: [
          "Two full weeks is enough to reach the calm east — Amed for diving and black-sand quiet, or Sidemen for rice-valley stillness — or to add a few nights on Gili or Lombok.",
          "Keep transfers few and deliberate. Even at two weeks, distance in Bali is measured in traffic, not kilometres.",
        ],
      },
    ],
    faq: [
      { q: "Is 10 days too long for Bali?", a: "No — 10 days is the most comfortable length for a first visit, with room for a rest day, a day trip and a spontaneous afternoon on top of the highlights." },
      { q: "Can I add Nusa Penida to a Bali trip?", a: "Yes. Fast boats leave from Sanur and take roughly 30–45 minutes. Two or three nights lets you see the famous viewpoints without a rushed day trip." },
      { q: "How many bases for two weeks?", a: "Three or four. More than that and you spend the trip packing and sitting in traffic instead of enjoying each place." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "best-time-to-visit-bali",
    eyebrow: "Best time to visit Bali",
    title: "The best time to visit Bali",
    description:
      "Bali's dry season (roughly April–October) brings the best weather; the wet season (November–March) is greener and quieter. Here's how to choose.",
    lede: "The best time to visit Bali is the dry season, roughly April to October, when days are sunny and humidity is lower. The shoulder months — May, June and September — hit the sweet spot: good weather without the July–August peak crowds. The wet season, November to March, is greener, cheaper and quieter, with short heavy downpours rather than all-day rain.",
    sections: [
      {
        heading: "Dry season (April–October): the reliable choice",
        paras: [
          "Expect sunny days, lower humidity and calmer seas on the west and south coasts. This is peak surf season for the famous Bukit breaks.",
          "July and August are the busiest and priciest months — European and Australian holidays overlap. Book accommodation and popular dinners well ahead if you travel then.",
        ],
      },
      {
        heading: "Shoulder months (May, June, September): the sweet spot",
        paras: [
          "These months give you dry-season weather without peak-season crowds and rates. If you can choose freely, aim here.",
        ],
      },
      {
        heading: "Wet season (November–March): green and quiet",
        paras: [
          "Rain usually comes as short, heavy afternoon downpours rather than all-day grey — you can still plan around it. The landscape is at its greenest and the rice terraces most photogenic.",
          "Prices soften and popular spots are calmer. Ubud and inland areas see more rain than the south; pack for humidity and a daily shower.",
          "Note Nyepi, the Balinese Day of Silence (usually in March): the whole island shuts down for 24 hours, including the airport. Plan around the date if you travel in early spring.",
        ],
      },
    ],
    faq: [
      { q: "What is the best month to visit Bali?", a: "May, June and September offer the best balance — dry-season weather without the July–August crowds and prices." },
      { q: "Is the rainy season a bad time for Bali?", a: "Not at all. November–March is greener, quieter and cheaper, with short heavy downpours rather than constant rain. Just build flexibility into beach days." },
      { q: "When is Bali most crowded?", a: "July and August, plus the Christmas–New Year period. Book accommodation and popular restaurants further ahead for those windows." },
      { q: "What is Nyepi and does it affect my trip?", a: "Nyepi is the Balinese Day of Silence, usually in March. For 24 hours the island — including the airport — shuts down. Check the date if you travel in early spring." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "how-to-get-around-bali",
    eyebrow: "Getting around Bali",
    title: "How to get around Bali",
    description:
      "Scooter, private driver, or ride-hailing apps? How to get around Bali, what each option roughly costs, and when to use which.",
    lede: "Most travellers get around Bali three ways: a rented scooter for short local hops, a private driver for day trips and longer transfers, and ride-hailing apps (Grab and Gojek) for quick point-to-point rides. There's no train and no metro, traffic is heavy all day, and distances that look short on a map can take an hour — so plan by time, not kilometres.",
    sections: [
      {
        heading: "Scooter: freedom for short hops",
        paras: [
          "A rented scooter is how most long-stay travellers move around Canggu, Uluwatu and Ubud. It's cheap and frees you from waiting on rides, typically a modest daily rate.",
          "Ride only if you're confident: Bali traffic is chaotic, roads can be rough, and accidents are common. You legally need an International Driving Permit with a motorcycle category — police do check, and your travel insurance won't pay out without it. Always wear a helmet.",
        ],
      },
      {
        heading: "Private driver: best for day trips and transfers",
        paras: [
          "For airport transfers, temple-and-waterfall day trips, or moving between bases, a private driver is the easy, comfortable option — usually booked by the day or the trip.",
          "Drivers double as guides and wait for you between stops. It's the stress-free way to cover longer distances or travel as a group or family.",
        ],
      },
      {
        heading: "Ride-hailing: Grab and Gojek",
        paras: [
          "The Grab and Gojek apps handle quick point-to-point rides (car or motorbike) at metered app prices — the simplest way to get a fair fare without haggling.",
          "In some tourist areas local transport cooperatives restrict app pickups, so you may be asked to walk to a nearby meeting point. Metered Bluebird taxis are a reliable fallback.",
        ],
      },
      {
        heading: "Plan by time, not distance",
        paras: [
          "Traffic is constant, especially in Canggu, Seminyak and around Ubud. A 10 km trip can take an hour at the wrong time of day.",
          "This is why choosing one or two bases matters more than any transport hack — the less you move between areas, the more of Bali you actually see.",
        ],
      },
    ],
    faq: [
      { q: "Do I need a licence to rent a scooter in Bali?", a: "Yes — an International Driving Permit with a motorcycle category, plus your home licence. Police do check, and travel insurance won't cover an accident without it." },
      { q: "Is Grab available in Bali?", a: "Yes, Grab and Gojek both work for cars and motorbikes. In some tourist zones app pickups are restricted, so you may need to walk to a nearby meeting point." },
      { q: "How much is a private driver in Bali?", a: "Drivers are usually hired by the day or per trip and are a good-value option for day trips, transfers and groups. Agree the route and price before you set off." },
      { q: "Is it easy to get around Bali without a scooter?", a: "Yes — ride-hailing apps and private drivers cover most needs. Just plan by travel time, because traffic makes even short distances slow." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "best-area-to-stay-in-bali-for-couples",
    eyebrow: "Bali for couples",
    title: "The best area to stay in Bali for couples",
    description:
      "For couples, Uluwatu brings clifftop sunsets and romance, Ubud brings jungle calm, and Seminyak brings polished dining. Here's how to choose.",
    lede: "For a couples' trip, three Bali areas do romance best: Uluwatu for clifftop sunsets and drama, Ubud for jungle calm and spa mornings, and Seminyak for polished dinners and easy beach-club evenings. Which one depends on whether you want views, greenery, or effortless comfort — and many couples pair two.",
    sections: [
      {
        heading: "Uluwatu — sunsets and drama",
        paras: [
          "The southern Bukit is Bali at its most cinematic: limestone cliffs, turquoise coves and clifftop bars where the sunset is the whole evening. It's spread out and you'll drive between spots, which trades convenience for views and quiet.",
          "Best for couples who want the wow — big scenery, long sunset dinners, and a sense of escape.",
        ],
      },
      {
        heading: "Ubud — jungle calm and slow mornings",
        paras: [
          "Inland in the hills, Ubud is green, cool and unhurried: rice-terrace walks, couples' spa treatments, yoga and long slow dinners. There's no beach, so it suits couples who want nature and stillness over sand.",
          "Pair it with a coastal area for the best of both — a few nights inland, a few by the sea.",
        ],
      },
      {
        heading: "Seminyak — polished and easy",
        paras: [
          "If you'd rather everything be close and effortless, Seminyak delivers: a spa in the afternoon, a west-facing sunset, and a considered dinner, all walkable. It's the low-effort romantic base.",
        ],
      },
    ],
    faq: [
      { q: "Where is the most romantic place to stay in Bali?", a: "Uluwatu for clifftop sunsets and drama, or Ubud for jungle calm and spa mornings. Seminyak is the easy, polished option if you want everything close." },
      { q: "Is Ubud or the beach better for couples?", a: "Both — many couples split the trip, a few nights inland in Ubud for calm and nature, then a few by the sea in Uluwatu or Seminyak for sunsets and dining." },
      { q: "Where's the best sunset for a couple?", a: "The west and south coasts — Uluwatu, Seminyak and Canggu all face the sunset. Uluwatu's clifftop bars are the most dramatic." },
    ],
    related: [
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
      { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, long slow dinners." },
      { href: "/seminyak", title: "The Seminyak guide", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
      { href: "/romantic-bali", title: "Romantic Bali", blurb: "Plan a couples' trip around the right moments." },
    ],
  },

  {
    slug: "best-area-to-stay-in-bali-for-families",
    eyebrow: "Bali for families",
    title: "The best area to stay in Bali for families",
    description:
      "For families, Sanur and Nusa Dua offer calm, swimmable beaches and easy days; Ubud adds nature and space. How to choose a family base in Bali.",
    lede: "For a family trip, the calmest, easiest Bali bases are Sanur and Nusa Dua — both have gentle, swimmable water, flat walkable fronts and short, simple days. Ubud adds nature and space for older kids. The livelier surf towns work too, but with more traffic and stronger currents to manage.",
    sections: [
      {
        heading: "Sanur — calm, walkable, low-key",
        paras: [
          "A quiet east-coast town with a long, flat paved beach path (great for strollers and bikes), calm swimmable water and easy fast boats to the Nusa islands. It faces east, so mornings are bright and gentle.",
          "Best for families who want an unflashy, walkable base with short travel times.",
        ],
      },
      {
        heading: "Nusa Dua — resort-easy and safe",
        paras: [
          "A gated enclave of big resorts with calm, reef-protected beaches and lots of on-site facilities. It's the most hands-off, resort-holiday option — safe and easy, if less local in feel.",
        ],
      },
      {
        heading: "Ubud — nature and space",
        paras: [
          "Inland Ubud suits families with older kids who want rice-terrace walks, monkey forest, waterfalls and cooler air. There's no beach, so it pairs well with a few nights in Sanur.",
        ],
      },
      {
        heading: "A note on the surf towns",
        paras: [
          "Canggu, Seminyak and Uluwatu are fun but busier, with real traffic and beaches where currents and shore-break need watching with small children. They work for active families who don't mind the pace.",
        ],
      },
    ],
    faq: [
      { q: "Where should families with young kids stay in Bali?", a: "Sanur or Nusa Dua — both have calm, swimmable water, flat walkable fronts and easy short days. Sanur feels more like a town; Nusa Dua is resort-style." },
      { q: "Is Bali good for a family holiday?", a: "Yes, with the right base. Choose a calm-water area like Sanur or Nusa Dua, keep travel times short, and build in rest through the midday heat." },
      { q: "Is Ubud good for families?", a: "For families with older kids, yes — nature, space and cooler air. There's no beach, so pair it with a calm coastal area like Sanur." },
    ],
    related: [
      { href: "/sanur", title: "The Sanur guide", blurb: "A calm, walkable, sunrise base with easy island connections." },
      { href: "/nusa-dua", title: "The Nusa Dua guide", blurb: "Calm resort beaches, fine dining and big resort spas." },
      { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, long slow dinners." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
    ],
  },

  {
    slug: "canggu-vs-uluwatu",
    eyebrow: "Canggu vs Uluwatu",
    title: "Canggu vs Uluwatu: which should you choose?",
    description:
      "Canggu for cafés, nightlife and a walkable-ish hub; Uluwatu for clifftop sunsets, cleaner beaches and world-class surf. How to pick between them.",
    lede: "Choose Canggu for energy — cafés, co-working, beach clubs and a big dinner-and-nightlife scene in one busy hub. Choose Uluwatu for scenery — clifftop sunsets, turquoise coves and world-class surf, spread out across the southern Bukit. Canggu is more convenient; Uluwatu is more beautiful and more of an escape.",
    sections: [
      {
        heading: "Choose Canggu if…",
        paras: [
          "You want everything close and social: laptop cafés, surf lessons for beginners, beach clubs, and a dense dinner scene within a short ride. It's the island's busiest traveller hub, walkable-ish in patches, with real traffic between areas.",
          "Trade-off: it's built-up and busy, and the beaches are grey-sand and functional rather than postcard-pretty.",
        ],
      },
      {
        heading: "Choose Uluwatu if…",
        paras: [
          "You want dramatic scenery and calm: limestone cliffs, white-sand coves, clifftop sunset bars, and some of the best surf in the world. It suits couples, confident surfers and anyone chasing views over convenience.",
          "Trade-off: it's spread out and quieter, you'll drive between spots, and it's a longer haul from the airport and the rest of the island.",
        ],
      },
      {
        heading: "Can you do both?",
        paras: [
          "Easily — they're both in the south. A few nights of Canggu energy followed by a few of Uluwatu scenery is a popular first-trip combination, with roughly an hour's drive between them.",
        ],
      },
    ],
    faq: [
      { q: "Is Canggu or Uluwatu better for a first trip?", a: "Canggu if you want cafés, nightlife and everything close; Uluwatu if you want clifftop sunsets, cleaner beaches and surf. Many first-timers do a few nights of each." },
      { q: "Which has better beaches, Canggu or Uluwatu?", a: "Uluwatu — white-sand coves and turquoise water below the cliffs. Canggu's beaches are grey-sand and more about surf and beach clubs than swimming." },
      { q: "Which is better for surfing?", a: "Both are strong, but Uluwatu's reef breaks are world-class and better for experienced surfers; Canggu has more beginner-friendly beach breaks and surf schools." },
    ],
    related: [
      { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
    ],
  },

  {
    slug: "seminyak-vs-canggu",
    eyebrow: "Seminyak vs Canggu",
    title: "Seminyak vs Canggu: which should you choose?",
    description:
      "Seminyak for polished dining, walkable streets and comfort; Canggu for surf, cafés and a younger, laid-back crowd. How to pick between the two.",
    lede: "Choose Seminyak for the polished, comfortable side of Bali — good restaurants, sunset beach clubs, spas and walkable streets. Choose Canggu for the younger, more laid-back version — surf, laptop cafés, and a scruffier, more energetic vibe. They're neighbours, about 20–40 minutes apart, and share a coastline.",
    sections: [
      {
        heading: "Choose Seminyak if…",
        paras: [
          "You want everything easy and refined: an all-day café, a spa, a west-facing sunset and a considered dinner, all within walking distance. It's Bali's original style strip and the most low-effort comfortable base.",
          "Trade-off: it's denser and pricier than Canggu, with less of a surf-and-outdoors feel.",
        ],
      },
      {
        heading: "Choose Canggu if…",
        paras: [
          "You want surf, co-working cafés, beach clubs and a younger crowd, and you don't mind a rougher, busier, more spread-out town. It's the hub for long-stay travellers and digital nomads.",
          "Trade-off: more traffic, more construction, and beaches built for surfing and sunset drinks rather than swimming.",
        ],
      },
      {
        heading: "Which for how long?",
        paras: [
          "Short, comfortable trip: Seminyak. Longer, active, café-and-surf stay: Canggu. Because they're so close, you can also base in one and visit the other for a day or a dinner.",
        ],
      },
    ],
    faq: [
      { q: "Is Seminyak or Canggu better?", a: "Seminyak for polished dining and walkable comfort; Canggu for surf, cafés and a younger, more laid-back crowd. They're neighbours, so you can easily sample both." },
      { q: "Is Canggu cheaper than Seminyak?", a: "Generally Canggu offers more budget-friendly warungs and stays, while Seminyak leans more upscale — though both have options across the range." },
      { q: "Which is better for nightlife?", a: "Both have it. Seminyak has the polished beach clubs and bars; Canggu has a younger, more casual scene. Neither is far from the other." },
    ],
    related: [
      { href: "/seminyak", title: "The Seminyak guide", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
      { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
    ],
  },

  {
    slug: "ubud-vs-canggu",
    eyebrow: "Ubud vs Canggu",
    title: "Ubud vs Canggu: which should you choose?",
    description:
      "Ubud for jungle, culture and calm; Canggu for surf, cafés and beach-town buzz. The two most popular first-timer bases, compared — and how to do both.",
    lede: "Choose Ubud for jungle, culture and calm; choose Canggu for surf, cafés and a beach-town buzz. They're Bali's two most popular first-timer bases and they're opposites — inland rice terraces and yoga versus coastal boards and beach clubs, about 1.5–2 hours apart. Many first trips do a few nights of each.",
    sections: [
      {
        heading: "Choose Ubud if…",
        paras: [
          "You want the cultural, natural side of Bali: rice terraces, temples, waterfalls, yoga and long slow dinners, in cooler, greener air. It's calm and wellness-led rather than party.",
          "Trade-off: there's no beach (the coast is about an hour away) and it sees more rain than the south.",
        ],
      },
      {
        heading: "Choose Canggu if…",
        paras: [
          "You want surf, laptop cafés, beach clubs and a young, social scene, all in one busy hub. It's the easiest place to plug into a community and stay active.",
          "Trade-off: real traffic, a built-up feel, and grey-sand beaches made for surfing and sunset drinks rather than swimming.",
        ],
      },
      {
        heading: "Do both — the classic combo",
        paras: [
          "The most popular first-timer route is a few nights inland in Ubud for culture and calm, then a few in Canggu for surf and the coast. One transfer, roughly 1.5–2 hours, and you get both sides of Bali.",
        ],
      },
    ],
    faq: [
      { q: "Is Ubud or Canggu better for a first trip?", a: "Ubud for culture, nature and calm; Canggu for surf, cafés and a beach-town scene. They're opposites, so many first-timers spend a few nights in each rather than choosing." },
      { q: "Which is better for digital nomads?", a: "Canggu — it's Bali's hub for co-working and laptop cafés. Ubud is the calmer, wellness-leaning alternative." },
      { q: "Does Ubud have a beach?", a: "No — Ubud is inland in the hills, about an hour from the coast. If beach time matters, pair it with Canggu or another coastal area." },
      { q: "How far is Ubud from Canggu?", a: "Roughly 1.5–2 hours by car, depending on traffic. It's a single easy transfer between the two." },
    ],
    related: [
      { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, long slow dinners." },
      { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
    ],
  },

  {
    slug: "bali-on-a-budget",
    eyebrow: "Bali on a budget",
    title: "Bali on a budget: how to keep costs low",
    description:
      "Bali can be very affordable: eat at warungs, rent a scooter, stay in guesthouses, and skip the beach-club minimums. How to travel Bali cheaply.",
    lede: "Bali is one of the better-value destinations in the world if you lean local: eat at warungs, get around by scooter or ride-hailing app, stay in guesthouses or homestays, and treat beach clubs and fine dining as occasional splurges rather than daily habits. The gap between a shoestring day and a luxury day here is enormous — you choose where you sit on it.",
    sections: [
      {
        heading: "Eat where locals eat",
        paras: [
          "Warungs — small family-run local eateries — serve honest Indonesian food for a fraction of the price of Western cafés. A plate of nasi campur costs a little; the same money at a beach club buys a single coffee.",
          "You don't have to give up nice meals — just make the Western brunch spots and beach clubs the exception, not the rule.",
        ],
      },
      {
        heading: "Get around cheaply",
        paras: [
          "A rented scooter is the cheapest way to move around if you're a confident rider (and carry the required International Driving Permit). Otherwise the Grab and Gojek apps give fair, metered fares without haggling.",
          "Base yourself somewhere walkable so you're not paying for a ride every time you want a coffee.",
        ],
      },
      {
        heading: "Stay smart",
        paras: [
          "Guesthouses, homestays and simple villas are plentiful and cheap, especially away from the beachfront and outside July–August. Staying a street or two back from the sand cuts the price sharply.",
          "Longer stays get big discounts — if you're around for weeks, negotiate a monthly rate.",
        ],
      },
      {
        heading: "Where budget stretches furthest",
        paras: [
          "Ubud and Canggu have the deepest cheap-eats and guesthouse scenes. Uluwatu and Nusa Dua skew pricier and more resort-driven. Sanur sits in the middle — calm and good value.",
        ],
      },
    ],
    faq: [
      { q: "Is Bali cheap to travel?", a: "It can be very affordable if you eat at warungs, use a scooter or ride-hailing apps, and stay in guesthouses. It can also be expensive — beach clubs and fine dining add up fast. You control the range." },
      { q: "How much does a day in Bali cost?", a: "It varies hugely with your style, from a shoestring day of warung meals and a guesthouse to a luxury day of villas and beach clubs. Eating local and staying off the beachfront is the biggest saving." },
      { q: "What's the cheapest area of Bali?", a: "Ubud and Canggu have the deepest budget scenes for food and stays. Uluwatu and Nusa Dua are pricier and more resort-focused." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "bali-for-digital-nomads",
    eyebrow: "Bali for digital nomads",
    title: "Bali for digital nomads: where to live, work and eat",
    description:
      "Canggu is Bali's digital-nomad capital — co-working, café work and a big community. Ubud and Uluwatu are the calmer alternatives. Where to base yourself.",
    lede: "Canggu is Bali's digital-nomad capital: dense co-working spaces, laptop-friendly cafés, fast-ish internet and a big, easy-to-plug-into community. Ubud is the calmer, wellness-leaning alternative, and Uluwatu suits surfers who work around the swell. Where you base depends on whether you want community and convenience, calm and nature, or waves at the door.",
    sections: [
      {
        heading: "Canggu — the nomad hub",
        paras: [
          "This is where most remote workers land: co-working spaces, cafés built for laptops (power, wifi, all-day seating), and the easiest community to join, from surf sessions to networking. Everything you need is close, if busy.",
          "Trade-off: it's crowded and traffic-heavy, and it can feel more expat than Balinese.",
        ],
      },
      {
        heading: "Ubud — calm and wellness-led",
        paras: [
          "Ubud draws nomads who want green, quiet and a yoga-and-wellness rhythm over beach and nightlife. Co-working and café-work options exist, at a slower pace, in cooler air.",
          "Trade-off: no beach, more rain, and a smaller (though friendly) scene.",
        ],
      },
      {
        heading: "Uluwatu — for surfers who work",
        paras: [
          "The Bukit suits remote workers whose day bends around the surf: work in the mornings or between sessions, with clifftop cafés and world-class breaks. It's quieter and more spread out, so you'll rely on a scooter.",
        ],
      },
      {
        heading: "Practical basics",
        paras: [
          "Internet is generally good in cafés and co-working spaces in the main areas; back it up with a local SIM and a mobile hotspot for call-heavy days. Get a scooter (with the required International Driving Permit) for freedom, and consider a monthly rental for a big discount.",
          "Check current visa options before you plan a long stay — rules change, so confirm what fits your length and situation with an official source.",
        ],
      },
    ],
    faq: [
      { q: "Where do digital nomads stay in Bali?", a: "Mostly Canggu — the hub for co-working, café work and community. Ubud is the calmer, wellness-focused alternative, and Uluwatu suits surfers who work around the waves." },
      { q: "Is the wifi good in Bali?", a: "Generally good in cafés and co-working spaces in the main areas. For call-heavy work, back it up with a local SIM and a mobile hotspot." },
      { q: "Is Canggu good for remote work?", a: "Yes — it's Bali's densest cluster of co-working spaces and laptop-friendly cafés, with the easiest community to join. The trade-off is crowds and traffic." },
      { q: "What about a visa for a long stay?", a: "Visa rules change, so confirm current options with an official source before planning a long stay. Don't rely on out-of-date advice." },
    ],
    related: [
      { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/canggu/work-friendly-cafes", title: "Work-friendly cafés in Canggu", blurb: "Wifi, sockets and a seat that lasts." },
      { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
      { href: "/bali-for-a-month", title: "Bali for a month", blurb: "Settle in and live like a local for a while." },
    ],
  },
];

// Display grouping for the /guides hub (and any nav that lists guides). Slug
// lists here are the single source for how guides are grouped, so the hub can't
// drift from the registry.
export const GUIDE_GROUPS: { heading: string; blurb: string; slugs: string[] }[] = [
  {
    heading: "Plan your trip",
    blurb: "How long to go, when, how to get around, and what it costs.",
    slugs: [
      "how-many-days-in-bali",
      "bali-itinerary-7-days",
      "bali-itinerary-10-days",
      "best-time-to-visit-bali",
      "how-to-get-around-bali",
      "bali-on-a-budget",
    ],
  },
  {
    heading: "Choose where to stay",
    blurb: "Which area fits your trip — by traveller, and head-to-head.",
    slugs: [
      "where-to-stay-in-bali",
      "best-area-to-stay-in-bali-for-couples",
      "best-area-to-stay-in-bali-for-families",
      "canggu-vs-uluwatu",
      "seminyak-vs-canggu",
      "ubud-vs-canggu",
      "bali-for-digital-nomads",
    ],
  },
  {
    heading: "Best of Bali",
    blurb: "Island-wide picks, from real places we stand behind.",
    slugs: ["best-beach-clubs-in-bali", "best-coffee-in-bali", "best-spas-in-bali", "where-to-watch-sunset-in-bali", "best-warungs-in-bali"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

// Which long-form guides are most relevant to each district pillar — used to
// cross-link pillars → guides (internal-link mesh). Slugs only; the link cards
// are built from the registry so titles/blurbs can't drift.
const DISTRICT_GUIDE_SLUGS: Record<string, string[]> = {
  canggu: ["ubud-vs-canggu", "canggu-vs-uluwatu", "seminyak-vs-canggu", "where-to-stay-in-bali", "best-coffee-in-bali", "where-to-watch-sunset-in-bali"],
  uluwatu: ["canggu-vs-uluwatu", "best-beach-clubs-in-bali", "where-to-watch-sunset-in-bali", "where-to-stay-in-bali"],
  "uluwatu-bukit": ["canggu-vs-uluwatu", "best-beach-clubs-in-bali", "where-to-watch-sunset-in-bali", "where-to-stay-in-bali"],
  ubud: ["ubud-vs-canggu", "where-to-stay-in-bali", "best-spas-in-bali", "how-many-days-in-bali", "bali-for-digital-nomads"],
  sanur: ["best-area-to-stay-in-bali-for-families", "where-to-stay-in-bali", "best-spas-in-bali", "how-to-get-around-bali"],
  seminyak: ["seminyak-vs-canggu", "best-beach-clubs-in-bali", "best-spas-in-bali", "where-to-stay-in-bali", "best-coffee-in-bali"],
  "nusa-dua": ["best-area-to-stay-in-bali-for-families", "best-spas-in-bali", "where-to-stay-in-bali", "best-beach-clubs-in-bali"],
  jimbaran: ["where-to-watch-sunset-in-bali", "best-area-to-stay-in-bali-for-families", "best-spas-in-bali", "where-to-stay-in-bali", "best-beach-clubs-in-bali"],
};

export function guidesForDistrict(slug: string): GuideRelated[] {
  return (DISTRICT_GUIDE_SLUGS[slug] ?? ["where-to-stay-in-bali", "how-many-days-in-bali", "best-time-to-visit-bali"])
    .map((s) => getGuide(s))
    .filter((g): g is Guide => Boolean(g))
    .map((g) => ({ href: `/${g.slug}`, title: g.title, blurb: g.description }));
}

export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/${guide.slug}` },
    openGraph: {
      title: `${guide.title} · Other Bali`,
      description: guide.description,
      url: `https://www.otherbali.com/${guide.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} · Other Bali`,
      description: guide.description,
    },
  };
}
