import { parseSafeHttpsUrl } from "./external-ordering";
import { DEFAULT_TABLEPILOT_URL } from "./tablepilot";

const PRODUCTION_ORIGIN = new URL(DEFAULT_TABLEPILOT_URL).origin;

export function safeTablePilotPublicBase(input: {
  vercelEnv?: string;
  configuredBaseUrl?: string;
}): string | null {
  const parsed = parseSafeHttpsUrl(input.configuredBaseUrl);
  if (input.vercelEnv === "preview") {
    if (!parsed || parsed.origin === PRODUCTION_ORIGIN) return null;
    return parsed.origin;
  }
  if (input.vercelEnv === "production") {
    return parsed?.origin === PRODUCTION_ORIGIN ? parsed.origin : null;
  }
  return parsed?.origin ?? null;
}
