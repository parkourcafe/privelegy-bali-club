"use client";

import { useMemo, useState } from "react";
import type { PlanBySlot } from "@/lib/data";
import { VIBES } from "@/lib/vibes";
import VenueCard from "@/components/VenueCard";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export default function PlanView({ plan }: { plan: PlanBySlot[] }) {
  const [vibe, setVibe] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    plan.forEach((b) => b.venues.forEach((v) => set.add(v.category)));
    return [...set];
  }, [plan]);

  const filtered = useMemo(
    () =>
      plan
        .map((b) => ({
          ...b,
          venues: b.venues.filter(
            (v) =>
              (!vibe || (v.vibeTags ?? []).includes(vibe)) &&
              (!category || v.category === category)
          ),
        }))
        .filter((b) => b.venues.length > 0),
    [plan, vibe, category]
  );

  return (
    <>
      <div className="filter-panel">
        <Chips
          label="Vibe"
          options={VIBES as readonly string[]}
          selected={vibe}
          onSelect={setVibe}
        />
        <Chips
          label="Type"
          options={categories}
          selected={category}
          onSelect={setCategory}
          render={(c) => categoryLabel[c] ?? c}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--muted)]">
          Nothing matches that combo. Clear a filter.
        </p>
      ) : (
        <div>
          {filtered.map((block) => (
            <section key={block.slot} className="slot-section">
              <div className="slot-heading">
                <h2>{block.label}</h2>
                <p>{block.hint}</p>
              </div>
              <ul className="venue-list">
                {block.venues.map((v) => (
                  <li key={v.slug}>
                    <VenueCard v={v} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
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
  onSelect: (v: string | null) => void;
  render?: (v: string) => string;
}) {
  if (options.length === 0) return null;
  return (
    <div className="chip-row">
      <span className="chip-label">{label}</span>
      {options.map((o) => {
        const on = selected === o;
        return (
          <button
            key={o}
            onClick={() => onSelect(on ? null : o)}
            className={`chip ${on ? "chip-active" : ""}`}
          >
            {render ? render(o) : o}
          </button>
        );
      })}
    </div>
  );
}
