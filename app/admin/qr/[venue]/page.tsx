import QRCode from "qrcode";
import { getVenueWithPerk } from "@/lib/data";
import { requireAdminRequest } from "@/lib/admin-request-auth";
import { createRedemptionToken } from "@/lib/redemption-token";
import { currentSiteOrigin } from "@/lib/site-origin";

export const dynamic = "force-dynamic";

// Printable counter poster. The printed QR is the on-premise proof anchor:
// scanning it is what lets a guest redeem, so redemptions can't happen from a
// villa. Partner needs zero app — just this sheet on the counter.

function redeemUrl(slug: string, token: string, base: string): string {
  const url = new URL(`/v/${encodeURIComponent(slug)}/redeem`, base);
  url.searchParams.set("t", token);
  return url.toString();
}

export default async function QrPosterPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  await requireAdminRequest();
  const { venue: slug } = await params;
  const venue = await getVenueWithPerk(slug);
  const base = await currentSiteOrigin();
  const token = base
    ? createRedemptionToken(slug, process.env.REDEMPTION_SIGNING_SECRET, base)
    : null;
  if (!venue || venue.district !== "canggu" || !venue.perk || !token || !base) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Redemption QR unavailable</h1>
        <p className="mt-2 text-sm text-stone-500">
          This requires a published Canggu venue, a confirmed offer, and the server-side redemption signing secret.
        </p>
      </main>
    );
  }

  const url = redeemUrl(slug, token, base);
  const qr = await QRCode.toDataURL(url, { width: 720, margin: 1, errorCorrectionLevel: "M" });

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10 print:py-0">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm print:border-0 print:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
          Other Bali
        </p>
        <h1 className="mt-1 text-2xl font-bold">{venue.name}</h1>
        <p className="mt-2 text-sm text-stone-600">{venue.perk.title}</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qr}
          alt="Scan to redeem"
          className="mx-auto mt-6 w-64"
        />

        <p className="mt-6 text-lg font-semibold">Scan to claim your offer</p>
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
