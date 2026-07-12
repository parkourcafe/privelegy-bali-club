import type { Metadata } from "next";
import { getScenario } from "@/lib/scenarios";
import ScenarioView from "@/components/ScenarioView";

const scenario = getScenario("bali-for-a-month")!;

export const metadata: Metadata = {
  title: scenario.metaTitle,
  description: scenario.metaDescription,
  alternates: { canonical: "/bali-for-a-month" },
};

export default function Page() {
  return <ScenarioView scenario={scenario} />;
}
