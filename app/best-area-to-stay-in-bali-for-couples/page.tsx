import GuideArticle from "@/components/GuideArticle";
import { getGuide, guideMetadata } from "@/lib/guides";

const guide = getGuide("best-area-to-stay-in-bali-for-couples")!;
export const metadata = guideMetadata(guide);

export default function Page() {
  return <GuideArticle guide={guide} />;
}
