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
const guide = getGuide("best-cafes-in-bali")!;
export const metadata = guideMetadata(guide);

const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "canggu", name: "Canggu", note: "Bali's café capital — laptop-friendly brunch spots, specialty roasters and all-day breakfast on nearly every corner.", pillar: "/canggu" },
  { key: "ubud", name: "Ubud", note: "Health-food cafés, smoothie bowls and jungle-view breakfasts in the cool hills.", pillar: "/ubud" },
  { key: "seminyak", name: "Seminyak", note: "Polished all-day cafés and considered brunch between the boutiques.", pillar: "/seminyak" },
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "Surf-and-coffee cafés and clifftop breakfast spots between sessions.", pillar: "/uluwatu" },
  { key: "sanur", name: "Sanur", note: "Relaxed seafront cafés for a slow, sunny morning on the east coast.", pillar: "/sanur" },
  { key: "jimbaran", name: "Jimbaran", note: "Easy neighbourhood cafés and breakfast near the bay.", pillar: "/jimbaran" },
  { key: "nusa-dua", name: "Nusa Dua", note: "Calm coffee stops around the resort south.", pillar: "/nusa-dua" },
];

const FAQ = [
  { q: "Where are the best cafés in Bali?", a: "Canggu is the island's café capital — laptop-friendly brunch spots and specialty roasters everywhere. Ubud is strongest for health-food and smoothie-bowl cafés, and Seminyak for polished all-day spots. The picks above are sorted by area." },
  { q: "Which area is best for café work?", a: "Canggu — it's Bali's digital-nomad hub, with the deepest cluster of laptop-friendly cafés (power, wifi, all-day seating). See our work-friendly cafés in Canggu guide for the specific spots." },
  { q: "Where is the best brunch in Bali?", a: "Canggu and Seminyak have the biggest brunch scenes — smoothie bowls, big breakfasts and specialty coffee — while Ubud leans healthy and plant-forward. Most open early and run through midday." },
  { q: "Do Bali cafés have good coffee?", a: "Yes — Bali has a serious specialty-coffee scene with local roasters and skilled baristas, strongest in Canggu, Ubud and Seminyak. For the coffee-first spots specifically, see our best specialty coffee in Bali guide." },
];

export default async function BestCafesPage() {
  const all = await getPublishedVenues();
  const cafes = all.filter((v) => v.category === "cafe" && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: cafes.filter((v) => v.district === area.key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Best cafés in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Bali cafés, brunch and coffee",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best cafés in Bali",
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
            Café culture is one of Bali&apos;s great pleasures. Canggu is the
            capital — brunch spots and specialty roasters on every corner — while
            Ubud leans healthy and jungle-green and Seminyak stays polished. Here
            are the cafés we stand behind, by area — tap any for the details.
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
            { href: "/best-coffee-in-bali", title: "The best specialty coffee in Bali", blurb: "The roasters and coffee-first cafés." },
            { href: "/best-restaurants-in-bali", title: "The best restaurants in Bali", blurb: "Where to eat well, area by area." },
            { href: "/canggu/work-friendly-cafes", title: "Work-friendly cafés in Canggu", blurb: "Wifi, sockets and a seat that lasts." },
            { href: "/bali-for-digital-nomads", title: "Bali for digital nomads", blurb: "Where to live, work and eat." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
