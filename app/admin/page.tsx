import Link from "next/link";
import { getVenuesList } from "@/lib/data";

export const dynamic = "force-dynamic";

// Operator Field Kit index. No auth yet (deferred, §19) — aggregate/operational
// only, no guest PII. Print posters from here, watch the gate at /admin/phase0.
const SOURCE_PRESETS = ["villa_01", "villa_02", "coliving_01", "reels_001", "flyer_01"];

export default async function AdminIndex() {
  const venues = await getVenuesList();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Field Kit · operator
      </p>
      <h1 className="mt-1 text-2xl font-bold">Phase 0 control</h1>

      <Link
        href="/admin/phase0"
        className="mt-4 flex items-center justify-between rounded-2xl bg-cyan-700 p-4 text-white"
      >
        <span className="font-semibold">→ Gate dashboard (go / no-go)</span>
        <span className="text-cyan-100">§22</span>
      </Link>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Venues ({venues.length}) — counter QR
      </h2>
      <ul className="mt-3 space-y-2">
        {venues.map((v) => (
          <li
            key={v.slug}
            className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{v.name}</p>
              <p className="truncate text-xs text-stone-500">
                {v.perk ? v.perk.title : "no perk"}
              </p>
            </div>
            <div className="flex shrink-0 gap-1 text-xs">
              <Link href={`/admin/invite/${v.slug}`} className="rounded-lg bg-emerald-600 px-2 py-1.5 font-medium text-white">
                Invite
              </Link>
              <Link href={`/admin/qr/${v.slug}`} className="rounded-lg bg-cyan-700 px-2 py-1.5 font-medium text-white">
                QR
              </Link>
              <Link href={`/partner/${v.slug}`} className="rounded-lg border border-stone-200 px-2 py-1.5 text-stone-700">
                Report
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Source QR (villa / coliving / Reels)
      </h2>
      <p className="mt-1 text-xs text-stone-500">
        Unique tag per location — this is what proves attribution (§22). Add any
        tag by visiting <code>/admin/qr/source/&lt;tag&gt;</code>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SOURCE_PRESETS.map((s) => (
          <Link
            key={s}
            href={`/admin/qr/source/${s}`}
            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700"
          >
            {s}
          </Link>
        ))}
      </div>
    </main>
  );
}
