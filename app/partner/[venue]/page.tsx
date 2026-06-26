import Link from "next/link";
import { getVenueWithPerk, getVenueRedemptionCount } from "@/lib/data";

export const dynamic = "force-dynamic";

// NOTE: No partner auth yet — this is intentionally deferred (auth/roles are a
// later gate, master-doc §19). For G1 this view exists to show a real partner
// their real redemption count: aggregate by default (privacy). Do not expose
// per-guest detail here.

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue: slug } = await params;
  const venue = await getVenueWithPerk(slug);
  if (!venue) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Venue not found</h1>
      </main>
    );
  }

  const count = await getVenueRedemptionCount(slug);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Partner view
      </p>
      <h1 className="mt-1 text-2xl font-bold">{venue.name}</h1>
      <p className="text-xs text-stone-500">{venue.address}</p>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
        <p className="text-xs uppercase tracking-widest text-stone-500">
          Guests who redeemed here
        </p>
        {count === null ? (
          <p className="mt-2 text-sm text-stone-400">
            Backend not configured — no live count yet.
          </p>
        ) : (
          <p className="mt-1 text-6xl font-bold tabular-nums text-stone-900">
            {count}
          </p>
        )}
        <p className="mt-2 text-xs text-stone-500">
          Each is a real guest who showed up because of Bali Privilege.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-stone-100 p-4 text-sm text-stone-600">
        You pay nothing until these are real and you can see them. Aggregate only
        — we never share who your guests are.
      </div>

      <div className="mt-6 flex gap-2 text-sm">
        <Link
          href={`/admin/qr/${slug}`}
          className="rounded-lg bg-cyan-700 px-3 py-2 font-medium text-white"
        >
          Counter QR poster
        </Link>
        <Link
          href={`/v/${slug}/redeem`}
          className="rounded-lg border border-stone-200 px-3 py-2 font-medium text-stone-700"
        >
          Guest redeem view
        </Link>
      </div>
    </main>
  );
}
