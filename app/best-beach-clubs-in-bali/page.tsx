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
const guide = getGuide("best-beach-clubs-in-bali")!;
export const metadata = guideMetadata(guide);

// District display + preferred order (best sunsets / most iconic first). The
// venue links are driven live from the catalogue so the list can't go stale;
// the per-area framing is editorial.
const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "Clifftop and cove clubs where the sunset is the whole event — the most dramatic scenery on the island.", pillar: "/uluwatu" },
  { key: "seminyak", name: "Seminyak", note: "The originals: beachfront clubs on the sand where Bali's beach-club scene began.", pillar: "/seminyak" },
  { key: "canggu", name: "Canggu", note: "The Echo Beach and Batu Bolong line-up — sunset sessions, DJs and surf out front.", pillar: "/canggu" },
  { key: "jimbaran", name: "Jimbaran", note: "Calm-bay clubs on soft sand, good for an easy sunset and a family-friendly evening." },
  { key: "nusa-dua", name: "Nusa Dua", note: "Resort-side clubs on reef-protected water — the calm, easy option in the south." },
];

const FAQ = [
  { q: "Where are the best beach clubs in Bali?", a: "Uluwatu has the most dramatic clifftop and cove clubs, Seminyak has the beachfront originals, and Canggu has the Echo Beach sunset line-up. Jimbaran and Nusa Dua are calmer, more family-friendly." },
  { q: "Do beach clubs in Bali cost money to enter?", a: "Most are free to walk into, but daybeds, sofas and cabanas usually carry a minimum spend, especially at the popular sunset clubs. A table or bar stool is the budget-friendly way in." },
  { q: "Which beach clubs are best for sunset?", a: "The west and south coasts face the sunset — Seminyak, Canggu and the Uluwatu cliffs. Book a table ahead for golden hour in high season." },
  { q: "Are Bali beach clubs family-friendly?", a: "Some are, some are adults-only — it varies by venue. Jimbaran and Nusa Dua skew calmer and more family-friendly; check each club's page before you go." },
];

export default async function BestBeachClubsPage() {
  const all = await getPublishedVenues();
  const clubs = all.filter((v) => v.category === "beach_club" && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: clubs
      .filter((v) => v.district === area.key)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Best beach clubs in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Bali beach clubs",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best beach clubs in Bali",
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
            Bali&apos;s beach clubs split by coast. Uluwatu and the Bukit have the
            clifftop drama, Seminyak has the beachfront originals, and Canggu has
            the Echo Beach sunset sessions. Jimbaran and Nusa Dua are the calmer,
            family-friendly end. Here are the ones we stand behind, by area —
            tap any for the details, and book a table ahead for golden hour in
            high season.
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
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
            { href: "/seminyak", title: "The Seminyak guide", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
            { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
