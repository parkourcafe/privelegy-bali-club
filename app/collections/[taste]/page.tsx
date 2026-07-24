import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PlaceCard from "@/components/PlaceCard";
import PageViewTracker from "@/components/PageViewTracker";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia } from "@/components/GuideMedia";
import {
  CURATION_NOTE,
  getCollection,
  getCollectionAreas,
  liveCollectionSlugs,
  toCollectionPlaceCard,
  MIN_VENUES,
  MIN_DISTRICTS,
} from "@/lib/collections";

// ISR like the best-of guides: cached for speed/SEO, regenerated at most every
// 5 min so editorial edits (and a held collection crossing the gate) surface
// without a redeploy.
export const revalidate = 300;
export const dynamicParams = false;

const BASE = "https://www.otherbali.com";

// Only the collections that currently clear the publication gate get a page;
// held ones 404 (dynamicParams=false) until their coverage grows.
export async function generateStaticParams() {
  const slugs = await liveCollectionSlugs();
  return slugs.map((taste) => ({ taste }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ taste: string }>;
}): Promise<Metadata> {
  const { taste } = await params;
  const c = getCollection(taste);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: `${c.title} · Other Bali`, description: c.metaDescription, url: `${BASE}/collections/${c.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: `${c.title} · Other Bali`, description: c.metaDescription },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ taste: string }>;
}) {
  const { taste } = await params;
  const collection = getCollection(taste);
  if (!collection) notFound();

  const areas = await getCollectionAreas(taste);
  const total = areas.reduce((n, a) => n + a.venues.length, 0);
  // Re-check the gate at render time too — a collection that lost coverage
  // since the last build should not serve a thin page.
  if (total < MIN_VENUES || areas.length < MIN_DISTRICTS) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: collection.taste },
  ];

  const relatedLive = collection.related
    .map((s) => getCollection(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collection.title,
      description: collection.metaDescription,
      url: `${BASE}/collections/${collection.slug}`,
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: collection.title,
      itemListElement: areas
        .flatMap((a) => a.venues)
        .map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.name, url: `${BASE}/places/${v.slug}` })),
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
        <PageViewTracker event="editorial_page_view" slug={`collection-${collection.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <p className="topline">Collection · Focused shortlist</p>
          <h1 className="hero-title mt-2">{collection.title}</h1>
          <p className="guide-standfirst">{collection.intro}</p>
          <p className="guide-meta-line">{CURATION_NOTE}</p>
          <GuideHeroMedia seed={`collection ${collection.slug} ${collection.title}`} />
        </header>

        {/* Quick jump to a district — mobile-first taste browsing. */}
        <nav className="mt-2 flex flex-wrap gap-2" aria-label="Jump to area">
          {areas.map((a) => (
            <a key={a.key} href={`#${a.key}`} className="chip">
              {a.name} · {a.venues.length}
            </a>
          ))}
        </nav>

        {areas.map((area) => (
          <section key={area.key} id={area.key} className="guide-section">
            <div className="flex items-baseline justify-between gap-4">
              <h2>{area.name}</h2>
              {area.pillar ? (
                <Link href={area.pillar} className="quiet-link">Area guide →</Link>
              ) : null}
            </div>
            <div className="pick-grid" style={{ marginTop: 16 }}>
              {area.venues.map((v) => (
                <PlaceCard key={v.slug} place={toCollectionPlaceCard(v)} />
              ))}
            </div>
          </section>
        ))}

        <section className="guide-section">
          <h2>How this collection works</h2>
          <div className="guide-prose">
            <p>
              This is a themed shortlist, not the full catalogue and not an
              ordered route. Each linked place has to pass the publication gate,
              and the grouping uses stored collection rules rather than star
              ratings, review counts or paid placement.
            </p>
          </div>
        </section>

        <FaqBlock items={collection.faq} heading="Good to know" />

        {relatedLive.length > 0 && (
          <section className="guide-section">
            <h2>More collections</h2>
            <nav className="mt-3 flex flex-wrap gap-2" aria-label="Related collections">
              {relatedLive.map((c) => (
                <Link key={c.slug} href={`/collections/${c.slug}`} className="chip">
                  {c.taste}
                </Link>
              ))}
              <Link href="/collections" className="chip">All collections →</Link>
            </nav>
          </section>
        )}

        <RelatedGuides
          heading="Other ways to choose"
          links={[
            { href: "/places", title: "Explore all published places", blurb: "Search and filter the full catalogue." },
            { href: "/my-day", title: "Find a place for today", blurb: "Turn your current moment into a short shortlist." },
            { href: "/best-restaurants-in-bali", title: "The best restaurants in Bali", blurb: "The island's dinner scene, area by area." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
