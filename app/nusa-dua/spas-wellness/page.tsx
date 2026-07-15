import type { Metadata } from "next";
import { getNusaDuaGuide } from "@/lib/nusa-dua-guides";
import NusaDuaGuideView from "@/components/NusaDuaGuideView";

const guide = getNusaDuaGuide("spas-wellness")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/nusa-dua/spas-wellness" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/nusa-dua/spas-wellness`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <NusaDuaGuideView guide={guide} />;
}
