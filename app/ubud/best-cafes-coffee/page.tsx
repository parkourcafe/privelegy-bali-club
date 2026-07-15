import type { Metadata } from "next";
import { getUbudGuide } from "@/lib/ubud-guides";
import UbudGuideView from "@/components/UbudGuideView";

const guide = getUbudGuide("best-cafes-coffee")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/ubud/best-cafes-coffee" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/ubud/best-cafes-coffee`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <UbudGuideView guide={guide} />;
}
