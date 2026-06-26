import { headers } from "next/headers";
import QRCode from "qrcode";
import { getVenueWithPerk } from "@/lib/data";

export const dynamic = "force-dynamic";

// Printable counter poster. The printed QR is the on-premise proof anchor:
// scanning it is what lets a guest redeem, so redemptions can't happen from a
// villa. Partner needs zero app — just this sheet on the counter.

async function redeemUrl(slug: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
  return `${base}/v/${slug}/redeem`;
}

export default async function QrPosterPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue: slug } = await params;
  const venue = await getVenueWithPerk(slug);
  if (!venue) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Venue not found</h1>
      </main>
    );
  }

  const url = await redeemUrl(slug);
  const qr = await QRCode.toDataURL(url, { width: 720, margin: 1, errorCorrectionLevel: "M" });

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10 print:py-0">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm print:border-0 print:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
          Bali Privilege
        </p>
        <h1 className="mt-1 text-2xl font-bold">{venue.name}</h1>
        {venue.perk && (
          <p className="mt-2 text-sm text-stone-600">{venue.perk.title}</p>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Scan to redeem" className="mx-auto mt-6 w-64" />

        <p className="mt-6 text-lg font-semibold">Scan to claim your perk</p>
        <p className="mt-1 text-sm text-stone-500">
          Point your camera here, tap Redeem, show staff the green screen.
        </p>
        <p className="mt-6 break-all text-[10px] text-stone-300">{url}</p>
      </div>

      <p className="mt-6 text-center text-sm text-stone-500 print:hidden">
        Use your browser&apos;s Print (⌘/Ctrl-P) to print this poster.
      </p>
    </main>
  );
}
