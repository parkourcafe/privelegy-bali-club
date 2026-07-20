import Link from "next/link";
import type { VenueWithPerk } from "@/lib/data";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import { TrackedGuideLink } from "@/components/PlaceCardActions";
import { DISTRICT_GRADIENT } from "@/lib/districts";
import { CATALOGUE_MOMENTS } from "@/lib/catalogue-moments";

export type CataloguePlace = VenueWithPerk & {
  cardLine?: string;
  cardArea?: string;
  cardBestFor?: string;
  cardPrice?: string;
};

export type CatalogueTopPick = {
  venue: CataloguePlace;
  reasons: string[];
};

// One district row of the default-view island directory: a scored preview of
// its strongest cards plus the count behind the "all places" link.
export type DistrictDirectorySection = {
  slug: string;
  total: number;
  items: CataloguePlace[];
};

export type CatalogueFilters = {
  query: string;
  district: string;
  category: string;
  moment: string;
  momentLabel?: string;
  intentMode: boolean;
  mission: string;
  missionLabel?: string;
  duration: string;
  durationLabel?: string;
};

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

function catalogueHref(
  filters: CatalogueFilters,
  overrides: Partial<CatalogueFilters> & { page?: number } = {},
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (next.query) params.set("q", next.query);
  if (next.district) params.set("district", next.district);
  if (next.category) params.set("category", next.category);
  if (next.moment) params.set("moment", next.moment);
  if (next.intentMode) params.set("intent", "1");
  if (next.mission) params.set("m", next.mission);
  if (next.duration) params.set("dur", next.duration);
  if (overrides.page && overrides.page > 1) params.set("page", String(overrides.page));
  const query = params.toString();
  return query ? `/places?${query}` : "/places";
}

function prettyTag(value: string): string {
  return value.replace(/[-_]/g, " ").trim();
}

function FilterChips({
  label,
  options,
  selected,
  filters,
  render,
  field,
  allLabel,
}: {
  label: string;
  options: readonly string[];
  selected: string;
  filters: CatalogueFilters;
  render: (value: string) => string;
  field: "district" | "category" | "moment";
  // Leading "everything" chip — an always-visible exit from a scoped view
  // (e.g. arriving on /places?district=canggu from a district page), so the
  // unfiltered catalogue is one obvious tap away, not hidden in "Clear all".
  allLabel?: string;
}) {
  if (options.length === 0) return null;
  return (
    <div className="chip-row">
      <span className="chip-label">{label}</span>
      {allLabel ? (
        <Link
          href={catalogueHref(filters, { [field]: "" })}
          aria-current={selected === "" ? "page" : undefined}
          className={`chip ${selected === "" ? "chip-active" : ""}`}
        >
          {allLabel}
        </Link>
      ) : null}
      {options.map((option) => {
        const active = selected === option;
        return (
          <Link
            key={option}
            href={catalogueHref(filters, { [field]: active ? "" : option })}
            aria-current={active ? "page" : undefined}
            className={`chip ${active ? "chip-active" : ""}`}
          >
            {render(option)}
          </Link>
        );
      })}
    </div>
  );
}

