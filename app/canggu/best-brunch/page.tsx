import type { Metadata } from "next";
import { getCangguGuide } from "@/lib/canggu-guides";
import CangguGuideView from "@/components/CangguGuideView";

export const dynamic = "force-dynamic";

const guide = getCangguGuide("best-brunch")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/canggu/best-brunch" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/canggu/best-brunch`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <CangguGuideView guide={guide} />;
}
