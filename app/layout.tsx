import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";

// Field-test label (§6.5): neutral, district-scoped, NO "Privilege/Club/Card".
// Using the brand name on stickers would dirty the test — we'd measure reaction
// to a "club card", not willingness to redeem a perk.
export const metadata: Metadata = {
  title: "Canggu Perks Map",
  description:
    "A curated Canggu day with real perks at hand-picked local spots. Free to use.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Canggu Perks", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0e7490",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900">
        {children}
        <SourceCapture />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
