import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia } from "@/components/GuideMedia";
import { COLLECTIONS, CURATION_NOTE, liveCollectionSlugs } from "@/lib/collections";
import ArtCard, { collectionArt } from "@/components/ArtCard";

export const revalidate = 300;

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Curated Bali collections — shortlists by theme",
  description:
    "Browse published Bali shortlists by taste and moment. Use collections when you want a theme, not the full places catalogue or a generated day.",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "Curated Bali collections · Other Bali",
    description: "Published shortlists by taste and moment — a focused Explore surface.",
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
          <p className="topline">Explore · Editorial shortlists</p>
          <h1 className="hero-title mt-2">Curated Bali collections</h1>
          <p className="guide-standfirst">
            Use collections when you want a focused theme: a cuisine, a kind of
            night, a budget mood or a work-friendly list. For every published
            place at once, use Explore; for a generated day, use Today.
          </p>
          <p className="guide-meta-line">{CURATION_NOTE}</p>
          <GuideHeroMedia seed="collections bali editorial shortlists taste moment" />
          <p style={{ marginTop: 12 }}>
            <Link href="/my-day" className="quiet-link">
              Need a decision for today? Open Today →
            </Link>
          </p>
        </header>

        {([
          { kind: "taste" as const, heading: "Taste collections", note: "Use these when the craving matters more than the area." },
          { kind: "moment" as const, heading: "Moment collections", note: "Use these when the kind of night matters more than the category." },
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
