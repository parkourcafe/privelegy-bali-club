import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { GuideFooter } from "@/components/GuideBlocks";
import { COLLECTIONS, CURATION_NOTE, liveCollectionSlugs } from "@/lib/collections";
import ArtCard, { collectionArt } from "@/components/ArtCard";

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
  // Collections that exist but haven't yet reached enough decision-ready places
  // across enough districts. Shown as plain labels (never links) — honest
  // signal of what's growing, no 404s, no thin pages indexed.
  const inResearch = COLLECTIONS.filter((c) => !liveSlugs.has(c.slug));

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
          <p style={{ marginTop: 12 }}>
            <Link href="/my-day" className="quiet-link">
              Prefer a whole day, planned? See My Day →
            </Link>
          </p>
        </header>

        {([
          { kind: "taste" as const, heading: "By taste", note: "A craving, island-wide — cuisines across every area." },
          { kind: "moment" as const, heading: "By moment", note: "Not what you're eating — the night you're having." },
        ]).map((group) => {
          const items = live.filter((c) => c.kind === group.kind);
          if (items.length === 0) return null;
          return (
            <section key={group.kind} className="guide-section">
              <h2>{group.heading}</h2>
              <p className="text-sm text-[var(--muted)]">{group.note}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {items.map((c) => (
                  <ArtCard
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    art={collectionArt(c.slug)}
                    eyebrow={group.kind === "taste" ? "By taste" : "By moment"}
                    title={c.title}
                    blurb={c.intro}
                    cta={`See the ${c.taste.toLowerCase()} collection`}
                    tall
                  />
                ))}
              </div>
            </section>
          );
        })}
        {live.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            Collections are being curated — check back soon.
          </p>
        )}

        {inResearch.length > 0 && (
          <section className="guide-section">
            <h2>In research</h2>
            <p className="text-sm text-[var(--muted)]">
              Collections we&apos;re still building — a shortlist goes live only
              once we have enough decision-ready places across enough of the
              island. These are on the way.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Collections in research">
              {inResearch.map((c) => (
                <li
                  key={c.slug}
                  className="chip"
                  style={{ cursor: "default" }}
                >
                  {c.taste}
                </li>
              ))}
            </ul>
          </section>
        )}

        <GuideFooter />
      </main>
    </div>
  );
}
