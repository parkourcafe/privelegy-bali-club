import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isCurrentAdminRequestAuthorized } from "@/lib/admin-request-auth";
import { EXPLICIT_REVIEW_CONFIRMATION } from "@/lib/admin-review";
import { formatMenuPrice } from "@/components/menu/menu-model";
import { isPublishableHttpsUrl, type FreshnessIssue } from "@/components/admin/freshness-model";
import { getFreshnessQueue, type AdminMenuReview } from "./data";
import { archiveAction, archiveMenu, confirmAction, publishMenu, reviewMenu } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Freshness queue · Other Bali", robots: { index: false, follow: false } };

const tone = {
  blocker: "border-red-200 bg-red-50 text-red-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-sky-200 bg-sky-50 text-sky-950",
};

export default async function FreshnessPage() {
  if (!(await isCurrentAdminRequestAuthorized())) notFound();

  const queue = await getFreshnessQueue();
  const totals = queue.issues.reduce((acc, issue) => {
    acc[issue.severity] += 1;
    return acc;
  }, { blocker: 0, warning: 0, info: 0 });
  const venueNames = new Map(queue.venues.map((venue) => [venue.slug, venue.name?.trim() || venue.slug]));
  const venueIssues = queue.issues.filter((issue) => issue.entity === "venue");

  return (
    <main className="mx-auto min-h-screen max-w-6xl bg-stone-50 px-4 py-8 text-stone-900">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">← Field Kit</Link>
      <h1 className="mt-4 text-3xl font-semibold">Freshness & publication review</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
        Compare each candidate with its official source before verification. A valid URL and complete syntax are only automated gates; they never count as a human review.
      </p>

      {!queue.configured ? (
        <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Server-side queue access is disabled. Configure <code>SUPABASE_SERVICE_ROLE_KEY</code> only in the server environment. The browser must never receive this key.
        </section>
      ) : null}
      {queue.error ? (
        <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950">
          Queue unavailable: {queue.error}. Confirm the reviewed menu/action migration has been applied in this environment.
        </section>
      ) : null}

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Queue summary">
        <Metric label="Menus" value={queue.counts.menus} />
        <Metric label="Actions" value={queue.counts.actions} />
        <Metric label="Venues" value={queue.counts.venues} />
        <Metric label="Blockers" value={totals.blocker} />
        <Metric label="Warnings" value={totals.warning} />
      </section>

      {queue.configured && !queue.error ? (
        <>
          <section className="mt-10" aria-labelledby="menu-review-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Operator gate</p>
                <h2 id="menu-review-title" className="mt-1 text-2xl font-semibold">Menu review</h2>
              </div>
              <p className="max-w-xl text-sm text-stone-600">Open the source, compare every visible section and item, then confirm. Verification records the current time and moves only a draft to review.</p>
            </div>
            <div className="mt-4 space-y-5">
              {queue.menus.length === 0 ? <EmptyState>There are no menu candidates in this environment.</EmptyState> : null}
              {queue.menus.map((menu) => (
                <MenuReviewCard
                  key={menu.id}
                  menu={menu}
                  issues={issuesFor(queue.issues, "menu", menu.id)}
                />
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="action-review-title">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">External handoffs</p>
            <h2 id="action-review-title" className="mt-1 text-2xl font-semibold">Action review</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {queue.actions.length === 0 ? <EmptyState>There are no action candidates in this environment.</EmptyState> : null}
              {queue.actions.map((action) => {
                const issues = issuesFor(queue.issues, "action", action.id);
                const hasBlocker = issues.some((issue) => issue.severity === "blocker");
                return (
                  <article key={action.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{action.kind} · {action.provider ?? "provider unknown"} · {action.status}</p>
                        <h3 className="mt-1 text-lg font-semibold">{venueNames.get(action.venue_slug) ?? action.venue_slug}</h3>
                        <p className="text-xs text-stone-500">{action.venue_slug}</p>
                      </div>
                      <IssueBadges issues={issues} />
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <EvidenceRow label="Captured" value={formatTimestamp(action.captured_at)} />
                      <EvidenceRow label="Expires" value={formatTimestamp(action.expires_at, "No expiry set")} />
                      <EvidenceRow label="Verified" value={formatTimestamp(action.verified_at, "Not verified")} />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Official source</dt>
                        <dd className="mt-1"><SafeExternalLink href={action.source_url} label={action.source_label ?? "Open source"} /></dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Destination</dt>
                        <dd className="mt-1 break-all"><SafeExternalLink href={action.url} label={action.url ?? "Missing destination"} /></dd>
                      </div>
                    </dl>
                    <IssueList issues={issues} />
                    <div className="mt-5 flex flex-wrap gap-3">
                      {action.status === "draft" || action.status === "review" ? (
                        <VerificationForm
                          action={confirmAction}
                          id={action.id}
                          label="Confirm action"
                          confirmation="I opened the official source and confirmed this destination and action type."
                          disabled={hasBlocker}
                        />
                      ) : null}
                      <SimpleActionForm action={archiveAction} id={action.id} label="Archive action" secondary />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="venue-blockers-title">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Parent records</p>
            <h2 id="venue-blockers-title" className="mt-1 text-2xl font-semibold">Venue publication blockers</h2>
            <div className="mt-4 space-y-3">
              {venueIssues.length === 0 ? <EmptyState>No parent-venue blockers found.</EmptyState> : null}
              {venueIssues.map((issue) => (
                <article key={`${issue.entityId}:${issue.code}`} className={`rounded-xl border p-4 ${tone[issue.severity]}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide">{issue.code.replaceAll("_", " ")}</p>
                  <h3 className="mt-1 font-semibold">{venueNames.get(issue.venueSlug) ?? issue.venueSlug}</h3>
                  <p className="mt-1 text-sm">{issue.message}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

function MenuReviewCard({ menu, issues }: { menu: AdminMenuReview; issues: FreshnessIssue[] }) {
  const hasBlocker = issues.some((issue) => issue.severity === "blocker");
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{menu.status} · {menu.completeness} · version {menu.version}</p>
          <h3 className="mt-1 text-xl font-semibold">{menu.venue_name}</h3>
          <p className="mt-1 font-medium">{menu.title}</p>
          <p className="mt-1 text-xs text-stone-500">Venue: {menu.venue_slug} · Menu: {menu.id}</p>
        </div>
        <IssueBadges issues={issues} />
      </div>

      <dl className="mt-5 grid gap-4 rounded-xl bg-stone-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">Official source</dt>
          <dd className="mt-1"><SafeExternalLink href={menu.source_url} label={menu.source_label ?? "Open source"} /></dd>
        </div>
        <EvidenceRow label="Captured" value={formatTimestamp(menu.captured_at)} />
        <EvidenceRow label="Expires" value={formatTimestamp(menu.expires_at, "No expiry set")} />
        <EvidenceRow label="Verified" value={formatTimestamp(menu.verified_at, "Not verified")} />
      </dl>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold">{menu.section_count ?? 0} sections</span>
        <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold">{menu.item_count ?? 0} items</span>
      </div>

      <div className="mt-4 space-y-3">
        {menu.sections.length === 0 ? <p className="rounded-lg border border-dashed border-stone-300 p-4 text-sm text-stone-500">No sections were imported.</p> : null}
        {menu.sections.map((section, sectionIndex) => (
          <details key={section.id} className="rounded-xl border border-stone-200 bg-white" open={sectionIndex === 0}>
            <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-4 px-4 py-3 font-semibold">
              <span>{section.name}</span>
              <span className="text-xs text-stone-500">{section.items.length} items</span>
            </summary>
            <div className="border-t border-stone-200 px-4 py-3">
              {section.description ? <p className="mb-3 text-sm text-stone-600">{section.description}</p> : null}
              <ul className="divide-y divide-stone-100">
                {section.items.map((item) => (
                  <li key={item.id} className="py-3 text-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <strong>{item.name}</strong>
                      <span className="font-medium">{formatMenuPrice(item.price_minor, item.currency) ?? "Price not listed"}</span>
                    </div>
                    {item.description ? <p className="mt-1 text-stone-600">{item.description}</p> : null}
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-600">
                      {item.dietary_tags.map((tag) => <span key={`diet-${tag}`} className="rounded-full bg-stone-100 px-2 py-1">{tag}</span>)}
                      {item.verified_allergen_tags.map((tag) => <span key={`allergen-${tag}`} className="rounded-full bg-red-50 px-2 py-1 text-red-900">Contains: {tag}</span>)}
                      {item.partner_recommended ? <span className="rounded-full bg-cyan-50 px-2 py-1 text-cyan-900">Venue recommended</span> : null}
                      {item.editorial_pick ? <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-900">Other Bali pick</span> : null}
                    </div>
                    {item.editorial_note ? <p className="mt-2 text-stone-700"><strong>Editorial note:</strong> {item.editorial_note}</p> : null}
                    {item.availability_note ? <p className="mt-1 text-stone-600"><strong>Availability:</strong> {item.availability_note}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      <IssueList issues={issues} />

      <div className="mt-5 flex flex-wrap items-start gap-3">
        {menu.status === "draft" ? (
          <VerificationForm
            action={reviewMenu}
            id={menu.id}
            label="Verify and move to review"
            confirmation="I opened the official source and compared every section, item, price and note shown above."
            disabled={hasBlocker}
          />
        ) : null}
        {menu.status === "review" && menu.verified_at && !hasBlocker ? <SimpleActionForm action={publishMenu} id={menu.id} label="Publish verified menu" /> : null}
        <SimpleActionForm action={archiveMenu} id={menu.id} label="Archive menu" secondary />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-stone-200 bg-white p-3"><div className="text-2xl font-semibold">{value}</div><div className="text-xs text-stone-500">{label}</div></div>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">{children}</p>;
}

function EvidenceRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</dt><dd className="mt-1">{value}</dd></div>;
}

function SafeExternalLink({ href, label }: { href: string | null; label: string }) {
  if (!isPublishableHttpsUrl(href)) return <span className="text-red-700">Invalid or missing link</span>;
  return <a href={href!} target="_blank" rel="noreferrer" className="break-all font-semibold text-cyan-800 underline underline-offset-2">{label} ↗</a>;
}

function IssueBadges({ issues }: { issues: FreshnessIssue[] }) {
  if (issues.length === 0) return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">No automated blockers</span>;
  return <div className="flex flex-wrap gap-2">{issues.map((issue) => <span key={issue.code} className={`rounded-full border px-2 py-1 text-xs font-semibold ${tone[issue.severity]}`}>{issue.code.replaceAll("_", " ")}</span>)}</div>;
}

function IssueList({ issues }: { issues: FreshnessIssue[] }) {
  if (issues.length === 0) return null;
  return <ul className="mt-4 space-y-2" aria-label="Automated checks">{issues.map((issue) => <li key={issue.code} className={`rounded-lg border p-3 text-sm ${tone[issue.severity]}`}><strong className="capitalize">{issue.severity}:</strong> {issue.message}</li>)}</ul>;
}

function issuesFor(issues: FreshnessIssue[], entity: FreshnessIssue["entity"], id: string): FreshnessIssue[] {
  return issues.filter((issue) => issue.entity === entity && issue.entityId === id);
}

function formatTimestamp(value: string | null, fallback = "Invalid or missing"): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" }).format(date);
}

function VerificationForm({ action, id, label, confirmation, disabled = false }: { action: (formData: FormData) => Promise<void>; id: string; label: string; confirmation: string; disabled?: boolean }) {
  const inputId = `verify-${id}`;
  return (
    <form action={action} className="max-w-xl rounded-xl border border-cyan-200 bg-cyan-50 p-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-cyan-950">
        <input id={inputId} type="checkbox" name="verification" value={EXPLICIT_REVIEW_CONFIRMATION} required disabled={disabled} className="mt-1 size-4 shrink-0" />
        <span>{confirmation}</span>
      </label>
      <button type="submit" disabled={disabled} className="mt-3 min-h-11 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{label}</button>
    </form>
  );
}

function SimpleActionForm({ action, id, label, secondary = false }: { action: (formData: FormData) => Promise<void>; id: string; label: string; secondary?: boolean }) {
  return <form action={action}><input type="hidden" name="id" value={id} /><button type="submit" className={`min-h-11 rounded-lg px-4 py-2 text-sm font-semibold ${secondary ? "border border-stone-400 bg-white text-stone-800" : "bg-stone-900 text-white"}`}>{label}</button></form>;
}
