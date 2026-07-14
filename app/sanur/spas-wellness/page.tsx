import type { Metadata } from "next";
import { getSanurGuide } from "@/lib/sanur-guides";
import SanurGuideView from "@/components/SanurGuideView";

export const dynamic = "force-dynamic";

const guide = getSanurGuide("spas-wellness")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/sanur/spas-wellness" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/sanur/spas-wellness`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <SanurGuideView guide={guide} />;
}
