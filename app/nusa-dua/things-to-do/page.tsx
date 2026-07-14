import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { NUSA_DUA_REVIEW_DATE, NUSA_DUA_THINGS_TO_DO } from "@/lib/nusa-dua/content";

export const metadata: Metadata = {
  title: "Best things to do in Nusa Dua — beyond the resort pool",
  description:
    "Nusa Dua is more than a resort strip: the 5 km beach promenade, the Water Blow, Geger Beach and its clifftop temple, Museum Pasifika, the Devdan Show and Tanjung Benoa watersports.",
  alternates: { canonical: "/nusa-dua/things-to-do" },
  openGraph: {
    title: "Best things to do in Nusa Dua · Other Bali",
    description:
      "The promenade, Water Blow, Geger Beach, Museum Pasifika, the Devdan Show and Tanjung Benoa watersports.",
    url: "https://www.otherbali.com/nusa-dua/things-to-do",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best things to do in Nusa Dua, Bali",
    numberOfItems: NUSA_DUA_THINGS_TO_DO.length,
    itemListElement: NUSA_DUA_THINGS_TO_DO.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
    })),
  },
];

export default function NusaDuaThingsToDoPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="nusa-dua/things-to-do" />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Nusa Dua", href: "/nusa-dua" },
            { name: "Things to do" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Nusa Dua · What to do</p>
          <h1 className="guide-title">Best things to do in Nusa Dua</h1>
          <p className="guide-standfirst">
            Nusa Dua reads as a resort strip, but there&apos;s a real half-day or
            two out here: a walkable seafront, a natural coastal spectacle, a
            clifftop temple, a serious art museum, an evening show and the
            watersports peninsula next door. Calm, easy, family-safe — the enclave
            at its best.
          </p>
          <p className="guide-meta-line">Editorial review: {NUSA_DUA_REVIEW_DATE}</p>
        </header>

        <section className="guide-section">
          <div className="guide-prose">
            {NUSA_DUA_THINGS_TO_DO.map((t) => (
              <div key={t.title} className="mt-6">
                <h2 className="!mt-0">
                  {t.mapsUrl ? (
                    <a
                      href={t.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--lagoon-strong)]"
                    >
                      {t.title}
                    </a>
                  ) : (
                    t.title
                  )}
                </h2>
                <p className="text-sm font-semibold text-[var(--muted)]">{t.zone}</p>
                <p className="mt-1">{t.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>The short version</h2>
          <div className="guide-prose">
            <p>
              One easy day: a morning on the promenade and Mengiat Beach, the
              Water Blow, and Museum Pasifika at the Bali Collection, with the
              Devdan Show in the evening. Add a day: a calmer beach morning at
              Geger and its temple, then a watersports session or the glass-bottom
              boat to Turtle Island over at Tanjung Benoa. Low-adrenaline by
              design — that&apos;s the point of Nusa Dua.
            </p>
          </div>
        </section>

        <RelatedGuides
          links={[
            {
              href: "/nusa-dua",
              title: "The Nusa Dua guide",
              blurb: "Who it suits, the beach zones, and how to use it as a base.",
            },
            {
              href: "/nusa-dua/best-restaurants",
              title: "Best restaurants in Nusa Dua",
              blurb: "Resort fine dining, beachfront tables and a few local spots.",
            },
            {
              href: "/nusa-dua/spas-wellness",
              title: "Best spas & wellness in Nusa Dua",
              blurb: "Some of Bali's biggest resort spas, plus fitness and yoga.",
            },
          ]}
        />

        <GuideFooter />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
