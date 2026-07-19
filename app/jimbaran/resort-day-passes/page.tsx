import { getFnbPage, fnbMetadata } from "@/lib/resort-fnb";
import ResortFnbHub from "@/components/ResortFnbHub";

const page = getFnbPage("/jimbaran/resort-day-passes")!;
export const metadata = fnbMetadata(page);

export default function Page() {
  return <ResortFnbHub page={page} />;
}
