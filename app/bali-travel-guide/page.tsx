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
    note: "The decisions that shape everything else — when to come, how long, how you'll move around, and what it costs.",
    links: [
      { href: "/best-time-to-visit-bali", title: "Best time to visit Bali", blurb: "Dry season, wet season and the shoulder-month sweet spot." },
      { href: "/how-many-days-in-bali", title: "How many days do you need?", blurb: "What fits in 5, 7, 10 and 14 days." },
      { href: "/bali-itinerary-7-days", title: "7-day itinerary", blurb: "A calm first-timer route: Ubud, then the coast." },
      { href: "/bali-itinerary-10-days", title: "10–14 day itinerary", blurb: "Add a third pace — the islands or the quiet east." },
      { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Scooter, private driver or Grab — and when to use which." },
      { href: "/bali-on-a-budget", title: "Bali on a budget", blurb: "How to keep costs low without missing the good stuff." },
      { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "An honest, practical safety guide — scooters, sea, scams." },
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
    note: "Deep district guides — what each base is like, and how to spend your days there.",
    links: [
      { href: "/canggu", title: "Canggu", blurb: "Surf mornings, café work, sunset beach clubs." },
      { href: "/ubud", title: "Ubud", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
      { href: "/uluwatu", title: "Uluwatu & the Bukit", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
      { href: "/seminyak", title: "Seminyak", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
      { href: "/sanur", title: "Sanur", blurb: "A calm, walkable base and the fast-boat gateway to the Nusas." },
      { href: "/nusa-dua", title: "Nusa Dua", blurb: "Calm resort beaches, fine dining and big resort spas." },
    ],
  },
  {
    heading: "What to do",
    note: "The island icons and the set-piece days — planned around your base, not chased across the island.",
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
    note: "From warung nasi campur to clifftop dinners — where to eat well in every area, by the moment you're in.",
    links: [
      { href: "/best-restaurants-in-bali", title: "Best restaurants", blurb: "Canggu dinners, Seminyak fine dining, Jimbaran seafood." },
      { href: "/best-cafes-in-bali", title: "Best cafés", blurb: "Laptop-friendly brunch and specialty coffee, by area." },
      { href: "/best-warungs-in-bali", title: "Best warungs & local food", blurb: "Cheap, authentic Indonesian food, district by district." },
      { href: "/best-coffee-in-bali", title: "Best specialty coffee", blurb: "The roasters and cafés that treat coffee as the craft." },
    ],
  },
  {
    heading: "Plan by moment",
    note: "Coming for something specific? Start from the trip you're actually taking.",
    links: [
      { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first trip without the rookie mistakes." },
      { href: "/romantic-bali", title: "Romantic Bali", blurb: "A couples' trip planned around the right moments." },
      { href: "/bali-for-a-month", title: "Bali for a month", blurb: "Settle in — work, community and a slower rhythm." },
      { href: "/bali-retreat-reset", title: "A retreat & reset", blurb: "Wellness, quiet and space to reset." },
    ],
  },
];

const FAQ: GuideFaq[] = [
  {
    q: "How do I plan a trip to Bali?",
    a: "Start with three decisions: when to go (the dry season, April–October, is easiest; May, June and September are the sweet spot), how long (7–10 days for a first trip), and where to base (one inland area like Ubud plus one coastal area). Pick one or two bases, book the few things worth booking, and plan by travel time rather than distance — traffic makes short hops slow.",
  },
  {
    q: "What is the best area to stay in Bali for first-timers?",
    a: "The five first-timer areas are Canggu (surf and cafés), Seminyak (polished dining), Uluwatu (clifftop sunsets and surf), Ubud (jungle and culture) and Sanur (calm and family-friendly). Most first trips pair one inland base with one by the sea — commonly Ubud plus Canggu, Seminyak or Uluwatu.",
  },
  {
    q: "How many days do you need in Bali?",
    a: "For a first trip, 7 to 10 days is the sweet spot — enough to split your time between an inland base and a coastal one without living in traffic. Five days works if you stay in a single area; two weeks lets you add the Nusa islands or the quieter east.",
  },
  {
    q: "Is Bali expensive?",
    a: "It's one of the better-value destinations in the world if you lean local — warung meals, a scooter or ride-hailing apps, and guesthouses keep costs very low. The gap between a shoestring day and a luxury day is enormous, so beach clubs and fine dining are best treated as occasional splurges rather than daily habits.",
  },
  {
    q: "What should I not miss in Bali?",
    a: "The island icons are the temples (Tanah Lot, Uluwatu, Besakih), a Mount Batur sunrise, the rice terraces, waterfalls, and a Nusa Penida trip for the cliffs. But the icons are scattered — cluster them by direction around your base rather than trying to see everything.",
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
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        ...(c.href ? { item: `${BASE}${c.href}` } : {}),
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
            Everything you need to plan a Bali trip, in the order you actually
            decide it: when to go and how long, where to base yourself, how to get
            around, what to do, and where to eat. This is the resident-curated
            starting point — pick the thread that fits your trip and follow it into
            the detail.
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
