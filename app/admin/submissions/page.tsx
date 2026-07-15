import Link from "next/link";
import { getVenueSubmissions } from "@/lib/admin-submissions";

export const dynamic = "force-dynamic";

// Operator: incoming self-submissions from the public /for-venues page. Pending
// intake only — these are NOT venues and never appear on the public app until
// an operator promotes one by hand (write your own why/best-for, then Invite).
// Protected by ADMIN_ACCESS_TOKEN (proxy.ts). Read-only for now; accept/reject
// tooling is a later slice.

function waLink(digits: string): string {
  return `https://wa.me/${digits.replace(/[^0-9]/g, "")}`;
}

function igLink(handle: string): string {
  const h = handle.trim();
  if (/^https?:\/\//i.test(h)) return h;
  return `https://instagram.com/${h.replace(/^@/, "")}`;
}

export default async function SubmissionsPage() {
  const rows = await getVenueSubmissions();
  const pending = rows.filter((r) => r.status === "needs_verification").length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-indigo-700">
        Intake · self-submissions
      </p>
      <h1 className="mt-1 text-2xl font-bold">Incoming listing requests</h1>
      <p className="mt-2 text-sm text-stone-600">
        {rows.length} total · {pending} awaiting review. These came in through
        the public <span className="font-mono">/for-venues</span> page. Nothing
        here is published — review a place, and if it&apos;s a fit, add it to the
        catalogue by hand, then send an onboarding invite.
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-stone-300 p-6 text-sm text-stone-500">
          No submissions yet (or the backend isn&apos;t reachable). Share the{" "}
          <span className="font-mono">/for-venues</span> link and they&apos;ll
          appear here.
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
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-stone-500">
                    {[r.category, r.district].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
                <span className="shrink-0 rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                  {r.status.replace(/_/g, " ")}
                </span>
              </div>

              {r.note && (
                <p className="mt-2 text-sm text-stone-700">{r.note}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {r.whatsapp && (
                  <a
                    href={waLink(r.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-600 px-2 py-1.5 font-medium text-white"
                  >
                    WhatsApp {r.whatsapp}
                  </a>
                )}
                {r.email && (
                  <a
                    href={`mailto:${r.email}`}
                    className="rounded-lg border border-stone-200 px-2 py-1.5 text-stone-700"
                  >
                    {r.email}
                  </a>
                )}
                {r.instagramUrl && (
                  <a
                    href={igLink(r.instagramUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-stone-200 px-2 py-1.5 text-stone-700"
                  >
                    Instagram
                  </a>
                )}
                {r.websiteUrl && (
                  <a
                    href={r.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-stone-200 px-2 py-1.5 text-stone-700"
                  >
                    Website
                  </a>
                )}
              </div>

              <p className="mt-2 text-[11px] text-stone-400">
                {r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
