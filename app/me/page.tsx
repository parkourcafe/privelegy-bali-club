import Link from "next/link";
import { readGuestRef } from "@/lib/guest-server";
import { getMyRedemptions } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "My offers" };

// "My offers" — a guest's own redeemed offers. Identity is the httpOnly cookie;
// no login, no localStorage. Empty until the guest redeems something.
export default async function MyPerksPage() {
  const ref = await readGuestRef();
  const perks = ref ? await getMyRedemptions(ref) : [];

  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-md px-4 py-10">
        <Link href="/plan" className="quiet-link">
          ← Your Canggu day
        </Link>
        <h1 className="mt-3 font-display text-3xl font-bold">My offers</h1>
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
