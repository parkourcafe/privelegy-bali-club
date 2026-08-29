"use client";

import { useDeferredValue, useMemo, useState } from "react";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import {
  distanceKm,
  formatDistance,
  WELLNESS_AREA_OPTIONS,
  WELLNESS_KIND_OPTIONS,
  wellnessArea,
  wellnessKinds,
  wellnessPrice,
  type WellnessArea,
  type WellnessKind,
  type WellnessPrice,
} from "@/lib/wellness-finder";

export type WellnessFinderVenue = PlaceCardData & {
  latitude?: number;
  longitude?: number;
  filterPrice?: string;
};

type GeoState =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "found"; latitude: number; longitude: number }
  | { kind: "denied" }
  | { kind: "unavailable" }
  | { kind: "timeout" };

type SortMode = "name" | "nearest" | "price";
type EnrichedVenue = WellnessFinderVenue & {
  areaGroup: WellnessArea;
  kinds: WellnessKind[];
  priceLevel: WellnessPrice;
  searchText: string;
  distance?: number;
};

const PRICE_OPTIONS: { value: WellnessPrice; label: string }[] = [
  { value: "$", label: "$ · Budget" },
  { value: "$$", label: "$$ · Mid-range" },
  { value: "$$$", label: "$$$ · Premium" },
  { value: "$$$$", label: "$$$$ · Luxury" },
  { value: "unlisted", label: "Price not listed" },
];

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none">
      <path d="M12 21s6-5.6 6-12a6 6 0 1 0-12 0c0 6.4 6 12 6 12Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="9" r="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function countLabel(count: number): string {
  return `${count} ${count === 1 ? "place" : "places"}`;
}

