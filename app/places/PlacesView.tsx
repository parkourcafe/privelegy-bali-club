"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { VenueWithPerk } from "@/lib/data";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import { track } from "@/lib/analytics";
import { DISTRICT_GRADIENT } from "@/lib/districts";

// Catalogue rows arrive enriched server-side (registry editorial for Uluwatu,
// parsed price bands) so the card layer stays lean.
export type CataloguePlace = VenueWithPerk & {
  cardLine?: string;
  cardArea?: string;
  cardBestFor?: string;
  cardPrice?: string;
};

function toCard(v: CataloguePlace): PlaceCardData {
  return {
    slug: v.slug,
    name: v.name,
    category: v.category,
    microArea: v.cardArea ?? v.area,
    editorialLine: v.cardLine ?? v.whyItsHere,
    bestFor: v.cardBestFor ?? v.bestFor,
    priceBand: v.cardPrice,
    photoUrl: v.photoUrl,
    isSponsored: v.isSponsored,
    gmapsUrl: v.gmapsUrl,
    tablepilotSlug: undefined,
    coverageMode: "planning_only",
    hasOffer: Boolean(v.perk),
  };
}

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  fitness: "Fitness",
  yoga: "Yoga",
  beauty: "Beauty",
  bar: "Bar",
  surf: "Surf",
};

const districtLabel: Record<string, string> = {
  canggu: "Canggu",
  ubud: "Ubud",
  seminyak: "Seminyak",
  "kuta-legian": "Kuta & Legian",
  jimbaran: "Jimbaran",
  "uluwatu-bukit": "Uluwatu & the Bukit",
  "nusa-dua": "Nusa Dua",
  sanur: "Sanur",
  sidemen: "Sidemen",
  amed: "Amed & the east coast",
  munduk: "Munduk & the highlands",
  lovina: "Lovina",
  "nusa-islands": "Nusa Penida & the islands",
  "gili-islands": "Gili Islands",
  lombok: "Lombok",
};

type InitialFilters = {
  query?: string;
  district?: string;
  category?: string;
  intentMode?: boolean;
  missionLabel?: string;
  durationLabel?: string;
};

