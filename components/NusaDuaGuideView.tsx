import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import { getNusaDuaVenues, toNusaDuaPlaceCard } from "@/lib/nusa-dua";
import { NUSA_DUA_GUIDES, type NusaDuaGuide } from "@/lib/nusa-dua-guides";

const BASE = "https://www.otherbali.com";

export default async function NusaDuaGuideView({ guide }: { guide: NusaDuaGuide }) {
  const venues = (await getNusaDuaVenues()).filter(guide.base);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Nusa Dua", href: "/nusa-dua" },
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
    { href: "/nusa-dua", title: "The Nusa Dua guide", blurb: "The resort enclave — beaches, dining and how to plan a calm stay." },
    ...NUSA_DUA_GUIDES.filter((g) => g.slug !== guide.slug).map((g) => ({
      href: `/nusa-dua/${g.slug}`,
      title: g.h1,
      blurb: g.lede,
    })),
  ];

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug={`nusa-dua/${guide.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Nusa Dua</p>
          <h1 className="hero-title mt-2">{guide.h1}</h1>
          <p className="hero-copy">{guide.lede}</p>
          <GuideHeroMedia seed={`nusa dua ${guide.slug} ${guide.h1}`} />
        </header>

        <section className="guide-section">
          <h2>{guide.sectionHeading}</h2>
          <GuideSectionMedia seed={`nusa dua ${guide.slug} ${guide.sectionHeading}`} index={0} />
          <p className="text-sm text-[var(--muted)]">{guide.sectionNote}</p>
          {venues.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">
              We&apos;re still verifying picks here. Meanwhile, browse the{" "}
              <a href="/nusa-dua" className="quiet-link">Nusa Dua guide</a>.
            </p>
          ) : (
            <div className="pick-grid" style={{ marginTop: 16 }}>
              {venues.map((v) => (
                <PlaceCard key={v.slug} place={toNusaDuaPlaceCard(v)} />
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
