import Link from "next/link";
import type { StartShortlistItem } from "@/lib/start-shortlist";
import PageViewTracker from "@/components/PageViewTracker";

export default function StartYourShortlist({
  district,
  items,
}: {
  district: string;
  items: StartShortlistItem[];
}) {
  if (items.length === 0) return null;
  const trackingSlug = `start-shortlist/${district.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section className="guide-section" aria-labelledby={`start-${district.toLowerCase().replace(/\s+/g, "-")}`}>
      <PageViewTracker event="shortlist_generated" slug={trackingSlug} />
      <h2 id={`start-${district.toLowerCase().replace(/\s+/g, "-")}`}>Start your shortlist</h2>
      <p className="guide-lede">
        Three useful first choices — enough to start deciding, without turning the guide into another long list.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.slug} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div><dt className="font-bold">Why this place</dt><dd className="text-[var(--muted)]">{item.whyThisPlace}</dd></div>
              <div><dt className="font-bold">Best moment</dt><dd className="text-[var(--muted)]">{item.bestMoment}</dd></div>
              <div><dt className="font-bold">Best audience</dt><dd className="text-[var(--muted)]">{item.bestAudience}</dd></div>
            </dl>
            <Link href={item.primaryAction.href} className="mt-5 inline-flex min-h-11 items-center font-bold text-[var(--lagoon-strong)]">
              {item.primaryAction.label} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
