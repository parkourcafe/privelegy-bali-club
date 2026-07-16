import Link from "next/link";
import { getTablePilotReport } from "@/lib/tablepilot";

const DEFAULT_STAFF_DASHBOARD = "https://tablepilot-id.vercel.app/admin";

function staffDashboardUrl() {
  const configured = process.env.TABLEPILOT_STAFF_DASHBOARD_URL?.trim();
  if (!configured) return DEFAULT_STAFF_DASHBOARD;
  try {
    const url = new URL(configured);
    return url.protocol === "https:" ? url.toString() : DEFAULT_STAFF_DASHBOARD;
  } catch {
    return DEFAULT_STAFF_DASHBOARD;
  }
}

export default async function BookingsPanel({ venueSlug }: { venueSlug: string }) {
  const result = await getTablePilotReport();
  const venueRows = result.report?.reservations.filter((row) => row.venueSlug === venueSlug) ?? [];
  const billable = venueRows.filter((row) => row.billable).length;
  const confirmedNotSeated = venueRows.filter((row) => row.status === "confirmed").length;

  return (
    <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">TablePilot bookings</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">Aggregate attribution only. Guest names, phones, payments and table inventory stay in TablePilot.</p>
        </div>
        <a href={staffDashboardUrl()} target="_blank" rel="noreferrer" className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white">Open staff dashboard</a>
      </div>
      {!result.ok || !result.report ? (
        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">TablePilot report is not available in this environment. The dashboard link remains the source of truth.</p>
      ) : (
        <>
          <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-stone-50 p-3"><dt className="text-xs uppercase tracking-wide text-stone-500">Bookings</dt><dd className="mt-1 text-2xl font-bold text-stone-900">{venueRows.length}</dd></div>
            <div className="rounded-xl bg-stone-50 p-3"><dt className="text-xs uppercase tracking-wide text-stone-500">Confirmed</dt><dd className="mt-1 text-2xl font-bold text-stone-900">{confirmedNotSeated}</dd></div>
            <div className="rounded-xl bg-stone-50 p-3"><dt className="text-xs uppercase tracking-wide text-stone-500">Seated/billable</dt><dd className="mt-1 text-2xl font-bold text-stone-900">{billable}</dd></div>
          </dl>
          {venueRows.length > 0 && <ul className="mt-5 divide-y divide-stone-100 text-sm">{venueRows.map((row) => <li key={row.reservationId} className="flex items-center justify-between gap-3 py-3"><span className="text-stone-600">{new Date(row.startAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" })} · {row.partySize} guests</span><span className="font-medium text-stone-900">{row.status}</span></li>)}</ul>}
        </>
      )}
      <Link href={`/partner/venues/${venueSlug}/analytics`} className="mt-5 inline-block text-sm font-medium text-cyan-800 underline">View aggregate analytics</Link>
    </section>
  );
}
