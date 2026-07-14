import GuideArticle from "@/components/GuideArticle";
import { getGuide, guideMetadata } from "@/lib/guides";

const guide = getGuide("is-bali-safe")!;
export const metadata = guideMetadata(guide);

export default function Page() {
  return <GuideArticle guide={guide} />;
}