// A place's fit against the day brief. Pure + deterministic — this is the
// "Top 3 for your brief" ranking (master §6a.7 step 3), not an AI recommender.
function haystack(v: VenueWithPerk): string {
  return [
    v.name,
    v.area,
    v.category,
    ...(v.wellnessCategories ?? []),
    v.district,
    v.whyItsHere,
    v.bestFor,
    ...(v.vibeTags ?? []),
    ...(v.practicalTags ?? []),
    ...(v.jobs ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function prettyTag(t: string): string {
  return t.replace(/[-_]/g, " ").trim();
}

function scoreVenue(
  v: VenueWithPerk,
  tokens: string[],
  category: string | null,
  district: string | null
): { score: number; reasons: string[] } {
  const hay = haystack(v);
  const reasons: string[] = [];
  let score = 0;

  const categoryMatched = Boolean(
    category && (v.category === category || v.wellnessCategories?.includes(category as VenueWithPerk["category"]))
  );
  if (categoryMatched) {
    score += 3;
    reasons.push(categoryLabel[category!] ?? category!);
  }
  const catWords = new Set([v.category, (categoryLabel[v.category] ?? "").toLowerCase()]);
  for (const t of tokens) {
    if (t && hay.includes(t)) {
      score += 2;
      // Don't repeat the category as a reason when it already matched
      // ("Café · cafe" reads as noise).
      if (!(categoryMatched && catWords.has(t))) reasons.push(prettyTag(t));
    }
  }
  if (district && v.district === district) score += 1;
  // Completeness / relationship tie-breakers — surface the most decision-ready
  // places first without ever becoming a paid-ranking signal (guardrail #6).
  if (v.photoUrl) score += 1;
  if (v.bestFor) score += 1;
  if (v.priceAnchor || v.whatToOrder) score += 1;
  score += v.tier === "founding" ? 1 : v.tier === "launch" ? 0.5 : 0;

  const seen = new Set<string>();
  const uniqueReasons = reasons.filter((r) => {
    const k = r.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return { score, reasons: uniqueReasons.slice(0, 4) };
}

export default function PlacesView({
  venues,
  initialFilters,
}: {
  venues: CataloguePlace[];
  initialFilters?: InitialFilters;
}) {
  const [query, setQuery] = useState(initialFilters?.query ?? "");
  const [district, setDistrict] = useState<string | null>(
    initialFilters?.district || null
  );
  const [category, setCategory] = useState<string | null>(
    initialFilters?.category || null
  );
  const intentMode = initialFilters?.intentMode ?? false;
  // Mission/duration are human labels for the brief (they don't re-rank — the
  // matchable tags already ride in `query`). Held in state so their chips are
  // removable like the rest of the brief.
  const [missionLabel, setMissionLabel] = useState(initialFilters?.missionLabel);
  const [durationLabel, setDurationLabel] = useState(initialFilters?.durationLabel);

  const districts = useMemo(
    () => [...new Set(venues.map((v) => v.district))].sort(),
    [venues]
  );
  const categories = useMemo(
    () => [...new Set(venues.flatMap((v) => v.wellnessCategories?.length ? v.wellnessCategories : [v.category]))].sort(),
    [venues]
  );

  const tokens = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query]
  );

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      const hay = haystack(v) + " " + (v.address ?? "").toLowerCase();
      return (
        (!district || v.district === district) &&
        (!category || v.category === category || v.wellnessCategories?.includes(category as VenueWithPerk["category"])) &&
        (tokens.length === 0 ||
          (intentMode
            ? tokens.some((token) => hay.includes(token))
            : tokens.every((token) => hay.includes(token))))
      );
    });
  }, [venues, tokens, district, category, intentMode]);

  // Top 3 for the brief — only when the traveller arrived from the day builder
  // (intentMode) with something to match on. Everything else "widens" below.
  const topPicks = useMemo(() => {
    if (!intentMode || (tokens.length === 0 && !category)) return [];
    return filtered
      .map((v) => ({ venue: v, ...scoreVenue(v, tokens, category, district) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.venue.name.localeCompare(b.venue.name))
      .slice(0, 3);
  }, [filtered, tokens, category, district, intentMode]);

  const topSlugs = useMemo(
    () => new Set(topPicks.map((p) => p.venue.slug)),
    [topPicks]
  );

  const rest = useMemo(
    () => filtered.filter((v) => !topSlugs.has(v.slug)),
    [filtered, topSlugs]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, VenueWithPerk[]>();
    for (const venue of rest) {
      const list = map.get(venue.district) ?? [];
      list.push(venue);
      map.set(venue.district, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [rest]);

  const briefLabel = [missionLabel, durationLabel].filter(Boolean).join(" · ");

  // The live brief, one removable chip per criterion, so nothing silently
  // narrows the map (audit 2026-07). Each token / district / category / mission
  // / duration the traveller carries in is visible and droppable.
  const activeCriteria: { key: string; label: string; onRemove: () => void }[] = [
    ...tokens.map((t) => ({
      key: `q:${t}`,
      label: prettyTag(t),
      onRemove: () => setQuery(tokens.filter((x) => x !== t).join(" ")),
    })),
    ...(district
      ? [{ key: "district", label: districtLabel[district] ?? district, onRemove: () => setDistrict(null) }]
      : []),
    ...(category
      ? [{ key: "category", label: categoryLabel[category] ?? category, onRemove: () => setCategory(null) }]
      : []),
    ...(missionLabel
      ? [{ key: "mission", label: missionLabel, onRemove: () => setMissionLabel(undefined) }]
      : []),
    ...(durationLabel
      ? [{ key: "duration", label: durationLabel, onRemove: () => setDurationLabel(undefined) }]
      : []),
  ];

  function clearAllCriteria() {
    setQuery("");
    setDistrict(null);
    setCategory(null);
    setMissionLabel(undefined);
    setDurationLabel(undefined);
  }

  return (
    <section className="scroll-mt-8">
      <div className="filter-panel">
        <label className="min-w-[240px] flex-1">
          <span className="chip-label">Search</span>
          <div className="relative mt-2">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Place, area, vibe…"
              className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] py-2.5 pl-10 pr-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--brass)] focus:ring-2 focus:ring-[color:rgba(198,154,92,0.28)]"
            />
          </div>
        </label>
        <Chips
          label="District"
          options={districts}
          selected={district}
          onSelect={setDistrict}
          render={(v) => districtLabel[v] ?? v}
        />
        <Chips
          label="Type"
          options={categories}
          selected={category}
          onSelect={setCategory}
          render={(v) => categoryLabel[v] ?? v}
        />
      </div>

      {activeCriteria.length > 0 && (
        <div className="criteria-row" aria-label="Your active brief — tap a chip to remove it">
          <span className="chip-label">Your brief</span>
          {activeCriteria.map((c) => (
            <button key={c.key} type="button" className="criteria-chip" onClick={c.onRemove}>
              <span>{c.label}</span>
              <span className="criteria-x" aria-hidden="true">×</span>
              <span className="sr-only">Remove {c.label}</span>
            </button>
          ))}
          <button type="button" className="criteria-clear" onClick={clearAllCriteria}>
            Clear all
          </button>
        </div>
      )}

      {district === "uluwatu-bukit" && (
        <div className="mb-6 rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 text-sm">
          <Link
            href="/uluwatu"
            className="font-bold text-[var(--lagoon-strong)] hover:text-[var(--clay)]"
            onClick={() => track("internal_guide_click", { pageSlug: "places-to-uluwatu" })}
          >
            New: the full Uluwatu guide →
          </Link>{" "}
          <span className="text-[var(--muted)]">
            best restaurants, brunch, sunset clubs and a 48-hour plan.
          </span>
        </div>
      )}

      {topPicks.length > 0 && (
        <section className="slot-section">
          <div className="slot-heading">
            <h2>Top picks for your brief</h2>
            <p>{briefLabel || "Best fit first — widen below for the rest."}</p>
          </div>
          <div className="pick-grid">
            {topPicks.map((pick, i) => (
              <div key={pick.venue.slug}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lagoon)] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {pick.reasons.length > 0 && (
                    <p className="text-xs text-[var(--muted)]">
                      <span className="font-semibold">Matched because:</span>{" "}
                      {pick.reasons.join(" · ")}
                    </p>
                  )}
                </div>
                <PlaceCard place={toCard(pick.venue)} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-4 text-sm text-[var(--muted)]" aria-live="polite">
        <p>
          {topPicks.length > 0
            ? `Widen to all matches — ${rest.length} more place${rest.length === 1 ? "" : "s"}.`
            : `Showing ${filtered.length} of ${venues.length} places.`}
        </p>
        {/* Honest fallback signal (audit 2026-07): say so when the full brief
            didn't yield a clean Top 3, instead of quietly showing fewer. */}
        {intentMode && (tokens.length > 0 || category) && topPicks.length > 0 && topPicks.length < 3 && (
          <p className="mt-1">
            Only {topPicks.length} strong match{topPicks.length === 1 ? "" : "es"} for your full brief — drop a chip above to widen it.
          </p>
        )}
        {intentMode && (tokens.length > 0 || category) && topPicks.length === 0 && filtered.length > 0 && (
          <p className="mt-1">
            No ranked shortlist for this brief — showing everything that fits. Add a vibe or type for a Top 3.
          </p>
        )}
      </div>

      {grouped.map(([slug, items]) => (
        <section key={slug} className="slot-section">
          {/* District divider — the same light colour wash as the homepage
              "Around Bali" cards, so scrolling the catalogue you feel each new
              district instead of reading a grey label. Falls back to the plain
              heading for any district without a gradient. */}
          {DISTRICT_GRADIENT[slug] ? (
            <div className="relative h-20 overflow-hidden rounded-2xl">
              <div className="absolute inset-0" style={{ background: DISTRICT_GRADIENT[slug] }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
              <div className="relative flex h-full flex-col justify-center px-5">
                <h2 className="font-display text-xl font-semibold text-[var(--ob-sand)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
                  {districtLabel[slug] ?? slug}
                </h2>
                <p className="text-xs font-semibold text-[var(--ob-sand)]/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.65)]">
                  {items.length} places
                </p>
              </div>
            </div>
          ) : (
            <div className="slot-heading">
              <h2>{districtLabel[slug] ?? slug}</h2>
              <p>{items.length} places</p>
            </div>
          )}
          {/* Editorial cards: the decision essentials only. The TablePilot
              Reserve handoff (guardrail #3) stays on the card as a secondary
              CTA wherever a venue is bookable; the full profile — offer
              terms, practical info, booking options — lives on the venue
              page behind View place. */}
          <div className="pick-grid">
            {items.map((v) => (
              <PlaceCard key={v.slug} place={toCard(v)} />
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-[var(--muted)]">
          Nothing matches that combo yet. Clear a filter to widen the map.
        </p>
      )}
    </section>
  );
}

function Chips({
  label,
  options,
  selected,
  onSelect,
  render,
}: {
  label: string;
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  render?: (value: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <div className="chip-row">
      <span className="chip-label">{label}</span>
      {options.map((option) => {
        const active = selected === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(active ? null : option)}
            className={`chip ${active ? "chip-active" : ""}`}
          >
            {render ? render(option) : option}
          </button>
        );
      })}
    </div>
  );
}
