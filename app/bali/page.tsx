import type { Metadata } from "next";
import Link from "next/link";
import { getDistrictHubs } from "@/lib/data";
import { SITE_ORIGIN, categoryPhrase, topAreas } from "@/lib/hub";
import { PILLARS } from "@/lib/pillars";
import { LIGHT_DISTRICTS } from "@/lib/light-districts";
import { COLLECTIONS, liveCollectionSlugs } from "@/lib/collections";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Where to Eat & Go in Bali — by District",
  description:
    "Curated Bali district guides — deep, hand-crafted guides for Canggu, Uluwatu, Ubud and Sanur, plus quick hubs for Seminyak, Jimbaran and Nusa Dua. Free; travellers never pay.",
  alternates: { canonical: "/bali" },
  openGraph: {
    title: "Where to Eat & Go in Bali — by District · Other Bali",
    description:
      "Curated Bali guides by district — real places, prices and routes. Free to use.",
    url: `${SITE_ORIGIN}/bali`,
    type: "website",
  },
};

export default async function BaliIndexPage() {
  const hubs = await getDistrictHubs();
  const liveTaste = new Set(await liveCollectionSlugs());
  const tasteCollections = COLLECTIONS.filter((c) => c.kind === "taste" && liveTaste.has(c.slug));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Bali", item: `${SITE_ORIGIN}/bali` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Bali districts",
      numberOfItems: hubs.length,
      itemListElement: hubs.map((h, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: h.name,
        url: `${SITE_ORIGIN}/bali/${h.slug}`,
      })),
    },
  ];

  return (
    <div className="page-dark">
      <main className="site-shell">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)]">
          <Link href="/" className="quiet-link">
            Other Bali
          </Link>{" "}
          › <span className="text-[var(--ink)]">Bali</span>
        </nav>

        <header className="hero-grid mt-3">
          <div>
            <h1 className="hero-title">Where to eat &amp; go in Bali</h1>
            <p className="hero-copy mt-3">
              Curated, district by district. We plan island-wide and go deep one
              area at a time — here are the districts with enough on the ground to
              guide a real day. Free to use; travellers never pay.
            </p>
          </div>
          <div className="editorial-signal" aria-label="Bali districts signal">
            <p className="editorial-signal-label">
              {PILLARS.length + hubs.length} district guides.
            </p>
          </div>
        </header>

        <section className="mt-10">
          <h2 className="section-title">Deep district guides</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Hand-crafted, resident-curated guides for our deepest districts.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="venue-card block p-5 transition-transform hover:-translate-y-0.5"
              >
                <h3 className="venue-name">{p.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.tagline}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--lagoon-strong)]">
                  The {p.name} guide →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <h2 className="section-title mt-12">More districts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((h) => {
            const areas = topAreas(h.venues, 3);
            return (
              <Link
                key={h.slug}
                href={`/bali/${h.slug}`}
                className="venue-card block p-5 transition-transform hover:-translate-y-0.5"
              >
                <h2 className="venue-name">{h.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {h.venues.length} places · {categoryPhrase(h.venues)}
                </p>
                {areas.length > 0 && (
                  <p className="mt-2 text-xs text-[var(--muted)]">{areas.join(" · ")}</p>
                )}
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--lagoon-strong)]">
                  Explore {h.name} →
                </span>
              </Link>
            );
          })}
        </div>

        {tasteCollections.length > 0 && (
          <>
            <div className="mt-12 flex items-baseline justify-between gap-4">
              <h2 className="section-title">Or browse by taste</h2>
              <Link href="/collections" className="quiet-link">All collections →</Link>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Not an area — a craving. Cuisine shortlists across the whole island.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tasteCollections.map((c) => (
                <Link key={c.slug} href={`/collections/${c.slug}`} className="chip">
                  {c.taste}
                </Link>
              ))}
            </div>
          </>
        )}

        <h2 className="section-title mt-12">Quiet corners of Bali</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Slower, further-out areas worth planning around — the valley, the
          dive coast, the highlands and the north.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LIGHT_DISTRICTS.map((d) => (
            <Link
              key={d.slug}
              href={`/${d.slug}`}
              className="venue-card block p-5 transition-transform hover:-translate-y-0.5"
            >
              <h3 className="venue-name">{d.name}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{d.region}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-[var(--lagoon-strong)]">
                The {d.name} guide →
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="section-title">Plan your trip</h2>
            <Link href="/guides" className="quiet-link">
              All guides →
            </Link>
          </div>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Where to stay, how many days, when to go, and island-wide best-of.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/where-to-stay-in-bali", label: "Where to stay in Bali" },
              { href: "/how-many-days-in-bali", label: "How many days" },
              { href: "/best-time-to-visit-bali", label: "Best time to visit" },
              { href: "/bali-itinerary-7-days", label: "7-day itinerary" },
              { href: "/best-beach-clubs-in-bali", label: "Best beach clubs" },
              { href: "/best-coffee-in-bali", label: "Best coffee" },
            ].map((g) => (
              <Link key={g.href} href={g.href} className="chip">
                {g.label}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
