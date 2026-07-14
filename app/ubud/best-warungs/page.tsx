import type { Metadata } from "next";
import { getUbudGuide } from "@/lib/ubud-guides";
import UbudGuideView from "@/components/UbudGuideView";

export const dynamic = "force-dynamic";

const guide = getUbudGuide("best-warungs")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/ubud/best-warungs" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://otherbali.com/ubud/best-warungs`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <UbudGuideView guide={guide} />;
}
