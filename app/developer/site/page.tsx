import type { Metadata } from "next";
import Link from "next/link";
import Landing from "@/app/page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Restaurateur preview · Other Bali",
  robots: { index: false, follow: false, nocache: true },
};

export default function RestaurateurSitePreview() {
  return (
    <>
      <div className="fixed bottom-5 right-5 z-[60] max-w-[min(24rem,calc(100vw-2.5rem))] rounded-2xl border border-[rgba(198,154,92,0.55)] bg-[rgba(22,15,11,0.94)] px-4 py-3 text-xs text-[var(--ob-sand)] shadow-2xl backdrop-blur-md sm:text-sm">
        <strong className="block text-[var(--ob-brass-2)]">Private restaurateur preview</strong>
        <Link href="/developer/site/places" className="mt-1 block font-semibold underline underline-offset-4">
          Open the photo-complete places catalogue →
        </Link>
      </div>
      <Landing />
    </>
  );
}
