import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getLightDistrict, LIGHT_DISTRICT_REVIEW_DATE } from "@/lib/light-districts";

const BASE = "https://www.otherbali.com";

// Shared renderer for the lightweight editorial district landings (Sidemen,
// Amed, Munduk, Lovina). One component so the four thin routes stay identical
// in structure and can't drift; all copy comes from lib/light-districts.ts.
// These are planning_only areas — no venue grid, no perks/QR/booking (§4). The
// value is unique editorial + fit-context, which is why a hand-crafted landing
// is legitimate where a thin programmatic hub would not be.
export default function LightDistrictLanding({ slug }: { slug: string }) {
  const d = getLightDistrict(slug);
  if (!d) return null;

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Bali", href: "/bali" },
    { name: d.name },
  ];

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
        <PageViewTracker event="district_page_view" slug={slug} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">{d.tagline}</p>
          <h1 className="hero-title mt-2">{d.title}</h1>
          <p className="hero-copy">{d.intro}</p>
          <p className="guide-meta-line">
            Editorial review: {LIGHT_DISTRICT_REVIEW_DATE} · researched, not sponsored · no paid ranking
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/bali" className="button-secondary button-large">Explore more of Bali by district →</Link>
          </div>
        </header>

        <section className="guide-section">
          <h2>Who {d.name} suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> {d.suits}
            </p>
            <p>
              <strong>It frustrates</strong> {d.frustrates}
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>What {d.name} is known for</h2>
          <ul className="guide-prose">
            {d.knownFor.map((t) => (
              <li key={t.title}>
                <strong>
                  {t.mapsUrl ? (
                    <a href={t.mapsUrl} target="_blank" rel="noopener noreferrer">{t.title}</a>
                  ) : (
                    t.title
                  )}
                  .
                </strong>{" "}
                {t.blurb}
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              {d.practical.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        <FaqBlock items={d.faq} />

        <RelatedGuides links={d.related} />

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict(slug)} />

        <GuideFooter />
      </main>
    </div>
  );
}
