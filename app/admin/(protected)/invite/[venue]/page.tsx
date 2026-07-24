import Link from "next/link";
import { getInviteRoster } from "@/lib/admin-invites";
import { currentSiteOrigin } from "@/lib/site-origin";

export const dynamic = "force-dynamic";

// Operator: mint/show the onboarding invite for a venue, with a ready-to-send
// WhatsApp message. The data call re-checks admin auth and uses service role.

export default async function InvitePage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue: slug } = await params;
  const venue = (await getInviteRoster()).find((row) => row.slug === slug);
  if (!venue) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Venue not found</h1>
      </main>
    );
  }

  const token = venue.token || null;
  const base = await currentSiteOrigin();
  const link = token && base ? `${base}/onboard/${token}` : null;

  const waText = link
    ? `Hi! This is Other Bali — the curated Bali guide we talked about. Here's your listing preview: ${link}\nPlease check your card, submit any photos you have the right to share for our review, and tap Confirm. Takes 2 minutes. No setup fee during the pilot.`
    : "";

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Partner invite
      </p>
      <h1 className="mt-1 text-2xl font-bold">{venue.name}</h1>

      {!link ? (
        <p className="mt-6 text-sm text-rose-600">
          Couldn&apos;t create the invite link — backend not reachable.
        </p>
      ) : (
        <>
          <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Invite link
            </p>
            <p className="mt-2 break-all font-mono text-sm text-stone-800">{link}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Ready-to-send WhatsApp message
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">{waText}</p>
            <a
              href={`https://wa.me/${venue.whatsapp ?? ""}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              {venue.whatsapp ? "Send via WhatsApp" : "Open WhatsApp (pick contact)"}
            </a>
          </div>

          <p className="mt-4 text-xs text-stone-400">
            The venue will see its card preview, the listing policy, a private
            photo-review submission and a Confirm button. Listing confirmation
            and per-image photo consent are recorded separately.
          </p>
        </>
      )}
    </main>
  );
}
