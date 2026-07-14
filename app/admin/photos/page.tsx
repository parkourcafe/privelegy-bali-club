import type { Metadata } from "next";
import Link from "next/link";
import { PHOTO_REVIEW_CONFIRMATION } from "@/lib/photo-submission-policy";
import { approvePhoto, rejectPhoto } from "./actions";
import { getPendingPhotoReviews, type PendingPhotoReview } from "./data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Photo review · Other Bali",
  robots: { index: false, follow: false },
};

export default async function PhotoReviewPage() {
  const result = await getPendingPhotoReviews();
  const grouped = new Map<string, PendingPhotoReview[]>();
  for (const submission of result.submissions) {
    const rows = grouped.get(submission.venueSlug) ?? [];
    rows.push(submission);
    grouped.set(submission.venueSlug, rows);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-stone-50 px-4 py-8 text-stone-900">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">← Field Kit</Link>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-cyan-700">Owner media gate</p>
      <h1 className="mt-1 text-3xl font-semibold">Pending photo review</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
        Previews expire after five minutes. Approval is allowed only when this exact image has linked owner-rights consent; approved images are delivered from private storage through Other Bali.
      </p>

      {!result.configured ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">Photo review is unavailable until server-only Supabase credentials are configured.</p>
      ) : null}
      {result.error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-950">Photo queue unavailable: {result.error}</p>
      ) : null}
      {result.configured && !result.error && result.submissions.length === 0 ? (
        <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">No photos are waiting for review.</p>
      ) : null}

      <div className="mt-8 space-y-8">
        {[...grouped.entries()].map(([venueSlug, submissions]) => (
          <section key={venueSlug} aria-labelledby={`venue-${venueSlug}`}>
            <h2 id={`venue-${venueSlug}`} className="text-xl font-semibold">{submissions[0].venueName}</h2>
            <p className="text-xs text-stone-500">{venueSlug} · {submissions.length} pending</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {submissions.map((submission) => <PhotoCard key={submission.id} submission={submission} />)}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function PhotoCard({ submission }: { submission: PendingPhotoReview }) {
  const consentComplete = submission.consentGranted && submission.hasConsentLog && Boolean(submission.consentTermsVersion && submission.consentAt);
  const reviewable = consentComplete && Boolean(submission.previewUrl);
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="aspect-[4/3] bg-stone-100">
        {submission.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={submission.previewUrl} alt={`Private review submitted by ${submission.venueName}`} className="size-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex size-full items-center justify-center p-6 text-center text-sm text-stone-500">Private preview unavailable. Reload to request a new signed preview.</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${consentComplete ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
            {consentComplete ? "Consent evidence linked" : "Consent incomplete"}
          </span>
          <span className="text-xs text-stone-500">{formatDate(submission.createdAt)}</span>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <Evidence label="Submitted by" value={submission.submitterName || "Missing"} />
          <Evidence label="Contact" value={submission.submitterContact ?? "Not provided"} />
          <Evidence label="Consent time" value={formatDate(submission.consentAt)} />
          <Evidence label="Terms" value={submission.consentTermsVersion ?? "Missing"} />
        </dl>

        <form action={approvePhoto} className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <input type="hidden" name="id" value={submission.id} />
          <label className="block text-sm font-medium text-emerald-950">
            Reviewed by
            <input name="reviewedBy" required minLength={2} maxLength={120} className="mt-1 w-full rounded-lg border border-emerald-300 bg-white px-3 py-2" placeholder="Operator name" />
          </label>
          <label className="mt-3 flex items-start gap-2 text-sm text-emerald-950">
            <input type="checkbox" name="reviewConfirmation" value={PHOTO_REVIEW_CONFIRMATION} required className="mt-1 size-4 shrink-0" />
            <span>I reviewed this image and confirmed that the linked consent covers this exact submission.</span>
          </label>
          <button type="submit" disabled={!reviewable} className="mt-3 min-h-11 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Approve and publish</button>
        </form>

        <form action={rejectPhoto} className="mt-3 flex flex-wrap items-end gap-2">
          <input type="hidden" name="id" value={submission.id} />
          <label className="min-w-48 flex-1 text-sm font-medium text-stone-700">
            Reviewed by
            <input name="reviewedBy" required minLength={2} maxLength={120} className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Operator name" />
          </label>
          <button type="submit" className="min-h-11 rounded-lg border border-red-300 bg-white px-4 py-2 font-semibold text-red-800">Reject</button>
        </form>
      </div>
    </article>
  );
}

function Evidence({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</dt><dd className="mt-0.5 break-words">{value}</dd></div>;
}

function formatDate(value: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Makassar" }).format(date);
}
