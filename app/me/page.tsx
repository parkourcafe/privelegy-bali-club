import Link from "next/link";
import { readGuestRefForDataAccess } from "@/lib/guest-data-access";
import { getMyRedemptions, getSavedVenues } from "@/lib/data";
import ShareButton from "@/components/ShareButton";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  bar: "Bar",
  surf: "Surf",
};

export const dynamic = "force-dynamic";

// Private per-guest page — also disallowed in robots.ts and absent from the
// sitemap; explicit noindex here is belt-and-suspenders.
export const metadata = {
  title: "My list & offers",
  robots: { index: false, follow: false },
};

// A guest's saved places (§6c) + redeemed offers. Identity is the httpOnly
// cookie; no login, no localStorage (guardrail #10).
export default async function MyPerksPage() {
  const ref = await readGuestRefForDataAccess();
  const [perks, saved] = ref
    ? await Promise.all([getMyRedemptions(ref), getSavedVenues(ref)])
    : [[], []];

  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <Link href="/" className="quiet-link">
          ← Other Bali
        </Link>

        <h1 className="mt-3 font-display text-3xl font-bold">My list</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Places you saved on this device. No account — clear cookies and it resets.
        </p>

        {saved.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--muted)]">
            Nothing saved yet. Tap ♡ on any place to build your list.
            <div className="mt-3">
              <Link href="/uluwatu" className="quiet-link">Explore Uluwatu →</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="mt-6 space-y-2">
              {saved.map((v) => (
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
            <div className="mt-4">
              <ShareButton />
            </div>
          </>
        )}

        <h2 className="mt-10 font-display text-2xl font-bold">My offers</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Venue offers you have redeemed on this device.
        </p>

        {perks.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
            Nothing yet. Redeem a confirmed offer at a venue and it will show up
            here.
            <div className="mt-4">
              <Link href="/plan" className="quiet-link">
                Browse Other Bali →
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {perks.map((p, i) => (
              <li
                key={i}
                className="rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] p-4 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold">{p.venueName}</p>
                    <p className="text-sm text-[var(--muted)]">{p.perkTitle}</p>
                    <p className="mt-1 text-xs text-[var(--ob-stone)]">
                      {p.ts ? new Date(p.ts).toLocaleString() : ""}
                    </p>
                  </div>
                  <span className="rounded-lg bg-[rgba(47,196,214,0.14)] px-2 py-1 font-mono text-sm font-bold text-[var(--ob-accent-2)]">
                    {p.confirmCode}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
