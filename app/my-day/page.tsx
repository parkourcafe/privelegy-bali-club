import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PlaceCard from "@/components/PlaceCard";
import PageViewTracker from "@/components/PageViewTracker";
import DayBuilderForm from "@/components/my-day/DayBuilderForm";
import { RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import {
  CURATION_NOTE,
  getCollection,
  getCollectionSampleInArea,
  toCollectionPlaceCard,
} from "@/lib/collections";
import {
  parseAnswers,
  buildArc,
  hasAnyAnswer,
  areaName,
  GROUP_OPTIONS,
  VIBE_OPTIONS,
  BUDGET_OPTIONS,
  FINISH_OPTIONS,
  type DayAnswers,
} from "@/lib/day-builder";
import type { VenueWithPerk } from "@/lib/data";

// "My Day" is an interactive day-builder, not a directory. The traveller answers
// a few questions (where they are — optionally via geolocation — who they're
// with, the vibe, budget and how the day should end) and each answer maps to a
// published collection that fills a slot of the day's arc (morning → midday →
// golden hour → dinner). It's URL-driven: the client form pushes the answers to
// searchParams and THIS server component builds the day from real, decision-ready
// venues. It invents nothing — a slot only renders when its collection has places
// for the chosen area (else it widens island-wide and says so, or drops out).

export const revalidate = 300;

const BASE = "https://www.otherbali.com";
const PER_SLOT = 3;

export const metadata: Metadata = {
  title: "Today in Bali — find a place for the moment you're in | Other Bali",
  description:
    "Answer a few quick questions and get a short, practical Bali shortlist for today. Never paid placement.",
  alternates: { canonical: "/my-day" },
  openGraph: {
    title: "Today in Bali · Other Bali",
    description:
      "A short, practical shortlist for the moment you're in now.",
    url: `${BASE}/my-day`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Today in Bali · Other Bali",
    description: "Find a place or day shape for the moment you're in now.",
  },
};

function answerSummary(a: DayAnswers): string {
  const label = (opts: { value: string; label: string }[], v: string | null) =>
    v ? opts.find((o) => o.value === v)?.label ?? null : null;
  const parts = [
    areaName(a.area),
    label(GROUP_OPTIONS, a.group),
    label(VIBE_OPTIONS, a.vibe),
    label(BUDGET_OPTIONS, a.budget),
    label(FINISH_OPTIONS, a.finish),
  ].filter(Boolean) as string[];
  return parts.join(" · ");
}

export default async function MyDayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const answers = parseAnswers(await searchParams);
  const personalised = hasAnyAnswer(answers);
  const arc = buildArc(answers);

  // Fill each arc slot from its collection, restricted to the chosen area (or
  // island-wide when none). A slot with no places is dropped; one that had to
  // widen beyond the chosen area is kept but flagged.
  const filled = await Promise.all(
    arc.map(async (slot) => {
      const { venues, widened } = await getCollectionSampleInArea(
        slot.collection,
        PER_SLOT,
        answers.area,
      );
      return { slot, venues, widened };
    }),
  );
  const active = filled.filter((f) => f.venues.length > 0);

  const areaLabel = areaName(answers.area);
  const summary = answerSummary(answers);

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Today" },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        ...(c.href ? { item: `${BASE}${c.href}` } : {}),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Today in Bali",
      itemListElement: active
        .flatMap((f) => f.venues)
        .map((v: VenueWithPerk, i: number) => ({
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
        <PageViewTracker event="editorial_page_view" slug="my-day" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <p className="topline">Today · Shortlist for the moment you are in</p>
          <h1 className="hero-title mt-2">Find a place for today in Bali</h1>
          <p className="guide-standfirst">
            Use this when you are already here and need a decision. Tell us the
            area, company and mood; we turn published collections into a short
            shortlist you can open, save or send to Maps. For future itineraries,
            use Plan.
          </p>
          <p className="guide-meta-line">{CURATION_NOTE}</p>
          <GuideHeroMedia seed="my day bali shortlist morning sunset dinner" />
        </header>

        {/* The questions. */}
        <section className="guide-section" aria-label="Build your day">
          <GuideSectionMedia seed="my day questions bali plan" index={0} />
          <DayBuilderForm initial={answers} />
        </section>

        {/* The day. */}
        <div id="your-day">
          {personalised && (
            <p className="topline" style={{ marginTop: 8 }}>
              Your day{summary ? ` · ${summary}` : ""}
            </p>
          )}

          {/* Quick jump between the parts of the day. */}
          {active.length > 0 && (
            <nav className="mt-2 flex flex-wrap gap-2" aria-label="Jump to a time of day">
              {active.map((f) => (
                <a key={f.slot.key} href={`#${f.slot.key}`} className="chip">
                  {f.slot.time.split(" — ")[1] ?? f.slot.title}
                </a>
              ))}
            </nav>
          )}

          {active.length === 0 && (
            <section className="guide-section">
              <p className="guide-standfirst">
                We don&apos;t have enough decision-ready places to build this exact
                day yet. Try widening to all Bali, or{" "}
                <Link href="/places" className="quiet-link">
                  browse every place →
                </Link>
              </p>
            </section>
          )}

          {active.map((f) => (
            <section key={f.slot.key} id={f.slot.key} className="guide-section">
              <p className="topline">{f.slot.time}</p>
              <h2 className="mt-1">{f.slot.title}</h2>
              <GuideSectionMedia seed={`my day ${f.slot.key} ${f.slot.title}`} index={active.indexOf(f) + 1} />
              <p className="guide-standfirst" style={{ marginTop: 8 }}>
                {f.slot.line}
              </p>
              {f.widened && areaLabel && (
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Nothing decision-ready for this in {areaLabel} yet — showing
                  island-wide picks.
                </p>
              )}
              <div className="pick-grid" style={{ marginTop: 16 }}>
                {f.venues.map((v) => (
                  <PlaceCard key={v.slug} place={toCollectionPlaceCard(v)} />
                ))}
              </div>
              {getCollection(f.slot.collection) ? (
                <p style={{ marginTop: 12 }}>
                  <Link href={`/collections/${f.slot.collection}`} className="quiet-link">
                    See the whole {getCollection(f.slot.collection)!.taste.toLowerCase()} list →
                  </Link>
                </p>
              ) : null}
            </section>
          ))}
        </div>

        <section className="guide-section">
          <h2>How Today is built</h2>
          <GuideSectionMedia seed="my day how this is built" index={9} />
          <div className="guide-prose">
            <p>
              Every stop is drawn from our resident-curated collections — the same
              places, arranged as a short today-list instead of a directory. Your
              answers choose which collection fills each slot; nothing here is a
              paid slot, and we don&apos;t publish negative call-outs. A place
              that has not passed the publication gate simply is not in the day.
              Times are a suggestion; the point is the shape. Your location, if
              you share it, is used once to find your area and never stored.
            </p>
          </div>
        </section>

        <RelatedGuides
          heading="If this is for later"
          links={[
            {
              href: "/plan",
              title: "Plan your Bali trip",
              blurb: "Use trip-length guides and ready-made routes.",
            },
            {
              href: "/collections",
              title: "Browse curated collections",
              blurb: "Theme-based shortlists when you want to compare options.",
            },
            {
              href: "/bali",
              title: "Bali by district",
              blurb: "Deep guides to every area.",
            },
            {
              href: "/best-restaurants-in-bali",
              title: "The best restaurants in Bali",
              blurb: "The island's dinner scene, area by area.",
            },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
