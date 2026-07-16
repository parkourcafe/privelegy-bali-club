import Link from "next/link";
import { getVenueProfileDrafts } from "@/lib/admin-submissions";

export const dynamic = "force-dynamic";

// Operator: owner self-fill profile drafts from tokenized /onboard links
// (migration 0036). Read-only queue — review the owner's words and facts,
// then apply what holds up to the venue by hand. Owner copy stays attributed
// as owner copy. Protected by ADMIN_ACCESS_TOKEN (proxy.ts).

export default async function ProfileDraftsPage() {
  const rows = await getVenueProfileDrafts();
  const pending = rows.filter((r) => r.status === "pending_review").length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-indigo-700">
        Intake · owner profiles
      </p>
      <h1 className="mt-1 text-2xl font-bold">Owner-filled page drafts</h1>
      <p className="mt-2 text-sm text-stone-600">
        {rows.length} total · {pending} awaiting review. Owners filled these in
        themselves on their private onboarding link. Nothing is published —
        review the facts, keep the editorial voice, apply what holds up, and
        mark the owner&apos;s wording as owner copy.
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-stone-300 p-6 text-sm text-stone-500">
          No profile drafts yet (or the backend isn&apos;t reachable). They
          appear here when a venue submits the &quot;Fill in your page
          yourself&quot; form on its onboarding link.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{r.venueSlug}</p>
                  <p className="text-xs text-stone-500">
                    by {r.submitterName}
                    {r.submitterRole ? ` (${r.submitterRole})` : ""} ·{" "}
                    {r.updatedAt.slice(0, 10)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    r.status === "pending_review"
                      ? "bg-amber-100 text-amber-800"
                      : r.status === "applied"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-700">
                {r.aboutText}
              </p>

              <dl className="mt-3 space-y-1 text-xs text-stone-600">
                {r.signatureItems && (
                  <div>
                    <dt className="inline font-semibold">Signature: </dt>
                    <dd className="inline">{r.signatureItems}</dd>
                  </div>
                )}
                {r.openingHours && (
                  <div>
                    <dt className="inline font-semibold">Hours: </dt>
                    <dd className="inline">{r.openingHours}</dd>
                  </div>
                )}
                {r.priceRange && (
                  <div>
                    <dt className="inline font-semibold">Price: </dt>
                    <dd className="inline">{r.priceRange}</dd>
                  </div>
                )}
                {r.publishNotes && (
                  <div>
                    <dt className="inline font-semibold">Notes: </dt>
                    <dd className="inline">{r.publishNotes}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <a
                  href={r.gmapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-stone-100 px-2 py-1.5 font-medium text-stone-700"
                >
                  Google Maps
                </a>
                {r.instagramUrl && (
                  <a
                    href={r.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-stone-100 px-2 py-1.5 font-medium text-stone-700"
                  >
                    Instagram
                  </a>
                )}
                {r.websiteUrl && (
                  <a
                    href={r.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-stone-100 px-2 py-1.5 font-medium text-stone-700"
                  >
                    Website
                  </a>
                )}
                {r.videoUrl && (
                  <a
                    href={r.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-stone-100 px-2 py-1.5 font-medium text-stone-700"
                  >
                    Video
                  </a>
                )}
                <Link
                  href={`/admin/invite/${r.venueSlug}`}
                  className="rounded-lg bg-emerald-600 px-2 py-1.5 font-medium text-white"
                >
                  Open venue
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
