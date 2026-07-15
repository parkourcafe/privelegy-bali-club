import type { Metadata } from "next";
import { getSeminyakGuide } from "@/lib/seminyak-guides";
import SeminyakGuideView from "@/components/SeminyakGuideView";

const guide = getSeminyakGuide("beach-clubs-sunset")!;

export const metadata: Metadata = {
  title: guide.metaTitle,
  description: guide.metaDescription,
  alternates: { canonical: "/seminyak/beach-clubs-sunset" },
  openGraph: {
    title: `${guide.h1} · Other Bali`,
    description: guide.metaDescription,
    url: `https://www.otherbali.com/seminyak/beach-clubs-sunset`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: `${guide.h1} · Other Bali`, description: guide.metaDescription },
};

export default function Page() {
  return <SeminyakGuideView guide={guide} />;
}
