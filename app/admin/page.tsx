import Link from "next/link";
import { getVenuesList } from "@/lib/data";
import { getOperatorOnboardStatus } from "@/lib/admin-operations";
import { listAttributionSources } from "@/lib/admin-attribution";
import {
  createAttributionSource,
  deactivateAttributionSource,
} from "./source-actions";

export const dynamic = "force-dynamic";

// Operator Field Kit index. The root admin layout and proxy both require the
// configured ADMIN_ACCESS_TOKEN. Aggregate/operational only, no guest PII.
export default async function AdminIndex() {
  const [venues, status, sources] = await Promise.all([
    getVenuesList(),
    getOperatorOnboardStatus(),
    listAttributionSources(),
  ]);
  const confirmed = venues.filter((v) => status[v.slug]?.confirmed).length;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Field Kit · operator
      </p>
      <h1 className="mt-1 text-2xl font-bold">Phase 0 control</h1>

      <Link
        href="/admin/freshness"
        className="mt-4 flex items-center justify-between rounded-2xl bg-amber-700 p-4 text-white"
      >
        <span className="font-semibold">→ Freshness & publication queue</span>
        <span className="text-amber-100">review</span>
      </Link>

      <Link
        href="/admin/photos"
        className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-700 p-4 text-white"
      >
        <span className="font-semibold">→ Pending photo review</span>
        <span className="text-emerald-100">rights gate</span>
      </Link>

      <Link
        href="/admin/submissions"
        className="mt-4 flex items-center justify-between rounded-2xl bg-indigo-700 p-4 text-white"
      >
        <span className="font-semibold">→ Incoming listing requests</span>
        <span className="text-indigo-100">intake</span>
      </Link>

      <Link
        href="/admin/profile-drafts"
        className="mt-4 flex items-center justify-between rounded-2xl bg-violet-700 p-4 text-white"
      >
        <span className="font-semibold">→ Owner-filled page drafts</span>
        <span className="text-violet-100">review</span>
      </Link>

      <Link
        href="/admin/phase0"
        className="mt-4 flex items-center justify-between rounded-2xl bg-cyan-700 p-4 text-white"
      >
        <span className="font-semibold">→ Money gate dashboard</span>
        <span className="text-cyan-100">v0.3</span>
      </Link>

      <Link
        href="/admin/sources"
        className="mt-4 flex items-center justify-between rounded-2xl bg-stone-800 p-4 text-white"
      >
        <span className="font-semibold">→ Source attribution</span>
        <span className="text-stone-300">by channel</span>
      </Link>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Venues ({venues.length}) · {confirmed} confirmed
      </h2>
      <ul className="mt-3 space-y-2">
        {venues.map((v) => {
          const s = status[v.slug];
          return (
          <li
            key={v.slug}
            className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-medium">{v.name}</p>
                {s?.confirmed && (
                  <span title="Confirmed listing" className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    ✓ confirmed
                  </span>
                )}
                {s?.hasPhoto && <span title="Photo uploaded">📷</span>}
                {s && !s.confirmed && s.invited && (
                  <span title="Invited, not confirmed" className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                    invited
                  </span>
                )}
              </div>
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
          );
        })}
      </ul>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-stone-500">
        Source QR (villa / coliving / Reels)
      </h2>
      <p className="mt-1 text-xs text-stone-500">
        Create an issued source before printing its QR. Unknown or inactive tags
        are rejected and never count as external attribution.
      </p>
      <form action={createAttributionSource} className="mt-3 grid gap-2 rounded-xl border border-stone-200 bg-white p-3 sm:grid-cols-3">
        <input name="id" required maxLength={64} pattern="[a-z0-9][a-z0-9_-]{0,63}" placeholder="villa_name_01" className="rounded-lg border border-stone-200 px-3 py-2 text-sm" />
        <input name="label" required minLength={2} maxLength={160} placeholder="Villa Name reception" className="rounded-lg border border-stone-200 px-3 py-2 text-sm" />
        <select name="sourceClass" defaultValue="external" className="rounded-lg border border-stone-200 px-3 py-2 text-sm">
          <option value="external">External partner</option>
          <option value="creator">Creator</option>
          <option value="in_venue">In venue</option>
        </select>
        <button className="rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white sm:col-span-3">Issue source ID</button>
      </form>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li key={source.id} className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm">
            <div>
              <p className="font-medium">{source.label}</p>
              <p className="text-xs text-stone-500">{source.id} · {source.sourceClass} · {source.active ? "active" : "inactive"}</p>
            </div>
            <div className="flex gap-2">
              {source.active && <Link href={`/admin/qr/source/${source.id}`} className="rounded-lg bg-cyan-700 px-2 py-1.5 font-medium text-white">Print QR</Link>}
              {source.active && (
                <form action={deactivateAttributionSource}>
                  <input type="hidden" name="id" value={source.id} />
                  <button className="rounded-lg border border-stone-300 px-2 py-1.5">Deactivate</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
