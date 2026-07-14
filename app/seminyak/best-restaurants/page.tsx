import type { Metadata } from "next";
import { getSeminyakGuide } from "@/lib/seminyak-guides";
import SeminyakGuideView from "@/components/SeminyakGuideView";

export const dynamic = "force-dynamic";

const guide = getSeminyakGuide("best-restaurants")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/seminyak/best-restaurants" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/seminyak/best-restaurants`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <SeminyakGuideView guide={guide} />;
}
