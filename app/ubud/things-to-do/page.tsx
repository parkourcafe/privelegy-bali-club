import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { FaqBlock, GuideFooter, RelatedGuides } from "@/components/GuideBlocks";
import { UBUD_REVIEW_DATE, UBUD_THINGS_TO_DO } from "@/lib/ubud-things";
import { serializeJsonLd } from "@/lib/json-ld";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Best things to do in Ubud — temples, rice terraces & jungle",
  description:
    "The best things to do in Ubud: the Campuhan Ridge walk, the Monkey Forest, Tegallalang rice terraces, temples, waterfalls, art museums, dance and yoga. What to see and when to go.",
  alternates: { canonical: "/ubud/things-to-do" },
  openGraph: {
    title: "Best things to do in Ubud · Other Bali",
    description:
      "Ridge walks, the Monkey Forest, rice terraces, temples, waterfalls, art and yoga — Ubud's culture-and-nature highlights.",
    url: `${BASE}/ubud/things-to-do`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best things to do in Ubud · Other Bali",
    description: "Ridge walks, Monkey Forest, rice terraces, temples, waterfalls, art and yoga.",
  },
};

const FAQ = [
  { q: "What is Ubud best known for?", a: "Culture and nature: rice terraces, temples, the Monkey Forest, Balinese art and dance, waterfalls, and a deep yoga-and-wellness scene — all in cooler, greener hills inland from the coast." },
  { q: "How many days do you need in Ubud?", a: "Two or three days covers the highlights comfortably — a ridge walk, the Monkey Forest and a temple, a rice-terrace morning, a waterfall, and an evening dance performance, with time to rest." },
  { q: "Is there a beach in Ubud?", a: "No — Ubud is inland, about an hour from the coast. Most travellers pair it with a beach area like Canggu or Sanur." },
  { q: "What's the best free thing to do in Ubud?", a: "The Campuhan Ridge Walk — an easy, scenic paved path between two river valleys, best at sunrise or late afternoon when it's cooler." },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best things to do in Ubud",
    description: metadata.description,
    url: `${BASE}/ubud/things-to-do`,
    about: "Things to do in Ubud",
    isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best things to do in Ubud, Bali",
    numberOfItems: UBUD_THINGS_TO_DO.length,
    itemListElement: UBUD_THINGS_TO_DO.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
    })),
  },
  // FAQPage is emitted by the visible FaqBlock below (kept in sync with content).
];

export default function UbudThingsToDoPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="ubud/things-to-do" />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Ubud", href: "/ubud" },
            { name: "Things to do" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Ubud · What to do</p>
          <h1 className="guide-title">Best things to do in Ubud</h1>
          <p className="guide-standfirst">
            Ubud is Bali&apos;s culture-and-nature heart: rice terraces, temples,
            the Monkey Forest, art and a deep wellness scene, all in cooler, greener
            hills. Go early for the big sights — mornings beat both the heat and
            the tour buses.
          </p>
          <p className="guide-meta-line">Editorial review: {UBUD_REVIEW_DATE}</p>
        </header>

        <section className="guide-section">
          <div className="guide-prose">
            {UBUD_THINGS_TO_DO.map((t) => (
              <div key={t.title} className="mt-6">
                <h2 className="!mt-0">
                  {t.mapsUrl ? (
                    <a href={t.mapsUrl} target="_blank" rel="noreferrer" className="text-[var(--lagoon-strong)]">
                      {t.title}
                    </a>
                  ) : (
                    t.title
                  )}
                </h2>
                <p className="text-sm font-semibold text-[var(--muted)]">{t.area}</p>
                <p className="mt-1">{t.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>The short version</h2>
          <div className="guide-prose">
            <p>
              One full day: a sunrise Campuhan Ridge walk, breakfast in town, the
              Monkey Forest and Saraswati Temple, a rice-terrace afternoon, and an
              evening dance performance at the palace. Two or three days: add a
              waterfall, an art museum, and a yoga or cooking class. Ubud rewards a
              slower pace — don&apos;t try to cram it.
            </p>
          </div>
        </section>

        <FaqBlock items={FAQ} heading="Good to know" />

        <RelatedGuides
          links={[
            { href: "/ubud", title: "The Ubud guide", blurb: "Where to eat, stay and slow down in Ubud." },
            { href: "/ubud/best-yoga-wellness", title: "Best yoga & wellness in Ubud", blurb: "Studios, healing and sound in the hills." },
            { href: "/ubud/best-restaurants", title: "Best restaurants in Ubud", blurb: "Long slow dinners, sorted by the evening you want." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
          ]}
        />

        <GuideFooter />
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </div>
  );
}
