import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PlaceCard from "@/components/PlaceCard";
import PageViewTracker from "@/components/PageViewTracker";
import { RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import {
  CURATION_NOTE,
  getCollection,
  getCollectionSample,
  toCollectionPlaceCard,
} from "@/lib/collections";
import type { VenueWithPerk } from "@/lib/data";

// A day, not a directory. "My Day" reads the island as a single arc — morning
// to late dinner — and fills each slot from the moment/taste collections that
// already clear the publication gate. It invents nothing: a slot renders only
// when its collection has real, decision-ready places, so an under-covered
// moment simply drops out instead of showing a thin list.

export const revalidate = 300;

const BASE = "https://www.otherbali.com";
const PER_SLOT = 3;

interface DaySlot {
  key: string;
  time: string;
  title: string;
  line: string;
  collection: string; // collection slug the slot draws from
}

// The arc. Each slot maps to one live collection; order is the day itself, not
// a ranking.
const SLOTS: DaySlot[] = [
  {
    key: "morning",
    time: "08:00 — Slow morning",
    title: "Ease in over breakfast",
    line: "Long coffees, eggs and a table you don't want to leave — the unhurried start Bali does best.",
    collection: "brunch-and-breakfast",
  },
  {
    key: "midday",
    time: "13:00 — Midday reset",
    title: "Somewhere calm to land",
    line: "Out of the heat and away from the crowd: quiet rooms and shaded corners to slow the afternoon down.",
    collection: "local-and-calm",
  },
  {
    key: "golden",
    time: "17:30 — Golden hour",
    title: "Catch the light",
    line: "A drink pointed west while the sky does its thing — the part of the day everyone remembers.",
    collection: "sunset-drinks",
  },
  {
    key: "dinner",
    time: "20:00 — Late dinner",
    title: "Make it a night",
    line: "The kind of table worth dressing for — close, warm and unhurried when the day winds down.",
    collection: "date-night",
  },
];

export const metadata: Metadata = {
  title: "My Day in Bali — a morning-to-night plan | Other Bali",
  description:
    "One easy plan for a day in Bali: breakfast, a calm midday, golden hour and a dinner worth staying up for — each pick resident-curated, never paid.",
  alternates: { canonical: "/my-day" },
  openGraph: {
    title: "My Day in Bali · Other Bali",
    description:
      "Breakfast, a calm midday, golden hour and a late dinner — a whole day, planned.",
    url: `${BASE}/my-day`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Day in Bali · Other Bali",
    description:
      "Breakfast, a calm midday, golden hour and a late dinner — a whole day, planned.",
  },
};

export default async function MyDayPage() {
  // Pull each slot's sample in parallel; keep only slots that came back with
  // real places (an under-covered collection yields fewer than PER_SLOT, or
  // zero — and a zero slot is dropped so the day never shows an empty rail).
  const filled = await Promise.all(
    SLOTS.map(async (slot) => {
      const venues = await getCollectionSample(slot.collection, PER_SLOT);
      return { slot, venues };
    }),
  );
  const active = filled.filter((f) => f.venues.length > 0);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "My Day" },
  ];

  const jsonLd = [
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
    // One ItemList for the whole day, in time order — every place is an
    // internal place page (guardrail: editorial order, never paid).
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "My Day in Bali",
      itemListElement: active
        .flatMap((f) => f.venues)
        .map((v: VenueWithPerk, i: number) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.name,
          url: `${BASE}/places/${v.slug}`,
        })),
    },
  ];

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="my-day" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <p className="topline">Island-wide · A day, planned</p>
          <h1 className="hero-title mt-2">My Day in Bali</h1>
          <p className="guide-standfirst">
            One easy arc through a Bali day — a slow breakfast, a calm midday, a
            drink for golden hour and a dinner worth staying up for. Swap any
            stop for another; it&apos;s a starting shape, not a schedule.
          </p>
          <p className="guide-meta-line">{CURATION_NOTE}</p>
        </header>

        {/* Quick jump between the parts of the day. */}
        <nav className="mt-2 flex flex-wrap gap-2" aria-label="Jump to a time of day">
          {active.map((f) => (
            <a key={f.slot.key} href={`#${f.slot.key}`} className="chip">
              {f.slot.time.split(" — ")[1] ?? f.slot.title}
            </a>
          ))}
        </nav>

        {active.map((f) => (
          <section key={f.slot.key} id={f.slot.key} className="guide-section">
            <p className="topline">{f.slot.time}</p>
            <h2 className="mt-1">{f.slot.title}</h2>
            <p className="guide-standfirst" style={{ marginTop: 8 }}>
              {f.slot.line}
            </p>
            <div className="pick-grid" style={{ marginTop: 16 }}>
              {f.venues.map((v) => (
                <PlaceCard key={v.slug} place={toCollectionPlaceCard(v)} />
              ))}
            </div>
            {getCollection(f.slot.collection) ? (
              <p style={{ marginTop: 12 }}>
                <Link
                  href={`/collections/${f.slot.collection}`}
                  className="quiet-link"
                >
                  See the whole {getCollection(f.slot.collection)!.taste.toLowerCase()} list →
                </Link>
              </p>
            ) : null}
          </section>
        ))}

        <section className="guide-section">
          <h2>How this is built</h2>
          <div className="guide-prose">
            <p>
              Each stop is drawn from our resident-curated collections — the same
              places, arranged as a day instead of a directory. Nothing here is a
              paid slot, and we don&apos;t publish negative call-outs: a place we
              can&apos;t stand behind simply isn&apos;t in the day. Times are a
              suggestion; the point is the shape.
            </p>
          </div>
        </section>

        <RelatedGuides
          heading="Keep planning"
          links={[
            {
              href: "/collections",
              title: "Browse by taste & moment",
              blurb: "The full set of collections, à la carte.",
            },
            {
              href: "/bali",
              title: "Bali by district",
              blurb: "Deep guides to every area.",
            },
            {
              href: "/best-restaurants-in-bali",
              title: "The best restaurants in Bali",
              blurb: "The island's dinner scene, area by area.",
            },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
