import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { getGuide, guideMetadata } from "@/lib/guides";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";
const guide = getGuide("best-warungs-in-bali")!;
export const metadata = guideMetadata(guide);

// A warung / local eatery: keyed as `warung`, or named warung / babi guling.
// Excludes the resort restaurant "The Warung at Alila" (a false positive).
function isWarung(v: { slug: string; category: string; name: string }): boolean {
  if (v.slug === "the-warung-at-alila-villas-uluwatu") return false;
  return v.category === "warung" || /\bwarung\b/i.test(v.name) || /babi\s?guling/i.test(v.name);
}

const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "canggu", name: "Canggu", note: "Nasi campur stalls and babi guling around Batu Bolong, Berawa and Pererenan.", pillar: "/canggu/best-warungs" },
  { key: "ubud", name: "Ubud", note: "Home-style and vegetarian warungs in Bali's culture capital.", pillar: "/ubud/best-warungs" },
  { key: "seminyak", name: "Seminyak", note: "Local plates tucked off the polished dining strip.", pillar: "/seminyak" },
  { key: "sanur", name: "Sanur", note: "Easy, walkable local eateries on the calm east coast.", pillar: "/sanur" },
  { key: "jimbaran", name: "Jimbaran", note: "Beachside ikan bakar (grilled-fish) warungs.", pillar: undefined },
  { key: "nusa-dua", name: "Nusa Dua", note: "Bualu-village babi guling and local plates outside the resort gates.", pillar: "/nusa-dua" },
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "Village warungs inland from the surf beaches.", pillar: "/uluwatu" },
];

const FAQ = [
  { q: "What is a warung?", a: "A warung is a small, family-run Indonesian eatery serving affordable local food — nasi campur (build-your-own mixed rice), satay, and daily home-style dishes. They're the backbone of everyday eating in Bali." },
  { q: "Where is the best local food in Bali?", a: "Every district has its warungs — Canggu and Ubud have the deepest clusters, and each area has its own specialities. The picks here are sorted by district." },
  { q: "Is warung food cheap?", a: "Yes — warungs are among the best value in Bali, with generous plates for a fraction of café or restaurant prices." },
  { q: "What is babi guling?", a: "Babi guling is Balinese roast suckling pig, served with rice, crispy crackling, lawar and sambal — a local celebration dish and a hearty, affordable warung plate." },
];

export default async function BestWarungsPage() {
  const all = await getPublishedVenues();
  const warungs = all.filter((v) => isWarung(v) && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: warungs.filter((v) => v.district === area.key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Best warungs in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Warungs and local food in Bali",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best warungs & local food in Bali",
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
            The best food in Bali is often the cheapest. Warungs — small,
            family-run local eateries — serve nasi campur, babi guling and
            home-style Balinese and Indonesian plates for a fraction of café
            prices. Here are the ones we stand behind, district by district.
          </p>
        </header>

        {byArea.map((area) => (
          <section key={area.key} className="guide-section">
            <div className="flex items-baseline justify-between gap-4">
              <h2>{area.name}</h2>
              {area.pillar ? (
                <Link href={area.pillar} className="quiet-link">
                  {area.pillar.includes("best-warungs") ? "All local food →" : "Area guide →"}
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
            { href: "/canggu/best-warungs", title: "Best warungs in Canggu", blurb: "Nasi campur and babi guling, by dish." },
            { href: "/ubud/best-warungs", title: "Best warungs in Ubud", blurb: "Home-style and vegetarian local plates." },
            { href: "/bali-on-a-budget", title: "Bali on a budget", blurb: "How to keep costs low, warungs included." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
