import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import { getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { getGuide, guideMetadata } from "@/lib/guides";

// ISR: statically cached for speed/SEO, regenerated at most every 5 min so
// venue/publication edits in Supabase surface without a redeploy. Build-safe
// now that public reads degrade instead of throwing (lib/data.ts).
export const revalidate = 300;

const BASE = "https://www.otherbali.com";
const guide = getGuide("best-spas-in-bali")!;
export const metadata = guideMetadata(guide);

const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "ubud", name: "Ubud", note: "Bali's wellness capital — healing spas, Ayurveda, yoga and sound in the hills.", pillar: "/ubud" },
  { key: "seminyak", name: "Seminyak", note: "The polished spa strip — day spas, massage and beauty a short walk apart.", pillar: "/seminyak" },
  { key: "canggu", name: "Canggu", note: "Recovery after surf and board — massage, sauna and modern wellness studios.", pillar: "/canggu" },
  { key: "sanur", name: "Sanur", note: "Calm, unhurried spa time on the quiet east coast.", pillar: "/sanur" },
  { key: "nusa-dua", name: "Nusa Dua", note: "Big resort spas and signature treatments in the gated south.", pillar: "/nusa-dua" },
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "Clifftop and resort spas to unwind after a surf day.", pillar: "/uluwatu" },
];

const FAQ = [
  { q: "Where are the best spas in Bali?", a: "Ubud is the wellness capital — healing spas, Ayurveda and yoga. Seminyak has the polished day-spa strip, and every coastal area has strong massage and recovery options. The picks above are sorted by area." },
  { q: "How much does a massage cost in Bali?", a: "Prices span a wide band — simple local massages are very affordable, while resort and signature spa treatments cost more. Each venue's page shows its price band." },
  { q: "Do I need to book a spa in Bali?", a: "For the popular day spas and resort treatments, booking ahead secures your slot, especially in high season. Smaller massage places often take walk-ins." },
  { q: "Which area is best for a wellness trip?", a: "Ubud — it's built around yoga, healing and slow mornings, with the deepest cluster of wellness venues on the island." },
];

export default async function BestSpasPage() {
  const all = await getPublishedVenues();
  const spas = all.filter((v) => v.category === "spa" && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: spas.filter((v) => v.district === area.key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Best spas in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Bali spas and wellness",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best spas & wellness in Bali",
      itemListElement: byArea
        .flatMap((a) => a.venues)
        .map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.name, url: `${BASE}/places/${v.slug}` })),
    },
  ];

  return (
    <div>
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">{guide.title}</h1>
          <p className="guide-lede">
            Wellness is one of Bali&apos;s great strengths. Ubud is the healing
            capital — Ayurveda, yoga and sound in the hills — while Seminyak has
            the polished day-spa strip and every coastal area has serious massage
            and recovery. Here are the spas we stand behind, by area — tap any for
            the details.
          </p>
          <GuideHeroMedia seed="best spas in bali ubud wellness" />
        </header>

        {byArea.map((area, index) => (
          <section key={area.key} className="guide-section">
            <div className="flex items-baseline justify-between gap-4">
              <h2>{area.name}</h2>
              {area.pillar ? (
                <Link href={area.pillar} className="quiet-link">
                  Area guide →
                </Link>
              ) : null}
            </div>
            <GuideSectionMedia seed={`best spas ${area.key} ${area.name}`} index={index} />
            <p className="text-sm leading-relaxed text-[var(--muted)]">{area.note}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {area.venues.map((v) => (
                <li key={v.slug}>
                  <Link href={`/places/${v.slug}`} className="font-semibold text-[var(--ink)]">
                    {v.name}
                  </Link>
                  {v.area ? <span className="text-[var(--muted)]"> · {v.area}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <FaqBlock items={FAQ} heading="Good to know" />

        <RelatedGuides
          heading="Keep planning"
          links={[
            { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
            { href: "/ubud/best-yoga-wellness", title: "Best yoga & wellness in Ubud", blurb: "Studios, healing and sound in the hills." },
            { href: "/seminyak", title: "The Seminyak guide", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
