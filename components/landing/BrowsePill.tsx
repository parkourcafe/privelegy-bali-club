"use client";

import { useState } from "react";
import Link from "next/link";

// The Where · Taste · Moment browse pill (design "search pill"). A compact,
// three-axis entry point that maps to the site's three real browse surfaces:
// districts, taste collections and moment collections. Purely navigational —
// picking a chip is a Link, so it works without JS (the first axis renders
// expanded) and needs no client data fetching. Options come from the server.

export interface BrowseOption {
  label: string;
  href: string;
}

type Axis = "where" | "taste" | "moment";

const AXES: { key: Axis; label: string; hint: string }[] = [
  { key: "where", label: "Where", hint: "Pick an area" },
  { key: "taste", label: "Taste", hint: "Pick a craving" },
  { key: "moment", label: "Moment", hint: "Pick the night" },
];

export default function BrowsePill({
  where,
  taste,
  moment,
}: {
  where: BrowseOption[];
  taste: BrowseOption[];
  moment: BrowseOption[];
}) {
  const [active, setActive] = useState<Axis>("where");
  const options = active === "where" ? where : active === "taste" ? taste : moment;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="ob-browse-pill">
        {AXES.map((axis) => (
          <button
            key={axis.key}
            type="button"
            onClick={() => setActive(axis.key)}
            aria-pressed={active === axis.key}
            className="ob-browse-seg"
            data-active={active === axis.key ? "true" : "false"}
          >
            <span className="ob-browse-seg-label">{axis.label}</span>
            <span className="ob-browse-seg-hint">{axis.hint}</span>
          </button>
        ))}
      </div>

      <div className="ob-browse-panel" role="region" aria-label={`Browse by ${active}`}>
        {options.map((o) => (
          <Link key={o.href + o.label} href={o.href} className="ob-browse-chip">
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