export default function PlacesView({
  venues,
  topPicks,
  filters,
  districts,
  categories,
  nearby = [],
  directory,
  totalMatches,
  totalVenues,
  page,
  totalPages,
}: {
  venues: CataloguePlace[];
  topPicks: CatalogueTopPick[];
  filters: CatalogueFilters;
  districts: string[];
  categories: string[];
  nearby?: CataloguePlace[];
  directory?: DistrictDirectorySection[];
  totalMatches: number;
  totalVenues: number;
  page: number;
  totalPages: number;
}) {
  const grouped = new Map<string, CataloguePlace[]>();
  for (const venue of venues) {
    const list = grouped.get(venue.district) ?? [];
    list.push(venue);
    grouped.set(venue.district, list);
  }

  const tokens = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  const activeCriteria: { key: string; label: string; href: string }[] = [
    ...tokens.map((token) => ({
      key: `q:${token}`,
      label: prettyTag(token),
      href: catalogueHref(filters, {
        query: tokens.filter((item) => item !== token).join(" "),
      }),
    })),
    ...(filters.district
      ? [{
          key: "district",
          label: districtLabel[filters.district] ?? filters.district,
          href: catalogueHref(filters, { district: "" }),
        }]
      : []),
    ...(filters.category
      ? [{
          key: "category",
          label: categoryLabel[filters.category] ?? filters.category,
          href: catalogueHref(filters, { category: "" }),
        }]
      : []),
    ...(filters.momentLabel
      ? [{
          key: "moment",
          label: filters.momentLabel,
          href: catalogueHref(filters, { moment: "", momentLabel: undefined }),
        }]
      : []),
    ...(filters.missionLabel
      ? [{
          key: "mission",
          label: filters.missionLabel,
          href: catalogueHref(filters, { mission: "", missionLabel: undefined }),
        }]
      : []),
    ...(filters.durationLabel
      ? [{
          key: "duration",
          label: filters.durationLabel,
          href: catalogueHref(filters, { duration: "", durationLabel: undefined }),
        }]
      : []),
  ];

  const briefLabel = [filters.missionLabel, filters.durationLabel]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="scroll-mt-8">
      <div className="filter-panel">
        <form action="/places" method="get" className="min-w-[240px] flex-1">
          <label>
            <span className="chip-label">Search</span>
            <div className="relative mt-2 flex gap-2">
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
                name="q"
                defaultValue={filters.query}
                placeholder="Place, area, vibe…"
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] py-2.5 pl-10 pr-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--lagoon)] focus:ring-2 focus:ring-[color:rgba(198,154,92,0.28)]"
              />
              <button type="submit" className="chip chip-active min-h-11 px-4">
                Search
              </button>
            </div>
          </label>
          {filters.district ? <input type="hidden" name="district" value={filters.district} /> : null}
          {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
          {filters.moment ? <input type="hidden" name="moment" value={filters.moment} /> : null}
          {filters.intentMode ? <input type="hidden" name="intent" value="1" /> : null}
          {filters.mission ? <input type="hidden" name="m" value={filters.mission} /> : null}
          {filters.duration ? <input type="hidden" name="dur" value={filters.duration} /> : null}
        </form>
        <FilterChips
          label="Moment"
          options={CATALOGUE_MOMENTS.map((m) => m.slug)}
          selected={filters.moment}
          filters={filters}
          field="moment"
          render={(value) => {
            const label = CATALOGUE_MOMENTS.find((m) => m.slug === value)?.label ?? value;
            return filters.moment === value ? `★ ${label}` : label;
          }}
        />
        <FilterChips
          label="Type"
          options={categories}
          selected={filters.category}
          filters={filters}
          field="category"
          render={(value) => categoryLabel[value] ?? value}
        />
        <FilterChips
          label="District"
          options={districts}
          selected={filters.district}
          filters={filters}
          field="district"
          render={(value) => districtLabel[value] ?? value}
          allLabel="All Bali"
        />
      </div>

      {activeCriteria.length > 0 ? (
        <div className="criteria-row" aria-label="Your active brief — choose a chip to remove it">
          <span className="chip-label">Your brief</span>
          {activeCriteria.map((criterion) => (
            <Link key={criterion.key} href={criterion.href} className="criteria-chip">
              <span>{criterion.label}</span>
              <span className="criteria-x" aria-hidden="true">×</span>
              <span className="sr-only">Remove {criterion.label}</span>
            </Link>
          ))}
          <Link href="/places" className="criteria-clear">Clear all</Link>
        </div>
      ) : null}

      {filters.district === "uluwatu-bukit" ? (
        <div className="mb-6 rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] px-4 py-3 text-sm">
          <TrackedGuideLink
            href="/uluwatu"
            pageSlug="places-to-uluwatu"
            className="font-bold text-[var(--lagoon-strong)] hover:text-[var(--lagoon)]"
          >
            New: the full Uluwatu guide →
          </TrackedGuideLink>{" "}
          <span className="text-[var(--muted)]">
            best restaurants, brunch, sunset clubs and a 48-hour plan.
          </span>
        </div>
      ) : null}

      {topPicks.length > 0 ? (
        <section className="slot-section">
          <div className="slot-heading">
            <h2>Top picks for your brief</h2>
            <p>{briefLabel || "Best fit first — widen below for the rest."}</p>
          </div>
          <div className="pick-grid">
            {topPicks.map((pick, index) => (
              <div key={pick.venue.slug}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lagoon)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {pick.reasons.length > 0 ? (
                    <p className="text-xs text-[var(--muted)]">
                      <span className="font-semibold">Matched because:</span>{" "}
                      {pick.reasons.join(" · ")}
                    </p>
                  ) : null}
                </div>
                <PlaceCard place={toCard(pick.venue)} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-4 text-sm text-[var(--muted)]" aria-live="polite">
        <p>
          {directory
            ? `${directory.length} districts · ${totalVenues} curated places — every district below, strongest cards first. Pick a district or narrow with the filters above.`
            : `Showing ${venues.length + topPicks.length} of ${totalMatches} matches · ${totalVenues} curated places total.`}
        </p>
        {filters.intentMode && (tokens.length > 0 || filters.category) && topPicks.length > 0 && topPicks.length < 3 ? (
          <p className="mt-1">
            Only {topPicks.length} strong match{topPicks.length === 1 ? "" : "es"} for your full brief — remove a criterion to widen it.
          </p>
        ) : null}
        {filters.intentMode && (tokens.length > 0 || filters.category) && topPicks.length === 0 && totalMatches > 0 ? (
          <p className="mt-1">
            No ranked shortlist for this brief — showing everything that fits.
          </p>
        ) : null}
      </div>

      {directory ? (
        // Island directory (default view): every district on one screen, its
        // strongest cards previewed, the full set one tap away. Replaces the
        // old flat page 1, which was alphabetically all-Canggu.
        directory.map((section) => (
          <section key={section.slug} className="slot-section">
            {DISTRICT_GRADIENT[section.slug] ? (
              <div className="relative h-20 overflow-hidden rounded-2xl">
                <div className="absolute inset-0" style={{ background: DISTRICT_GRADIENT[section.slug] }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                <div className="relative flex h-full items-center justify-between px-5">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-[var(--ob-sand)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
                      {districtLabel[section.slug] ?? section.slug}
                    </h2>
                    <p className="text-xs font-semibold text-[var(--ob-sand)]/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.65)]">
                      {section.total} places
                    </p>
                  </div>
                  {section.total > section.items.length ? (
                    <Link
                      href={catalogueHref(filters, { district: section.slug })}
                      className="rounded-full border border-[rgba(250,246,239,0.5)] bg-black/25 px-4 py-2 text-xs font-bold text-[var(--ob-sand)] backdrop-blur-sm transition-colors hover:bg-black/45"
                    >
                      All {section.total} →
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="slot-heading">
                <h2>{districtLabel[section.slug] ?? section.slug}</h2>
                <p>{section.total} places</p>
              </div>
            )}
            <div className="pick-grid">
              {section.items.map((venue) => (
                <PlaceCard key={venue.slug} place={toCard(venue)} />
              ))}
            </div>
            {section.total > section.items.length ? (
              <div className="mt-3">
                <Link href={catalogueHref(filters, { district: section.slug })} className="chip">
                  All {section.total} places in {districtLabel[section.slug] ?? section.slug} →
                </Link>
              </div>
            ) : null}
          </section>
        ))
      ) : filters.moment && venues.length > 0 ? (
        // Moment mode is a ranked answer, not an atlas: best fit first, the
        // strongest match badged. Order comes pre-ranked from the server.
        <section className="slot-section">
          <div className="slot-heading">
            <h2>Best fit first</h2>
            <p>Ranked by how strongly each place&apos;s own record matches this moment.</p>
          </div>
          <div className="pick-grid">
            {venues.map((venue, index) => (
              <div key={venue.slug} className="relative">
                {page === 1 && index === 0 ? (
                  <span className="moment-badge" aria-hidden="true">
                    ★ Best for {filters.momentLabel?.toLowerCase()}
                  </span>
                ) : null}
                <PlaceCard place={toCard(venue)} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        [...grouped.entries()].map(([slug, items]) => (
          <section key={slug} className="slot-section">
            {DISTRICT_GRADIENT[slug] ? (
              <div className="relative h-20 overflow-hidden rounded-2xl">
                <div className="absolute inset-0" style={{ background: DISTRICT_GRADIENT[slug] }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                <div className="relative flex h-full flex-col justify-center px-5">
                  <h2 className="font-display text-xl font-semibold text-[var(--ob-sand)] drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]">
                    {districtLabel[slug] ?? slug}
                  </h2>
                  <p className="text-xs font-semibold text-[var(--ob-sand)]/85 drop-shadow-[0_1px_5px_rgba(0,0,0,0.65)]">
                    {items.length} on this page
                  </p>
                </div>
              </div>
            ) : (
              <div className="slot-heading">
                <h2>{districtLabel[slug] ?? slug}</h2>
                <p>{items.length} on this page</p>
              </div>
            )}
            <div className="pick-grid">
              {items.map((venue) => (
                <PlaceCard key={venue.slug} place={toCard(venue)} />
              ))}
            </div>
          </section>
        ))
      )}

      {totalMatches === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">
          Nothing matches that combination yet{nearby.length > 0 ? " inside this district — but your brief matched nearby:" : ". Clear a filter to widen the map."}
        </p>
      ) : null}

      {nearby.length > 0 ? (
        // The same brief matched just outside the active district. Each card
        // names its own district; no travel-time claims — navigation and ETA
        // belong to Google Maps (guardrail #1).
        <section className="nearby-section" aria-label={`Nearby — outside ${districtLabel[filters.district] ?? filters.district}`}>
          <div className="nearby-rule">
            <span>Nearby — outside {districtLabel[filters.district] ?? filters.district}</span>
          </div>
          <div className="pick-grid">
            {nearby.map((venue) => (
              <div key={venue.slug}>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {districtLabel[venue.district] ?? venue.district}
                </p>
                <PlaceCard place={toCard(venue)} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Catalogue pages">
          {page > 1 ? (
            <Link href={catalogueHref(filters, { page: page - 1 })} className="quiet-link min-h-11 px-4 py-3">
              ← Previous
            </Link>
          ) : null}
          <span className="text-sm text-[var(--muted)]">Page {page} of {totalPages}</span>
          {page < totalPages ? (
            <Link href={catalogueHref(filters, { page: page + 1 })} className="quiet-link min-h-11 px-4 py-3">
              Next →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
}
