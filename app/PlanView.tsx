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
      <div className="mb-6 space-y-2">
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
        <p className="py-10 text-center text-sm text-stone-500">
          Nothing matches that combo. Clear a filter.
        </p>
      ) : (
        <div className="space-y-10">
          {filtered.map((block) => (
            <section key={block.slot}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="font-display text-xl font-semibold">{block.label}</h2>
                <span className="text-xs text-stone-500">{block.hint}</span>
              </div>
              <ul className="space-y-3">
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
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
        {label}
      </span>
      {options.map((o) => {
        const on = selected === o;
        return (
          <button
            key={o}
            onClick={() => onSelect(on ? null : o)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              on
                ? "bg-cyan-700 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            {render ? render(o) : o}
          </button>
        );
      })}
    </div>
  );
}
