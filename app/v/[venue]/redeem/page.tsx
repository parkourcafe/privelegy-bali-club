import Link from "next/link";
import { getVenueWithPerk } from "@/lib/data";
import RedeemFlow from "./RedeemFlow";

export const dynamic = "force-dynamic";

export default async function RedeemPage({
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
        <Link href="/" className="mt-4 inline-block text-cyan-700 underline">
          Back to your Canggu day
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <Link href="/" className="text-sm text-stone-500 hover:underline">
        ← Your Canggu day
      </Link>

      <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold">{venue.name}</h1>
        <p className="text-xs text-stone-500">{venue.address}</p>

        {venue.perk ? (
          <div className="mt-4 rounded-xl bg-cyan-50 p-4">
            <p className="font-medium text-cyan-900">🎟️ {venue.perk.title}</p>
            <p className="mt-1 text-xs text-cyan-700/80">{venue.perk.terms}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-stone-500">No active perk here right now.</p>
        )}

        <RedeemFlow
          venueSlug={venue.slug}
          venueName={venue.name}
          perkTitle={venue.perk?.title ?? "Perk"}
        />
      </div>

      <p className="mt-4 text-center text-xs text-stone-400">
        Redeem only when you are at the venue. Staff will glance at the
        confirmation — that is the whole check-in.
      </p>
    </main>
  );
}
