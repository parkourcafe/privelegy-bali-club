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
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function guideMetadata(guide: Guide): Metadata {
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/${guide.slug}` },
    openGraph: {
      title: `${guide.title} · Other Bali`,
      description: guide.description,
      url: `https://otherbali.com/${guide.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${guide.title} · Other Bali`,
      description: guide.description,
    },
  };
}
