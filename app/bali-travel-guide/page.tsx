import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getGuide, guideMetadata, type GuideFaq } from "@/lib/guides";

const BASE = "https://www.otherbali.com";
const guide = getGuide("bali-travel-guide")!;
export const metadata = guideMetadata(guide);

// The pillar links out to every cluster. Each item is an internal route that
// exists (guides in the registry, district pillars, moment scenarios) — no
// invented links. Grouped the way a first-timer actually plans a trip.
type Cluster = { heading: string; note: string; links: { href: string; title: string; blurb: string }[] };

const CLUSTERS: Cluster[] = [
  {
    heading: "Plan the trip",
    note: "The decisions that shape the rest of the trip: when to come, how long to stay, how you'll get around and what it will cost.",
    links: [
      { href: "/best-time-to-visit-bali", title: "Best time to visit Bali", blurb: "Dry season, wet season and the shoulder months between them." },
      { href: "/how-many-days-in-bali", title: "How many days do you need?", blurb: "What fits in 5, 7, 10 and 14 days." },
      { href: "/bali-itinerary-7-days", title: "7-day itinerary", blurb: "A calm first-timer route: Ubud, then the coast." },
      { href: "/bali-itinerary-10-days", title: "10–14 day itinerary", blurb: "Add a third pace: the islands or the quiet east." },
      { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Scooter, private driver or Grab, and when to use which." },
      { href: "/bali-on-a-budget", title: "Bali on a budget", blurb: "How to keep costs low without missing the good stuff." },
      { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "A practical safety guide to scooters, the sea and scams." },
    ],
  },
  {
    heading: "Where to stay",
    note: "Bali is a handful of very different areas. Pick the base that fits your trip, then go deep rather than wide.",
    links: [
      { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "The five first-timer areas, compared." },
      { href: "/canggu-vs-uluwatu", title: "Canggu vs Uluwatu", blurb: "Cafés-and-nightlife hub or clifftop sunsets and surf." },
      { href: "/seminyak-vs-canggu", title: "Seminyak vs Canggu", blurb: "Polished and walkable, or younger and laid-back." },
      { href: "/ubud-vs-canggu", title: "Ubud vs Canggu", blurb: "Jungle and culture, or surf and beach-town buzz." },
      { href: "/best-area-to-stay-in-bali-for-couples", title: "Best area for couples", blurb: "Uluwatu, Ubud or Seminyak for a romantic trip." },
      { href: "/best-area-to-stay-in-bali-for-families", title: "Best area for families", blurb: "Calm, swimmable bases for an easy family trip." },
    ],
  },
  {
    heading: "The areas, guide by guide",
    note: "District guides: what each base is like and how to spend your days there.",
    links: [
      { href: "/canggu", title: "Canggu", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/ubud", title: "Ubud", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
      { href: "/uluwatu", title: "Uluwatu & the Bukit", blurb: "Cliff-edge sunsets, reef-break surf, dinners with a view." },
      { href: "/seminyak", title: "Seminyak", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
      { href: "/sanur", title: "Sanur", blurb: "A calm, walkable base and the fast-boat gateway to the Nusas." },
      { href: "/nusa-dua", title: "Nusa Dua", blurb: "Calm resort beaches, fine dining and big resort spas." },
    ],
  },
  {
    heading: "What to do",
    note: "The island icons and the set-piece days, planned around your base instead of chased across the island.",
    links: [
      { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and what to do in each area." },
      { href: "/best-beach-clubs-in-bali", title: "Best beach clubs", blurb: "Clifftop sunsets, the Seminyak classics, Canggu's line-up." },
      { href: "/where-to-watch-sunset-in-bali", title: "Where to watch the sunset", blurb: "The best golden-hour spots, area by area." },
      { href: "/best-spas-in-bali", title: "Best spas & wellness", blurb: "Ubud's healing centres and the Seminyak spa strip." },
      { href: "/nusa-penida-day-trip", title: "Nusa Penida day trip", blurb: "The fast boat, the cliffs, and whether to stay over." },
    ],
  },
  {
    heading: "Where to eat & drink",
    note: "Where to eat well in every area, from warung nasi campur to clifftop dinners, by the moment you're in.",
    links: [
      { href: "/best-restaurants-in-bali", title: "Best restaurants", blurb: "Canggu dinners, Seminyak fine dining, Jimbaran seafood." },
      { href: "/best-cafes-in-bali", title: "Best cafés", blurb: "Laptop-friendly brunch and specialty coffee, by area." },
      { href: "/best-warungs-in-bali", title: "Best warungs & local food", blurb: "Cheap, authentic Indonesian food, district by district." },
      { href: "/best-coffee-in-bali", title: "Best specialty coffee", blurb: "The roasters and cafés that treat coffee as the craft." },
    ],
  },
  {
    heading: "Plan by moment",
    note: "If you're coming for something specific, start from the trip you're actually taking.",
    links: [
      { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first trip without the rookie mistakes." },
      { href: "/romantic-bali", title: "Romantic Bali", blurb: "A couples' trip planned around the right moments." },
      { href: "/bali-for-a-month", title: "Bali for a month", blurb: "Settle in for work, community and a slower rhythm." },
      { href: "/bali-retreat-reset", title: "A retreat & reset", blurb: "Wellness, quiet and space to reset." },
    ],
  },
];

const FAQ: GuideFaq[] = [
  {
    q: "How do I plan a trip to Bali?",
    a: "Start with three decisions. When to go: the dry season, April–October, is easiest, and May, June and September are the months to aim for. How long: 7–10 days for a first trip. Where to base: one inland area like Ubud plus one coastal area. Then pick one or two bases and book the few things worth booking. Plan by travel time rather than distance, because traffic makes short hops slow.",
  },
  {
    q: "What is the best area to stay in Bali for first-timers?",
    a: "There are five first-timer areas. Canggu is surf and cafés, and Seminyak is polished dining. Uluwatu is clifftop sunsets and surf. Ubud is jungle and culture; Sanur is calm and family-friendly. Most first trips pair one inland base with one by the sea, commonly Ubud plus Canggu, Seminyak or Uluwatu.",
  },
  {
    q: "How many days do you need in Bali?",
    a: "Give a first trip 7 to 10 days. That's enough to split your time between an inland base and a coastal one without living in traffic. Five days works if you stay in one area, and two weeks lets you add the Nusa islands or the quieter east.",
  },
  {
    q: "Is Bali expensive?",
    a: "If you lean local, it's one of the better-value destinations in the world. Warung meals, guesthouses and a scooter or ride-hailing apps keep costs low. The gap between a shoestring day and a luxury day is enormous. Treat beach clubs and fine dining as occasional splurges rather than daily habits.",
  },
  {
    q: "What should I not miss in Bali?",
    a: "The headline sights are the temples (Tanah Lot, Uluwatu, Besakih), a Mount Batur sunrise, the rice terraces and the waterfalls. Add a Nusa Penida trip for the cliffs. They're scattered, so cluster them by direction around your base rather than trying to see everything.",
  },
];

export default function BaliTravelGuidePage() {
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Bali travel guide" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Bali travel guide",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Bali travel guide — planning clusters",
      itemListElement: CLUSTERS.flatMap((c) => c.links).map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.title,
        url: `${BASE}${l.href}`,
      })),
    },

  ];

  return (
    <div>
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">Bali travel guide</h1>
          <p className="guide-lede">
            Plan a Bali trip in the order you&apos;ll actually make the decisions.
            Start with when to go and for how long, then where to base yourself and
            how to get around. What to do and where to eat come after that. This is
            the resident-curated starting point: pick the thread that fits your trip
            and follow it into the detail.
          </p>
          <p className="guide-meta-line">
            Resident-curated · researched, not sponsored · no paid ranking
          </p>
        </header>

        {CLUSTERS.map((cluster) => (
          <section key={cluster.heading} className="guide-section">
            <h2>{cluster.heading}</h2>
            <p className="guide-lede">{cluster.note}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {cluster.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-semibold text-[var(--ink)]">
                    {l.title}
                  </Link>
                  <span className="text-[var(--muted)]"> · {l.blurb}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <FaqBlock items={FAQ} heading="Good to know" />

        <RelatedGuides
          heading="Start here"
          links={[
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "The five first-timer areas, compared." },
            { href: "/bali-itinerary-7-days", title: "7 days in Bali", blurb: "A calm first-trip route to copy." },
            { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and area-by-area days." },
            { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "The practical safety basics before you go." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
