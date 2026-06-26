import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Bali Privilege — Canggu",
  description:
    "Plan your Bali trip, then go deep in Canggu: a curated day with real perks at hand-picked spots.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Bali Privilege", statusBarStyle: "default" },
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
