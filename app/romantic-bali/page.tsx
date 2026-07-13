import { getScenario, scenarioMetadata } from "@/lib/scenarios";
import ScenarioView from "@/components/ScenarioView";

const scenario = getScenario("romantic-bali")!;

export const metadata = scenarioMetadata(scenario);

export default function Page() {
  return <ScenarioView scenario={scenario} />;
}
