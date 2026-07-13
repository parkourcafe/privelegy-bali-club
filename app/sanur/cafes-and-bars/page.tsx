import type { Metadata } from "next";
import { getSanurGuide } from "@/lib/sanur-guides";
import SanurGuideView from "@/components/SanurGuideView";

export const dynamic = "force-dynamic";

const guide = getSanurGuide("cafes-and-bars")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/sanur/cafes-and-bars" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://otherbali.com/sanur/cafes-and-bars`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <SanurGuideView guide={guide} />;
}
