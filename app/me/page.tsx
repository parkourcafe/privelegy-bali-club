import Link from "next/link";
import { readGuestRef } from "@/lib/guest-server";
import { getMyRedemptions } from "@/lib/data";

export const dynamic = "force-dynamic";

// "My perks" — a guest's own redeemed perks. Identity is the httpOnly cookie;
// no login, no localStorage. Empty until the guest redeems something.
export default async function MyPerksPage() {
  const ref = await readGuestRef();
  const perks = ref ? await getMyRedemptions(ref) : [];

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Link href="/" className="quiet-link">
        ← Back to the guide
      </Link>
      <h1 className="mt-3 text-3xl font-[560] [font-family:var(--font-display)]">My perks</h1>
      <p className="mt-1 text-xs text-[var(--muted)]">Perks you have redeemed on this device.</p>

      {perks.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--muted)]">
          Nothing yet. Redeem a perk at a venue and it will show up here.
          <div className="mt-4">
            <Link href="/" className="quiet-link">
              Browse the Canggu guide
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {perks.map((p, i) => (
            <li key={i} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{p.venueName}</p>
                  <p className="text-sm text-[var(--muted)]">{p.perkTitle}</p>
                  <p className="mt-1 text-xs text-[var(--muted)] opacity-70">
                    {p.ts ? new Date(p.ts).toLocaleString() : ""}
                  </p>
                </div>
                <span className="rounded-lg bg-[rgba(11,109,114,0.1)] px-2 py-1 font-mono text-sm font-bold text-[var(--lagoon-strong)]">
                  {p.confirmCode}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
