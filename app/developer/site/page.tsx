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
      <div className="fixed inset-x-0 top-0 z-[100] border-b border-[rgba(198,154,92,0.45)] bg-[rgba(22,15,11,0.96)] px-4 py-2 text-center text-xs text-[var(--ob-sand)] backdrop-blur-md sm:text-sm">
        <strong className="text-[var(--ob-brass-2)]">Private restaurateur preview.</strong>{" "}
        This is the current production design.{" "}
        <Link href="/developer/site/places" className="font-semibold underline underline-offset-4">
          Open the photo-complete places catalogue →
        </Link>
      </div>
      <Landing />
    </>
  );
}
