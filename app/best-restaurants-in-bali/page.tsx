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
const guide = getGuide("best-restaurants-in-bali")!;
export const metadata = guideMetadata(guide);

const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "canggu", name: "Canggu", note: "Bali's densest dinner scene — beach-side seafood, buzzy international kitchens and long tables along Batu Bolong and Berawa.", pillar: "/canggu" },
  { key: "seminyak", name: "Seminyak", note: "The polished dining strip — Bali's original fine-dining and long-lunch address, walkable between the boutiques.", pillar: "/seminyak" },
  { key: "ubud", name: "Ubud", note: "Jungle-view tables, plant-forward kitchens and slow, candle-lit dinners in the hills.", pillar: "/ubud" },
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "Clifftop restaurants and sunset dinners above the surf on the southern peninsula.", pillar: "/uluwatu" },
  { key: "jimbaran", name: "Jimbaran", note: "Grilled seafood on the sand — the classic Jimbaran Bay dinner as the sun goes down.", pillar: "/jimbaran" },
  { key: "sanur", name: "Sanur", note: "Easy-going seafront dining on the calm, unhurried east coast.", pillar: "/sanur" },
  { key: "nusa-dua", name: "Nusa Dua", note: "Resort fine dining and signature restaurants in the gated south.", pillar: "/nusa-dua" },
  { key: "denpasar", name: "Denpasar", note: "The city's own tables — where residents eat, from Balinese ayam betutu specialists to long-running local institutions off the tourist strip.", pillar: undefined },
];

const FAQ = [
  { q: "Where are the best restaurants in Bali?", a: "Canggu has the island's densest and most varied dinner scene, Seminyak the polished fine-dining strip, and Ubud the jungle-view and plant-forward kitchens. Jimbaran is the classic for grilled seafood on the sand, and Uluwatu for clifftop sunset dinners. The picks above are sorted by area." },
  { q: "How much does dinner cost in Bali?", a: "It spans a wide band — a local warung meal is very cheap, while a Western restaurant or a fine-dining tasting menu costs much more. Each venue's page shows its price band; for the cheapest authentic food, see our best warungs guide." },
  { q: "Do you need to book restaurants in Bali?", a: "For the popular dinner spots and sunset tables — especially in Seminyak, Canggu and Uluwatu, and in the July–August peak — booking ahead is worth it. Casual places and warungs usually take walk-ins." },
  { q: "Which area has the best food in Bali?", a: "For sheer choice and quality, Canggu and Seminyak lead. Ubud is strongest for healthy and vegetarian dining, and Jimbaran for seafood. It depends on the night you want." },
];

export default async function BestRestaurantsPage() {
  const all = await getPublishedVenues();
  const restaurants = all.filter((v) => v.category === "restaurant" && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: restaurants.filter((v) => v.district === area.key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Best restaurants in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Bali restaurants and dining",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best restaurants in Bali",
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
            Bali eats extraordinarily well. Canggu and Seminyak carry the island&apos;s
            densest dinner scenes, Ubud the jungle-view and plant-forward kitchens,
            and Jimbaran the classic grilled seafood on the sand. Here are the
            restaurants we stand behind, by area — tap any for the details.
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
            { href: "/best-cafes-in-bali", title: "The best cafés in Bali", blurb: "Brunch, specialty coffee and laptop-friendly spots." },
            { href: "/best-warungs-in-bali", title: "The best warungs in Bali", blurb: "Cheap, authentic local food, district by district." },
            { href: "/best-beach-clubs-in-bali", title: "The best beach clubs in Bali", blurb: "Sunset tables and long lazy days by the sea." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
