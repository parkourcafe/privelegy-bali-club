import type { Metadata } from "next";
import { getJimbaranGuide } from "@/lib/jimbaran-guides";
import JimbaranGuideView from "@/components/JimbaranGuideView";

export const dynamic = "force-dynamic";

const guide = getJimbaranGuide("best-restaurants")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/jimbaran/best-restaurants" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/jimbaran/best-restaurants`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <JimbaranGuideView guide={guide} />;
}
