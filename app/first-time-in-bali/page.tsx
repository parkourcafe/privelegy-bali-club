import type { Metadata } from "next";
import { getScenario } from "@/lib/scenarios";
import ScenarioView from "@/components/ScenarioView";

const scenario = getScenario("first-time-in-bali")!;

export const metadata: Metadata = {
  title: scenario.metaTitle,
  description: scenario.metaDescription,
  alternates: { canonical: "/first-time-in-bali" },
};

export default function Page() {
  return <ScenarioView scenario={scenario} />;
}
