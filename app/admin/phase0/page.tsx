import Link from "next/link";
import { getPhase0Overview } from "@/lib/data";
import { getTablePilotReport } from "@/lib/tablepilot";

export const dynamic = "force-dynamic";

// Money model v0.3 Phase 0: intent -> TablePilot reservation -> seated.
// QR redemption remains an independent arrival proof, not the billed event.
const INTENT_TARGET = 1;
const RESERVATION_TARGET = 1;
const SEATED_TARGET = 1;

export default async function Phase0Dashboard() {
  const [o, tablepilot] = await Promise.all([getPhase0Overview(), getTablePilotReport()]);

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
  const totalExternal = o.venues.reduce((s, v) => s + v.externallyAttributed, 0);
  const totalCreator = o.venues.reduce((s, v) => s + v.creator, 0);
  const report = tablepilot.report;
  const reservationTotal = report?.summary.total ?? 0;
  const seatedTotal = report?.summary.billable ?? 0;
  const confirmedNotSeated = report?.summary.confirmedNotSeated ?? 0;

  const gate1 = o.funnel.reservationClick >= INTENT_TARGET;
  const gate2 = tablepilot.ok && reservationTotal >= RESERVATION_TARGET;
  const gate3 = tablepilot.ok && seatedTotal >= SEATED_TARGET;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Phase 0 money gate</h1>
      <p className="text-xs text-stone-500">
        Intent → reservation → seated. QR redemption is proof, not billing.
      </p>

      {/* Gate checks */}
      <div className="mt-5 space-y-2">
        <GateRow
          ok={gate1}
          title="Intent: Reserve clicks exist"
          detail={`${o.funnel.reservationClick} Reserve click(s) logged in BP`}
        />
        <GateRow
          ok={gate2}
          title="Reservation: TablePilot reports BP bookings"
          detail={tablepilotDetail(tablepilot, `${reservationTotal} booking(s) with source=bali_privilege`)}
        />
        <GateRow
          ok={gate3}
          title="Seated: at least one billable reservation"
          detail={
            tablepilot.ok
              ? `${seatedTotal} seated · ${confirmedNotSeated} confirmed-not-seated`
              : "Waiting for the aggregate TablePilot report"
          }
        />
      </div>

      {/* Funnel */}
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        BP intent funnel
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center sm:grid-cols-7">
        <Funnel n={o.funnel.sourceScan} label="source" />
        <Funnel n={o.funnel.landingOpen} label="landing" />
        <Funnel n={o.funnel.venueCardOpen} label="card" />
        <Funnel n={o.funnel.perkOpen} label="perk" />
        <Funnel n={o.funnel.directionClick} label="directions" />
        <Funnel n={o.funnel.reservationClick} label="reserve" />
        <Funnel n={o.funnel.redemption} label="redeem" />
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        TablePilot report
      </h2>
      <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4">
        {!tablepilot.ok ? (
          <p className="text-sm text-stone-600">{tablepilotDetail(tablepilot)}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center">
            <Funnel n={reservationTotal} label="BP bookings" />
            <Funnel n={seatedTotal} label="seated" />
            <Funnel n={confirmedNotSeated} label="confirmed" />
          </div>
        )}
        <p className="mt-3 text-xs text-stone-400">
          Pulled aggregate-only from TablePilot. No guest names, phones, guest ids,
          fees, invoices, or tourist payments live here.
        </p>
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        QR proof, separate from billing
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Funnel n={totalRedemptions} label="redeem" />
        <Funnel n={totalExternal} label="external" />
        <Funnel n={totalCreator} label="creator" />
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
              <th className="p-2 text-right font-medium">Directions</th>
              <th className="p-2 text-right font-medium">Reserve</th>
              <th className="p-2 text-right font-medium">Perk</th>
              <th className="p-2 text-right font-medium">Redeem</th>
              <th className="p-2 text-right font-medium text-emerald-700">Attrib</th>
              <th className="p-2 text-right font-medium">In-venue</th>
              <th className="p-2 text-right font-medium">Creator</th>
            </tr>
          </thead>
          <tbody>
            {o.venues.map((v) => (
              <tr key={v.slug} className="border-t border-stone-100">
                <td className="p-2">{v.name}</td>
                <td className="p-2 text-right tabular-nums">{v.directionClicks}</td>
                <td className="p-2 text-right font-semibold tabular-nums text-cyan-700">
                  {v.reservationClicks}
                </td>
                <td className="p-2 text-right tabular-nums">{v.perkOpens}</td>
                <td className="p-2 text-right tabular-nums">{v.redemptions}</td>
                <td className="p-2 text-right font-semibold tabular-nums text-emerald-700">
                  {v.externallyAttributed}
                </td>
                <td className="p-2 text-right tabular-nums text-stone-400">{v.inVenue}</td>
                <td className="p-2 text-right tabular-nums text-stone-400">{v.creator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-stone-400">
        Reserve = BP demand before handoff. Attrib = external QR proof. In-venue
        and creator are separate buckets and excluded from partner-proof.
      </p>
    </main>
  );
}

function tablepilotDetail(tablepilot: Awaited<ReturnType<typeof getTablePilotReport>>, okText?: string): string {
  if (tablepilot.ok) return okText ?? "TablePilot report connected";
  if (!tablepilot.configured) return "Set TABLEPILOT_PARTNER_TOKEN to pull the aggregate TablePilot report.";
  if (tablepilot.status) return `TablePilot report unavailable (${tablepilot.status}).`;
  return "TablePilot report unreachable from this runtime.";
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
