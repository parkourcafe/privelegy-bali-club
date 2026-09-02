import Link from "next/link";
import type { Venue } from "@/lib/types";

// A curated pick, in the shape the guide page standard requires:
//
//   Name · area
//   One editorial sentence — what it is, in facts.
//   Best for: the moment it suits.
//   Not for: the moment it does not.
//   Price band · anchor
//
// These guides previously rendered `Name · area` and nothing else, which is why
// they read as a catalogue rather than a list of picks. `Not for` is rendered
// wherever the record holds it — it is the differentiator, not decoration.
// Nothing here reads tier, partner status or isSponsored: placement on this
// list cannot be bought.

function priceLine(v: Venue): string | null {
  const anchor = v.priceAnchor?.trim() || v.priceText?.trim();
  if (anchor) return anchor;
  if (v.priceMinIdr && v.priceMaxIdr) {
    return `${Math.round(v.priceMinIdr / 1000)}–${Math.round(v.priceMaxIdr / 1000)}K IDR`;
  }
  return null;
}

export default function GuidePickList({ venues }: { venues: readonly Venue[] }) {
  return (
    <ul className="mt-2 space-y-4 text-sm">
      {venues.map((v) => {
        const price = priceLine(v);
        return (
          <li key={v.slug}>
            <p>
              <Link href={`/places/${v.slug}`} className="font-semibold text-[var(--ink)]">
                {v.name}
              </Link>
              {v.area ? <span className="text-[var(--muted)]"> · {v.area}</span> : null}
            </p>
            {v.whyItsHere ? <p className="mt-1 leading-relaxed">{v.whyItsHere}</p> : null}
            {v.bestFor ? (
              <p className="mt-1">
                <strong>Best for:</strong> {v.bestFor}
              </p>
            ) : null}
            {v.notFor ? (
              <p className="mt-1 text-[var(--muted)]">
                <strong>Not for:</strong> {v.notFor}
              </p>
            ) : null}
            {price ? <p className="mt-1 text-[var(--muted)]">{price}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}
