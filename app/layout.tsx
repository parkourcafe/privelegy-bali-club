import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";

// Public launch label: Other Bali is the tourist-facing brand. "Bali Privilege"
// remains internal/technical only.
export const metadata: Metadata = {
  title: "Other Bali",
  description:
    "The right place for the moment you're in. Curated Canggu places, routes, and confirmed venue offers where available.",
  manifest: "/manifest.webmanifest?v=4",
  appleWebApp: { capable: true, title: "Other Bali", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#005962",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <SourceCapture />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
