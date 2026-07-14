import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getCangguVenues, toCangguPlaceCard } from "@/lib/canggu";
import { CANGGU_GUIDES, type CangguGuide } from "@/lib/canggu-guides";
import { serializeJsonLd } from "@/lib/json-ld";

const BASE = "https://www.otherbali.com";

export default async function CangguGuideView({ guide }: { guide: CangguGuide }) {
  const venues = (await getCangguVenues()).filter(guide.base);
  const groups = guide.groups
    .map((g) => ({ g, items: venues.filter(g.match) }))
    .filter((x) => x.items.length > 0);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Canggu", href: "/canggu" },
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
    { href: "/canggu", title: "The Canggu guide", blurb: "Areas, decisions and how to plan a day." },
    ...CANGGU_GUIDES.filter((g) => g.slug !== guide.slug).map((g) => ({
      href: `/canggu/${g.slug}`,
      title: g.h1,
      blurb: g.lede,
    })),
  ];

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug={`canggu/${guide.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Canggu</p>
          <h1 className="hero-title mt-2">{guide.h1}</h1>
          <p className="hero-copy">{guide.lede}</p>
        </header>

        {groups.length > 1 && (
          <nav className="mt-6 flex flex-wrap gap-2" aria-label="Quick picks">
            {groups.map(({ g }) => (
              <a key={g.key} href={`#${g.key}`} className="chip">{g.heading}</a>
            ))}
          </nav>
        )}

        {groups.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--muted)]">
            We&apos;re still verifying picks for this list. Meanwhile, browse the{" "}
            <a href="/canggu" className="quiet-link">Canggu guide</a>.
          </p>
        ) : (
          groups.map(({ g, items }) => (
            <section key={g.key} id={g.key} className="guide-section scroll-mt-8">
              <h2>{g.heading}</h2>
              <p className="text-sm text-[var(--muted)]">{g.note}</p>
              <div className="pick-grid" style={{ marginTop: 16 }}>
                {items.map((v) => (
                  <PlaceCard key={v.slug} place={toCangguPlaceCard(v)} />
                ))}
              </div>
            </section>
          ))
        )}

        <FaqBlock items={guide.faq} />
        <RelatedGuides links={related} />
        <GuideFooter />
      </main>
    </div>
  );
}
