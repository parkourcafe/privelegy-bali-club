import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getCangguVenues, toCangguPlaceCard } from "@/lib/canggu";
import { buildItinerary } from "@/lib/canggu-itinerary";

// "3 perfect days in Canggu" — the Meta AU campaign landing (P1-4). Built ONLY
// from existing entities: it composes real, published Canggu venues (with their
// own DB editorial lines) into a three-day arc. No new entity, no hand-written
// venue claims — Canggu has no verified evidence registry yet (see lib/canggu.ts),
// so every stop is a live venue card and the day/block framing is generic
// scaffolding, never an invented fact (guardrail #10). Stops link to real
// /places/[slug] pages; the itinerary degrades honestly when inventory is thin.

export const revalidate = 300;

const BASE = "https://www.otherbali.com";
const CANONICAL = "/canggu/3-perfect-days";
const TITLE = "3 perfect days in Canggu — a realistic itinerary";
const DESCRIPTION =
  "Three easy days in Canggu: surf-and-coffee mornings, beach-club afternoons, sunset drinks and dinners worth booking — real places, sequenced so you never cross Canggu twice.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "3 perfect days in Canggu · Other Bali",
    description: DESCRIPTION,
    url: `${BASE}${CANONICAL}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "3 perfect days in Canggu · Other Bali",
    description: DESCRIPTION,
  },
};

const FAQ = [
  {
    q: "Do I need to book restaurants and beach clubs in Canggu?",
    a: "For the popular dinner rooms and weekend sunset beach clubs, yes — reserve a table in a tap where you see the Reserve button. Cafés, warungs and casual spots are walk-in.",
  },
  {
    q: "Can I do these three days without a scooter?",
    a: "Mostly. You can walk within an area — Batu Bolong especially — but moving between Berawa, Batu Bolong, Pererenan and Echo Beach means real traffic on narrow roads. Ride apps work; leave extra time at sunset and on weekends.",
  },
  {
    q: "Which area should I base myself in for this?",
    a: "Batu Bolong for walk-everywhere convenience, Berawa for beach clubs and an upscale scene, Pererenan for a calmer green base, Echo Beach and the village for surf and a more local feel. Any of them keeps this itinerary short on the road.",
  },
  {
    q: "What if it rains?",
    a: "Swap a beach or sunset block for a long café morning or a spa afternoon — both are already in the plan. Canggu's wet season is mostly afternoon downpours, not all-day rain.",
  },
];

const RELATED = [
  { href: "/canggu", title: "The full Canggu guide", blurb: "Every area, sorted by the decision you're making." },
  { href: "/plan", title: "Build your own Canggu day", blurb: "Pick the moment; get the places that fit." },
  { href: "/canggu/beach-clubs-sunset", title: "Canggu beach clubs & sunset", blurb: "Which one suits your kind of evening." },
  { href: "/canggu/best-restaurants", title: "Best restaurants in Canggu", blurb: "Where to book the dinners that matter." },
];

export default async function CangguThreeDaysPage() {
  const venues = await getCangguVenues();
  const days = buildItinerary(venues);
  const stopCount = days.reduce((n, d) => n + d.stops.length, 0);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Canggu", href: "/canggu" },
    { name: "3 perfect days" },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${BASE}${c.href}` } : {}),
    })),
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "3 perfect days in Canggu",
    itemListElement: days
      .flatMap((d) => d.stops)
      .map((stop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: stop.venue.name,
        url: `${BASE}/places/${stop.venue.slug}`,
      })),
  };

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="canggu-3-perfect-days" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {stopCount > 0 && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
        )}

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Canggu · Other Bali beta</p>
          <h1 className="hero-title mt-2">3 perfect days in Canggu</h1>
          <p className="hero-copy">
            Not a checklist — a rhythm. Three days shaped the way residents actually
            spend them: a surf-and-coffee morning, beach hours while the light is
            high, a sunset with your feet near the sand, and a dinner worth sitting
            down for. Every stop below is a real, checked place — tap through for the
            details, and reserve where you see the option.
          </p>
          <div className="hero-actions">
            <Link href="/canggu" className="button-primary button-large">
              Open the guide
            </Link>
            <Link href="/me" className="button-secondary button-large">
              Save for your trip
            </Link>
            <p className="hero-note">
              Free — travellers never pay. Times are a suggestion, not a schedule.
            </p>
          </div>
        </header>

        {days.length > 0 ? (
          days.map((day) => (
            <section key={day.n} className="guide-section">
              <p className="topline">Day {day.n}</p>
              <h2>{day.title}</h2>
              <p className="text-sm text-[var(--muted)]">{day.theme}</p>
              <div className="pick-grid" style={{ marginTop: 16 }}>
                {day.stops.map((stop) => (
                  <div key={stop.venue.slug}>
                    <p className="topline" style={{ marginBottom: 6 }}>
                      {stop.label} · {stop.hint}
                    </p>
                    <PlaceCard place={toCangguPlaceCard(stop.venue)} />
                  </div>
                ))}
              </div>
            </section>
          ))
        ) : (
          <section className="guide-section">
            <p className="hero-copy">
              We&apos;re still publishing Canggu&apos;s checked places. In the meantime,
              browse the full guide or build a day around the moment you&apos;re in.
            </p>
            <div className="hero-actions">
              <Link href="/canggu" className="button-primary button-large">
                The Canggu guide
              </Link>
              <Link href="/plan" className="button-secondary button-large">
                Build a Canggu day
              </Link>
            </div>
          </section>
        )}

        <FaqBlock items={FAQ} heading="Planning three days in Canggu" />

        <RelatedGuides links={RELATED} />

        <GuideFooter />
      </main>
    </div>
  );
}
