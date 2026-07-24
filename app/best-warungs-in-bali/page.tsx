import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getPublishedVenues, type VenueWithPerk } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { getGuide, guideMetadata } from "@/lib/guides";
import { COLLECTIONS, blobOf, liveCollectionSlugs } from "@/lib/collections";

// Taste sub-groups within each area (same reorg as best-restaurants-in-bali,
// 2026-07-20). Excludes "balinese-and-local-food" -- its match() includes
// category==='warung' as a blanket clause, which would swallow every single
// item on THIS page (every item here already IS a warung) into one
// tautological bucket. The remaining taste collections (seafood, vegetarian,
// Japanese, desserts) still meaningfully split warungs by what they actually
// serve; anything matching none lands in "More warungs" rather than force-fit.
const TASTE_COLLECTIONS = COLLECTIONS.filter(
  (c) => c.kind === "taste" && c.slug !== "balinese-and-local-food",
);
function tasteGroupFor(v: VenueWithPerk): string | null {
  const blob = blobOf(v);
  const hit = TASTE_COLLECTIONS.find((c) => c.match(blob, v));
  return hit?.slug ?? null;
}

// Shared list-item markup — used for both taste groups and the residual
// bucket, so the whatToOrder subline (a DB fact, guardrail #10) isn't
// triplicated.
function VenueLi({ v }: { v: VenueWithPerk }) {
  return (
    <li>
      <Link href={`/places/${v.slug}`} className="font-semibold text-[var(--ink)]">
        {v.name}
      </Link>
      {v.area ? <span className="text-[var(--muted)]"> · {v.area}</span> : null}
      {v.whatToOrder ? (
        <span className="block text-[13px] leading-snug text-[var(--muted)]">
          {v.whatToOrder.charAt(0).toUpperCase() + v.whatToOrder.slice(1).replace(/;\s*/g, ", ")}
        </span>
      ) : null}
    </li>
  );
}

// ISR: statically cached for speed/SEO, regenerated at most every 5 min so
// venue/publication edits in Supabase surface without a redeploy. Build-safe
// now that public reads degrade instead of throwing (lib/data.ts).
export const revalidate = 300;

const BASE = "https://www.otherbali.com";
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
  { key: "denpasar", name: "Denpasar", note: "The capital's everyday nasi campur Bali and local institutions — where the city actually eats.", pillar: undefined },
];

const FAQ = [
  { q: "What is a warung?", a: "A warung is a small, family-run Indonesian eatery serving affordable local food — nasi campur (build-your-own mixed rice), satay, and daily home-style dishes. They're the backbone of everyday eating in Bali." },
  { q: "Where is the best local food in Bali?", a: "Every district has its warungs — Canggu and Ubud have the deepest clusters, and each area has its own specialities. The picks here are sorted by district." },
  { q: "Is warung food cheap?", a: "Yes — warungs are among the best value in Bali, with generous plates for a fraction of café or restaurant prices." },
  { q: "What is babi guling?", a: "Babi guling is Balinese roast suckling pig, served with rice, crispy crackling, lawar and sambal — a local celebration dish and a hearty, affordable warung plate." },
];

export default async function BestWarungsPage() {
  const [all, liveSlugs] = await Promise.all([getPublishedVenues(), liveCollectionSlugs()]);
  const liveSet = new Set(liveSlugs);
  const warungs = all.filter((v) => isWarung(v) && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => {
    const venues = warungs
      .filter((v) => v.district === area.key)
      .sort((a, b) => a.name.localeCompare(b.name));

    const groups = new Map<string, VenueWithPerk[]>();
    const more: VenueWithPerk[] = [];
    for (const v of venues) {
      const slug = tasteGroupFor(v);
      if (!slug) {
        more.push(v);
        continue;
      }
      const list = groups.get(slug) ?? [];
      list.push(v);
      groups.set(slug, list);
    }
    const tasteGroups = TASTE_COLLECTIONS.filter((c) => groups.has(c.slug)).map((c) => ({
      slug: c.slug,
      label: c.taste,
      href: liveSet.has(c.slug) ? `/collections/${c.slug}` : null,
      venues: groups.get(c.slug)!,
    }));

    return { ...area, venues, tasteGroups, more };
  }).filter((a) => a.venues.length > 0);

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
                  {/* Name the district in the link — two sections both saying
                      "All local food →" read as a duplicate and hide where
                      each one actually goes. */}
                  {area.pillar.includes("best-warungs")
                    ? `All ${area.name} warungs →`
                    : `${area.name} guide →`}
                </Link>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{area.note}</p>

            {area.tasteGroups.map((group) => (
              <div key={group.slug} className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
                    {group.label}
                  </h3>
                  {group.href ? (
                    <Link href={group.href} className="quiet-link text-xs">
                      See all {group.label} →
                    </Link>
                  ) : null}
                </div>
                <ul className="mt-2 space-y-2 text-sm">
                  {group.venues.map((v) => (
                    <VenueLi key={v.slug} v={v} />
                  ))}
                </ul>
              </div>
            ))}

            {area.more.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">
                  More warungs
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {area.more.map((v) => (
                    <VenueLi key={v.slug} v={v} />
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}

        <p className="text-sm text-[var(--muted)]">
          Looking for a mood rather than a dish — a quiet local table, easy on
          the budget? See{" "}
          <Link href="/collections" className="quiet-link">
            curated collections →
          </Link>
        </p>

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
