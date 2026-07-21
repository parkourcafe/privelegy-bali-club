import type { Metadata } from "next";
import Link from "next/link";
import { getSharedTripVenues } from "@/lib/data";
import TrackedDirectionsLink from "@/components/TrackedDirectionsLink";

export const dynamic = "force-dynamic";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  bar: "Bar",
  surf: "Surf",
};

// A shared list is private-by-link and read-only — keep it out of the index.
export const metadata: Metadata = {
  title: "A shared Bali list",
  robots: { index: false, follow: false },
};

export default async function SharedListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await getSharedTripVenues(slug);
  const days = [...new Set(entries.map((entry) => entry.day))];

  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <Link href="/" className="quiet-link">
          ← Other Bali
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold">A Bali list</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Places someone saved on Other Bali and shared with you.
        </p>

        {entries.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
            This list is empty or the link has expired.
            <div className="mt-4">
              <Link href="/" className="quiet-link">Explore Other Bali →</Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {days.map((day) => (
              <section key={day ?? "saved"}>
                <h2 className="font-display text-xl font-bold">{day ? `Day ${day}` : "Saved for later"}</h2>
                <ol className="mt-2 space-y-2">
                  {entries.filter((entry) => entry.day === day).map((entry) => (
                    <li key={entry.venueSlug} className="rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <Link href={`/places/${entry.venueSlug}`} className="font-semibold text-[var(--ink)]">{entry.venue.name}</Link>
                        <TrackedDirectionsLink href={entry.venue.gmapsUrl} venueSlug={entry.venueSlug} className="quiet-link">Maps</TrackedDirectionsLink>
                      </div>
                      <p className="text-xs text-[var(--muted)]">
                        {categoryLabel[entry.venue.category] ?? entry.venue.category}
                        {entry.venue.area ? ` · ${entry.venue.area}` : ""}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="button-primary button-large">Build your own list</Link>
        </div>
      </main>
    </div>
  );
}
