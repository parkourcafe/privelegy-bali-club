import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { getGuide, guideMetadata } from "@/lib/guides";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";
const guide = getGuide("where-to-watch-sunset-in-bali")!;
export const metadata = guideMetadata(guide);

// Sunset is the west/south coast — Uluwatu cliffs, Seminyak & Canggu beaches,
// the southern bays. Sanur (sunrise coast) and inland Ubud are deliberately not
// here. Venues are the west/south sunset clubs and bars, driven from live data.
const AREA_ORDER: { key: string; name: string; note: string; pillar?: string }[] = [
  { key: "uluwatu-bukit", name: "Uluwatu & the Bukit", note: "The most dramatic sunsets on the island — clifftop bars high above the surf.", pillar: "/uluwatu" },
  { key: "seminyak", name: "Seminyak", note: "Beachfront clubs on the sand, sunset drinks facing straight west.", pillar: "/seminyak" },
  { key: "canggu", name: "Canggu", note: "Echo Beach and Batu Bolong — sunset sessions with a surf out front.", pillar: "/canggu" },
  { key: "jimbaran", name: "Jimbaran", note: "Calm-bay sunsets, soft sand and an easy golden hour.", pillar: undefined },
  { key: "nusa-dua", name: "Nusa Dua", note: "Resort-side sunset spots on reef-protected water.", pillar: "/nusa-dua" },
];

function isSunset(v: { jobs?: string[]; category: string }): boolean {
  return (v.jobs?.includes("sunset_drinks_view") ?? false) || v.category === "beach_club";
}

const FAQ = [
  { q: "Where is the best sunset in Bali?", a: "The west and south coasts face the sunset. Uluwatu's clifftop bars are the most dramatic; Seminyak and Canggu have the beachfront clubs. Sanur faces east (sunrise), and Ubud is inland." },
  { q: "What time is sunset in Bali?", a: "Bali sits near the equator, so sunset lands around 6–6:30pm year-round with little seasonal drift. Arrive an hour early for a good spot in high season." },
  { q: "Do I need to book a sunset spot?", a: "For the popular clifftop and beach clubs, yes — a table for golden hour fills up, especially in July and August. Daybeds and sofas usually carry a minimum spend." },
  { q: "Can you watch the sunset in Sanur?", a: "Sanur faces east, so it's a sunrise coast — beautiful mornings rather than sunsets. For sunset, head to the west or south coasts below." },
];

export default async function SunsetPage() {
  const all = await getPublishedVenues();
  const picks = all.filter((v) => isSunset(v) && isVenueIndexable(v));
  const byArea = AREA_ORDER.map((area) => ({
    ...area,
    venues: picks.filter((v) => v.district === area.key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((a) => a.venues.length > 0);

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Where to watch the sunset in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Bali sunset spots",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Where to watch the sunset in Bali",
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
            Sunset is a west-and-south-coast event in Bali. Uluwatu&apos;s
            clifftop bars are the most dramatic, Seminyak and Canggu have the
            beachfront clubs, and the southern bays do a calmer golden hour. (Sanur
            faces east — that&apos;s the sunrise coast.) Here are the sunset spots
            we stand behind, by area.
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
            { href: "/best-beach-clubs-in-bali", title: "The best beach clubs in Bali", blurb: "Where to spend golden hour, by area." },
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
            { href: "/seminyak", title: "The Seminyak guide", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All five first-timer areas, compared." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
