import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getJimbaranVenues, toJimbaranPlaceCard } from "@/lib/jimbaran";
import { JIMBARAN_GUIDES, type JimbaranGuide } from "@/lib/jimbaran-guides";

const BASE = "https://www.otherbali.com";

export default async function JimbaranGuideView({ guide }: { guide: JimbaranGuide }) {
  const venues = (await getJimbaranVenues()).filter(guide.base);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Jimbaran", href: "/jimbaran" },
    { name: guide.h1 },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          ...(c.href ? { item: `${BASE}${c.href}` } : {}),
        })),
      },
      {
        "@type": "ItemList",
        name: guide.h1,
        itemListElement: venues.map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.name,
          url: `${BASE}/places/${v.slug}`,
        })),
      },
    ],
  };

  const related = [
    { href: "/jimbaran", title: "The Jimbaran guide", blurb: "The seafood bay — grills, sunset bars, resort dining and how to plan a night." },
    ...JIMBARAN_GUIDES.filter((g) => g.slug !== guide.slug).map((g) => ({
      href: `/jimbaran/${g.slug}`,
      title: g.h1,
      blurb: g.lede,
    })),
  ];

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug={`jimbaran/${guide.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Jimbaran</p>
          <h1 className="hero-title mt-2">{guide.h1}</h1>
          <p className="hero-copy">{guide.lede}</p>
        </header>

        <section className="guide-section">
          <h2>{guide.sectionHeading}</h2>
          <p className="text-sm text-[var(--muted)]">{guide.sectionNote}</p>
          {venues.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">
              We&apos;re still verifying picks here. Meanwhile, browse the{" "}
              <a href="/jimbaran" className="quiet-link">Jimbaran guide</a>.
            </p>
          ) : (
            <div className="pick-grid" style={{ marginTop: 16 }}>
              {venues.map((v) => (
                <PlaceCard key={v.slug} place={toJimbaranPlaceCard(v)} />
              ))}
            </div>
          )}
        </section>

        <FaqBlock items={guide.faq} />
        <RelatedGuides links={related} />
        <GuideFooter />
      </main>
    </div>
  );
}
