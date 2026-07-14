import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getUbudVenues, toUbudPlaceCard } from "@/lib/ubud";
import { UBUD_GUIDES, type UbudGuide } from "@/lib/ubud-guides";
import { serializeJsonLd } from "@/lib/json-ld";

const BASE = "https://www.otherbali.com";

export default async function UbudGuideView({ guide }: { guide: UbudGuide }) {
  const venues = (await getUbudVenues()).filter(guide.base);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Ubud", href: "/ubud" },
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
    { href: "/ubud", title: "The Ubud guide", blurb: "Areas, food and how to plan a slow day." },
    ...UBUD_GUIDES.filter((g) => g.slug !== guide.slug).map((g) => ({
      href: `/ubud/${g.slug}`,
      title: g.h1,
      blurb: g.lede,
    })),
  ];

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug={`ubud/${guide.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Ubud</p>
          <h1 className="hero-title mt-2">{guide.h1}</h1>
          <p className="hero-copy">{guide.lede}</p>
        </header>

        <section className="guide-section">
          <h2>{guide.sectionHeading}</h2>
          <p className="text-sm text-[var(--muted)]">{guide.sectionNote}</p>
          {venues.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">
              We&apos;re still verifying picks here. Meanwhile, browse the{" "}
              <a href="/ubud" className="quiet-link">Ubud guide</a>.
            </p>
          ) : (
            <div className="pick-grid" style={{ marginTop: 16 }}>
              {venues.map((v) => (
                <PlaceCard key={v.slug} place={toUbudPlaceCard(v)} />
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
