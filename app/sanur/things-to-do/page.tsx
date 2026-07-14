import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { SANUR_REVIEW_DATE, SANUR_THINGS_TO_DO } from "@/lib/sanur/content";
import { serializeJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Best things to do in Sanur — beyond sitting at the hotel",
  description:
    "Sanur is built for good mornings and easy movement: a sunrise beach walk, the 5 km promenade, tide-timed swimming, Le Mayeur Museum, Mertasari, and the Nusa fast-boat gateway.",
  alternates: { canonical: "/sanur/things-to-do" },
  openGraph: {
    title: "Best things to do in Sanur · Other Bali",
    description:
      "Sunrise walks, the beach path, calm-water activities, and the boat gateway — Sanur at its low-stress best.",
    url: "https://www.otherbali.com/sanur/things-to-do",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best things to do in Sanur, Bali",
    numberOfItems: SANUR_THINGS_TO_DO.length,
    itemListElement: SANUR_THINGS_TO_DO.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
    })),
  },
];

export default function SanurThingsToDoPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="sanur/things-to-do" />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Sanur", href: "/sanur" },
            { name: "Things to do" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Sanur · What to do</p>
          <h1 className="guide-title">Best things to do in Sanur</h1>
          <p className="guide-standfirst">
            The best things to do in Sanur are not the loudest things to do in
            Bali. This is a place for good mornings, easy movement and low-key
            days — try to turn it into a nightlife district and you&apos;ll miss
            what it&apos;s actually good at.
          </p>
          <p className="guide-meta-line">Editorial review: {SANUR_REVIEW_DATE}</p>
        </header>

        <section className="guide-section">
          <div className="guide-prose">
            {SANUR_THINGS_TO_DO.map((t) => (
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
              One full day: sunrise walk, long breakfast, the Le Mayeur museum
              or a beach-path cycle, a tide-timed swim, easy dinner. Two or three
              days: add Mertasari, one calm-water activity, and a harbour
              departure to the Nusa islands. Not hectic, not flashy — just easy
              to enjoy.
            </p>
          </div>
        </section>

        <RelatedGuides
          links={[
            {
              href: "/sanur",
              title: "The Sanur guide",
              blurb: "Who Sanur suits, the three stay zones, and how to use it as a base.",
            },
            {
              href: "/sanur/best-hotels",
              title: "Best hotels in Sanur",
              blurb: "Beachfront classics by zone and travel style.",
            },
          ]}
        />

        <GuideFooter />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
    </div>
  );
}
