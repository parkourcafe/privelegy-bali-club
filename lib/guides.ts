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
  { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, reef-break surf, dinners with a view." },
];

export const GUIDES: Guide[] = [
  {
    // Bespoke top-level pillar hub (app/bali-travel-guide) — the "bali travel
    // guide" head-term entry point that links out to every cluster (plan, stay,
    // eat, do, districts, moments). Registry entry is metadata-only for the sitemap.
    slug: "bali-travel-guide",
    title: "Bali travel guide",
    description:
      "A resident-curated Bali travel guide, planned by area. How long to go and when, where to stay, how to get around, what to do and where to eat.",
  },

  {
    slug: "where-to-stay-in-bali",
    title: "Where to stay in Bali for the first time",
    description:
      "How Bali's five first-timer areas (Canggu, Seminyak, Uluwatu, Ubud and Sanur) actually differ, and how to pick the right base for your first trip.",
  },

  {
    // Bespoke, data-driven route (app/best-beach-clubs-in-bali) — registry
    // entry is metadata-only so the sitemap enumerates it.
    slug: "best-beach-clubs-in-bali",
    title: "The best beach clubs in Bali",
    description:
      "Bali's best beach clubs by area: clifftop sunsets in Uluwatu, the Seminyak classics, Canggu's Echo Beach line-up and calm family options in the south.",
  },

  {
    // Bespoke, data-driven route (app/best-coffee-in-bali) — curated specialty
    // roasters/cafés; registry entry is metadata-only for the sitemap.
    slug: "best-coffee-in-bali",
    title: "The best specialty coffee in Bali",
    description:
      "Where to find specialty coffee in Bali: the roasters and cafés across Canggu, Seminyak, Ubud and Uluwatu that treat coffee as the craft.",
  },

  {
    // Bespoke, data-driven route (app/best-spas-in-bali) — metadata only.
    slug: "best-spas-in-bali",
    title: "The best spas & wellness in Bali",
    description:
      "Bali's best spas and wellness by area: Ubud's healing centres, the Seminyak spa strip, Canggu recovery and calm coastal treatments. Sorted by district.",
  },
  {
    // Bespoke, data-driven route (app/where-to-watch-sunset-in-bali) — metadata only.
    slug: "where-to-watch-sunset-in-bali",
    title: "Where to watch the sunset in Bali",
    description:
      "Bali's best sunset spots by area: Uluwatu's clifftop bars, Seminyak and Canggu beach clubs, and calm-bay options in the south. Where to be at golden hour.",
  },
  {
    // Bespoke, data-driven route (app/best-warungs-in-bali) — metadata only.
    slug: "best-warungs-in-bali",
    title: "The best warungs & local food in Bali",
    description:
      "Where to eat cheap local food in Bali. The warungs and babi guling stalls we rate, district by district, from Canggu and Ubud to the south.",
  },
  {
    // Bespoke, data-driven route (app/best-restaurants-in-bali) — metadata only.
    slug: "best-restaurants-in-bali",
    title: "The best restaurants in Bali",
    description:
      "Bali's best restaurants by area: Canggu's dinner scene, Seminyak fine dining, Ubud's jungle-view tables, Jimbaran seafood and clifftop Uluwatu.",
  },
  {
    // Bespoke, data-driven route (app/best-cafes-in-bali) — metadata only.
    slug: "best-cafes-in-bali",
    title: "The best cafés in Bali",
    description:
      "Bali's best cafés by area: Canggu's laptop-friendly brunch and specialty coffee, Ubud's health-food spots, Seminyak all-day cafés and clifftop Uluwatu.",
  },
  {
    // Bespoke hub route (app/things-to-do-in-bali) — metadata only.
    slug: "things-to-do-in-bali",
    title: "Best things to do in Bali",
    description:
      "The best things to do in Bali, by what you want. Temples, volcanoes, waterfalls and Nusa Penida, then each area, from Ubud's rice terraces to Uluwatu's cliffs.",
  },

  {
    slug: "is-bali-safe",
    eyebrow: "Is Bali safe?",
    title: "Is Bali safe? An honest, practical safety guide",
    description:
      "Yes, Bali is broadly safe for tourists. The real risks are mundane and preventable: scooters, rip currents, stomach bugs and petty scams. How to handle each.",
    lede: "Yes, Bali is broadly safe for mainstream travel, and no major government rates it a danger zone. The real risks are not terrorism or violent crime. They are ordinary and largely preventable: rented scooters, rip currents, stomach bugs, dodgy drinks and petty scams. Handle those few things well and Bali is as safe as most popular holiday destinations.",
    sections: [
      {
        heading: "The biggest real risk: scooters and roads",
        paras: [
          "Traffic accidents, overwhelmingly on rented scooters, are the number-one cause of tourist injury and death in Bali. This is the risk to take seriously, not crime.",
          "You legally need your home licence plus an International Driving Permit with the motorcycle (Class A) endorsement. A car-only IDP doesn't cover even a 110cc scooter. Helmets are mandatory. Most travel-insurance policies void your medical cover if you ride without the correct licence or a helmet. That can leave you personally liable for a large hospital bill.",
          "Get the motorcycle-endorsed IDP before you fly and confirm in writing that your insurer covers motorbikes. Always wear the helmet. If you're not a confident rider, use Grab, Gojek or a private driver instead. It's cheap and removes the single biggest danger.",
        ],
      },
      {
        heading: "The sea: rip currents and which beaches are calm",
        paras: [
          "Bali's west and south coasts (Kuta, Legian, Echo Beach and the Uluwatu stretch) have year-round surf and permanent rip currents. They catch swimmers every year, often at unpatrolled beaches. Calmer, family-friendly swimming is on the east and south-east: Sanur, Nusa Dua's protected bay, and Jimbaran Bay.",
          "Patrolled beaches use Balawista lifeguards and a flag system: swim only between the red-and-yellow flags, and never when a red flag is flying. If you're caught in a rip, don't fight it. Stay calm, float, and swim parallel to the beach to escape the channel before heading in.",
        ],
      },
      {
        heading: "Staying healthy: stomach, rabies and mosquitoes",
        paras: [
          "\"Bali belly\" (traveller's diarrhoea) is the most common traveller ailment, usually from tap water, ice or undercooked food. Bali tap water isn't safe to drink. Use sealed bottled or filtered water, including for brushing teeth. Skip ice unless you know it's from purified water, and favour freshly cooked, hot, busy-kitchen food.",
          "Rabies is present in Bali, carried mainly by stray dogs; the monkeys at Ubud's Monkey Forest and Uluwatu Temple also bite and scratch. Don't touch or feed stray animals. A bite or scratch is a time-critical emergency. Wash it with soap under running water for about 15 minutes and get to a clinic (BIMC, Siloam) the same day for post-exposure treatment. It works well when started promptly.",
          "Dengue fever is endemic, worst in the rainy season, and its mosquitoes bite by day. Use a DEET or picaridin repellent and cover up at dawn and dusk. Malaria is essentially not a risk in Bali's tourist areas, so antimalarial tablets aren't normally recommended for a standard Bali trip.",
        ],
      },
      {
        heading: "Drinks: the one methanol rule",
        paras: [
          "This is a documented, occasionally fatal risk rather than a myth. Bootleg local spirits (arak) and cheap \"free-pour\" cocktails have been contaminated with methanol, which can blind or kill. There have been tourist deaths on record.",
          "The rule is simple: stick to sealed bottles and cans from reputable brands, with intact seals. Be wary of unusually cheap cocktails, free arak shots and drinks from unlicensed sellers. Severe next-day illness or blurred vision after drinking warrants immediate hospital care.",
        ],
      },
      {
        heading: "Scams and petty theft",
        paras: [
          "Crime against tourists is mostly petty and opportunistic, not violent. The usual scams are money-changers short-changing you, ATM skimming, bag-snatching by passing scooters and inflated taxi fares. With changers, use authorised ones with a posted licence, not \"amazing rate\" street booths, and count the cash yourself before leaving. Use ATMs inside bank branches. Carry bags on the side away from the road. Book taxis through the Grab or Gojek apps, or use metered Bluebird.",
          "The classic scooter-rental trick is an invented \"damage\" claim on return. Before you ride off, film a slow, narrated video of every panel, mirror and the seat compartment. It ends the argument instantly.",
        ],
      },
      {
        heading: "Natural hazards: volcanoes and earthquakes",
        paras: [
          "Bali sits on the Ring of Fire, so earthquakes and volcanic activity are routine. Tsunami risk is low but real, and coastal areas have evacuation signage. Bali's own Mount Agung has been calm recently. But volcanoes elsewhere in the region periodically send ash over the flight paths and cancel Bali flights. That's a safety measure, not an over-reaction.",
          "Volcano status changes fast, so check the live alert level on Indonesia's official MAGMA Indonesia service before you travel. During any eruption period, build a buffer day into tight flight connections.",
        ],
      },
      {
        heading: "Solo and female travellers",
        paras: [
          "Bali is a generally safe destination for solo and female travellers with standard precautions. Still, reports of sexual assault are relatively high in Bali and Lombok. Drink-spiking has been reported around nightlife, so vigilance at bars and clubs matters.",
          "Watch your drink being made or choose sealed bottles, and never leave it unattended. Avoid solo scooter rides on unlit roads late at night, and dress modestly at temples. These are the same precautions you'd take in any busy nightlife destination.",
        ],
      },
      {
        heading: "Laws worth knowing",
        paras: [
          "Indonesia's drug laws are zero-tolerance. Even small amounts bring long prison terms, and major trafficking can carry life imprisonment or the death penalty. There is no exemption for foreigners. Decline entirely. Nothing is worth the risk.",
          "Indonesia's new criminal code (in force from January 2026) was widely misreported. It technically restricts sex outside marriage and unmarried cohabitation, but these are complaint-based offences. They can only be acted on if a close family member files a formal complaint. The government has confirmed there are no marital-status checks at hotels. Ordinary couples sharing a room are not the target.",
          "Temple etiquette is taken seriously: wear a sarong, cover shoulders and knees, and don't climb sacred structures. Sarongs are usually provided at temple entrances.",
        ],
      },
      {
        heading: "If something goes wrong",
        paras: [
          "Indonesia's emergency number is 112. Bali has good private hospitals used to foreign patients (BIMC and Siloam). Treatment, and especially medical evacuation, is expensive without cover: an evacuation can run into tens of thousands of dollars.",
          "This is why comprehensive travel insurance is non-negotiable. Buy a policy that explicitly covers scooter use (with a valid licence) and medical evacuation with a high limit. Save your insurer's 24-hour assistance line and the hospital numbers in your phone before you need them.",
        ],
      },
    ],
    faq: [
      { q: "Is Bali safe for tourists right now?", a: "Broadly, yes. Major government advisories keep Indonesia in the middle \"exercise increased/high caution\" band, the same as many popular destinations, rather than a \"do not travel\" rating. Bali specifically has no blanket warning. Check your own government's page and any live volcano status the week you fly." },
      { q: "What is the biggest danger in Bali?", a: "Rented scooters. Traffic accidents are by far the leading cause of tourist injury, and riding without the correct motorcycle licence can also void your travel insurance. Wear a helmet, carry a motorcycle-endorsed IDP, or use a driver." },
      { q: "Is Bali safe for solo female travellers?", a: "Yes, it's a generally safe solo destination with standard precautions. Be alert around nightlife (drink-spiking has been reported), avoid solo night scooter rides on dark roads, and dress modestly at temples." },
      { q: "Can you drink the tap water in Bali?", a: "No, tap water isn't safe to drink. Use sealed bottled or filtered water (including for brushing teeth), avoid ice of uncertain source, and eat freshly cooked hot food to avoid \"Bali belly.\"" },
      { q: "Do I need malaria tablets for Bali?", a: "Not for a standard Bali trip: the tourist areas are considered malaria-free. Dengue is present, though, so focus on daytime mosquito-bite prevention with repellent and covering up at dawn and dusk." },
      { q: "Do Indonesia's new sex laws affect tourists?", a: "In practice, no. The 2026 criminal code's cohabitation and extramarital-sex provisions are complaint-based: they're only actionable if a close family member formally complains. Officials have confirmed there are no marital-status checks at hotels. Ordinary couples sharing a room are not the target." },
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
      "Nusa Penida from Bali as a day trip or overnight: the Sanur fast boat, the west-coast loop (Kelingking, Angel's Billabong), the quieter east and mantas.",
    lede: "You can do Nusa Penida as a day trip from Bali, and most people do. It's a 30–45 minute fast boat from Sanur. But it's a long, rushed day on rough roads, so you realistically see one side of the island. If you can spare a night, staying over is the single biggest upgrade. You split the island east and west, and you get the big sights near-empty once the day-trippers leave.",
    sections: [
      {
        heading: "Getting there: the fast boat from Sanur",
        paras: [
          "Sanur is the main gateway. Since late 2022 most boats leave from the government-built Sanur Harbour on Jl. Matahari Terbit. It's a terminal with indoor check-in and a dry pier, not the old wade-through-the-surf boarding. The crossing is roughly 30–45 minutes, and fast boats run frequently from early morning (around 6.30–7.30am) to a last boat around 5pm.",
          "If you're staying in east Bali, Kusamba is an alternative departure point with a slightly shorter crossing. Book online ahead, especially for the first morning boat and in peak season. Arrive at least 30 minutes before departure to swap your voucher for a boarding pass. Exact times vary by operator, so check your own boat's timetable.",
        ],
      },
      {
        heading: "Day trip or overnight?",
        paras: [
          "A day trip works, but be realistic. Ferry check-in, waiting for your group, potholed roads that turn short distances into 40-minute drives, and photo queues at Kelingking all eat the clock. In one day you comfortably see one side of the island, usually the west.",
          "An overnight changes the trip entirely. You cover the west one day and the east the other, with a snorkel fitted in. And you reach the headline sites in the late afternoon and early morning, after the day boats have gone and before they arrive.",
        ],
      },
      {
        heading: "The west loop (the classic day)",
        paras: [
          "The west and south-west cluster is closest to the harbour and makes a natural single-day loop. Kelingking Beach is the \"T-Rex\" cliff. The viewpoint is a short walk, but the descent to the sand is steep, strenuous and optional. Swimming at the beach is forbidden because the currents are deadly.",
          "Angel's Billabong is a natural infinity tidal pool that is only safe at low tide. Never enter on a rising or high tide: rogue waves have swept people out to sea here. Broken Beach (Pasih Uug) next door is a photogenic rock-arch cove, but a viewpoint rather than a swim. Crystal Bay is the calm, palm-lined west-side beach for a swim, a snorkel and the sunset.",
        ],
      },
      {
        heading: "The quieter east side",
        paras: [
          "The east is at least as beautiful as the west and far less crowded, which is why it's usually a separate day. Diamond Beach and neighbouring Atuh Beach are dramatic white-sand coves under east-facing cliffs, reached by steep carved stairways.",
          "Nearby, the Thousand Islands viewpoint (Raja Lima) looks out over scattered islets and the cliffside tree house. The rolling Teletubbies Hills are named for their resemblance to the children's show. The stairways down to the beaches are a real climb in the heat, so do them earlier and carry water.",
        ],
      },
      {
        heading: "Snorkelling with manta rays",
        paras: [
          "Snorkelling with manta rays is a common half-day boat trip. It usually stops at three or four spots, depending on the day's water. Manta Point or Manta Bay, Crystal Bay and Gamat Bay are among them. Mantas are present at the cleaning stations essentially year-round, so there's no strictly wrong season. Sightings are likely rather than guaranteed.",
          "Manta Point water is often colder and choppier than the calmer bays. A rash guard helps, and seasickness precautions are worth taking if you're prone.",
        ],
      },
      {
        heading: "Getting around the island",
        paras: [
          "The roads are rough in places: potholes, steep descents and sections barely wide enough for two vehicles. Some main routes have been resurfaced. There is no Grab or Gojek on the island, and no taxi network.",
          "For most visitors the clear choice is a hired car with a driver or an organised tour, not a self-drive scooter day. The descents to beaches like Kelingking are steep enough to overwhelm scooter brakes. Arrange your driver or tour before you arrive, and expect parking bottlenecks at Kelingking. Start at the far or less-crowded stop first to stay ahead of the crowd.",
        ],
      },
      {
        heading: "What to pack and know",
        paras: [
          "Wear closed shoes for the steep stairs and rocky terrain, and carry flip-flops for the beach. Bring plenty of cash. ATMs are few, often don't take foreign cards and frequently run empty, so withdraw on mainland Bali before you cross.",
          "Pack high-SPF reef-safe sunscreen and water, and start on the first morning boat to maximise daylight and beat the crowds. Take the water safety seriously. Only enter Angel's Billabong at low tide, obey the no-swimming signs at Kelingking, and check ocean conditions before getting in anywhere. The channel crossing can be choppy, so bring motion-sickness medication if you're susceptible.",
        ],
      },
      {
        heading: "How long to spend",
        paras: [
          "One day is realistic for one side (usually the west) or a snorkel plus a couple of sights. It's doable but rushed. Two days with a night on the island works well. Do the west one day and the east the other, with a snorkel fitted in and far fewer crowds.",
          "Three or four days lets you add relaxed beach time and see everything without racing the ferry clock. If you can spare even one night, it converts a stressful car-bound day into two calm ones.",
        ],
      },
      {
        heading: "Which starting area works best",
        paras: [
          "Sanur is easiest. It's the main departure harbour, so a day trip from here loses the least time to transfers. Seminyak and Kuta work fine with enough buffer before the boat. Nusa Dua and Jimbaran are workable depending on which port your boat uses.",
          "Canggu needs more caution during heavy traffic to Sanur. Ubud, Uluwatu, Amed and Lovina are the furthest from the harbour and make an already-long day longer. From any of these, an overnight on the island is worth considering.",
        ],
      },
      {
        heading: "Before you book, ask the operator",
        paras: [
          "Which Bali port and which Nusa Penida port does the boat use? Is hotel pickup included or separate? What's the plan if sea conditions change or boats are disrupted? How much time is spent driving on the island once you land? Are entrance, parking, shuttle or local fees separate from the boat ticket? Are any swim stops conditional on tide or sea conditions on the day?",
        ],
      },
    ],
    faq: [
      { q: "Can you do Nusa Penida as a day trip from Bali?", a: "Yes. It's a 30–45 minute fast boat from Sanur, and a day trip is what most people do. But it's a long, rushed day on rough roads, so you'll realistically see just one side (usually the west). An overnight lets you see both sides comfortably and avoid the crowds." },
      { q: "How do you get to Nusa Penida?", a: "By fast boat, mainly from Sanur Harbour (about 30–45 minutes), with frequent departures from early morning to around 5pm. Kusamba, in east Bali, is an alternative with a slightly shorter crossing. Book ahead, especially the first morning boat." },
      { q: "Is one day enough for Nusa Penida?", a: "For one side of the island, yes. Combining the west (Kelingking, Angel's Billabong) and the east (Diamond, Atuh) in one day means spending most of it in the car on rough roads. Pick one side, or stay a night." },
      { q: "Can you swim at Nusa Penida's beaches?", a: "At some, not others. Swimming is forbidden at Kelingking (deadly currents). Angel's Billabong is only safe to enter at low tide. Never go in on a rising tide: people have been swept out there. Crystal Bay is the calm, swimmable west-side beach." },
      { q: "Should you rent a scooter in Nusa Penida?", a: "Only if you're a confident, experienced rider. The roads are rough and the descents to the beaches are steep enough to overwhelm scooter brakes. For most visitors a hired driver or an organised tour is the safer, easier choice, and there's no Grab or taxi network on the island." },
      { q: "Can you see manta rays in Nusa Penida?", a: "Yes. Snorkelling with manta rays is a common half-day boat trip, and mantas are present at the cleaning stations essentially year-round. Sightings are likely but never guaranteed." },
      { q: "Do you need cash in Nusa Penida?", a: "Yes, bring plenty. ATMs are few, often don't accept foreign cards and frequently run empty, and most tours, rentals and eateries are cash-only. Withdraw on mainland Bali before you cross." },
    ],
    related: [
      { href: "/bali-day-trips", title: "Bali day trip ideas", blurb: "Compare routes by region, mood and starting point." },
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
      "For a first trip, plan 7–10 days in Bali: a few nights inland in Ubud, a few by the sea. What fits in 5, 7, 10 and 14 days, and how many bases to keep.",
    lede: "For a first trip, plan on 7 to 10 days in Bali. That is enough to split your time between one inland base and one by the sea without spending the holiday in traffic. Five days works if you stay in a single area. Two weeks lets you add the islands or the east coast without rushing.",
    sections: [
      {
        heading: "5 days: pick one base",
        paras: [
          "Five days is a single-area trip. Choose one place and stay there: Canggu or Seminyak for beach and cafés, Ubud for jungle and culture.",
          "Arrival and departure each eat most of a day, so you have three full days. Spend them settling in, not crossing the island on a scooter for a photo.",
        ],
      },
      {
        heading: "7 days: one inland + one coastal base",
        paras: [
          "A week works well for a first trip. The usual split is three or four nights in Ubud for temples, rice terraces and yoga, then three or four by the sea in Canggu, Seminyak or Uluwatu.",
          "Two bases, one move. That transfer costs you half a day. Add a third move and the trip starts to be about logistics.",
        ],
      },
      {
        heading: "10 days: add a third pace",
        paras: [
          "Ten days lets you add a slower stretch of coast on top of Ubud and a beach base. Sanur is the calm family option and the boat to the Nusa islands leaves from there; Uluwatu is the clifftop-sunset option.",
          "This is the most comfortable length for a first visit. There is room for a rest day, a day trip and an afternoon with no plan.",
        ],
      },
      {
        heading: "14 days: go wider",
        paras: [
          "Two weeks opens up the quieter side of Bali: the east (Amed, Sidemen), the Nusa islands, or a few nights on Gili or Lombok, with the first-timer highlights still in.",
          "Even then, keep it to three or four bases. Distance in Bali is measured in traffic, not kilometres.",
        ],
      },
    ],
    faq: [
      { q: "Is 5 days enough for Bali?", a: "Enough for one area done well. Pick a single base and don't try to see the whole island. For Ubud plus a beach area you want at least 7 days." },
      { q: "Is a week enough for Bali?", a: "Yes. Seven days covers a first trip: a few nights inland in Ubud and a few by the sea, with one transfer between them." },
      { q: "How long to see Bali and the islands?", a: "Plan 10–14 days if you want the Nusa islands, the east coast or Gili and Lombok on top of the mainland first-timer route." },
      { q: "How many places should I stay in?", a: "One or two on a short trip, three or four on two weeks. Each move costs the better part of a day in traffic, so fewer bases means more Bali." },
    ],
    related: PILLAR_LINKS,
  },


  {
    slug: "bali-itinerary-3-days",
    eyebrow: "3-day Bali itinerary",
    title: "Bali itinerary: 3 days without rushing",
    description:
      "A practical 3-day Bali itinerary for a short first trip: one base, one inland day, one coast day and no overpacked transfer schedule.",
    lede: "Three days in Bali is short, so plan with restraint. Choose one base, keep each day to one main area, and don't pretend you can see the whole island. This plan gives you a soft landing, one culture or nature day, and one coast/sunset day without turning the trip into traffic.",
    sections: [
      {
        heading: "Day 1: land, settle, stay local",
        paras: [
          "Pick a base that matches the trip. Canggu or Seminyak for food and sunset; Ubud for jungle and culture; Sanur for a calmer family start; Uluwatu for cliffs and surf.",
          "Do not cross the island after landing unless your accommodation requires it. Eat close to where you sleep, save one nearby place, and leave the evening flexible.",
        ],
      },
      {
        heading: "Day 2: one proper Bali day",
        paras: [
          "If you are based inland, make this the rice terrace, temple, waterfall or workshop day. If you are based on the coast, book one driver-led day in Ubud or the Bukit instead of trying to stitch three districts together.",
          "Start early and finish before traffic turns the return into the main event. One strong day beats five half-seen stops.",
        ],
      },
      {
        heading: "Day 3: coast, spa, sunset, easy exit",
        paras: [
          "Keep the last day close to your base: breakfast, beach or pool, and a spa/reset stop. Then a sunset and dinner nearby, if your flight allows it.",
          "If you fly out late, build the airport transfer into the plan. Bali traffic is not a detail you add at the end.",
        ],
      },
    ],
    faq: [
      { q: "Is 3 days enough for Bali?", a: "Enough for one base and a clear taste of the island, not enough for a full Bali loop. Pick either coast plus one inland day, or Ubud plus one coast/sunset day." },
      { q: "Where should I stay for 3 days?", a: "Canggu, Seminyak, Sanur or Ubud are the easiest first-trip bases. Choose by pace: food/sunset, polished dining, calm family logistics, or jungle/culture." },
      { q: "Should I visit Nusa Penida on a 3-day trip?", a: "Only if the island viewpoint is the main reason for your trip. Otherwise it eats too much time for a short first visit." },
    ],
    related: [
      { href: "/bali-itinerary-5-days", title: "Bali itinerary: 5 days", blurb: "A little more room without adding too many bases." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "Choose the base before you choose the stops." },
      { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Plan by time, not distance." },
    ],
  },

  {
    slug: "bali-itinerary-5-days",
    eyebrow: "5-day Bali itinerary",
    title: "Bali itinerary: 5 days for a first trip",
    description:
      "A realistic 5-day Bali itinerary: one main base, one inland day, one coast day, one flex day and no forced island loop.",
    lede: "Five days is enough to do one area well and add one or two deliberate day trips. It is not enough for every famous stop on the island. Keep one main base and add a driver day when it earns its place. Leave one flexible day for weather, traffic or the place you want to repeat.",
    sections: [
      {
        heading: "Day 1: arrive and choose your pocket",
        paras: [
          "After you land and check in, stay within your area. Use the first evening to understand your base: where breakfast is, where sunset works, and how long short rides actually take.",
        ],
      },
      {
        heading: "Day 2: local rhythm",
        paras: [
          "Do the version of Bali your base is good at. Canggu for surf, cafés and sunset; Ubud for rice fields and culture; Sanur for calm beach logistics; Uluwatu for cliffs and beach time.",
        ],
      },
      {
        heading: "Day 3: one driver-led day",
        paras: [
          "Add one bigger day outside your base: Ubud from the coast, the Bukit from Canggu/Seminyak, or East Bali if you are already positioned well. Keep stops tight and sequenced.",
        ],
      },
      {
        heading: "Day 4: reset or repeat",
        paras: [
          "Use this as a lower-friction day: spa, beach club, long lunch, shopping, or the guide/route you saved after learning your own pace. This is where the trip starts to feel personal instead of scheduled.",
        ],
      },
      {
        heading: "Day 5: easy final day",
        paras: [
          "Stay close, book only what you can reach comfortably, and leave a real airport buffer. If you have a late flight, choose a final meal or spa on the airport side of your route.",
        ],
      },
    ],
    faq: [
      { q: "Is 5 days enough for Bali?", a: "Yes for one base plus one or two day trips. It is too short for Ubud, Canggu, Uluwatu, Nusa Penida and East Bali in one comfortable trip." },
      { q: "Should I split hotels on a 5-day trip?", a: "Usually no. One base is calmer. Split only if you strongly want two different paces, such as Ubud plus the coast." },
      { q: "What should I book ahead?", a: "Book accommodation, airport transfer, any driver day, and the few meals or sunset spots that matter. Leave cafés and casual meals flexible." },
    ],
    related: [
      { href: "/bali-itinerary-3-days", title: "Bali itinerary: 3 days", blurb: "The tighter version for a short stopover." },
      { href: "/bali-itinerary-7-days", title: "Bali itinerary: 7 days", blurb: "The more comfortable first-timer route." },
      { href: "/how-many-days-in-bali", title: "How many days in Bali", blurb: "Choose the trip length before the route." },
    ],
  },

  {
    slug: "canggu-without-a-scooter",
    eyebrow: "Canggu without a scooter",
    title: "Canggu without a scooter: where to stay and how to move",
    description:
      "How to do Canggu without a scooter: choose a walkable pocket, use ride apps for short hops, and avoid traffic-heavy cross-Canggu days.",
    lede: "You can enjoy Canggu without a scooter if you design the day around one pocket at a time. The mistake is booking a villa far from the places you actually want, then trying to cross Berawa, Batu Bolong and Pererenan every few hours.",
    sections: [
      {
        heading: "Choose the pocket first",
        paras: [
          "Batu Bolong is the easiest for a first-timer who wants beach, cafés and dinner close together. Berawa works for beach clubs, gyms and polished restaurants. Pererenan is calmer, but you will rely more on ride apps for some moves.",
          "Walkability in Canggu means within a pocket, not across all of Canggu. Treat each pocket like its own small day plan.",
        ],
      },
      {
        heading: "Use short hops, not constant crossing",
        paras: [
          "Grab and Gojek cover many short rides, but pickup friction and traffic rise around sunset and dinner. Pair stops by area: brunch and spa in one pocket, sunset and dinner in another.",
          "For Ubud, Uluwatu or airport moves, use a private driver instead of stitching together ride-app hops.",
        ],
      },
      {
        heading: "Best Canggu days without a scooter",
        paras: [
          "A good no-scooter day is compact. Have breakfast near your stay, then one beach or pool stop and a massage or café reset. Finish with sunset and dinner in the same area.",
          "Avoid plans that require three cross-Canggu moves. The distances look small on a map; the friction is in roads, parking and timing.",
        ],
      },
    ],
    faq: [
      { q: "Can I stay in Canggu without driving a scooter?", a: "Yes. Stay in Batu Bolong, Berawa or Pererenan based on your main daily rhythm, then use ride apps or a driver for bigger moves." },
      { q: "Is Canggu walkable?", a: "Within small pockets, yes. Across Canggu, no: traffic, narrow roads and heat make it unrealistic as a single walking area." },
      { q: "Where should I stay without a scooter?", a: "Batu Bolong is the easiest first choice. Berawa works if beach clubs, gyms and restaurants are the priority. Pererenan is calmer but less frictionless." },
    ],
    related: [
      { href: "/canggu", title: "The Canggu guide", blurb: "Choose the pocket before the day." },
      { href: "/route/first-day", title: "Canggu first-day route", blurb: "A compact soft landing." },
      { href: "/route/cafe-work", title: "Canggu café work route", blurb: "A low-friction remote-work day." },
      { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Drivers, ride apps and when not to scooter." },
    ],
  },
  {
    slug: "bali-itinerary-7-days",
    eyebrow: "7-day Bali itinerary",
    title: "Bali itinerary: 7 days for first-timers",
    description:
      "A relaxed 7-day Bali itinerary for a first trip, with minimal driving. A few nights in Ubud for jungle and culture, then the coast for surf, cafés and sunsets.",
    lede: "This calm 7-day Bali itinerary for first-timers is built around two bases and one transfer. Spend three nights in Ubud for jungle, temples and slow mornings, then four on the coast for surf, cafés and sunsets. It keeps driving to a minimum so the week feels like a holiday, not a road trip.",
    sections: [
      {
        heading: "Days 1–3: Ubud (jungle and culture)",
        paras: [
          "Land, settle, and let the first evening be an easy dinner near your stay. Don't schedule anything after a long flight.",
          "Give the next two days to the inland highlights: rice terraces, a temple or two, a waterfall, a morning of yoga, and long slow dinners. Ubud is where Bali is green and cool, so front-load the culture before the beach.",
          "Keep the pace gentle. Ubud rewards mornings: go early to the terraces and temples before the tour buses, then rest through the heat.",
        ],
      },
      {
        heading: "Day 4: transfer to the coast",
        paras: [
          "Move to your beach base: Canggu for surf and cafés, Seminyak for polished dining, or Uluwatu for the cliffs. The drive from Ubud is roughly 1.5–2 hours depending on traffic and where you land.",
          "Arrive with the afternoon free for a first swim, a sunset, and an easy dinner. Don't over-plan a transfer day.",
        ],
      },
      {
        heading: "Days 5–7: the coast (surf, cafés, sunsets)",
        paras: [
          "Fall into the coastal rhythm. Work from a café or surf in the morning, then have a long lunch. Sit out the heat at a spa or a pool, then finish with a sunset spot and dinner near where you sleep.",
          "Book the few things worth booking before you land: a sunset table, a good dinner. That way you're never deciding at 7pm with a hungry group.",
          "Leave the last morning loose. Traffic to the airport is unpredictable, so build in a real buffer for your flight out.",
        ],
      },
    ],
    faq: [
      { q: "Is 7 days enough for a first trip to Bali?", a: "Yes, a week works well. Split it between one inland base (Ubud) and one coastal base, with a single transfer, and you'll see the highlights without living in traffic." },
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
      "A 10–14 day Bali itinerary that adds a third pace to the first-timer route: Ubud, the coast, and the quieter islands or east, without rushing.",
    lede: "With 10 to 14 days you can keep the relaxed first-timer core of Ubud plus a beach base. Then add a third pace: the Nusa islands, the quieter east, or clifftop Uluwatu. The trick is still restraint. Keep to three or four bases at most, so the trip stays a holiday rather than a logistics exercise.",
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
          "Book sunset tables and popular dinners ahead. They fill up, especially in July and August.",
        ],
      },
      {
        heading: "Days 8–10: add the islands or the Bukit",
        paras: [
          "For turquoise water and a change of scene, take the fast boat from Sanur to Nusa Penida or Nusa Lembongan for two or three nights.",
          "If you'd rather stay on the mainland, base in Uluwatu on the southern Bukit for clifftop sunsets and surf beaches.",
        ],
      },
      {
        heading: "Days 11–14 (if you have them): the quiet side",
        paras: [
          "Two full weeks is enough to reach the calm east: Amed for diving and black-sand quiet, or Sidemen for rice-valley stillness. Or use the time to add a few nights on Gili or Lombok.",
          "Keep transfers few and deliberate. Even at two weeks, distance in Bali is measured in traffic, not kilometres.",
        ],
      },
    ],
    faq: [
      { q: "Is 10 days too long for Bali?", a: "No. Ten days is the most comfortable length for a first visit. There's room for a rest day, a day trip and a spontaneous afternoon on top of the highlights." },
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
      "Bali's dry season (roughly April–October) brings the best weather; the wet season (November–March) is greener and quieter. How to choose between them.",
    lede: "The best time to visit Bali is the dry season, roughly April to October, when the days are sunny and humidity is lower. May, June and September, the shoulder months, give you good weather without the July–August peak crowds. From November to March the wet season is greener and quieter. It's also cheaper, with short heavy downpours rather than all-day rain.",
    sections: [
      {
        heading: "Dry season (April–October): the reliable choice",
        paras: [
          "Expect sunny days, lower humidity and calmer seas on the west and south coasts. This is peak surf season for the famous Bukit breaks.",
          "July and August are the busiest and priciest months, when European and Australian holidays overlap. Book accommodation and popular dinners well ahead if you travel then.",
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
          "Rain usually comes as short, heavy afternoon downpours rather than all-day grey, so you can still plan around it. The landscape is at its greenest and the rice terraces most photogenic.",
          "Prices soften and popular spots are calmer. Ubud and inland areas see more rain than the south; pack for humidity and a daily shower.",
          "Note Nyepi, the Balinese Day of Silence (usually in March): the whole island shuts down for 24 hours, including the airport. Plan around the date if you travel in early spring.",
        ],
      },
    ],
    faq: [
      { q: "What is the best month to visit Bali?", a: "May, June and September offer the best balance: dry-season weather without the July–August crowds and prices." },
      { q: "Is the rainy season a bad time for Bali?", a: "Not at all. November–March is greener, quieter and cheaper, with short heavy downpours rather than constant rain. Just build flexibility into beach days." },
      { q: "When is Bali most crowded?", a: "July and August, plus the Christmas–New Year period. Book accommodation and popular restaurants further ahead for those windows." },
      { q: "What is Nyepi and does it affect my trip?", a: "Nyepi is the Balinese Day of Silence, usually in March. For 24 hours the island shuts down, including the airport. Check the date if you travel in early spring." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "how-to-get-around-bali",
    eyebrow: "Getting around Bali",
    title: "How to get around Bali",
    description:
      "How to get around Bali by scooter, private driver or ride-hailing app, what each option roughly costs, and when to use which.",
    lede: "Most travellers get around Bali three ways. A rented scooter covers short local hops, and a private driver handles day trips and longer transfers. Ride-hailing apps (Grab and Gojek) are for quick point-to-point rides. There's no train and no metro, and traffic is heavy all day. Distances that look short on a map can take an hour, so plan by time, not kilometres.",
    sections: [
      {
        heading: "Scooter: freedom for short hops",
        paras: [
          "A rented scooter is how most long-stay travellers move around Canggu, Uluwatu and Ubud. It's cheap and frees you from waiting on rides, typically a modest daily rate.",
          "Ride only if you're confident: Bali traffic is chaotic, roads can be rough, and accidents are common. You legally need an International Driving Permit with a motorcycle category. Police do check, and your travel insurance won't pay out without it. Always wear a helmet.",
        ],
      },
      {
        heading: "Private driver: best for day trips and transfers",
        paras: [
          "For airport transfers, temple-and-waterfall day trips or moving between bases, a private driver is the easy, comfortable option. It's usually booked by the day or the trip.",
          "Drivers double as guides and wait for you between stops. It's the stress-free way to cover longer distances or travel as a group or family.",
        ],
      },
      {
        heading: "Ride-hailing: Grab and Gojek",
        paras: [
          "The Grab and Gojek apps handle quick point-to-point rides (car or motorbike) at metered app prices. It's the simplest way to get a fair fare without haggling.",
          "In some tourist areas local transport cooperatives restrict app pickups, so you may be asked to walk to a nearby meeting point. Metered Bluebird taxis are a good fallback.",
        ],
      },
      {
        heading: "Plan by time, not distance",
        paras: [
          "Traffic is constant, especially in Canggu, Seminyak and around Ubud. A 10 km trip can take an hour at the wrong time of day.",
          "This is why choosing one or two bases matters more than any transport hack. The less you move between areas, the more of Bali you actually see.",
        ],
      },
    ],
    faq: [
      { q: "Do I need a licence to rent a scooter in Bali?", a: "Yes. You need an International Driving Permit with a motorcycle category, plus your home licence. Police do check, and travel insurance won't cover an accident without it." },
      { q: "Is Grab available in Bali?", a: "Yes, Grab and Gojek both work for cars and motorbikes. In some tourist zones app pickups are restricted, so you may need to walk to a nearby meeting point." },
      { q: "How much is a private driver in Bali?", a: "Drivers are usually hired by the day or per trip and are a good-value option for day trips, transfers and groups. Agree the route and price before you set off." },
      { q: "Is it easy to get around Bali without a scooter?", a: "Yes. Ride-hailing apps and private drivers cover most needs. Just plan by travel time, because traffic makes even short distances slow." },
    ],
    related: PILLAR_LINKS,
  },

  {
    slug: "best-area-to-stay-in-bali-for-couples",
    eyebrow: "Bali for couples",
    title: "The best area to stay in Bali for couples",
    description:
      "For couples: Uluwatu for clifftop sunsets and romance, Ubud for jungle calm, Seminyak for polished dining. How to choose between them.",
    lede: "For a couples' trip, three Bali areas do romance best. Uluwatu for clifftop sunsets and drama; Ubud for jungle calm and spa mornings; Seminyak for polished dinners and easy beach-club evenings. It depends on what you want: views, greenery or effortless comfort. Many couples pair two.",
    sections: [
      {
        heading: "Uluwatu — sunsets and drama",
        paras: [
          "The southern Bukit means limestone cliffs, turquoise coves and clifftop bars where the sunset is the whole evening. It's spread out and you'll drive between spots, which trades convenience for views and quiet.",
          "Best for couples who want big scenery, long sunset dinners and a sense of escape.",
        ],
      },
      {
        heading: "Ubud — jungle calm and slow mornings",
        paras: [
          "Inland in the hills, Ubud is green, cool and unhurried: rice-terrace walks, couples' spa treatments, yoga and long slow dinners. There's no beach, so it suits couples who want nature and stillness over sand.",
          "Pair it with a coastal area for the best of both: a few nights inland, a few by the sea.",
        ],
      },
      {
        heading: "Seminyak — polished and easy",
        paras: [
          "If you'd rather everything be close and effortless, base yourself in Seminyak. A spa in the afternoon, a west-facing sunset and a considered dinner are all walkable. It's the low-effort romantic base.",
        ],
      },
    ],
    faq: [
      { q: "Where is the most romantic place to stay in Bali?", a: "Uluwatu for clifftop sunsets and drama, or Ubud for jungle calm and spa mornings. Seminyak is the easy, polished option if you want everything close." },
      { q: "Is Ubud or the beach better for couples?", a: "Both. Many couples split the trip: a few nights inland in Ubud for calm and nature. Then they spend a few by the sea in Uluwatu or Seminyak for sunsets and dining." },
      { q: "Where's the best sunset for a couple?", a: "The west and south coasts: Uluwatu, Seminyak and Canggu all face the sunset. Uluwatu's clifftop bars are the most dramatic." },
    ],
    related: [
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, reef-break surf, dinners with a view." },
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
    lede: "For a family trip, the calmest, easiest Bali bases are Sanur and Nusa Dua. Both have gentle, swimmable water, flat walkable fronts and short, simple days. Ubud adds nature and space for older kids. The livelier surf towns work too. Expect more traffic and stronger currents to manage.",
    sections: [
      {
        heading: "Sanur — calm, walkable, low-key",
        paras: [
          "A quiet east-coast town with a long, flat paved beach path that's great for strollers and bikes. The water is calm and swimmable, and fast boats to the Nusa islands are easy to catch. It faces east, so mornings are bright and gentle.",
          "Best for families who want an unflashy, walkable base with short travel times.",
        ],
      },
      {
        heading: "Nusa Dua — resort-easy and safe",
        paras: [
          "A gated enclave of big resorts with calm, reef-protected beaches and lots of on-site facilities. It's the most hands-off, resort-holiday option: safe and easy, if less local in feel.",
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
      { q: "Where should families with young kids stay in Bali?", a: "Sanur or Nusa Dua. Both have calm, swimmable water, flat walkable fronts and easy short days. Sanur feels more like a town; Nusa Dua is resort-style." },
      { q: "Is Bali good for a family holiday?", a: "Yes, with the right base. Choose a calm-water area like Sanur or Nusa Dua, keep travel times short, and build in rest through the midday heat." },
      { q: "Is Ubud good for families?", a: "For families with older kids, yes: nature, space and cooler air. There's no beach, so pair it with a calm coastal area like Sanur." },
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
      "Canggu for cafés, nightlife and a walkable-ish hub; Uluwatu for clifftop sunsets, cleaner beaches and reef-break surf. How to pick between them.",
    lede: "Choose Canggu for energy: cafés, co-working, beach clubs and a big dinner-and-nightlife scene in one busy hub. Choose Uluwatu for scenery: clifftop sunsets, turquoise coves and reef-break surf, spread out across the southern Bukit. Canggu is more convenient; Uluwatu is more beautiful and more of an escape.",
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
          "Easily. They're both in the south. A few nights of Canggu energy followed by a few of Uluwatu scenery is a popular first-trip combination, with roughly an hour's drive between them.",
        ],
      },
    ],
    faq: [
      { q: "Is Canggu or Uluwatu better for a first trip?", a: "Canggu if you want cafés, nightlife and everything close; Uluwatu if you want clifftop sunsets, cleaner beaches and surf. Many first-timers do a few nights of each." },
      { q: "Which has better beaches, Canggu or Uluwatu?", a: "Uluwatu, with white-sand coves and turquoise water below the cliffs. Canggu's beaches are grey-sand and more about surf and beach clubs than swimming." },
      { q: "Which is better for surfing?", a: "Both work, but Uluwatu's reef breaks suit experienced surfers; Canggu has more beginner-friendly beach breaks and surf schools." },
    ],
    related: [
      { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, reef-break surf, dinners with a view." },
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
    ],
  },

  {
    slug: "seminyak-vs-canggu",
    eyebrow: "Seminyak vs Canggu",
    title: "Seminyak vs Canggu: which should you choose?",
    description:
      "Seminyak for polished dining, walkable streets and comfort; Canggu for surf, cafés and a younger, laid-back crowd. How to pick between the two.",
    lede: "Choose Seminyak for the polished, comfortable side of Bali: good restaurants, sunset beach clubs, spas and walkable streets. Choose Canggu for the younger, more laid-back version, with surf, laptop cafés and a scruffier, more energetic vibe. They're neighbours, about 20–40 minutes apart, and share a coastline.",
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
      { q: "Is Canggu cheaper than Seminyak?", a: "Generally Canggu has more budget-friendly warungs and stays, while Seminyak leans more upscale. Both have options across the range." },
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
      "Ubud for jungle, culture and calm; Canggu for surf, cafés and beach-town buzz. The two most popular first-timer bases, compared, and how to do both.",
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
          "The most popular first-timer route is a few nights inland in Ubud for culture and calm. Then a few in Canggu for surf and the coast. One transfer, roughly 1.5–2 hours, and you get both sides of Bali.",
        ],
      },
    ],
    faq: [
      { q: "Is Ubud or Canggu better for a first trip?", a: "Ubud for culture, nature and calm; Canggu for surf, cafés and a beach-town scene. They're opposites, so many first-timers spend a few nights in each rather than choosing." },
      { q: "Which is better for digital nomads?", a: "Canggu. It's Bali's hub for co-working and laptop cafés. Ubud is the calmer, wellness-leaning alternative." },
      { q: "Does Ubud have a beach?", a: "No. Ubud is inland in the hills, about an hour from the coast. If beach time matters, pair it with Canggu or another coastal area." },
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
      "Bali can be affordable: eat at warungs, rent a scooter, stay in guesthouses, and skip the beach-club minimums. How to travel Bali cheaply.",
    lede: "Bali is one of the better-value destinations in the world if you lean local. Eat at warungs and stay in guesthouses or homestays. Get around by scooter or ride-hailing app. Treat beach clubs and fine dining as occasional splurges rather than daily habits. The gap between a shoestring day and a luxury day here is enormous, and you choose where you sit on it.",
    sections: [
      {
        heading: "Eat where locals eat",
        paras: [
          "Warungs, small family-run local eateries, serve Indonesian food for a fraction of the price of Western cafés. A plate of nasi campur costs a little; the same money at a beach club buys a single coffee.",
          "You don't have to give up nice meals. Just make the Western brunch spots and beach clubs the exception, not the rule.",
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
          "Longer stays get big discounts. If you're around for weeks, negotiate a monthly rate.",
        ],
      },
      {
        heading: "Where budget stretches furthest",
        paras: [
          "Ubud and Canggu have the deepest cheap-eats and guesthouse scenes. Uluwatu and Nusa Dua skew pricier and more resort-driven. Sanur sits in the middle: calm and good value.",
        ],
      },
    ],
    faq: [
      { q: "Is Bali cheap to travel?", a: "It can be affordable if you eat at warungs, use a scooter or ride-hailing apps, and stay in guesthouses. It can also be expensive: beach clubs and fine dining add up fast. You control the range." },
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
      "Canggu is Bali's digital-nomad capital, with co-working, café work and a big community. Ubud and Uluwatu are the calmer alternatives. Where to base yourself.",
    lede: "Canggu is Bali's digital-nomad capital: dense co-working spaces, laptop-friendly cafés, fast-ish internet and a big, easy-to-plug-into community. Ubud is the calmer, wellness-leaning alternative, and Uluwatu suits surfers who work around the swell. Your base depends on what you want: community and convenience, calm and nature, or waves at the door.",
    sections: [
      {
        heading: "Canggu — the nomad hub",
        paras: [
          "This is where most remote workers land. There are co-working spaces, cafés built for laptops (power, wifi, all-day seating) and the easiest community to join, from surf sessions to networking. Everything you need is close, if busy.",
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
          "The Bukit suits remote workers whose day bends around the surf: work in the mornings or between sessions, with clifftop cafés and reef breaks. It's quieter and more spread out, so you'll rely on a scooter.",
        ],
      },
      {
        heading: "Practical basics",
        paras: [
          "Internet is generally good in cafés and co-working spaces in the main areas. Back it up with a local SIM and a mobile hotspot for call-heavy days. Get a scooter (with the required International Driving Permit) for freedom, and consider a monthly rental for a big discount.",
          "Check current visa options before you plan a long stay. Rules change, so confirm what fits your length and situation with an official source.",
        ],
      },
    ],
    faq: [
      { q: "Where do digital nomads stay in Bali?", a: "Mostly Canggu, the hub for co-working, café work and community. Ubud is the calmer, wellness-focused alternative. Uluwatu suits surfers who work around the waves." },
      { q: "Is the wifi good in Bali?", a: "Generally good in cafés and co-working spaces in the main areas. For call-heavy work, back it up with a local SIM and a mobile hotspot." },
      { q: "Is Canggu good for remote work?", a: "Yes. It's Bali's densest cluster of co-working spaces and laptop-friendly cafés, with the easiest community to join. The trade-off is crowds and traffic." },
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
      "Bali rain usually comes in waves. Make it a soft day: spa, a long lunch, a café, yoga or a cooking class. Save waterfalls and beach clubs for clear skies.",
    lede: "Don't write the day off. Rain in Bali usually arrives in short, heavy waves rather than all-day grey. Make it a soft day close to where you're staying. Book a spa or a yoga class, or take a cooking class. Have a long lunch or settle into a café, then finish with an easy dinner. Save the waterfalls, cliff walks and sunset-only plans for a clearer sky.",
    sections: [
      {
        heading: "First, don't panic — rain comes in waves",
        paras: [
          "Especially in the wet season (roughly November to March), Bali rain tends to fall as intense afternoon downpours that pass, not all-day grey. Keep the plan loose and you can often slot the outdoor bits into the dry windows.",
          "Don't force a waterfall marathon or a sunset beach club through the rain. Move those, and the day is still good.",
        ],
      },
      {
        heading: "Turn it into a soft day",
        paras: [
          "This is the day for the things you'd otherwise skip. Book a spa treatment, take an unhurried long lunch, or find a café you can sit in for hours. Boutique shopping, a yoga or sound-healing session and a cooking class all work too.",
          "Pick things close to your base. In rain, location beats hype: a comfortable place five minutes away is worth more than a famous one across town in traffic.",
        ],
      },
      {
        heading: "By area: where to go indoors",
        paras: [
          "Canggu: a spa or recovery session, a long café brunch, a gym, boutique shopping, and an easy dinner. It has the deepest café-and-wellness scene for a low-effort day.",
          "Ubud: a spa, sound healing, a cooking class, or a jewellery or craft workshop. Or an art gallery, or a calm hotel day with a tea or coffee tasting. Ubud does the slow, restorative rainy day best.",
          "Seminyak & Sanur: covered restaurants, spas and shopping, with short, walkable hops between them so you're not soaked getting around.",
        ],
      },
      {
        heading: "What to move to a clearer day",
        paras: [
          "Waterfalls, where paths are slippery and the flow can turn dangerous in heavy rain. Cliff and beach staircases, outdoor temples with lots of steps and long scooter rides. And anything that only works at sunset.",
          "Beach clubs are a maybe. If you want the pool, drinks and music, they still deliver. If the point was the sunset and the sand, wait for a brighter day.",
        ],
      },
      {
        heading: "A rainy day with kids",
        paras: [
          "Keep it short and indoors. An early lunch, a covered pool if it's safe and a kids-friendly café. Then a craft or cooking activity, nap time and an early dinner. Don't try to fill the whole day.",
          "A mall or cinema near your base is a perfectly good rainy-afternoon answer when small children have run out of patience.",
        ],
      },
    ],
    faq: [
      { q: "What do you do in Bali if it rains all day?", a: "Make it a soft day close to your base. A spa, a long lunch, a café, yoga, shopping or a cooking class, then an easy dinner. All-day rain is uncommon. It usually comes in heavy waves you can plan around." },
      { q: "Is the rainy season still worth visiting Bali?", a: "Yes. Rain mostly falls as short, heavy afternoon downpours, the island is at its greenest, and it's quieter and cheaper. Just keep beach and waterfall plans flexible rather than fixed." },
      { q: "Should we cancel waterfalls if it rains?", a: "In heavy rain, postpone them. Paths get slippery and water flow can change fast. Go after stable weather, with good shoes and ideally a driver." },
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
      "One calm day in Ubud: Monkey Forest or the rice terraces early, lunch in the centre, one wellness or cultural stop, an early dinner. Not a marathon.",
    lede: "With one day in Ubud, go early, then keep the rest of the day soft. Do one main thing in the morning: Monkey Forest or the rice terraces. Then have lunch in the centre and add one calm wellness or cultural stop before an early dinner. The mistake first-timers make is cramming Monkey Forest, Tegallalang, a waterfall, a temple and shopping into a single day and leaving exhausted.",
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
          "Monkey Forest is worth it if you go early and keep your belongings secure, and if you don't mind animals close to you. The macaques will grab sunglasses, water bottles and loose bags. It's popular and busy, and that's the trade-off.",
          "If you'd rather have greenery and calm, make the rice terraces your morning instead. You don't need to do both in one day.",
        ],
      },
      {
        heading: "Which rice fields: Tegallalang or Jatiluwih?",
        paras: [
          "Tegallalang is close to Ubud, easy and photogenic, but more touristy. It's the natural add-on for a single Ubud day.",
          "Jatiluwih is bigger, calmer and more scenic, but much farther. It's better suited to a dedicated day with a driver than a quick morning stop. On a one-day visit, Tegallalang is the easier call.",
        ],
      },
      {
        heading: "Don't overpack it",
        paras: [
          "Skip the far-flung waterfall marathon unless you have a driver and real energy to spare. After sightseeing, choose your lunch and dinner by shade and comfort, not by chasing the most famous name across town.",
          "Ubud is one of the best places in Bali for a calm day, so let it be one.",
        ],
      },
    ],
    faq: [
      { q: "What should we do with only one day in Ubud?", a: "Start early with one main sight: Monkey Forest or the rice terraces. Then lunch in the centre, one calm wellness or cultural stop, and an early dinner. Don't try to see everything in a day." },
      { q: "Is Monkey Forest worth it or too touristy?", a: "Worth it if you go early, keep belongings secure and don't mind crowds and animals close to you. It's popular, so the experience depends heavily on timing." },
      { q: "What should we do after Monkey Forest?", a: "Stay nearby: lunch in Ubud Centre, a short walk, a market or art stop, or a spa. If you still have energy, add the rice terraces, not a far waterfall marathon." },
      { q: "Tegallalang or Jatiluwih rice fields?", a: "Tegallalang for a short, easy Ubud add-on (more touristy). Jatiluwih for a bigger, calmer landscape, but it's far and better as its own day. For one Ubud day, choose Tegallalang." },
      { q: "Is Ubud good for a calm day?", a: "Yes. It's one of the best areas in Bali for an unhurried day: rice fields, a spa, yoga, a slow lunch, art and an early dinner." },
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
      "Keep your first day in Canggu easy: a brunch, a beach walk, a massage, a sunset drink and a simple dinner near your villa. Don't fight traffic on day one.",
    lede: "Keep your first day in Canggu easy. Have brunch or lunch near your villa after the flight, then a beach walk, a massage, a sunset drink and a simple dinner close by. Skip the far-flung tour and the race to see the whole island. Bali feels much better when day one is about settling in rather than fighting traffic.",
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
          "You don't need to move between them on day one. Settle into your own pocket first and explore the others once you've found your feet.",
        ],
      },
      {
        heading: "Sunset and dinner in one area",
        paras: [
          "Pair your sunset spot and dinner so you're not driving far in the dark after. The beach, a beachfront bar, or the Echo Beach / Pererenan stretch all work for an easy first-night sunset.",
          "Canggu's beachfront fills up, so arrive at the sunset spot early. Don't plan to move far right after.",
        ],
      },
      {
        heading: "Getting around without a scooter",
        paras: [
          "Canggu works without a scooter if you stay local. Cafés, beach, gym, spa, shopping and dinner are all close. Grab or Gojek covers the short hops. Just choose a base near where you want to be.",
          "For day trips beyond Canggu, to Uluwatu or Ubud, hire a private driver. It's easier and safer than a scooter you're not confident on.",
        ],
      },
    ],
    faq: [
      { q: "What should we do in Canggu on our first day?", a: "Keep it easy: a brunch or lunch near your villa, a beach walk, a massage, a sunset drink and a simple dinner close by. Don't book a far tour or try to see all of Bali on arrival day." },
      { q: "Is Canggu too crowded now?", a: "It can be busy, especially Berawa and Batu Bolong. But it still works if you pick the right pocket, time your moves and don't expect quiet village Bali." },
      { q: "Where should we eat the night we land in Canggu?", a: "Somewhere close to your villa, comfortable and easy to book. The first night isn't the time to cross Canggu in traffic for a famous restaurant." },
      { q: "What's the difference between Berawa and Batu Bolong?", a: "Berawa leans beach clubs, gyms, restaurants and expat lifestyle. Batu Bolong is surf, beach access, cafés and more classic Canggu energy. Pererenan next door is calmer and more grown-up." },
      { q: "Can we enjoy Canggu without a scooter?", a: "Yes. Stay local and use Grab or Gojek for short hops. Cafés, beach, gym, spa and dinner are all close. For day trips beyond Canggu, a private driver is easier than a scooter." },
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
      "Shorter days make Bali work with kids: calm beaches, pools, animals, rice fields and easy cafés. Base in Sanur or Nusa Dua; eat early and rest through the heat.",
    lede: "Bali is a good family destination if you keep the days short and the base calm. Sanur and Nusa Dua are the easiest bases: the water is gentle and swimmable, and the fronts are flat and walkable. Ubud adds nature for older kids. Fill the day with one main thing: a beach morning, a pool, animals, rice fields or a workshop. Then an early lunch, a rest through the heat and an early dinner. Don't run an adult itinerary with children.",
    sections: [
      {
        heading: "Base somewhere calm",
        paras: [
          "Sanur and Nusa Dua are the easiest with young kids: calm, swimmable water, flat walkable fronts and short travel times. Seminyak can work; Canggu works with the right villa and a driver, but the traffic and sidewalks are less forgiving.",
          "Ubud suits families with older kids who'll enjoy nature, rice fields and cooler air. Pair it with a few calm-beach nights in Sanur.",
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
          "Breakfast, one main activity, an early lunch, then pool or rest. That's enough for a good day, and the rest is bonus.",
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
          "Temples are fine with kids if you pick one and go early or late afternoon. Keep it short, bring water and dress properly. Don't chain several together in the heat.",
        ],
      },
    ],
    faq: [
      { q: "Which area of Bali is easiest with children?", a: "Sanur and Nusa Dua: calm, swimmable water, flat walkable fronts and short days. Seminyak can work; Canggu works with the right villa and a driver; Ubud is good for older kids who like nature." },
      { q: "What can we do in Bali with kids?", a: "Short beach mornings, pools, animal parks, rice fields, easy cafés, kids' clubs and simple workshops. Keep it to one main activity a day and build in rest through the heat." },
      { q: "Which beaches are calm and safe for kids?", a: "Sanur and Nusa Dua's protected bay are the easiest for calm family swimming. The west and south-coast surf beaches have stronger currents, so watch tide, waves and flags closely." },
      { q: "Is Ubud good with kids?", a: "Yes, for families with older kids: animals, rice fields, pools and short walks. Avoid stacking stairs, heat and long drives into one day." },
      { q: "What should we avoid with toddlers?", a: "Long traffic days, steep beach stairs, waterfall treks, late dinners and overpacked temple days. Keep days short, close to base and built around nap time." },
      { q: "Can we visit temples with kids?", a: "Yes. Pick one and go early or late afternoon. Keep it short, bring water and dress properly (covered shoulders and knees). Don't combine several temples in the midday heat." },
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
    lede: "Both are the calm, easy side of Bali, the opposite of Canggu's buzz, so it comes down to feel. Choose Sanur for a real, walkable town with local texture, a long flat beach path and the fast boats to the Nusa islands. Choose Nusa Dua for a gated, hands-off resort enclave with reef-protected beaches and everything on site. Sanur has more soul; Nusa Dua has more polish.",
    sections: [
      {
        heading: "Choose Sanur if…",
        paras: [
          "You want a low-key coastal town, not a resort bubble. Sanur has a roughly 5 km flat, paved beachfront path made for walking, cycling and strollers. The water on the sunrise coast is calm and swimmable. Local warungs and cafés have a neighbourhood feel.",
          "It's also the main fast-boat gateway to Nusa Penida and Lembongan, so it doubles as a springboard for island day-trips. Best for travellers who want calm plus a bit of real Bali texture.",
        ],
      },
      {
        heading: "Choose Nusa Dua if…",
        paras: [
          "You want resort-easy and secure. Nusa Dua is a gated enclave of big five-star resorts, manicured reef-protected beaches, resort fine dining and large spas. A walkable seafront promenade ties it together.",
          "It's the most hands-off, low-friction base in Bali: safe, clean and effortless. The trade-off is that it feels more like a resort zone than a Balinese town.",
        ],
      },
      {
        heading: "For families",
        paras: [
          "Both are among the easiest family bases in Bali thanks to calm, swimmable water and flat, walkable fronts. Nusa Dua leans further into resort facilities and security. Sanur is gentler on the wallet and easier to step out into a real town for dinner.",
          "Either way, favour these two over the surf coasts if you're travelling with small kids. The water is calmer and the days are simpler.",
        ],
      },
      {
        heading: "Getting around and day trips",
        paras: [
          "Both are calm to move around, with short local hops by Grab, Gojek or a driver. Sanur's flat path makes it walkable end to end; Nusa Dua's promenade links the resort strip.",
          "For anything beyond your base (Uluwatu, Ubud, the Nusa islands), a driver for the day is the easy call from either. Sanur has the edge if the islands are on your list.",
        ],
      },
      {
        heading: "Can you do both?",
        paras: [
          "You rarely need to. They're close and similar in pace. Most people pick one and pair it with a livelier area (Canggu, Seminyak or Ubud) for contrast, rather than splitting between two calm bases.",
        ],
      },
    ],
    faq: [
      { q: "Is Sanur or Nusa Dua better?", a: "Both are calm and family-easy. Sanur is a walkable town with local texture and fast boats to the Nusa islands. Nusa Dua is a gated resort enclave with reef-protected beaches and everything on site. It comes down to soul or polish." },
      { q: "Which is better for families, Sanur or Nusa Dua?", a: "Both are excellent for families, with calm, swimmable water and flat, walkable fronts. Nusa Dua leans into resort facilities and security; Sanur is gentler on budget and easier to step into a real town." },
      { q: "Is Sanur boring?", a: "It's calm, not boring: a walkable beach town for people who want gentle days, sunrise, cycling and easy restaurants rather than nightlife or beach-club energy." },
      { q: "Is Nusa Dua too resort-only?", a: "It's resort-focused, and that's the point. It suits families, honeymooners and older travellers who want clean beaches, security and effortless service over local street life." },
      { q: "Which is closer to Nusa Penida?", a: "Sanur. It's the main fast-boat harbour for Nusa Penida and Lembongan, which makes it the better base if island day-trips are on your plan." },
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
      "Jimbaran's classic evening: fresh grilled seafood at tables on the sand as the sun sets over a calm, west-facing bay. When to go and what to expect.",
    lede: "A Jimbaran evening is simple: fresh grilled seafood at a table on the sand while the sun goes down over the calm, west-facing bay. Arrive before sunset for a beach table at golden hour. Confirm the price up front, since seafood is usually sold by weight. Treat the bare-bones setting as part of the charm.",
    sections: [
      {
        heading: "What the experience is",
        paras: [
          "Clusters of seafood restaurants and warungs along Jimbaran Bay set tables out on the beach. They grill the day's fish, prawns and squid over coconut husk and serve them with rice, sambal and vegetables.",
          "You come for the setting, not fine dining: your feet in the sand, the grill smoke, and the sun dropping into the bay. That combination is the whole point.",
        ],
      },
      {
        heading: "When to go",
        paras: [
          "Sunset is the moment. Aim to arrive a little before it so you get a table on the sand for golden hour. Otherwise you end up in the back once the front rows fill.",
          "It's calm and west-facing, so the light is the show. Weekends and peak season are busier; earlier is better.",
        ],
      },
      {
        heading: "The three clusters",
        paras: [
          "The seafood grills gather in a few stretches along the bay: the Muaya beach area, the Kelan end nearer the airport, and the Kedonganan side. They offer much the same experience, so pick by which is closest to where you're staying rather than agonising over the choice.",
        ],
      },
      {
        heading: "How to do it well",
        paras: [
          "Seafood is typically priced by weight, so confirm the weight and the price before it goes on the grill. That one step avoids the only common surprise. It's a relaxed, hands-on meal, not a polished restaurant.",
          "The bay is calm and swimmable earlier in the day. Jimbaran sits close to the airport, which makes this a great first-night or last-night dinner. Bring a little mosquito repellent for dusk.",
        ],
      },
      {
        heading: "Who it suits",
        paras: [
          "It's made for a sunset dinner: couples, groups and anyone who wants the toes-in-the-sand version of a Bali evening.",
          "If you're after a slick, air-conditioned fine-dining room, this isn't that: expect plastic chairs, simple settings and a bit of grill smoke. That's the trade for the setting.",
        ],
      },
    ],
    faq: [
      { q: "What is Jimbaran famous for?", a: "Grilled seafood eaten at tables set on the sand at sunset, along its calm, west-facing bay. It's one of Bali's classic evenings, and the setting is as much the draw as the food." },
      { q: "When should you go to Jimbaran for seafood?", a: "Around sunset. Arrive a little before it to get a table on the sand for golden hour, before the front rows fill. Earlier is better on weekends and in peak season." },
      { q: "How is the seafood priced in Jimbaran?", a: "Usually by weight. Confirm the weight and the price before your fish goes on the grill. That single step avoids the only common surprise." },
      { q: "Is Jimbaran good for a special dinner?", a: "Yes. It suits a sunset dinner for couples and groups. Just set expectations: it's a relaxed, feet-in-the-sand meal, not a polished dining room." },
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
      "You don't need them all. Pick a Bali temple by what you want (sunset, ceremony, scenery or the photo) and go early or late. Plus the etiquette that matters.",
    lede: "You don't need to visit every temple. Pick one or two by what you actually want. For sunset and a show, Uluwatu or Tanah Lot; for a ceremony and holy water, Tirta Empul; for scale and significance, Besakih. For the famous photo, Lempuyang; for serene highland calm, Ulun Danu Beratan. Whichever you choose, dress respectfully. Go early or late to dodge the heat and crowds.",
    sections: [
      {
        heading: "For sunset and a show: Uluwatu or Tanah Lot",
        paras: [
          "Pura Luhur Uluwatu sits on the southern cliffs and pairs a dramatic clifftop setting with the evening Kecak fire dance. It's the classic sunset-and-spectacle combination.",
          "Tanah Lot is the much-photographed temple on an offshore rock, another sunset spot. Both are popular and busy at golden hour, so arrive with time to spare and lower your expectations of solitude.",
        ],
      },
      {
        heading: "For ceremony and holy water: Tirta Empul",
        paras: [
          "Tirta Empul, near Ubud, is a working temple built around sacred spring pools where Balinese come for melukat, a purification ritual. Visitors can often take part respectfully. Go with a calm, unhurried mindset rather than treating it as a photo stop.",
        ],
      },
      {
        heading: "For scale and significance: Besakih",
        paras: [
          "Besakih, on the slopes of Mount Agung, is Bali's largest and most important temple complex, the \"mother temple\". It's a bigger trip up into the highlands, best paired with the drive out east rather than squeezed onto a busy south-Bali day.",
        ],
      },
      {
        heading: "For the photo and the highlands: Lempuyang and Ulun Danu Beratan",
        paras: [
          "Lempuyang, in the far east, is the \"Gates of Heaven\" shot. Expect a long queue for the photo and a real trip to reach it. Go for the view and the journey, not a quick tick.",
          "Ulun Danu Beratan sits on a lake in the cool Bedugul highlands, a mist-and-water counterpoint to the coastal sunset temples. It makes a calm, scenic half-day if you're heading north.",
        ],
      },
      {
        heading: "Temple etiquette (this matters)",
        paras: [
          "Cover up: a sarong plus covered shoulders and knees are expected, and sarongs are usually available to borrow or rent at the entrance. Be quiet and respectful, don't climb on sacred structures, and follow any signs about where you may and may not go.",
          "Go early morning or late afternoon to avoid the heat and the biggest crowds, and carry water. Pick temples that fit your route rather than chaining several across the island in one hot day.",
        ],
      },
    ],
    faq: [
      { q: "Which temple in Bali is worth visiting?", a: "It depends what you want. Uluwatu or Tanah Lot for sunset and a show; Tirta Empul for a purification ceremony; Besakih for scale. Lempuyang for the famous 'Gates of Heaven' photo; Ulun Danu Beratan for serene highland calm." },
      { q: "What is the best temple for sunset in Bali?", a: "Uluwatu (clifftop, plus the evening Kecak dance) and Tanah Lot (an offshore rock temple) are the classic sunset temples. Both are busy at golden hour, so arrive early." },
      { q: "What should you wear to a Bali temple?", a: "A sarong with covered shoulders and knees. Sarongs are usually available to borrow or rent at the entrance. Be quiet and respectful, and don't climb on sacred structures." },
      { q: "How many temples should I visit?", a: "One or two is plenty for most trips. Pick by what you want and by your route rather than chaining several across the island in the midday heat." },
      { q: "What is the 'Gates of Heaven' temple?", a: "That's Lempuyang, in far-east Bali, with its framed shot between two gates. It involves a real trip and often a long queue for the photo, so go for the view and the journey." },
      { q: "Can tourists enter Bali temples?", a: "Generally yes, with respectful dress (a sarong, covered shoulders and knees) and behaviour. Follow the signs and any guidance about where you may go, and note that some inner areas are for worshippers only." },
    ],
    related: [
      { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and what to do in each area." },
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Clifftop temple, the Kecak dance and ocean sunsets." },
      { href: "/where-to-watch-sunset-in-bali", title: "Where to watch the sunset in Bali", blurb: "Golden-hour spots across the island, temples included." },
      { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "Practical basics, including temple etiquette and monkeys." },
      { href: "/uluwatu-sunset-kecak", title: "Uluwatu sunset & Kecak day trip", blurb: "Picked your temple — here's whether the whole day around it fits." },
      { href: "/east-bali-temples-water-palaces", title: "East Bali temples & water palaces", blurb: "Planning a Lempuyang or Tirta Gangga day? The long-drive reality check." },
    ],
  },

  // Bali day trip ideas — a route-fit decision layer, not a tour marketplace.
  // Each page below is deliberately hedged: no prices, no exact durations, no
  // safety guarantees, no "best tour" claims and no operator endorsement
  // (guardrails #9, #10, #11) — a route stays a "route idea, not a verified
  // itinerary" until Other Bali has actually checked stops, access, costs,
  // hours and risks. Distinct from bali-temples-which-one just above: that
  // page helps pick ONE temple; these help judge whether a WHOLE day/route
  // built around one fits a traveller's base, timing and risk tolerance —
  // cross-linked both ways so the two don't compete for the same intent.
  {
    slug: "bali-day-trips",
    eyebrow: "Bali day trips",
    title: "Bali day trip ideas: choose the right route before you book",
    description:
      "Compare Bali day trip ideas by region, travel style and starting area. See what usually fits, what needs checking, and which routes may be too packed.",
    lede: "Most Bali tour pages show the same beautiful stops. What they rarely explain is whether the day works from your hotel area, with your energy level, traffic, queues, walking distance, weather and return timing. Other Bali is not a tour marketplace — we help you decide whether a route fits before you book it with a driver or operator.",
    sections: [
      {
        heading: "How to use this guide",
        paras: [
          "Start with the kind of day you want. Then check the practical risks: how far the route is from your starting area, whether the day is overloaded and what needs an early start. Note what depends on weather, sea conditions or volcanic status. Check whether the stops involve stairs, cliffs, boat transfers or dress codes, and what to verify with the operator before paying.",
          "A route idea becomes a verified Other Bali itinerary only after we check the stops, access, costs, opening hours, logistics and fallback options — until then, each guide below is a route idea under verification, not a finished plan.",
        ],
      },
      {
        heading: "Popular Bali day trip ideas",
        paras: [
          "Ubud culture, rice terraces and waterfalls: a classic central Bali day for culture, greenery and light nature. It's best for first-time visitors and photos. Watch out for traffic, waterfall stairs and stacking too many stops.",
          "Uluwatu sunset and Kecak: a South Bali route built around cliffs, sunset and a cultural performance. It's best for a sunset-focused evening. Watch out for crowds, temple rules, performance tickets and return traffic.",
          "East Bali temples and water palaces: a long-drive day for Lempuyang, Tirta Gangga and East Bali scenery. Watch out for early departure, queues and distance from South Bali.",
          "Nusa Penida day trip: a high-demand island day, usually built around the west-coast loop (Kelingking, Angel's Billabong, Broken Beach, Crystal Bay). Watch out for boat timing, road time and overpacked schedules.",
          "Mount Batur sunrise jeep and hot spring: an early-morning volcano-area experience, often paired with a hot spring. Watch out for wake-up time, weather, terrain and volcanic status.",
        ],
      },
      {
        heading: "The Other Bali rule",
        paras: [
          "We do not recommend a route just because it is popular on tour marketplaces. We check whether it actually works from your starting area, with realistic timing, access, safety notes and backup options.",
        ],
      },
    ],
    faq: [
      { q: "Are these bookable tours?", a: "No. These are route ideas and planning guides. Other Bali helps you decide what fits before you book with a driver or operator." },
      { q: "Why are some details missing?", a: "Because prices, opening hours, schedules and safety rules change. We only publish those details once they're verified from reliable sources." },
      { q: "Can a popular route still be a bad choice?", a: "Yes. A route can be popular and still be wrong for your base, group, walking ability, weather window or available time." },
      { q: "What does \"under verification\" mean?", a: "It means the route pattern is common, but it hasn't yet passed Other Bali's full checks for stops, access, costs, timing, safety and fallback options." },
    ],
    related: [
      { href: "/ubud-culture-rice-terraces-waterfalls", title: "Ubud culture, rice terraces & waterfalls", blurb: "A classic central Bali day — who it suits and what to check first." },
      { href: "/uluwatu-sunset-kecak", title: "Uluwatu sunset & Kecak", blurb: "Cliffs, sunset and a performance — the timing that makes or breaks it." },
      { href: "/east-bali-temples-water-palaces", title: "East Bali temples & water palaces", blurb: "Lempuyang and Tirta Gangga, and the long-drive reality check." },
      { href: "/nusa-penida-day-trip", title: "Nusa Penida day trip", blurb: "The fast boat, the west-coast loop, and whether to stay overnight." },
      { href: "/mount-batur-sunrise-jeep-hot-spring", title: "Mount Batur sunrise jeep & hot spring", blurb: "Who an early volcano morning actually fits." },
      { href: "/bali-temples-which-one", title: "Which Bali temple should you visit?", blurb: "Pick a single temple by what you want, rather than a whole day." },
    ],
  },

  {
    slug: "ubud-culture-rice-terraces-waterfalls",
    eyebrow: "Ubud day trip idea",
    title: "Ubud day trip idea: culture, rice terraces and waterfalls",
    description:
      "A practical Ubud day trip guide for culture, rice terraces and waterfalls, with route-fit notes, access questions and what to verify before booking.",
    lede: "This is one of the most common Bali day trip patterns: a central Bali route combining culture, greenery and a light nature stop. Many versions include Ubud-area cultural stops, a rice terrace, a waterfall and sometimes a Kintamani volcano viewpoint. This page is not a finished itinerary yet — use it to understand whether this kind of day fits your trip before you book a driver or tour.",
    sections: [
      {
        heading: "What this route usually includes",
        paras: [
          "Common stop types are an Ubud cultural or village stop, the Monkey Forest or a temple stop, a rice terrace and a waterfall. Some versions add Tirta Empul or a Kintamani viewpoint. The exact route should depend on your starting area, walking ability, interest in temples, and how much time you want at each stop.",
        ],
      },
      {
        heading: "Who this day can fit",
        paras: [
          "It can work well for a first-time Bali overview or a mix of culture and nature. It also works for photogenic landscapes without a full hiking day, or a day that starts or ends around Ubud. And it fits flexible private-driver routing rather than a fixed group schedule.",
        ],
      },
      {
        heading: "What to watch out for",
        paras: [
          "The main risk is trying to fit too much into one day. A route that looks easy on a map can become tiring once you add traffic, parking, walking, queues, meals and photo stops. Before booking, check which waterfall is included and how many stairs or slippery sections are involved. Ask whether temple dress is required, and whether the rice terrace is a quick viewpoint or a longer walk. Check whether Kintamani is included and what gets removed to make space for it. And confirm exactly where pickup and drop-off happen.",
        ],
      },
      {
        heading: "Best starting areas",
        paras: [
          "Likely easier from Ubud, Sanur, or parts of Canggu, Seminyak and Kuta with enough buffer. Needs more caution from Uluwatu, Nusa Dua/Jimbaran, Lovina or Amed. These are planning notes, not calculated drive times — final route timing should be checked separately.",
        ],
      },
      {
        heading: "How Other Bali would make this route better",
        paras: [
          "A good version of this day should have a clear priority: culture, nature, photos or easy family pacing. It shouldn't simply stack every famous Ubud-area stop into one long day. A resident-curated version would choose fewer stops and give more time to the ones that actually match the traveller.",
        ],
      },
      {
        heading: "Before you book, ask the operator",
        paras: [
          "What are the exact stops, in order? What time is pickup from my area? Which costs are excluded: entrance, parking, guide, lunch, sarong or donations? How much walking is involved at each stop? Are there toilets and food stops? What happens if it rains?",
        ],
      },
    ],
    faq: [
      { q: "Is this the best Ubud day trip?", a: "Not automatically. It's a common route pattern, but the best version depends on your starting area, interests, mobility and available time." },
      { q: "Should I add Kintamani to an Ubud day?", a: "Only if you're comfortable with a longer day and fewer slow stops. Adding Kintamani changes the whole rhythm of the route." },
      { q: "Is this route suitable for children?", a: "Maybe, but it depends on the waterfall, walking distance, heat and pacing. Check these specifics before booking." },
    ],
    related: [
      { href: "/bali-day-trips", title: "Bali day trip ideas", blurb: "Compare routes by region, mood and starting point." },
      { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
      { href: "/bali-temples-which-one", title: "Which Bali temple should you visit?", blurb: "Pick a temple by what you want, not the whole island's list." },
      { href: "/how-many-days-in-bali", title: "How many days in Bali", blurb: "Where a day trip like this fits into a longer plan." },
    ],
  },

  {
    slug: "uluwatu-sunset-kecak",
    eyebrow: "Uluwatu day trip idea",
    title: "Uluwatu sunset and Kecak: is this Bali day trip right for you?",
    description:
      "Plan an Uluwatu sunset and Kecak route with realistic checks for timing, crowds, temple rules, cliff access and starting area.",
    lede: "An Uluwatu sunset route is one of the clearest South Bali day trip ideas: cliffs, ocean views, temple atmosphere and a Kecak performance. It can be a strong afternoon-to-evening plan, but it needs careful timing. This page is a route-fit guide, not a verified itinerary or ticketing page.",
    sections: [
      {
        heading: "What this route usually includes",
        paras: [
          "Common stop types are Garuda Wisnu Kencana or another South Bali cultural stop, Uluwatu Temple, sunset viewpoint time and a Kecak or fire dance performance. Some versions add beaches or cliff stops.",
        ],
      },
      {
        heading: "Who this day can fit",
        paras: [
          "It can work well for a sunset-focused plan and South Bali scenery, or for a cultural performance. It doesn't require starting before dawn. And it's a strong option from Uluwatu, Jimbaran or Nusa Dua.",
        ],
      },
      {
        heading: "What to watch out for",
        paras: [
          "The risk is timing, not just distance. Sunset, temple access, performance tickets, crowds, traffic and return travel all sit in the same narrow window. Before booking, check whether the Kecak ticket is included or separate, and what time the performance starts on your date. Ask how early you need to arrive and what dress code or temple rules apply. Check whether the route includes risky cliff or beach access, and what the return plan is after the performance.",
        ],
      },
      {
        heading: "Best starting areas",
        paras: [
          "Likely easier from Uluwatu, Jimbaran, Nusa Dua, or Kuta/Seminyak with enough buffer. Needs more caution from Ubud, Canggu during heavy traffic periods, or Sanur if combined with many daytime stops.",
        ],
      },
      {
        heading: "How Other Bali would make this route better",
        paras: [
          "The strongest version isn't the one with the most stops. It protects the sunset and performance window and avoids a rushed cliff-to-temple-to-ticket sequence. A better route may remove a daytime stop so the evening feels calm instead of chaotic.",
        ],
      },
      {
        heading: "Before you book, ask the operator",
        paras: [
          "What time do we need to leave my hotel? Is the performance ticket included? Is temple entry separate? What should I wear? Are there stairs, uneven paths or monkey-risk areas? What happens if it rains or tickets sell out?",
        ],
      },
    ],
    faq: [
      { q: "Is Uluwatu better at sunset?", a: "Many visitors choose Uluwatu for sunset, but that also makes timing and crowd management more important." },
      { q: "Can I combine Uluwatu with a full South Bali beach day?", a: "Sometimes, but the route should protect enough time for temple entry, sunset and the performance." },
      { q: "Is the Kecak performance included in all Uluwatu tours?", a: "No. Verify whether the ticket is included, separate, or subject to availability." },
    ],
    related: [
      { href: "/bali-day-trips", title: "Bali day trip ideas", blurb: "Compare routes by region, mood and starting point." },
      { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Clifftop temple, the Kecak dance and ocean sunsets." },
      { href: "/bali-temples-which-one", title: "Which Bali temple should you visit?", blurb: "Uluwatu vs Tanah Lot vs Tirta Empul vs Lempuyang — pick by what you want." },
      { href: "/where-to-watch-sunset-in-bali", title: "Where to watch the sunset in Bali", blurb: "Golden-hour spots across the island, temples included." },
    ],
  },

  {
    slug: "east-bali-temples-water-palaces",
    eyebrow: "East Bali day trip idea",
    title: "East Bali day trip idea: temples, water palaces and the long-drive reality check",
    description:
      "A practical East Bali route-fit guide covering common temple and water-palace combinations, queue risks and what to verify before booking.",
    lede: "East Bali is often sold as a photo-friendly temple and water-palace day. The common pattern includes Lempuyang and Tirta Gangga, sometimes with additional temples, waterfalls or scenic stops. The appeal is obvious. But the practical question is whether the route makes sense from your starting area and on your travel date.",
    sections: [
      {
        heading: "What this route usually includes",
        paras: [
          "Common stop types are Lempuyang Temple or the \"Gate of Heaven\" viewpoint, Tirta Gangga Water Palace, and another East Bali temple or water palace. Some versions add a waterfall or scenic stop. Expect long road transfers from South or Central Bali.",
        ],
      },
      {
        heading: "Who this day can fit",
        paras: [
          "It can work for temple scenery, East Bali landscapes or a photography-heavy day. It works as a private-driver route with an early start. And it fits a trip that prioritises one region rather than mixing too many parts of Bali.",
        ],
      },
      {
        heading: "What to watch out for",
        paras: [
          "The main risks are distance, queues and unrealistic stop stacking. If the route starts far away and includes too many famous places, the day can become mostly car time. Before booking, check what time pickup is and how long is expected at Lempuyang. Ask whether photo queues are built into the plan and what temple dress code applies. Check which fees are included and which are separate, and whether any stops were added only because they're popular online.",
        ],
      },
      {
        heading: "Best starting areas",
        paras: [
          "Likely easier from Amed, Candidasa, Sidemen, or Ubud with an early start. Needs more caution from Canggu, Seminyak/Kuta, Uluwatu, or Nusa Dua/Jimbaran.",
        ],
      },
      {
        heading: "How Other Bali would make this route better",
        paras: [
          "A better East Bali route should choose a clear focus: temple etiquette, water-palace beauty, mountain scenery or photography. It shouldn't pretend every famous East Bali stop can fit comfortably into one relaxed day from any hotel area.",
        ],
      },
      {
        heading: "Before you book, ask the operator",
        paras: [
          "What is the realistic pickup time from my area? How many total hours are expected in the car? Are entrance fees, parking and local guide fees separate? What is the dress code? What happens if a queue is too long? Is there a shorter version of the route?",
        ],
      },
    ],
    faq: [
      { q: "Is East Bali possible as a day trip?", a: "Yes, but it's often a long day, especially from South Bali. Plan the route around realistic travel time." },
      { q: "Is Lempuyang only about the photo?", a: "No. It's a working temple site, so dress code, etiquette and visitor rules matter. Photo expectations shouldn't override respectful behaviour." },
      { q: "Should I combine East Bali with Ubud in one day?", a: "Usually only with a selective route. Combining too many regions can make the day inefficient." },
    ],
    related: [
      { href: "/bali-day-trips", title: "Bali day trip ideas", blurb: "Compare routes by region, mood and starting point." },
      { href: "/bali-temples-which-one", title: "Which Bali temple should you visit?", blurb: "Besakih, Lempuyang and the etiquette that matters." },
      { href: "/sidemen", title: "The Sidemen guide", blurb: "Quiet valley base closer to the East Bali temple route." },
      { href: "/how-many-days-in-bali", title: "How many days in Bali", blurb: "Where a long East Bali day fits into a longer trip." },
    ],
  },

  {
    slug: "mount-batur-sunrise-jeep-hot-spring",
    eyebrow: "Mount Batur day trip idea",
    title: "Mount Batur sunrise jeep and hot spring: who this Bali trip fits",
    description:
      "A route-fit guide for Mount Batur sunrise jeep and hot spring trips, with practical checks for wake-up time, terrain, weather and volcanic status.",
    lede: "Mount Batur sunrise experiences are popular because they promise volcanic scenery without spending a normal sightseeing day in the car. Jeep versions are often positioned as an alternative to hiking, sometimes combined with black lava areas and a hot spring. This page is a route-fit guide, not a verified operator recommendation.",
    sections: [
      {
        heading: "What this route usually includes",
        paras: [
          "Common elements are an early pickup, sunrise viewpoint time around the Mount Batur/Kintamani area and a jeep route over volcanic terrain or black lava areas. Some versions add a hot spring stop; some add a breakfast or coffee stop. Exact access, terrain, restrictions and safety status must be verified before booking.",
        ],
      },
      {
        heading: "Who this day can fit",
        paras: [
          "It can work for sunrise scenery or a highland or volcano landscape. It also fits an adventure-feeling route without committing to a full hike, or a trip that finishes earlier than many full-day sightseeing routes.",
        ],
      },
      {
        heading: "What to watch out for",
        paras: [
          "The main risks are wake-up time, weather, operator quality, terrain, comfort and volcanic status. A jeep route isn't automatically easy for every traveller. Before booking, check the pickup time from your area, what vehicle is used and what terrain is covered. Ask whether age, pregnancy, back/neck or mobility restrictions apply, and what happens in bad weather. Find out whether volcanic status is checked against official sources, and whether the hot spring is included or optional.",
        ],
      },
      {
        heading: "Best starting areas",
        paras: [
          "Likely easier from Ubud, Kintamani, Amed or Sidemen depending on the route, or Sanur with an early pickup. Needs more caution from Uluwatu, Nusa Dua/Jimbaran, or Canggu/Seminyak if you dislike early transfers.",
        ],
      },
      {
        heading: "How Other Bali would make this route better",
        paras: [
          "Sunrise on Mount Batur does not suit everyone. It means an early pickup, a cold morning, uncertain weather, the terrain and the safety checks. For some travellers a daytime Kintamani route may be a better fit.",
        ],
      },
      {
        heading: "Before you book, ask the operator",
        paras: [
          "Is this a jeep route, a hike, or a mixed route? What time is pickup and return? What's included: hot spring, breakfast, entrance, parking, guide, equipment? What safety rules apply? What official source is used for volcanic status? What's the fallback if visibility is poor?",
        ],
      },
    ],
    faq: [
      { q: "Is Mount Batur sunrise jeep easier than hiking?", a: "It may involve less walking, but it's still an early-morning adventure route with terrain, weather and comfort considerations." },
      { q: "Is sunrise guaranteed?", a: "No. Visibility depends on weather, so treat any operator guarantee with caution." },
      { q: "Is Mount Batur safe to visit?", a: "Indonesia's volcanic activity is monitored by PVMBG, the national volcanology agency. Check the current alert level before a Kintamani-area trip, and follow your driver or operator's guidance on the day. Access can change quickly if conditions shift." },
    ],
    related: [
      { href: "/bali-day-trips", title: "Bali day trip ideas", blurb: "Compare routes by region, mood and starting point." },
      { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons, Mount Batur included." },
      { href: "/best-time-to-visit-bali", title: "Best time to visit Bali", blurb: "Weather patterns that affect a sunrise trip." },
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
    heading: "Bali day trip ideas",
    blurb: "Route ideas by region — a decision layer before you book a driver or tour, not a marketplace.",
    slugs: ["bali-day-trips", "ubud-culture-rice-terraces-waterfalls", "uluwatu-sunset-kecak", "east-bali-temples-water-palaces", "nusa-penida-day-trip", "mount-batur-sunrise-jeep-hot-spring"],
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
