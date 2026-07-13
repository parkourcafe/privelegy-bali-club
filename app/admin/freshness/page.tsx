import type { Metadata } from "next";
import Link from "next/link";
import { getFreshnessQueue } from "./data";
import { archiveAction, archiveMenu, confirmAction, publishMenu, reviewMenu } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Freshness queue · Other Bali", robots: { index: false, follow: false } };

const tone = { blocker: "border-red-200 bg-red-50 text-red-950", warning: "border-amber-200 bg-amber-50 text-amber-950", info: "border-sky-200 bg-sky-50 text-sky-950" };

export default async function FreshnessPage() {
  const queue = await getFreshnessQueue();
  const totals = queue.issues.reduce((acc, issue) => { acc[issue.severity] += 1; return acc; }, { blocker: 0, warning: 0, info: 0 });
  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-stone-50 px-4 py-8 text-stone-900">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">← Field Kit</Link>
      <h1 className="mt-4 text-3xl font-semibold">Freshness & publication queue</h1>
      <p className="mt-2 max-w-3xl text-sm text-stone-600">Read-only operator report. Draft and stale records stay auditable; nothing on this page deletes or publishes data.</p>
      {!queue.configured ? <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">Server-side queue access is disabled. Configure <code>SUPABASE_SERVICE_ROLE_KEY</code> only in the server environment. The browser must never receive this key.</section> : null}
      {queue.error ? <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950">Queue unavailable: {queue.error}. Confirm the Session 1 migration has been reviewed and applied in this environment.</section> : null}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Metric label="Menus" value={queue.counts.menus} /><Metric label="Actions" value={queue.counts.actions} /><Metric label="Venues" value={queue.counts.venues} /><Metric label="Blockers" value={totals.blocker} /><Metric label="Warnings" value={totals.warning} />
      </section>
      <section className="mt-6 space-y-3" aria-label="Freshness issues">
        {queue.configured && !queue.error && queue.issues.length === 0 ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">No freshness or publication issues found.</p> : null}
        {queue.issues.map((issue) => <article key={`${issue.entity}:${issue.entityId}:${issue.code}`} className={`rounded-xl border p-4 ${tone[issue.severity]}`}><div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide"><span>{issue.severity}</span><span>·</span><span>{issue.code.replaceAll("_", " ")}</span></div><h2 className="mt-1 font-semibold">{issue.venueSlug}</h2><p className="mt-1 text-sm">{issue.message}</p><p className="mt-2 text-xs opacity-70">{issue.entity} · {issue.entityId}</p>{issue.entity !== "venue" ? <div className="mt-3 flex flex-wrap gap-2">{issue.code === "menu_needs_review" ? <><ActionForm action={reviewMenu} id={issue.entityId} label="Evidence checked · review" /><ActionForm action={publishMenu} id={issue.entityId} label="Publish reviewed menu" /></> : null}{issue.code === "unconfirmed_action" ? <ActionForm action={confirmAction} id={issue.entityId} label="Evidence checked · confirm" /> : null}<ActionForm action={issue.entity === "menu" ? archiveMenu : archiveAction} id={issue.entityId} label="Archive" secondary /></div> : null}</article>)}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-stone-200 bg-white p-3"><div className="text-2xl font-semibold">{value}</div><div className="text-xs text-stone-500">{label}</div></div>;
}

function ActionForm({ action, id, label, secondary = false }: { action: (formData: FormData) => Promise<void>; id: string; label: string; secondary?: boolean }) {
  return <form action={action}><input type="hidden" name="id" value={id} /><button type="submit" className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold ${secondary ? "border border-current bg-white/50" : "bg-stone-900 text-white"}`}>{label}</button></form>;
}
