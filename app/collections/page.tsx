import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { GuideFooter } from "@/components/GuideBlocks";
import { COLLECTIONS, CURATION_NOTE, liveCollectionSlugs } from "@/lib/collections";

export const revalidate = 300;

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Bali by taste — cuisine collections",
  description:
    "Browse Bali by what you're craving, not just by area: Balinese & local food, brunch, seafood and more — resident-curated shortlists across the whole island.",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "Bali by taste · Other Bali",
    description: "Resident-curated cuisine collections across Bali — pick a taste, not just an area.",
    url: `${BASE}/collections`,
    type: "website",
  },
};

export default async function CollectionsHubPage() {
  const liveSlugs = new Set(await liveCollectionSlugs());
  const live = COLLECTIONS.filter((c) => liveSlugs.has(c.slug));

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Collections" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${BASE}${c.href}` } : {}),
    })),
  };

  return (
    <div>
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <p className="topline">Island-wide · Curated by residents</p>
          <h1 className="hero-title mt-2">Bali by taste</h1>
          <p className="guide-standfirst">
            Sometimes you don&apos;t want an area — you want a craving. These are
            cuisine collections across the whole island: pick a taste, get the
            places residents actually rate, sorted by area.
          </p>
          <p className="guide-meta-line">{CURATION_NOTE}</p>
        </header>

        <section className="guide-section">
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            {live.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="venue-card block p-5 transition-transform hover:-translate-y-0.5"
              >
                <h2 className="venue-name">{c.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{c.intro}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--lagoon-strong)]">
                  See the {c.taste.toLowerCase()} collection →
                </span>
              </Link>
            ))}
          </div>
          {live.length === 0 && (
            <p className="text-sm text-[var(--muted)]">
              Collections are being curated — check back soon.
            </p>
          )}
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
