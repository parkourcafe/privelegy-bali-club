// Scenario landing surfaces (master §6a.3) — the `ContentPage` type `scenario`,
// implemented as STATIC config + routes (no DB entity, guardrail #11). Each page
// answers one trip situation and funnels into a filtered /places brief tied to
// the matching Trip Mission (lib/trip-missions.ts), so the page hands off to the
// same Top-3 shortlist the day builder produces.
//
// Editorial only (guardrail #6), fit/logistics language only — never a quality
// warning or "avoid this place" (guardrail #7). No venue is named here: the page
// frames the situation and the live picks live on /places, so copy never goes
// stale against the data.

import type { Metadata } from "next";
import { getTripMission } from "./trip-missions";

export type ScenarioSection = { heading: string; body: string };

export type Scenario = {
  slug: string; // URL segment; matches a TripMission.scenarioSlug
  missionSlug: string; // brief handed to /places
  eyebrow: string;
  title: string;
  promise: string; // one-line subtitle
  intro: string;
  forWho: string;
  fear: string; // the worry this trip type carries, that we remove
  sections: ScenarioSection[];
  ctaLabel: string;
  metaTitle: string; // layout template appends " · Other Bali"
  metaDescription: string;
};

export const SCENARIOS: Scenario[] = [
  {
    slug: "first-time-in-bali",
    missionSlug: "first-time",
    eyebrow: "First time in Bali",
    title: "Your first Bali day, without the rookie mistakes",
    promise: "Land, settle, get one good day — before you try to see the whole island.",
    intro:
      "Bali is not one place, and day one is where most first-timers lose a day to traffic, a tourist trap, or the wrong neighbourhood. Pick one base, do it well, and let the island come to you.",
    forWho: "First-timers who want an easy, confident first day — no three-hour drives for a photo.",
    fear: "Choosing the wrong area, overpaying, and eating somewhere you'll regret.",
    sections: [
      {
        heading: "Pick one base, not the whole island",
        body: "Choose a single area for your first days — Canggu for cafés and surf energy, Seminyak for polished dinners, Ubud for jungle and slower mornings. Moving every day is what burns the trip.",
      },
      {
        heading: "Your first 24 hours",
        body: "Easy coffee to shake off the flight, a relaxed lunch nearby, a sunset spot you don't have to fight a crowd for, and an early dinner close to where you sleep.",
      },
      {
        heading: "Book the few things worth booking",
        body: "Sunset tables and proper dinners fill up. A couple of reservations before you land means you're never stuck deciding at 7pm with a hungry group.",
      },
      {
        heading: "Don't over-drive day one",
        body: "The famous temples and waterfalls can wait. Keep the first day inside one area so you actually rest instead of sitting in scooter traffic.",
      },
    ],
    ctaLabel: "See first-timer picks",
    metaTitle: "First time in Bali — your first day without rookie mistakes",
    metaDescription:
      "A calm, confident first day in Bali: pick one base, a simple first 24 hours, and the few things worth booking. Curated picks, no tourist traps. Travellers never pay.",
  },
  {
    slug: "bali-for-a-month",
    missionSlug: "workation",
    eyebrow: "Bali for a month",
    title: "Bali for a month: build a routine, not a holiday",
    promise: "Coffee, work, gym, sunset, dinner — the same island, lived at a slower speed.",
    intro:
      "Staying a few weeks changes what you need. Not a bucket list — a rhythm: a café you can actually work from, a gym, a lunch under budget, and a sunset walk that resets the day.",
    forWho: "Remote workers and long-stay travellers who want a life rhythm, not a checklist.",
    fear: "Burning the first week on logistics and never finding your places.",
    sections: [
      {
        heading: "Week 1 — settle",
        body: "SIM, scooter, laundry, and one home café you return to. Get the boring stuff sorted so the rest of the month is easy.",
      },
      {
        heading: "Week 2 — find your routine",
        body: "Lock in a work café, a gym or pilates studio, and a healthy lunch spot near both. A repeatable loop beats a new plan every morning.",
      },
      {
        heading: "Week 3 — explore without burning out",
        body: "Keep weekdays steady and save the day trips and further districts for the weekend, so work and exploring don't fight each other.",
      },
      {
        heading: "Week 4 — favourites and last dinners",
        body: "By now you know your places. Revisit the best ones and book the dinners you meant to try before you leave.",
      },
      {
        heading: "What makes a café work-friendly here",
        body: "Fast wifi, sockets, air-con, and quiet before the brunch rush. We tag places for exactly this so you're not testing five cafés to find one.",
      },
    ],
    ctaLabel: "See work-friendly places",
    metaTitle: "Bali for a month — where to build your routine",
    metaDescription:
      "Staying a month in Bali? Build a routine: work-friendly cafés, gyms, healthy lunches, and a weekly rhythm. Curated, honest picks. Travellers never pay.",
  },
  {
    slug: "romantic-bali",
    missionSlug: "romantic",
    eyebrow: "Romantic Bali",
    title: "Romantic Bali, without the obvious tourist trap",
    promise: "A sunset that fits a date, a table worth dressing for — not a crowd and a queue.",
    intro:
      "The most-photographed spots are often the most crowded. For a honeymoon, an anniversary, or just a good night out for two, the win is a place that fits the moment — the right light, the right table, no long drive home.",
    forWho: "Couples, honeymoons, anniversaries — anyone who wants two, not two hundred.",
    fear: "A beautiful-looking place that's loud, packed, or a long drive from where you're staying.",
    sections: [
      {
        heading: "Sunset by vibe, not by hype",
        body: "Some sunset spots are a party; some are a quiet drink for two. Choose by the energy you actually want tonight.",
      },
      {
        heading: "A dinner worth dressing for",
        body: "The best date tables get booked. Reserve ahead, especially after 7pm, so the evening starts on time instead of on a waitlist.",
      },
      {
        heading: "Mind the drive and the dress code",
        body: "A short transfer and a known dress code keep the night smooth. We flag both so there are no surprises at the door.",
      },
      {
        heading: "Keep a rainy-night backup",
        body: "Bali rain arrives fast. Have one covered, indoor option in your pocket so a downpour doesn't end the evening.",
      },
    ],
    ctaLabel: "See date-night picks",
    metaTitle: "Romantic Bali — sunset and dinner without the tourist trap",
    metaDescription:
      "Romantic Bali for two: sunset by vibe, a date-night dinner worth booking, dress code and transport sorted, a rainy-night backup. Curated picks. Travellers never pay.",
  },
  {
    slug: "bali-retreat-reset",
    missionSlug: "retreat",
    eyebrow: "Reset in Bali",
    title: "A calmer Bali week for your nervous system",
    promise: "Yoga, spa, clean food, quiet cafés — a reset without the performance wellness.",
    intro:
      "A reset trip has a different job: slow the day down. Less scrolling for the trendiest studio, more quiet mornings, clean food, and space to breathe — in the areas that actually stay calm.",
    forWho: "Anyone here to slow down — solo resetters, post-burnout, yoga-and-silence travellers.",
    fear: "Ending up somewhere loud, packed, or more performance than peace.",
    sections: [
      {
        heading: "Ubud reset vs Canggu soft reset",
        body: "Ubud leans quiet, green, and inward; Canggu can still reset if you pick the calmer corners and earlier hours. Choose the pace you need.",
      },
      {
        heading: "Spa, yoga, and sound — the real thing",
        body: "Look for calm rooms and unhurried mornings over the most-hyped studio. A quiet class beats a crowded photogenic one.",
      },
      {
        heading: "Clean food and quiet cafés",
        body: "Simple, fresh food and cafés that stay calm before the brunch rush keep the whole day gentle.",
      },
      {
        heading: "Rain-safe and solo-friendly",
        body: "Indoor fallbacks and places that are easy to arrive at alone keep a reset week soft even when the weather isn't.",
      },
    ],
    ctaLabel: "See reset places",
    metaTitle: "Bali reset — a calmer week for your nervous system",
    metaDescription:
      "A calmer Bali week: yoga, spa, clean food, and quiet cafés in the areas that actually stay calm — without the performance wellness. Curated picks. Travellers never pay.",
  },
];

// Page metadata for a scenario (title/description/canonical + article OG).
export function scenarioMetadata(s: Scenario): Metadata {
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: `/${s.slug}` },
    openGraph: {
      title: `${s.metaTitle} · Other Bali`,
      description: s.metaDescription,
      url: `https://otherbali.com/${s.slug}`,
      type: "article",
    },
  };
}

export function getScenario(slug: string | null | undefined): Scenario | null {
  if (!slug) return null;
  return SCENARIOS.find((s) => s.slug === slug) ?? null;
}

// Build the /places brief for a scenario's mission, so the page's CTA lands on
// the same Top-3 shortlist the day builder produces for that mission.
export function scenarioBriefHref(missionSlug: string): string {
  const m = getTripMission(missionSlug);
  const params = new URLSearchParams();
  if (m?.query.length) params.set("q", m.query.join(" "));
  if (m?.category) params.set("category", m.category);
  if (m) params.set("m", m.slug);
  params.set("intent", "1");
  return `/places?${params.toString()}`;
}
