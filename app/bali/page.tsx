import type { Metadata } from "next";
import Link from "next/link";
import { getDistrictHubs } from "@/lib/data";
import { SITE_ORIGIN, categoryPhrase, topAreas } from "@/lib/hub";
import { PILLARS } from "@/lib/pillars";

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
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
