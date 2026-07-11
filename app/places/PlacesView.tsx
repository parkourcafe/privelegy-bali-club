"use client";

import { useMemo, useState } from "react";
import type { VenueWithPerk } from "@/lib/data";
import VenueCard from "@/components/VenueCard";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
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
};

export default function PlacesView({
  venues,
  initialFilters,
}: {
  venues: VenueWithPerk[];
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

  const districts = useMemo(
    () => [...new Set(venues.map((v) => v.district))].sort(),
    [venues]
  );
  const categories = useMemo(
    () => [...new Set(venues.map((v) => v.category))].sort(),
    [venues]
  );

  const filtered = useMemo(() => {
    const tokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    return venues.filter((v) => {
      const haystack = [
        v.name,
        v.address,
        v.area,
        v.category,
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
      return (
        (!district || v.district === district) &&
        (!category || v.category === category) &&
        (tokens.length === 0 ||
          (intentMode
            ? tokens.some((token) => haystack.includes(token))
            : tokens.every((token) => haystack.includes(token))))
      );
    });
  }, [venues, query, district, category, intentMode]);

  const grouped = useMemo(() => {
    const map = new Map<string, VenueWithPerk[]>();
    for (const venue of filtered) {
      const list = map.get(venue.district) ?? [];
      list.push(venue);
      map.set(venue.district, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <section className="scroll-mt-8">
      <div className="filter-panel">
        <label className="min-w-[220px] flex-1">
          <span className="chip-label">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Place, area, vibe..."
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--lagoon)]"
          />
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

      <p className="mt-4 text-sm text-[var(--muted)]">
        Showing {filtered.length} of {venues.length} places.
      </p>

      {grouped.map(([slug, items]) => (
        <section key={slug} className="slot-section">
          <div className="slot-heading">
            <h2>{districtLabel[slug] ?? slug}</h2>
            <p>{items.length} places</p>
          </div>
          <ul className="venue-list">
            {items.map((v) => (
              <li key={v.slug}>
                <VenueCard
                  v={v}
                  showSimilar={false}
                  actionMode="directions"
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
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
