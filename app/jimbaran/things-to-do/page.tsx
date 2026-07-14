import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { JIMBARAN_REVIEW_DATE, JIMBARAN_THINGS_TO_DO } from "@/lib/jimbaran/content";

export const metadata: Metadata = {
  title: "Best things to do in Jimbaran — beyond the seafood dinner",
  description:
    "Jimbaran is more than grilled seafood: the Kedonganan fish market, Tegal Wangi's hidden tide pools, a swim and sunset at Muaya, the cliff-base Rock Bar, and the GWK Cultural Park.",
  alternates: { canonical: "/jimbaran/things-to-do" },
  openGraph: {
    title: "Best things to do in Jimbaran · Other Bali",
    description:
      "The fish market, Tegal Wangi tide pools, Muaya sunset, Rock Bar and GWK Cultural Park.",
    url: "https://www.otherbali.com/jimbaran/things-to-do",
    type: "article",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best things to do in Jimbaran, Bali",
    numberOfItems: JIMBARAN_THINGS_TO_DO.length,
    itemListElement: JIMBARAN_THINGS_TO_DO.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
    })),
  },
];

export default function JimbaranThingsToDoPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="jimbaran/things-to-do" />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Jimbaran", href: "/jimbaran" },
            { name: "Things to do" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Jimbaran · What to do</p>
          <h1 className="guide-title">Best things to do in Jimbaran</h1>
          <p className="guide-standfirst">
            Jimbaran is famous for one dinner, but there&apos;s a real day or two
            around it: a working fish market at dawn, a hidden cove with natural
            tide pools, a calm swimming bay, a cliff-base sunset bar and a giant
            cultural park up the hill. Calm, west-facing, family-easy.
          </p>
          <p className="guide-meta-line">Editorial review: {JIMBARAN_REVIEW_DATE}</p>
        </header>

        <section className="guide-section">
          <div className="guide-prose">
            {JIMBARAN_THINGS_TO_DO.map((t) => (
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
              One easy day: the Kedonganan fish market early, a calm swim at Muaya,
              Tegal Wangi&apos;s tide pools at low tide, then seafood on the sand at
              sunset. Add time: the Rock Bar for sundowners, the GWK Cultural Park
              and its evening Kecak up in Ungasan, and the village temple Pura Ulun
              Siwi. Low-key by design — that&apos;s the bay&apos;s appeal.
            </p>
          </div>
        </section>

        <RelatedGuides
          links={[
            {
              href: "/jimbaran",
              title: "The Jimbaran guide",
              blurb: "Who it suits, the beaches, and how to use it as a base.",
            },
            {
              href: "/jimbaran/best-restaurants",
              title: "Best restaurants in Jimbaran",
              blurb: "Bay seafood grills, sunset bars and resort fine dining.",
            },
            {
              href: "/jimbaran/spas-wellness",
              title: "Best spas & wellness in Jimbaran",
              blurb: "Cliff-top resort spas, plus fitness and yoga.",
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
