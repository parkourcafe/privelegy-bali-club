"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { VenueWithPerk } from "@/lib/data";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import { track } from "@/lib/analytics";
import {
  PLACE_CATEGORY_LABELS,
  prettyPlaceSignal,
  rankPlacesForBrief,
  venueSearchText,
} from "@/lib/places-ranking";
import {
  buildPlacesFilterPath,
  readPlacesFilterState,
  type PlacesFilterState,
} from "@/lib/places-filter-url";

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

const categoryLabel = PLACE_CATEGORY_LABELS;

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
export default function PlacesView({
  venues,
  initialFilters,
}: {
  venues: CataloguePlace[];
  initialFilters?: InitialFilters;
}) {
  const [query, setQuery] = useState(initialFilters?.query?.slice(0, 240) ?? "");
  const [district, setDistrict] = useState<string | null>(
    initialFilters?.district || null
  );
  const [category, setCategory] = useState<string | null>(
    initialFilters?.category || null
  );
  const [intentMode, setIntentMode] = useState(initialFilters?.intentMode ?? false);

  function commitFilters(
    filters: Pick<PlacesFilterState, "query" | "district" | "category">,
    mode: "push" | "replace",
    clearBrief = false,
  ) {
    const boundedFilters = { ...filters, query: filters.query.slice(0, 240) };
    setQuery(boundedFilters.query);
    setDistrict(boundedFilters.district);
    setCategory(boundedFilters.category);
    if (clearBrief) setIntentMode(false);
    const path = buildPlacesFilterPath({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      filters: boundedFilters,
      clearBrief,
    });
    if (mode === "push") window.history.pushState(null, "", path);
    else window.history.replaceState(null, "", path);
  }

  useEffect(() => {
    function syncFromHistory() {
      const filters = readPlacesFilterState(window.location.search);
      setQuery(filters.query);
      setDistrict(filters.district);
      setCategory(filters.category);
      setIntentMode(filters.intentMode);
    }
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

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
      const hay = venueSearchText(v) + " " + (v.address ?? "").toLowerCase();
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
    return rankPlacesForBrief(filtered, tokens, category, district, 3);
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

  const briefLabel = [initialFilters?.missionLabel, initialFilters?.durationLabel]
    .filter(Boolean)
    .join(" · ");

  const activeCriteria: { key: string; label: string; onRemove: () => void }[] = [
    ...tokens.map((token) => ({
      key: `q:${token}`,
      label: prettyPlaceSignal(token),
      onRemove: () => commitFilters({
        query: tokens.filter((candidate) => candidate !== token).join(" "),
        district,
        category,
      }, "push"),
    })),
    ...(district
      ? [{
          key: "district",
          label: districtLabel[district] ?? district,
          onRemove: () => commitFilters({ query, district: null, category }, "push"),
        }]
      : []),
    ...(category
      ? [{
          key: "category",
          label: categoryLabel[category] ?? category,
          onRemove: () => commitFilters({ query, district, category: null }, "push"),
        }]
      : []),
  ];

  function clearAllCriteria() {
    commitFilters({ query: "", district: null, category: null }, "push", true);
  }

  return (
    <section className="scroll-mt-8">
      <div className="filter-panel">
        <label className="min-w-[220px] flex-1">
          <span className="chip-label">Search</span>
          <input
            value={query}
            maxLength={240}
            onChange={(event) => commitFilters({
              query: event.target.value,
              district,
              category,
            }, "replace")}
            placeholder="Place, area, vibe..."
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--lagoon)]"
          />
        </label>
        <Chips
          label="District"
          options={districts}
          selected={district}
          onSelect={(value) => commitFilters({ query, district: value, category }, "push")}
          render={(v) => districtLabel[v] ?? v}
        />
        <Chips
          label="Type"
          options={categories}
          selected={category}
          onSelect={(value) => commitFilters({ query, district, category: value }, "push")}
          render={(v) => categoryLabel[v] ?? v}
        />
      </div>

      {activeCriteria.length > 0 && (
        <div className="criteria-row" role="group" aria-label="Your active brief — tap a chip to remove it">
          <span className="chip-label">Your brief</span>
          {activeCriteria.map((criterion) => (
            <button key={criterion.key} type="button" className="criteria-chip" onClick={criterion.onRemove}>
              <span>{criterion.label}</span>
              <span className="criteria-x" aria-hidden="true">×</span>
              <span className="sr-only">Remove {criterion.label}</span>
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
                  {pick.editorialRankReason ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">{pick.editorialRankReason}</p>
                  ) : null}
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
          <div className="slot-heading">
            <h2>{districtLabel[slug] ?? slug}</h2>
            <p>{items.length} places</p>
          </div>
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
