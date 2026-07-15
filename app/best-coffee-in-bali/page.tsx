import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { getGuide, guideMetadata } from "@/lib/guides";

// ISR: statically cached for speed/SEO, regenerated at most every 5 min so
// venue/publication edits in Supabase surface without a redeploy. Build-safe
// now that public reads degrade instead of throwing (lib/data.ts).
export const revalidate = 300;

const BASE = "https://www.otherbali.com";
const guide = getGuide("best-coffee-in-bali")!;
export const metadata = guideMetadata(guide);

// Curated specialty-coffee shortlist (roasters and coffee-forward cafés), not
// every café — "coffee" isn't a catalogue category, so the picks are editorial.
// The links themselves resolve from live data (only indexable venues render).
const COFFEE_SLUGS = new Set([
  "revolver-canggu",
  "crate-cafe",
  "revolver-seminyak",
  "seniman-coffee-studio",
  "anomali-coffee-ubud",
  "suka-espresso",
  "bgs-uluwatu",
]);

const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "canggu", name: "Canggu", note: "Bali's specialty-coffee heartland — pioneering roasters and laptop-friendly cafés a short ride apart.", pillar: "/canggu" },
  { key: "seminyak", name: "Seminyak", note: "Where Bali's third-wave coffee scene got started, tucked off the Oberoi strip.", pillar: "/seminyak" },
  { key: "ubud", name: "Ubud", note: "Origin-focused roasters treating Indonesian beans as the craft, in a calmer setting.", pillar: "/ubud" },
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "Strong coffee to fuel a surf day, from the Bukit's better cafés.", pillar: "/uluwatu" },
];

const FAQ = [
  { q: "Where is the best coffee in Bali?", a: "Canggu is the specialty-coffee heartland, with pioneering roasters like Revolver and Crate. Ubud has origin-focused roasters such as Seniman, and Seminyak and Uluwatu have strong cafés too." },
  { q: "Does Bali have good specialty coffee?", a: "Yes — Bali has a deep third-wave scene, with local roasters sourcing and roasting Indonesian single-origin beans and pouring espresso and filter to a high standard." },
  { q: "Where can I buy Bali coffee beans to take home?", a: "Several of the roasters below sell their own beans by the bag to take home. Ask at the counter — most roast locally and stock retail bags." },
  { q: "Is Bali coffee the same as Kopi Luwak?", a: "No. The specialty scene here is about ethically sourced, locally roasted single-origin beans and skilled brewing — not the novelty Kopi Luwak (civet coffee) sold to tourists." },
];

export default async function BestCoffeePage() {
  const all = await getPublishedVenues();
  const picks = all.filter((v) => COFFEE_SLUGS.has(v.slug) && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: picks
      .filter((v) => v.district === area.key)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Best coffee in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Specialty coffee in Bali",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best specialty coffee in Bali",
      itemListElement: byArea
        .flatMap((a) => a.venues)
        .map((v, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: v.name,
          url: `${BASE}/places/${v.slug}`,
        })),
    },
  ];

  return (
    <div>
      <main className="site-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">{guide.title}</h1>
          <p className="guide-lede">
            Bali takes coffee seriously. Canggu is the heartland of the island&apos;s
            specialty scene, with local roasters and laptop-friendly cafés; Ubud
            has the origin-focused roasters, and Seminyak and Uluwatu hold their
            own. Here are the coffee-forward spots we stand behind — the ones
            roasting and pouring with real care, by area.
          </p>
        </header>

        {byArea.map((area) => (
          <section key={area.key} className="guide-section">
            <div className="flex items-baseline justify-between gap-4">
              <h2>{area.name}</h2>
              {area.pillar ? (
                <Link href={area.pillar} className="quiet-link">
                  Area guide →
                </Link>
              ) : null}
            </div>
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
            { href: "/canggu/work-friendly-cafes", title: "Work-friendly cafés in Canggu", blurb: "Wifi, sockets and a seat that lasts." },
            { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
            { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, slow dinners." },
            { href: "/bali-for-digital-nomads", title: "Bali for digital nomads", blurb: "Where to live, work and caffeinate." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
