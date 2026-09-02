import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import SceneImage from "@/components/landing/SceneImage";
import { getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { curateByArea } from "@/lib/seo/curated-list";

const MAX_PICKS = 30;
const MAX_PER_AREA = 6;
import { getGuide, guideMetadata } from "@/lib/guides";

// ISR: statically cached for speed/SEO, regenerated at most every 5 min so
// venue/publication edits in Supabase surface without a redeploy. Build-safe
// now that public reads degrade instead of throwing (lib/data.ts).
export const revalidate = 300;

const BASE = "https://www.otherbali.com";
const guide = getGuide("where-to-watch-sunset-in-bali")!;
export const metadata = guideMetadata(guide);

type SceneVariant = "sunset" | "ridge" | "surf" | "night";

type SunsetArea = {
  key: string;
  name: string;
  note: string;
  pillar?: string;
  scene: string;
  variant: SceneVariant;
  shortLabel: string;
};

// Sunset is the west/south coast — Uluwatu cliffs, Seminyak & Canggu beaches,
// the southern bays. Sanur (sunrise coast) and inland Ubud are deliberately not
// here. Venues are the west/south sunset clubs and bars, driven from live data.
const AREA_ORDER: SunsetArea[] = [
  {
    key: "uluwatu-bukit",
    name: "Uluwatu & the Bukit",
    note: "The most dramatic sunsets on the island — clifftop bars high above the surf.",
    pillar: "/uluwatu",
    scene: "district-uluwatu-bukit",
    variant: "sunset",
    shortLabel: "Cliff drama",
  },
  {
    key: "seminyak",
    name: "Seminyak",
    note: "Beachfront clubs on the sand, sunset drinks facing straight west.",
    pillar: "/seminyak",
    scene: "district-seminyak",
    variant: "sunset",
    shortLabel: "Polished beach clubs",
  },
  {
    key: "canggu",
    name: "Canggu",
    note: "Echo Beach and Batu Bolong — sunset sessions with a surf out front.",
    pillar: "/canggu",
    scene: "canggu-sunset-illustrative",
    variant: "sunset",
    shortLabel: "Surf energy",
  },
  {
    key: "jimbaran",
    name: "Jimbaran",
    note: "Calm-bay sunsets, soft sand and an easy golden hour.",
    scene: "guide-jimbaran-bay-sunset",
    variant: "sunset",
    shortLabel: "Calm bay",
  },
  {
    key: "nusa-dua",
    name: "Nusa Dua",
    note: "Resort-side sunset spots on reef-protected water.",
    pillar: "/nusa-dua",
    scene: "district-nusa-dua",
    variant: "surf",
    shortLabel: "Resort calm",
  },
];

const SUNSET_MODES = [
  {
    href: "#uluwatu-bukit",
    title: "Big cliff view",
    copy: "Choose Uluwatu when the sunset itself is the main event.",
    scene: "district-uluwatu-bukit",
    variant: "sunset" as SceneVariant,
  },
  {
    href: "#seminyak",
    title: "Beach club comfort",
    copy: "Choose Seminyak for sofas, sand and a lower-effort golden hour.",
    scene: "home-bali-sunset",
    variant: "sunset" as SceneVariant,
  },
  {
    href: "#canggu",
    title: "Surf-front session",
    copy: "Choose Canggu for sunset with surf, music and a social crowd.",
    scene: "canggu-sunset-illustrative",
    variant: "sunset" as SceneVariant,
  },
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
  // Shortlist, not the category.
  const { areas: byArea, shown, remaining, lastChecked } = curateByArea(picks, AREA_ORDER, {
    maxPicks: MAX_PICKS,
    maxPerArea: MAX_PER_AREA,
  });

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
      // Only what the page renders.
      itemListElement: shown.map((v, i) => ({
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">{guide.title}</h1>
          <p className="guide-lede">
            Sunset in Bali is a west-and-south-coast decision. Uluwatu&apos;s
            clifftop bars are the most dramatic, Seminyak and Canggu have the
            beachfront clubs, and the southern bays do a calmer golden hour. Sanur
            faces east — that&apos;s the sunrise coast.
          </p>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {shown.length} sunset spots, each one written up on the record with a
            reason to go and who it does not suit. Nobody can pay to be on this
            list or to sit higher on it.
            {lastChecked ? ` Last checked ${lastChecked}.` : ""}
          </p>
          <GuideHeroMedia seed="where to watch sunset in bali golden hour coast" />
        </header>

        <section className="guide-section visual-first-choices" aria-labelledby="sunset-style-heading">
          <div className="visual-first-heading-row">
            <div>
              <p className="guide-kicker">Choose visually first</p>
              <h2 id="sunset-style-heading">Pick the sunset mood before the venue</h2>
            </div>
            <p>
              The best sunset choice depends on the evening you want: cliff drama,
              beach-club comfort, surf-front energy, or a calmer bay. Start here,
              then open the area with the right feel.
            </p>
          </div>
          <div className="visual-choice-grid visual-choice-grid-three">
            {SUNSET_MODES.map((mode) => (
              <a key={mode.href} href={mode.href} className="visual-choice-card">
                <SceneImage scene={mode.scene} variant={mode.variant} imgClassName="ob-grade transition duration-700" />
                <div className="visual-choice-card-copy">
                  <span>Golden hour</span>
                  <h3>{mode.title}</h3>
                  <p>{mode.copy}</p>
                  <strong>Open this mood →</strong>
                </div>
              </a>
            ))}
          </div>
        </section>

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

        <section className="guide-section" aria-labelledby="sunset-area-heading">
          <div className="visual-first-heading-row">
            <div>
              <p className="guide-kicker">Choose by area</p>
              <h2 id="sunset-area-heading">The west and south coast options</h2>
            </div>
            <p>
              Sanur and Ubud are not sunset bases. These are the coastlines that
              make sense when golden hour is the plan.
            </p>
          </div>
          <div className="visual-choice-grid visual-choice-grid-area">
            {AREA_ORDER.map((area) => {
              const liveArea = byArea.find((item) => item.key === area.key);
              return (
                <a key={area.key} href={`#${area.key}`} className="visual-choice-card visual-choice-card-compact">
                  <SceneImage scene={area.scene} variant={area.variant} imgClassName="ob-grade transition duration-700" />
                  <div className="visual-choice-card-copy">
                    <span>{area.shortLabel}</span>
                    <h3>{area.name}</h3>
                    <p>{area.note}</p>
                    <strong>{liveArea ? `${liveArea.venues.length} places` : "Open area"} →</strong>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {byArea.map((area) => (
          <section key={area.key} id={area.key} className="guide-section visual-first-section">
            <div className="flex items-baseline justify-between gap-4">
              <h2>{area.name}</h2>
              {area.pillar ? (
                <Link href={area.pillar} className="quiet-link">
                  Area guide →
                </Link>
              ) : null}
            </div>
            <GuideSectionMedia seed={`sunset bali ${area.key} ${area.name}`} index={AREA_ORDER.findIndex((item) => item.key === area.key) + 1} />
            <p className="text-sm leading-relaxed text-[var(--muted)]">{area.note}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {area.venues.map((venue) => (
                <article key={venue.slug} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5 shadow-[var(--shadow-soft)]">
                  <p className="eyebrow">
                    {venue.category.replace(/_/g, " ")}
                    {venue.area ? ` · ${venue.area}` : ""}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-none text-[var(--ink)]">
                    <Link href={`/places/${venue.slug}`} className="text-inherit no-underline">
                      {venue.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {venue.bestFor || venue.whyItsHere || "Open the place page for current details before you go."}
                  </p>
                  {venue.notFor ? (
                    <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                      <strong>Not for:</strong> {venue.notFor}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-3 text-xs font-bold text-[var(--lagoon-strong)]">
                    {venue.priceAnchor ? <span className="text-[var(--muted)]">{venue.priceAnchor}</span> : null}
                    {venue.gmapsUrl ? (
                      <a href={venue.gmapsUrl} target="_blank" rel="noreferrer">
                        Open in Google Maps
                      </a>
                    ) : null}
                    <Link href={`/places/${venue.slug}`}>View place →</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {remaining > 0 ? (
          <p className="text-sm text-[var(--muted)]">
            This page is the shortlist, not the catalogue. Another {remaining}{" "}
            sunset-facing places are published with verified details —{" "}
            <Link href="/places" className="quiet-link">
              browse the full catalogue →
            </Link>
          </p>
        ) : null}

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
