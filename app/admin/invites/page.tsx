import Link from "next/link";
import { getInviteRoster } from "@/lib/admin-invites";
import { currentSiteOrigin } from "@/lib/site-origin";
import InvitesTable, { type InviteRow } from "./InvitesTable";

export const dynamic = "force-dynamic";

// Operator: island-wide onboarding invites. One place to copy the onboarding
// link + a ready no-offer WhatsApp message (EN/RU) for every venue, or export
// the whole roster as CSV to send in bulk. Money stays out of this — launch is
// listing + owner confirmation only. Protected by ADMIN_ACCESS_TOKEN (proxy.ts).

// No-offer launch templates (matches the launch dashboard WhatsApp copy).
function messageEN(venue: string, link: string): string {
  return `Hi! I'm Selena from Other Bali — a free, resident-curated Bali guide. We're preparing a listing for ${venue}. Tourists don't pay, and we're not asking you to run an offer. Please confirm your listing and add 1-3 photos here: ${link}\nConfirmed venues show as owner-confirmed; offers only appear later, if you choose to activate them.`;
}
function messageRU(venue: string, link: string): string {
  return `Здравствуйте! Меня зовут Селена, проект Other Bali — бесплатный гид по Бали, который ведут местные. Мы готовим страницу для ${venue}. Туристы не платят, и мы не просим запускать акцию. Пожалуйста, подтвердите листинг и добавьте 1-3 фото здесь: ${link}\nПодтверждённые заведения помечаются как проверенные владельцем; акции появляются позже — только если вы сами захотите.`;
}

export default async function InvitesPage() {
  const [roster, base] = await Promise.all([getInviteRoster(), currentSiteOrigin()]);

  const rows: InviteRow[] = base ? roster.map((r) => {
    const link = `${base}/onboard/${r.token}`;
    return {
      slug: r.slug,
      name: r.name,
      district: r.district,
      status: r.status,
      confirmed: r.confirmed,
      hasPhoto: r.hasPhoto,
      whatsapp: r.whatsapp,
      link,
      waEN: messageEN(r.name, link),
      waRU: messageRU(r.name, link),
    };
  }) : [];

  const confirmed = rows.filter((r) => r.confirmed).length;
  const withWa = rows.filter((r) => r.whatsapp).length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-stone-500 hover:underline">
        ← Field Kit
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-cyan-700">
        Owner onboarding · island-wide
      </p>
      <h1 className="mt-1 text-2xl font-bold">Invites</h1>
      <p className="mt-2 text-sm text-stone-600">
        {rows.length} venues · {confirmed} confirmed · {withWa} with a WhatsApp
        number. Send owners their onboarding link so they confirm the listing
        and submit licensed photos for review. No offer is proposed — money stays off until a district
        is unlocked.
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-stone-300 p-6 text-sm text-stone-500">
          No venues in the database yet (or backend not reachable). Import the
          launch roster first, then reload.
        </p>
      ) : (
        <InvitesTable rows={rows} />
      )}
    </main>
  );
}
