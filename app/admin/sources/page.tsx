import Link from "next/link";
import { getSourceBreakdown, type SourceRow } from "@/lib/admin-sources";

export const dynamic = "force-dynamic";

// Founder-facing source breakdown (P0-1). Shows the funnel per acquisition
// source (villa_canggu_01…20, meta_au, creator_*, …) over a window, so the
// field/QR and campaign channels can be read at a glance. Aggregate only.

const WINDOWS = [7, 30, 90];

export default async function SourcesDashboard({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days } = await searchParams;
  const window = WINDOWS.includes(Number(days)) ? Number(days) : 30;
  const data = await getSourceBreakdown(window);

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Source breakdown unavailable</h1>
        <p className="mt-2 text-sm text-stone-500">
          Backend not reachable, or the events table is empty in this environment.
        </p>
        <Link href="/admin" className="mt-4 inline-block text-cyan-700 underline">
          ← Field Kit
        </Link>
      </main>
    );
  }

  const active = data.rows.filter((r) => r.total > 0 && r.source !== "(none)");
  const idle = data.rows.filter((r) => r.total === 0 && r.issued);
  const none = data.rows.find((r) => r.source === "(none)");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <h1 className="mt-2 text-2xl font-bold">Source attribution</h1>
      <p className="text-xs text-stone-500">
        Funnel per acquisition source (first-touch). Last {data.days} days ·{" "}
        {data.eventsScanned.toLocaleString()} events
        {data.truncated ? " (capped)" : ""}.
      </p>

      {/* Window switch */}
      <div className="mt-4 flex gap-2">
        {WINDOWS.map((w) => (
          <Link
            key={w}
            href={`/admin/sources?days=${w}`}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              w === data.days
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {w}d
          </Link>
        ))}
      </div>

      <SourceTable
        caption="Active sources"
        rows={active}
        empty="No attributed events in this window yet."
      />

      {none && none.total > 0 ? (
        <>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Unattributed
          </h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                <Row row={none} />
              </tbody>
            </table>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            Direct/organic visits, or arrivals before the cookie banner was
            accepted (funnel events are consent-gated; the source scan is not).
          </p>
        </>
      ) : null}

      {idle.length > 0 ? (
        <>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
            Issued · no activity yet ({idle.length})
          </h2>
          <p className="mt-2 text-xs text-stone-500">
            {idle.map((r) => r.source).join(" · ")}
          </p>
        </>
      ) : null}

      <p className="mt-6 text-xs text-stone-400">
        Growth-only. Not partner-proof: a click is intent, not a billable result
        (a seated reservation is confirmed in the Money gate dashboard).
      </p>
    </main>
  );
}

function SourceTable({
  caption,
  rows,
  empty,
}: {
  caption: string;
  rows: SourceRow[];
  empty: string;
}) {
  return (
    <>
      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        {caption}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-stone-500">{empty}</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 text-xs text-stone-500">
              <tr>
                <th className="p-2 text-left font-medium">Source</th>
                <th className="p-2 text-right font-medium">Scan</th>
                <th className="p-2 text-right font-medium">Landing</th>
                <th className="p-2 text-right font-medium">Card</th>
                <th className="p-2 text-right font-medium">Directions</th>
                <th className="p-2 text-right font-medium text-cyan-700">Reserve</th>
                <th className="p-2 text-right font-medium">Redeem</th>
                <th className="p-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <Row key={row.source} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Row({ row }: { row: SourceRow }) {
  return (
    <tr className="border-t border-stone-100">
      <td className="p-2 font-medium">
        {row.source}
        {row.issued && row.source !== "(none)" ? (
          <span className="ml-1 text-[10px] text-stone-400">issued</span>
        ) : null}
      </td>
      <td className="p-2 text-right tabular-nums">{row.scan}</td>
      <td className="p-2 text-right tabular-nums">{row.landing}</td>
      <td className="p-2 text-right tabular-nums">{row.card}</td>
      <td className="p-2 text-right tabular-nums">{row.directions}</td>
      <td className="p-2 text-right font-semibold tabular-nums text-cyan-700">
        {row.reserve}
      </td>
      <td className="p-2 text-right tabular-nums">{row.redeem}</td>
      <td className="p-2 text-right font-semibold tabular-nums">{row.total}</td>
    </tr>
  );
}
