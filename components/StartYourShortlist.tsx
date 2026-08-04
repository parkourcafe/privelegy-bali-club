import Link from "next/link";
import PlaceCard, { type PlaceCardData } from "@/components/PlaceCard";
import type { StartShortlistItem } from "@/lib/start-shortlist";
import PageViewTracker from "@/components/PageViewTracker";

export default function StartYourShortlist({
  district,
  items,
  visualPlaces,
}: {
  district: string;
  items: StartShortlistItem[];
  visualPlaces?: PlaceCardData[];
}) {
  if (items.length === 0) return null;
  const trackingSlug = `start-shortlist/${district.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section className="guide-section" aria-labelledby={`start-${district.toLowerCase().replace(/\s+/g, "-")}`}>
      <PageViewTracker event="shortlist_generated" slug={trackingSlug} />
      <h2 id={`start-${district.toLowerCase().replace(/\s+/g, "-")}`}>Start your shortlist</h2>
      <p className="guide-lede">
        Three useful first choices. Open one to see the full verdict.
      </p>
      {visualPlaces?.length ? (
        <div className="pick-grid pick-grid-3 canggu-shortlist-grid">
          {visualPlaces.map((place) => (
            <PlaceCard key={place.slug} place={place} visualFirst />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <p className="eyebrow">{item.bestMoment}</p>
              <h3 className="mt-2 text-lg font-bold">{item.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.whyThisPlace}</p>
              <Link href={item.primaryAction.href} className="mt-5 inline-flex min-h-11 items-center font-bold text-[var(--lagoon-strong)]">
                {item.primaryAction.label} →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
