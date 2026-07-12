import type { Metadata } from "next";
import { getScenario } from "@/lib/scenarios";
import ScenarioView from "@/components/ScenarioView";

const scenario = getScenario("romantic-bali")!;

export const metadata: Metadata = {
  title: scenario.metaTitle,
  description: scenario.metaDescription,
  alternates: { canonical: "/romantic-bali" },
};

export default function Page() {
  return <ScenarioView scenario={scenario} />;
}
