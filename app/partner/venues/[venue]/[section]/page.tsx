import Link from "next/link";
import { redirect } from "next/navigation";
import { getPartnerVenue } from "@/lib/partner-context";
import MenuDraftForm from "./MenuDraftForm";
import ActionDraftForm from "./ActionDraftForm";
import PhotoReviewPanel from "./PhotoReviewPanel";
import BookingsPanel from "./BookingsPanel";

export const dynamic = "force-dynamic";

const SECTION_COPY: Record<string, { title: string; body: string }> = {
  menu: { title: "Menu", body: "The authenticated menu editor will create a new draft version and leave the current published version untouched until operator review." },
  actions: { title: "Actions", body: "Action links are validated, tested and reviewed before they can become public. Other Bali never claims to fulfil a delivery or reservation itself." },
  photos: { title: "Photos", body: "Photo candidates remain separate from menu and action approval. Exact-image rights and owner confirmation are recorded independently." },
  bookings: { title: "Bookings", body: "Reservation operations stay in TablePilot. This workspace will show aggregate Other Bali attribution and a safe link to the TablePilot staff dashboard." },
  analytics: { title: "Analytics", body: "Partner reporting is aggregate only: reach, intent, reservations and seated outcomes. Guest names and phone numbers never leave the fulfilment system." },
  approvals: { title: "Approvals", body: "Operator review, publication and owner confirmation are separate states. An owner correction creates a draft; it does not silently change the public page." },
};

export default async function PartnerSectionPage({
  params,
}: {
  params: Promise<{ venue: string; section: string }>;
}) {
  const { venue: slug, section } = await params;
  const membership = await getPartnerVenue(slug);
  if (!membership) redirect("/partner/sign-in");
  const copy = SECTION_COPY[section];
  if (!copy) redirect(`/partner/venues/${slug}`);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <Link href={`/partner/venues/${slug}`} className="text-sm font-medium text-cyan-800 underline">← {membership.name}</Link>
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-cyan-700">Partner workspace</p>
      <h1 className="mt-1 text-3xl font-bold text-stone-900">{copy.title}</h1>
      <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">{copy.body}</p>
      <p className="mt-4 text-sm text-stone-500">Production availability depends on the reviewed Auth/RLS migration and server credentials; partner submissions remain draft-only.</p>
      {section === "menu" && <MenuDraftForm venueSlug={slug} />}
      {section === "actions" && <ActionDraftForm venueSlug={slug} />}
      {section === "photos" && <PhotoReviewPanel venueSlug={slug} />}
      {section === "bookings" && <BookingsPanel venueSlug={slug} />}
    </main>
  );
}
