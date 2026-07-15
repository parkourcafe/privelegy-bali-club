import type { Metadata } from "next";
import { getCangguGuide } from "@/lib/canggu-guides";
import CangguGuideView from "@/components/CangguGuideView";

const guide = getCangguGuide("work-friendly-cafes")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/canggu/work-friendly-cafes" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/canggu/work-friendly-cafes`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <CangguGuideView guide={guide} />;
}
