import type { Metadata } from "next";
import LightDistrictLanding from "@/components/LightDistrictLanding";
import { getLightDistrict } from "@/lib/light-districts";

const BASE = "https://www.otherbali.com";
const d = getLightDistrict("sidemen")!;

export const metadata: Metadata = {
  title: d.title,
  description: d.metaDescription,
  alternates: { canonical: "/sidemen" },
  openGraph: { title: `${d.title} · Other Bali`, description: d.metaDescription, url: `${BASE}/sidemen`, type: "article" },
  twitter: { card: "summary_large_image", title: `${d.title} · Other Bali`, description: d.metaDescription },
};

export default function Page() {
  return <LightDistrictLanding slug="sidemen" />;
}
