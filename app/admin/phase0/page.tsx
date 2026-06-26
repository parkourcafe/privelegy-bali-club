import Link from "next/link";
import { getPhase0Overview } from "@/lib/data";

export const dynamic = "force-dynamic";

// The Phase 0 go/no-go instrument (§22). Three gate numbers:
//  1. redemption rate >= 15-30% of perk_opens
//  2. >= 3 venues with >= 1 externally-attributed redemption
//  3. >= 2 venues willing to continue/pay (manual — tracked off-app)
const RATE_TARGET = 0.15;
const ATTR_VENUE_TARGET = 3;

function pct(n: number, d: number): number {
  return d > 0 ? n / d : 0;
}

export default async function Phase0Dashboard() {
  const o = await getPhase0Overview();

  if (!o) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Gate dashboard unavailable</h1>
        <p className="mt-2 text-sm text-stone-500">
          Backend not reachable or migration 0004 not applied yet.
        </p>
        <Link href="/admin" className="mt-4 inline-block text-cyan-700 underline">
          ← Field Kit
        </Link>
      </main>
    );
  }

  const totalRedemptions = o.funnel.redemption;
  const totalPerkOpens = o.funnel.perkOpen;
  const rate = pct(totalRedemptions, totalPerkOpens);
  const attrVenues = o.venues.filter((v) => v.externallyAttributed > 0).length;
  const totalExternal = o.venues.reduce((s, v) => s + v.externallyAttributed, 0);

  const gate1 = rate >= RATE_TARGET && totalPerkOpens > 0;
  const gate2 = attrVenues >= ATTR_VENUE_TARGET;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Phase 0 gate</h1>
      <p className="text-xs text-stone-500">Live go / no-go — master doc §22</p>

      {/* Gate checks */}
      <div className="mt-5 space-y-2">
        <GateRow
          ok={gate1}
          title="Redemption rate ≥ 15%"
          detail={`${(rate * 100).toFixed(0)}% — ${totalRedemptions} redemptions of ${totalPerkOpens} perk opens`}
        />
        <GateRow
          ok={gate2}
          title={`≥ ${ATTR_VENUE_TARGET} venues with an attributed redemption`}
          detail={`${attrVenues} venue(s) so far · ${totalExternal} externally-attributed total`}
        />
        <GateRow
          ok={null}
          title="≥ 2 venues willing to continue / pay"
          detail="Tracked off-app — confirm in conversation"
        />
      </div>

      {/* Funnel */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Funnel
      </h2>
      <div className="mt-3 grid grid-cols-5 gap-2 text-center">
        <Funnel n={o.funnel.sourceScan} label="source" />
        <Funnel n={o.funnel.landingOpen} label="landing" />
        <Funnel n={o.funnel.venueCardOpen} label="card" />
        <Funnel n={o.funnel.perkOpen} label="perk" />
        <Funnel n={o.funnel.redemption} label="redeem" />
      </div>

      {/* Per-venue */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Per venue
      </h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-100 text-xs text-stone-500">
            <tr>
              <th className="p-2 text-left font-medium">Venue</th>
              <th className="p-2 text-right font-medium">Perk</th>
              <th className="p-2 text-right font-medium">Redeem</th>
              <th className="p-2 text-right font-medium text-emerald-700">Attrib</th>
              <th className="p-2 text-right font-medium">In-venue</th>
            </tr>
          </thead>
          <tbody>
            {o.venues.map((v) => (
              <tr key={v.slug} className="border-t border-stone-100">
                <td className="p-2">{v.name}</td>
                <td className="p-2 text-right tabular-nums">{v.perkOpens}</td>
                <td className="p-2 text-right tabular-nums">{v.redemptions}</td>
                <td className="p-2 text-right font-semibold tabular-nums text-emerald-700">
                  {v.externallyAttributed}
                </td>
                <td className="p-2 text-right tabular-nums text-stone-400">{v.inVenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-stone-400">
        “Attrib” = redeemed after arriving from a source QR (we brought them).
        In-venue = engagement only, excluded from acquisition proof.
      </p>
    </main>
  );
}

function GateRow({ ok, title, detail }: { ok: boolean | null; title: string; detail: string }) {
  const mark = ok === null ? "○" : ok ? "✓" : "✗";
  const color =
    ok === null ? "bg-stone-100 text-stone-500" : ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700";
  return (
    <div className={`flex items-start gap-3 rounded-xl p-3 ${color}`}>
      <span className="text-lg leading-none">{mark}</span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs opacity-80">{detail}</p>
      </div>
    </div>
  );
}

function Funnel({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-2">
      <p className="text-xl font-bold tabular-nums">{n}</p>
      <p className="text-[10px] uppercase tracking-wide text-stone-400">{label}</p>
    </div>
  );
}
