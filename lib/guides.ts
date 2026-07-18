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
  { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and what to do in each area." },
  { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "An honest, practical safety guide — scooters, sea, scams." },
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
    // Bespoke, data-driven route (app/best-restaurants-in-bali) — metadata only.
    slug: "best-restaurants-in-bali",
    title: "The best restaurants in Bali",
    description:
      "Bali's best restaurants by area — Canggu's buzzy dinner scene, Seminyak fine dining, Ubud's jungle-view tables, Jimbaran seafood and clifftop Uluwatu. Sorted by district.",
  },
  {
    // Bespoke, data-driven route (app/best-cafes-in-bali) — metadata only.
    slug: "best-cafes-in-bali",
    title: "The best cafés in Bali",
    description:
      "Bali's best cafés by area — Canggu's laptop-friendly brunch and specialty coffee, Ubud's health-food spots, Seminyak all-day cafés and clifftop Uluwatu. Sorted by district.",
  },
  {
    // Bespoke hub route (app/things-to-do-in-bali) — metadata only.
    slug: "things-to-do-in-bali",
    title: "Best things to do in Bali",
    description:
      "The best things to do in Bali, sorted by what you want: the island icons (temples, volcanoes, waterfalls and Nusa Penida) and what to do in each area, from Ubud's rice terraces to Uluwatu's cliffs.",
  },

  {
    slug: "is-bali-safe",
    eyebrow: "Is Bali safe?",
    title: "Is Bali safe? An honest, practical safety guide",
    description:
      "Yes — Bali is broadly safe for tourists. The real risks are mundane and preventable: scooters, rip currents, stomach bugs and petty scams. Here's how to handle each.",
    lede: "Yes — Bali is broadly safe for mainstream travel, and no major government rates it a danger zone. The honest picture is that the real risks are ordinary and largely preventable — rented scooters, rip currents, stomach bugs, dodgy drinks and petty scams — not terrorism or violent crime. Handle those few things well and Bali is as safe as most popular holiday destinations.",
    sections: [
      {
        heading: "The biggest real risk: scooters and roads",
        paras: [
          "Traffic accidents — overwhelmingly on rented scooters — are the number-one cause of tourist injury and death in Bali. This is the risk to take seriously, not crime.",
          "You legally need your home licence plus an International Driving Permit that carries the motorcycle (Class A) endorsement — a car-only IDP doesn't cover even a 110cc scooter. Helmets are mandatory. Critically, most travel-insurance policies void your medical cover if you ride without the correct licence or a helmet, which can leave you personally liable for a very large hospital bill.",
          "Get the motorcycle-endorsed IDP before you fly, always wear the helmet, and confirm in writing that your insurer covers motorbikes. If you're not a confident rider, use Grab, Gojek or a private driver instead — it's cheap and removes the single biggest danger.",
        ],
      },
      {
        heading: "The sea: rip currents and which beaches are calm",
        paras: [
          "Bali's west and south coasts — Kuta, Legian, Echo Beach and the Uluwatu stretch — have year-round surf and permanent rip currents that catch swimmers every year, often at unpatrolled beaches. Calmer, family-friendly swimming is on the east and south-east: Sanur, Nusa Dua's protected bay, and Jimbaran Bay.",
          "Patrolled beaches use Balawista lifeguards and a flag system: swim only between the red-and-yellow flags, and never when a red flag is flying. If you're caught in a rip, don't fight it — stay calm, float, and swim parallel to the beach to escape the channel before heading in.",
        ],
      },
      {
        heading: "Staying healthy: stomach, rabies and mosquitoes",
        paras: [
          "\"Bali belly\" — traveller's diarrhoea — is the most common traveller ailment, usually from tap water, ice or undercooked food. Bali tap water isn't safe to drink: use sealed bottled or filtered water (including for brushing teeth), skip ice unless you know it's from purified water, and favour freshly cooked, hot, busy-kitchen food.",
          "Rabies is present in Bali, carried mainly by stray dogs; the monkeys at Ubud's Monkey Forest and Uluwatu Temple also bite and scratch. Don't touch or feed stray animals. A bite or scratch is a time-critical emergency — wash it with soap under running water for about 15 minutes and get to a clinic (BIMC, Siloam) the same day for post-exposure treatment, which works well when started promptly.",
          "Dengue fever is endemic, worst in the rainy season, and its mosquitoes bite by day — use a DEET or picaridin repellent and cover up at dawn and dusk. Malaria is essentially not a risk in Bali's tourist areas, so antimalarial tablets aren't normally recommended for a standard Bali trip.",
        ],
      },
      {
        heading: "Drinks: the one methanol rule",
        paras: [
          "This is a documented, occasionally fatal risk rather than a myth: bootleg local spirits (arak) and very cheap \"free-pour\" cocktails have been contaminated with methanol, which can blind or kill, and there have been tourist deaths on record.",
          "The rule is simple: stick to sealed, reputable-brand bottles and cans with intact seals, and be wary of unusually cheap cocktails, free arak shots and drinks from unlicensed sellers. Severe next-day illness or blurred vision after drinking warrants immediate hospital care.",
        ],
      },
      {
        heading: "Scams and petty theft",
        paras: [
          "Crime against tourists is mostly petty and opportunistic, not violent. The usual scams: money-changers short-changing you (use authorised changers with a posted licence, not \"amazing rate\" street booths, and count the cash yourself before leaving); ATM skimming (use machines inside bank branches); bag-snatching by passing scooters (carry bags on the side away from the road); and inflated taxi fares (use the Grab or Gojek apps, or metered Bluebird).",
          "The classic scooter-rental trick is an invented \"damage\" claim on return. Before you ride off, film a slow, narrated video of every panel, mirror and the seat compartment — it ends the argument instantly.",
        ],
      },
      {
        heading: "Natural hazards: volcanoes and earthquakes",
        paras: [
          "Bali sits on the Ring of Fire, so earthquakes and volcanic activity are routine and tsunami risk is low but real (coastal areas have evacuation signage). Bali's own Mount Agung has been calm recently, but volcanoes elsewhere in the region periodically send ash over the flight paths and cancel Bali flights — which is a safety measure, not an over-reaction.",
          "Volcano status changes fast, so check the live alert level on Indonesia's official MAGMA Indonesia service before you travel, and build a buffer day into tight flight connections during any eruption period.",
        ],
      },
      {
        heading: "Solo and female travellers",
        paras: [
          "Bali is a very popular and generally safe destination for solo and female travellers with standard precautions. The honest caveats: reports of sexual assault are relatively high in Bali and Lombok, and drink-spiking has been reported around nightlife — so vigilance at bars and clubs matters.",
          "Watch your drink being made or choose sealed bottles, never leave it unattended, avoid solo scooter rides on unlit roads late at night, and dress modestly at temples. These are the same precautions you'd take in any busy nightlife destination.",
        ],
      },
      {
        heading: "Laws worth knowing",
        paras: [
          "Drugs are genuinely zero-tolerance: Indonesia imposes long prison terms for even small amounts, and serious trafficking can carry life imprisonment or the death penalty, with no exemption for foreigners. Decline entirely — nothing is worth the risk.",
          "Indonesia's new criminal code (in force from January 2026) was widely misreported. It technically restricts sex outside marriage and unmarried cohabitation, but these are complaint-based offences that can only be acted on if a close family member files a formal complaint, and the government has confirmed there are no marital-status checks at hotels. Ordinary couples sharing a room are not the target.",
          "Temple etiquette is taken seriously: wear a sarong, cover shoulders and knees, and don't climb sacred structures. Sarongs are usually provided at temple entrances.",
        ],
      },
      {
        heading: "If something goes wrong",
        paras: [
          "Indonesia's emergency number is 112. Bali has good private hospitals used to foreign patients — BIMC and Siloam — but treatment, and especially medical evacuation, are expensive without cover: an evacuation can run into tens of thousands of dollars.",
          "This is why comprehensive travel insurance is non-negotiable. Buy a policy that explicitly covers scooter use (with a valid licence) and medical evacuation with a high limit, and save your insurer's 24-hour assistance line and the hospital numbers in your phone before you need them.",
        ],
      },
    ],
    faq: [
      { q: "Is Bali safe for tourists right now?", a: "Broadly, yes. Major government advisories keep Indonesia in the middle \"exercise increased/high caution\" band — the same as many popular destinations — rather than a \"do not travel\" rating, and Bali specifically has no blanket warning. Check your own government's page and any live volcano status the week you fly." },
      { q: "What is the biggest danger in Bali?", a: "Rented scooters. Traffic accidents are by far the leading cause of tourist injury, and riding without the correct motorcycle licence can also void your travel insurance. Wear a helmet, carry a motorcycle-endorsed IDP, or use a driver." },
      { q: "Is Bali safe for solo female travellers?", a: "Yes, it's a popular and generally safe solo destination with standard precautions. Be alert around nightlife (drink-spiking has been reported), avoid solo night scooter rides on dark roads, and dress modestly at temples." },
      { q: "Can you drink the tap water in Bali?", a: "No — tap water isn't safe to drink. Use sealed bottled or filtered water (including for brushing teeth), avoid ice of uncertain source, and eat freshly cooked hot food to avoid \"Bali belly.\"" },
      { q: "Do I need malaria tablets for Bali?", a: "Not for a standard Bali trip — the tourist areas are considered malaria-free. Dengue is present, though, so focus on daytime mosquito-bite prevention with repellent and covering up at dawn and dusk." },
      { q: "Do Indonesia's new sex laws affect tourists?", a: "In practice, no. The 2026 criminal code's cohabitation and extramarital-sex provisions are complaint-based — only actionable if a close family member formally complains — and officials have confirmed there are no marital-status checks at hotels. Ordinary couples sharing a room are not the target." },
      { q: "Is it safe to swim at Bali's beaches?", a: "It depends on the beach. The west and south coasts (Kuta, Canggu, Uluwatu) have strong rip currents; Sanur, Nusa Dua and Jimbaran Bay are calm and swimmable. Swim between the red-and-yellow flags and never under a red flag." },
    ],
    related: [
      { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Scooters, drivers and apps — and how to do it safely." },
      { href: "/best-time-to-visit-bali", title: "Best time to visit Bali", blurb: "Seasons, weather and when to go." },
      { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first trip without the rookie mistakes." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "The five first-timer areas, compared." },
    ],
  },
  {
    slug: "nusa-penida-day-trip",
    eyebrow: "Nusa Penida day trip",
    title: "Nusa Penida day trip from Bali: how to do it well",
    description:
      "How to visit Nusa Penida from Bali — the fast boat from Sanur, the west-coast loop (Kelingking, Angel's Billabong), the quieter east, snorkelling with mantas, and whether to day-trip or stay overnight.",
    lede: "You can do Nusa Penida as a day trip from Bali — it's a 30–45 minute fast boat from Sanur — and most people do. The honest catch is that it's a long, rushed day on rough roads, so you realistically see one side of the island. If you can spare a night, staying over is the single biggest upgrade: you split the island east and west, and you get the big sights near-empty once the day-trippers leave.",
    sections: [
      {
        heading: "Getting there: the fast boat from Sanur",
        paras: [
          "Sanur is the main gateway. Since late 2022 most boats leave from the government-built Sanur Harbour on Jl. Matahari Terbit — a proper terminal with indoor check-in and a dry pier, not the old wade-through-the-surf boarding. The crossing is roughly 30–45 minutes, and fast boats run frequently from early morning (around 6.30–7.30am) to a last boat around 5pm.",
          "If you're staying in east Bali, Kusamba is an alternative departure point with a slightly shorter crossing. Book online ahead — especially the first morning boat and in peak season — and arrive at least 30 minutes before departure to swap your voucher for a boarding pass. Exact times vary by operator, so check your own boat's timetable.",
        ],
      },
      {
        heading: "Day trip or overnight?",
        paras: [
          "A day trip works, but be realistic: ferry check-in, waiting for your group, potholed roads that turn short distances into 40-minute drives, and photo queues at Kelingking all eat the clock. In one day you comfortably see one side of the island — usually the west.",
          "An overnight changes the trip entirely. You cover the west one day and the east the other, fit in a snorkel, and — the real prize — reach the headline sites in the late afternoon and early morning, after the day boats have gone and before they arrive.",
        ],
      },
      {
        heading: "The west loop (the classic day)",
        paras: [
          "The west and south-west cluster is closest to the harbour and makes a natural single-day loop. Kelingking Beach is the famous \"T-Rex\" cliff — the viewpoint is a short walk, but the descent to the sand is steep, strenuous and optional, and swimming at the beach is forbidden because the currents are deadly.",
          "Angel's Billabong is a natural infinity tidal pool that is only safe at low tide — never enter on a rising or high tide, as rogue waves have swept people out to sea here. Broken Beach (Pasih Uug) next door is a photogenic rock-arch cove, but a viewpoint rather than a swim. Crystal Bay is the calm, palm-lined west-side beach for a swim, a snorkel and the sunset.",
        ],
      },
      {
        heading: "The quieter east side",
        paras: [
          "The east is at least as beautiful as the west and far less crowded, which is why it's usually a separate day. Diamond Beach and neighbouring Atuh Beach are dramatic white-sand coves under east-facing cliffs, reached by steep carved stairways.",
          "Nearby, the Thousand Islands viewpoint (Raja Lima) looks out over scattered islets and the famous cliffside tree house, and the rolling Teletubbies Hills are named for their resemblance to the children's show. The stairways down to the beaches are a real climb in the heat — do them earlier and carry water.",
        ],
      },
      {
        heading: "Snorkelling with manta rays",
        paras: [
          "Manta rays are a genuine headline draw, and snorkelling with them is a common half-day boat trip, usually stopping at three or four spots — Manta Point or Manta Bay, Crystal Bay and Gamat Bay among them, depending on the day's water. Mantas are present at the cleaning stations essentially year-round, so there's no strictly wrong season, though sightings are very likely rather than guaranteed.",
          "Manta Point water is often colder and choppier than the calmer bays, so a rash guard helps and seasickness precautions are worth taking if you're prone.",
        ],
      },
      {
        heading: "Getting around the island",
        paras: [
          "The roads are genuinely rough in places — potholes, steep descents and sections barely wide enough for two vehicles — though some main routes have been resurfaced. There is no Grab, Gojek or taxi network on the island.",
          "For most visitors the clear choice is a hired car with a driver or an organised tour, not a self-drive scooter day: the descents to beaches like Kelingking are steep enough to overwhelm scooter brakes. Arrange your driver or tour before you arrive, expect parking bottlenecks at Kelingking, and start at the far or less-crowded stop first to stay ahead of the crowd.",
        ],
      },
      {
        heading: "What to pack and know",
        paras: [
          "Wear proper closed shoes for the steep stairs and rocky terrain, and carry flip-flops for the beach. Bring plenty of cash — ATMs are few, often don't take foreign cards and frequently run empty, so withdraw on mainland Bali before you cross.",
          "Pack high-SPF reef-safe sunscreen and water, start on the first morning boat to maximise daylight and beat the crowds, and take the water safety seriously: only enter Angel's Billabong at low tide, obey the no-swimming signs at Kelingking, and check ocean conditions before getting in anywhere. The channel crossing can be choppy, so bring motion-sickness medication if you're susceptible.",
        ],
      },
      {
        heading: "How long to spend",
        paras: [
          "One day is realistic for one side (usually the west) or a snorkel plus a couple of sights — doable but rushed. Two days with a night on the island is the sweet spot: west one day, east the other, with a snorkel fitted in and far fewer crowds.",
          "Three or four days lets you add relaxed beach time and see everything without racing the ferry clock. If you can spare even one night, it converts a stressful car-bound day into two calm ones.",
        ],
      },
    ],
    faq: [
      { q: "Can you do Nusa Penida as a day trip from Bali?", a: "Yes — it's a 30–45 minute fast boat from Sanur, and a day trip is what most people do. But it's a long, rushed day on rough roads, so you'll realistically see just one side (usually the west). An overnight lets you see both sides comfortably and avoid the crowds." },
      { q: "How do you get to Nusa Penida?", a: "By fast boat, mainly from Sanur Harbour (about 30–45 minutes), with frequent departures from early morning to around 5pm. Kusamba, in east Bali, is an alternative with a slightly shorter crossing. Book ahead, especially the first morning boat." },
      { q: "Is one day enough for Nusa Penida?", a: "For one side of the island, yes. Trying to combine the west (Kelingking, Angel's Billabong) and the east (Diamond, Atuh) in a single day means spending most of it in the car on rough roads. Pick one side, or stay a night." },
      { q: "Can you swim at Nusa Penida's beaches?", a: "At some, not others. Swimming is forbidden at Kelingking (deadly currents), and Angel's Billabong is only safe to enter at low tide — never on a rising tide, where people have been swept out. Crystal Bay is the calm, swimmable west-side beach." },
      { q: "Should you rent a scooter in Nusa Penida?", a: "Only if you're a confident, experienced rider — the roads are rough and the descents to the beaches are steep enough to overwhelm scooter brakes. For most visitors a hired driver or an organised tour is the safer, easier choice, and there's no Grab or taxi network on the island." },
      { q: "Can you see manta rays in Nusa Penida?", a: "Yes — snorkelling with manta rays is a popular half-day boat trip, with mantas present at the cleaning stations essentially year-round. Sightings are very likely but never guaranteed." },
      { q: "Do you need cash in Nusa Penida?", a: "Yes — bring plenty. ATMs are few, often don't accept foreign cards and frequently run empty, and most tours, rentals and eateries are cash-only. Withdraw on mainland Bali before you cross." },
    ],
    related: [
      { href: "/nusa-penida", title: "The Nusa Penida guide", blurb: "Who the island suits, the west and east loops, and the headline cliffs and coves." },
      { href: "/sanur", title: "The Sanur guide", blurb: "The calm base and fast-boat gateway to the Nusa islands." },
      { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and what to do in each area." },
      { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "Water, roads and the practical safety basics." },
    ],
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

  {
    slug: "bali-rainy-day",
    eyebrow: "Rainy day in Bali",
    title: "What to do in Bali when it rains",
    description:
      "Rain in Bali usually comes in waves, not all day. Make it a soft day — spa, a long lunch, a café, yoga or a cooking class — and save waterfalls and beach clubs for clearer skies.",
    lede: "Don't write the day off — rain in Bali usually arrives in short, heavy waves rather than all-day grey. The move is to make it a soft day close to where you're staying: a spa, a long lunch, a café, a yoga class or a cooking class, then an easy dinner. Save the waterfalls, cliff walks and sunset-only plans for a clearer sky.",
    sections: [
      {
        heading: "First, don't panic — rain comes in waves",
        paras: [
          "Especially in the wet season (roughly November to March), Bali rain tends to fall as intense afternoon downpours that pass, not a solid grey day. Keep the plan loose and you can often slot the outdoor bits into the dry windows.",
          "The mistake isn't the rain — it's forcing a waterfall marathon or a sunset beach club through it. Move those, and the day is still good.",
        ],
      },
      {
        heading: "Turn it into a soft day",
        paras: [
          "This is the day for the things you'd otherwise skip: a proper spa treatment, an unhurried long lunch, a café you can sit in for hours, boutique shopping, a yoga or sound-healing session, or a cooking class.",
          "Pick things close to your base. In rain, location beats hype — a comfortable place five minutes away is worth more than a famous one across town in traffic.",
        ],
      },
      {
        heading: "By area: where to go indoors",
        paras: [
          "Canggu: a spa or recovery session, a long café brunch, a gym, boutique shopping, and an easy dinner. It has the deepest café-and-wellness scene for a low-effort day.",
          "Ubud: a spa, sound healing, a cooking class, a jewellery or craft workshop, an art gallery, or a calm hotel day with a tea or coffee tasting. Ubud does the slow, restorative rainy day best.",
          "Seminyak & Sanur: covered restaurants, spas and shopping, with short, walkable hops between them so you're not soaked getting around.",
        ],
      },
      {
        heading: "What to move to a clearer day",
        paras: [
          "Waterfalls (slippery paths, and the flow can turn dangerous in heavy rain), cliff and beach staircases, outdoor temples with lots of steps, long scooter rides, and anything that only works at sunset.",
          "Beach clubs are a maybe: if you want the pool, drinks and music they still deliver, but if the point was the sunset and the sand, wait for a brighter day.",
        ],
      },
      {
        heading: "A rainy day with kids",
        paras: [
          "Keep it short and indoors: an early lunch, a covered pool if it's safe, a kids-friendly café, a craft or cooking activity, nap time, and an early dinner. Don't try to fill the whole day.",
          "A mall or cinema near your base is a perfectly good rainy-afternoon answer when small children have run out of patience.",
        ],
      },
    ],
    faq: [
      { q: "What do you do in Bali if it rains all day?", a: "Make it a soft day close to your base: a spa, a long lunch, a café, yoga, shopping or a cooking class, then an easy dinner. All-day rain is actually uncommon — it usually comes in heavy waves you can plan around." },
      { q: "Is the rainy season still worth visiting Bali?", a: "Yes. Rain mostly falls as short, heavy afternoon downpours, the island is at its greenest, and it's quieter and cheaper. Just keep beach and waterfall plans flexible rather than fixed." },
      { q: "Should we cancel waterfalls if it rains?", a: "In heavy rain, postpone them. Paths get slippery and water flow can change fast. Go after stable weather, with proper shoes and ideally a driver." },
      { q: "Are beach clubs worth it when it's cloudy?", a: "If you want the pool, drinks and music, yes. If the goal was sunset photos and beach atmosphere, save it for a clearer day." },
      { q: "What's a good rainy-day plan with kids?", a: "Short and indoor: early lunch, a covered pool if safe, a kids-friendly café, a craft or cooking activity, nap time and an early dinner. Keep the day brief." },
      { q: "What should we avoid planning in heavy rain?", a: "Waterfalls, cliff and beach staircases, big outdoor temples, long scooter rides and sunset-only plans. Move those to a clearer day and keep the wet hours soft and close to home." },
    ],
    related: [
      { href: "/best-spas-in-bali", title: "The best spas in Bali", blurb: "Where to be looked after — the perfect rainy-day plan." },
      { href: "/best-cafes-in-bali", title: "The best cafés in Bali", blurb: "Somewhere to settle in for a long, slow lunch." },
      { href: "/best-time-to-visit-bali", title: "Best time to visit Bali", blurb: "Dry season, wet season and how to choose." },
      { href: "/bali-with-kids", title: "Bali with kids", blurb: "Easy, short days that survive a downpour." },
    ],
  },

  {
    slug: "ubud-one-day",
    eyebrow: "One day in Ubud",
    title: "One day in Ubud: what to actually do",
    description:
      "One calm day in Ubud without rushing: go early to Monkey Forest or the rice terraces, lunch in the centre, one wellness or cultural stop, then an early dinner. Don't turn it into a marathon.",
    lede: "With one day in Ubud, go early and keep the rest of the day soft. Do one main thing in the morning — Monkey Forest or the rice terraces — then lunch in the centre, one calm wellness or cultural stop, and an early dinner. The mistake first-timers make is cramming Monkey Forest, Tegallalang, a waterfall, a temple and shopping into a single day and leaving exhausted.",
    sections: [
      {
        heading: "Start early — Ubud rewards mornings",
        paras: [
          "Get to the headline sights before the tour buses and the midday heat. Monkey Forest and the rice terraces are far better at 8–9am than at noon, and you'll have the light and the space to yourself.",
          "Front-load the effort in the morning, then let the afternoon slow down. Ubud gets tiring when you try to keep the pace up all day.",
        ],
      },
      {
        heading: "A suggested one-day route",
        paras: [
          "Monkey Forest or the rice terraces first thing → lunch in Ubud Centre → a short walk or a market/art stop → a spa or one cultural stop → an early dinner.",
          "That's a full, satisfying day without rushing. Leave space between stops rather than stacking them back-to-back.",
        ],
      },
      {
        heading: "Monkey Forest or rice fields?",
        paras: [
          "Monkey Forest is worth it if you go early, keep your belongings secure (the macaques will grab sunglasses, water bottles and loose bags) and don't mind animals close to you. It's popular and busy — that's the trade-off.",
          "If you'd rather have greenery and calm, make the rice terraces your morning instead. You don't need to do both in one day.",
        ],
      },
      {
        heading: "Which rice fields: Tegallalang or Jatiluwih?",
        paras: [
          "Tegallalang is close to Ubud, easy and photogenic — but more touristy. It's the natural add-on for a single Ubud day.",
          "Jatiluwih is bigger, calmer and more scenic, but much farther — better suited to a dedicated day with a driver than a quick morning stop. On a one-day visit, Tegallalang is the easier call.",
        ],
      },
      {
        heading: "Don't overpack it",
        paras: [
          "Skip the far-flung waterfall marathon unless you have a driver and real energy to spare. After sightseeing, choose your lunch and dinner by shade and comfort, not by chasing the most famous name across town.",
          "Ubud is one of the best places in Bali for a genuinely calm day — let it be one.",
        ],
      },
    ],
    faq: [
      { q: "What should we do with only one day in Ubud?", a: "Start early with one main sight — Monkey Forest or the rice terraces — then lunch in the centre, one calm wellness or cultural stop, and an early dinner. Don't try to see everything in a day." },
      { q: "Is Monkey Forest worth it or too touristy?", a: "Worth it if you go early, keep belongings secure and don't mind crowds and animals close to you. It's popular, so the experience depends heavily on timing." },
      { q: "What should we do after Monkey Forest?", a: "Stay nearby: lunch in Ubud Centre, a short walk, a market or art stop, or a spa. If you still have energy, add the rice terraces — not a far waterfall marathon." },
      { q: "Tegallalang or Jatiluwih rice fields?", a: "Tegallalang for a short, easy Ubud add-on (more touristy). Jatiluwih for a bigger, calmer landscape — but it's far and better as its own day. For one Ubud day, choose Tegallalang." },
      { q: "Is Ubud good for a calm day?", a: "Very. Rice fields, a spa, yoga, a slow lunch, art and an early dinner make it one of the best areas in Bali for an unhurried day." },
      { q: "Is Ubud good with kids?", a: "Yes, if you keep it short. Kids usually enjoy the animals, rice fields, pools and easy cafés. Avoid stacking temples, waterfalls and long drives into one day." },
    ],
    related: [
      { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, long slow dinners." },
      { href: "/ubud/things-to-do", title: "Things to do in Ubud", blurb: "The sights and stops, sorted by area." },
      { href: "/best-cafes-in-bali", title: "The best cafés in Bali", blurb: "Where to land for a long Ubud lunch." },
      { href: "/bali-with-kids", title: "Bali with kids", blurb: "How to pace an Ubud day for children." },
    ],
  },

  {
    slug: "canggu-first-day",
    eyebrow: "First day in Canggu",
    title: "Your first day in Canggu",
    description:
      "Landed in Canggu? Keep the first day easy — a brunch, a beach walk, a massage, a sunset drink and a simple dinner near your villa. Don't fight traffic trying to see all of Bali on day one.",
    lede: "Keep your first day in Canggu easy. After a flight, the move is a brunch or lunch near your villa, a beach walk, a massage, a sunset drink and a simple dinner close by — not a far-flung tour or a race to see the whole island. Bali feels much better when day one is about settling in rather than fighting traffic.",
    sections: [
      {
        heading: "Keep the first day easy",
        paras: [
          "Don't book a distant temple-and-waterfall tour for arrival day. Check in, eat nearby, get a massage, catch the sunset if you have the energy, and sleep early.",
          "The rest of the trip is for exploring. Day one is for landing softly and beating the jet lag.",
        ],
      },
      {
        heading: "A relaxed first-day shape",
        paras: [
          "An easy brunch or lunch → a beach walk → a massage → a sunset drink → a simple dinner near where you're staying.",
          "The night you land is not the moment to cross Canggu in traffic for a viral restaurant. Pick something close, comfortable and easy to book.",
        ],
      },
      {
        heading: "Which pocket: Berawa, Batu Bolong or Pererenan?",
        paras: [
          "Berawa has more beach clubs, gyms, restaurants and an expat-lifestyle feel. Batu Bolong is surf, beach access, cafés and classic Canggu energy. Pererenan is calmer and more grown-up, but still close to it all.",
          "You don't need to move between them on day one — settle into your own pocket first and explore the others once you've found your feet.",
        ],
      },
      {
        heading: "Sunset and dinner in one area",
        paras: [
          "Pair your sunset spot and dinner so you're not driving far in the dark after. The beach, a beachfront bar, or the Echo Beach / Pererenan stretch all work for an easy first-night sunset.",
          "Arrive at the sunset spot early — Canggu's beachfront fills up — and don't plan to move far right after.",
        ],
      },
      {
        heading: "Getting around without a scooter",
        paras: [
          "Canggu works without a scooter if you stay local: cafés, beach, gym, spa, shopping and dinner are all close, and Grab or Gojek covers the short hops. Just choose a base near where you want to be.",
          "If you'll explore beyond Canggu — Uluwatu, Ubud day trips — a private driver for those days is easier and safer than a scooter you're not confident on.",
        ],
      },
    ],
    faq: [
      { q: "What should we do in Canggu on our first day?", a: "Keep it easy: a brunch or lunch near your villa, a beach walk, a massage, a sunset drink and a simple dinner close by. Don't book a far tour or try to see all of Bali on arrival day." },
      { q: "Is Canggu too crowded now?", a: "It can be busy, especially Berawa and Batu Bolong. But it still works if you pick the right pocket, time your moves and don't expect quiet village Bali." },
      { q: "Where should we eat the night we land in Canggu?", a: "Somewhere close to your villa, comfortable and easy to book. The first night isn't the time to cross Canggu in traffic for a famous restaurant." },
      { q: "What's the difference between Berawa and Batu Bolong?", a: "Berawa leans beach clubs, gyms, restaurants and expat lifestyle. Batu Bolong is surf, beach access, cafés and more classic Canggu energy. Pererenan next door is calmer and more grown-up." },
      { q: "Can we enjoy Canggu without a scooter?", a: "Yes — stay local and use Grab or Gojek for short hops. Cafés, beach, gym, spa and dinner are all close. For day trips beyond Canggu, a private driver is easier than a scooter." },
      { q: "Where can we watch sunset in Canggu?", a: "The beach, a beachfront bar or a beach club, or the Echo Beach and Pererenan stretch. Arrive early, and pair it with a dinner nearby so you're not driving far afterward." },
    ],
    related: [
      { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/best-beach-clubs-in-bali", title: "The best beach clubs in Bali", blurb: "Where to take the first-night sunset." },
      { href: "/best-restaurants-in-bali", title: "The best restaurants in Bali", blurb: "An easy dinner near where you're staying." },
      { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Scooter, driver or apps — and when to use which." },
    ],
  },

  {
    slug: "bali-with-kids",
    eyebrow: "Bali with kids",
    title: "Bali with kids: what to do and how to pace it",
    description:
      "The secret to Bali with kids is shorter days: calm beaches, pools, animals, rice fields and easy cafés — based in Sanur or Nusa Dua, with early dinners and rest through the heat.",
    lede: "Bali is a good family destination if you keep the days short and the base calm. Sanur and Nusa Dua are the easiest bases — gentle, swimmable water and flat, walkable fronts — while Ubud adds nature for older kids. Fill the day with one main thing (a beach morning, a pool, animals, rice fields or a workshop), an early lunch, rest through the heat, and an early dinner. Don't run an adult itinerary with children.",
    sections: [
      {
        heading: "Base somewhere calm",
        paras: [
          "Sanur and Nusa Dua are the easiest with young kids: calm, swimmable water, flat walkable fronts and short travel times. Seminyak can work; Canggu works with the right villa and a driver, but the traffic and sidewalks are less forgiving.",
          "Ubud suits families with older kids who'll enjoy nature, rice fields and cooler air — pair it with a few calm-beach nights in Sanur.",
        ],
      },
      {
        heading: "What kids actually enjoy",
        paras: [
          "Short beach mornings, safe pools, animal parks, rice-field walks, easy cafés, kids' clubs, and simple cooking or craft workshops. A single calm temple or a short cultural show can work too.",
          "Keep it to one main activity a day. Children enjoy Bali far more when the plan isn't overloaded.",
        ],
      },
      {
        heading: "A good family half-day",
        paras: [
          "Breakfast, one main activity, an early lunch, then pool or rest. That's genuinely enough for a good day — the rest is bonus.",
          "Build the day around nap time and the midday heat rather than fighting them.",
        ],
      },
      {
        heading: "Beaches and water safety",
        paras: [
          "For calm family swimming, favour the east and south-east: Sanur and Nusa Dua's protected bay. The west and south-coast surf beaches (Canggu, Uluwatu) have strong currents and shore-break to watch closely with small children.",
          "Always check the tide, the waves and any flags before letting kids in, and swim between the flags on patrolled beaches.",
        ],
      },
      {
        heading: "What to avoid with toddlers",
        paras: [
          "Long traffic days, steep beach staircases, waterfall treks, late dinners, too much midday heat and overpacked temple days. Keep it simple and close.",
          "Temples are fine with kids if you pick one, go early or late afternoon, keep it short, bring water and dress properly — don't chain several together in the heat.",
        ],
      },
    ],
    faq: [
      { q: "Which area of Bali is easiest with children?", a: "Sanur and Nusa Dua — calm, swimmable water, flat walkable fronts and short days. Seminyak can work; Canggu works with the right villa and a driver; Ubud is good for older kids who like nature." },
      { q: "What can we do in Bali with kids?", a: "Short beach mornings, pools, animal parks, rice fields, easy cafés, kids' clubs and simple workshops. Keep it to one main activity a day and build in rest through the heat." },
      { q: "Which beaches are calm and safe for kids?", a: "Sanur and Nusa Dua's protected bay are the easiest for calm family swimming. The west and south-coast surf beaches have stronger currents — watch tide, waves and flags closely." },
      { q: "Is Ubud good with kids?", a: "Yes, for families with older kids — animals, rice fields, pools and short walks. Avoid stacking stairs, heat and long drives into one day." },
      { q: "What should we avoid with toddlers?", a: "Long traffic days, steep beach stairs, waterfall treks, late dinners and overpacked temple days. Keep days short, close to base and built around nap time." },
      { q: "Can we visit temples with kids?", a: "Yes — pick one, go early or late afternoon, keep it short, bring water and dress properly (covered shoulders and knees). Don't combine several temples in the midday heat." },
    ],
    related: [
      { href: "/best-area-to-stay-in-bali-for-families", title: "Best area to stay for families", blurb: "Sanur, Nusa Dua and Ubud, compared for a family base." },
      { href: "/sanur", title: "The Sanur guide", blurb: "A calm, walkable, sunrise base that suits families." },
      { href: "/nusa-dua", title: "The Nusa Dua guide", blurb: "Calm resort beaches and easy, safe days." },
      { href: "/bali-rainy-day", title: "Rainy day in Bali", blurb: "Short indoor plans for when the weather turns." },
    ],
  },

  {
    slug: "sanur-or-nusa-dua",
    eyebrow: "Sanur vs Nusa Dua",
    title: "Sanur or Nusa Dua: which should you choose?",
    description:
      "Both are calm, family-easy south-east bases. Sanur is a walkable town with local texture and island day-trips; Nusa Dua is hands-off resort comfort. How to pick.",
    lede: "Both are the calm, easy side of Bali — the opposite of Canggu's buzz — so it comes down to feel. Choose Sanur for a real, walkable town with local texture, a long flat beach path and the fast boats to the Nusa islands. Choose Nusa Dua for a gated, hands-off resort enclave with reef-protected beaches and everything on site. Sanur has more soul; Nusa Dua has more polish.",
    sections: [
      {
        heading: "Choose Sanur if…",
        paras: [
          "You want a low-key coastal town, not a resort bubble: a roughly 5 km flat, paved beachfront path made for walking, cycling and strollers, calm swimmable water on the sunrise coast, and local warungs and cafés with a genuine neighbourhood feel.",
          "It's also the main fast-boat gateway to Nusa Penida and Lembongan, so it doubles as a springboard for island day-trips. Best for travellers who want calm plus a bit of real Bali texture.",
        ],
      },
      {
        heading: "Choose Nusa Dua if…",
        paras: [
          "You want resort-easy and secure: a gated enclave of big five-star resorts, manicured reef-protected beaches, resort fine dining and large spas, with a walkable seafront promenade tying it together.",
          "It's the most hands-off, low-friction base in Bali — safe, clean and effortless. The trade-off is that it feels more like a resort zone than a Balinese town.",
        ],
      },
      {
        heading: "For families",
        paras: [
          "Both are among the easiest family bases in Bali thanks to calm, swimmable water and flat, walkable fronts. Nusa Dua leans further into resort facilities and security; Sanur is gentler on the wallet and easier to step out into a real town for dinner.",
          "Either way, favour these two over the surf coasts if you're travelling with small kids — the water is calmer and the days are simpler.",
        ],
      },
      {
        heading: "Getting around and day trips",
        paras: [
          "Both are calm to move around, with short local hops by Grab, Gojek or a driver. Sanur's flat path makes it genuinely walkable end to end; Nusa Dua's promenade links the resort strip.",
          "For anything beyond your base — Uluwatu, Ubud, the Nusa islands — a driver for the day is the easy call from either. Sanur has the edge if the islands are on your list.",
        ],
      },
      {
        heading: "Can you do both?",
        paras: [
          "You rarely need to — they're close and similar in pace, so most people pick one and pair it with a livelier area (Canggu, Seminyak or Ubud) for contrast rather than splitting between two calm bases.",
        ],
      },
    ],
    faq: [
      { q: "Is Sanur or Nusa Dua better?", a: "Both are calm and family-easy. Sanur is a walkable town with local texture and fast boats to the Nusa islands; Nusa Dua is a gated resort enclave with reef-protected beaches and everything on site. Pick by whether you want soul or polish." },
      { q: "Which is better for families, Sanur or Nusa Dua?", a: "Both are excellent for families — calm, swimmable water and flat, walkable fronts. Nusa Dua leans into resort facilities and security; Sanur is gentler on budget and easier to step into a real town." },
      { q: "Is Sanur boring?", a: "It's calm, not boring — a walkable beach town for people who want gentle days, sunrise, cycling and easy restaurants rather than nightlife or beach-club energy." },
      { q: "Is Nusa Dua too resort-only?", a: "It is very resort-focused — that's the point. It suits families, honeymooners and older travellers who want clean beaches, security and effortless service over local street life." },
      { q: "Which is closer to Nusa Penida?", a: "Sanur — it's the main fast-boat harbour for Nusa Penida and Lembongan, which makes it the better base if island day-trips are on your plan." },
    ],
    related: [
      { href: "/sanur", title: "The Sanur guide", blurb: "A calm, walkable, sunrise base and the fast-boat gateway to the islands." },
      { href: "/nusa-dua", title: "The Nusa Dua guide", blurb: "Calm resort beaches, fine dining and big resort spas." },
      { href: "/best-area-to-stay-in-bali-for-families", title: "Best area to stay for families", blurb: "The calm, easy bases compared for a family trip." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All the first-timer areas, side by side." },
    ],
  },

  {
    slug: "jimbaran-seafood",
    eyebrow: "Jimbaran seafood",
    title: "Jimbaran seafood: grilled fish on the sand at sunset",
    description:
      "Jimbaran Bay's signature night: fresh grilled seafood at tables on the sand as the sun sets over a calm, west-facing bay. When to go, what to expect, how to do it well.",
    lede: "Jimbaran's signature experience is simple and hard to beat: fresh grilled seafood eaten at a table set right on the sand while the sun goes down over the calm, west-facing bay. Arrive before sunset for a beach table at golden hour, confirm the price up front (seafood is usually sold by weight), and treat the bare-bones setting as part of the charm.",
    sections: [
      {
        heading: "What the experience is",
        paras: [
          "Along Jimbaran Bay, clusters of seafood restaurants and warungs set tables out on the beach and grill the day's fish, prawns and squid over coconut husk, served with rice, sambal and vegetables.",
          "The draw isn't fine dining — it's the setting: your feet in the sand, the grill smoke, and the sun dropping into the bay. That combination is the whole point.",
        ],
      },
      {
        heading: "When to go",
        paras: [
          "Sunset is the moment. Aim to arrive a little before it so you get a table on the sand for golden hour rather than in the back once the front rows fill.",
          "It's calm and west-facing, so the light is the show. Weekends and peak season are busier — earlier is better.",
        ],
      },
      {
        heading: "The three clusters",
        paras: [
          "The seafood grills gather in a few stretches along the bay — the Muaya beach area, the Kelan end nearer the airport, and the Kedonganan side. They offer much the same experience, so pick by which is closest to where you're staying rather than agonising over the choice.",
        ],
      },
      {
        heading: "How to do it well",
        paras: [
          "Seafood is typically priced by weight, so confirm the weight and the price before it goes on the grill — that one step avoids the only common surprise. It's a relaxed, hands-on meal, not a polished restaurant.",
          "The bay is calm and swimmable earlier in the day, and Jimbaran sits close to the airport — which makes this a great first-night or last-night dinner. Bring a little mosquito repellent for dusk.",
        ],
      },
      {
        heading: "Who it suits",
        paras: [
          "It's made for a memorable sunset dinner — couples, groups and anyone who wants the toes-in-the-sand version of a Bali evening.",
          "If you're after a slick, air-conditioned fine-dining room, this isn't that: expect plastic chairs, simple settings and a bit of grill smoke. That's the trade for the setting, and most people find it more than worth it.",
        ],
      },
    ],
    faq: [
      { q: "What is Jimbaran famous for?", a: "Grilled seafood eaten at tables set on the sand at sunset, along its calm, west-facing bay. It's one of Bali's classic evenings — the setting is as much the draw as the food." },
      { q: "When should you go to Jimbaran for seafood?", a: "Around sunset — arrive a little before it to get a table on the sand for golden hour before the front rows fill. Earlier is better on weekends and in peak season." },
      { q: "How is the seafood priced in Jimbaran?", a: "Usually by weight. Confirm the weight and the price before your fish goes on the grill — that single step avoids the only common surprise." },
      { q: "Is Jimbaran good for a special dinner?", a: "Yes — it's a favourite for a memorable sunset dinner for couples and groups. Just set expectations: it's a relaxed, feet-in-the-sand meal, not a polished dining room." },
      { q: "Is Jimbaran near the airport?", a: "Yes, it's close to the airport, which makes a Jimbaran seafood dinner a good first-night or last-night plan. The bay is also calm and swimmable earlier in the day." },
    ],
    related: [
      { href: "/jimbaran", title: "The Jimbaran guide", blurb: "The seafood bay — who it suits, beaches and what to do." },
      { href: "/jimbaran/best-restaurants", title: "Best restaurants in Jimbaran", blurb: "Beyond the beach grills — where else to eat in the bay." },
      { href: "/where-to-watch-sunset-in-bali", title: "Where to watch the sunset in Bali", blurb: "Golden-hour spots across the island, by area." },
      { href: "/best-restaurants-in-bali", title: "The best restaurants in Bali", blurb: "The island's dinner scene, sorted by district." },
    ],
  },

  {
    slug: "bali-temples-which-one",
    eyebrow: "Which Bali temple",
    title: "Which Bali temple should you visit?",
    description:
      "You don't need to see them all. Pick a Bali temple by what you want — sunset, ceremony, scenery or the photo — and go early or late. Plus the etiquette that matters.",
    lede: "You don't need to visit every temple — pick one or two by what you actually want. For sunset and a show, Uluwatu or Tanah Lot; for a ceremony and holy water, Tirta Empul; for scale and significance, Besakih; for the famous photo, Lempuyang; for serene highland calm, Ulun Danu Beratan. Whichever you choose, dress respectfully and go early or late to dodge the heat and crowds.",
    sections: [
      {
        heading: "For sunset and a show: Uluwatu or Tanah Lot",
        paras: [
          "Pura Luhur Uluwatu sits on the southern cliffs and pairs a dramatic clifftop setting with the evening Kecak fire dance — the classic sunset-and-spectacle combination.",
          "Tanah Lot is the much-photographed temple on an offshore rock, another sunset favourite. Both are popular and busy at golden hour, so arrive with time to spare and lower your expectations of solitude.",
        ],
      },
      {
        heading: "For ceremony and holy water: Tirta Empul",
        paras: [
          "Tirta Empul, near Ubud, is a working temple built around sacred spring pools where Balinese come for melukat, a purification ritual. Visitors can often take part respectfully — go with a calm, unhurried mindset rather than treating it as a photo stop.",
        ],
      },
      {
        heading: "For scale and significance: Besakih",
        paras: [
          "Besakih, on the slopes of Mount Agung, is Bali's largest and most important temple complex — the \"mother temple.\" It's a bigger, more of-the-day trip up into the highlands, best paired with the drive out east rather than squeezed onto a busy south-Bali day.",
        ],
      },
      {
        heading: "For the photo and the highlands: Lempuyang and Ulun Danu Beratan",
        paras: [
          "Lempuyang, in the far east, is the \"Gates of Heaven\" shot — stunning, but expect a long queue for the photo and a real trip to reach it. Go for the view and the journey, not a quick tick.",
          "Ulun Danu Beratan sits on a lake in the cool Bedugul highlands and is the serene, mist-and-water counterpoint to the coastal sunset temples — a calm, scenic half-day if you're heading north.",
        ],
      },
      {
        heading: "Temple etiquette (this matters)",
        paras: [
          "Cover up: a sarong plus covered shoulders and knees are expected, and sarongs are usually available to borrow or rent at the entrance. Be quiet and respectful, don't climb on sacred structures, and follow any signs about where you may and may not go.",
          "Practically: go early morning or late afternoon to avoid the heat and the biggest crowds, carry water, and pick temples that fit your route rather than chaining several across the island in one hot day.",
        ],
      },
    ],
    faq: [
      { q: "Which temple in Bali is worth visiting?", a: "It depends what you want: Uluwatu or Tanah Lot for sunset and a show, Tirta Empul for a purification ceremony, Besakih for scale, Lempuyang for the famous 'Gates of Heaven' photo, and Ulun Danu Beratan for serene highland calm." },
      { q: "What is the best temple for sunset in Bali?", a: "Uluwatu (clifftop, plus the evening Kecak dance) and Tanah Lot (an offshore rock temple) are the classic sunset temples. Both are busy at golden hour, so arrive early." },
      { q: "What should you wear to a Bali temple?", a: "A sarong with covered shoulders and knees. Sarongs are usually available to borrow or rent at the entrance. Be quiet and respectful, and don't climb on sacred structures." },
      { q: "How many temples should I visit?", a: "One or two is plenty for most trips. Pick by what you want and by your route rather than chaining several across the island in the midday heat." },
      { q: "What is the 'Gates of Heaven' temple?", a: "That's Lempuyang, in far-east Bali — famous for the framed shot between two gates. It's stunning but involves a real trip and often a long queue for the photo, so go for the view and the journey." },
      { q: "Can tourists enter Bali temples?", a: "Generally yes, with respectful dress (a sarong, covered shoulders and knees) and behaviour. Follow the signs and any guidance about where you may go, and note that some inner areas are for worshippers only." },
    ],
    related: [
      { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and what to do in each area." },
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Clifftop temple, the Kecak dance and world-class sunsets." },
      { href: "/where-to-watch-sunset-in-bali", title: "Where to watch the sunset in Bali", blurb: "Golden-hour spots across the island, temples included." },
      { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "Practical basics, including temple etiquette and monkeys." },
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
      "is-bali-safe",
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
      "sanur-or-nusa-dua",
      "bali-for-digital-nomads",
    ],
  },
  {
    heading: "Best of Bali",
    blurb: "Island-wide picks, from real places we stand behind.",
    slugs: ["things-to-do-in-bali", "bali-temples-which-one", "nusa-penida-day-trip", "best-restaurants-in-bali", "jimbaran-seafood", "best-cafes-in-bali", "best-beach-clubs-in-bali", "best-coffee-in-bali", "best-spas-in-bali", "where-to-watch-sunset-in-bali", "best-warungs-in-bali"],
  },
  {
    heading: "Day plans & moments",
    blurb: "First days, one-day routes, and what to do when the weather or the group changes.",
    slugs: ["canggu-first-day", "ubud-one-day", "bali-rainy-day", "bali-with-kids"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

// Which long-form guides are most relevant to each district pillar — used to
// cross-link pillars → guides (internal-link mesh). Slugs only; the link cards
// are built from the registry so titles/blurbs can't drift.
const DISTRICT_GUIDE_SLUGS: Record<string, string[]> = {
  canggu: ["canggu-first-day", "best-restaurants-in-bali", "best-cafes-in-bali", "ubud-vs-canggu", "canggu-vs-uluwatu", "where-to-stay-in-bali", "best-coffee-in-bali", "where-to-watch-sunset-in-bali"],
  uluwatu: ["canggu-vs-uluwatu", "best-beach-clubs-in-bali", "where-to-watch-sunset-in-bali", "where-to-stay-in-bali"],
  "uluwatu-bukit": ["canggu-vs-uluwatu", "best-beach-clubs-in-bali", "where-to-watch-sunset-in-bali", "where-to-stay-in-bali"],
  ubud: ["ubud-one-day", "best-cafes-in-bali", "best-restaurants-in-bali", "ubud-vs-canggu", "where-to-stay-in-bali", "best-spas-in-bali", "how-many-days-in-bali", "bali-for-digital-nomads"],
  sanur: ["sanur-or-nusa-dua", "nusa-penida-day-trip", "bali-with-kids", "best-area-to-stay-in-bali-for-families", "where-to-stay-in-bali", "best-spas-in-bali", "how-to-get-around-bali"],
  seminyak: ["best-restaurants-in-bali", "seminyak-vs-canggu", "best-beach-clubs-in-bali", "best-spas-in-bali", "where-to-stay-in-bali", "best-coffee-in-bali"],
  "nusa-dua": ["sanur-or-nusa-dua", "bali-with-kids", "best-area-to-stay-in-bali-for-families", "best-spas-in-bali", "where-to-stay-in-bali", "best-beach-clubs-in-bali"],
  "nusa-penida": ["nusa-penida-day-trip", "how-to-get-around-bali", "how-many-days-in-bali", "where-to-stay-in-bali", "best-time-to-visit-bali"],
  sidemen: ["how-to-get-around-bali", "best-time-to-visit-bali", "how-many-days-in-bali", "where-to-stay-in-bali"],
  amed: ["how-to-get-around-bali", "best-time-to-visit-bali", "is-bali-safe", "where-to-stay-in-bali"],
  munduk: ["best-time-to-visit-bali", "how-to-get-around-bali", "how-many-days-in-bali", "where-to-stay-in-bali"],
  lovina: ["how-to-get-around-bali", "best-time-to-visit-bali", "where-to-stay-in-bali", "how-many-days-in-bali"],
  jimbaran: ["best-restaurants-in-bali", "where-to-watch-sunset-in-bali", "best-area-to-stay-in-bali-for-families", "best-spas-in-bali", "where-to-stay-in-bali", "best-beach-clubs-in-bali"],
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
