import type { Metadata } from "next";
import { getNusaDuaGuide } from "@/lib/nusa-dua-guides";
import NusaDuaGuideView from "@/components/NusaDuaGuideView";

export const dynamic = "force-dynamic";

const guide = getNusaDuaGuide("best-restaurants")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/nusa-dua/best-restaurants" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://otherbali.com/nusa-dua/best-restaurants`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <NusaDuaGuideView guide={guide} />;
}
