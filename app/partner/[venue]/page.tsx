import Link from "next/link";
import { getVenueWithPerk, getPartnerReport, getVenueRedemptionCount } from "@/lib/data";

export const dynamic = "force-dynamic";

// NOTE: No partner auth yet — intentionally deferred (auth/roles are a later
// gate, master-doc §19). This view shows a partner their real numbers as a
// causal chain (Reach → Intent → Proof, §11): aggregate by default (privacy),
// and crucially it separates redemptions we ATTRIBUTED to an external source
// (we brought them) from in-venue redemptions (engagement only).

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

  const report = await getPartnerReport(slug);
  // Fallback when the attribution migration isn't applied yet.
  const fallbackCount = report ? null : await getVenueRedemptionCount(slug);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Partner report
      </p>
      <h1 className="mt-1 text-2xl font-bold">{venue.name}</h1>
      <p className="text-xs text-stone-500">{venue.address}</p>

      {report ? (
        <>
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-emerald-700">
              Guests we brought you
            </p>
            <p className="mt-1 text-6xl font-bold tabular-nums text-emerald-700">
              {report.externallyAttributed}
            </p>
            <p className="mt-2 text-xs text-emerald-700/80">
              Redeemed here after arriving from a villa / coliving / Reels link —
              not walk-ins who were already inside.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat label="Card opens" value={report.venueCardOpens} sub="Reach" />
            <Stat label="Perk opens" value={report.perkOpens} sub="Intent" />
            <Stat label="Redemptions" value={report.redemptions} sub="Proof" />
          </div>

          <p className="mt-4 text-xs text-stone-500">
            Of {report.redemptions} total redemptions, {report.externallyAttributed}{" "}
            were attributed to us and {report.inVenue} were in-venue (engagement,
            not acquisition)
            {report.creator > 0 && `, and ${report.creator} were creator perks (not counted as proof)`}.
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-widest text-stone-500">
            Guests who redeemed here
          </p>
          {fallbackCount === null ? (
            <p className="mt-2 text-sm text-stone-400">
              Backend not configured — no live count yet.
            </p>
          ) : (
            <p className="mt-1 text-6xl font-bold tabular-nums text-stone-900">
              {fallbackCount}
            </p>
          )}
        </div>
      )}

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

function Stat({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-3">
      <p className="text-[10px] uppercase tracking-widest text-stone-400">{sub}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] text-stone-500">{label}</p>
    </div>
  );
}
