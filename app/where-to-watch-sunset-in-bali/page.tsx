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

// Bali sits ~8.5° south of the equator, so sunset barely drifts across the year
// — a narrow, honest band rather than the big seasonal swing you get further
// from the tropics. Approximate local times (WITA); ±10 min by exact spot.
const SUNSET_BANDS: { months: string; time: string }[] = [
  { months: "Dec – Feb", time: "~6:35 pm" },
  { months: "Mar – May", time: "~6:15 pm" },
  { months: "Jun – Aug", time: "~5:55 pm" },
  { months: "Sep – Nov", time: "~6:05 pm" },
];

const FAQ = [
  { q: "Where is the best sunset in Bali?", a: "The west and south coasts face the sunset. Uluwatu's clifftop bars are the most dramatic; Seminyak and Canggu have the beachfront clubs. Sanur faces east (sunrise), and Ubud is inland." },
  { q: "What time is sunset in Bali?", a: "Bali sits near the equator, so sunset barely drifts — from just before 6pm in June–August to about 6:40pm in December–February. Golden hour starts 30–45 minutes earlier; arrive an hour ahead for a good spot in high season." },
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
          <GuideHeroMedia seed="where to watch sunset in bali golden hour coast" />
        </header>

        <section className="guide-section">
          <h2>When to be there</h2>
          <GuideSectionMedia seed="sunset bali when to be there" index={0} />
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            This close to the equator, sunset barely moves through the year —
            roughly just before 6 to about 6:40pm. Golden hour opens 30–45
            minutes earlier, so aim to be settled by then for the light and a
            good seat.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Approximate sunset time by month">
            {SUNSET_BANDS.map((b) => (
              <li key={b.months} className="chip">
                {b.months} · {b.time}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Approximate local times (WITA), ±10 min by exact spot — check on the
            day before you set out.
          </p>
        </section>

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
            <GuideSectionMedia seed={`sunset bali ${area.key} ${area.name}`} index={index + 1} />
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
