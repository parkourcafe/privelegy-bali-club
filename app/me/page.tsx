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
      <Link href="/" className="text-sm text-stone-500 hover:underline">
        ← Your Canggu day
      </Link>
      <h1 className="mt-3 text-2xl font-bold">My perks</h1>
      <p className="text-xs text-stone-500">Perks you have redeemed on this device.</p>

      {perks.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
          Nothing yet. Redeem a perk at a venue and it will show up here.
          <div className="mt-4">
            <Link href="/" className="text-cyan-700 underline">
              Browse Canggu perks
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {perks.map((p, i) => (
            <li key={i} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{p.venueName}</p>
                  <p className="text-sm text-stone-600">{p.perkTitle}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {p.ts ? new Date(p.ts).toLocaleString() : ""}
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 px-2 py-1 font-mono text-sm font-bold text-emerald-700">
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
