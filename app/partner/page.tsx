import Link from "next/link";
import { redirect } from "next/navigation";
import { getPartnerContext } from "@/lib/partner-context";

export const dynamic = "force-dynamic";

export default async function PartnerWorkspacePage() {
  const context = await getPartnerContext();
  if (!context) redirect("/partner/sign-in");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Other Bali · partner workspace</p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">Your venues</h1>
      <p className="mt-2 text-sm text-stone-600">Signed in as {context.email ?? "venue user"}.</p>

      {!context.schemaAvailable ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          Your sign-in worked, but the partner workspace is waiting for the reviewed production schema migration.
        </div>
      ) : context.venues.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
          No venue has been claimed for this account yet. Ask the Other Bali team for a one-time claim link.
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {context.venues.map((venue) => (
            <li key={venue.venueSlug} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-stone-900">{venue.name}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-stone-500">{venue.district} · {venue.role}</p>
              <Link href={`/partner/venues/${venue.venueSlug}`} className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-cyan-700 px-3 py-2 text-sm font-semibold text-white">Open workspace</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
