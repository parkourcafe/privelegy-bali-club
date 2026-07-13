import type { Metadata } from "next";
import { getSeminyakGuide } from "@/lib/seminyak-guides";
import SeminyakGuideView from "@/components/SeminyakGuideView";

export const dynamic = "force-dynamic";

const guide = getSeminyakGuide("spas-salons-wellness")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/seminyak/spas-salons-wellness" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://otherbali.com/seminyak/spas-salons-wellness`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <SeminyakGuideView guide={guide} />;
}
