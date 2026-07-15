import Link from "next/link";
import { redirect } from "next/navigation";
import { getPartnerVenue } from "@/lib/partner-context";

export const dynamic = "force-dynamic";

export default async function PartnerVenueWorkspacePage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue: slug } = await params;
  const membership = await getPartnerVenue(slug);
  if (!membership) {
    // A missing session and a venue outside the membership both fail closed.
    redirect("/partner/sign-in");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link href="/partner" className="text-sm font-medium text-cyan-800 underline">← All venues</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Partner workspace</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">{membership.name}</h1>
          <p className="mt-1 text-sm text-stone-500">{membership.address}</p>
        </div>
        <Link href={`/places/${membership.venueSlug}`} target="_blank" rel="noreferrer" className="rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700">Open public preview ↗</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WorkspaceCard title="Menu" body="Review menu source, sections, items and prices." href={`/partner/venues/${slug}/menu`} />
        <WorkspaceCard title="Actions" body="Maintain verified Reserve, Delivery, Takeaway and WhatsApp handoffs." href={`/partner/venues/${slug}/actions`} />
        <WorkspaceCard title="Photos" body="Review photo candidates and rights/consent status." href={`/partner/venues/${slug}/photos`} />
        <WorkspaceCard title="Bookings" body="See Other Bali aggregate attribution and open TablePilot staff operations." href={`/partner/venues/${slug}/bookings`} />
        <WorkspaceCard title="Analytics" body="See aggregate reach, intent and seated-visit reporting." href={`/partner/venues/${slug}/analytics`} />
        <WorkspaceCard title="Approvals" body="See operator review, publication and owner confirmation separately." href={`/partner/venues/${slug}/approvals`} />
      </div>
    </main>
  );
}

function WorkspaceCard({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-cyan-400">
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{body}</p>
      <p className="mt-4 text-sm font-semibold text-cyan-800">Open →</p>
    </Link>
  );
}
