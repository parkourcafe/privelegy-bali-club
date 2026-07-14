import Link from "next/link";
import { headers } from "next/headers";
import { getInviteRoster } from "@/lib/data";
import InvitesTable, { type InviteRow } from "./InvitesTable";

export const dynamic = "force-dynamic";

// Operator: island-wide onboarding invites. One place to copy the onboarding
// link + a ready no-offer WhatsApp message (EN/RU) for every venue, or export
// the whole roster as CSV to send in bulk. Money stays out of this — launch is
// listing + owner confirmation only. Protected by ADMIN_ACCESS_TOKEN (proxy.ts).

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
}

// Reverse lead magnet copy (matches the venue-reverse-magnet skill): the pitch
// is "we already built your page" — literally true, the /onboard link is live.
// No-offer: the ask is confirm + who-you're-for + photos, never a promo.
function messageEN(venue: string, link: string): string {
  return `Hi! I'm Selena from Other Bali — a free, locals-run Bali guide. We've already built a page for ${venue} — here's exactly how travellers will see you: ${link}\nTourists never pay, and we're not asking you to run any offer. Takes ~2 min: (1) confirm it's your place, (2) tick which moments you're best for, (3) add 1-3 photos. That's it 🙌`;
}
function messageRU(venue: string, link: string): string {
  return `Здравствуйте! Это Селена, проект Other Bali — бесплатный гид по Бали, который ведут местные. Мы уже сделали страницу для ${venue} — вот как вас увидят путешественники: ${link}\nТурист ничего не платит, и мы не просим запускать акцию. Нужно ~2 минуты: (1) подтвердите, что это ваше заведение, (2) отметьте, для каких моментов вы, (3) добавьте 1-3 фото. Всё 🙌`;
}

export default async function InvitesPage() {
  const [roster, base] = await Promise.all([getInviteRoster(), baseUrl()]);

  const rows: InviteRow[] = roster.map((r) => {
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
  });

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
        and add photos. No offer is proposed — money stays off until a district
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
