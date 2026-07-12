import type { Metadata } from "next";
import { getScenario } from "@/lib/scenarios";
import ScenarioView from "@/components/ScenarioView";

const scenario = getScenario("bali-retreat-reset")!;

export const metadata: Metadata = {
  title: scenario.metaTitle,
  description: scenario.metaDescription,
  alternates: { canonical: "/bali-retreat-reset" },
};

export default function Page() {
  return <ScenarioView scenario={scenario} />;
}
