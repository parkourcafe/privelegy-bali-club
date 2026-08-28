import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import { getCangguVenues, toCangguPlaceCard } from "@/lib/canggu";
import { CANGGU_GUIDES, type CangguGuide } from "@/lib/canggu-guides";
import { publicVenueVerifiedAt } from "@/lib/venue-completeness";
import EditorialFreshness from "@/components/EditorialFreshness";
import { staticLastModified } from "@/lib/seo/sitemap-last-modified";

const BASE = "https://www.otherbali.com";

export default async function CangguGuideView({ guide }: { guide: CangguGuide }) {
  const lastModified = staticLastModified(`/canggu/${guide.slug}`);
  const venues = (await getCangguVenues()).filter(guide.base);
  const groups = guide.groups
    .map((g) => ({ g, items: venues.filter(g.match) }))
    .filter((x) => x.items.length > 0);

  // The answer block only ever promises venues this page actually renders, so
  // an unpublished or re-jobbed place drops out of the copy by itself.
  const shown = new Map(groups.flatMap(({ items }) => items).map((v) => [v.slug, v]));
  const answerPicks = guide.answer?.picks.filter((p) => shown.has(p.slug)) ?? [];

  // Freshness is the newest evidence date we actually hold on the venues on
  // this page — never a build or deploy timestamp (§13). Same validity policy
  // as the venue card, so a malformed row cannot date the page.
  const lastChecked = [...shown.values()]
    .map((v) => publicVenueVerifiedAt({ venueVerifiedAt: v.lastVerifiedAt }))
    .filter((d): d is string => Boolean(d))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .at(-1);

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
        ...(lastModified ? { dateModified: lastModified } : {}),
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Canggu</p>
          <h1 className="hero-title mt-2">{guide.h1}</h1>
          <p className="hero-copy">{guide.lede}</p>
          <EditorialFreshness date={lastModified} />
          <GuideHeroMedia seed={`canggu ${guide.slug} ${guide.h1}`} />
        </header>

        {answerPicks.length > 0 && (
          <section className="guide-answer" aria-labelledby="short-answer">
            <h2 id="short-answer">Short answer</h2>
            <dl className="guide-answer-picks">
              {answerPicks.map((pick) => (
                <div key={pick.slug}>
                  <dt>{pick.want}</dt>
                  <dd>
                    <a href={`/places/${pick.slug}`}>{shown.get(pick.slug)!.name}</a>
                    {" — "}
                    {pick.why}
                  </dd>
                </div>
              ))}
            </dl>
            {guide.answer?.facts.map((fact) => (
              <p key={fact} className="guide-answer-fact">{fact}</p>
            ))}
            <p className="guide-answer-trust">
              {shown.size} {shown.size === 1 ? "place" : "places"}, chosen by us and checked on
              the record. Nobody can pay to be on this list or to sit higher on it.
              {lastChecked
                ? ` Last checked ${new Date(lastChecked).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}.`
                : ""}
            </p>
          </section>
        )}

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
          groups.map(({ g, items }, groupIndex) => (
            <section key={g.key} id={g.key} className="guide-section scroll-mt-8">
              <h2>{g.heading}</h2>
              <GuideSectionMedia seed={`canggu ${guide.slug} ${g.heading}`} index={groupIndex} />
              <p className="text-sm text-[var(--muted)]">{g.note}</p>
              <div className="pick-grid" style={{ marginTop: 16 }}>
                {items.map((v, itemIndex) => (
                  <PlaceCard
                    key={v.slug}
                    place={toCangguPlaceCard(v)}
                    priority={groupIndex === 0 && itemIndex === 0}
                  />
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
