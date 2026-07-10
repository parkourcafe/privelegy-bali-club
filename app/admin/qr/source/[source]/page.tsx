import { headers } from "next/headers";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

// Source poster for a villa / coliving / Reels placement. Scanning it opens the
// map with ?s=<source>, which binds the source to the guest (first-touch) so a
// later redemption can be attributed to us. Use stable tags: villa_01,
// coliving_02, reels_001, flyer_03 …

async function sourceUrl(source: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
  return `${base}/?s=${encodeURIComponent(source)}`;
}

export default async function SourceQrPage({
  params,
}: {
  params: Promise<{ source: string }>;
}) {
  const { source } = await params;
  const url = await sourceUrl(source);
  const qr = await QRCode.toDataURL(url, { width: 720, margin: 1, errorCorrectionLevel: "M" });

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10 print:py-0">
      <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm print:border-0 print:shadow-none">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
          Canggu Perks Map
        </p>
        <h1 className="mt-1 text-2xl font-bold">Your free Canggu day</h1>
        <p className="mt-2 text-sm text-stone-600">
          Hand-picked spots for the kind of day you want.
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Scan for your Canggu perks" className="mx-auto mt-6 w-64" />

        <p className="mt-6 text-lg font-semibold">Scan to open the map</p>
        <p className="mt-1 text-xs text-stone-400">source: {source}</p>
        <p className="mt-4 break-all text-[10px] text-stone-300">{url}</p>
      </div>
      <p className="mt-6 text-center text-sm text-stone-500 print:hidden">
        Place at the villa / coliving reception. Use a unique source per location
        so attribution stays clean. Print with ⌘/Ctrl-P.
      </p>
    </main>
  );
}