export default function WellnessFinder({ venues }: { venues: WellnessFinderVenue[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("en"));
  const [area, setArea] = useState<WellnessArea | "all">("all");
  const [kind, setKind] = useState<WellnessKind | "all">("all");
  const [price, setPrice] = useState<WellnessPrice | "all">("all");
  const [sort, setSort] = useState<SortMode>("name");
  const [geo, setGeo] = useState<GeoState>({ kind: "idle" });

  const enriched = useMemo<EnrichedVenue[]>(() => venues.map((venue) => {
    const kinds = wellnessKinds(venue);
    return {
      ...venue,
      areaGroup: wellnessArea(venue.microArea),
      kinds,
      priceLevel: wellnessPrice(venue.filterPrice ?? venue.priceBand),
      searchText: [
        venue.name,
        venue.microArea,
        venue.editorialLine,
        venue.bestFor,
        venue.priceBand,
        ...kinds,
      ].filter(Boolean).join(" ").toLocaleLowerCase("en"),
    };
  }), [venues]);

  const areaCounts = useMemo(() => new Map(
    WELLNESS_AREA_OPTIONS.map((option) => [
      option.value,
      enriched.filter((venue) => venue.areaGroup === option.value).length,
    ]),
  ), [enriched]);

  const kindCounts = useMemo(() => new Map(
    WELLNESS_KIND_OPTIONS.map((option) => [
      option.value,
      enriched.filter((venue) => venue.kinds.includes(option.value)).length,
    ]),
  ), [enriched]);

  const priceCounts = useMemo(() => new Map(
    PRICE_OPTIONS.map((option) => [
      option.value,
      enriched.filter((venue) => venue.priceLevel === option.value).length,
    ]),
  ), [enriched]);

  const results = useMemo(() => {
    const origin = geo.kind === "found"
      ? { latitude: geo.latitude, longitude: geo.longitude }
      : null;
    const filtered = enriched
      .filter((venue) => !deferredQuery || deferredQuery.split(/\s+/).every((term) => venue.searchText.includes(term)))
      .filter((venue) => area === "all" || venue.areaGroup === area)
      .filter((venue) => kind === "all" || venue.kinds.includes(kind))
      .filter((venue) => price === "all" || venue.priceLevel === price)
      .map((venue): EnrichedVenue => {
        if (!origin || venue.latitude == null || venue.longitude == null) return venue;
        return {
          ...venue,
          distance: distanceKm(origin, { latitude: venue.latitude, longitude: venue.longitude }),
        };
      });

    return filtered.sort((a, b) => {
      if (sort === "nearest") {
        const distanceOrder = (a.distance ?? Number.POSITIVE_INFINITY) - (b.distance ?? Number.POSITIVE_INFINITY);
        if (distanceOrder !== 0) return distanceOrder;
      }
      if (sort === "price") {
        const priceOrder = ["$", "$$", "$$$", "$$$$", "unlisted"];
        const priceDifference = priceOrder.indexOf(a.priceLevel) - priceOrder.indexOf(b.priceLevel);
        if (priceDifference !== 0) return priceDifference;
      }
      return a.name.localeCompare(b.name);
    });
  }, [area, deferredQuery, enriched, geo, kind, price, sort]);

  const coordinateCount = enriched.filter((venue) => venue.latitude != null && venue.longitude != null).length;
  const activeFilterCount = Number(Boolean(query)) + Number(area !== "all") + Number(kind !== "all") + Number(price !== "all");

  function useMyLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo({ kind: "unavailable" });
      return;
    }
    setGeo({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGeo({ kind: "found", latitude: coords.latitude, longitude: coords.longitude });
        setSort("nearest");
      },
      (error) => setGeo(error.code === error.TIMEOUT ? { kind: "timeout" } : { kind: "denied" }),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }

  function reset() {
    setQuery("");
    setArea("all");
    setKind("all");
    setPrice("all");
    setSort("name");
    setGeo({ kind: "idle" });
  }

  const geoMessage = geo.kind === "locating"
    ? "Finding your location…"
    : geo.kind === "found"
      ? coordinateCount > 0
        ? `Sorted by distance. ${coordinateCount} places have verified coordinates.`
        : "These listings do not have verified coordinates yet. Choose a neighbourhood instead."
      : geo.kind === "denied"
        ? "Location permission wasn't granted. Choose a neighbourhood instead."
        : geo.kind === "timeout"
          ? "Location took too long. Try again or choose a neighbourhood."
          : geo.kind === "unavailable"
            ? "Location isn't available on this device. Choose a neighbourhood instead."
            : "Your location is used once in this browser and is not stored.";

  return (
    <div className="wellness-finder">
      <div className="wellness-finder-heading">
        <div>
          <h3>Find the right place for you</h3>
          <p>Search by treatment or studio, narrow Ubud by neighbourhood and budget, or sort verified locations by distance.</p>
        </div>
        {(activeFilterCount > 0 || geo.kind === "found") && (
          <button type="button" className="wellness-reset" onClick={reset}>Reset all</button>
        )}
      </div>

      <div className="wellness-search-row">
        <label className="wellness-search">
          <span className="sr-only">Search yoga and wellness places</span>
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search studio, spa, treatment or neighbourhood"
            maxLength={80}
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          className="wellness-location-button"
          onClick={useMyLocation}
          disabled={geo.kind === "locating"}
        >
          <LocationIcon />
          {geo.kind === "locating" ? "Locating…" : geo.kind === "found" ? "Location on" : "Near me"}
        </button>
      </div>
      <p className="wellness-geo-status" aria-live="polite">{geoMessage}</p>

      <fieldset className="wellness-filter-group">
        <legend>What are you looking for?</legend>
        <div className="wellness-chip-row">
          <button type="button" className={kind === "all" ? "chip chip-active" : "chip"} aria-pressed={kind === "all"} onClick={() => setKind("all")}>All wellness</button>
          {WELLNESS_KIND_OPTIONS.map((option) => {
            const count = kindCounts.get(option.value) ?? 0;
            if (count === 0) return null;
            return (
              <button key={option.value} type="button" className={kind === option.value ? "chip chip-active" : "chip"} aria-pressed={kind === option.value} onClick={() => setKind(option.value)}>
                {option.label} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="wellness-filter-group">
        <legend>Which part of Ubud?</legend>
        <div className="wellness-chip-row">
          <button type="button" className={area === "all" ? "chip chip-active" : "chip"} aria-pressed={area === "all"} onClick={() => setArea("all")}>All Ubud</button>
          {WELLNESS_AREA_OPTIONS.map((option) => {
            const count = areaCounts.get(option.value) ?? 0;
            if (count === 0) return null;
            return (
              <button key={option.value} type="button" className={area === option.value ? "chip chip-active" : "chip"} aria-pressed={area === option.value} onClick={() => setArea(option.value)}>
                {option.label} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="wellness-filter-group">
        <legend>What&apos;s your budget?</legend>
        <div className="wellness-chip-row">
          <button type="button" className={price === "all" ? "chip chip-active" : "chip"} aria-pressed={price === "all"} onClick={() => setPrice("all")}>Any price</button>
          {PRICE_OPTIONS.map((option) => {
            const count = priceCounts.get(option.value) ?? 0;
            if (count === 0) return null;
            return (
              <button key={option.value} type="button" className={price === option.value ? "chip chip-active" : "chip"} aria-pressed={price === option.value} onClick={() => setPrice(option.value)}>
                {option.label} <span>{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="wellness-results-bar">
        <p aria-live="polite"><strong>{countLabel(results.length)}</strong>{activeFilterCount > 0 ? ` matching ${activeFilterCount} ${activeFilterCount === 1 ? "filter" : "filters"}` : " in this guide"}</p>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
            <option value="name">Name A–Z</option>
            <option value="nearest" disabled={geo.kind !== "found"}>Nearest first</option>
            <option value="price">Price low to high</option>
          </select>
        </label>
      </div>

      {results.length === 0 ? (
        <div className="wellness-empty">
          <h3>No exact match yet</h3>
          <p>Try a broader treatment, another Ubud neighbourhood or any price.</p>
          <button type="button" className="button-secondary" onClick={reset}>Show all wellness places</button>
        </div>
      ) : (
        <div className="pick-grid wellness-result-grid">
          {results.map((venue, index) => (
            <PlaceCard
              key={venue.slug}
              place={{
                ...venue,
                proximityLabel: venue.distance == null ? undefined : formatDistance(venue.distance),
              }}
              priority={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
