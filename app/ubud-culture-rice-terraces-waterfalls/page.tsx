import GuideArticle from "@/components/GuideArticle";
import { getGuide, guideMetadata } from "@/lib/guides";

const guide = getGuide("ubud-culture-rice-terraces-waterfalls")!;
export const metadata = guideMetadata(guide);

export default function Page() {
  return <GuideArticle guide={guide} />;
}
