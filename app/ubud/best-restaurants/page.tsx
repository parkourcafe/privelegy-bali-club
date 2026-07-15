import type { Metadata } from "next";
import { getUbudGuide } from "@/lib/ubud-guides";
import UbudGuideView from "@/components/UbudGuideView";

const guide = getUbudGuide("best-restaurants")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/ubud/best-restaurants" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/ubud/best-restaurants`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <UbudGuideView guide={guide} />;
}
