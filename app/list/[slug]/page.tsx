import type { Metadata } from "next";
import Link from "next/link";
import { getSharedListSlugs, getVenuesBySlugs } from "@/lib/data";

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
  const venues = await getVenuesBySlugs(await getSharedListSlugs(slug));

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

        {venues.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
            This list is empty or the link has expired.
            <div className="mt-4">
              <Link href="/" className="quiet-link">Explore Other Bali →</Link>
            </div>
          </div>
        ) : (
          <ul className="mt-6 space-y-2">
            {venues.map((v) => (
              <li key={v.slug} className="rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] p-3">
                <Link href={`/places/${v.slug}`} className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-[var(--ink)]">{v.name}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {categoryLabel[v.category] ?? v.category}
                    {v.area ? ` · ${v.area}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Link href="/" className="button-primary button-large">Build your own list</Link>
        </div>
      </main>
    </div>
  );
}
